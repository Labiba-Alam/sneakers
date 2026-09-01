import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import { Clock } from 'lucide-react';

export const ShopRecentlyViewed: React.FC = () => {
  const { recentlyViewed, products } = useStore();

  const recentProducts = products.filter(p => recentlyViewed.includes(p.id));

  if (recentProducts.length === 0) return null;

  return (
    <div className="py-12 border-t border-white/10 bg-[#0E0E0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-widest mb-1">
          <Clock className="w-4 h-4 text-[#C7A55B]" />
          <span>Atelier Session History</span>
        </div>
        <h3 className="font-serif-luxury text-2xl font-bold text-white mb-6">
          RECENTLY VIEWED SILHOUETTES
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
