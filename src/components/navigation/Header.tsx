import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    setIsCartOpen, 
    setIsSearchOpen, 
    setIsOrderTrackingOpen,
    setView,
    wishlist,
    cart,
    openAuthModal,
    customer,
    isCustomerLoggedIn
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogoClick = () => {
    setView('home');
    try {
      window.history.pushState(null, '', '/');
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300">
      {/* Desktop Navigation (>= 1024px) */}
      <div className="hidden lg:block">
        <DesktopNav
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenTracking={() => setIsOrderTrackingOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </div>

      {/* Mobile Top Header Bar (< 1024px) */}
      <div 
        className={`lg:hidden h-16 px-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-black/5' 
            : 'bg-[#F8F8F8]/95 backdrop-blur-md border-b border-[#111111]/10'
        }`}
      >
        {/* Left: Hamburger Menu & Brand Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#111111] hover:bg-black/5 rounded-lg focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo on Left: Clicking navigates to Home */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 focus:outline-none p-1 rounded active:scale-95 transition-transform"
            aria-label="Kingsman Homepage"
          >
            <div className="w-7 h-7 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-xs">
              K
            </div>
            <span className="font-royal text-base sm:text-lg font-black tracking-[0.2em] text-[#111111]">
              KINGSMAN
            </span>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] rounded-full focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => {
              setView('wishlist');
              try { window.history.pushState(null, '', '/wishlist'); } catch {}
            }}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] rounded-full focus:outline-none relative min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#C1121F] fill-[#C1121F]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C1121F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] rounded-full focus:outline-none relative min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C7A55B] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Trigger (Opens Customer Account Modal Only) */}
          <button
            onClick={() => openAuthModal('login')}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] rounded-full focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center relative"
            aria-label="Customer Account"
          >
            {isCustomerLoggedIn && customer ? (
              <div className="w-6 h-6 rounded-full bg-[#C7A55B] text-black font-black text-[10px] flex items-center justify-center">
                {customer.fullName.charAt(0)}
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTracking={() => setIsOrderTrackingOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </header>
  );
};
