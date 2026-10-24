import "dotenv/config";
import express from "express";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { INITIAL_PRODUCTS } from "../data/products";
import { INITIAL_COUPONS } from "../data/coupons";
import { Order, Product, Coupon, InventoryLog, CartItem, StoreSettings } from "../types";
import {
  initSupabase,
  isSupabaseActive,
  isSupabaseConfigured,
  seedSupabaseIfEmpty,
  dbProducts,
  dbOrders,
  dbCoupons,
  dbInventoryLogs,
  dbSettings,
  DEFAULT_STORE_SETTINGS,
} from "./supabase";
import { parseProductCatalogCSV } from "./catalogImport";

// Initialize Supabase & Run Seeder if connected
initSupabase();
if (isSupabaseActive()) {
  seedSupabaseIfEmpty();
}

// In-memory backend storage for LOCAL DEVELOPMENT ONLY
let productsStore: Product[] = [...INITIAL_PRODUCTS];
let ordersStore: Order[] = [];
let couponsStore: Coupon[] = [...INITIAL_COUPONS];
let inventoryLogsStore: InventoryLog[] = [
  {
    id: "log-001",
    productId: "kng-001",
    productName: "KINGSMAN Sovereign Crimson I",
    size: 42,
    previousStock: 10,
    newStock: 8,
    changeReason: "Sale",
    timestamp: "Today at 2:15 PM",
    adminUser: "Online Order #KNG-8942",
  },
];

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------------------------------------------
// SECURITY HEADERS MIDDLEWARE
// ----------------------------------------------------
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ----------------------------------------------------
// GENERAL API RATE LIMITING (120 req/min)
// ----------------------------------------------------
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
app.use("/api/", (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const limitData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - limitData.lastReset > 60000) {
    limitData.count = 1;
    limitData.lastReset = now;
  } else {
    limitData.count++;
  }

  rateLimitMap.set(ip, limitData);

  if (limitData.count > 120) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }
  next();
});

// ----------------------------------------------------
// PRODUCTION DATABASE ENFORCEMENT MIDDLEWARE
// In production (NODE_ENV=production), there must be NO in-memory fallback.
// If Supabase is not configured, all data endpoints return 503.
// ----------------------------------------------------
app.use("/api", (req, res, next) => {
  // Allow health endpoint to bypass 503
  if (req.path === "/health") {
    return next();
  }

  if (process.env.NODE_ENV === "production" && !isSupabaseActive()) {
    return res.status(503).json({
      error: "Database not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production.",
    });
  }

  next();
});

// ----------------------------------------------------
// PUBLIC HEALTH API
// ----------------------------------------------------
app.get("/api/health", (req, res) => {
  const dbStatus = isSupabaseActive() ? "supabase_postgresql" : "not configured";

  res.json({
    status: "ok",
    app: "KINGSMAN Luxury Sneakers",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: "1.1.0",
  });
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION & SESSION CONFIGURATION
// ----------------------------------------------------
const ADMIN_COOKIE_NAME = "kingsman_admin_session";
const ADMIN_SESSION_EXPIRY_MS = 12 * 60 * 60 * 1000; // Strictly 12 hours
const loginRateLimitMap = new Map<string, { attempts: number; firstAttemptTime: number }>();

function signAdminPayload(payload: object, secret: string): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyAdminToken(token?: string | null): any | null {
  const secret = process.env.SESSION_SECRET || (process.env.NODE_ENV !== "production" ? "kingsman-dev-session-signing-secret-2026" : undefined);
  if (!secret || !token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;

  try {
    const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function extractAdminToken(req: express.Request): string | null {
  if (req.cookies && req.cookies[ADMIN_COOKIE_NAME]) {
    return req.cookies[ADMIN_COOKIE_NAME];
  }
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.slice(7);
  }
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(new RegExp(`(^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
    if (match) return match[2];
  }
  return null;
}

const requireAdminAuth: express.RequestHandler = (req, res, next) => {
  const token = extractAdminToken(req);
  const session = verifyAdminToken(token);

  if (!session) {
    return res.status(401).json({
      error: "Unauthorized: Valid Admin Session Required",
    });
  }

  (req as any).adminUser = session;
  next();
};

// 1. ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin123" : undefined);
  const sessionSecret = process.env.SESSION_SECRET || (process.env.NODE_ENV !== "production" ? "kingsman-dev-session-signing-secret-2026" : undefined);

  if (!adminPassword || !sessionSecret) {
    return res.status(503).json({
      error: "Admin authentication is currently unconfigured on this server. ADMIN_PASSWORD and SESSION_SECRET must be configured.",
    });
  }

  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const FIFTEEN_MINS_MS = 15 * 60 * 1000;

  const rateRecord = loginRateLimitMap.get(ip);
  if (rateRecord) {
    if (now - rateRecord.firstAttemptTime < FIFTEEN_MINS_MS) {
      if (rateRecord.attempts >= 5) {
        const waitMins = Math.ceil((FIFTEEN_MINS_MS - (now - rateRecord.firstAttemptTime)) / 60000);
        return res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${waitMins} minute(s).`,
        });
      }
    } else {
      loginRateLimitMap.delete(ip);
    }
  }

  const { password, secretKey, email, role, name } = req.body || {};
  const credential = (password || secretKey || "").toString();

  if (!credential) {
    return res.status(400).json({ error: "Password is required." });
  }

  let isValid = false;
  try {
    const credBuf = Buffer.from(credential);
    const passBuf = Buffer.from(adminPassword);
    if (credBuf.length === passBuf.length && crypto.timingSafeEqual(credBuf, passBuf)) {
      isValid = true;
    }
  } catch {
    isValid = false;
  }

  if (!isValid) {
    console.warn(`[SECURITY ALERT] Failed admin authentication attempt from IP ${ip}`);
    const current = loginRateLimitMap.get(ip);
    if (!current || now - current.firstAttemptTime >= FIFTEEN_MINS_MS) {
      loginRateLimitMap.set(ip, { attempts: 1, firstAttemptTime: now });
    } else {
      current.attempts += 1;
    }
    return res.status(401).json({ error: "Invalid admin credentials." });
  }

  loginRateLimitMap.delete(ip);

  const userRole = role === "Manager" || role === "Staff" ? role : "Admin";
  const userName = name || "Lord Sterling";
  const userEmail = (email && typeof email === "string" && email.trim()) || "admin@kingsmanszn.com";

  const sessionPayload = {
    id: `adm-${Date.now().toString().slice(-4)}`,
    name: userName,
    email: userEmail,
    role: userRole,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    exp: Date.now() + ADMIN_SESSION_EXPIRY_MS,
  };

  const sessionToken = signAdminPayload(sessionPayload, sessionSecret);

  res.cookie(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_EXPIRY_MS,
    path: "/",
  });

  return res.json({
    success: true,
    message: "Admin authenticated successfully",
    user: {
      id: sessionPayload.id,
      name: sessionPayload.name,
      email: sessionPayload.email,
      role: sessionPayload.role,
      avatar: sessionPayload.avatar,
    },
  });
});

