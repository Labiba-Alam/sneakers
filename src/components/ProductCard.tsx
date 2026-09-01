import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Star, ShoppingBag, Eye, Crown, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { optimizeImageUrl } from '../lib/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    openProductDetail, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    formatPrice, 
    setQuickViewProduct,
    toggleCompare,
    compareList
  } = useStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<number>(product.sizes[0] || 42);

  const isFavorite = isInWishlist(product.id);
  const isComparing = compareList.includes(product.id);
  const mainImage = optimizeImageUrl(product.images[0], 600, 75);
  const hoverImage = optimizeImageUrl(product.images[1] || product.images[0], 600, 75);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedQuickSize, product.colors[0] || { name: 'Royal Black', hex: '#111111' }, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openProductDetail(product)}
      className="group relative bg-white border border-[#111111]/10 hover:border-[#C1121F] transition-all duration-300 rounded-none overflow-hidden cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl"
    >
      {/* Top Badges & Quick Action Buttons */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-start justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start pointer-events-auto">
          {product.isLimitedEdition && (
            <span className="px-2.5 py-1 bg-[#C7A55B] text-black font-extrabold text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Crown className="w-3 h-3 text-black" />
              Limited
            </span>
          )}
          {product.isBestSeller && !product.isLimitedEdition && (
            <span className="px-2 py-0.5 bg-[#C1121F] text-white font-bold text-[9px] uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isLimitedEdition && !product.isBestSeller && (
            <span className="px-2 py-0.5 bg-[#111111] text-white font-bold text-[9px] uppercase tracking-wider">
              New Drop
            </span>
          )}
          {product.discountPercent && (
            <span className="px-2 py-0.5 bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-wider">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={handleWishlistToggle}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-md text-[#111111]/80 hover:text-[#111111] transition-all hover:scale-110 border border-[#111111]/10"
            aria-label="Toggle Wishlist"
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-[#C1121F] fill-[#C1121F]' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-md text-[#111111]/80 hover:text-[#111111] transition-all hover:scale-110 border border-[#111111]/10"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 text-[#111111]" />
          </button>

          <button
            onClick={handleCompareToggle}
            className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 border border-[#111111]/10 ${
              isComparing ? 'bg-[#C7A55B] text-black' : 'bg-white/90 text-[#111111]/80 hover:bg-white hover:text-[#111111]'
            }`}
            aria-label="Compare Silhouette"
            title="Compare Silhouette"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Container with Hover Swap */}
      <div className="relative aspect-square w-full bg-[#F3F3F3] overflow-hidden flex items-center justify-center p-6">
        <img
          src={isHovered ? hoverImage : mainImage}
          alt={`${product.name} in ${product.colors?.map(c => c.name).join(' / ') || 'Signature Edition'} - Luxury Handcrafted ${product.category} Sneaker`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Quick Size Matrix & Quick Add Overlay on Hover */}
        <div className={`absolute inset-x-0 bottom-0 bg-[#111111]/95 backdrop-blur-md p-3 transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold mb-2 text-center">
            Select Size (EU)
          </p>
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-3">
            {product.sizes.slice(0, 6).map(size => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedQuickSize(size);
                }}
                className={`w-7 h-7 text-[10px] font-bold border transition-colors ${
                  selectedQuickSize === size
                    ? 'bg-[#C1121F] border-[#C1121F] text-white'
                    : 'bg-white/10 border-white/20 text-white/80 hover:border-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add (EU {selectedQuickSize})</span>
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col gap-2 flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase tracking-wider mb-1 font-semibold">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#C7A55B]">
              <Star className="w-3 h-3 fill-[#C7A55B]" />
              <span className="font-semibold text-[#111111]">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-serif-luxury text-base font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#111111]/60 font-normal line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#111111]/10 mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#111111]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#111111]/40 line-through font-light">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <span className={`text-[10px] font-bold tracking-wider uppercase ${
            product.stock <= 3 ? 'text-[#C1121F] animate-pulse' : 'text-emerald-700'
          }`}>
            {product.stock > 0 ? (product.stock <= 3 ? `Only ${product.stock} Left` : `${product.stock} In Stock`) : 'Sold Out'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
