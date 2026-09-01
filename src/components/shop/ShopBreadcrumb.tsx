import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopBreadcrumb: React.FC = () => {
  const { setView, filters, setFilters } = useStore();

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-3 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0E0E0E] text-xs text-white/60 font-medium"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-1.5 hover:text-[#C7A55B] transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-white/70" />
          <span>Home</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />

        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, category: 'All', searchQuery: '' }));
            setView('catalog');
          }}
          className={`hover:text-[#C7A55B] transition-colors ${
            filters.category === 'All' ? 'text-white font-bold' : ''
          }`}
        >
          Shop
        </button>

        {filters.category !== 'All' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="text-[#C7A55B] font-bold uppercase tracking-wider">
              {filters.category}
            </span>
          </>
        )}

        {filters.searchQuery && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="text-white/80 italic">
              "{filters.searchQuery}"
            </span>
          </>
        )}
      </div>
    </nav>
  );
};
