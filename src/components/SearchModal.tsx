import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Crown, ArrowRight } from 'lucide-react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openProductDetail, setFilters, setView, formatPrice } = useStore();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const results = query.trim().length > 0
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const handleSuggestionClick = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat as any, searchQuery: '' }));
    setView('catalog');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-[#141414] border border-white/10 p-6 md:p-8 shadow-2xl relative space-y-6">
        
        <button
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/20 pb-4">
          <Search className="w-6 h-6 text-[#C7A55B]" />
          <input
            type="text"
            autoFocus
            placeholder="Search silhouettes, categories, materials, or SKUs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base md:text-lg focus:outline-none placeholder-white/40"
          />
        </div>

        {/* Quick Suggestions */}
        {query.trim().length === 0 && (
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Limited Edition', 'High Tops', 'Low Tops', 'Running', 'Crimson'].map(term => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 uppercase font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results List */}
        {results.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Matching Silhouettes ({results.length})</p>
            <div className="space-y-2">
              {results.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    openProductDetail(prod);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 bg-[#181818] hover:bg-[#222222] border border-white/5 hover:border-[#C7A55B]/40 transition-all flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={optimizeImageUrl(prod.images[0], 150, 75)}
                      alt={`${prod.name} - Luxury ${prod.category} Sneaker`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 bg-[#111111] object-contain border border-white/10"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-sm font-bold text-white">{prod.name}</h4>
                      <p className="text-[10px] text-white/50 uppercase">{prod.category} • SKU: {prod.sku}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#C7A55B]">{formatPrice(prod.price)}</span>
                    <ArrowRight className="w-4 h-4 text-white/40 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