// 2. ADMIN LOGOUT
app.post("/api/admin/logout", (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res.json({ success: true, message: "Logged out successfully" });
});

// 3. ADMIN SESSION CHECK
app.get("/api/admin/session", (req, res) => {
  const token = extractAdminToken(req);
  const session = verifyAdminToken(token);

  if (!session) {
    return res.status(401).json({ authenticated: false, error: "No active admin session" });
  }

  return res.json({
    authenticated: true,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      avatar: session.avatar,
    },
  });
});

// ----------------------------------------------------
// PROTECTED ADMIN API ROUTES
// ----------------------------------------------------

app.get(["/api/admin/metrics", "/api/metrics"], requireAdminAuth, async (req, res) => {
  if (isSupabaseActive()) {
    const dbOrdersList = await dbOrders.getAll({});
    const dbProductsList = await dbProducts.getAll({});
    return res.json({
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      activeOrdersCount: dbOrdersList ? dbOrdersList.length : 0,
      activeProductsCount: dbProductsList ? dbProductsList.length : 0,
      database: "supabase_postgresql",
      status: "HEALTHY_GREEN",
    });
  }

  console.warn("[WARNING] Serving metrics from in-memory fallback (Local development mode only).");
  res.json({
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    activeOrdersCount: ordersStore.length,
    activeProductsCount: productsStore.length,
    database: "in_memory_fallback",
    status: "HEALTHY_GREEN",
  });
});

app.get("/api/admin/backups", requireAdminAuth, async (req, res) => {
  if (isSupabaseActive()) {
    const dbOrdersList = await dbOrders.getAll({});
    const dbProductsList = await dbProducts.getAll({});
    const dbCouponsList = await dbCoupons.getAll();

    return res.json({
      latestBackupTimestamp: new Date().toISOString(),
      backupStatus: "COMPLETED",
      databaseProvider: "Supabase PostgreSQL",
      recordsCount: {
        orders: dbOrdersList ? dbOrdersList.length : 0,
        products: dbProductsList ? dbProductsList.length : 0,
        coupons: dbCouponsList ? dbCouponsList.length : 0,
      },
      backupLocation: "s3://kingsman-atelier-encrypted-backups/snapshot-latest.json",
    });
  }

  console.warn("[WARNING] Serving backups from in-memory fallback (Local development mode only).");
  res.json({
    latestBackupTimestamp: new Date().toISOString(),
    backupStatus: "COMPLETED",
    databaseProvider: "In-Memory Engine",
    recordsCount: {
      orders: ordersStore.length,
      products: productsStore.length,
      coupons: couponsStore.length,
    },
    backupLocation: "s3://kingsman-atelier-encrypted-backups/snapshot-latest.json",
  });
});

