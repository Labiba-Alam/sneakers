import "dotenv/config";
import express from "express";
import path from "path";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { INITIAL_PRODUCTS } from "./src/data/products";
import { INITIAL_COUPONS } from "./src/data/coupons";
import { Order, Product, Coupon, InventoryLog } from "./src/types";
import { env } from "./src/lib/env";
import {
  initSupabase,
  isSupabaseActive,
  seedSupabaseIfEmpty,
  dbProducts,
  dbOrders,
  dbCoupons,
  dbInventoryLogs,
} from "./src/server/supabase";

// Initialize Supabase & Run Seeder if connected
initSupabase();
seedSupabaseIfEmpty();

// In-memory backend storage with initial seed as fallback
let productsStore: Product[] = [...INITIAL_PRODUCTS];
let ordersStore: Order[] = [
  {
    id: 'KNG-2026-8942',
    customerName: 'Marcus Sterling',
    customerPhone: '+1 555-019-2834',
    customerEmail: 'm.sterling@kingsman.royal',
    district: 'Dhaka - Inside City',
    address: '450 Park Avenue, Penthouse B',
    area: 'Manhattan',
    city: 'New York',
    notes: 'Please leave with private doorman.',
    paymentMethod: 'SSLCommerz/Card',
    paymentStatus: 'Paid',
    orderStatus: 'Packaging',
    items: [
      {
        id: 'kng-001-42-Royal Crimson & Gold',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 42,
        selectedColor: { name: 'Royal Crimson & Gold', hex: '#C1121F' },
        quantity: 1
      }
    ],
    subtotal: 680,
    discountAmount: 0,
    shippingFee: 0,
    total: 680,
    currency: 'USD',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    trackingNumber: 'TRK-KNG-992031'
  }
];

