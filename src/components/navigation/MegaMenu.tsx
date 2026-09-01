import React from 'react';
import { motion } from 'framer-motion';
import { Crown, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { megaMenuSlide } from '../../styles/animations';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const { setFilters, setView } = useStore();

  if (!isOpen) return null;

  const handleCategoryClick = (categoryName: string) => {
    setFilters(prev => ({
      ...prev,
      category: categoryName as any,
      searchQuery: '',
    }));
    setView('catalog');
    onClose();
  };

  const categories = [
    { name: 'High Tops', desc: 'Ankle support & Tuscan leather architecture', badge: 'Popular' },
    { name: 'Low Tops', desc: 'Minimalist luxury silhouettes for daily elegance', badge: 'Classic' },
    { name: 'Limited Edition', desc: 'Numbered 24K gold hardware Florence drops', badge: 'Royal', isGold: true },
    { name: 'Running', desc: 'Vibram high-rebound ergonomic athletic outsoles', badge: 'Performance' },
    { name: 'Basketball', desc: 'High-impact court performance with calfskin comfort', badge: 'New' },
  ];

  return (
    <motion.div
      variants={megaMenuSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseLeave={onClose}
      className="absolute top-full inset-x-0 bg-white border-b border-[#111111]/15 shadow-2xl z-50 text-[#111111]"
    >
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        
        {/* Left Col: Shop Categories */}
        <div className="col-span-4 space-y-4 border-r border-[#111111]/10 pr-6">
          <div className="flex items-center gap-2 text-[#C1121F] text-[11px] font-bold uppercase tracking-[0.2em]">
            <Crown className="w-4 h-4 text-[#C7A55B]" />
            <span>Collections & Silhouettes</span>
          </div>
          
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="w-full text-left p-3 hover:bg-[#F3F3F3] transition-colors flex items-center justify-between group rounded-none"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury text-sm font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors">
                      {cat.name}
                    </span>
                    {cat.isGold ? (
                      <span className="px-2 py-0.5 bg-[#C7A55B] text-black text-[9px] font-black uppercase tracking-wider">
                        {cat.badge}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-black/5 text-[#111111] text-[9px] font-bold uppercase tracking-wider">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#111111]/60 font-normal mt-0.5 line-clamp-1">{cat.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#111111]/40 group-hover:text-[#C1121F] group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Center Col: Special Attributes & Filters */}
        <div className="col-span-4 space-y-4 border-r border-[#111111]/10 pr-6">
          <div className="flex items-center gap-2 text-[#111111] text-[11px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-4 h-4 text-[#C7A55B]" />
            <span>Atelier Highlights</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, isLimitedOnly: true, category: 'All' }));
                setView('catalog');
                onClose();
              }}
              className="p-4 bg-[#F8F8F8] border border-[#111111]/10 hover:border-[#C7A55B] text-left transition-all group"
            >
              <Crown className="w-5 h-5 text-[#C7A55B] mb-2" />
              <p className="font-serif-luxury text-xs font-bold text-[#111111] group-hover:text-[#C1121F]">Limited Drops</p>
              <p className="text-[10px] text-gray-500 mt-1">Numbered Florence pairs</p>
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, isFeaturedOnly: true, category: 'All' }));
                setView('catalog');
                onClose();
              }}
              className="p-4 bg-[#F8F8F8] border border-[#111111]/10 hover:border-[#C1121F] text-left transition-all group"
            >
              <Flame className="w-5 h-5 text-[#C1121F] mb-2" />
              <p className="font-serif-luxury text-xs font-bold text-[#111111] group-hover:text-[#C1121F]">Best Sellers</p>
              <p className="text-[10px] text-gray-500 mt-1">High demand silhouettes</p>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'All' }));
                setView('catalog');
                onClose();
              }}
              className="w-full py-3 bg-[#111111] text-white hover:bg-[#C1121F] text-xs uppercase tracking-[0.2em] font-bold transition-colors text-center"
            >
              View Entire Royal Catalog (100+)
            </button>
          </div>
        </div>

        {/* Right Col: Featured Spotlight Image Banner */}
        <div className="col-span-4 relative group overflow-hidden bg-[#111111] text-white p-6 flex flex-col justify-between">
          <img
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=75"
            alt="Royal Florence Sneaker Spotlight"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 space-y-1">
            <span className="px-2.5 py-1 bg-[#C7A55B] text-black font-extrabold text-[9px] uppercase tracking-wider">
              FLAGSHIP SPOTLIGHT
            </span>
            <h4 className="font-serif-luxury text-xl font-bold mt-2 text-white">Sovereign High Top Gold</h4>
            <p className="text-xs text-white/80 font-light">Tuscan Full-Grain Calfskin with 24K Gold Aglets.</p>
          </div>

          <button
            onClick={() => {
              setView('catalog');
              onClose();
            }}
            className="relative z-10 inline-flex items-center gap-2 text-xs font-bold text-[#C7A55B] hover:text-white uppercase tracking-widest pt-4"
          >
            <span>Explore Spotlight</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
