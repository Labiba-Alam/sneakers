# KINGSMAN | Handcrafted Royal Luxury Sneakers

> Bangladesh's highest-converting, ultra-luxurious, mobile-first ecommerce platform built for KINGSMAN Royal Sneakers.

![KINGSMAN Luxury Sneakers](https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80)

---

## 👑 Key Highlights & Capabilities

- **Ultra-Fast Single-View & Drawer Checkout**: Seamless 1-step checkout optimized for Bangladeshi users (bKash, Nagad, SSLCommerz, Cash on Delivery).
- **Atelier Admin Command Suite**: Real-time order management, matrix stock editor, coupon engine, customer VIP tiers, and audit logs.
- **AI Marketing Insights Engine**: Powered by Gemini AI to dynamically generate conversion recovery plans, best-seller tracking, regional delivery heatmaps, and abandoned cart SMS triggers.
- **Technical SEO & JSON-LD**: Automatic generation of `robots.txt`, dynamic `sitemap.xml`, OpenGraph, Twitter Cards, and schema markup (Organization, Product, LocalBusiness, Breadcrumb, FAQ).
- **Progressive Web App (PWA)**: Built-in `manifest.json`, `sw.js` offline cache shell, and custom PWA install prompt for Android/iOS.
- **Production Hardened Security**: Express rate limiting, CSP headers, XSS prevention, Nosniff protection, and Sentry error monitoring integration.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Motion Animations
- **Backend Server**: Node.js, Express, esbuild
- **Database**: Supabase / Firestore Realtime Sync & In-Memory Fallback
- **AI Assistant**: `@google/genai` (Gemini 2.5 Flash)
- **Analytics & Tags**: GA4, GTM, Meta Pixel, Google Ads Conversions

---

## 🚀 Quick Start Guide

```bash
# 1. Install Dependencies
npm install

# 2. Start Development Server
npm run dev

# 3. Production Build
npm run build

# 4. Start Production Server
npm start
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env`:

```env
GEMINI_API_KEY="YOUR_GEMINI_KEY"
APP_URL="https://kingsman-luxury.com"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_META_PIXEL_ID="123456789012345"
RESEND_API_KEY="re_123456789_abcdef"
```

---

## 📖 Documentation Index

- [Deployment Guide](./DEPLOYMENT.md)
- [Setup & Integration Guide](./SETUP_GUIDE.md)
- [Environment Specification](./.env.example)

---

© 2026 KINGSMAN Royal Sneakers. All Rights Reserved.
