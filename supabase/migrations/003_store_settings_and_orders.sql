-- ==============================================================================
-- KINGSMAN LUXURY SNEAKERS & STREETWEAR — MIGRATION 003:
-- 1. STORE SETTINGS TABLE (MFS NUMBERS, ADVANCE CHARGES, WEIGHT THRESHOLDS)
-- 2. ORDER SCHEMA ENHANCEMENTS FOR ADVANCE DELIVERY CHARGE & COURIER BOOKING
-- 3. ALPHANUMERIC SIZE SUPPORT IN ORDER ITEMS
-- 4. HARDENED ROW LEVEL SECURITY (ZERO PUBLIC POLICIES)
-- ==============================================================================

-- 1. CREATE STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    bkash_number TEXT NOT NULL DEFAULT '01581054939',
    nagad_number TEXT NOT NULL DEFAULT '01581054939',
    rocket_number TEXT NOT NULL DEFAULT '01581054939',
    whatsapp_number TEXT NOT NULL DEFAULT '01581054939',
    delivery_charge_inside_dhaka INTEGER NOT NULL DEFAULT 100,
    delivery_charge_outside_dhaka INTEGER NOT NULL DEFAULT 160,
    base_weight_grams INTEGER NOT NULL DEFAULT 1000,
    extra_charge_per_kg INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings record if empty
INSERT INTO public.store_settings (
    id,
    bkash_number,
    nagad_number,
    rocket_number,
    whatsapp_number,
    delivery_charge_inside_dhaka,
    delivery_charge_outside_dhaka,
    base_weight_grams,
    extra_charge_per_kg
) VALUES (
    'default',
    '01581054939',
    '01581054939',
    '01581054939',
    '01581054939',
    100,
    160,
    1000,
    0
) ON CONFLICT (id) DO NOTHING;

-- 2. ENHANCE ORDERS TABLE WITH ADVANCE DELIVERY CHARGE & COURIER FIELDS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charge_paid BOOLEAN DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charge_paid_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charge_paid_by TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_name TEXT DEFAULT 'Steadfast';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS consignment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cod_amount_to_collect NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS sender_mfs_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS mfs_method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_weight_grams INTEGER DEFAULT 0;

-- Drop and re-add order_status check constraint to support new real lifecycle states
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_order_status_check CHECK (
    order_status IN (
        'Awaiting Delivery Charge',
        'Confirmed',
        'Packed',
        'Handed to Courier',
        'Delivered',
        'Cancelled',
        'Returned',
        'Pending',
        'Packaging',
        'Ready for Pickup',
        'Shipped'
    )
);

-- Update existing orders to have delivery_charge_paid reflect previous advance flag
UPDATE public.orders
SET delivery_charge_paid = COALESCE(advance_delivery_fee_paid, false)
WHERE delivery_charge_paid IS NULL;

-- 3. ALPHANUMERIC SIZE SUPPORT IN ORDER ITEMS (FOR S, M, L, XL, XXL)
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS selected_size_name TEXT;
ALTER TABLE public.order_items ALTER COLUMN selected_size DROP NOT NULL;

UPDATE public.order_items
SET selected_size_name = selected_size::TEXT
WHERE selected_size_name IS NULL AND selected_size IS NOT NULL;

-- 4. HARDEN ROW LEVEL SECURITY
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public can update store settings" ON public.store_settings;
