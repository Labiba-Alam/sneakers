import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Crown, ChevronDown, Globe, Truck, ShieldCheck } from 'lucide-react';
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
        
        {/* Left Links & Mega Menu Trigger */}
        <nav className="flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-bold">
          <button
            onClick={() => handleNavClick(undefined, 'home')}
            className={`transition-colors py-1 border-b-2 ${
              view === 'home' ? 'border-[#C1121F] text-[#111111]' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
            }`}
          >
            Home
          </button>

          {/* Shop Mega Menu Hover Trigger */}
          <div 
            className="relative py-6"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
          >
            <button
              onClick={() => handleNavClick(undefined, 'catalog')}
              className={`transition-colors flex items-center gap-1.5 py-1 border-b-2 ${
                view === 'catalog' ? 'border-[#C1121F] text-[#111111]' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
              }`}
            >
              <span>Shop All</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#C1121F]' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('Limited Edition', 'catalog')}
            className="text-[#C7A55B] hover:text-[#9e803d] font-extrabold transition-colors flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5 text-[#C7A55B]" />
            <span>Limited Drop</span>
          </button>

          <button
            onClick={() => handleNavClick('High Tops', 'catalog')}
            className="text-[#111111]/70 hover:text-[#111111] transition-colors"
          >
            High Tops
          </button>

          <button
            onClick={() => handleNavClick('Low Tops', 'catalog')}
            className="text-[#111111]/70 hover:text-[#111111] transition-colors"
          >
            Low Tops
          </button>

          <button
            onClick={() => handleNavClick(undefined, 'brand-story')}
            className={`transition-colors py-1 border-b-2 ${
              view === 'brand-story' ? 'border-[#C1121F] text-[#111111]' : 'border-transparent text-[#111111]/70 hover:text-[#111111]'
            }`}
          >
            Heritage
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
        <div className="flex items-center gap-4">
          
          {/* Currency Switcher */}
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'BDT' : 'USD')}
            className="px-3 py-1.5 text-[11px] font-bold tracking-wider border border-[#111111]/20 bg-black/5 hover:bg-black/10 text-[#111111] transition-colors flex items-center gap-1.5"
            title="Switch Currency (USD / BDT)"
          >
            <Globe className="w-3.5 h-3.5 text-[#C1121F]" />
            <span>{currency}</span>
          </button>

          {/* Track Order Quick Trigger */}
          <button
            onClick={onOpenTracking}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] transition-colors"
            title="Track Royal Order"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] transition-colors"
            title="Search Shoes"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setView('wishlist')}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] transition-colors relative"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#C1121F] fill-[#C1121F]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C1121F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <button
            onClick={onOpenCart}
            className="p-2 text-[#111111]/80 hover:text-[#C1121F] transition-colors relative"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C7A55B] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => setView(view === 'admin' ? 'home' : 'admin')}
            className={`p-2 border transition-colors ${
              view === 'admin'
                ? 'bg-[#C1121F] border-[#C1121F] text-white'
                : 'bg-black/5 border-[#111111]/15 text-[#111111]/70 hover:text-[#111111]'
            }`}
            title="Admin Portal"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* Mega Menu Dropdown Render */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </div>
  );
};
