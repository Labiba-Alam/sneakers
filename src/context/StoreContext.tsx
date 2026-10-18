import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem, Order, Coupon, FilterState, Currency, ViewState, CategoryType, CustomerAccount } from '../types';
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
  addToCart: (product: Product, selectedSize: number, selectedColor: { name: string; hex: string }, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Coupon & Discounts
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // Financial Computations
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
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  
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
  category: 'All',
  minPrice: 0,
  maxPrice: 15000,
  selectedSizes: [],
  selectedColors: [],
  inStockOnly: false,
  isFeaturedOnly: false,
  isLimitedOnly: false,
  isSaleOnly: false,
  searchQuery: '',
  sortBy: 'featured'
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

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Customer Account state with local persistence
  const [customer, setCustomer] = useState<CustomerAccount | null>(() => {
    try {
      const saved = localStorage.getItem('kingsman_customer');
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

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

  // Sync initial products & orders from server and handle payment return callbacks
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // Fallback to initial local products
      });

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllOrders(data);
        }
      })
      .catch(() => {});

    // Check if returning from SSLCommerz Payment Gateway
    try {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('order_id');
      const payment = params.get('payment');

      if (orderId) {
        if (payment === 'success') {
          fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`)
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data) && data.length > 0) {
                const confirmedOrder = data[0];
                setActiveOrder(confirmedOrder);
                setView('order-confirmation');
                setCart([]);
                setAppliedCoupon(null);
                trackPurchase(confirmedOrder);
                showToast('Online Payment Successful! Your order has been confirmed.', 'success');
              }
            })
            .catch(() => {});
        } else if (payment === 'failed') {
          showToast('Online payment could not be completed. Please try again or choose Cash on Delivery.', 'error');
        } else if (payment === 'cancelled') {
          showToast('Online payment was cancelled. Your order remains pending.', 'info');
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {}
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

  const addToCart = (product: Product, selectedSize: number, selectedColor: { name: string; hex: string }, quantity = 1) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor.name}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: itemId, product, selectedSize, selectedColor, quantity }];
    });

    trackAddToCart(product, selectedSize, selectedColor, quantity, currency);
    showToast(`Added ${product.name} (EU ${selectedSize}) to cart.`);
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

  const freeShippingThreshold = 5000; // Complimentary Delivery in Bangladesh over ৳ 5,000
  const shippingFee = subtotal >= freeShippingThreshold || cart.length === 0 ? 0 : 80;
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
    const payload = {
      ...orderData,
      items: cart,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      currency
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const newOrder = data.order;
      
      setActiveOrder(newOrder);
      setAllOrders(prev => [newOrder, ...prev]);
      clearCart();
      setView('order-confirmation');
      trackPurchase(newOrder);
      showToast('Royal Order Placed Successfully!');
      return newOrder;
    } catch (err) {
      // Local fallback
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: Order = {
        id: `KNG-${new Date().getFullYear()}-${randomSuffix}`,
        customerName: orderData.customerName || 'Valued Guest',
        customerPhone: orderData.customerPhone || '',
        customerEmail: orderData.customerEmail,
        district: orderData.district || orderData.city || 'Dhaka',
        address: orderData.address || '',
        area: orderData.area || '',
        city: orderData.city || '',
        notes: orderData.notes,
        paymentMethod: orderData.paymentMethod || 'COD',
        paymentStatus: orderData.paymentMethod === 'COD' ? 'Due' : (orderData.paymentStatus || 'Pending'),
        orderStatus: 'Pending',
        items: cart,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        currency,
        createdAt: new Date().toISOString(),
        trackingNumber: `TRK-KNG-${Math.floor(100000 + Math.random() * 900000)}`
      };
      
      setActiveOrder(fallbackOrder);
      setAllOrders(prev => [fallbackOrder, ...prev]);
      clearCart();
      setView('order-confirmation');
      trackPurchase(fallbackOrder);
      showToast('Royal Order Placed Successfully!');
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
      showToast(`Order ${orderId} status updated to ${status}`);
    } catch {
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
    }
  };

  // Customer Account handlers
  const customerLogin = async (identifier: string, password?: string): Promise<boolean> => {
    const isEmail = identifier.includes('@');
    const userEmail = isEmail ? identifier : (customer?.email || 'alam.labiba003@gmail.com');
    const userPhone = isEmail ? (customer?.phone || '+880 1712-345678') : identifier;
    const namePart = isEmail ? identifier.split('@')[0] : 'Member';
    const userName = namePart.toLowerCase() === 'alam.labiba003' 
      ? 'Labiba Alam' 
      : namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const loggedUser: CustomerAccount = {
      id: customer?.id || 'cst-8801',
      fullName: customer?.fullName || userName,
      phone: userPhone,
      email: userEmail,
      district: customer?.district || 'Dhaka',
      area: customer?.area || 'Gulshan-2',
      address: customer?.address || 'Road 71, House 12, Gulshan-2, Dhaka 1212',
      createdAt: customer?.createdAt || '2024-01-15',
      totalOrders: customer?.totalOrders || 3,
      totalSpent: customer?.totalSpent || 48500,
      vipTier: customer?.vipTier || 'Royal Platinum',
      accountStatus: 'Active',
    };

    setCustomer(loggedUser);
    localStorage.setItem('kingsman_customer', JSON.stringify(loggedUser));
    showToast(`Welcome back, ${loggedUser.fullName}!`, 'success');
    return true;
  };

  const customerRegister = async (data: { fullName: string; phone: string; email?: string; password?: string }): Promise<boolean> => {
    const newCustomer: CustomerAccount = {
      id: 'cst-' + Math.floor(1000 + Math.random() * 9000),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, '.')}@kingsman.royal`,
      district: 'Dhaka',
      area: 'Dhanmondi',
      address: 'House 42, Road 7/A, Dhanmondi, Dhaka 1209',
      createdAt: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      vipTier: 'Member',
      accountStatus: 'Active',
    };

    setCustomer(newCustomer);
    localStorage.setItem('kingsman_customer', JSON.stringify(newCustomer));
    showToast(`Welcome to Kingsman, ${newCustomer.fullName}! Your royal account is active.`, 'success');
    return true;
  };

  const customerLogout = () => {
    setCustomer(null);
    localStorage.removeItem('kingsman_customer');
    showToast('Signed out of Kingsman customer account.', 'info');
  };

  const updateCustomerProfile = (data: Partial<CustomerAccount>) => {
    setCustomer(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('kingsman_customer', JSON.stringify(updated));
      return updated;
    });
    showToast('Customer profile updated.', 'success');
  };

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
        placeOrder,
        updateOrderStatus,
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
