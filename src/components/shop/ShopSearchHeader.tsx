import React from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopSearchHeader: React.FC = () => {
  const { filters, setFilters, products } = useStore();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const clearQuery = () => {
    setFilters(prev => ({ ...prev, searchQuery: '' }));
  };

  const quickSearchTags = ['24K Gold', 'Monarch', 'Low Top', 'High Top', 'Running', 'Vibram', 'Black', 'Limited'];

  const handleTagClick = (tag: string) => {
    setFilters(prev => ({ ...prev, searchQuery: tag }));
  };

  return (
    <div className="bg-[#141414] border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative w-full md:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
            <Search className="w-4 h-4 text-[#C7A55B]" />
          </div>

          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleQueryChange}
            placeholder="Instant search by product name, category, SKU (e.g. KNG-001)..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#1C1C1C] border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C1121F] font-medium transition-colors"
          />

          {filters.searchQuery && (
            <button
              onClick={clearQuery}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C7A55B]" />
            Trending:
          </span>
          {quickSearchTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                filters.searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-[#C1121F] text-white border border-[#C1121F]'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