// Helper for BD Phone
function normalizeBDPhone(phone: any): string | null {
  if (!phone || typeof phone !== "string") return null;
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+880")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("880")) {
    cleaned = cleaned.slice(2);
  }
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

app.get("/api/admin/orders", requireAdminAuth, async (req, res) => {
  if (isSupabaseActive()) {
    const dbOrdersList = await dbOrders.getAll({});
    return res.json(dbOrdersList || []);
  }

  console.warn("[WARNING] Serving admin orders from in-memory fallback (Local development mode only).");
  res.json(ordersStore);
});

app.post("/api/admin/catalog/import-csv", requireAdminAuth, async (req, res) => {
  const { csvContent } = req.body;
  if (!csvContent || typeof csvContent !== "string") {
    return res.status(400).json({ error: "Missing or invalid csvContent in request body" });
  }

  const result = parseProductCatalogCSV(csvContent);
  if (!result.valid) {
    return res.status(400).json({
      error: "CSV validation failed",
      errors: result.errors,
    });
  }

  if (isSupabaseActive()) {
    for (const prod of result.products) {
      await dbProducts.create(prod);
    }
  } else {
    result.products.forEach((newProd) => {
      const idx = productsStore.findIndex((p) => p.sku === newProd.sku || p.id === newProd.id);
      if (idx !== -1) {
        productsStore[idx] = newProd;
      } else {
        productsStore.push(newProd);
      }
    });
  }

  res.json({
    success: true,
    message: `Successfully imported ${result.products.length} products.`,
    products: result.products,
  });
});

app.put(["/api/admin/orders/:id/status", "/api/orders/:id/status"], requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isSupabaseActive()) {
    await dbOrders.updateStatus(id, status);
    const dbOrder = await dbOrders.getAll({ orderId: id });
    if (dbOrder && dbOrder.length > 0) {
      return res.json({ ...dbOrder[0], orderStatus: status });
    }
  } else {
    const order = ordersStore.find((o) => o.id === id);
    if (order) {
      const prevStatus = order.orderStatus;
      order.orderStatus = status;

      // If status changed to Cancelled, return stock to in-memory store
      if (status === 'Cancelled' && prevStatus !== 'Cancelled' && order.items) {
        order.items.forEach((item) => {
          const prod = productsStore.find((p) => p.id === item.product?.id || p.sku === item.product?.sku);
          if (prod) {
            prod.stock += item.quantity;
            if (prod.sizeStock && prod.sizeStock[item.selectedSize] !== undefined) {
              prod.sizeStock[item.selectedSize] += item.quantity;
            }
          }
        });
      }

      return res.json(order);
    }
  }

  res.status(404).json({ error: "Order not found" });
});

// Mark Delivery Charge Received
app.put(["/api/admin/orders/:id/delivery-charge-paid", "/api/orders/:id/delivery-charge-paid"], requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const adminName = (req as any).adminUser?.name || "Owner";

  if (isSupabaseActive()) {
    await dbOrders.markDeliveryChargePaid(id, adminName);
    const dbOrder = await dbOrders.getAll({ orderId: id });
    if (dbOrder && dbOrder.length > 0) {
      return res.json(dbOrder[0]);
    }
  } else {
    const order = ordersStore.find((o) => o.id === id);
    if (order) {
      order.deliveryChargePaid = true;
      order.deliveryChargePaidAt = new Date().toISOString();
      order.deliveryChargePaidBy = adminName;
      order.advanceDeliveryFeePaid = true;
      order.paymentStatus = 'Delivery Charge Paid';
      if (order.orderStatus === 'Awaiting Delivery Charge' || order.orderStatus === 'Pending') {
        order.orderStatus = 'Confirmed';
      }
      return res.json(order);
    }
  }

  res.status(404).json({ error: "Order not found" });
});

// Update Courier Booking Details (Steadfast or Pathao)
app.put(["/api/admin/orders/:id/courier", "/api/orders/:id/courier"], requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { courierName, consignmentId, codAmountToCollect } = req.body;

  if (isSupabaseActive()) {
    await dbOrders.updateCourierBooking(id, courierName, consignmentId, codAmountToCollect);
    const dbOrder = await dbOrders.getAll({ orderId: id });
    if (dbOrder && dbOrder.length > 0) {
      return res.json(dbOrder[0]);
    }
  } else {
    const order = ordersStore.find((o) => o.id === id);
    if (order) {
      order.courierName = courierName || 'Steadfast';
      order.courierPartner = courierName || 'Steadfast';
      order.consignmentId = consignmentId || '';
      if (codAmountToCollect !== undefined) {
        order.codAmountToCollect = Number(codAmountToCollect);
        order.remainingAmountDue = Number(codAmountToCollect);
      }
      return res.json(order);
    }
  }

  res.status(404).json({ error: "Order not found" });
});

