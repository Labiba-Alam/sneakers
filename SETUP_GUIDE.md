# KINGSMAN Integration & Maintenance Guide

This setup guide explains how to connect external services (Supabase, Google Sheets, GA4, Meta Pixel, Resend) to your KINGSMAN production deployment.

---

## 1. Supabase Setup (Database & Realtime)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL schema script in the Supabase SQL Editor:

```sql
-- Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  stock INT DEFAULT 0,
  size_stock JSONB,
  image TEXT,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_limited_edition BOOLEAN DEFAULT false
);

-- Orders Table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  total NUMERIC NOT NULL,
  order_status TEXT DEFAULT 'Pending',
  payment_status TEXT DEFAULT 'Pending',
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Add your `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env`.

---

## 2. Google Analytics 4 & Tag Manager Setup

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com).
2. Copy your Measurement ID (`G-XXXXXXXXXX`).
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"` in `.env`.
4. Create a GTM container at [tagmanager.google.com](https://tagmanager.google.com) and set `NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"`.

---

## 3. Meta Pixel (Facebook Ads) Setup

1. Go to Meta Events Manager -> Connect Data Sources -> Web.
2. Copy your Pixel ID (`123456789012345`).
3. Set `NEXT_PUBLIC_META_PIXEL_ID="123456789012345"` in `.env`.
4. Automated standard events (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) will fire automatically via `/src/lib/analytics.ts`.

---

## 4. Google Sheets Live Order Logging Setup

The Express server (`/server.ts`) includes a webhook route `/api/sync-sheets`. To connect to a live Google Sheet:
1. Create a Google Apps Script in your spreadsheet:
```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    data.id,
    data.customerName,
    data.customerPhone,
    data.district,
    data.total,
    data.paymentMethod,
    new Date()
  ]);
  return ContentService.createTextOutput("SUCCESS");
}
```
2. Deploy as Web App -> Access: "Anyone".
3. Paste the Web App URL into your environment variables as `GOOGLE_SHEETS_WEBHOOK_URL`.

---

## 5. Maintenance Checklist

- **Daily**: Review low stock alerts in the Admin Inventory Matrix.
- **Weekly**: Check Gemini AI Marketing Recommendations in `/admin` -> `AI Marketing Insights`.
- **Monthly**: Review SSL certificate expiration and review Sentry error logs.
