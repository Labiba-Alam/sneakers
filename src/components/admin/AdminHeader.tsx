import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  ChevronDown, 
  ExternalLink, 
  Shield, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { AdminRole, AdminUser, AdminNotification } from '../../types';

interface AdminHeaderProps {
  currentUser: AdminUser;
  onChangeRole: (role: AdminRole) => void;
  onOpenMobileSidebar: () => void;
  onOpenGlobalSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationCount: number;
  onSwitchToStorefront: () => void;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentUser,
  onChangeRole,
  onOpenMobileSidebar,
  onOpenGlobalSearch,
  onOpenNotifications,
  unreadNotificationCount,
  onSwitchToStorefront,
  themeMode,
  onToggleTheme
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#111111]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-6 flex items-center justify-between text-white">
      
      {/* Left section: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
            ATELIER COMMAND CENTER
          </span>
        </div>
      </div>

      {/* Middle section: Search Bar Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#181818] hover:bg-[#202020] border border-white/15 rounded-lg text-xs text-white/60 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-white/40 group-hover:text-[#C7A55B]" />
            <span>Search orders, products, customers, coupons...</span>
          </div>
          <kbd className="hidden md:inline-block text-[10px] px-1.5 py-0.5 bg-white/10 border border-white/20 rounded font-mono text-white/70">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right section: Quick Tools, Notifications, Theme & Profile */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Mobile Search Button */}
        <button
          onClick={onOpenGlobalSearch}
          className="sm:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* View Customer Storefront Button */}
        <button
          onClick={onSwitchToStorefront}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase rounded-md transition-all"
          title="View Live Storefront"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#C1121F] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#111111]">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#C7A55B]/60"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-tight text-white">{currentUser.name}</p>
              <p className="text-[10px] text-[#C7A55B] font-mono leading-none">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-white/15 rounded-lg shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-white/50">{currentUser.email}</p>
              </div>

              {/* Role Switcher */}
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white/50">
                Switch Role (RBAC Demo)
              </div>
              {(['Admin', 'Manager', 'Staff'] as AdminRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    onChangeRole(role);
                    setShowProfileMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded flex items-center justify-between text-xs ${
                    currentUser.role === role ? 'bg-[#C7A55B]/20 text-[#C7A55B] font-bold' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}

              <div className="border-t border-white/10 my-1 pt-1">
                <button
                  onClick={onSwitchToStorefront}
                  className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded flex items-center justify-between"
                >
                  <span>Open Customer Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