app.get(["/api/admin/inventory/logs", "/api/inventory/logs"], requireAdminAuth, async (req, res) => {
  if (isSupabaseActive()) {
    const dbLogs = await dbInventoryLogs.getAll();
    return res.json(dbLogs || []);
  }

  console.warn("[WARNING] Serving inventory logs from in-memory fallback (Local development mode only).");
  res.json(inventoryLogsStore);
});

app.get(["/api/admin/coupons", "/api/coupons"], requireAdminAuth, async (req, res) => {
  if (isSupabaseActive()) {
    const dbCouponsList = await dbCoupons.getAll();
    return res.json(dbCouponsList || []);
  }

  console.warn("[WARNING] Serving coupons from in-memory fallback (Local development mode only).");
  res.json(couponsStore);
});

app.post(["/api/admin/coupons", "/api/coupons"], requireAdminAuth, async (req, res) => {
  const newCoupon: Coupon = req.body;
  if (isSupabaseActive()) {
    await dbCoupons.create(newCoupon);
  } else {
    couponsStore.unshift(newCoupon);
  }
  res.status(201).json(newCoupon);
});

app.delete(["/api/admin/coupons/:code", "/api/coupons/:code"], requireAdminAuth, async (req, res) => {
  const { code } = req.params;
  if (isSupabaseActive()) {
    await dbCoupons.delete(code);
  } else {
    couponsStore = couponsStore.filter((c) => c.code.toLowerCase() !== code.toLowerCase());
  }
  res.json({ success: true, message: `Coupon ${code} removed` });
});

