import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Truck, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

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
    currency, 
    setCurrency, 
    setFilters 
  } = useStore();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (category?: string, targetView: any = 'catalog') => {
    if (category) {
      setFilters(prev => ({ ...prev, category: category as any }));
    }
    setView(targetView);
    setIsMegaMenuOpen(false);
  };

  return (
    <div className="relative w-full bg-[#F8F8F8]/95 backdrop-blur-md border-b border-[#111111]/10 text-[#111111] z-40 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
        
        {/* Left Primary Navigation Links */}
        <nav className="flex items-center gap-6 xl:gap-8 text-xs uppercase tracking-[0.16em] font-semibold">
          <button
            onClick={() => handleNavClick(undefined, 'home')}
            className={`transition-colors py-1 border-b-2 ${
              view === 'home' ? 'border-[#C1121F] text-[#111111] font-bold' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick(undefined, 'catalog')}
            className={`transition-colors py-1 border-b-2 ${
              view === 'catalog' ? 'border-[#C1121F] text-[#111111] font-bold' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
            }`}
          >
            Shop
          </button>

          <button
            onClick={() => handleNavClick('Men Sneakers', 'catalog')}
            className="text-[#111111]/70 hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent"
          >
            Men
          </button>

          <button
            onClick={() => handleNavClick('Women Sneakers', 'catalog')}
            className="text-[#111111]/70 hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent"
          >
            Women
          </button>

          <button
            onClick={() => handleNavClick('New Arrivals', 'catalog')}
            className="text-[#111111]/70 hover:text-[#111111] transition-colors py-1 border-b-2 border-transparent"
          >
            New Arrivals
          </button>

          <button
            onClick={() => handleNavClick('Sale', 'catalog')}
            className="text-[#C1121F] hover:text-[#9b0d18] font-bold transition-colors py-1 border-b-2 border-transparent"
          >
            Sale
          </button>

          <button
            onClick={() => handleNavClick(undefined, 'brand-story')}
            className={`transition-colors py-1 border-b-2 ${
              view === 'brand-story' ? 'border-[#C1121F] text-[#111111] font-bold' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNavClick(undefined, 'contact')}
            className={`transition-colors py-1 border-b-2 ${
              view === 'contact' ? 'border-[#C1121F] text-[#111111] font-bold' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Center Brand Identity Logo */}
        <button
          onClick={() => setView('home')}
          className="flex flex-col items-center group focus:outline-none"
        >
          <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-base rounded-none shadow-sm">
              K
            </div>
            <span className="font-royal text-2xl md:text-3xl font-black tracking-[0.25em] text-[#111111]">
              KINGSMAN
            </span>
          </div>
          <span className="text-[8px] tracking-[0.35em] uppercase text-[#C7A55B] font-extrabold mt-0.5">
            ROYAL FOOTWEAR FLORENCE
          </span>
        </button>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Track Order Quick Trigger */}
          <button
            onClick={onOpenTracking}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all"
            title="Track Order"
            aria-label="Track Order"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all"
            title="Search Sneakers"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              setView('wishlist');
              try { window.history.pushState({ view: 'wishlist' }, '', '/wishlist'); } catch {}
            }}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all relative"
            title="Royal Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 transition-transform active:scale-125 ${wishlist.length > 0 ? 'text-[#C1121F] fill-[#C1121F]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-[#C1121F] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <button
            onClick={onOpenCart}
            className="p-2.5 text-[#111111]/80 hover:text-[#C1121F] hover:bg-black/5 rounded-full transition-all relative"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C7A55B] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile / Admin Login */}
          <button
            onClick={() => {
              if (view === 'admin' || view === 'admin-login') {
                setView('home');
              } else {
                setView('admin-login');
                try { window.history.pushState({ view: 'admin-login' }, '', '/admin/login'); } catch {}
              }
            }}
            className={`p-2.5 rounded-full transition-all ${
              view === 'admin' || view === 'admin-login'
                ? 'bg-[#111111] text-[#C7A55B]'
                : 'text-[#111111]/80 hover:text-[#111111] hover:bg-black/5'
            }`}
            title="Atelier Profile & Admin"
            aria-label="Profile and Admin"
          >
            <User className="w-5 h-5" />
          </button>

        </div>

      </div>
    </div>
  );
};
