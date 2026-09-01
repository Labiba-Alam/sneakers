import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import { Sparkles, Flame } from 'lucide-react';

export const ShopRecommendations: React.FC = () => {
  const { products } = useStore();

  const trendingProducts = products.filter(p => p.isBestSeller || p.isFeatured).slice(0, 4);

  return (
    <div className="py-12 border-t border-white/10 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-widest mb-1">
          <Flame className="w-4 h-4 text-[#C1121F]" />
          <span>Curated Selection</span>
        </div>
        <h3 className="font-serif-luxury text-2xl font-bold text-white mb-6">
          RECOMMENDED FOR YOUR ROYAL WARDROBE
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
