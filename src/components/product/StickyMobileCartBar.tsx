import React from 'react';
import { Product, ProductColor } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag } from 'lucide-react';
import { optimizeImageUrl } from '../../lib/imageUtils';

interface StickyMobileCartBarProps {
  product: Product;
  selectedSize: number;
  selectedColor: ProductColor;
}

export const StickyMobileCartBar: React.FC<StickyMobileCartBarProps> = ({
  product,
  selectedSize,
  selectedColor
}) => {
  const { addToCart, formatPrice } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-xl border-t border-white/15 p-3 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
      <div className="flex items-center gap-2 overflow-hidden">
        <img
          src={optimizeImageUrl(product.images[0], 100, 70)}
          alt={`${product.name} - Sticky Bar Preview`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-10 h-10 object-contain bg-[#1E1E1E] border border-white/10 shrink-0"
        />
        <div className="truncate">
          <h5 className="font-serif-luxury text-xs font-bold text-white truncate">{product.name}</h5>
          <p className="font-mono text-xs font-black text-[#C7A55B]">
            {formatPrice(product.price)} <span className="text-[10px] text-white/50 font-sans font-normal">• EU {selectedSize}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => addToCart(product, selectedSize, selectedColor)}
        className="py-2.5 px-4 bg-[#C1121F] text-white text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-lg"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Add to Bag</span>
      </button>
    </div>
  );
};
