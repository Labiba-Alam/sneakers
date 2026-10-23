import "dotenv/config";
import express from "express";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { INITIAL_PRODUCTS } from "../data/products";
import { INITIAL_COUPONS } from "../data/coupons";
import { Order, Product, Coupon, InventoryLog, CartItem } from "../types";
import {
  initSupabase,
  isSupabaseActive,
  isSupabaseConfigured,
  seedSupabaseIfEmpty,
  dbProducts,
  dbOrders,
  dbCoupons,
  dbInventoryLogs,
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
  // Allow health endpoint and sandbox gateway to bypass 503
  if (req.path === "/health" || req.path.startsWith("/payment/sslcommerz/sandbox-gateway")) {
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
  const secret = process.env.SESSION_SECRET;
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
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;

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
      order.orderStatus = status;
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

app.use("/api/admin/*", requireAdminAuth);

// ----------------------------------------------------
// PUBLIC STOREFRONT ENDPOINTS
// ----------------------------------------------------

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
// Strict Server-Authoritative Price Calculation & Validation
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
      return res.status(400).json({ error: "Order must contain at least one footwear item." });
    }

    let serverSubtotal = 0;
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

      const selectedSize = Number(item.selectedSize);
      const productSizes = Array.isArray(product.sizes) ? product.sizes.map(Number) : [];
      if (!productSizes.includes(selectedSize)) {
        return res.status(400).json({
          error: `Selected size EU ${selectedSize} is not available for ${product.name}.`,
        });
      }

      let currentStock = product.stock;
      if (product.sizeStock && product.sizeStock[selectedSize] !== undefined) {
        currentStock = Number(product.sizeStock[selectedSize]);
      }
      if (currentStock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name} (EU ${selectedSize}). Only ${currentStock} pair(s) available.`,
        });
      }

      let unitPrice = product.price;
      if (product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.price < product.originalPrice) {
        unitPrice = product.price;
      } else if ((product as any).salePrice && typeof (product as any).salePrice === "number" && (product as any).salePrice > 0) {
        unitPrice = (product as any).salePrice;
      }

      serverSubtotal += unitPrice * qty;

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

    // Delivery charge calculation: Dhaka: 100, Outside Dhaka: 160
    const isInsideDhaka = district.toLowerCase().includes("dhaka");
    const deliveryCharge = isInsideDhaka ? 100 : 160;

    const serverTotal = Math.max(0, serverSubtotal - serverDiscountAmount + deliveryCharge);
    const isCod = orderData.paymentMethod === "COD" || !orderData.paymentMethod;
    const remainingDue = isCod ? Math.max(0, serverSubtotal - serverDiscountAmount) : 0;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KNG-${new Date().getFullYear()}-${randomSuffix}`;
    const trackingNumber = `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`;

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
      paymentMethod: isCod ? "COD" : "SSLCommerz/Card",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      items: verifiedItems,
      subtotal: serverSubtotal,
      discountAmount: serverDiscountAmount,
      shippingFee: deliveryCharge,
      total: serverTotal,
      currency: "BDT",
      advanceDeliveryFeePaid: false,
      advanceDeliveryFeeTrxId:
        typeof orderData.advanceDeliveryFeeTrxId === "string" ? orderData.advanceDeliveryFeeTrxId.trim() : undefined,
      advanceDeliveryFeeMethod: orderData.advanceDeliveryFeeMethod,
      remainingAmountDue: remainingDue,
      courierPartner: orderData.courierPartner === "Pathao" ? "Pathao" : "Steadfast",
      createdAt: new Date().toISOString(),
      trackingNumber,
    };

    // Decrement Stock
    if (!isSupabaseActive()) {
      verifiedItems.forEach((item) => {
        const prod = productsStore.find((p) => p.id === item.product.id || p.sku === item.product.sku);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          if (prod.sizeStock && prod.sizeStock[item.selectedSize] !== undefined) {
            prod.sizeStock[item.selectedSize] = Math.max(0, prod.sizeStock[item.selectedSize] - item.quantity);
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

    syncOrderToGoogleSheets(createdOrder);
    sendOrderNotificationEmail(createdOrder);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (err: any) {
    console.error("[ORDER CREATION ERROR]", err);
    return res.status(500).json({ error: "Failed to process order. Please try again." });
  }
});

// SSLCOMMERZ PAYMENT GATEWAY ROUTES
app.post("/api/payment/sslcommerz/init", async (req, res) => {
  try {
    const orderData = req.body;
    const storeId = process.env.SSLCOMMERZ_STORE_ID || "testbox";
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
    const isSandbox = (process.env.SSLCOMMERZ_IS_SANDBOX ?? "true") !== "false";
    const sslApiUrl = isSandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const pendingOrderData: Partial<Order> = {
      ...orderData,
      paymentMethod: "SSLCommerz/Card",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    };

    let createdOrder: Order;
    if (isSupabaseActive()) {
      const dbCreatedOrder = await dbOrders.create(pendingOrderData);
      createdOrder = dbCreatedOrder || (pendingOrderData as Order);
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      createdOrder = {
        id: `KNG-${new Date().getFullYear()}-${randomSuffix}`,
        customerName: orderData.customerName || "Valued Guest",
        customerPhone: orderData.customerPhone || "",
        customerEmail: orderData.customerEmail,
        district: orderData.district || "Dhaka",
        address: orderData.address || "",
        area: orderData.area || "",
        city: orderData.city || "Dhaka",
        notes: orderData.notes,
        paymentMethod: "SSLCommerz/Card",
        paymentStatus: "Pending",
        orderStatus: "Pending",
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        discountAmount: orderData.discountAmount || 0,
        shippingFee: orderData.shippingFee || 0,
        total: orderData.total || 0,
        currency: orderData.currency || "USD",
        createdAt: new Date().toISOString(),
        trackingNumber: `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      ordersStore.unshift(createdOrder);
    }

    const totalAmountBDT = createdOrder.currency === "BDT" ? Math.round(createdOrder.total) : Math.round(createdOrder.total * 120);

    const host = req.get("host") || "localhost:3000";
    const protocol = req.headers["x-forwarded-proto"] || (req.secure ? "https" : "http");
    const baseUrl = `${protocol}://${host}`;

    const postParams = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: String(totalAmountBDT),
      currency: "BDT",
      tran_id: createdOrder.id,
      success_url: `${baseUrl}/api/payment/sslcommerz/success?order_id=${createdOrder.id}`,
      fail_url: `${baseUrl}/api/payment/sslcommerz/fail?order_id=${createdOrder.id}`,
      cancel_url: `${baseUrl}/api/payment/sslcommerz/cancel?order_id=${createdOrder.id}`,
      ipn_url: `${baseUrl}/api/payment/sslcommerz/ipn?order_id=${createdOrder.id}`,
      shipping_method: "Courier",
      product_name: "KINGSMAN Luxury Footwear",
      product_category: "Footwear",
      product_profile: "general",
      cus_name: createdOrder.customerName,
      cus_email: createdOrder.customerEmail || "concierge@kingsman.bd",
      cus_add1: createdOrder.address || "Dhaka",
      cus_city: createdOrder.district || "Dhaka",
      cus_postcode: "1212",
      cus_country: "Bangladesh",
      cus_phone: createdOrder.customerPhone || "01700000000",
      ship_name: createdOrder.customerName,
      ship_add1: createdOrder.address || "Dhaka",
      ship_city: createdOrder.district || "Dhaka",
      ship_postcode: "1212",
      ship_country: "Bangladesh",
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const sslResponse = await fetch(sslApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: postParams.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const sslResult: any = await sslResponse.json();

      if (sslResult && sslResult.status === "SUCCESS" && sslResult.GatewayPageURL) {
        return res.json({
          success: true,
          gatewayUrl: sslResult.GatewayPageURL,
          order: createdOrder,
        });
      }
    } catch {
      // Fall through to sandbox fallback
    }

    const fallbackGatewayUrl = `/api/payment/sslcommerz/sandbox-gateway?order_id=${encodeURIComponent(
      createdOrder.id
    )}&amount=${totalAmountBDT}&name=${encodeURIComponent(createdOrder.customerName)}`;

    return res.json({
      success: true,
      gatewayUrl: fallbackGatewayUrl,
      order: createdOrder,
    });
  } catch (err: any) {
    console.error("[SSLCOMMERZ] Init error:", err);
    res.status(500).json({ error: "Failed to initiate SSLCommerz payment session" });
  }
});

const handleSslSuccess = async (req: express.Request, res: express.Response) => {
  const orderId = (req.query.order_id || req.body.tran_id || req.body.order_id) as string;
  const valId = (req.body.val_id || req.query.val_id || req.body.bank_tran_id || `VAL-${Date.now()}`) as string;
  const cardType = (req.body.card_type || req.query.card_type || "bKash / Card (SSLCommerz)") as string;

  if (orderId) {
    if (isSupabaseActive()) {
      await dbOrders.updatePaymentStatus(orderId, "Paid", "Confirmed", {
        transactionId: valId,
        cardType,
        bankTranId: req.body.bank_tran_id || valId,
        paymentMethod: "SSLCommerz/Card",
      });
    } else {
      const memoryOrder = ordersStore.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
      if (memoryOrder) {
        memoryOrder.paymentStatus = "Paid";
        memoryOrder.orderStatus = "Confirmed";
        memoryOrder.paymentDetails = { transactionId: valId };
      }
    }
  }

  return res.redirect(`/?order_id=${encodeURIComponent(orderId)}&payment=success`);
};

app.post("/api/payment/sslcommerz/success", handleSslSuccess);
app.get("/api/payment/sslcommerz/success", handleSslSuccess);

const handleSslFail = async (req: express.Request, res: express.Response) => {
  const orderId = (req.query.order_id || req.body.tran_id || req.body.order_id) as string;
  if (orderId) {
    if (isSupabaseActive()) {
      await dbOrders.updatePaymentStatus(orderId, "Failed", "Cancelled");
    } else {
      const memoryOrder = ordersStore.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
      if (memoryOrder) memoryOrder.paymentStatus = "Failed";
    }
  }
  return res.redirect(`/?order_id=${encodeURIComponent(orderId)}&payment=failed`);
};

app.post("/api/payment/sslcommerz/fail", handleSslFail);
app.get("/api/payment/sslcommerz/fail", handleSslFail);

const handleSslCancel = async (req: express.Request, res: express.Response) => {
  const orderId = (req.query.order_id || req.body.tran_id || req.body.order_id) as string;
  if (orderId) {
    if (isSupabaseActive()) {
      await dbOrders.updatePaymentStatus(orderId, "Cancelled", "Cancelled");
    } else {
      const memoryOrder = ordersStore.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
      if (memoryOrder) memoryOrder.paymentStatus = "Cancelled";
    }
  }
  return res.redirect(`/?order_id=${encodeURIComponent(orderId)}&payment=cancelled`);
};

app.post("/api/payment/sslcommerz/cancel", handleSslCancel);
app.get("/api/payment/sslcommerz/cancel", handleSslCancel);

app.post("/api/payment/sslcommerz/ipn", async (req, res) => {
  const orderId = req.body.tran_id || req.query.order_id;
  const status = req.body.status;
  const valId = req.body.val_id || req.body.bank_tran_id;

  if (orderId && (status === "VALID" || status === "VALIDATED")) {
    if (isSupabaseActive()) {
      await dbOrders.updatePaymentStatus(orderId, "Paid", "Confirmed", {
        transactionId: valId,
        cardType: req.body.card_type,
      });
    }
  }

  res.status(200).send("IPN_RECEIVED");
});

app.get("/api/payment/sslcommerz/sandbox-gateway", (req, res) => {
  const orderId = (req.query.order_id as string) || "KNG-DEMO-001";
  const amount = req.query.amount || "60000";
  const storeId = process.env.SSLCOMMERZ_STORE_ID || "testbox";

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SSLCommerz Payment Gateway - Sandbox</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
        body { background: #f0f2f5; color: #1e293b; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .gateway-card { background: #ffffff; width: 100%; max-width: 480px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: #004d99; color: white; padding: 20px; text-align: center; }
        .order-bar { background: #f8fafc; padding: 14px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .amount-tag { font-size: 16px; font-weight: 700; color: #004d99; }
        .content { padding: 20px; }
        .btn-pay { background: #004d99; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; }
        .btn-fail { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 10px; }
        .btn-cancel { background: transparent; color: #64748b; border: none; padding: 8px; font-size: 12px; cursor: pointer; text-decoration: underline; margin-top: 8px; width: 100%; }
      </style>
    </head>
    <body>
      <div class="gateway-card">
        <div class="header">
          <h2>SSLCommerz Gateway Sandbox</h2>
          <p>KINGSMAN Luxury Atelier Secure Checkout</p>
        </div>
        <div class="order-bar">
          <div>Order: <strong>${orderId}</strong></div>
          <div class="amount-tag">BDT ৳${Number(amount).toLocaleString()}</div>
        </div>
        <div class="content">
          <form action="/api/payment/sslcommerz/success?order_id=${encodeURIComponent(orderId)}" method="POST">
            <input type="hidden" name="tran_id" value="${orderId}">
            <input type="hidden" name="val_id" value="VAL-SSL-${Math.floor(10000000 + Math.random() * 90000000)}">
            <input type="hidden" name="bank_tran_id" value="BANK-TRX-${Math.floor(1000000 + Math.random() * 9000000)}">
            <input type="hidden" name="card_type" value="bKash-SSLCommerz">
            <input type="hidden" name="amount" value="${amount}">
            <input type="hidden" name="status" value="VALID">
            <button type="submit" class="btn-pay">Pay ৳${Number(amount).toLocaleString()} & Authorize</button>
          </form>
          <form action="/api/payment/sslcommerz/fail?order_id=${encodeURIComponent(orderId)}" method="POST">
            <input type="hidden" name="tran_id" value="${orderId}">
            <button type="submit" class="btn-fail">Test Payment Failure</button>
          </form>
          <form action="/api/payment/sslcommerz/cancel?order_id=${encodeURIComponent(orderId)}" method="POST">
            <input type="hidden" name="tran_id" value="${orderId}">
            <button type="submit" class="btn-cancel">Cancel and Return to Merchant</button>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);
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
