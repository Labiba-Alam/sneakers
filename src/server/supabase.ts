import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_COUPONS } from '../data/coupons';
import { Product, Order, Coupon, CartItem, InventoryLog, CustomerAccount } from '../types';

let supabaseClient: SupabaseClient | null = null;
let isSupabaseConfiguredState = false;

// Quick lookup map for template static assets (colors, images, craftsmanship)
const initialProductsMap = new Map<string, Product>();
INITIAL_PRODUCTS.forEach(p => initialProductsMap.set(p.id, p));

/**
 * Checks whether Supabase connection parameters are valid and configured
 */
export function isSupabaseConfigured(): boolean {
  const url = (process.env.SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  return Boolean(
    url &&
    serviceKey &&
    !url.includes('your-project') &&
    !serviceKey.includes('your-service-role-key') &&
    url.startsWith('https://')
  );
}

/**
 * Initialize Supabase Client with Service Role Key for server-side persistence.
 */
export function initSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = (process.env.SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (isSupabaseConfigured()) {
    try {
      supabaseClient = createClient(url, serviceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      isSupabaseConfiguredState = true;
      console.log('✅ [SUPABASE] Connected successfully to Supabase PostgreSQL Database.');
      return supabaseClient;
    } catch (err: any) {
      console.error('⚠️ [SUPABASE] Initialization error:', err.message);
    }
  }

  isSupabaseConfiguredState = false;

  if (process.env.NODE_ENV === 'production') {
    console.error('🚨 [PRODUCTION DATABASE ERROR] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in production. In-memory mode is strictly forbidden in production.');
  } else {
    console.warn('[WARNING] Supabase is not configured. Running with in-memory database fallback (Allowed only in local development).');
  }

  return null;
}

export function isSupabaseActive(): boolean {
  return isSupabaseConfiguredState && supabaseClient !== null;
}

/**
 * One-time Seeder: Populates Supabase tables with initial products & coupons if empty.
 */
export async function seedSupabaseIfEmpty(): Promise<void> {
  if (!supabaseClient) return;

  try {
    const { count, error: countErr } = await supabaseClient
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countErr) {
      console.warn('⚠️ [SUPABASE] Could not check products count:', countErr.message);
      return;
    }

    if (count === 0 || count === null) {
      console.log('🌱 [SUPABASE SEED] Products table is empty. Seeding initial catalog and coupons...');

      // 1. Seed Products in batches of 20
      for (let i = 0; i < INITIAL_PRODUCTS.length; i += 20) {
        const batch = INITIAL_PRODUCTS.slice(i, i + 20).map(p => ({
          id: p.id,
          name: p.name,
          subtitle: p.subtitle || '',
          price: p.price,
          original_price: p.originalPrice || p.price,
          discount_percent: p.discountPercent || 0,
          stock: p.stock,
          sku: p.sku,
          category: p.category,
          department: p.department || 'Sneakers',
          brand: p.brand || null,
          clothing_type: p.clothingType || null,
          gender: p.gender || 'Unisex',
          weight_grams: p.weightGrams || 1100,
          slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: p.description || '',
          materials: p.materials || 'Premium Materials',
          care_instructions: p.careInstructions || 'Clean with damp cloth and mild cleanser.',
          is_featured: p.isFeatured || false,
          is_new_arrival: p.isNewArrival || false,
          is_best_seller: p.isBestSeller || false,
          is_limited_edition: p.isLimitedEdition || false,
          rating: p.rating || 5.0,
          review_count: p.reviewCount || 0,
        }));

        const { error: prodErr } = await supabaseClient.from('products').upsert(batch, { onConflict: 'id' });
        if (prodErr) {
          console.warn('⚠️ [SUPABASE SEED] Error inserting products batch:', prodErr.message);
        }
      }

      // 2. Seed Product Sizes
      const sizesRows: any[] = [];
      INITIAL_PRODUCTS.forEach(p => {
        const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : [39, 40, 41, 42, 43, 44, 45, 46];
        sizes.forEach(size => {
          const qty = p.sizeStock?.[size] ?? p.sizeStock?.[String(size)] ?? Math.max(1, Math.floor(p.stock / sizes.length));
          const numSize = typeof size === 'number' ? size : parseInt(String(size), 10);
          sizesRows.push({
            product_id: p.id,
            size_name: String(size),
            size_eu: !isNaN(numSize) ? numSize : null,
            stock_quantity: qty,
            is_active: true,
          });
        });
      });

      for (let i = 0; i < sizesRows.length; i += 50) {
        const batch = sizesRows.slice(i, i + 50);
        await supabaseClient.from('product_sizes').upsert(batch);
      }

      // 3. Seed Coupons
      const couponRows = INITIAL_COUPONS.map(c => ({
        code: c.code,
        discount_type: c.discountType,
        discount_value: c.discountValue,
        min_spend: c.minSpend,
        description: c.description,
        is_active: c.isActive,
      }));

      await supabaseClient.from('coupons').upsert(couponRows, { onConflict: 'code' });

      console.log('✅ [SUPABASE SEED] Database seeded successfully with authentic products, sizes, and coupons.');
    }
  } catch (err: any) {
    console.warn('⚠️ [SUPABASE SEED] Exception during database seeding:', err.message);
  }
}

/**
 * Helper to map a Supabase product record + product_sizes into a full frontend Product object.
 */
function mapDbProductToClient(row: any): Product {
  const fallback = initialProductsMap.get(row.id);
  
  const sizeStock: Record<string, number> = {};
  const dbSizes: (string | number)[] = [];

  (row.product_sizes || []).forEach((s: any) => {
    const key = s.size_name || (s.size_eu !== null && s.size_eu !== undefined ? String(s.size_eu) : '');
    if (key) {
      sizeStock[key] = Number(s.stock_quantity);
      const num = Number(key);
      dbSizes.push(!isNaN(num) && String(num) === key ? num : key);
    }
  });

  const isSneaker = row.department === 'Sneakers' || ['Nike', 'Jordan', 'Adidas', 'New Balance', 'Converse', 'Louis Vuitton'].includes(row.category);
  const department = row.department || (isSneaker ? 'Sneakers' : 'Clothing');
  const brand = row.brand || (isSneaker ? (row.category || fallback?.brand || 'Nike') : undefined);
  const clothingType = row.clothing_type || (!isSneaker ? (row.category || fallback?.clothingType || 'T-Shirt') : undefined);
  const category = (isSneaker ? brand : clothingType) || row.category || 'Nike';
  const sizes = dbSizes.length > 0 ? dbSizes : fallback?.sizes || (department === 'Sneakers' ? [39, 40, 41, 42, 43, 44, 45, 46] : ['S', 'M', 'L', 'XL', 'XXL']);

  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || fallback?.subtitle || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : fallback?.originalPrice,
    discountPercent: row.discount_percent !== null ? Number(row.discount_percent) : fallback?.discountPercent,
    stock: Number(row.stock),
    sizeStock: Object.keys(sizeStock).length > 0 ? sizeStock : fallback?.sizeStock,
    sku: row.sku,
    category: category as any,
    department,
    brand,
    clothingType,
    gender: row.gender || fallback?.gender || 'Unisex',
    weightGrams: row.weight_grams ? Number(row.weight_grams) : fallback?.weightGrams || (department === 'Sneakers' ? 1100 : 350),
    slug: row.slug || fallback?.slug || row.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sizes: sizes,
    colors: fallback?.colors || [
      { name: 'Royal Crimson & Gold', hex: '#C1121F' },
      { name: 'Monarch Obsidian Black', hex: '#111111' },
      { name: 'Imperial Ivory White', hex: '#FFFFFF' }
    ],
    images: fallback?.images || [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85'
    ],
    description: row.description || fallback?.description || '',
    craftsmanshipDetails: fallback?.craftsmanshipDetails || [
      'Multi-point quality inspection',
      'Polished gold-tone heel emblem',
      'High-traction anti-slip rubber outsole'
    ],
    materials: row.materials || fallback?.materials || 'Premium Materials',
    careInstructions: row.care_instructions || fallback?.careInstructions || 'Clean sole rubber with a soft damp cloth.',
    isFeatured: Boolean(row.is_featured),
    isNewArrival: Boolean(row.is_new_arrival),
    isBestSeller: Boolean(row.is_best_seller),
    isLimitedEdition: Boolean(row.is_limited_edition),
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count ? Number(row.review_count) : 12,
    tags: fallback?.tags || [category, department, 'Curated'],
  };
}

