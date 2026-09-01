import React from 'react';
import { Product, ProductColor } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Heart, Share2, Plus, Minus, ArrowRight, Layers } from 'lucide-react';

interface ProductActionsProps {
  product: Product;
  selectedSize: number;
  selectedColor: ProductColor;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onQuantityChange
}) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    toggleCompare, 
    compareList, 
    showToast,
    setView,
    setIsCartOpen 
  } = useStore();

  const isFavorite = isInWishlist(product.id);
  const isComparing = compareList.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('This pair is currently out of stock.', 'info');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(false);
    setView('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.subtitle,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product URL copied to clipboard!');
    }
  };

  return (
    <div className="py-4 space-y-3">
      
      {/* Quantity & Primary Add To Cart Row */}
      <div className="flex items-center gap-3">
        {/* Quantity Control */}
        <div className="flex items-center border border-white/20 bg-[#161616] shrink-0">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="p-3 text-white/60 hover:text-white transition-colors"
            disabled={isOutOfStock}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-xs font-mono font-bold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            className="p-3 text-white/60 hover:text-white transition-colors"
            disabled={isOutOfStock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex-grow py-3.5 px-6 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl ${
            isOutOfStock
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[#C1121F] hover:bg-[#a30f1a] text-white red-border-glow'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Royal Bag'}</span>
        </button>
      </div>

      {/* Buy Now Express Button */}
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleBuyNow}
        className="w-full py-3.5 bg-[#C7A55B] hover:bg-[#b08e48] text-black text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <span>Buy Now with Concierge Express</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Secondary Action Toolbar: Wishlist, Compare, Share */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`flex-1 py-2.5 px-3 border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
            isFavorite ? 'bg-[#C1121F] border-[#C1121F] text-white' : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          <span>{isFavorite ? 'Saved to Wishlist' : 'Wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          className={`flex-1 py-2.5 px-3 border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
            isComparing ? 'bg-[#C7A55B] border-[#C7A55B] text-black font-black' : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isComparing ? 'Comparing' : 'Compare'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="py-2.5 px-3 border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          title="Share Product"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