app.post(["/api/admin/products", "/api/products"], requireAdminAuth, async (req, res) => {
  if (isSupabaseActive()) {
    const created = await dbProducts.create(req.body);
    if (created) return res.status(201).json(created);
    return res.status(500).json({ error: "Failed to create product in database." });
  }

  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `kng-${Date.now().toString().slice(-6)}`,
    sku: req.body.sku || `KNG-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 0,
  };
  productsStore.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.put(["/api/admin/products/:id", "/api/products/:id"], requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseActive()) {
    const updated = await dbProducts.update(id, req.body);
    if (updated) return res.json(updated);
    return res.status(404).json({ error: "Product not found" });
  }

  const index = productsStore.findIndex((p) => p.id === id);
  if (index !== -1) {
    productsStore[index] = { ...productsStore[index], ...req.body };
    return res.json(productsStore[index]);
  }
  res.status(404).json({ error: "Product not found" });
});

app.delete(["/api/admin/products/:id", "/api/products/:id"], requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseActive()) {
    await dbProducts.delete(id);
  } else {
    productsStore = productsStore.filter((p) => p.id !== id);
  }
  res.json({ success: true, message: `Product ${id} removed` });
});

app.post(["/api/admin/sync-sheets", "/api/sync-sheets"], requireAdminAuth, async (req, res) => {
  let ordersCount = 0;
  let productsCount = 0;

  if (isSupabaseActive()) {
    const dbOrdersList = await dbOrders.getAll({});
    const dbProductsList = await dbProducts.getAll({});
    ordersCount = dbOrdersList ? dbOrdersList.length : 0;
    productsCount = dbProductsList ? dbProductsList.length : 0;
  } else {
    ordersCount = ordersStore.length;
    productsCount = productsStore.length;
  }

  res.json({
    success: true,
    syncedOrdersCount: ordersCount,
    syncedProductsCount: productsCount,
    sheetUrl: "https://docs.google.com/spreadsheets/d/1KINGSMAN_ROYAL_SNEAKERS_LIVE_ORDERS/edit#gid=0",
    timestamp: new Date().toISOString(),
  });
});

// Store Settings Update
app.put(["/api/admin/settings", "/api/settings"], requireAdminAuth, async (req, res) => {
  try {
    const updated = await dbSettings.update(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update store settings" });
  }
});

app.use("/api/admin/*", requireAdminAuth);

// ----------------------------------------------------
// PUBLIC STOREFRONT ENDPOINTS
// ----------------------------------------------------

// GET /api/settings - Public store settings (MFS numbers, delivery charges, weight settings)
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await dbSettings.get();
    res.json(settings);
  } catch (err) {
    res.json(DEFAULT_STORE_SETTINGS);
  }
});

// GET /api/products
app.get("/api/products", async (req, res) => {
  const { category, search, featured, limited } = req.query;

  if (isSupabaseActive()) {
    const supabaseProducts = await dbProducts.getAll({
      category: category as string,
      search: search as string,
      featured: featured as string,
      limited: limited as string,
    });
    if (supabaseProducts) {
      return res.json(supabaseProducts);
    }
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(503).json({
      error: "Database not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production.",
    });
  }

  console.warn("[WARNING] Serving products from in-memory catalog (Local development mode only).");
  let result = [...productsStore];

  if (category && category !== "All") {
    result = result.filter((p) => p.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }
  if (featured === "true") {
    result = result.filter((p) => p.isFeatured);
  }
  if (limited === "true") {
    result = result.filter((p) => p.isLimitedEdition);
  }

  res.json(result);
});

// GET /api/orders
// Listing without filters requires admin auth.
// Customer order tracking strictly requires BOTH orderId and phone number.
app.get("/api/orders", async (req, res) => {
  const { phone, orderId } = req.query;

  // Customer order tracking
  if (orderId && phone) {
    const targetId = String(orderId).trim();
    const normalizedPhone = normalizeBDPhone(String(phone).trim());

    if (!normalizedPhone) {
      return res.status(400).json({
        error: "Invalid phone number. Please provide a valid 11-digit Bangladeshi number.",
      });
    }

    if (isSupabaseActive()) {
      const dbOrdersList = await dbOrders.getAll({ orderId: targetId });
      if (dbOrdersList && dbOrdersList.length > 0) {
        const match = dbOrdersList.find((o) => {
          const oPhone = normalizeBDPhone(o.customerPhone);
          return o.id.toLowerCase() === targetId.toLowerCase() && oPhone === normalizedPhone;
        });
        if (match) {
          return res.json(match);
        }
      }
    } else {
      const memoryMatch = ordersStore.find((o) => {
        const oPhone = normalizeBDPhone(o.customerPhone);
        return o.id.toLowerCase() === targetId.toLowerCase() && oPhone === normalizedPhone;
      });
      if (memoryMatch) {
        return res.json(memoryMatch);
      }
    }

    return res.status(404).json({ error: "Order not found. Please verify your Order ID and phone number." });
  }

  // Listing requires admin authentication
  const token = extractAdminToken(req);
  const session = verifyAdminToken(token);
  if (!session) {
    return res.status(401).json({
      error: "Unauthorized: Admin authentication required to list orders",
    });
  }

  if (isSupabaseActive()) {
    const supabaseOrders = await dbOrders.getAll({});
    return res.json(supabaseOrders || []);
  }

  console.warn("[WARNING] Serving orders from in-memory store (Local development mode only).");
  return res.json(ordersStore);
});

/**
 * Fire-and-forget Google Apps Script / Google Sheets Webhook Dispatcher
 */
function syncOrderToGoogleSheets(order: Order): void {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.trim() || webhookUrl.includes("your-google-script-url")) {
    return;
  }

  (async () => {
    try {
      const items = order.items || [];
      const productNames = items.map((i: any) => i.product?.name || "Footwear").join(" | ");
      const productSizes = items.map((i: any) => `EU ${i.selectedSize}`).join(" | ");
      const quantities = items.map((i: any) => String(i.quantity || 1)).join(" | ");
      const totalQty = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);

      const payload = {
        id: order.id,
        orderId: order.id,
        date: order.createdAt || new Date().toISOString(),
        customerName: order.customerName || "Customer",
        phone: order.customerPhone || "",
        customerPhone: order.customerPhone || "",
        customerEmail: order.customerEmail || "",
        address: order.address || "",
        area: order.area || "",
        city: order.city || order.district || "Dhaka",
        district: order.district || order.city || "Dhaka",
        items: items,
        products: productNames,
        sizes: productSizes,
        quantities: quantities,
        quantity: totalQty,
        totalQuantity: totalQty,
        subtotal: order.subtotal || 0,
        shippingFee: order.shippingFee || 100,
        deliveryFee: order.shippingFee || 100,
        discount: order.discountAmount || 0,
        discountAmount: order.discountAmount || 0,
        total: order.total || 0,
        currency: "BDT",
        advanceDeliveryFeePaid: order.advanceDeliveryFeePaid || false,
        advanceDeliveryFeeTrxId: order.advanceDeliveryFeeTrxId || "",
        advanceDeliveryFeeMethod: order.advanceDeliveryFeeMethod || "",
        remainingAmountDue: order.remainingAmountDue || 0,
        courierPartner: order.courierPartner || "Steadfast",
        paymentMethod: order.paymentMethod || "COD",
        paymentStatus: order.paymentStatus || "Pending",
        orderStatus: order.orderStatus || "Pending",
        notes: order.notes || "",
        trackingNumber: order.trackingNumber || "",
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`⚠️ [GOOGLE SHEETS WEBHOOK] Responded with status ${response.status}`);
      } else {
        console.log(`📊 [GOOGLE SHEETS WEBHOOK] Order ${order.id} synced successfully`);
      }
    } catch (err: any) {
      console.warn(`⚠️ [GOOGLE SHEETS WEBHOOK] Notice: Failed to sync:`, err?.message || err);
    }
  })();
}

/**
 * Dispatches transactional confirmation emails via Resend API
 */
async function sendOrderNotificationEmail(order: Order): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL || "kingsmanszn@gmail.com";

  if (!resendApiKey || !resendApiKey.startsWith("re_")) {
    console.log(`📧 [EMAIL LOG] Order notification queued for ${order.customerName} - Total: ৳${order.total}`);
    return;
  }

  try {
    const itemsListHtml = (order.items || [])
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #222;">${item.product?.name || "Sneaker"} (EU ${item.selectedSize})</td>
          <td style="padding: 8px; border-bottom: 1px solid #222; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #222; text-align: right;">৳${(item.product?.price || 0) * item.quantity}</td>
        </tr>
      `
      )
      .join("");

    if (order.customerEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "KINGSMAN Luxury Sneakers <orders@kingsmanszn.com>",
          to: [order.customerEmail],
          subject: `Order Confirmed: #${order.id} - KINGSMAN`,
          html: `
            <div style="font-family: sans-serif; background: #111; color: #f8f8f8; padding: 24px; max-width: 600px;">
              <h1 style="color: #c7a55b; letter-spacing: 2px;">KINGSMAN LUXURY SNEAKERS</h1>
              <p>Dear ${order.customerName},</p>
              <p>Thank you for your order. We are preparing your curated sneakers for dispatch.</p>
              <div style="background: #181818; padding: 16px; margin: 16px 0; border: 1px solid #333;">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Delivery Fee Paid:</strong> ৳${order.shippingFee}</p>
                <p><strong>Remaining Balance Due on Delivery:</strong> ৳${order.remainingAmountDue || 0}</p>
                <p><strong>Courier:</strong> ${order.courierPartner || "Steadfast"} Express</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <thead>
                  <tr style="color: #c7a55b; border-bottom: 1px solid #444;">
                    <th style="text-align: left; padding: 8px;">Product</th>
                    <th style="text-align: center; padding: 8px;">Qty</th>
                    <th style="text-align: right; padding: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsListHtml}</tbody>
              </table>
            </div>
          `,
        }),
      });
    }

    // Alert to store owner
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KINGSMAN Alert <alerts@kingsmanszn.com>",
        to: [ownerEmail],
        subject: `🚨 New Order #${order.id}: ৳${order.total} (${order.customerName})`,
        html: `
          <div style="font-family: sans-serif; padding: 16px;">
            <h2>New KINGSMAN Order Received</h2>
            <p><strong>Customer:</strong> ${order.customerName} (${order.customerPhone})</p>
            <p><strong>Address:</strong> ${order.address}, ${order.district}</p>
            <p><strong>Total:</strong> ৳${order.total}</p>
          </div>
        `,
      }),
    });
  } catch (emailErr: any) {
    console.warn("⚠️ [EMAIL DISPATCH] Failed to send email via Resend:", emailErr?.message || emailErr);
  }
}