/**
 * PRODUCTS REPOSITORY
 */
export const dbProducts = {
  async getAll(query: { category?: string; search?: string; featured?: string; limited?: string }): Promise<Product[] | null> {
    if (!supabaseClient) return null;

    try {
      let req = supabaseClient.from('products').select('*, product_sizes(*)').order('created_at', { ascending: false });

      if (query.category && query.category !== 'All') {
        req = req.eq('category', query.category);
      }
      if (query.featured === 'true') {
        req = req.eq('is_featured', true);
      }
      if (query.limited === 'true') {
        req = req.eq('is_limited_edition', true);
      }

      const { data, error } = await req;
      if (error) {
        console.warn('⚠️ [SUPABASE] Error fetching products:', error.message);
        return null;
      }

      let results = (data || []).map(mapDbProductToClient);

      if (query.search) {
        const q = String(query.search).toLowerCase();
        results = results.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }

      return results;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbProducts.getAll:', err.message);
      return null;
    }
  },

  async getById(id: string): Promise<Product | null> {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*, product_sizes(*)')
        .or(`id.eq.${id},sku.eq.${id}`)
        .maybeSingle();

      if (error || !data) return null;
      return mapDbProductToClient(data);
    } catch {
      return null;
    }
  },

  async create(product: Partial<Product>): Promise<Product | null> {
    if (!supabaseClient) return null;

    try {
      const id = product.id || `kng-${Date.now().toString().slice(-6)}`;
      const sku = product.sku || `KNG-CUSTOM-${Math.floor(100 + Math.random() * 900)}`;
      const department = product.department || 'Sneakers';
      const isSneaker = department === 'Sneakers';
      const brand = isSneaker ? (product.brand || 'Nike') : undefined;
      const clothingType = !isSneaker ? (product.clothingType || 'T-Shirt') : undefined;
      const category = (isSneaker ? brand : clothingType) || product.category || 'Nike';

      const row = {
        id,
        name: product.name || 'Custom Silhouette',
        subtitle: product.subtitle || '',
        price: product.price || 500,
        original_price: product.originalPrice || product.price || 500,
        discount_percent: product.discountPercent || 0,
        stock: product.stock || 10,
        sku,
        category,
        department,
        brand: brand || null,
        clothing_type: clothingType || null,
        gender: product.gender || 'Unisex',
        weight_grams: product.weightGrams || (isSneaker ? 1100 : 350),
        slug: product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'silhouette'),
        description: product.description || '',
        materials: product.materials || 'Premium Materials',
        care_instructions: product.careInstructions || '',
        is_featured: product.isFeatured || false,
        is_new_arrival: product.isNewArrival || true,
        is_best_seller: product.isBestSeller || false,
        is_limited_edition: product.isLimitedEdition || false,
        rating: product.rating || 5.0,
        review_count: product.reviewCount || 0,
      };

      const { error } = await supabaseClient.from('products').insert(row);
      if (error) throw error;

      // Insert per-size stock
      const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : (isSneaker ? [40, 41, 42, 43, 44, 45] : ['S', 'M', 'L', 'XL']);
      const sizeRows = sizes.map(size => {
        const numSize = typeof size === 'number' ? size : parseInt(String(size), 10);
        return {
          product_id: id,
          size_name: String(size),
          size_eu: !isNaN(numSize) ? numSize : null,
          stock_quantity: product.sizeStock?.[size] ?? product.sizeStock?.[String(size)] ?? Math.max(1, Math.floor((product.stock || 10) / sizes.length)),
          is_active: true,
        };
      });

      await supabaseClient.from('product_sizes').insert(sizeRows);

      return {
        ...product,
        id,
        sku,
        category: category as any,
        department,
        brand,
        clothingType,
        gender: row.gender,
        weightGrams: row.weight_grams,
        slug: row.slug,
        stock: row.stock,
        rating: row.rating,
        reviewCount: row.review_count,
        sizes,
      } as Product;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbProducts.create:', err.message);
      return null;
    }
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (!supabaseClient) return null;

    try {
      const rowUpdates: any = {};
      if (updates.name !== undefined) rowUpdates.name = updates.name;
      if (updates.subtitle !== undefined) rowUpdates.subtitle = updates.subtitle;
      if (updates.price !== undefined) rowUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) rowUpdates.original_price = updates.originalPrice;
      if (updates.discountPercent !== undefined) rowUpdates.discount_percent = updates.discountPercent;
      if (updates.stock !== undefined) rowUpdates.stock = updates.stock;
      if (updates.sku !== undefined) rowUpdates.sku = updates.sku;
      if (updates.category !== undefined) rowUpdates.category = updates.category;
      if (updates.department !== undefined) rowUpdates.department = updates.department;
      if (updates.brand !== undefined) rowUpdates.brand = updates.brand;
      if (updates.clothingType !== undefined) rowUpdates.clothing_type = updates.clothingType;
      if (updates.gender !== undefined) rowUpdates.gender = updates.gender;
      if (updates.weightGrams !== undefined) rowUpdates.weight_grams = updates.weightGrams;
      if (updates.slug !== undefined) rowUpdates.slug = updates.slug;
      if (updates.description !== undefined) rowUpdates.description = updates.description;
      if (updates.materials !== undefined) rowUpdates.materials = updates.materials;
      if (updates.careInstructions !== undefined) rowUpdates.care_instructions = updates.careInstructions;
      if (updates.isFeatured !== undefined) rowUpdates.is_featured = updates.isFeatured;
      if (updates.isNewArrival !== undefined) rowUpdates.is_new_arrival = updates.isNewArrival;
      if (updates.isBestSeller !== undefined) rowUpdates.is_best_seller = updates.isBestSeller;
      if (updates.isLimitedEdition !== undefined) rowUpdates.is_limited_edition = updates.isLimitedEdition;

      if (Object.keys(rowUpdates).length > 0) {
        const { error } = await supabaseClient.from('products').update(rowUpdates).eq('id', id);
        if (error) throw error;
      }

      // Update per-size stock if provided
      if (updates.sizeStock) {
        for (const [sizeStr, qty] of Object.entries(updates.sizeStock)) {
          const sizeNum = Number(sizeStr);
          await supabaseClient.from('product_sizes').upsert({
            product_id: id,
            size_eu: sizeNum,
            stock_quantity: Number(qty),
            is_active: true,
          }, { onConflict: 'product_id,size_eu' });
        }
      }

      const { data } = await supabaseClient.from('products').select('*, product_sizes(*)').eq('id', id).single();
      return data ? mapDbProductToClient(data) : null;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbProducts.update:', err.message);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!supabaseClient) return false;

    try {
      await supabaseClient.from('product_sizes').delete().eq('product_id', id);
      const { error } = await supabaseClient.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbProducts.delete:', err.message);
      return false;
    }
  },
};

