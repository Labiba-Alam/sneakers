import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST } from '../data/products';
import { ArrowUpRight, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const CategoryGrid: React.FC = () => {
  const { setView, setFilters, products } = useStore();

  const handleCategorySelect = (categoryName: string) => {
    setFilters(prev => ({ ...prev, category: categoryName as any }));
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#F8F8F8] relative border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C1121F] mb-2">
            ROYAL ARCHITECTURE
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] mb-4">
            BROWSE BY CATEGORY
          </h2>
          <p className="text-[#111111]/70 text-sm font-normal">
            Each category features carefully curated sneaker imports selected for contemporary luxury and everyday comfort.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_LIST.map((cat, idx) => {
            const count = products.filter(p => p.category === cat.name).length;
            const isFeatured = cat.name === 'Limited Edition';

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => handleCategorySelect(cat.name)}
                className={`group relative h-80 overflow-hidden cursor-pointer border border-[#111111]/15 hover:border-[#C1121F] transition-all duration-500 shadow-sm hover:shadow-xl ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                {/* Background Image with Zoom */}
                <img
                  src={optimizeImageUrl(cat.image, 800, 75)}
                  alt={`${cat.name} Luxury Sneaker Category Collection`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-85 group-hover:brightness-95"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Category Details Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                      {count > 0 ? `${count} Silhouettes` : 'Exclusive'}
                    </span>
                    
                    {isFeatured && (
                      <span className="px-3 py-1 bg-[#C7A55B] text-black text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                        <Crown className="w-3 h-3 text-black" />
                        Bespoke Drop
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white group-hover:text-[#C7A55B] transition-colors">
                        {cat.name}
                      </h3>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#C1121F] group-hover:border-[#C1121F] transition-all">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                    <p className="text-xs text-white/80 font-normal mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