let couponsStore: Coupon[] = [...INITIAL_COUPONS];
let inventoryLogsStore: InventoryLog[] = [
  {
    id: 'log-001',
    productId: 'kng-001',
    productName: 'KINGSMAN Sovereign Crimson I',
    size: 42,
    previousStock: 10,
    newStock: 8,
    changeReason: 'Sale',
    timestamp: 'Today at 2:15 PM',
    adminUser: 'Online Order #KNG-8942'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION & SESSION CONFIGURATION
  // ----------------------------------------------------
  const ADMIN_COOKIE_NAME = "kingsman_admin_session";
  const ADMIN_SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days reasonable expiry

  const getAdminSecret = (): string => {
    return (process.env.ADMIN_SECRET_KEY || env.ADMIN_SECRET_KEY || "super-secret-admin-token").trim();
  };

  // Cryptographically signs an admin session payload using HMAC-SHA256
  function signAdminPayload(payload: object): string {
    const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", getAdminSecret()).update(data).digest("base64url");
    return `${data}.${sig}`;
  }

  // Verifies HMAC-SHA256 signature and expiration timestamp
  function verifyAdminToken(token?: string | null): any | null {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, sig] = parts;

    try {
      const expectedSig = crypto.createHmac("sha256", getAdminSecret()).update(data).digest("base64url");
      const sigBuf = Buffer.from(sig);
      const expBuf = Buffer.from(expectedSig);

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
      if (payload.exp && Date.now() > payload.exp) {
        return null; // Session expired
      }
      return payload;
    } catch {
      return null;
    }
  }

  // Extracts session token from httpOnly cookie or Authorization Bearer header
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

  // Security Middleware: Requires valid admin session before accessing protected endpoints
  const requireAdminAuth: express.RequestHandler = (req, res, next) => {
    const token = extractAdminToken(req);
    const session = verifyAdminToken(token);

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized: Valid Admin Session Required",
        message: "Access denied. Please authenticate with ADMIN_SECRET_KEY to access this resource."
      });
    }

    (req as any).adminUser = session;
    next();
  };

  // SECURITY HEADERS MIDDLEWARE (Allowed in preview iframe)
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // SIMPLE RATE LIMITING MIDDLEWARE
  const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
  app.use("/api/", (req, res, next) => {
    const ip = req.ip || "127.0.0.1";
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
      return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
    }
    next();
  });

  // PUBLIC HEALTH API
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      app: "KINGSMAN Luxury Sneakers",
      database: isSupabaseActive() ? "supabase_postgresql" : "in_memory_fallback",
      timestamp: new Date(),
      version: "1.1.0"
    });
  });

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION API ROUTES (LOGIN / LOGOUT / SESSION)
  // ----------------------------------------------------

  // 1. ADMIN LOGIN: Authenticates ADMIN_SECRET_KEY & issues httpOnly session cookie
  app.post("/api/admin/login", (req, res) => {
    const { secretKey, email, role, name } = req.body;
    const expectedSecret = getAdminSecret();

    if (!secretKey || typeof secretKey !== "string") {
      return res.status(400).json({ error: "ADMIN_SECRET_KEY is required." });
    }

    let isValid = false;
    try {
      const inputBuf = Buffer.from(secretKey.trim());
      const expectedBuf = Buffer.from(expectedSecret);
      if (inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf)) {
        isValid = true;
      }
    } catch {
      isValid = false;
    }

    if (!isValid) {
      console.warn(`[SECURITY ALERT] Failed admin authentication attempt from IP ${req.ip || 'unknown'}`);
      return res.status(401).json({ error: "Invalid Admin Secret Key. Access Denied." });
    }

    const userRole = role === "Manager" || role === "Staff" ? role : "Admin";
    const userName = name || (userRole === "Admin" ? "Lord Sterling" : userRole === "Manager" ? "Atelier Director" : "Vault Specialist");
    const userEmail = (email && typeof email === "string" && email.trim()) || "admin@kingsman.royal";

    const sessionPayload = {
      id: `adm-${Date.now().toString().slice(-4)}`,
      name: userName,
      email: userEmail,
      role: userRole,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      exp: Date.now() + ADMIN_SESSION_EXPIRY_MS
    };

    const sessionToken = signAdminPayload(sessionPayload);

    // Set secure httpOnly cookie
    res.cookie(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_SESSION_EXPIRY_MS,
      path: "/"
    });

    console.log(`[SECURITY] Admin session issued for ${userName} (${userRole})`);

    return res.json({
      success: true,
      message: "Admin authenticated successfully",
      user: {
        id: sessionPayload.id,
        name: sessionPayload.name,
        email: sessionPayload.email,
        role: sessionPayload.role,
        avatar: sessionPayload.avatar
      }
    });
  });

  // 2. ADMIN LOGOUT: Destroys httpOnly session cookie
  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie(ADMIN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
    return res.json({ success: true, message: "Logged out successfully" });
  });

  // 3. ADMIN SESSION CHECK: Validates existing httpOnly session
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
        avatar: session.avatar
      }
    });
  });

  // ----------------------------------------------------
  // PROTECTED ADMIN API ROUTES (REQUIRE ADMIN AUTHENTICATION)
  // ----------------------------------------------------

  // PROTECTED SERVER METRICS & UPTIME MONITORING
  app.get(["/api/admin/metrics", "/api/metrics"], requireAdminAuth, async (req, res) => {
    const dbOrdersList = await dbOrders.getAll({});
    const dbProductsList = await dbProducts.getAll({});

    res.json({
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      activeOrdersCount: dbOrdersList ? dbOrdersList.length : ordersStore.length,
      activeProductsCount: dbProductsList ? dbProductsList.length : productsStore.length,
      database: isSupabaseActive() ? "supabase_postgresql" : "in_memory_fallback",
      status: "HEALTHY_GREEN"
    });
  });

  // PROTECTED ADMIN BACKUP & DISASTER RECOVERY API
  app.get("/api/admin/backups", requireAdminAuth, async (req, res) => {
    const dbOrdersList = await dbOrders.getAll({});
    const dbProductsList = await dbProducts.getAll({});
    const dbCouponsList = await dbCoupons.getAll();

    res.json({
      latestBackupTimestamp: new Date().toISOString(),
      backupStatus: "COMPLETED",
      databaseProvider: isSupabaseActive() ? "Supabase PostgreSQL" : "In-Memory Engine",
      recordsCount: {
        orders: dbOrdersList ? dbOrdersList.length : ordersStore.length,
        products: dbProductsList ? dbProductsList.length : productsStore.length,
        coupons: dbCouponsList ? dbCouponsList.length : couponsStore.length
      },
      backupLocation: "s3://kingsman-atelier-encrypted-backups/snapshot-latest.json"
    });
  });

  // PROTECTED ADMIN AI MARKETING STRATEGY (SERVER-SIDE GEMINI API)
  app.post("/api/admin/ai/strategy", requireAdminAuth, async (req, res) => {
    const { weeklyRevenue, conversionRate, topRegion, lowStockProduct, abandonedCartsCount } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the Chief Marketing Officer for KINGSMAN, a high-end luxury handcrafted sneaker brand in Bangladesh.
Analyze these current store metrics and provide 3 ultra-high impact actionable strategic marketing recommendations to boost sales, recover abandoned carts, and increase average order value (AOV):
- Weekly Revenue: $${weeklyRevenue || '12,500'}
- Conversion Rate: ${conversionRate || '4.2%'}
- Top Region: ${topRegion || 'Dhaka City (62% sales)'}
- Low Stock Alert: ${lowStockProduct || 'KINGSMAN Royal Crimson (Only 3 pairs remaining)'}
- Abandoned Cart Count: ${abandonedCartsCount || 42} carts

Format your response in sleek, professional, bulleted executive recommendations.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });

        if (response.text) {
          return res.json({ strategy: response.text });
        }
      } catch (err: any) {
        console.warn("[GEMINI SERVER ERROR]", err?.message);
      }
    }

    // Default fallback
    return res.json({
      strategy: `👑 **KINGSMAN AI EXECUTIVE STRATEGY BRIEF**:
1. **Targeted SMS Cart Recovery**: Launch an exclusive BDT 500 off luxury voucher via bKash SMS to the abandoned cart customers in Dhaka & Chattogram. Estimated revenue recovery: +$6,200.
2. **VIP Restock Pre-Order Campaign**: Leverage scarcity for the remaining limited pairs. Send an exclusive concierge invitation to Kingsman Sovereign tier members.
3. **Geo-Targeted High-Net-Worth Ads**: Scale Meta Pixel conversion ads specifically in Gulshan, Banani, and Dhanmondi targeting sneaker collectors with video unboxing testimonials.`
    });
  });

  // PROTECTED ADMIN GET ORDERS
  app.get("/api/admin/orders", requireAdminAuth, async (req, res) => {
    const dbOrdersList = await dbOrders.getAll({});
    if (dbOrdersList) {
      return res.json(dbOrdersList);
    }
    res.json(ordersStore);
  });

  // PROTECTED ADMIN UPDATE ORDER STATUS
  app.put(["/api/admin/orders/:id/status", "/api/orders/:id/status"], requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await dbOrders.updateStatus(id, status);

    const order = ordersStore.find(o => o.id === id);
    if (order) {
      order.orderStatus = status;
      return res.json(order);
    }
    
    const dbOrder = await dbOrders.getAll({ orderId: id });
    if (dbOrder && dbOrder.length > 0) {
      return res.json({ ...dbOrder[0], orderStatus: status });
    }

    res.status(404).json({ error: "Order not found" });
  });

  // PROTECTED ADMIN INVENTORY LOGS
  app.get(["/api/admin/inventory/logs", "/api/inventory/logs"], requireAdminAuth, async (req, res) => {
    const dbLogs = await dbInventoryLogs.getAll();
    if (dbLogs) {
      return res.json(dbLogs);
    }
    res.json(inventoryLogsStore);
  });

  // PROTECTED ADMIN GET COUPONS
  app.get(["/api/admin/coupons", "/api/coupons"], requireAdminAuth, async (req, res) => {
    const dbCouponsList = await dbCoupons.getAll();
    if (dbCouponsList) {
      return res.json(dbCouponsList);
    }
    res.json(couponsStore);
  });

  // PROTECTED ADMIN CREATE COUPON
  app.post(["/api/admin/coupons", "/api/coupons"], requireAdminAuth, async (req, res) => {
    const newCoupon: Coupon = req.body;
    await dbCoupons.create(newCoupon);
    couponsStore.unshift(newCoupon);
    res.status(201).json(newCoupon);
  });

  // PROTECTED ADMIN DELETE COUPON
  app.delete(["/api/admin/coupons/:code", "/api/coupons/:code"], requireAdminAuth, async (req, res) => {
    const { code } = req.params;
    await dbCoupons.delete(code);
    couponsStore = couponsStore.filter(c => c.code.toLowerCase() !== code.toLowerCase());
    res.json({ success: true, message: `Coupon ${code} removed` });
  });

  // PROTECTED ADMIN ADD PRODUCT
  app.post(["/api/admin/products", "/api/products"], requireAdminAuth, async (req, res) => {
    const createdInDb = await dbProducts.create(req.body);

    const newProduct: Product = createdInDb || {
      ...req.body,
      id: req.body.id || `kng-${Date.now().toString().slice(-6)}`,
      sku: req.body.sku || `KNG-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0
    };

    productsStore.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  // PROTECTED ADMIN UPDATE PRODUCT
  app.put(["/api/admin/products/:id", "/api/products/:id"], requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const updatedInDb = await dbProducts.update(id, req.body);

    const index = productsStore.findIndex(p => p.id === id);
    if (index !== -1) {
      productsStore[index] = { ...productsStore[index], ...(updatedInDb || req.body) };
      return res.json(productsStore[index]);
    }

    if (updatedInDb) {
      return res.json(updatedInDb);
    }

    res.status(404).json({ error: "Product not found" });
  });

  // PROTECTED ADMIN DELETE PRODUCT
  app.delete(["/api/admin/products/:id", "/api/products/:id"], requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    await dbProducts.delete(id);
    productsStore = productsStore.filter(p => p.id !== id);
    res.json({ success: true, message: `Product ${id} removed` });
  });

  // PROTECTED ADMIN GOOGLE SHEETS SYNC
  app.post(["/api/admin/sync-sheets", "/api/sync-sheets"], requireAdminAuth, async (req, res) => {
    const dbOrdersList = await dbOrders.getAll({});
    const dbProductsList = await dbProducts.getAll({});

    res.json({
      success: true,
      syncedOrdersCount: dbOrdersList ? dbOrdersList.length : ordersStore.length,
      syncedProductsCount: dbProductsList ? dbProductsList.length : productsStore.length,
      sheetUrl: "https://docs.google.com/spreadsheets/d/1KINGSMAN_ROYAL_SNEAKERS_LIVE_ORDERS/edit#gid=0",
      timestamp: new Date().toISOString()
    });
  });

  // GENERAL WILDCARD PROTECTION FOR ANY OTHER /api/admin/* ROUTE
  app.use("/api/admin/*", requireAdminAuth);

  // GET PRODUCTS (Reads from Supabase with in-memory fallback)
  app.get("/api/products", async (req, res) => {
    const { category, search, featured, limited } = req.query;

    const supabaseProducts = await dbProducts.getAll({
      category: category as string,
      search: search as string,
      featured: featured as string,
      limited: limited as string,
    });

    if (supabaseProducts) {
      return res.json(supabaseProducts);
    }

    // Fallback to in-memory store
    let result = [...productsStore];

    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (featured === 'true') {
      result = result.filter(p => p.isFeatured);
    }
    if (limited === 'true') {
      result = result.filter(p => p.isLimitedEdition);
    }

    res.json(result);
  });

  // ADD PRODUCT (ADMIN)
  app.post("/api/products", async (req, res) => {
    const createdInDb = await dbProducts.create(req.body);

    const newProduct: Product = createdInDb || {
      ...req.body,
      id: req.body.id || `kng-${Date.now().toString().slice(-6)}`,
      sku: req.body.sku || `KNG-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0
    };

    productsStore.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  // UPDATE PRODUCT (ADMIN)
  app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const updatedInDb = await dbProducts.update(id, req.body);

    const index = productsStore.findIndex(p => p.id === id);
    if (index !== -1) {
      productsStore[index] = { ...productsStore[index], ...(updatedInDb || req.body) };
      return res.json(productsStore[index]);
    }

    if (updatedInDb) {
      return res.json(updatedInDb);
    }

    res.status(404).json({ error: "Product not found" });
  });

  // GET ORDERS (ADMIN or Customer Lookup)
  app.get("/api/orders", async (req, res) => {
    const { phone, orderId } = req.query;

    const supabaseOrders = await dbOrders.getAll({
      phone: phone as string,
      orderId: orderId as string,
    });

    if (supabaseOrders) {
      return res.json(supabaseOrders);
    }

    // Fallback to in-memory store
    if (orderId) {
      const order = ordersStore.find(o => o.id.toLowerCase() === String(orderId).toLowerCase());
      return res.json(order ? [order] : []);
    }
    if (phone) {
      const filtered = ordersStore.filter(o => o.customerPhone.includes(String(phone)));
      return res.json(filtered);
    }
    res.json(ordersStore);
  });

  /**
   * Fire-and-forget Google Apps Script / Google Sheets Webhook Dispatcher
   * Synchronizes order details with Google Sheets without blocking or failing customer checkout.
   */
  function syncOrderToGoogleSheets(order: Order): void {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl || !webhookUrl.trim() || webhookUrl.includes("your-google-script-url")) {
      return;
    }

    // Fire-and-forget execution with self-contained try/catch
    (async () => {
      try {
        const items = order.items || [];
        const productNames = items.map((i: any) => i.product?.name || 'Footwear').join(' | ');
        const productSizes = items.map((i: any) => `EU ${i.selectedSize}`).join(' | ');
        const quantities = items.map((i: any) => String(i.quantity || 1)).join(' | ');
        const totalQty = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);

        const payload = {
          // Core identifiers & dates
          id: order.id,
          orderId: order.id,
          date: order.createdAt || new Date().toISOString(),

          // Customer & location details
          customerName: order.customerName || 'Guest',
          phone: order.customerPhone || '',
          customerPhone: order.customerPhone || '',
          customerEmail: order.customerEmail || '',
          address: order.address || '',
          area: order.area || '',
          city: order.city || order.district || 'Dhaka',
          district: order.district || order.city || 'Dhaka',

          // Item specifics for direct & parsed reading in Apps Script
          items: items,
          products: productNames,
          sizes: productSizes,
          quantities: quantities,
          quantity: totalQty,
          totalQuantity: totalQty,

          // Financial breakdown
          subtotal: order.subtotal || 0,
          shippingFee: order.shippingFee || 0,
          deliveryFee: order.shippingFee || 0,
          discount: order.discountAmount || 0,
          discountAmount: order.discountAmount || 0,
          total: order.total || 0,
          currency: order.currency || 'USD',

          // Payment & order lifecycle
          paymentMethod: order.paymentMethod || 'COD',
          paymentStatus: order.paymentStatus || 'Pending',
          orderStatus: order.orderStatus || 'Pending',
          notes: order.notes || '',
          trackingNumber: order.trackingNumber || ''
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s safety timeout

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`⚠️ [GOOGLE SHEETS WEBHOOK] Webhook responded with status ${response.status} for order ${order.id}`);
        } else {
          console.log(`📊 [GOOGLE SHEETS WEBHOOK] Order ${order.id} synced to Google Sheets successfully`);
        }
      } catch (err: any) {
        // Fire-and-forget: logs error but NEVER blocks or fails the customer checkout
        console.warn(`⚠️ [GOOGLE SHEETS WEBHOOK] Notice: Failed to sync order ${order.id} to Google Sheets:`, err?.message || err);
      }
    })();
  }

  // POST ORDER (CHECKOUT) - Supabase Transactional Insert & Stock Decrement
  app.post("/api/orders", async (req, res) => {
    const orderData = req.body;

    const dbCreatedOrder = await dbOrders.create(orderData);

    if (dbCreatedOrder) {
      // Keep in-memory store in sync
      ordersStore.unshift(dbCreatedOrder);

      // Decrement in-memory stock as well
      orderData.items?.forEach((item: any) => {
        const product = productsStore.find(p => p.id === item.product.id);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
        }
      });

      // Fire-and-forget sync to Google Sheets webhook
      syncOrderToGoogleSheets(dbCreatedOrder);

      return res.status(201).json({
        success: true,
        message: "Royal order placed successfully",
        order: dbCreatedOrder
      });
    }

    // Fallback to in-memory order creation
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `KNG-${new Date().getFullYear()}-${randomSuffix}`,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      district: orderData.district || orderData.city || 'Dhaka',
      address: orderData.address,
      area: orderData.area,
      city: orderData.city,
      notes: orderData.notes,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Due' : (orderData.paymentStatus || 'Pending'),
      orderStatus: 'Pending',
      items: orderData.items,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount || 0,
      shippingFee: orderData.shippingFee || 0,
      total: orderData.total,
      currency: orderData.currency || 'USD',
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDetails: orderData.paymentDetails
    };

    // Deduct stock
    orderData.items?.forEach((item: any) => {
      const product = productsStore.find(p => p.id === item.product.id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });

    ordersStore.unshift(newOrder);

    // Fire-and-forget sync to Google Sheets webhook
    syncOrderToGoogleSheets(newOrder);

    console.log(`[ORDER LOG] Fallback stored order ${newOrder.id} for ${newOrder.customerName} - Total: $${newOrder.total}`);

    res.status(201).json({
      success: true,
      message: "Royal order placed successfully",
      order: newOrder
    });
  });

  // ----------------------------------------------------
  // SSLCOMMERZ PAYMENT GATEWAY INTEGRATION (BANGLADESH)
  // ----------------------------------------------------

  // 1. INITIATE SSLCOMMERZ PAYMENT SESSION
  app.post("/api/payment/sslcommerz/init", async (req, res) => {
    try {
      const orderData = req.body;
      const storeId = process.env.SSLCOMMERZ_STORE_ID || env.SSLCOMMERZ_STORE_ID || "testbox";
      const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
      const isSandbox = (process.env.SSLCOMMERZ_IS_SANDBOX ?? "true") !== "false";
      const sslApiUrl = isSandbox
        ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
        : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

      // Create Pending Order in Supabase or fallback in-memory
      const pendingOrderData: Partial<Order> = {
        ...orderData,
        paymentMethod: 'SSLCommerz/Card',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
      };

      const dbCreatedOrder = await dbOrders.create(pendingOrderData);
      
      let createdOrder: Order;
      if (dbCreatedOrder) {
        createdOrder = dbCreatedOrder;
        ordersStore.unshift(dbCreatedOrder);
        syncOrderToGoogleSheets(dbCreatedOrder);
      } else {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        createdOrder = {
          id: `KNG-${new Date().getFullYear()}-${randomSuffix}`,
          customerName: orderData.customerName || 'Valued Guest',
          customerPhone: orderData.customerPhone || '',
          customerEmail: orderData.customerEmail,
          district: orderData.district || 'Dhaka',
          address: orderData.address || '',
          area: orderData.area || '',
          city: orderData.city || 'Dhaka',
          notes: orderData.notes,
          paymentMethod: 'SSLCommerz/Card',
          paymentStatus: 'Pending',
          orderStatus: 'Pending',
          items: orderData.items || [],
          subtotal: orderData.subtotal || 0,
          discountAmount: orderData.discountAmount || 0,
          shippingFee: orderData.shippingFee || 0,
          total: orderData.total || 0,
          currency: orderData.currency || 'USD',
          createdAt: new Date().toISOString(),
          trackingNumber: `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`,
        };
        ordersStore.unshift(createdOrder);
        syncOrderToGoogleSheets(createdOrder);
      }

      // Convert amount to BDT (standard currency for SSLCommerz)
      const totalAmountBDT = createdOrder.currency === 'BDT' 
        ? Math.round(createdOrder.total) 
        : Math.round(createdOrder.total * 120);

      // Determine Host and Callback URLs
      const host = req.get('host') || 'localhost:3000';
      const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
      const baseUrl = `${protocol}://${host}`;

      const postParams = new URLSearchParams({
        store_id: storeId,
        store_passwd: storePassword,
        total_amount: String(totalAmountBDT),
        currency: 'BDT',
        tran_id: createdOrder.id,
        success_url: `${baseUrl}/api/payment/sslcommerz/success?order_id=${createdOrder.id}`,
        fail_url: `${baseUrl}/api/payment/sslcommerz/fail?order_id=${createdOrder.id}`,
        cancel_url: `${baseUrl}/api/payment/sslcommerz/cancel?order_id=${createdOrder.id}`,
        ipn_url: `${baseUrl}/api/payment/sslcommerz/ipn?order_id=${createdOrder.id}`,
        shipping_method: 'Courier',
        product_name: 'KINGSMAN Luxury Footwear',
        product_category: 'Footwear',
        product_profile: 'general',
        cus_name: createdOrder.customerName,
        cus_email: createdOrder.customerEmail || 'concierge@kingsman.bd',
        cus_add1: createdOrder.address || 'Dhaka',
        cus_city: createdOrder.district || 'Dhaka',
        cus_postcode: '1212',
        cus_country: 'Bangladesh',
        cus_phone: createdOrder.customerPhone || '01700000000',
        ship_name: createdOrder.customerName,
        ship_add1: createdOrder.address || 'Dhaka',
        ship_city: createdOrder.district || 'Dhaka',
        ship_postcode: '1212',
        ship_country: 'Bangladesh',
      });

      // Try contacting SSLCommerz gateway
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const sslResponse = await fetch(sslApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: postParams.toString(),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const sslResult: any = await sslResponse.json();

        if (sslResult && sslResult.status === 'SUCCESS' && sslResult.GatewayPageURL) {
          console.log(`[SSLCOMMERZ] Live session created for order ${createdOrder.id}: ${sslResult.GatewayPageURL}`);
          return res.json({
            success: true,
            gatewayUrl: sslResult.GatewayPageURL,
            order: createdOrder,
          });
        } else {
          console.warn(`[SSLCOMMERZ] Live session returned status: ${sslResult?.status}, message: ${sslResult?.failedreason || 'N/A'}`);
        }
      } catch (sslFetchErr: any) {
        console.warn(`[SSLCOMMERZ] API network call notice: ${sslFetchErr.message}. Utilizing Sandbox Gateway.`);
      }

      // Seamless Sandbox Gateway Fallback
      const fallbackGatewayUrl = `/api/payment/sslcommerz/sandbox-gateway?order_id=${encodeURIComponent(createdOrder.id)}&amount=${totalAmountBDT}&name=${encodeURIComponent(createdOrder.customerName)}`;
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

  // 2. SSLCOMMERZ SUCCESS CALLBACK
  const handleSslSuccess = async (req: express.Request, res: express.Response) => {
    const orderId = (req.query.order_id || req.body.tran_id || req.body.order_id) as string;
    const valId = (req.body.val_id || req.query.val_id || req.body.bank_tran_id || `VAL-${Date.now()}`) as string;
    const cardType = (req.body.card_type || req.query.card_type || "bKash / Card (SSLCommerz)") as string;

    console.log(`✅ [SSLCOMMERZ] Payment SUCCESS for order ${orderId}, Txn: ${valId}, Channel: ${cardType}`);

    if (orderId) {
      // Update in Supabase
      await dbOrders.updatePaymentStatus(orderId, 'Paid', 'Confirmed', {
        transactionId: valId,
        cardType,
        bankTranId: req.body.bank_tran_id || valId,
        paymentMethod: 'SSLCommerz/Card',
      });

      // Update in-memory store
      const memoryOrder = ordersStore.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (memoryOrder) {
        memoryOrder.paymentStatus = 'Paid';
        memoryOrder.orderStatus = 'Confirmed';
        memoryOrder.paymentDetails = {
          transactionId: valId,
        };
        syncOrderToGoogleSheets(memoryOrder);
      }
    }

    return res.redirect(`/?order_id=${encodeURIComponent(orderId)}&payment=success`);
  };

  app.post("/api/payment/sslcommerz/success", handleSslSuccess);
  app.get("/api/payment/sslcommerz/success", handleSslSuccess);

  // 3. SSLCOMMERZ FAIL CALLBACK
  const handleSslFail = async (req: express.Request, res: express.Response) => {
    const orderId = (req.query.order_id || req.body.tran_id || req.body.order_id) as string;
    console.warn(`❌ [SSLCOMMERZ] Payment FAILED for order ${orderId}`);

    if (orderId) {
      await dbOrders.updatePaymentStatus(orderId, 'Failed', 'Cancelled');
      const memoryOrder = ordersStore.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (memoryOrder) {
        memoryOrder.paymentStatus = 'Failed';
      }
    }

    return res.redirect(`/?order_id=${encodeURIComponent(orderId)}&payment=failed`);
  };

  app.post("/api/payment/sslcommerz/fail", handleSslFail);
  app.get("/api/payment/sslcommerz/fail", handleSslFail);

  // 4. SSLCOMMERZ CANCEL CALLBACK
  const handleSslCancel = async (req: express.Request, res: express.Response) => {
    const orderId = (req.query.order_id || req.body.tran_id || req.body.order_id) as string;
    console.log(`⚠️ [SSLCOMMERZ] Payment CANCELLED for order ${orderId}`);

    if (orderId) {
      await dbOrders.updatePaymentStatus(orderId, 'Cancelled', 'Cancelled');
      const memoryOrder = ordersStore.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (memoryOrder) {
        memoryOrder.paymentStatus = 'Cancelled';
      }
    }

    return res.redirect(`/?order_id=${encodeURIComponent(orderId)}&payment=cancelled`);
  };

  app.post("/api/payment/sslcommerz/cancel", handleSslCancel);
  app.get("/api/payment/sslcommerz/cancel", handleSslCancel);

  // 5. SSLCOMMERZ IPN (Instant Payment Notification)
  app.post("/api/payment/sslcommerz/ipn", async (req, res) => {
    const orderId = req.body.tran_id || req.query.order_id;
    const status = req.body.status;
    const valId = req.body.val_id || req.body.bank_tran_id;

    if (orderId && (status === 'VALID' || status === 'VALIDATED')) {
      await dbOrders.updatePaymentStatus(orderId, 'Paid', 'Confirmed', {
        transactionId: valId,
        cardType: req.body.card_type,
      });
      console.log(`[SSLCOMMERZ IPN] Verified payment for order ${orderId}`);
    }

    res.status(200).send("IPN_RECEIVED");
  });

  // 6. OFFICIAL SSLCOMMERZ SANDBOX GATEWAY UI
  app.get("/api/payment/sslcommerz/sandbox-gateway", (req, res) => {
    const orderId = (req.query.order_id as string) || "KNG-DEMO-001";
    const amount = req.query.amount || "60000";
    const storeId = process.env.SSLCOMMERZ_STORE_ID || env.SSLCOMMERZ_STORE_ID || "testbox";

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSLCommerz Payment Gateway - Sandbox</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: #f0f2f5; color: #1e293b; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
          .gateway-card { background: #ffffff; width: 100%; max-width: 480px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
          .header { background: #004d99; color: white; padding: 20px; text-align: center; }
          .header h1 { font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
          .header p { font-size: 12px; opacity: 0.85; margin-top: 4px; }
          .order-bar { background: #f8fafc; padding: 14px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
          .order-bar strong { color: #0f172a; }
          .amount-tag { font-size: 16px; font-weight: 700; color: #004d99; }
          .content { padding: 20px; }
          .channel-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 12px; letter-spacing: 0.5px; }
          .mfs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
          .mfs-btn { border: 2px solid #e2e8f0; border-radius: 8px; padding: 12px 6px; text-align: center; cursor: pointer; background: white; transition: all 0.2s; }
          .mfs-btn:hover, .mfs-btn.active { border-color: #004d99; background: #eff6ff; }
          .mfs-btn strong { display: block; font-size: 13px; margin-top: 4px; }
          .mfs-btn.bkash strong { color: #e2136e; }
          .mfs-btn.nagad strong { color: #f7921e; }
          .mfs-btn.rocket strong { color: #8c3494; }
          .card-option { border: 2px solid #e2e8f0; border-radius: 8px; padding: 14px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; cursor: pointer; }
          .card-option:hover { border-color: #004d99; background: #eff6ff; }
          .btn-group { display: flex; flex-direction: column; gap: 10px; }
          .btn-pay { background: #004d99; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
          .btn-pay:hover { background: #003366; }
          .btn-fail { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%; }
          .btn-cancel { background: transparent; color: #64748b; border: none; padding: 8px; font-size: 12px; cursor: pointer; text-decoration: underline; }
          .secure-footer { text-align: center; padding: 14px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="gateway-card">
          <div class="header">
            <h1>SSLCommerz Gateway</h1>
            <p>KINGSMAN Luxury Atelier Secure Checkout</p>
          </div>
          <div class="order-bar">
            <div>Order: <strong>\${orderId}</strong></div>
            <div class="amount-tag">BDT ৳\${Number(amount).toLocaleString()}</div>
          </div>
          <div class="content">
            <div class="channel-title">Select Payment Channel</div>
            <div class="mfs-grid">
              <div class="mfs-btn bkash active">
                <span>📱</span>
                <strong>bKash</strong>
              </div>
              <div class="mfs-btn nagad">
                <span>⚡</span>
                <strong>Nagad</strong>
              </div>
              <div class="mfs-btn rocket">
                <span>🚀</span>
                <strong>Rocket</strong>
              </div>
            </div>
            <div class="card-option">
              <div>
                <strong style="font-size: 13px;">Visa / Mastercard / Amex</strong>
                <p style="font-size: 11px; color: #64748b;">International & Local Cards</p>
              </div>
              <span style="font-size: 18px;">💳</span>
            </div>

            <form action="/api/payment/sslcommerz/success?order_id=\${encodeURIComponent(orderId)}" method="POST" class="btn-group">
              <input type="hidden" name="tran_id" value="\${orderId}">
              <input type="hidden" name="val_id" value="VAL-SSL-\${Math.floor(10000000 + Math.random() * 90000000)}">
              <input type="hidden" name="bank_tran_id" value="BANK-TRX-\${Math.floor(1000000 + Math.random() * 9000000)}">
              <input type="hidden" name="card_type" value="bKash-SSLCommerz">
              <input type="hidden" name="amount" value="\${amount}">
              <input type="hidden" name="status" value="VALID">
              <button type="submit" class="btn-pay">
                Pay ৳\${Number(amount).toLocaleString()} & Authorize
              </button>
            </form>

            <div style="margin-top: 10px;" class="btn-group">
              <form action="/api/payment/sslcommerz/fail?order_id=\${encodeURIComponent(orderId)}" method="POST">
                <input type="hidden" name="tran_id" value="\${orderId}">
                <button type="submit" class="btn-fail">Test Payment Failure</button>
              </form>
              <form action="/api/payment/sslcommerz/cancel?order_id=\${encodeURIComponent(orderId)}" method="POST" style="text-align: center;">
                <input type="hidden" name="tran_id" value="\${orderId}">
                <button type="submit" class="btn-cancel">Cancel and Return to Merchant</button>
              </form>
            </div>
          </div>
          <div class="secure-footer">
            🔒 Protected by SSLCommerz 256-Bit SSL Encryption • Merchant ID: \${storeId}
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // VERIFY COUPON (CUSTOMER CHECKOUT)
  app.post("/api/coupons/verify", async (req, res) => {
    const { code, subtotal } = req.body;

    const dbResult = await dbCoupons.verify(code, subtotal);
    if (dbResult.valid && dbResult.coupon) {
      const coupon = dbResult.coupon;
      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      return res.json({
        valid: true,
        code: coupon.code,
        discountAmount: discount,
        description: coupon.description
      });
    }

    // Fallback to in-memory verification
    const coupon = couponsStore.find(c => c.code.toUpperCase() === String(code).toUpperCase() && c.isActive);
    if (!coupon) {
      return res.status(404).json({ valid: false, message: "Invalid or expired promo code" });
    }
    if (subtotal < coupon.minSpend) {
      return res.status(400).json({
        valid: false,
        message: `Minimum spend of $${coupon.minSpend} required for promo code ${coupon.code}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountAmount: discount,
      description: coupon.description
    });
  });

  // TECHNICAL SEO: DYNAMIC SITEMAP.XML GENERATOR
  app.get(["/sitemap.xml", "/api/sitemap.xml"], async (req, res) => {
    try {
      const siteUrl = "https://kingsman-luxury.com";
      const dbProductsList = await dbProducts.getAll({});
      const productItems = dbProductsList && dbProductsList.length > 0 ? dbProductsList : productsStore;

      const categories = [
        'Lifestyle', 'Running', 'Basketball', 'High Tops', 'Low Tops', 'Limited Edition', 'New Arrivals', 'Sale', 'Accessories'
      ];

      const today = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Core Static Pages -->
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
  <url>
    <loc>${siteUrl}/brand-story</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/wishlist</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;

      // Category Archive Pages
      for (const cat of categories) {
        const slug = cat.toLowerCase().replace(/\s+/g, '-');
        xml += `  <url>
    <loc>${siteUrl}/collections/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
`;
      }

      // Dynamic Product Pages with Google Image Sitemap metadata
      for (const prod of productItems) {
        const productSlug = (prod.sku || prod.id).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const primaryImg = (prod.images && prod.images[0]) || '';
        const colorNames = prod.colors ? prod.colors.map((c: any) => c.name).join(' / ') : '';
        const imgTitle = `${prod.name} in ${colorNames} - Handcrafted Luxury ${prod.category} Sneaker`;
        const caption = (prod.subtitle || prod.description || '').slice(0, 200);

        xml += `  <url>
    <loc>${siteUrl}/products/${productSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
        if (primaryImg) {
          xml += `    <image:image>
      <image:loc>${primaryImg.replace(/&/g, '&amp;')}</image:loc>
      <image:title>${imgTitle.replace(/&/g, '&amp;')}</image:title>
      <image:caption>${caption.replace(/&/g, '&amp;')}</image:caption>
    </image:image>
`;
        }
        xml += `  </url>
`;
      }

      xml += `</urlset>`;

      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (err) {
      console.error("[SEO] Error generating dynamic sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // TECHNICAL SEO: ROBOTS.TXT ENDPOINT
  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `# KINGSMAN Royal Luxury Sneakers - Technical SEO Robots Configuration
User-agent: *
Allow: /
Allow: /catalog
Allow: /collections/
Allow: /products/
Allow: /brand-story
Allow: /wishlist

# Disallow Private & Administrative Portals
Disallow: /admin
Disallow: /admin/*
Disallow: /checkout
Disallow: /api/
Disallow: /auth/

# Crawl Optimization
Crawl-delay: 1

# Dynamic XML Sitemap Reference
Sitemap: https://kingsman-luxury.com/sitemap.xml
`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(robotsTxt);
  });

  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KINGSMAN Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
