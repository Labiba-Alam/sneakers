import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Truck, Globe, Search, Heart, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useFocusTrap } from '../../hooks/useAccessibility';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  onOpenCart: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenTracking,
  onOpenCart,
}) => {
  const { setView, setFilters, currency, setCurrency, wishlist, cart } = useStore();
  const containerRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const handleNavClick = (category?: string, targetView: any = 'catalog') => {
    if (category) {
      setFilters(prev => ({ ...prev, category: category as any }));
    }
    setView(targetView);
    onClose();
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Slide-out Drawer */}
        <motion.div
          ref={containerRef}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#F8F8F8] text-[#111111] shadow-2xl flex flex-col justify-between p-6 z-50 overflow-y-auto"
        >
          {/* Header Bar */}
          <div>
            <div className="flex items-center justify-between border-b border-[#111111]/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-sm">
                  K
                </div>
                <span className="font-royal text-xl font-black tracking-[0.2em]">KINGSMAN</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#111111]/70 hover:text-[#111111] focus:outline-none"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="p-3 bg-white border border-[#111111]/10 flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-wider"
              >
                <Search className="w-4 h-4 text-[#111111]" />
                <span>Search</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setView('wishlist');
                }}
                className="p-3 bg-white border border-[#111111]/10 flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-wider relative"
              >
                <Heart className="w-4 h-4 text-[#C1121F]" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C1121F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="p-3 bg-white border border-[#111111]/10 flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-wider relative"
              >
                <ShoppingBag className="w-4 h-4 text-[#111111]" />
                <span>Bag</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C7A55B] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1 text-xs uppercase tracking-[0.15em] font-semibold border-t border-[#111111]/10 pt-4">
              <button
                onClick={() => handleNavClick(undefined, 'home')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick(undefined, 'catalog')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                Shop
              </button>

              <button
                onClick={() => handleNavClick('Men Sneakers', 'catalog')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                Men
              </button>

              <button
                onClick={() => handleNavClick('Women Sneakers', 'catalog')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                Women
              </button>

              <button
                onClick={() => handleNavClick('New Arrivals', 'catalog')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                New Arrivals
              </button>

              <button
                onClick={() => handleNavClick('Sale', 'catalog')}
                className="w-full text-left py-3 border-b border-[#111111]/5 text-[#C1121F] font-bold"
              >
                Sale
              </button>

              <button
                onClick={() => handleNavClick(undefined, 'brand-story')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                About
              </button>

              <button
                onClick={() => handleNavClick(undefined, 'contact')}
                className="w-full text-left py-3 border-b border-[#111111]/5 hover:text-[#C1121F]"
              >
                Contact
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTracking();
                }}
                className="w-full text-left py-3 border-b border-[#111111]/5 text-[#111111]/80 hover:text-[#C1121F] flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order</span>
              </button>

              <button
                onClick={() => handleNavClick(undefined, 'admin-login')}
                className="w-full text-left py-3 text-[#111111]/80 hover:text-[#C1121F] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin & Profile</span>
              </button>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-6 border-t border-[#111111]/10 space-y-2">
            <p className="text-[11px] text-center text-[#111111]/60 font-medium">
              Bangladesh • All Prices in ৳ BDT
            </p>
            <p className="text-[10px] text-center text-[#111111]/40 uppercase tracking-widest">
              KINGSMAN ROYAL SNEAKERS • DHAKA
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
