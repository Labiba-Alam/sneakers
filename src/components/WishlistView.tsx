import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, setView, formatPrice, showToast } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    if (wishlistedProducts.length === 0) return;
    let addedCount = 0;
    wishlistedProducts.forEach(product => {
      const defaultSize = product.sizes?.[0] || 42;
      const defaultColor = product.colors?.[0] || { name: 'Signature', hex: '#111111' };
      addToCart(product, defaultSize, defaultColor, 1);
      addedCount++;
    });
    showToast(`Added ${addedCount} silhouettes to your Royal Bag!`, 'success');
  };

  const handleRemoveWithUndo = (productId: string, productName: string) => {
    toggleWishlist(productId);
    showToast(`Removed "${productName}" from Wishlist`, 'info');
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F8F8F8] min-h-[70vh] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-white/10 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Vault Archive</span>
            </div>
            <h1 className="font-royal text-3xl sm:text-4xl font-black text-white tracking-wider">
              ROYAL WISHLIST
            </h1>
            <p className="text-xs text-white/60 mt-1">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'silhouette' : 'silhouettes'} saved for bespoke acquisition.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                className="px-6 py-3 bg-[#C1121F] hover:bg-[#a00f1a] text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Royal Bag</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#111111] border border-white/10 p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/15 flex items-center justify-center rounded-full">
              <Heart className="w-8 h-8 text-[#C7A55B]" />
            </div>
            <h2 className="font-royal text-2xl font-bold text-white mb-2 tracking-wide">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto mb-8">
              Explore our royal silhouettes and tap the heart icon on any bespoke pair to save it to your private vault.
            </p>
            <button
              onClick={() => {
                setView('catalog');
                try { window.history.pushState({ view: 'catalog' }, '', '/shop'); } catch {}
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C7A55B] hover:bg-[#b08e48] text-black text-xs font-black uppercase tracking-[0.2em] transition-colors"
            >
              <span>Explore Royal Silhouettes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistedProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#141414] border border-white/10 hover:border-[#C7A55B]/50 transition-all flex flex-col justify-between group overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-[#0A0A0A] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Quick remove heart button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveWithUndo(product.id, product.name)}
                      className="absolute top-3 right-3 w-9 h-9 bg-black/70 hover:bg-[#C1121F] border border-white/20 hover:border-[#C1121F] text-white flex items-center justify-center transition-all shadow-md group/btn"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-[#C1121F] group-hover/btn:fill-white transition-colors" />
                    </button>

                    {product.discountPercent && (
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#C1121F] text-white text-[10px] font-black uppercase tracking-wider">
                        Save {product.discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#C7A55B] uppercase tracking-wider mb-1">
                        {product.category}
                      </div>
                      <h3 className="font-royal text-base font-bold text-white group-hover:text-[#C7A55B] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono text-base font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="font-mono text-xs text-white/40 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex gap-2">
                      <button
                        onClick={() => {
                          const defaultSize = product.sizes?.[0] || 42;
                          const defaultColor = product.colors?.[0] || { name: 'Signature', hex: '#111111' };
                          addToCart(product, defaultSize, defaultColor, 1);
                          showToast(`Added ${product.name} to Royal Bag!`);
                        }}
                        className="flex-1 py-2.5 bg-white/10 hover:bg-[#C1121F] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>

                      <button
                        onClick={() => handleRemoveWithUndo(product.id, product.name)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-400 border border-white/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};
