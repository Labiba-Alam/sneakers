# KINGSMAN Luxury Sneakers — Production Launch Implementation Blueprint

**Execution Strategy:** Multi-phase production readiness roadmap  
**Database & Platform:** Supabase (PostgreSQL with Row Level Security & Atomic Functions) deployed to Vercel  
**Target Brand:** KINGSMAN — Unisex Premium Streetwear Sneaker Brand (Dhaka, Bangladesh)  
**Currency & Delivery:** Bangladeshi Taka (BDT); Inside Dhaka ৳100, Outside Dhaka ৳160 (Advance delivery fee model)

---

## User Review & Critical Decisions

> [!IMPORTANT]
> This blueprint establishes the transition from a hybrid prototype with generated catalog items, simulated payments, and in-memory persistence to an enterprise-grade, transactional e-commerce engine. Review the core architectural decisions below before proceeding to Phase 2 code execution.

- **Confirmed Decision 1 (Dual-Channel Payment & Delivery Fee Model):** Delivery charges (BDT 100 inside Dhaka, BDT 160 outside Dhaka) must be collected in advance via mobile financial services (bKash/Nagad/Rocket/Card) to confirm orders, while the remaining shoe balance can be paid Cash on Delivery (COD) or fully prepaid. Orders will track `delivery_fee_paid: boolean`, `delivery_fee_trx_id: string`, `remaining_amount_due: number`, and `payment_status: 'unpaid' | 'delivery_fee_paid' | 'paid'`.
- **Confirmed Decision 2 (Atomic Inventory Allocation):** Stock decrements must never occur through read-then-write loops in JavaScript. A native PostgreSQL stored procedure (`decrement_stock_atomic`) will validate and lock `product_sizes` rows inside a transaction, preventing negative balances and race conditions during high-demand drops.
- **Confirmed Decision 3 (Decoupled Order Persistence vs. Reporting):** Supabase PostgreSQL is the sole authoritative transactional database. Google Sheets Apps Script is strictly a one-way, non-blocking webhook reporting destination for fulfillment teams. If the Google Sheet is slow or fails, the order remains safe in Supabase and is queued for background retry.
- **Confirmed Decision 4 (Zero-Fabrication Policy):** All 96 procedurally generated mock products, dummy reviews, fake admin telemetry metrics, and hardcoded test customer lists will be purged or replaced with verified schema seeds. Only genuine products provided via the CSV/Excel template or admin catalog import will be active.

---

## 1. Overview & Core Concept

- **What It Delivers:** A secure, high-performance, responsive e-commerce web application running on Vite/React with an Express/Vercel serverless backend. It provides real-time size-level stock availability, automated cart and coupon calculations in BDT, dynamic district-based delivery fee calculations, verified payment gateway processing, automated multi-recipient order notifications (Customer + Store Owner), admin order management, customer purchase history, and courier tracking preparation.
- **Target Audience:** Streetwear sneaker enthusiasts, collectors, and lifestyle shoppers in Bangladesh seeking premium authentic unisex footwear.
- **Core Value:** Frictionless mobile-first sneaker shopping with transparent advance delivery fee verification, dependable order tracking, zero phantom orders or overselling, and automated order routing to fulfillment couriers (Steadfast and Pathao).

---

## 2. User Experience & Visual Design

- **Visual Identity & Theme:**
  - *Palette:* Editorial luxury dark mode with high-contrast accents: Obsidian canvas (`#09090B`, `#0F0F11`), Charcoal structural cards (`#18181B`, `#27272A`), Crimson accent (`#DC2626`, `#EF4444`), Muted Champagne Gold (`#D4AF37`, `#F59E0B`), and Clean Crisp White typography (`#F8FAFC`).
  - *Aesthetic:* Minimalist brutalist editorial meets premium athletic streetwear. Generous whitespace, razor-sharp hairline borders (`border-white/10`), tabular numerals (`tabular-nums`) for currency and sizing, and anti-slop typography.
  - *Zero-Pill Restraint:* Tags, release dates, and categories formatted with quiet unboxed typography and typographic bullets (`·`), reserving bordered buttons strictly for clickable filters and interactive size selectors.
