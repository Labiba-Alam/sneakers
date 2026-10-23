import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MegaMenu } from './MegaMenu';

export interface DesktopNavProps {
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  onOpenCart: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  onOpenSearch,
  onOpenTracking,
  onOpenCart,
}) => {
  const { 
    view, 
    setView, 
    cart, 
    wishlist, 
    setFilters,
    filters,
    openAuthModal,
    customer,
    isCustomerLoggedIn
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Monitor scroll for sticky transition to solid white & soft shadow
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
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogoClick = () => {
    setView('home');
    try {
      window.history.pushState(null, '', '/');
    } catch {}
  };

  const handleNavDepartment = (dept: 'Sneakers' | 'Clothing') => {
    setFilters(prev => ({
      ...prev,
      department: dept,
      category: 'All',
      brand: 'All',
      clothingType: 'All',
      isSaleOnly: false,
      isNewArrivalsOnly: false,
    }));
    setView('catalog');
    try { window.history.pushState(null, '', '/shop'); } catch {}
  };

  const handleNavGender = (gender: 'Men' | 'Women') => {
    setFilters(prev => ({
      ...prev,
      gender,
      isSaleOnly: false,
      isNewArrivalsOnly: false,
    }));
    setView('catalog');
    try { window.history.pushState(null, '', '/shop'); } catch {}
  };

  const handleNavSale = () => {
    setFilters(prev => ({
      ...prev,
      isSaleOnly: true,
      isNewArrivalsOnly: false,
    }));
    setView('catalog');
    try { window.history.pushState(null, '', '/shop'); } catch {}
  };

  const handleNavNewArrivals = () => {
    setFilters(prev => ({
      ...prev,
      isNewArrivalsOnly: true,
      isSaleOnly: false,
    }));
    setView('catalog');
    try { window.history.pushState(null, '', '/shop'); } catch {}
  };

  const handleNavClick = (targetView: any = 'catalog') => {
    if (targetView === 'catalog') {
      setFilters(prev => ({
        ...prev,
        department: 'All',
        category: 'All',
        brand: 'All',
        clothingType: 'All',
        gender: 'All',
        isSaleOnly: false,
        isNewArrivalsOnly: false,
      }));
    }
    setView(targetView);
    try {
      const path = targetView === 'home' ? '/' : (targetView === 'catalog' ? '/shop' : (targetView === 'brand-story' ? '/about' : `/${targetView}`));
      window.history.pushState(null, '', path);
    } catch {}
  };

  // Check active menu item
  const isShopActive = view === 'catalog' && filters.department === 'All' && !filters.isSaleOnly && !filters.isNewArrivalsOnly && filters.gender === 'All';
  const isSneakersActive = view === 'catalog' && filters.department === 'Sneakers';
  const isClothingActive = view === 'catalog' && filters.department === 'Clothing';
  const isNewArrivalsActive = view === 'catalog' && filters.isNewArrivalsOnly;
  const isSaleActive = view === 'catalog' && filters.isSaleOnly;
  const isMenActive = view === 'catalog' && filters.gender === 'Men';
  const isWomenActive = view === 'catalog' && filters.gender === 'Women';
  const isAboutActive = view === 'brand-story';
  const isContactActive = view === 'contact';

  return (
    <div 
      className={`relative w-full z-40 font-sans transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] border-b border-black/5' 
          : 'bg-[#F8F8F8]/95 backdrop-blur-md border-b border-[#111111]/8'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* ========================================================================= */}
        {/* LEFT: KINGSMAN LOGO (PRIMARY NAVIGATION TO HOME) */}
        {/* ========================================================================= */}
        <div className="flex items-center shrink-0">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group text-left outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 rounded-lg p-1.5 transition-transform active:scale-95"
            aria-label="Kingsman Luxury Sneakers - Return to Home"
          >
            {/* Red Crest K */}
            <div className="w-9 h-9 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-lg shadow-sm group-hover:bg-[#9b0d18] transition-colors rounded-none">
              K
            </div>
            
            {/* Wordmark & Luxury Atelier Subtitle */}
            <div className="flex flex-col">
              <span className="font-royal text-2xl lg:text-[26px] font-black tracking-[0.22em] text-[#111111] leading-none group-hover:text-[#C1121F] transition-colors">
                KINGSMAN
              </span>
              <span className="text-[8.5px] tracking-[0.32em] uppercase text-[#C7A55B] font-bold mt-1">
                ROYAL FOOTWEAR • DHAKA
              </span>
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CENTER: STREAMLINED NAVBAR MENU */}
        {/* Items: Shop, Men, Women, Sale, About, Contact */}
        {/* States: Hover underline, Active underline, Focus subtle opacity. NO RED BORDER. */}
        {/* ========================================================================= */}
        <nav 
          aria-label="Main navigation" 
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-5"
        >
          {/* 1. Sneakers (Department + Mega Menu Trigger) */}
          <button
            onClick={() => handleNavDepartment('Sneakers')}
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            className={`relative px-3.5 py-2 text-[15px] xl:text-[16px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isSneakersActive 
                ? 'text-[#C1121F] font-semibold' 
                : 'text-[#111111]/80 hover:text-[#111111]'
            }`}
          >
            <span className="relative">
              Sneakers
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111]/40 transition-all duration-200 group-hover:w-full ${isSneakersActive ? 'hidden' : ''}`} />
            </span>
            {isSneakersActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>

          {/* 2. Clothing (Department + Mega Menu Trigger) */}
          <button
            onClick={() => handleNavDepartment('Clothing')}
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            className={`relative px-3.5 py-2 text-[15px] xl:text-[16px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isClothingActive 
                ? 'text-[#C1121F] font-semibold' 
                : 'text-[#111111]/80 hover:text-[#111111]'
            }`}
          >
            <span className="relative">
              Clothing
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111]/40 transition-all duration-200 group-hover:w-full ${isClothingActive ? 'hidden' : ''}`} />
            </span>
            {isClothingActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>

          {/* 3. Men (Gender Filter) */}
          <button
            onClick={() => handleNavGender('Men')}
            className={`relative px-3.5 py-2 text-[15px] xl:text-[16px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isMenActive 
                ? 'text-[#C1121F] font-semibold' 
                : 'text-[#111111]/80 hover:text-[#111111]'
            }`}
          >
            <span className="relative">
              Men
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111]/40 transition-all duration-200 group-hover:w-full ${isMenActive ? 'hidden' : ''}`} />
            </span>
            {isMenActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>

          {/* 4. Women (Gender Filter) */}
          <button
            onClick={() => handleNavGender('Women')}
            className={`relative px-3.5 py-2 text-[15px] xl:text-[16px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isWomenActive 
                ? 'text-[#C1121F] font-semibold' 
                : 'text-[#111111]/80 hover:text-[#111111]'
            }`}
          >
            <span className="relative">
              Women
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111]/40 transition-all duration-200 group-hover:w-full ${isWomenActive ? 'hidden' : ''}`} />
            </span>
            {isWomenActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>

          {/* 5. New Arrivals */}
          <button
            onClick={handleNavNewArrivals}
            className={`relative px-3.5 py-2 text-[15px] xl:text-[16px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isNewArrivalsActive 
                ? 'text-[#C7A55B] font-bold' 
                : 'text-[#111111]/80 hover:text-[#C7A55B]'
            }`}
          >
            <span className="relative">
              New
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C7A55B]/60 transition-all duration-200 group-hover:w-full ${isNewArrivalsActive ? 'hidden' : ''}`} />
            </span>
            {isNewArrivalsActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C7A55B] rounded-full"
              />
            )}
          </button>

          {/* 6. Sale */}
          <button
            onClick={handleNavSale}
            className={`relative px-3.5 py-2 text-[15px] xl:text-[16px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isSaleActive 
                ? 'text-[#C1121F] font-bold' 
                : 'text-[#C1121F] hover:text-[#9b0d18]'
            }`}
          >
            <span className="relative">
              Sale
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C1121F]/50 transition-all duration-200 group-hover:w-full ${isSaleActive ? 'hidden' : ''}`} />
            </span>
            {isSaleActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>

          {/* 5. About */}
          <button
            onClick={() => handleNavClick('brand-story')}
            className={`relative px-4 py-2 text-[16px] xl:text-[17px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isAboutActive 
                ? 'text-[#C1121F] font-semibold' 
                : 'text-[#111111]/80 hover:text-[#111111]'
            }`}
          >
            <span className="relative">
              About
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111]/40 transition-all duration-200 group-hover:w-full ${isAboutActive ? 'hidden' : ''}`} />
            </span>
            {isAboutActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>

          {/* 6. Contact */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`relative px-4 py-2 text-[16px] xl:text-[17px] font-medium tracking-tight transition-all rounded-md outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-80 group ${
              isContactActive 
                ? 'text-[#C1121F] font-semibold' 
                : 'text-[#111111]/80 hover:text-[#111111]'
            }`}
          >
            <span className="relative">
              Contact
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111]/40 transition-all duration-200 group-hover:w-full ${isContactActive ? 'hidden' : ''}`} />
            </span>
            {isContactActive && (
              <motion.span 
                layoutId="desktop-nav-underline"
                className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#C1121F] rounded-full"
              />
            )}
          </button>
        </nav>

        {/* Mega Menu Dropdown */}
        <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

        {/* ========================================================================= */}
        {/* RIGHT: SEARCH, WISHLIST, CART, PROFILE (CUSTOMER ACCOUNT) */}
        {/* States: Hover underline/tint, Focus subtle opacity. NO RED BORDER. */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-70"
            title="Search Sneakers"
            aria-label="Search sneakers by style, color, or silhouette"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => {
              setView('wishlist');
              try { window.history.pushState(null, '', '/wishlist'); } catch {}
            }}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all relative outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-70"
            title="Wishlist"
            aria-label={`Wishlist, ${wishlist.length} item${wishlist.length === 1 ? '' : 's'}`}
          >
            <Heart 
              className={`w-5 h-5 transition-transform active:scale-125 ${
                wishlist.length > 0 ? 'text-[#C1121F] fill-[#C1121F]' : ''
              }`} 
            />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C1121F] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all relative outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-70"
            title="Shopping Bag"
            aria-label={`Shopping Bag, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C7A55B] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Trigger (CUSTOMER ACCOUNT ONLY — NEVER ADMIN) */}
          <button
            onClick={() => openAuthModal('login')}
            className={`p-2.5 rounded-full transition-all relative outline-none focus:outline-none focus-visible:outline-none focus-visible:opacity-70 ${
              isCustomerLoggedIn 
                ? 'bg-black/5 text-[#111111] hover:bg-black/10' 
                : 'text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5'
            }`}
            title={isCustomerLoggedIn ? `Customer Account (${customer?.fullName})` : 'Customer Sign In & Account'}
            aria-label={isCustomerLoggedIn ? `Account for ${customer?.fullName}` : 'Sign in to customer account'}
          >
            {isCustomerLoggedIn && customer ? (
              <div className="w-5 h-5 rounded-full bg-[#C7A55B] text-black font-black text-[10px] flex items-center justify-center">
                {customer.fullName.charAt(0)}
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}

            {/* Active session indicator dot */}
            {isCustomerLoggedIn && (
              <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
