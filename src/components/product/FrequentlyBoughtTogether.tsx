import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { optimizeImageUrl } from '../../lib/imageUtils';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ currentProduct }) => {
  const { products, formatPrice, addToCart, showToast } = useStore();

  // Find complementary accessory products or fallback items
  const accessoryCandidates = products.filter(p => p.id !== currentProduct.id);
  const bundleItem1 = accessoryCandidates[0] || currentProduct;
  const bundleItem2 = accessoryCandidates[1] || currentProduct;

  const [includedMain, setIncludedMain] = useState(true);
  const [includedItem1, setIncludedItem1] = useState(true);
  const [includedItem2, setIncludedItem2] = useState(true);

  // Bundle Discount Math
  const itemsCount = (includedMain ? 1 : 0) + (includedItem1 ? 1 : 0) + (includedItem2 ? 1 : 0);
  const rawTotal = (includedMain ? currentProduct.price : 0) +
                   (includedItem1 ? bundleItem1.price : 0) +
                   (includedItem2 ? bundleItem2.price : 0);
                   
  const bundleDiscount = itemsCount >= 2 ? rawTotal * 0.15 : 0;
  const finalBundleTotal = rawTotal - bundleDiscount;

  const handleAddBundleToCart = () => {
    if (includedMain) addToCart(currentProduct, currentProduct.sizes[0] || 42, currentProduct.colors[0]);
    if (includedItem1) addToCart(bundleItem1, bundleItem1.sizes[0] || 42, bundleItem1.colors[0]);
    if (includedItem2) addToCart(bundleItem2, bundleItem2.sizes[0] || 42, bundleItem2.colors[0]);

    showToast(`Added ${itemsCount} items in Royal Bundle to bag! Save 15% applied.`);
  };

  return (
    <div className="py-10 border-t border-white/10 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4 text-[#C7A55B]" />
          <span>Concierge Recommended Pairings</span>
        </div>
        <h3 className="font-serif-luxury text-2xl font-bold text-white mb-6">
          FREQUENTLY BOUGHT TOGETHER
        </h3>

        <div className="bg-[#161616] border border-white/10 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Products Row */}
            <div className="lg:col-span-8 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              
              {/* Item 0: Main Product */}
              <div className="w-28 sm:w-36 text-center space-y-2">
                <div className={`relative aspect-square bg-[#1E1E1E] border p-2 transition-all ${
                  includedMain ? 'border-[#C1121F]' : 'border-white/10 opacity-40'
                }`}>
                  <img
                    src={optimizeImageUrl(currentProduct.images[0], 250, 75)}
                    alt={`${currentProduct.name} - Luxury ${currentProduct.category} Sneaker`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setIncludedMain(!includedMain)}
                    className={`absolute top-1 right-1 p-1 rounded-none text-xs font-bold ${
                      includedMain ? 'bg-[#C1121F] text-white' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] font-bold text-white truncate">{currentProduct.name}</p>
                <p className="text-xs font-mono text-[#C7A55B]">{formatPrice(currentProduct.price)}</p>
              </div>

              <Plus className="w-5 h-5 text-white/30 shrink-0" />

              {/* Item 1 */}
              <div className="w-28 sm:w-36 text-center space-y-2">
                <div className={`relative aspect-square bg-[#1E1E1E] border p-2 transition-all ${
                  includedItem1 ? 'border-[#C1121F]' : 'border-white/10 opacity-40'
                }`}>
                  <img
                    src={optimizeImageUrl(bundleItem1.images[0], 250, 75)}
                    alt={`${bundleItem1.name} - Curated Royal Pairing Sneaker`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setIncludedItem1(!includedItem1)}
                    className={`absolute top-1 right-1 p-1 text-xs font-bold ${
                      includedItem1 ? 'bg-[#C1121F] text-white' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] font-bold text-white truncate">{bundleItem1.name}</p>
                <p className="text-xs font-mono text-[#C7A55B]">{formatPrice(bundleItem1.price)}</p>
              </div>

              <Plus className="w-5 h-5 text-white/30 shrink-0" />

              {/* Item 2 */}
              <div className="w-28 sm:w-36 text-center space-y-2">
                <div className={`relative aspect-square bg-[#1E1E1E] border p-2 transition-all ${
                  includedItem2 ? 'border-[#C1121F]' : 'border-white/10 opacity-40'
                }`}>
                  <img
                    src={optimizeImageUrl(bundleItem2.images[0], 250, 75)}
                    alt={`${bundleItem2.name} - Complementary Atelier Footwear`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setIncludedItem2(!includedItem2)}
                    className={`absolute top-1 right-1 p-1 text-xs font-bold ${
                      includedItem2 ? 'bg-[#C1121F] text-white' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] font-bold text-white truncate">{bundleItem2.name}</p>
                <p className="text-xs font-mono text-[#C7A55B]">{formatPrice(bundleItem2.price)}</p>
              </div>

            </div>

            {/* Bundle Total & Add Button */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest block">
                  Royal Bundle Price ({itemsCount} Items)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-black text-white">
                    {formatPrice(finalBundleTotal)}
                  </span>
                  {bundleDiscount > 0 && (
                    <span className="font-mono text-xs text-white/40 line-through">
                      {formatPrice(rawTotal)}
                    </span>
                  )}
                </div>
                {bundleDiscount > 0 && (
                  <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    Instant 15% Bundle Savings: -{formatPrice(bundleDiscount)}
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={itemsCount === 0}
                onClick={handleAddBundleToCart}
                className="w-full py-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Selected Bundle ({itemsCount})</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