- **Key User Journeys:**
  - *Discovery to Cart:* Compact hero showcasing the flagship silhouette $\to$ Filterable collection (category, size 39–45, price) $\to$ Product detail with interactive size selector showing exact live stock badge $\to$ Instant slide-out cart drawer.
  - *Checkout & Advance Delivery Verification:* 2-step checkout:
    1. Customer & Shipping details (District selection dynamically toggles ৳100 inside Dhaka vs ৳160 outside Dhaka; displays clear notice: *"Advance delivery fee required to confirm booking"*).
    2. Payment selection: Full Online Prepaid (SSLCommerz / bKash / Nagad / Cards) OR Cash on Delivery with Advance Delivery Fee Verification (customer pays ৳100/৳160 via MFS and enters TrxID + Sender Number, or initiates gateway checkout for the fee).
  - *Confirmation & Post-Purchase:* Clear branded confirmation with Order ID, itemized breakdown, advance payment acknowledgment, Steadfast/Pathao tracking status indicator, and WhatsApp one-click inquiry button.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Serverless Compatibility for Vercel Deployment**
  - *Chosen Approach:* Refactor API routes from stateful long-running Express memory into clean `/api/*` handlers compatible with Vercel Serverless Functions (`api/index.ts` or standalone serverless endpoints) while preserving local `server.ts` for preview development.
  - *Why:* Vercel does not support persistent stateful background daemons. All data must reside in Supabase, and webhooks must execute within standard serverless timeouts (10–15s).
- **Decision 2: Strict Public vs. Private Supabase Clients**
  - *Chosen Approach:* The browser client uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` governed by PostgreSQL Row Level Security (RLS). The backend server/API uses `SUPABASE_SERVICE_ROLE_KEY` exclusively inside `/api/` or `server.ts`.
  - *Why:* Prevents malicious users from tampering with stock, reading other customers' personal addresses or phone numbers, or creating fake "paid" orders.
- **Decision 3: Idempotent Order Creation & Webhook Handling**
  - *Chosen Approach:* Every checkout submission generates a client UUID `idempotency_key`. The server verifies that no order with that key exists before creating rows or deducting stock. Payment callbacks from SSLCommerz or MFS verify signature, store transaction references uniquely, and reject duplicate IPN pings.
  - *Why:* Eliminates double charges and duplicate order entries when customers double-tap the submit button or when gateway webhooks fire multiple retries.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (Vite + React SPA)                        │
│  - Responsive Hero & Product Grid       - Real-time Size Stock Selector      │
│  - Slide-out Cart & Promo Engine (BDT)  - Checkout with Dhaka/Outside Logic  │
│  - Customer Auth (Supabase Client RLS)  - Admin Dashboard & CSV Importer     │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ HTTPS /api/*
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    SERVERLESS API LAYER (Vercel / Node.js)                   │
│  - /api/orders (Idempotency, validation, atomic stock lock)                  │
│  - /api/payment/sslcommerz (Session init, signature verification, IPN)      │
│  - /api/products (Catalogue caching, CSV/Excel import parser)               │
│  - /api/couriers (Pathao & Steadfast shipment booking stubs)                │
└──────────────┬───────────────────────┬──────────────────────────────┬────────┘
               │                       │                              │
               ▼                       ▼                              ▼
┌─────────────────────────┐ ┌────────────────────┐ ┌───────────────────────────┐
│  SUPABASE (PostgreSQL)  │ │ GOOGLE APPS SCRIPT │ │   EMAIL & NOTIFICATIONS   │
│ - products & sizes      │ │ - One-way webhook  │ │ - Resend API / SMTP       │
│ - orders & order_items  │ │ - Live Sheet sync  │ │ - Customer receipt HTML   │
│ - customers & addresses │ │ - Dispatch queue   │ │ - Owner instant alert     │
│ - atomic decrement RPC  │ └────────────────────┘ └───────────────────────────┘
│ - RLS security policies │
└─────────────────────────┘
```

---

## SECTION A: Verified Current-State Audit

