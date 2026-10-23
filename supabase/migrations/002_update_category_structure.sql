-- ==============================================================================
-- KINGSMAN LUXURY SNEAKERS & STREETWEAR — MIGRATION 002:
-- 1. UPDATE CATEGORY STRUCTURE & PRODUCT MODEL
-- 2. MIGRATE / CLEAR OLD CATEGORY VALUES
-- 3. ALPHANUMERIC SIZE SUPPORT FOR CLOTHING & SNEAKERS
-- 4. HARDEN ROW LEVEL SECURITY WITH ZERO PUBLIC POLICIES
-- ==============================================================================

-- 1. ADD NEW COLUMNS TO PRODUCTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Sneakers';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS clothing_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Unisex';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_grams INTEGER DEFAULT 1100;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. MIGRATE & CLEAR OLD CATEGORIES EVERYWHERE IN PRODUCTS TABLE
-- Flags: Limited Edition becomes is_limited_edition flag
UPDATE public.products
SET is_limited_edition = TRUE
WHERE category = 'Limited Edition';

-- Gender: Men Sneakers & Women Sneakers become gender filters
UPDATE public.products
SET gender = 'Men'
WHERE category = 'Men Sneakers';

UPDATE public.products
SET gender = 'Women'
WHERE category = 'Women Sneakers';

-- Map brand / type from existing product content or set appropriate new categories
UPDATE public.products
SET
  department = 'Sneakers',
  brand = CASE
    WHEN name ILIKE '%Jordan%' OR description ILIKE '%Jordan%' THEN 'Jordan'
    WHEN name ILIKE '%Adidas%' OR name ILIKE '%Samba%' OR description ILIKE '%Adidas%' THEN 'Adidas'
    WHEN name ILIKE '%New Balance%' OR name ILIKE '%NB%' OR description ILIKE '%New Balance%' THEN 'New Balance'
    WHEN name ILIKE '%Converse%' OR name ILIKE '%Chuck%' OR description ILIKE '%Converse%' THEN 'Converse'
    WHEN name ILIKE '%Vuitton%' OR name ILIKE '%LV%' OR description ILIKE '%Vuitton%' THEN 'Louis Vuitton'
    ELSE 'Nike'
  END,
  category = CASE
    WHEN name ILIKE '%Jordan%' OR description ILIKE '%Jordan%' THEN 'Jordan'
    WHEN name ILIKE '%Adidas%' OR name ILIKE '%Samba%' OR description ILIKE '%Adidas%' THEN 'Adidas'
    WHEN name ILIKE '%New Balance%' OR name ILIKE '%NB%' OR description ILIKE '%New Balance%' THEN 'New Balance'
    WHEN name ILIKE '%Converse%' OR name ILIKE '%Chuck%' OR description ILIKE '%Converse%' THEN 'Converse'
    WHEN name ILIKE '%Vuitton%' OR name ILIKE '%LV%' OR description ILIKE '%Vuitton%' THEN 'Louis Vuitton'
    ELSE 'Nike'
  END,
  weight_grams = 1100
WHERE category IN (
  'Men Sneakers', 'Women Sneakers', 'High Tops', 'Low Tops',
  'Casual Sneakers', 'Running Shoes', 'Basketball Shoes',
  'Sports Shoes', 'Slides & Sandals', 'Accessories',
  'Lifestyle', 'Running', 'Basketball', 'Limited Edition'
);

-- Map clothing items if any exist
UPDATE public.products
SET
  department = 'Clothing',
  clothing_type = CASE
    WHEN name ILIKE '%Hoodie%' THEN 'Hoodie'
    WHEN name ILIKE '%Sweatshirt%' THEN 'Sweatshirt'
    ELSE 'T-Shirt'
  END,
  category = CASE
    WHEN name ILIKE '%Hoodie%' THEN 'Hoodie'
    WHEN name ILIKE '%Sweatshirt%' THEN 'Sweatshirt'
    ELSE 'T-Shirt'
  END,
  brand = NULL,
  weight_grams = CASE
    WHEN name ILIKE '%Hoodie%' THEN 680
    WHEN name ILIKE '%Sweatshirt%' THEN 520
    ELSE 340
  END
WHERE name ILIKE '%Hoodie%' OR name ILIKE '%Sweatshirt%' OR name ILIKE '%T-Shirt%' OR name ILIKE '%Tee%';

-- Ensure slug is populated for all rows
UPDATE public.products
SET slug = LOWER(REGEXP_REPLACE(CONCAT(category, '-', name), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- 3. SUPPORT ALPHANUMERIC SIZES FOR CLOTHING (S, M, L, XL, XXL) AND SNEAKERS (EU 39-46)
ALTER TABLE public.product_sizes ADD COLUMN IF NOT EXISTS size_name TEXT;
ALTER TABLE public.product_sizes ALTER COLUMN size_eu DROP NOT NULL;

UPDATE public.product_sizes
SET size_name = size_eu::TEXT
WHERE size_name IS NULL AND size_eu IS NOT NULL;

-- 4. ENSURE PAYMENTS AND WISHLIST TABLES EXIST
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    card_type TEXT,
    bank_tran_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Success', 'Failed', 'Pending', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_payments_order UNIQUE (order_id)
);

CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_customer_product_wishlist UNIQUE (customer_id, product_id)
);

-- 5. HARDEN ROW LEVEL SECURITY WITH ZERO PUBLIC POLICIES
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Public can view product sizes" ON public.product_sizes;
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can register or update customer record" ON public.customers;
DROP POLICY IF EXISTS "Anyone can update own customer record" ON public.customers;
DROP POLICY IF EXISTS "Public can view payments" ON public.payments;
DROP POLICY IF EXISTS "Public can view wishlist" ON public.wishlist;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
