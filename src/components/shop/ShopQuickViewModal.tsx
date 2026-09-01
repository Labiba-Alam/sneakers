import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Crown, Truck, ArrowRight, Layers, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductColor } from '../../types';
import { optimizeImageUrl } from '../../lib/imageUtils';

export const ShopQuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    toggleCompare, 
    compareList, 
    formatPrice,
    setView,
    setIsCartOpen
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: 'Royal Black', hex: '#111111' });
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);
  const isComparing = compareList.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize || product.sizes[0] || 42, selectedColor || product.colors[0], quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize || product.sizes[0] || 42, selectedColor || product.colors[0], quantity);
    setQuickViewProduct(null);
    setIsCartOpen(false);
    setView('checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-[#121212] border border-white/20 text-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-black/60 text-white/70 hover:text-white hover:bg-black rounded-full transition-colors"
            aria-label="Close Quick View"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="md:w-1/2 bg-[#181818] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            {/* Main Display Image */}
            <div className="relative aspect-square w-full flex items-center justify-center mb-4">
              <img
                src={optimizeImageUrl(product.images[activeImageIndex] || product.images[0], 700, 75)}
                alt={`${product.name} in ${product.colors?.map(c => c.name).join(' / ') || 'Signature'} - Quick View Studio View ${activeImageIndex + 1}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
              />

              {product.isLimitedEdition && (
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-[#C7A55B] text-black text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Limited Vault Pair
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/10">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 border p-1 bg-[#111111] shrink-0 transition-colors ${
                    activeImageIndex === idx ? 'border-[#C1121F]' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={optimizeImageUrl(img, 150, 70)}
                    alt={`${product.name} quick view thumbnail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sneaker Details & Configurator */}
          <div className="md:w-1/2 p-6 overflow-y-auto max-h-[75vh] md:max-h-none flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#C7A55B] font-bold uppercase tracking-widest mb-1">
                <span>{product.category}</span>
                <div className="flex items-center gap-1 text-[#C7A55B]">
                  <Star className="w-4 h-4 fill-[#C7A55B]" />
                  <span className="text-white font-bold">{product.rating}</span>
                  <span className="text-white/40 font-normal">({product.reviewCount})</span>
                </div>
              </div>

              <h2 className="font-serif-luxury text-2xl font-bold text-white mb-1">
                {product.name}
              </h2>
              <p className="text-xs text-white/60 font-mono mb-3">SKU: {product.sku}</p>

              {/* Price & Scarcity */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-black text-[#C7A55B]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="font-mono text-sm text-white/40 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/60 px-2.5 py-1 border border-emerald-500/30">
                  {product.stock > 0 ? `Only ${product.stock} Pairs Left` : 'Sold Out'}
                </span>
              </div>

              {/* Size Matrix */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-white/70 mb-2">
                  <span>Select Size (EU)</span>
                  <span className="text-[#C7A55B] text-[10px]">Tuscan Standard Fit</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-bold border transition-colors ${
                        (selectedSize || product.sizes[0]) === size
                          ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/80 hover:border-white'
                      }`}
                    >
                      EU {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white/70 block mb-2">
                    Color Finish: <span className="text-white font-bold">{selectedColor.name}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor.name === c.name ? 'scale-125 border-[#C1121F]' : 'border-white/20'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">Quantity:</span>
                <div className="flex items-center border border-white/20 bg-[#1A1A1A]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-white/70 hover:text-white font-mono text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-mono text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-white/70 hover:text-white font-mono text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border border-white/20 flex items-center justify-center transition-colors ${
                    isFavorite ? 'bg-[#C1121F] border-[#C1121F] text-white' : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                  title="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>

                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`px-3 border border-white/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors ${
                    isComparing ? 'bg-[#C7A55B] text-black border-[#C7A55B]' : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                  title="Compare"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-[#C7A55B] hover:bg-[#b0904d] text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <span>Buy Now with Express Concierge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