| Feature / Component | Audit Classification | Code Finding & Verification Detail |
|---|---|---|
| **Database Connection** | **NOT CONFIGURED** *(In-Memory Fallback)* | `src/server/supabase.ts` lines 23–29: Fallback triggered when `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing. Zero persistence across restarts. |
| **Product Catalogue** | **DUMMY & GENERATED** | `src/data/products.ts`: Contains 6 hardcoded items (`kng-001` through `kng-004`, `kng-acc-01/02`) and 94 algorithmically generated items (`kng-007` to `kng-100`) with cycled Unsplash URLs and synthetic reviews. |
| **Size & Stock Management** | **PARTIALLY IMPLEMENTED** | `src/server/supabase.ts` lines 500–530 has table structure for `product_sizes`, but in-memory execution lacks concurrency locking, allowing race conditions. |
| **Checkout Flow** | **FUNCTIONAL IN MEMORY** | `src/components/CheckoutModal.tsx`: Calculates totals in BDT, validates name, phone, address, and city. Ready for real backend wiring. |
| **Delivery Charges** | **PARTIALLY IMPLEMENTED** | Hardcoded inside `CheckoutModal.tsx` as ৳100 inside Dhaka and ৳160 outside Dhaka. Needs strict alignment with the new advance-payment policy. |
| **Online Payments (SSLCommerz)** | **PARTIALLY IMPLEMENTED** | `server.ts` lines 754–885: Valid SSLCommerz payload structure exists, but defaults to test credentials and serves a fake HTML gateway modal when credentials fail. |
| **Mobile Financial Services (bKash/Nagad/Rocket)** | **UI PLACEHOLDER** | `CheckoutModal.tsx`: Displays logos and radio buttons, but routes everything to the generic SSLCommerz sandbox endpoint. No direct MFS manual TrxID verification. |
| **Google Sheets Sync** | **READY FOR WEBHOOK** | `server.ts` lines 590–672 (`syncOrderToGoogleSheets`) formats order data and posts to `GOOGLE_SHEETS_WEBHOOK_URL`. `GoogleAppsScript.js` is fully scripted but requires Google Sheet deployment. |
| **Email Notifications** | **NOT CONFIGURED** | No email sending library (`resend`, `@sendgrid/mail`, or `nodemailer`) is imported or executed in `server.ts`. Order creation only logs to console. |
| **Analytics (GA4 / GTM / Meta)** | **PARTIALLY CONFIGURED** | `src/lib/analytics.ts` contains real event dispatch functions, but relies on placeholder `.env` keys. `AdminMarketing.tsx` has hardcoded dummy GTM IDs. |
| **Contact & Brand Information** | **DUMMY PLACEHOLDERS** | `src/components/ContactView.tsx` lists dummy Dhanmondi & Gulshan addresses and dummy phone `+880 1711-234567`. Needs real Mirpur 12 details. |
| **Legal & Policy Pages** | **MISSING / INCOMPLETE** | Footer links for Terms & Conditions, Privacy Policy, Shipping Policy, and Refund Policy currently route to hash `#` or trigger generic modals without full policy text. |

---

## SECTION B: Prioritized File-by-File Implementation Plan

### Phase 1: Database Foundation & Schema Migration
- **`supabase/migrations/001_initial_schema.sql` (NEW):**
  - Create tables: `products`, `product_sizes`, `customers`, `orders`, `order_items`, `coupons`, and `inventory_logs`.
  - Create stored procedure: `decrement_stock_atomic(p_order_items JSONB)` with `FOR UPDATE` row-level locks.
  - Enable Row Level Security (RLS) with explicit policies allowing anonymous users to read active products and create guest orders, but restricting customer records and administrative updates to service-role or authenticated admins.
- **`src/server/supabase.ts`:**
  - Enforce strict error bubbling if Supabase credentials are not set in production (disable silent in-memory fallback in production mode).
  - Update `dbOrders.create` to invoke the PostgreSQL RPC `decrement_stock_atomic`.
  - Add idempotent order verification by `idempotency_key`.

