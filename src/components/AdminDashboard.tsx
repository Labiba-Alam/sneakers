import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, InventoryLog, AdminUser, AdminRole, Coupon, AdminNotification } from '../types';
import { AdminAuthModal } from './admin/AdminAuthModal';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminHeader } from './admin/AdminHeader';

// Lazy-loaded Admin Tabs (Isolates Recharts and Heavy Sub-modules)
const AdminHome = lazy(() => import('./admin/AdminHome').then(m => ({ default: m.AdminHome })));
const AdminOrders = lazy(() => import('./admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminProducts = lazy(() => import('./admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminCategories = lazy(() => import('./admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminInventory = lazy(() => import('./admin/AdminInventory').then(m => ({ default: m.AdminInventory })));
const AdminCustomers = lazy(() => import('./admin/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminCoupons = lazy(() => import('./admin/AdminCoupons').then(m => ({ default: m.AdminCoupons })));
const AdminReviews = lazy(() => import('./admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminAnalytics = lazy(() => import('./admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminMarketing = lazy(() => import('./admin/AdminMarketing').then(m => ({ default: m.AdminMarketing })));
const AdminSettings = lazy(() => import('./admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminNotificationsModal = lazy(() => import('./admin/AdminNotificationsModal').then(m => ({ default: m.AdminNotificationsModal })));
const AdminGlobalSearchModal = lazy(() => import('./admin/AdminGlobalSearchModal').then(m => ({ default: m.AdminGlobalSearchModal })));

const AdminTabFallback: React.FC = () => (
  <div className="h-96 flex flex-col items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#C7A55B]/20 border-t-[#C7A55B] rounded-full animate-spin mb-3" />
    <span className="text-xs text-white/50 tracking-wider uppercase font-mono">Loading Atelier Module...</span>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { products, setProducts, allOrders, setAllOrders, updateOrderStatus, setView, showToast } = useStore();
  
  // Authentication & Session State - Require verified server-side session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    id: 'adm-guest',
    name: 'Lord Sterling',
    email: 'admin@kingsman.royal',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  // Check active server-side httpOnly cookie session on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/session', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Active Tab State
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Theme Mode
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Modals Overlay State
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState<boolean>(false);

  // Local Coupons List State
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);

  // Local Inventory Logs State
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);

  // Fetch Protected Admin Data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/api/admin/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllOrders(data);
      })
      .catch(() => {});

    fetch('/api/admin/coupons', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCouponsList(data);
      })
      .catch(() => {});

    fetch('/api/admin/inventory/logs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInventoryLogs(data);
      })
      .catch(() => {});
  }, [isAuthenticated, setAllOrders]);

  // Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: 'notif-1',
      title: 'Low Stock Alert: Size EU 41',
      message: 'Monarch Black Calfskin size 41 has hit 0 pairs in stock.',
      type: 'low_stock',
      timestamp: '10 mins ago',
      isRead: false,
      linkTab: 'inventory'
    },
    {
      id: 'notif-2',
      title: 'New VIP Order #KNG-9014',
      message: 'Marcus Sterling placed order for ৳14,500 (Awaiting delivery charge via bKash).',
      type: 'new_order',
      timestamp: '25 mins ago',
      isRead: false,
      linkTab: 'orders'
    },
    {
      id: 'notif-3',
      title: 'New Customer Testimonial',
      message: 'A verified customer left a 5-star review for Air Jordan 1 Retro.',
      type: 'message',
      timestamp: '1 hour ago',
      isRead: true,
      linkTab: 'reviews'
    }
  ]);

  // Handlers
  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    showToast(`Authenticated as ${user.name} (${user.role})`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setIsAuthenticated(false);
    showToast('Signed out of Atelier Command Center.');
  };

  const handleChangeRole = (role: AdminRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: role === 'Admin' ? 'Lord Sterling' : role === 'Manager' ? 'Atelier Director' : 'Vault Specialist'
    }));
    showToast(`Role switched to ${role}`);
  };

  const handleUpdateProductStock = (productId: string, sizeStock: Record<number, number>, log: InventoryLog) => {
    const totalQty = Object.values(sizeStock).reduce((a, b) => a + Number(b), 0);
    fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ stock: totalQty, sizeStock })
    }).catch(() => {});

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: totalQty,
          sizeStock: sizeStock
        };
      }
      return p;
    }));
    setInventoryLogs(prev => [log, ...prev]);
    showToast(`Stock updated for ${log.productName}. Total: ${totalQty} pairs`);
  };

  const handleAddProduct = (newProduct: Product) => {
    fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newProduct)
    }).catch(() => {});
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added product: ${newProduct.name}`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    fetch(`/api/admin/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedProduct)
    }).catch(() => {});
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast(`Updated product: ${updatedProduct.name}`);
  };

  const handleDeleteProduct = (productId: string) => {
    fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed from catalog.');
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newCoupon)
    }).catch(() => {});
    setCouponsList(prev => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created.`);
  };

  const handleDeleteCoupon = (code: string) => {
    fetch(`/api/admin/coupons/${code}`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});
    setCouponsList(prev => prev.filter(c => c.code !== code));
    showToast(`Coupon ${code} removed.`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  // Badge calculations
  const pendingOrdersCount = allOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Packaging').length;
  
  const lowStockCount = products.reduce((acc, p) => {
    if (p.sizeStock) {
      return acc + (Object.values(p.sizeStock) as number[]).filter(q => Number(q) <= 3).length;
    }
    return acc + (p.stock <= 5 ? 1 : 0);
  }, 0);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // Session verification loading screen
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-[#C7A55B]/20 border-t-[#C7A55B] rounded-full animate-spin mb-4" />
        <span className="text-xs text-white/60 font-mono tracking-widest uppercase">
          Verifying Atelier Clearance...
        </span>
      </div>
    );
  }

  // Unauthenticated view: strictly display login modal only without rendering dashboard data
  if (!isAuthenticated) {
    return <AdminAuthModal onLoginSuccess={handleLoginSuccess} onCancel={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
      
      {/* Top Header */}
      <AdminHeader
        currentUser={currentUser}
        onChangeRole={handleChangeRole}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationCount={unreadNotifCount}
        onSwitchToStorefront={() => setView('home')}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          currentUser={currentUser}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          badgeCounts={{
            pendingOrders: pendingOrdersCount,
            lowStock: lowStockCount,
            pendingReviews: 1
          }}
        />

        {/* Main Workspace View */}
        <main className={`flex-1 transition-all duration-300 p-4 md:p-6 lg:p-8 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          
          <Suspense fallback={<AdminTabFallback />}>
            {currentTab === 'dashboard' && (
              <AdminHome
                orders={allOrders}
                products={products}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenAddProduct={() => {
                  setCurrentTab('products');
                  setIsAddProductModalOpen(true);
                }}
                onOpenCreateCoupon={() => {
                  setCurrentTab('coupons');
                  setIsCreateCouponModalOpen(true);
                }}
                onSelectOrderDetails={(order) => {
                  setCurrentTab('orders');
                  setSelectedOrderModal(order);
                }}
              />
            )}

            {currentTab === 'orders' && (
              <AdminOrders
                orders={allOrders}
                onUpdateOrderStatus={updateOrderStatus}
                selectedOrderForModal={selectedOrderModal}
                onClearSelectedOrderModal={() => setSelectedOrderModal(null)}
              />
            )}

            {currentTab === 'products' && (
              <AdminProducts
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                isAddModalOpenFromParent={isAddProductModalOpen}
                onCloseAddModalFromParent={() => setIsAddProductModalOpen(false)}
              />
            )}

            {currentTab === 'categories' && (
              <AdminCategories />
            )}

            {currentTab === 'inventory' && (
              <AdminInventory
                products={products}
                onUpdateProductStock={handleUpdateProductStock}
                inventoryLogs={inventoryLogs}
              />
            )}

            {currentTab === 'customers' && (
              <AdminCustomers orders={allOrders} />
            )}

            {currentTab === 'coupons' && (
              <AdminCoupons
                coupons={couponsList}
                onAddCoupon={handleAddCoupon}
                onDeleteCoupon={handleDeleteCoupon}
                isCreateModalOpenFromParent={isCreateCouponModalOpen}
                onCloseCreateModalFromParent={() => setIsCreateCouponModalOpen(false)}
              />
            )}

            {currentTab === 'reviews' && (
              <AdminReviews />
            )}

            {currentTab === 'analytics' && (
              <AdminAnalytics />
            )}

            {currentTab === 'marketing' && (
              <AdminMarketing />
            )}

            {currentTab === 'settings' && (
              <AdminSettings />
            )}
          </Suspense>

        </main>
      </div>

      {/* Global Search Overlay Modal */}
      {isGlobalSearchOpen && (
        <Suspense fallback={null}>
          <AdminGlobalSearchModal
            orders={allOrders}
            products={products}
            coupons={couponsList}
            onClose={() => setIsGlobalSearchOpen(false)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onSelectOrder={(order) => setSelectedOrderModal(order)}
          />
        </Suspense>
      )}

      {/* Notifications Drawer Modal */}
      {isNotificationsOpen && (
        <Suspense fallback={null}>
          <AdminNotificationsModal
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        </Suspense>
      )}

    </div>
  );
};
