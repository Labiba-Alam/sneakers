-- ====================================================
-- KINGSMAN LUXURY SNEAKERS DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Production-Ready Migration Script
-- ====================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  discount_percent INT DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  sku VARCHAR(64) UNIQUE NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT,
  materials TEXT,
  care_instructions TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_limited_edition BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT SIZES & PER-SIZE STOCK TABLE
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(64) REFERENCES public.products(id) ON DELETE CASCADE,
  size_eu INT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(product_id, size_eu)
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL UNIQUE,
  email VARCHAR(255),
  district VARCHAR(100),
  area VARCHAR(100),
  address TEXT,
  reward_points INT DEFAULT 0,
  vip_tier VARCHAR(50) DEFAULT 'Member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR(64) PRIMARY KEY, -- e.g. KSM-2026-000001
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_email VARCHAR(255),
  district VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  payment_method VARCHAR(50) NOT NULL, -- COD, bKash, Nagad, Rocket, SSLCommerz/Card
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Paid, Failed
  order_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Confirmed, Packaging, Ready for Pickup, Shipped, Delivered, Cancelled
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  tracking_number VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(64) REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id VARCHAR(64) REFERENCES public.products(id),
  product_name VARCHAR(255) NOT NULL,
  selected_size INT NOT NULL,
  selected_color VARCHAR(64) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL
);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(64) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
  discount_value NUMERIC(10, 2) NOT NULL,
  min_spend NUMERIC(10, 2) DEFAULT 0.00,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ
);

-- 7. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id VARCHAR(64) REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- 8. INVENTORY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(64) REFERENCES public.products(id),
  size_eu INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  change_reason VARCHAR(50) NOT NULL, -- Sale, Restock, Adjustment, Return
  admin_user VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(64) REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,
  mfs_phone VARCHAR(32),
  card_last4 VARCHAR(4),
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'Atelier Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_product_sizes_prod ON public.product_sizes(product_id);

-- TRIGGER TO AUTOMATICALLY UPDATE UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orders_timestamp
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
