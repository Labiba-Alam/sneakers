export type DepartmentType = 'Sneakers' | 'Clothing';

export type SneakerBrand = 'Nike' | 'Jordan' | 'Adidas' | 'New Balance' | 'Converse' | 'Louis Vuitton';

export type ClothingType = 'T-Shirt' | 'Hoodie' | 'Sweatshirt';

export type GenderType = 'Men' | 'Women' | 'Unisex';

export type CategoryType = SneakerBrand | ClothingType;

export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'Rocket';

export type PaymentStatus = 'Pending' | 'Delivery Charge Paid' | 'Paid' | 'Cancelled' | 'Due';

export type OrderStatus = 
  | 'Awaiting Delivery Charge'
  | 'Confirmed'
  | 'Packed'
  | 'Handed to Courier'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Pending'
  | 'Packaging'
  | 'Shipped';

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
  price: number; // in BDT
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  sizeStock?: Record<string | number, number>; // per size stock mapping (e.g. { "40": 5, "M": 3 })
  sku: string;
  department: DepartmentType; // 'Sneakers' | 'Clothing'
  brand?: SneakerBrand; // sneakers only: 'Nike' | 'Jordan' | 'Adidas' | 'New Balance' | 'Converse' | 'Louis Vuitton'
  clothingType?: ClothingType; // clothing only: 'T-Shirt' | 'Hoodie' | 'Sweatshirt'
  gender: GenderType; // 'Men' | 'Women' | 'Unisex'
  category: CategoryType;
  weightGrams: number;
  slug: string;
  sizes: (string | number)[]; // EU 39-46 for sneakers, S, M, L, XL, XXL for clothing
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
  seoTitle?: string;
  seoDescription?: string;
  metaImage?: string;
  ogImage?: string;
  visibility?: 'Draft' | 'Published';
  isArchived?: boolean;
  relatedProductIds?: string[];
  frequentlyBoughtTogetherIds?: string[];
}

export interface CartItem {
  id: string; // unique item key (productId + size + color)
  product: Product;
  selectedSize: string | number;
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

export interface StoreSettings {
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  whatsappNumber: string;
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
  baseWeightGrams: number;
  extraChargePerKg: number;
}

export interface Order {
  id: string;
  idempotencyKey?: string;
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
  currency: 'BDT';
  deliveryChargePaid: boolean;
  deliveryChargePaidAt?: string;
  deliveryChargePaidBy?: string;
  advanceDeliveryFeePaid?: boolean;
  advanceDeliveryFeeTrxId?: string;
  advanceDeliveryFeeMethod?: 'bKash' | 'Nagad' | 'Rocket';
  senderMfsPhone?: string;
  mfsMethod?: 'bKash' | 'Nagad' | 'Rocket';
  remainingAmountDue?: number;
  codAmountToCollect?: number;
  courierPartner?: 'Steadfast' | 'Pathao';
  courierName?: 'Steadfast' | 'Pathao';
  consignmentId?: string;
  totalWeightGrams?: number;
  createdAt: string;
  trackingNumber: string;
  paymentDetails?: {
    transactionId?: string;
    mfsPhone?: string;
  };
}

export interface FilterState {
  department: DepartmentType | 'All';
  category: CategoryType | 'All';
  brand?: SneakerBrand | 'All';
  clothingType?: ClothingType | 'All';
  gender: GenderType | 'All';
  minPrice: number;
  maxPrice: number;
  selectedSizes: (string | number)[];
  selectedColors: string[];
  inStockOnly: boolean;
  isFeaturedOnly: boolean;
  isLimitedOnly: boolean;
  isSaleOnly: boolean;
  isNewArrivalsOnly?: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'oldest' | 'popular' | 'best-selling';
}

export type Currency = 'BDT';

export type ViewState = 
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'admin'
  | 'admin-login'
  | 'brand-story'
  | 'contact'
  | 'wishlist'
  | 'account'
  | 'shipping-policy'
  | 'refund-policy'
  | 'terms'
  | 'privacy-policy';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaData?: Record<string, any>;
}