### Phase 2: Catalogue & Inventory Refinement
- **`src/data/products.ts`:**
  - Remove all 94 procedurally generated products (`generateCatalog()` loop).
  - Establish a clean, verified seed catalogue containing only real KINGSMAN streetwear products with verified images, descriptions, SKU structure, sizes (39–45), and stock counts.
- **`src/components/admin/ProductManagement.tsx` & `src/server/catalogImport.ts` (NEW):**
  - Implement CSV/Excel parser supporting batch upload of product metadata, category, price, discount price, tags, and size-specific quantities.

### Phase 3: Checkout, Advance Delivery Fee & Payment Logic
- **`src/components/CheckoutModal.tsx`:**
  - Integrate confirmed delivery rules: Inside Dhaka ৳100, Outside Dhaka ৳160.
  - Add explicit "Advance Delivery Fee" confirmation flow for COD:
    - Display clear notice: *"To confirm your Cash on Delivery order, the delivery fee (৳100/৳160) must be paid in advance via bKash/Nagad/Rocket."*
    - Provide input fields for: `Delivery Fee Payment Method`, `Sender Mobile Number`, and `Transaction ID (TrxID)`.
    - Alternatively, allow online payment of just the delivery fee or the full amount via SSLCommerz.
  - Prevent form submission without valid phone number (11-digit Bangladeshi format `01[3-9]XXXXXXXX`) and delivery fee verification.
- **`server.ts` / `/api/payment/sslcommerz.ts`:**
  - Secure SSLCommerz environment configuration (`SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SSLCOMMERZ_IS_LIVE`).
  - Implement secure validation hash check on IPN callback to prevent transaction spoofing.
  - Record payment status accurately: `delivery_fee_paid` vs `fully_paid`.

### Phase 4: Order Synchronization & Notification Services
- **`server.ts` (Email Integration):**
  - Install and configure `resend` (or native fetch to Resend API).
  - Implement `sendOrderConfirmationEmail(order)` to customer: itemized list, pricing in BDT, delivery timeline (1–3 days Dhaka, 2–5 days outside), and support links.
  - Implement `sendAdminNewOrderAlert(order)` to `kingsmanszn@gmail.com` with one-click view link.
- **`GoogleAppsScript.js` & `server.ts`:**
  - Update `syncOrderToGoogleSheets` payload to include: Advance Payment Status, TrxID, Courier Partner, Size Breakdown, and Customer Notes.
  - Implement exponential backoff retry for failed webhook calls to avoid losing records during Google API rate limits.

### Phase 5: Business Information, Legal Policies & SEO
- **`src/components/ContactView.tsx`:**
  - Update verified details: Email `kingsmanszn@gmail.com`, WhatsApp `01581054939`, Address: *Mirpur 12, Block B, Road 3, House 44, Dhaka* (clearly labelled as Corporate & Dispatch Office, No Walk-in Showroom).
  - Wire social links: Facebook, Instagram, TikTok, and Pinterest.
- **`src/components/BrandStory.tsx` & `src/components/layout/Footer.tsx`:**
  - Synchronize social links, contact email, and phone.
  - Remove all remaining placeholder addresses.
- **`src/components/legal/PolicyModals.tsx` (or dedicated routes):**
  - **Shipping Policy:** ৳100 inside Dhaka (1–3 days), ৳160 outside Dhaka (2–5 days); advance delivery fee requirement; Steadfast & Pathao courier fulfillment.
  - **Refund & Return Policy:** 3-day reporting window for damaged, defective, or incorrect items; 7–10 working days refund processing post-approval; hygiene and streetwear condition requirements.
  - **Terms & Conditions:** Ordering terms, BDT currency, order cancellation policies before courier dispatch.
  - **Privacy & Cookies Policy:** Transparent data usage, cookie consent compliant with Bangladesh digital commerce regulations.
- **`src/lib/analytics.ts` & `src/lib/env.ts`:**
  - Remove hardcoded GTM IDs from `AdminMarketing.tsx`.
  - Wire tracking purely via environment variables (`VITE_GA_MEASUREMENT_ID`, `VITE_META_PIXEL_ID`).

---

## SECTION C: CSV / Excel Product Catalog Template Specification

