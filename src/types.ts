export type CategoryType = 
  | 'Lifestyle'
  | 'Running'
  | 'Basketball'
  | 'High Tops'
  | 'Low Tops'
  | 'Limited Edition'
  | 'New Arrivals'
  | 'Sale'
  | 'Accessories';

export type PaymentMethod = 'COD' | 'SSLCommerz/Card' | 'bKash' | 'Nagad' | 'Rocket';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Due' | 'Cancelled';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Packaging' 
  | 'Ready for Pickup' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export type AdminRole = 'Admin' | 'Manager' | 'Staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'low_stock' | 'new_order' | 'failed_payment' | 'message';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface CategoryDetail {
  id: string;
  name: CategoryType;
  slug: string;
  description: string;
  bannerImage: string;
  productCount: number;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  size: number;
  previousStock: number;
  newStock: number;
  changeReason: 'Sale' | 'Restock' | 'Adjustment' | 'Return';
  timestamp: string;
  adminUser?: string;
}

export interface CustomerAccount {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  address: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  vipTier: 'Member' | 'Royal Platinum' | 'Kingsman Sovereign';
  accountStatus: 'Active' | 'Suspended' | 'VIP';
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  userAvatar?: string;
  userPhotos?: string[];
  likes?: number;
}

export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
  likes?: number;
}

export interface AISizeInput {
  heightCm: number;
  weightKg: number;
  preferredFit: 'Slim' | 'Regular' | 'Loose';
  footLengthCm?: number;
}

export interface AISizeResult {
  recommendedEU: number;
  confidence: number; // e.g. 94%
  reason: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number; // in USD base
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  sizeStock?: Record<number, number>; // per size stock mapping (e.g. { 40: 5, 41: 2, 42: 0 })
  sku: string;
  category: CategoryType;
  sizes: number[]; // EU sizes: 39, 40, 41, 42, 43, 44, 45, 46
  colors: ProductColor[];
  images: string[];
  description: string;
  craftsmanshipDetails: string[];
  materials: string;
  careInstructions: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  brand?: string;
  seoTitle?: string;
  seoDescription?: string;
  metaImage?: string;
  ogImage?: string;
  slug?: string;
  visibility?: 'Draft' | 'Published';
  isArchived?: boolean;
  relatedProductIds?: string[];
  frequentlyBoughtTogetherIds?: string[];
}

export interface CartItem {
  id: string; // unique item key (productId + size + color)
  product: Product;
  selectedSize: number;
  selectedColor: ProductColor;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  description: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  area: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  currency: 'USD' | 'BDT';
  createdAt: string;
  trackingNumber: string;
  paymentDetails?: {
    transactionId?: string;
    mfsPhone?: string;
    cardLast4?: string;
  };
}

export interface FilterState {
  category: CategoryType | 'All';
  minPrice: number;
  maxPrice: number;
  selectedSizes: number[];
  selectedColors: string[];
  inStockOnly: boolean;
  isFeaturedOnly: boolean;
  isLimitedOnly: boolean;
  isSaleOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'oldest' | 'popular' | 'best-selling';
  gender?: 'All' | 'Men' | 'Unisex';
}

export type Currency = 'USD' | 'BDT';

export type ViewState = 
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'admin'
  | 'brand-story'
  | 'wishlist';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaData?: Record<string, any>;
}
