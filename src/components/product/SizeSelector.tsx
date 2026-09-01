import React, { useState } from 'react';
import { Ruler, Sparkles, AlertTriangle, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AISizeAdvisorModal } from './AISizeAdvisorModal';

interface SizeSelectorProps {
  sizes: number[];
  selectedSize: number;
  onSelectSize: (size: number) => void;
  productStock: number;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  productStock
}) => {
  const { setIsSizeGuideOpen } = useStore();
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);

  // Simulated per-size inventory tracking
  const getStockForSize = (size: number) => {
    if (productStock <= 0) return 0;
    if (size === 42) return 1; // Low stock example
    if (size === 46) return 0; // Out of stock example
    return Math.max(1, Math.min(5, productStock - Math.abs(size - 42)));
  };

  return (
    <div className="py-4 border-b border-white/10 space-y-3">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">
          Select Size (EU Standard)
        </label>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setIsAIAdvisorOpen(true)}
            className="text-[#C7A55B] hover:underline font-bold flex items-center gap-1.5 bg-[#C7A55B]/10 px-2 py-0.5 border border-[#C7A55B]/30"
          >
            <Sparkles className="w-3 h-3 text-[#C7A55B]" />
            <span>AI Size Advisor</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-white/60 hover:text-white underline font-medium flex items-center gap-1"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Chart</span>
          </button>
        </div>
      </div>

      {/* Size Matrix Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {sizes.map(size => {
          const sizeStock = getStockForSize(size);
          const isSelected = selectedSize === size;
          const isOutOfStock = sizeStock <= 0;

          return (
            <button
              key={size}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectSize(size)}
              className={`relative py-3 text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                isOutOfStock
                  ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-lg ring-1 ring-[#C1121F]'
                  : 'bg-[#181818] border-white/15 text-white/80 hover:border-white/40'
              }`}
            >
              <span>EU {size}</span>
              {sizeStock === 1 && !isOutOfStock && (
                <span className="text-[8px] text-amber-400 font-extrabold uppercase mt-0.5">
                  1 Left
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Low Stock Warning Note for Selected Size */}
      {selectedSize && getStockForSize(selectedSize) === 1 && (
        <p className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5 bg-amber-950/40 p-2 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>High Demand: Only 1 pair available in EU {selectedSize}. Secure your order now.</span>
        </p>
      )}

      {selectedSize && getStockForSize(selectedSize) > 1 && (
        <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>Size EU {selectedSize} is reserved in vault and ready for immediate dispatch.</span>
        </p>
      )}

      {/* AI Size Advisor Modal */}
      <AISizeAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        onSelectRecommendedSize={onSelectSize}
        currentProductSizes={sizes}
      />
    </div>
  );
};