### Required Column Schema

| Column Header | Data Type | Required? | Example Value | Description |
|---|---|---|---|---|
| `sku` | String | **Yes** | `KNG-OZX-BLK` | Unique product identifier |
| `name` | String | **Yes** | `Kingsman Onyx Runner` | Full display name |
| `category` | String | **Yes** | `Sneakers` | Main category (`Sneakers`, `Slides`, `Apparel`) |
| `subCategory` | String | No | `Streetwear` | Sub-category classification |
| `gender` | String | **Yes** | `Unisex` | Target audience (`Unisex`, `Men`, `Women`) |
| `price_bdt` | Number | **Yes** | `4500` | Regular retail price in BDT |
| `sale_price_bdt`| Number | No | `3950` | Discounted price in BDT (if on promotion) |
| `description` | Text | **Yes** | `Handcrafted Italian suede...` | Detailed product overview |
| `material` | String | No | `Full-Grain Leather & Mesh` | Upper and sole material specs |
| `color` | String | **Yes** | `Matte Black / Crimson` | Primary colorway description |
| `images` | String (Comma-sep)| **Yes** | `https://cdn.../1.jpg,https://...`| Direct image URLs (minimum 1, recommended 3+) |
| `is_featured` | Boolean | No | `TRUE` | Display on homepage showcase |
| `is_new_drop` | Boolean | No | `TRUE` | Flag for new arrivals |
| `stock_39` | Integer | **Yes** | `5` | Inventory count for EU Size 39 |
| `stock_40` | Integer | **Yes** | `10` | Inventory count for EU Size 40 |
| `stock_41` | Integer | **Yes** | `15` | Inventory count for EU Size 41 |
| `stock_42` | Integer | **Yes** | `15` | Inventory count for EU Size 42 |
| `stock_43` | Integer | **Yes** | `12` | Inventory count for EU Size 43 |
| `stock_44` | Integer | **Yes** | `8` | Inventory count for EU Size 44 |
| `stock_45` | Integer | **Yes** | `4` | Inventory count for EU Size 45 |

### Import Script Logic
1. Reads CSV/XLSX file via `papaparse` or `xlsx`.
2. Validates each row for duplicate SKUs, positive prices, and valid size numbers.
3. Performs atomic upsert into `products` table, followed by individual upserts into `product_sizes` linking to `product_id`.

---

## SECTION D: Production Deployment & Configuration Checklist (Vercel & Supabase)

### 1. Supabase Setup
- [ ] Create dedicated Supabase project (AWS Singapore / `ap-southeast-1` recommended for lowest latency to Dhaka).
- [ ] Run migration scripts to generate all tables, constraints, foreign keys, and indexes.
- [ ] Execute `decrement_stock_atomic` RPC function.
- [ ] Verify Row Level Security (RLS) is enabled on all tables.
- [ ] Configure Supabase Auth: Enable Email/Password signup for customers, set redirect URLs to production domain.
- [ ] Set Point-in-Time Recovery (PITR) or daily automated backups.

### 2. Vercel Environment Variables Configuration
| Environment Variable | Target Scope | Confidentiality | Description |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Client & Build | Public | Supabase Project REST URL |
| `VITE_SUPABASE_ANON_KEY` | Client & Build | Public | Public Anon Key for browser RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Serverless Only | **STRICT SECRET** | Admin key for order & inventory writes |
| `SSLCOMMERZ_STORE_ID` | Serverless Only | **STRICT SECRET** | Live SSLCommerz Merchant ID |
| `SSLCOMMERZ_STORE_PASSWORD` | Serverless Only | **STRICT SECRET** | Live SSLCommerz Store Password |
| `SSLCOMMERZ_IS_LIVE` | Serverless Only | Public | Set to `true` for production |
| `RESEND_API_KEY` | Serverless Only | **STRICT SECRET** | Key for transactional receipt emails |
| `GOOGLE_SHEETS_WEBHOOK_URL`| Serverless Only | Secret | Deployed Google Apps Script Web App URL |
| `VITE_GA_MEASUREMENT_ID` | Client & Build | Public | Real Google Analytics 4 Measurement ID |
| `VITE_META_PIXEL_ID` | Client & Build | Public | Real Meta Pixel ID |
| `ADMIN_ACCESS_KEY` | Serverless Only | **STRICT SECRET** | Secret token for admin API operations |

