import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ChevronRight, 
  Crown,
  Sparkles,
  Phone
} from 'lucide-react';
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
  const { 
    setView, 
    setFilters, 
    wishlist, 
    cart,
    customer,
    isCustomerLoggedIn,
    openAuthModal
  } = useStore();

  const containerRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const handleNavClick = (category?: string, targetView: any = 'catalog', isSale?: boolean) => {
    if (isSale) {
      setFilters(prev => ({ ...prev, category: 'Sale', isSaleOnly: true }));
    } else if (category) {
      setFilters(prev => ({ ...prev, category: category as any, isSaleOnly: false }));
    } else if (targetView === 'catalog') {
      setFilters(prev => ({ ...prev, category: 'All', isSaleOnly: false }));
    }
    setView(targetView);
    try {
      const path = targetView === 'home' ? '/' : (targetView === 'catalog' ? '/shop' : (targetView === 'brand-story' ? '/about' : `/${targetView}`));
      window.history.pushState(null, '', path);
    } catch {}
    onClose();
  };

  const handleAccountClick = () => {
    onClose();
    openAuthModal('login');
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-out Drawer with Touch Drag-to-Close */}
        <motion.div
          ref={containerRef}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.5, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100 || info.velocity.x < -300) {
              onClose();
            }
          }}
          className="fixed inset-y-0 left-0 w-full max-w-[320px] sm:max-w-sm bg-white text-[#111111] shadow-2xl flex flex-col justify-between z-50 overflow-y-auto font-sans"
        >
          {/* Top Section */}
          <div className="p-6">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-5">
              <button
                onClick={() => {
                  setView('home');
                  onClose();
                }}
                className="flex items-center gap-2.5 text-left focus:outline-none"
              >
                <div className="w-8 h-8 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-sm">
                  K
                </div>
                <div className="flex flex-col">
                  <span className="font-royal text-lg font-black tracking-[0.2em] text-[#111111] leading-none">
                    KINGSMAN
                  </span>
                  <span className="text-[7.5px] tracking-[0.28em] uppercase text-[#C7A55B] font-bold mt-1">
                    ROYAL FOOTWEAR
                  </span>
                </div>
              </button>

              <button
                onClick={onClose}
                className="p-2.5 text-[#111111]/70 hover:text-[#111111] hover:bg-black/5 rounded-full transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Search Bar */}
            <div className="mb-5">
              <button
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#F8F8F8] border border-black/10 rounded-xl flex items-center justify-between text-xs text-[#111111]/70 hover:border-black/20 hover:text-[#111111] transition-all"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Search className="w-4 h-4 text-[#111111]/50" />
                  <span>Search styles, silhouettes...</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C1121F]">
                  Explore
                </span>
              </button>
            </div>

            {/* Main Menu Links */}
            <nav aria-label="Mobile Navigation" className="space-y-3">
              
              {/* SNEAKERS SECTION */}
              <div className="bg-[#F8F8F8] p-3 rounded-lg border border-black/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C1121F] flex items-center gap-1.5">
                    <span>Sneakers</span>
                  </span>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, department: 'Sneakers', category: 'All', brand: 'All', isSaleOnly: false }));
                      setView('catalog');
                      onClose();
                    }}
                    className="text-[10px] text-gray-500 hover:text-black font-semibold uppercase"
                  >
                    All &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Nike', 'Jordan', 'Adidas', 'New Balance', 'Converse', 'Louis Vuitton'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          department: 'Sneakers',
                          brand: brand as any,
                          category: brand as any,
                          isSaleOnly: false,
                        }));
                        setView('catalog');
                        onClose();
                      }}
                      className="px-2.5 py-1.5 text-left text-xs font-semibold text-[#111111] bg-white border border-black/5 hover:border-[#C1121F] rounded transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* CLOTHING SECTION */}
              <div className="bg-[#F8F8F8] p-3 rounded-lg border border-black/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                    <span>Clothing</span>
                  </span>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, department: 'Clothing', category: 'All', clothingType: 'All', isSaleOnly: false }));
                      setView('catalog');
                      onClose();
                    }}
                    className="text-[10px] text-gray-500 hover:text-black font-semibold uppercase"
                  >
                    All &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {['T-Shirt', 'Hoodie', 'Sweatshirt'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          department: 'Clothing',
                          clothingType: type as any,
                          category: type as any,
                          isSaleOnly: false,
                        }));
                        setView('catalog');
                        onClose();
                      }}
                      className="px-2 py-1.5 text-center text-xs font-semibold text-[#111111] bg-white border border-black/5 hover:border-[#C1121F] rounded transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections & Filters */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, isNewArrivalsOnly: true, isSaleOnly: false }));
                    setView('catalog');
                    onClose();
                  }}
                  className="px-3 py-2 bg-[#C7A55B]/10 border border-[#C7A55B]/30 rounded text-xs font-bold text-[#111111] flex items-center justify-center gap-1.5"
                >
                  <span>✨ New Arrivals</span>
                </button>

                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, isSaleOnly: true, isNewArrivalsOnly: false }));
                    setView('catalog');
                    onClose();
                  }}
                  className="px-3 py-2 bg-[#C1121F]/10 border border-[#C1121F]/30 rounded text-xs font-bold text-[#C1121F] flex items-center justify-center gap-1.5"
                >
                  <span>🏷️ Sale Drops</span>
                </button>
              </div>

              {/* Gender Filters */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, gender: 'Men', isSaleOnly: false }));
                    setView('catalog');
                    onClose();
                  }}
                  className="flex-1 py-2 bg-black/5 hover:bg-black/10 rounded text-xs font-semibold text-[#111111] text-center"
                >
                  Men
                </button>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, gender: 'Women', isSaleOnly: false }));
                    setView('catalog');
                    onClose();
                  }}
                  className="flex-1 py-2 bg-black/5 hover:bg-black/10 rounded text-xs font-semibold text-[#111111] text-center"
                >
                  Women
                </button>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, gender: 'Unisex', isSaleOnly: false }));
                    setView('catalog');
                    onClose();
                  }}
                  className="flex-1 py-2 bg-black/5 hover:bg-black/10 rounded text-xs font-semibold text-[#111111] text-center"
                >
                  Unisex
                </button>
              </div>

              {/* About & Contact */}
              <div className="pt-2 border-t border-black/10 flex justify-between text-xs text-gray-600 font-medium px-1">
                <button
                  onClick={() => {
                    setView('brand-story');
                    onClose();
                  }}
                  className="hover:text-black py-1"
                >
                  Brand Story
                </button>
                <button
                  onClick={() => {
                    setView('contact');
                    onClose();
                  }}
                  className="hover:text-black py-1"
                >
                  Concierge & Contact
                </button>
              </div>

              {/* Divider */}
              <div className="pt-2 pb-2">
                <div className="border-t border-black/10" />
              </div>

              {/* 7. Wishlist */}
              <button
                onClick={() => {
                  onClose();
                  setView('wishlist');
                  try { window.history.pushState(null, '', '/wishlist'); } catch {}
                }}
                className="w-full min-h-[44px] px-3 py-2.5 rounded-lg flex items-center justify-between text-[16px] font-medium text-[#111111] hover:bg-black/5 hover:text-[#C1121F] transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#C1121F] fill-[#C1121F]' : 'text-[#111111]/70'}`} />
                  <span>Wishlist</span>
                </span>
                {wishlist.length > 0 ? (
                  <span className="px-2 py-0.5 bg-[#C1121F] text-white text-[11px] font-bold rounded-full">
                    {wishlist.length}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#111111]/30" />
                )}
              </button>

              {/* 8. Cart */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="w-full min-h-[44px] px-3 py-2.5 rounded-lg flex items-center justify-between text-[16px] font-medium text-[#111111] hover:bg-black/5 hover:text-[#C1121F] transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#111111]/70" />
                  <span>Cart</span>
                </span>
                {cartCount > 0 ? (
                  <span className="px-2 py-0.5 bg-[#C7A55B] text-black text-[11px] font-black rounded-full">
                    {cartCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#111111]/30" />
                )}
              </button>

              {/* 9. My Account (CUSTOMER ACCOUNT ONLY) */}
              <button
                onClick={handleAccountClick}
                className="w-full min-h-[44px] px-3 py-2.5 rounded-lg flex items-center justify-between text-[16px] font-medium text-[#111111] bg-[#F8F8F8] hover:bg-black/5 transition-colors text-left border border-black/5 mt-2"
              >
                <span className="flex items-center gap-2.5">
                  {isCustomerLoggedIn && customer ? (
                    <div className="w-5 h-5 rounded-full bg-[#C7A55B] text-black font-black text-[10px] flex items-center justify-center">
                      {customer.fullName.charAt(0)}
                    </div>
                  ) : (
                    <User className="w-4 h-4 text-[#111111]" />
                  )}
                  <span className="font-semibold">
                    {isCustomerLoggedIn && customer ? customer.fullName : 'My Account'}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-[#C1121F] uppercase tracking-wider">
                  {isCustomerLoggedIn ? 'VIP' : 'Sign In'}
                </span>
              </button>

            </nav>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-black/10 bg-[#FAFAFA] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#111111]/70 font-medium">
              <span>Currency: ৳ BDT</span>
              <span>Express Delivery Dhaka</span>
            </div>
            <p className="text-[9.5px] text-center text-[#111111]/40 uppercase tracking-widest font-mono">
              KINGSMAN SNEAKERS • DHANMONDI & GULSHAN
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