/**
 * ORDERS REPOSITORY (Orders + Order Items + Stock Decrement + Customer + Payments + Inventory Logs)
 */
export const dbOrders = {
  async getAll(query: { phone?: string; orderId?: string }): Promise<Order[] | null> {
    if (!supabaseClient) return null;

    try {
      let req = supabaseClient.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });

      if (query.orderId) {
        req = req.ilike('id', query.orderId);
      }
      if (query.phone) {
        req = req.ilike('customer_phone', `%${query.phone}%`);
      }

      const { data, error } = await req;
      if (error) {
        console.warn('⚠️ [SUPABASE] Error fetching orders:', error.message);
        return null;
      }

      return (data || []).map((row: any): Order => {
        const items: CartItem[] = (row.order_items || []).map((item: any) => {
          const fallbackProduct = initialProductsMap.get(item.product_id) || {
            id: item.product_id,
            name: item.product_name,
            subtitle: '',
            price: Number(item.unit_price),
            stock: 10,
            sku: `KNG-${item.product_id}`,
            category: 'Nike',
            department: 'Sneakers',
            brand: 'Nike',
            gender: 'Unisex',
            slug: `product-${item.product_id}`,
            sizes: [item.selected_size],
            colors: [{ name: item.selected_color, hex: '#C1121F' }],
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'],
            description: '',
            craftsmanshipDetails: [],
            materials: '',
            careInstructions: '',
            isFeatured: false,
            isNewArrival: false,
            isBestSeller: false,
            isLimitedEdition: false,
            rating: 5.0,
            reviewCount: 0,
            tags: [],
          };

          return {
            id: `${item.order_id}-${item.product_id}-${item.selected_size}-${item.selected_color}`,
            product: fallbackProduct,
            selectedSize: Number(item.selected_size),
            selectedColor: {
              name: item.selected_color || 'Royal Gold',
              hex: item.selected_color?.toLowerCase().includes('black') ? '#111111' : '#C1121F',
            },
            quantity: Number(item.quantity),
          };
        });

        return {
          id: row.id,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          customerEmail: row.customer_email || undefined,
          district: row.district,
          area: row.area,
          address: row.address,
          city: row.city,
          notes: row.notes || undefined,
          paymentMethod: row.payment_method,
          paymentStatus: row.payment_status,
          orderStatus: row.order_status,
          items,
          subtotal: Number(row.subtotal),
          discountAmount: Number(row.discount_amount || 0),
          shippingFee: Number(row.shipping_fee || 0),
          total: Number(row.total),
          currency: (row.currency || 'BDT') as any,
          advanceDeliveryFeePaid: Boolean(row.advance_delivery_fee_paid),
          advanceDeliveryFeeTrxId: row.advance_delivery_fee_trx_id || undefined,
          advanceDeliveryFeeMethod: row.advance_delivery_fee_method || undefined,
          remainingAmountDue: row.remaining_amount_due !== undefined ? Number(row.remaining_amount_due) : undefined,
          courierPartner: row.courier_partner || 'Steadfast',
          idempotencyKey: row.idempotency_key || undefined,
          createdAt: row.created_at,
          trackingNumber: row.tracking_number,
        };
      });
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbOrders.getAll:', err.message);
      return null;
    }
  },

  async create(orderData: Partial<Order>): Promise<Order | null> {
    if (!supabaseClient) return null;

    try {
      // 0. Idempotency Check
      if (orderData.idempotencyKey) {
        const { data: existingOrder } = await supabaseClient
          .from('orders')
          .select('*, order_items(*)')
          .eq('idempotency_key', orderData.idempotencyKey)
          .maybeSingle();

        if (existingOrder) {
          console.log(`ℹ️ [SUPABASE IDEMPOTENCY] Order with key ${orderData.idempotencyKey} already exists (${existingOrder.id}).`);
          return {
            id: existingOrder.id,
            idempotencyKey: existingOrder.idempotency_key,
            customerName: existingOrder.customer_name,
            customerPhone: existingOrder.customer_phone,
            customerEmail: existingOrder.customer_email || undefined,
            district: existingOrder.district,
            area: existingOrder.area,
            city: existingOrder.city,
            address: existingOrder.address,
            notes: existingOrder.notes || undefined,
            paymentMethod: existingOrder.payment_method as any,
            paymentStatus: existingOrder.payment_status as any,
            orderStatus: existingOrder.order_status as any,
            items: orderData.items || [],
            subtotal: Number(existingOrder.subtotal),
            discountAmount: Number(existingOrder.discount_amount || 0),
            shippingFee: Number(existingOrder.shipping_fee || 0),
            total: Number(existingOrder.total),
            currency: 'BDT',
            advanceDeliveryFeePaid: Boolean(existingOrder.advance_delivery_fee_paid),
            advanceDeliveryFeeTrxId: existingOrder.advance_delivery_fee_trx_id || undefined,
            advanceDeliveryFeeMethod: existingOrder.advance_delivery_fee_method || undefined,
            remainingAmountDue: Number(existingOrder.remaining_amount_due || 0),
            courierPartner: existingOrder.courier_partner || 'Steadfast',
            createdAt: existingOrder.created_at,
            trackingNumber: existingOrder.tracking_number,
          };
        }
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderId = orderData.id || `KNG-${new Date().getFullYear()}-${randomSuffix}`;
      const trackingNumber = orderData.trackingNumber || `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Ensure Customer record exists/upserted in `customers`
      if (orderData.customerPhone) {
        await supabaseClient.from('customers').upsert(
          {
            full_name: orderData.customerName || 'Valued Customer',
            phone: orderData.customerPhone,
            email: orderData.customerEmail || null,
            district: orderData.district || 'Dhaka',
            area: orderData.area || '',
            address: orderData.address || '',
          },
          { onConflict: 'phone' }
        );
      }

      // 2. Insert into `orders` table
      const isCod = orderData.paymentMethod === 'COD';
      const advancePaid = Boolean(orderData.advanceDeliveryFeePaid || !isCod);
      const remainingDue = orderData.remainingAmountDue ?? (isCod ? Math.max(0, (orderData.total || 0) - (orderData.shippingFee || 100)) : 0);

      const orderRow = {
        id: orderId,
        idempotency_key: orderData.idempotencyKey || null,
        customer_name: orderData.customerName || 'Valued Customer',
        customer_phone: orderData.customerPhone || 'N/A',
        customer_email: orderData.customerEmail || null,
        district: orderData.district || orderData.city || 'Dhaka',
        area: orderData.area || '',
        city: orderData.city || 'Dhaka',
        address: orderData.address || '',
        notes: orderData.notes || null,
        payment_method: orderData.paymentMethod || 'COD',
        payment_status: orderData.paymentStatus || (isCod ? (advancePaid ? 'Delivery Fee Paid' : 'Due') : 'Pending'),
        order_status: 'Pending',
        subtotal: orderData.subtotal || 0,
        discount_amount: orderData.discountAmount || 0,
        shipping_fee: orderData.shippingFee || 100,
        total: orderData.total || 0,
        currency: 'BDT',
        advance_delivery_fee_paid: advancePaid,
        advance_delivery_fee_trx_id: orderData.advanceDeliveryFeeTrxId || null,
        advance_delivery_fee_method: orderData.advanceDeliveryFeeMethod || null,
        remaining_amount_due: remainingDue,
        courier_partner: orderData.courierPartner || 'Steadfast',
        tracking_number: trackingNumber,
      };

      const { error: orderErr } = await supabaseClient.from('orders').insert(orderRow);
      if (orderErr) {
        console.error('⚠️ [SUPABASE] Error inserting order:', orderErr.message);
        throw orderErr;
      }

      // 3. Insert into `order_items` & Atomic Stock Decrement
      const items = orderData.items || [];
      if (items.length > 0) {
        const orderItemRows = items.map(item => ({
          order_id: orderId,
          product_id: item.product.id,
          product_name: item.product.name,
          selected_size: item.selectedSize,
          selected_color: typeof item.selectedColor === 'string' ? item.selectedColor : item.selectedColor?.name || 'Standard',
          unit_price: item.product.price,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
        }));

        const { error: itemErr } = await supabaseClient.from('order_items').insert(orderItemRows);
        if (itemErr) {
          console.warn('⚠️ [SUPABASE] Error inserting order_items:', itemErr.message);
        }

        // Try calling atomic decrement RPC first
        const rpcPayload = items.map(i => ({
          product_id: i.product.id,
          size_eu: i.selectedSize,
          quantity: i.quantity,
        }));

        const { error: rpcErr } = await supabaseClient.rpc('decrement_stock_atomic', {
          p_order_items: rpcPayload,
        });

        if (rpcErr) {
          // If RPC is not yet created on Supabase project, execute resilient direct update
          for (const item of items) {
            try {
              const { data: sizeRow } = await supabaseClient
                .from('product_sizes')
                .select('stock_quantity')
                .eq('product_id', item.product.id)
                .eq('size_eu', item.selectedSize)
                .maybeSingle();

              const currentQty = sizeRow ? sizeRow.stock_quantity : 5;
              const newQty = Math.max(0, currentQty - item.quantity);

              await supabaseClient
                .from('product_sizes')
                .upsert(
                  {
                    product_id: item.product.id,
                    size_eu: item.selectedSize,
                    stock_quantity: newQty,
                    is_active: true,
                  },
                  { onConflict: 'product_id,size_eu' }
                );

              await supabaseClient
                .from('products')
                .update({ stock: Math.max(0, (item.product.stock || 10) - item.quantity) })
                .eq('id', item.product.id);
            } catch (stkErr: any) {
              console.warn(`⚠️ [SUPABASE] Stock update error for ${item.product.id}:`, stkErr.message);
            }
          }
        }
      }

      const createdOrder: Order = {
        id: orderId,
        idempotencyKey: orderData.idempotencyKey,
        customerName: orderRow.customer_name,
        customerPhone: orderRow.customer_phone,
        customerEmail: orderRow.customer_email || undefined,
        district: orderRow.district,
        area: orderRow.area,
        city: orderRow.city,
        address: orderRow.address,
        notes: orderRow.notes || undefined,
        paymentMethod: orderRow.payment_method as any,
        paymentStatus: orderRow.payment_status as any,
        orderStatus: 'Pending',
        items: items,
        subtotal: orderRow.subtotal,
        discountAmount: orderRow.discount_amount,
        shippingFee: orderRow.shipping_fee,
        total: orderRow.total,
        currency: 'BDT',
        advanceDeliveryFeePaid: orderRow.advance_delivery_fee_paid,
        advanceDeliveryFeeTrxId: orderRow.advance_delivery_fee_trx_id || undefined,
        advanceDeliveryFeeMethod: (orderRow.advance_delivery_fee_method as any) || undefined,
        remainingAmountDue: orderRow.remaining_amount_due,
        courierPartner: orderRow.courier_partner as any,
        createdAt: new Date().toISOString(),
        trackingNumber: trackingNumber,
        paymentDetails: orderData.paymentDetails,
      };

      console.log(`✅ [SUPABASE] Order created: ${orderId} (${orderRow.customer_name}) - Total: ৳${orderRow.total}`);
      return createdOrder;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbOrders.create:', err.message);
      return null;
    }
  },

  async updateStatus(orderId: string, status: Order['orderStatus']): Promise<boolean> {
    if (!supabaseClient) return false;

    try {
      const { error } = await supabaseClient
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);

      return !error;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbOrders.updateStatus:', err.message);
      return false;
    }
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: Order['paymentStatus'],
    orderStatus?: Order['orderStatus'],
    extraPaymentDetails?: any
  ): Promise<boolean> {
    if (!supabaseClient) return false;

    try {
      const updatePayload: any = { payment_status: paymentStatus };
      if (orderStatus) {
        updatePayload.order_status = orderStatus;
      }

      const { error } = await supabaseClient
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);

      if (error) {
        console.warn('⚠️ [SUPABASE] Error updating order payment status:', error.message);
      }

      if (extraPaymentDetails) {
        await supabaseClient.from('payments').upsert({
          order_id: orderId,
          payment_method: extraPaymentDetails.paymentMethod || 'SSLCommerz/Card',
          transaction_id: extraPaymentDetails.transactionId || `TXN-SSL-${Date.now()}`,
          card_type: extraPaymentDetails.cardType || null,
          bank_tran_id: extraPaymentDetails.bankTranId || null,
          amount: extraPaymentDetails.amount || 0,
          status: paymentStatus === 'Paid' ? 'Success' : 'Failed',
        }, { onConflict: 'order_id' });
      }

      return !error;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbOrders.updatePaymentStatus:', err.message);
      return false;
    }
  },
};

/**
 * COUPONS REPOSITORY
 */
export const dbCoupons = {
  async verify(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
    if (!supabaseClient) {
      return { valid: false, message: 'Database not initialized' };
    }

    try {
      const { data, error } = await supabaseClient
        .from('coupons')
        .select('*')
        .ilike('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        return { valid: false, message: 'Invalid or expired promo code' };
      }

      const minSpend = Number(data.min_spend || 0);
      if (subtotal < minSpend) {
        return {
          valid: false,
          message: `Minimum spend of $${minSpend} required for promo code ${data.code}`,
        };
      }

      const coupon: Coupon = {
        code: data.code,
        discountType: data.discount_type,
        discountValue: Number(data.discount_value),
        minSpend: minSpend,
        description: data.description || '',
        isActive: Boolean(data.is_active),
      };

      return { valid: true, coupon };
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbCoupons.verify:', err.message);
      return { valid: false, message: 'Coupon verification error' };
    }
  },

  async getAll(): Promise<Coupon[] | null> {
    if (!supabaseClient) return null;

    try {
      const { data, error } = await supabaseClient.from('coupons').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;

      return data.map(c => ({
        code: c.code,
        discountType: c.discount_type,
        discountValue: Number(c.discount_value),
        minSpend: Number(c.min_spend || 0),
        description: c.description || '',
        isActive: Boolean(c.is_active),
      }));
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbCoupons.getAll:', err.message);
      return null;
    }
  },

  async create(coupon: Coupon): Promise<boolean> {
    if (!supabaseClient) return false;

    try {
      const { error } = await supabaseClient.from('coupons').upsert({
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        min_spend: coupon.minSpend,
        description: coupon.description,
        is_active: coupon.isActive,
      }, { onConflict: 'code' });

      return !error;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbCoupons.create:', err.message);
      return false;
    }
  },

  async delete(code: string): Promise<boolean> {
    if (!supabaseClient) return false;

    try {
      const { error } = await supabaseClient.from('coupons').delete().ilike('code', code);
      return !error;
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbCoupons.delete:', err.message);
      return false;
    }
  },
};

/**
 * INVENTORY LOGS REPOSITORY
 */
export const dbInventoryLogs = {
  async getAll(): Promise<InventoryLog[] | null> {
    if (!supabaseClient) return null;

    try {
      const { data, error } = await supabaseClient
        .from('inventory_logs')
        .select('*, products(name)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data) return null;

      return data.map((l: any) => ({
        id: l.id,
        productId: l.product_id,
        productName: l.products?.name || `Silhouette #${l.product_id}`,
        size: Number(l.size_eu),
        previousStock: Number(l.previous_stock),
        newStock: Number(l.new_stock),
        changeReason: l.change_reason,
        timestamp: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        adminUser: l.admin_user || 'System',
      }));
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbInventoryLogs.getAll:', err.message);
      return null;
    }
  },
};

/**
 * WISHLIST REPOSITORY
 */
export const dbWishlist = {
  async getByCustomer(phone: string): Promise<string[] | null> {
    if (!supabaseClient) return null;

    try {
      const { data: customer } = await supabaseClient
        .from('customers')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (!customer) return [];

      const { data, error } = await supabaseClient
        .from('wishlist')
        .select('product_id')
        .eq('customer_id', customer.id);

      if (error || !data) return [];
      return data.map((w: any) => w.product_id);
    } catch (err: any) {
      console.warn('⚠️ [SUPABASE] Exception in dbWishlist.getByCustomer:', err.message);
      return null;
    }
  },
};