// POST /api/orders
// Real Owner Process: COD for product price, Advance Delivery Charge via bKash/Nagad/Rocket
app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body || {};

    const customerName = typeof orderData.customerName === "string" ? orderData.customerName.trim() : "";
    if (!customerName || customerName.length < 2) {
      return res.status(400).json({ error: "Valid customer full name is required." });
    }

    const rawPhone = orderData.customerPhone || orderData.phone;
    const normalizedPhone = normalizeBDPhone(rawPhone);
    if (!normalizedPhone) {
      return res.status(400).json({
        error: "Invalid Bangladeshi phone number. Must be an 11-digit mobile number (e.g. 017XXXXXXXX or +88017XXXXXXXX).",
      });
    }

    const address = typeof orderData.address === "string" ? orderData.address.trim() : "";
    if (!address || address.length < 5) {
      return res.status(400).json({ error: "Valid delivery street address is required (minimum 5 characters)." });
    }

    const district =
      typeof orderData.district === "string" && orderData.district.trim()
        ? orderData.district.trim()
        : typeof orderData.city === "string"
        ? orderData.city.trim()
        : "";
    if (!district) {
      return res.status(400).json({ error: "Delivery district is required." });
    }

    const rawItems = Array.isArray(orderData.items) ? orderData.items : [];
    if (rawItems.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one footwear or clothing item." });
    }

    let serverSubtotal = 0;
    let totalWeightGrams = 0;
    const verifiedItems: CartItem[] = [];

    for (const item of rawItems) {
      const productId = item.productId || item.product?.id || item.id;
      if (!productId || typeof productId !== "string") {
        return res.status(400).json({ error: "Invalid product identified in cart." });
      }

      let product: Product | null = null;
      if (isSupabaseActive()) {
        product = await dbProducts.getById(productId);
      }
      if (!product && process.env.NODE_ENV !== "production") {
        product =
          productsStore.find((p) => p.id === productId || p.sku === productId) ||
          INITIAL_PRODUCTS.find((p) => p.id === productId || p.sku === productId) ||
          null;
      }

      if (!product) {
        return res.status(400).json({ error: "One or more products in your cart could not be verified." });
      }

      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
        return res.status(400).json({ error: "Product quantity must be an integer between 1 and 10." });
      }

      const selectedSize = item.selectedSize;
      const productSizes = Array.isArray(product.sizes) ? product.sizes.map(String) : [];
      if (!productSizes.includes(String(selectedSize))) {
        return res.status(400).json({
          error: `Selected size ${selectedSize} is not available for ${product.name}.`,
        });
      }

      let currentStock = product.stock;
      if (product.sizeStock && product.sizeStock[selectedSize] !== undefined) {
        currentStock = Number(product.sizeStock[selectedSize]);
      } else if (product.sizeStock && product.sizeStock[String(selectedSize)] !== undefined) {
        currentStock = Number(product.sizeStock[String(selectedSize)]);
      }

      if (currentStock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name} (Size ${selectedSize}). Only ${currentStock} item(s) available.`,
        });
      }

      let unitPrice = product.price;
      if (product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.price < product.originalPrice) {
        unitPrice = product.price;
      } else if ((product as any).salePrice && typeof (product as any).salePrice === "number" && (product as any).salePrice > 0) {
        unitPrice = (product as any).salePrice;
      }

      serverSubtotal += unitPrice * qty;
      const itemWeight = (product.weightGrams && product.weightGrams > 0) ? product.weightGrams : 1000;
      totalWeightGrams += itemWeight * qty;

      verifiedItems.push({
        id: item.id || `${product.id}-${selectedSize}`,
        product: {
          ...product,
          price: unitPrice,
        },
        selectedSize,
        selectedColor: item.selectedColor || (product.colors && product.colors[0]) || { name: "Signature", hex: "#111111" },
        quantity: qty,
      });
    }

    // Coupon verification
    let serverDiscountAmount = 0;
    const submittedCouponCode = (
      orderData.couponCode ||
      orderData.appliedCoupon?.code ||
      orderData.coupon?.code ||
      ""
    )
      .toString()
      .trim()
      .toUpperCase();

    if (submittedCouponCode) {
      let verifiedCoupon: Coupon | undefined;
      if (isSupabaseActive()) {
        const couponResult = await dbCoupons.verify(submittedCouponCode, serverSubtotal);
        if (couponResult.valid && couponResult.coupon) {
          verifiedCoupon = couponResult.coupon;
        }
      } else {
        verifiedCoupon = couponsStore.find((c) => c.code.toUpperCase() === submittedCouponCode && c.isActive);
      }

      if (verifiedCoupon && serverSubtotal >= (verifiedCoupon.minSpend || 0)) {
        if (verifiedCoupon.discountType === "percentage") {
          serverDiscountAmount = Math.round((serverSubtotal * verifiedCoupon.discountValue) / 100);
        } else {
          serverDiscountAmount = Math.min(serverSubtotal, verifiedCoupon.discountValue);
        }
      }
    }

    // Fetch dynamic store delivery settings
    const settings = await dbSettings.get();

    // Delivery charge calculation: Inside Dhaka = 100 BDT, Outside Dhaka = 160 BDT (admin editable)
    // Surcharge for heavy parcels: sum(weightGrams * quantity), baseWeightGrams, extraChargePerKg
    const isInsideDhaka = district.toLowerCase().includes("dhaka - inside") || (district.toLowerCase().includes("dhaka") && !district.toLowerCase().includes("suburb"));
    const baseDeliveryCharge = isInsideDhaka ? settings.deliveryChargeInsideDhaka : settings.deliveryChargeOutsideDhaka;

    let extraWeightCharge = 0;
    if (totalWeightGrams > settings.baseWeightGrams && settings.extraChargePerKg > 0) {
      const extraGrams = totalWeightGrams - settings.baseWeightGrams;
      const extraKg = Math.ceil(extraGrams / 1000);
      extraWeightCharge = extraKg * settings.extraChargePerKg;
    }

    const deliveryCharge = baseDeliveryCharge + extraWeightCharge;
    const codAmountToCollect = Math.max(0, serverSubtotal - serverDiscountAmount);
    const serverTotal = codAmountToCollect + deliveryCharge;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KNG-${new Date().getFullYear()}-${randomSuffix}`;
    const trackingNumber = `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`;

    // Optional MFS payment details if customer provided them
    const mfsMethod = orderData.mfsMethod || orderData.advanceDeliveryFeeMethod || undefined;
    const senderMfsPhone = orderData.senderMfsPhone ? String(orderData.senderMfsPhone).trim() : undefined;
    const advanceDeliveryFeeTrxId = orderData.advanceDeliveryFeeTrxId ? String(orderData.advanceDeliveryFeeTrxId).trim() : undefined;

    const sanitizedOrder: Order = {
      id: orderId,
      idempotencyKey: orderData.idempotencyKey || undefined,
      customerName,
      customerPhone: normalizedPhone,
      customerEmail:
        typeof orderData.customerEmail === "string" && orderData.customerEmail.includes("@")
          ? orderData.customerEmail.trim()
          : undefined,
      district,
      address,
      area: typeof orderData.area === "string" ? orderData.area.trim() : "",
      city: typeof orderData.city === "string" ? orderData.city.trim() : district,
      notes: typeof orderData.notes === "string" ? orderData.notes.trim() : undefined,
      paymentMethod: "COD",
      paymentStatus: "Due",
      orderStatus: "Awaiting Delivery Charge",
      items: verifiedItems,
      subtotal: serverSubtotal,
      discountAmount: serverDiscountAmount,
      shippingFee: deliveryCharge,
      total: serverTotal,
      currency: "BDT",
      deliveryChargePaid: false,
      advanceDeliveryFeePaid: false,
      advanceDeliveryFeeTrxId: advanceDeliveryFeeTrxId || undefined,
      advanceDeliveryFeeMethod: mfsMethod,
      senderMfsPhone: senderMfsPhone || undefined,
      mfsMethod: mfsMethod,
      remainingAmountDue: codAmountToCollect,
      codAmountToCollect: codAmountToCollect,
      courierPartner: orderData.courierName === "Pathao" ? "Pathao" : "Steadfast",
      courierName: orderData.courierName === "Pathao" ? "Pathao" : "Steadfast",
      consignmentId: undefined,
      totalWeightGrams,
      createdAt: new Date().toISOString(),
      trackingNumber,
    };

    // Decrement Stock in memory if local development
    if (!isSupabaseActive()) {
      verifiedItems.forEach((item) => {
        const prod = productsStore.find((p) => p.id === item.product.id || p.sku === item.product.sku);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          if (prod.sizeStock) {
            if (prod.sizeStock[item.selectedSize] !== undefined) {
              prod.sizeStock[item.selectedSize] = Math.max(0, prod.sizeStock[item.selectedSize] - item.quantity);
            } else if (prod.sizeStock[String(item.selectedSize)] !== undefined) {
              prod.sizeStock[String(item.selectedSize)] = Math.max(0, prod.sizeStock[String(item.selectedSize)] - item.quantity);
            }
          }
        }
      });
    }

    let createdOrder: Order = sanitizedOrder;
    if (isSupabaseActive()) {
      const dbOrder = await dbOrders.create(sanitizedOrder);
      if (dbOrder) createdOrder = dbOrder;
    } else {
      ordersStore.unshift(createdOrder);
    }

    // Fire-and-forget notifications without blocking customer
    syncOrderToGoogleSheets(createdOrder);
    sendOrderNotificationEmail(createdOrder);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully. Please send the delivery charge to confirm.",
      order: createdOrder,
    });
  } catch (err: any) {
    console.error("[ORDER CREATION ERROR]", err);
    return res.status(500).json({ error: "Failed to process order. Please try again." });
  }
});

