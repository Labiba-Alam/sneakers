-- ==============================================================================
-- KINGSMAN LUXURY SNEAKERS — PRODUCTION DATABASE SCHEMA & ATOMIC INVENTORY
-- Target Platform: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= 0),
    discount_percent INTEGER DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    materials TEXT,
    care_instructions TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_limited_edition BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT SIZES & ATOMIC INVENTORY (Sizes EU 39 - 46)
CREATE TABLE IF NOT EXISTS public.product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size_eu INTEGER NOT NULL CHECK (size_eu BETWEEN 35 AND 50),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_product_size UNIQUE (product_id, size_eu)
);

-- 4. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    district TEXT NOT NULL DEFAULT 'Dhaka',
    area TEXT,
    address TEXT NOT NULL,
    vip_tier TEXT DEFAULT 'Member' CHECK (vip_tier IN ('Member', 'Royal Platinum', 'Kingsman Sovereign')),
    account_status TEXT DEFAULT 'Active' CHECK (account_status IN ('Active', 'Suspended', 'VIP')),
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE (Supports Advance Delivery Fee & Cash on Delivery)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'SSLCommerz/Card', 'bKash', 'Nagad', 'Rocket')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Due', 'Cancelled', 'Delivery Fee Paid')),
    order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Packaging', 'Ready for Pickup', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 100,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BDT',
    advance_delivery_fee_paid BOOLEAN DEFAULT false,
    advance_delivery_fee_trx_id TEXT,
    advance_delivery_fee_method TEXT,
    remaining_amount_due NUMERIC(10, 2) DEFAULT 0,
    courier_partner TEXT DEFAULT 'Steadfast' CHECK (courier_partner IN ('Steadfast', 'Pathao')),
    tracking_number TEXT UNIQUE NOT NULL,
    payment_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    selected_size INTEGER NOT NULL,
    selected_color TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    size INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    change_reason TEXT NOT NULL CHECK (change_reason IN ('Sale', 'Restock', 'Adjustment', 'Return')),
    admin_user TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_product_sizes_lookup ON public.product_sizes(product_id, size_eu);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency ON public.orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- 10. ATOMIC INVENTORY DECREMENT STORED PROCEDURE (Prevents Overselling)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.decrement_stock_atomic(p_order_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item RECORD;
    v_product_id TEXT;
    v_size_eu INTEGER;
    v_qty INTEGER;
    v_current_stock INTEGER;
    v_new_stock INTEGER;
    v_prod_name TEXT;
BEGIN
    -- Iterate over each item in the order
    FOR item IN SELECT * FROM jsonb_to_recordset(p_order_items) AS x(
        product_id TEXT,
        size_eu INTEGER,
        quantity INTEGER
    )
    LOOP
        v_product_id := item.product_id;
        v_size_eu := item.size_eu;
        v_qty := item.quantity;

        -- 1. Lock the specific size stock row FOR UPDATE to prevent race conditions
        SELECT stock_quantity INTO v_current_stock
        FROM public.product_sizes
        WHERE product_id = v_product_id AND size_eu = v_size_eu
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % size % not found in inventory.', v_product_id, v_size_eu;
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for product % size %. Requested %, available %.',
                v_product_id, v_size_eu, v_qty, v_current_stock;
        END IF;

        v_new_stock := v_current_stock - v_qty;

        -- 2. Decrement size stock
        UPDATE public.product_sizes
        SET stock_quantity = v_new_stock,
            updated_at = NOW()
        WHERE product_id = v_product_id AND size_eu = v_size_eu;

        -- 3. Decrement overall product aggregate stock
        UPDATE public.products
        SET stock = GREATEST(0, stock - v_qty),
            updated_at = NOW()
        WHERE id = v_product_id
        RETURNING name INTO v_prod_name;

        -- 4. Log change in inventory audit trail
        INSERT INTO public.inventory_logs (
            product_id,
            product_name,
            size,
            previous_stock,
            new_stock,
            change_reason,
            admin_user
        ) VALUES (
            v_product_id,
            COALESCE(v_prod_name, v_product_id),
            v_size_eu,
            v_current_stock,
            v_new_stock,
            'Sale',
            'system_order_checkout'
        );
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', 'Inventory decremented atomically.');
END;
$$;

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous users (Storefront visitors): Read active products, sizes, coupons
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Public can view product sizes" ON public.product_sizes
    FOR SELECT USING (true);

CREATE POLICY "Public can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true);

-- Orders: Public can create guest orders
CREATE POLICY "Anyone can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Customers: Public can upsert customer details on checkout
CREATE POLICY "Anyone can register or update customer record" ON public.customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own customer record" ON public.customers
    FOR UPDATE USING (true);
