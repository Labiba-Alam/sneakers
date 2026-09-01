import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, ShieldCheck, Zap, Sparkles, AlertCircle, Clock } from 'lucide-react';

interface ProductInfoSectionProps {
  product: Product;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ product }) => {
  const { formatPrice } = useStore();

  const getStockBadge = () => {
    if (product.stock <= 0) {
      return (
        <span className="px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Out of Stock • Reserve Pre-Order
        </span>
      );
    }
    if (product.stock <= 3) {
      return (
        <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          Only {product.stock} Pairs Remaining in Vault!
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5" />
        In Stock • Immediate Dispatch
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Brand Eyebrow & Category */}
      <div className="flex items-center justify-between text-xs text-[#C7A55B] font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C7A55B]" />
          <span>KINGSMAN • {product.category}</span>
        </div>
        <span className="text-white/40 font-mono">SKU: {product.sku}</span>
      </div>

      {/* Main Product Name */}
      <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {product.name}
      </h1>

      {/* Subtitle / Essence */}
      <p className="text-sm text-white/70 font-light leading-relaxed">
        {product.subtitle}
      </p>

      {/* Rating & Review Counter */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 border border-white/10">
          <Star className="w-4 h-4 fill-[#C7A55B] text-[#C7A55B]" />
          <span className="font-bold text-xs text-white">{product.rating}</span>
          <span className="text-white/40 text-xs">/ 5.0</span>
        </div>
        <a href="#reviews-section" className="text-xs text-[#C7A55B] hover:underline font-semibold">
          ({product.reviewCount} Verified Royal Reviews)
        </a>
      </div>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-4 py-4 border-y border-white/10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-mono text-base text-white/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {product.discountPercent && (
          <span className="px-2.5 py-1 bg-[#C1121F] text-white text-xs font-black uppercase tracking-wider shadow-md">
            Save {product.discountPercent}%
          </span>
        )}
      </div>

      {/* Stock Status Badge */}
      <div>{getStockBadge()}</div>

      {/* Brief Description Card */}
      <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed font-light">
        {product.description}
      </div>

    </div>
  );
};
