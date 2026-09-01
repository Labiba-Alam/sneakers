import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tags, 
  Boxes, 
  Users, 
  Ticket, 
  Star, 
  BarChart3, 
  Megaphone, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Crown,
  Sparkles
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';

export type AdminTab = 
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'coupons'
  | 'reviews'
  | 'analytics'
  | 'marketing'
  | 'marketing_insights'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentUser: AdminUser;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  badgeCounts: {
    pendingOrders: number;
    lowStock: number;
    pendingReviews: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
  badgeCounts
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <ShoppingBag className="w-4 h-4" />, 
      badge: badgeCounts.pendingOrders, 
      badgeColor: 'bg-[#C1121F] text-white' 
    },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Tags className="w-4 h-4" /> },
    { 
      id: 'inventory', 
      label: 'Inventory Matrix', 
      icon: <Boxes className="w-4 h-4" />, 
      badge: badgeCounts.lowStock, 
      badgeColor: 'bg-amber-500 text-black font-bold' 
    },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons & Promos', icon: <Ticket className="w-4 h-4" /> },
    { 
      id: 'reviews', 
      label: 'Reviews & Feedback', 
      icon: <Star className="w-4 h-4" />,
      badge: badgeCounts.pendingReviews,
      badgeColor: 'bg-[#C7A55B] text-black'
    },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'marketing', label: 'Marketing & SEO', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'marketing_insights', label: 'AI Marketing Insights', icon: <Sparkles className="w-4 h-4 text-[#C7A55B]" /> },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#111111] text-white border-r border-white/10 select-none">
      
      {/* Sidebar Header */}
      <div className={`p-4 border-b border-white/10 flex items-center justify-between ${isCollapsed ? 'justify-center' : ''}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C7A55B]/20 border border-[#C7A55B]/60 flex items-center justify-center text-[#C7A55B]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-sm font-bold tracking-wider text-white">KINGSMAN</h2>
              <p className="text-[9px] uppercase tracking-widest text-[#C7A55B] font-semibold">Atelier Suite</p>
            </div>
          </div>
        )}

        {/* Collapse toggle button for Desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Admin User Profile Strip */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-[#181818] border-b border-white/10 flex items-center gap-3">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-[#C7A55B]/50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1.5">
              <span className={`inline-block w-2 h-2 rounded-full ${currentUser.role === 'Admin' ? 'bg-[#C1121F]' : currentUser.role === 'Manager' ? 'bg-amber-400' : 'bg-blue-400'}`} />
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">{currentUser.role}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#C1121F] text-white font-bold shadow-md'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-white/60'}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-white/20 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-all font-semibold`}
          title="Sign Out of Atelier"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex">
          <div className="w-64 h-full bg-[#111111] shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
