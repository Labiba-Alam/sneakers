import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Crown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedCollection: React.FC = () => {
  const { products, setView, setFilters } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'limited' | 'bestseller' | 'new'>('featured');

  const filteredProducts = products.filter(p => {
    if (activeTab === 'limited') return p.isLimitedEdition;
    if (activeTab === 'bestseller') return p.isBestSeller;
    if (activeTab === 'new') return p.isNewArrival;
    return p.isFeatured;
  }).slice(0, 8);

  return (
    <section className="py-20 bg-[#F8F8F8] border-t border-b border-[#111111]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <Crown className="w-4 h-4 text-[#C7A55B]" />
              <span>Curated Royal Selections</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111]">
              FLAGSHIP SILHOUETTES
            </h2>
          </div>

          {/* Collection Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 border border-[#111111]/15 rounded-none overflow-x-auto no-scrollbar shadow-sm">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${
                activeTab === 'featured'
                  ? 'bg-[#C1121F] text-white'
                  : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('limited')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'limited'
                  ? 'bg-[#C7A55B] text-black font-extrabold'
                  : 'text-[#C7A55B] hover:text-[#9e803d]'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-black" />
              Limited Drop
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${
                activeTab === 'bestseller'
                  ? 'bg-[#C1121F] text-white'
                  : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-[#111111] text-white'
                  : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Footer Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'All' }));
              setView('catalog');
            }}
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#111111] text-[#111111] hover:bg-[#C1121F] hover:border-[#C1121F] hover:text-white text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300"
          >
            <span>Explore All 100+ Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