---

## SECTION E: Client Intake Questionnaire

Please collect the following items from the KINGSMAN brand owner to finalize the launch:

1. **Initial Product Catalogue:**
   - Completed CSV/Excel sheet using the template in Section C with real product names, photos (hosted or raw image files), BDT pricing, and size-by-size stock quantities.
2. **Payment Gateway Credentials:**
   - SSLCommerz Live Store ID and Live Store Password (if online card/mobile checkout is active immediately).
   - Official bKash Merchant / Personal Cash-in Number (if receiving manual advance delivery fees).
   - Official Nagad & Rocket Numbers (if applicable).
3. **Transactional Email Service:**
   - Resend API key or SMTP credentials for sending order confirmations from `kingsmanszn@gmail.com` or `@kingsmanbd.com`.
4. **Google Sheets Deployment:**
   - A dedicated Google Sheet created under the official brand Google account, with `GoogleAppsScript.js` deployed as a Web App (Access: "Anyone").
5. **Analytics & Ad Pixels:**
   - Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`).
   - Meta (Facebook) Pixel ID (`XXXXXXXXXXXXXXXX`).
6. **Courier Account Details:**
   - Steadfast API Key and Secret (if automated parcel dispatch is desired).
   - Pathao Merchant Client ID and Secret (if automated dispatch is desired).

---

## SECTION F: Architectural Risk Analysis & Safeguards

| Risk Scenario | Potential Impact | Implemented Safeguard |
|---|---|---|
| **Simultaneous Orders for Last Size 42 (Overselling)** | Negative inventory, unfulfillable orders, angry customers. | PostgreSQL `decrement_stock_atomic` function with `SELECT stock FROM product_sizes WHERE product_id = $1 AND size = $2 FOR UPDATE`. If `stock < requested_qty`, the entire transaction aborts with `INSUFFICIENT_STOCK`. |
| **Customer Double-Clicks "Confirm Order"** | Two duplicate orders created, dual stock decrement. | Client generates a unique UUID `idempotency_key` upon opening checkout. Server enforces unique constraint on `orders.idempotency_key`. Subsequent duplicate requests return the existing order record without re-decrementing stock. |
| **Google Apps Script / Sheets API Timeout** | Order creation fails or customer sees error despite database success. | Synchronous decoupling: Order is committed to Supabase first. Google Sheets webhook is executed in a background promise. If it fails, the order ID is logged to an `integration_sync_queue` table for automated retries. |
| **Fake or Altered Payment IPN Callbacks** | Orders marked as paid without real funds received. | SSLCommerz IPN verification executes an explicit server-to-server call to the SSLCommerz `/validator/api/validationserverAPI.php` endpoint checking `val_id`, `amount`, and `currency: BDT` before updating order status. |
| **Unpaid Delivery Fee on COD Orders** | Fake orders dispatched leading to courier return penalty fees. | Orders submitted with COD are explicitly flagged as `payment_status: 'unpaid'`. The admin portal displays an action queue for managers to verify the TrxID with bKash/Nagad before changing status to `approved_for_dispatch`. |
| **Server Secret Exposure in Client Bundle** | Malicious users gain full read/write database or gateway access. | Strict build separation: `SUPABASE_SERVICE_ROLE_KEY`, `SSLCOMMERZ_STORE_PASSWORD`, and `RESEND_API_KEY` are never prefixed with `VITE_` and are only referenced in backend API handlers. |

---

## Next Steps

Once you review and approve this blueprint (or instruct any adjustments), we will proceed with:
1. Creating the Supabase migration script and atomic PostgreSQL inventory decrement function.
2. Cleaning up the mock catalog and wiring the verified brand data and policies.
3. Implementing the advance delivery fee logic inside the checkout modal.
4. Setting up real transactional email alerts and Google Sheets webhook synchronization.
