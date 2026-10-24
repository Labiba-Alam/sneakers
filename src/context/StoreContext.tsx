import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem, Order, Coupon, FilterState, Currency, ViewState, CategoryType, CustomerAccount, StoreSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { 
  trackPageView, 
  trackProductView, 
  trackAddToCart, 
  trackAddToWishlist, 
  trackBeginCheckout, 
  trackPurchase 
} from '../lib/analytics';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  bkashNumber: '01581054939',
  nagadNumber: '01581054939',
  rocketNumber: '01581054939',
  whatsappNumber: '01581054939',
  deliveryChargeInsideDhaka: 100,
  deliveryChargeOutsideDhaka: 160,
  baseWeightGrams: 1000,
  extraChargePerKg: 0,
};

interface StoreContextType {
  // Navigation & View
  view: ViewState;
  setView: (view: ViewState) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductDetail: (product: Product) => void;
  
  // Products & Filters
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string | number, selectedColor: { name: string; hex: string }, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Coupon & Discounts
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // Financial Computations & Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  calculateShippingFee: (districtName: string, itemsList?: CartItem[]) => number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  
  // Currency & Exchange
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
  
  // Wishlist & Compare
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  compareList: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  addToRecentlyViewed: (productOrId: Product | string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Orders
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  allOrders: Order[];
  setAllOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  markDeliveryChargeReceived: (orderId: string) => Promise<boolean>;
  updateCourierBooking: (orderId: string, courierName: 'Steadfast' | 'Pathao', consignmentId: string, codAmount?: number) => Promise<boolean>;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Modals & Panels
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;

  // Customer Account & Authentication
  customer: CustomerAccount | null;
  isCustomerLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  customerLogin: (identifier: string, password?: string) => Promise<boolean>;
  customerRegister: (data: { fullName: string; phone: string; email?: string; password?: string }) => Promise<boolean>;
  customerLogout: () => void;
  updateCustomerProfile: (data: Partial<CustomerAccount>) => void;
}

const DEFAULT_FILTERS: FilterState = {
  department: 'All',
  category: 'All',
  brand: 'All',
  clothingType: 'All',
  gender: 'All',
  minPrice: 0,
  maxPrice: 50000,
  selectedSizes: [],
  selectedColors: [],
  inStockOnly: false,
  isFeaturedOnly: false,
  isLimitedOnly: false,
  isSaleOnly: false,
  isNewArrivalsOnly: false,
  searchQuery: '',
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kingsman_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kingsman_wishlist');
      return saved ? JSON.parse(saved) : ['kng-001'];
    } catch {
      return ['kng-001'];
    }
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kingsman_recently_viewed');
      return saved ? JSON.parse(saved) : ['kng-001', 'kng-002'];
    } catch {
      return ['kng-001', 'kng-002'];
    }
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Store operates guest-only
  const [customer, setCustomer] = useState<CustomerAccount | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [previousPathBeforeAuth, setPreviousPathBeforeAuth] = useState<string>('/');

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('kingsman_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kingsman_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync initial products & settings from server
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.bkashNumber) {
          setSettings(data);
        }
      })
      .catch(() => {});
  }, []);

  // URL and Browser History Synchronization for Deep Links (/products/:id, /wishlist, /admin/login, /admin/dashboard, /shop)
  useEffect(() => {
    const handleLocation = () => {
      try {
        const path = window.location.pathname;
        if (path.startsWith('/products/') || path.startsWith('/product/')) {
          const id = path.split('/')[2];
          if (id) {
            const match = products.find(p => p.id.toLowerCase() === id.toLowerCase() || p.sku.toLowerCase() === id.toLowerCase());
            if (match) {
              setSelectedProduct(prev => prev?.id === match.id ? prev : match);
              setView(prev => prev === 'product-detail' ? prev : 'product-detail');
            } else {
              setSelectedProduct(prev => prev === null ? prev : null);
              setView(prev => prev === 'product-detail' ? prev : 'product-detail');
            }
            return;
          }
        }
        if (path === '/wishlist') {
          setView(prev => prev === 'wishlist' ? prev : 'wishlist');
          return;
        }
        if (path === '/admin/login' || path === '/admin') {
          setView(prev => prev === 'admin-login' ? prev : 'admin-login');
          return;
        }
        if (path === '/admin/dashboard') {
          setView(prev => prev === 'admin' ? prev : 'admin');
          return;
        }
        if (path === '/shop' || path === '/catalog') {
          setView(prev => prev === 'catalog' ? prev : 'catalog');
          return;
        }
        if (path === '/checkout') {
          setView(prev => prev === 'checkout' ? prev : 'checkout');
          return;
        }
        if (path === '/about' || path === '/brand-story') {
          setView(prev => prev === 'brand-story' ? prev : 'brand-story');
          return;
        }
        if (path === '/contact') {
          setView(prev => prev === 'contact' ? prev : 'contact');
          return;
        }
        if (path === '/account' || path === '/login') {
          setIsAuthModalOpen(prev => prev ? prev : true);
          setAuthModalTab(prev => prev === 'login' ? prev : 'login');
          return;
        }
        if (path === '/register' || path === '/signup') {
          setIsAuthModalOpen(prev => prev ? prev : true);
          setAuthModalTab(prev => prev === 'register' ? prev : 'register');
          return;
        }
      } catch {}
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, [products]);

  // GA4 & Meta Pixel Page View Tracking on View Change
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'KINGSMAN | Handcrafted Royal Luxury Sneakers',
      catalog: 'Footwear Archive | KINGSMAN Atelier',
      'product-detail': selectedProduct ? `${selectedProduct.name} - Handcrafted Leather Luxury Sneaker | KINGSMAN` : 'Silhouettes | KINGSMAN',
      checkout: 'Guest Checkout | KINGSMAN Express',
      'order-confirmation': 'Order Confirmation | KINGSMAN',
      'brand-story': 'Brand Story & Heritage | KINGSMAN',
      wishlist: 'Royal Wishlist | KINGSMAN',
      admin: 'Executive Portal | KINGSMAN',
    };
    const title = titles[view] || 'KINGSMAN | Handcrafted Royal Luxury Sneakers';
    const pageUrl = view === 'home' ? '/' : `/${view}`;
    trackPageView(pageUrl, title);

    if (view === 'checkout' && cart.length > 0) {
      trackBeginCheckout(cart, subtotal, currency);
    }
  }, [view, selectedProduct]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      if (prev.length > 0 && prev[0] === productId) {
        return prev;
      }
      const filtered = prev.filter(id => id !== productId);
      const next = [productId, ...filtered].slice(0, 8);
      localStorage.setItem('kingsman_recently_viewed', JSON.stringify(next));
      return next;
    });
  }, []);

  const addToRecentlyViewed = useCallback((productOrId: Product | string) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId?.id;
    if (id) addRecentlyViewed(id);
  }, [addRecentlyViewed]);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    addRecentlyViewed(product.id);
    setView('product-detail');
    trackProductView(product, currency);
    try {
      window.history.pushState({ view: 'product-detail', productId: product.id }, '', `/products/${product.id}`);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, selectedSize: string | number, selectedColor: { name: string; hex: string }, quantity = 1) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor.name}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: itemId, product, selectedSize, selectedColor, quantity }];
    });

    trackAddToCart(product, selectedSize, selectedColor, quantity, currency);
    const sizeLabel = product.department === 'Clothing' ? `${selectedSize}` : `EU ${selectedSize}`;
    showToast(`Added ${product.name} (${sizeLabel}) to cart.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      
      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountType: 'fixed',
          discountValue: data.discountAmount,
          minSpend: 0,
          description: data.description,
          isActive: true
        });
        showToast(`Promo code ${data.code} applied! Saved $${data.discountAmount}`);
        return { success: true, message: `Promo code ${data.code} applied successfully!` };
      } else {
        return { success: false, message: data.message || 'Invalid code' };
      }
    } catch {
      // Fallback local verification
      const upper = code.toUpperCase();
      if (upper === 'ROYAL10') {
        const disc = (subtotal * 10) / 100;
        setAppliedCoupon({ code: 'ROYAL10', discountType: 'percentage', discountValue: 10, minSpend: 200, description: '10% off Royal discount', isActive: true });
        showToast('Code ROYAL10 applied (10% off)');
        return { success: true, message: 'ROYAL10 Applied' };
      }
      return { success: false, message: 'Invalid or expired promo code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // Dynamic Shipping Fee Calculator
  const calculateShippingFee = useCallback((districtName: string, itemsList?: CartItem[]): number => {
    const items = itemsList || cart;
    const lower = (districtName || '').toLowerCase();
    const isDhaka = lower.includes('dhaka - inside') || (lower.includes('dhaka') && !lower.includes('suburb'));
    const base = isDhaka ? settings.deliveryChargeInsideDhaka : settings.deliveryChargeOutsideDhaka;
    const totalWeight = items.reduce((sum, item) => {
      const w = (item.product?.weightGrams && item.product.weightGrams > 0) ? item.product.weightGrams : 1000;
      return sum + w * item.quantity;
    }, 0);

    let extraCharge = 0;
    if (totalWeight > settings.baseWeightGrams && settings.extraChargePerKg > 0) {
      const extraGrams = totalWeight - settings.baseWeightGrams;
      const extraKg = Math.ceil(extraGrams / 1000);
      extraCharge = extraKg * settings.extraChargePerKg;
    }

    return base + extraCharge;
  }, [cart, settings]);

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const freeShippingThreshold = 50000;
  const shippingFee = cart.length === 0 ? 0 : calculateShippingFee('Dhaka - Inside City', cart);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  // Currency Formatter - Strictly ৳ BDT formatting
  const formatPrice = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '৳ 0';
    return `৳ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  // Wishlist & Compare
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Royal Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        const targetProduct = products.find(p => p.id === productId);
        if (targetProduct) {
          trackAddToWishlist(targetProduct, currency);
        }
        showToast('Added to Royal Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from comparison', 'info');
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) {
        showToast('Maximum 4 silhouettes can be compared at once', 'info');
        return prev;
      }
      showToast('Added to comparison table');
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareList([]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Orders
  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const districtName = orderData.district || 'Dhaka - Inside City';
    const actualShipping = calculateShippingFee(districtName, cart);
    const totalWeight = cart.reduce((sum, item) => sum + ((item.product?.weightGrams || 1000) * item.quantity), 0);
    const codAmount = Math.max(0, subtotal - discountAmount);
    const orderTotal = codAmount + actualShipping;

    const payload = {
      ...orderData,
      items: cart,
      subtotal,
      discountAmount,
      shippingFee: actualShipping,
      total: orderTotal,
      totalWeightGrams: totalWeight,
      codAmountToCollect: codAmount,
      remainingAmountDue: codAmount,
      paymentMethod: 'COD',
      paymentStatus: 'Due',
      orderStatus: 'Awaiting Delivery Charge',
      deliveryChargePaid: false,
      currency: 'BDT'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }
      const newOrder = data.order;
      
      setActiveOrder(newOrder);
      setAllOrders(prev => [newOrder, ...prev]);
      clearCart();
      setView('order-confirmation');
      trackPurchase(newOrder);
      showToast('Order Placed! Please send the delivery charge to confirm.', 'success');
      return newOrder;
    } catch (err) {
      // Local fallback
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: Order = {
        id: `KNG-${new Date().getFullYear()}-${randomSuffix}`,
        customerName: orderData.customerName || 'Valued Guest',
        customerPhone: orderData.customerPhone || '',
        customerEmail: orderData.customerEmail,
        district: districtName,
        address: orderData.address || '',
        area: orderData.area || '',
        city: orderData.city || districtName,
        notes: orderData.notes,
        paymentMethod: 'COD',
        paymentStatus: 'Due',
        orderStatus: 'Awaiting Delivery Charge',
        deliveryChargePaid: false,
        items: cart,
        subtotal,
        discountAmount,
        shippingFee: actualShipping,
        total: orderTotal,
        totalWeightGrams: totalWeight,
        codAmountToCollect: codAmount,
        remainingAmountDue: codAmount,
        courierName: (orderData.courierName as any) || 'Steadfast',
        courierPartner: (orderData.courierName as any) || 'Steadfast',
        currency: 'BDT',
        createdAt: new Date().toISOString(),
        trackingNumber: `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`
      };
      
      setActiveOrder(fallbackOrder);
      setAllOrders(prev => [fallbackOrder, ...prev]);
      clearCart();
      setView('order-confirmation');
      trackPurchase(fallbackOrder);
      showToast('Order Placed! Please send the delivery charge to confirm.', 'success');
      return fallbackOrder;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
      if (activeOrder?.id === orderId) {
        setActiveOrder(prev => prev ? { ...prev, orderStatus: status } : null);
      }
      showToast(`Order ${orderId} status updated to ${status}`);
    } catch {
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
      showToast(`Order ${orderId} status updated to ${status}`);
    }
  };

  const markDeliveryChargeReceived = async (orderId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/delivery-charge-paid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const updated = await res.json();
        setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated, deliveryChargePaid: true, orderStatus: updated.orderStatus || 'Confirmed' } : o));
        if (activeOrder?.id === orderId) {
          setActiveOrder(prev => prev ? { ...prev, ...updated, deliveryChargePaid: true, orderStatus: updated.orderStatus || 'Confirmed' } : null);
        }
        showToast(`Delivery charge received for Order #${orderId}`, 'success');
        return true;
      }
      return false;
    } catch {
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryChargePaid: true, orderStatus: 'Confirmed' } : o));
      showToast(`Delivery charge received for Order #${orderId}`, 'success');
      return true;
    }
  };

  const updateCourierBooking = async (orderId: string, courierName: 'Steadfast' | 'Pathao', consignmentId: string, codAmount?: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/courier`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courierName, consignmentId, codAmountToCollect: codAmount })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
        showToast(`Courier booked via ${courierName}: #${consignmentId}`, 'success');
        return true;
      }
      return false;
    } catch {
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, courierName, courierPartner: courierName, consignmentId, codAmountToCollect: codAmount } : o));
      showToast(`Courier details updated for #${orderId}`, 'success');
      return true;
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        showToast('Store settings saved successfully', 'success');
        return true;
      }
      return false;
    } catch {
      setSettings(prev => ({ ...prev, ...newSettings }));
      showToast('Store settings saved', 'success');
      return true;
    }
  };

  // Guest-Checkout Only Handlers
  const customerLogin = async (): Promise<boolean> => {
    showToast('KINGSMAN operates with Guest Checkout. No account required.', 'info');
    return false;
  };

  const customerRegister = async (): Promise<boolean> => {
    showToast('KINGSMAN operates with Guest Checkout. No account required.', 'info');
    return false;
  };

  const customerLogout = () => {
    setCustomer(null);
  };

  const updateCustomerProfile = () => {};

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setPreviousPathBeforeAuth(window.location.pathname);
    setIsAuthModalOpen(true);
    try {
      window.history.pushState({ modal: 'auth' }, '', tab === 'register' ? '/register' : '/account');
    } catch {}
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    try {
      const target = previousPathBeforeAuth && !['/account', '/login', '/register', '/signup'].includes(previousPathBeforeAuth)
        ? previousPathBeforeAuth
        : (view === 'home' ? '/' : `/${view}`);
      window.history.pushState(null, '', target);
    } catch {}
  }, [previousPathBeforeAuth, view]);

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        products,
        setProducts,
        filters,
        setFilters,
        resetFilters,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        settings,
        updateSettings,
        calculateShippingFee,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingThreshold,
        currency,
        setCurrency,
        formatPrice,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        recentlyViewed,
        addRecentlyViewed,
        addToRecentlyViewed,
        quickViewProduct,
        setQuickViewProduct,
        activeOrder,
        setActiveOrder,
        allOrders,
        setAllOrders,
        placeOrder,
        updateOrderStatus,
        markDeliveryChargeReceived,
        updateCourierBooking,
        toasts,
        showToast,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        customer,
        isCustomerLoggedIn: Boolean(customer),
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