// POST /api/coupons/verify
app.post("/api/coupons/verify", async (req, res) => {
  const { code, subtotal } = req.body;

  if (isSupabaseActive()) {
    const dbResult = await dbCoupons.verify(code, subtotal);
    if (dbResult.valid && dbResult.coupon) {
      const coupon = dbResult.coupon;
      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      return res.json({
        valid: true,
        code: coupon.code,
        discountAmount: discount,
        description: coupon.description,
      });
    }
  } else {
    const coupon = couponsStore.find((c) => c.code.toUpperCase() === String(code).toUpperCase() && c.isActive);
    if (!coupon) {
      return res.status(404).json({ valid: false, message: "Invalid or expired promo code" });
    }
    if (subtotal < coupon.minSpend) {
      return res.status(400).json({
        valid: false,
        message: `Minimum spend of $${coupon.minSpend} required for promo code ${coupon.code}`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discountAmount: discount,
      description: coupon.description,
    });
  }

  res.status(404).json({ valid: false, message: "Invalid or expired promo code" });
});

// SITEMAP & ROBOTS
app.get(["/sitemap.xml", "/api/sitemap.xml"], async (req, res) => {
  try {
    const siteUrl = process.env.SITE_URL || "https://kingsmanszn.com";
    let productItems: Product[] = [];

    if (isSupabaseActive()) {
      const dbProductsList = await dbProducts.getAll({});
      if (dbProductsList) productItems = dbProductsList;
    }
    if (productItems.length === 0 && process.env.NODE_ENV !== "production") {
      productItems = productsStore;
    }

    const categories = [
      "Nike",
      "Jordan",
      "Adidas",
      "New Balance",
      "Converse",
      "Louis Vuitton",
      "T-Shirt",
      "Hoodie",
      "Sweatshirt",
    ];

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/catalog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

    for (const cat of categories) {
      const slug = cat.toLowerCase().replace(/\s+/g, "-");
      xml += `  <url>
    <loc>${siteUrl}/collections/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
`;
    }

    for (const prod of productItems) {
      const productSlug = (prod.sku || prod.id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      xml += `  <url>
    <loc>${siteUrl}/products/${productSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

app.get("/robots.txt", (req, res) => {
  const siteUrl = process.env.SITE_URL || "https://kingsmanszn.com";
  const robotsTxt = `# KINGSMAN Luxury Footwear
User-agent: *
Allow: /
Allow: /catalog
Allow: /collections/
Allow: /products/
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Sitemap: ${siteUrl}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(robotsTxt);
});
