import React from 'react';
import { useStore } from '../context/StoreContext';
import { SNEAKERS_CATEGORIES, CLOTHING_CATEGORIES, CategoryCardItem } from '../data/products';
import { ArrowUpRight, Crown, Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const CategoryGrid: React.FC = () => {
  const { setView, setFilters, products, showToast } = useStore();

  const handleCategorySelect = (cat: CategoryCardItem, count: number) => {
    if (count === 0) {
      showToast(`${cat.name} collection is currently preparing for drop. Coming soon.`, 'info');
      return;
    }

    setFilters(prev => ({
      ...prev,
      department: cat.department,
      category: cat.name,
      brand: cat.department === 'Sneakers' ? (cat.name as any) : 'All',
      clothingType: cat.department === 'Clothing' ? (cat.name as any) : 'All',
      isSaleOnly: false,
      isNewArrivalsOnly: false,
      searchQuery: '',
    }));
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCategoryCard = (cat: CategoryCardItem, idx: number) => {
    const matchingProducts = products.filter(
      p =>
        p.department === cat.department &&
        (p.category === cat.name || p.brand === cat.name || p.clothingType === cat.name)
    );
    const count = matchingProducts.length;
    const isAvailable = count > 0;
    const firstProductImg = isAvailable && matchingProducts[0]?.images?.[0] ? matchingProducts[0].images[0] : cat.image;

    return (
      <motion.div
        key={`${cat.department}-${cat.name}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: idx * 0.05 }}
        onClick={() => handleCategorySelect(cat, count)}
        className={`group relative h-80 overflow-hidden border transition-all duration-500 shadow-sm ${
          isAvailable
            ? 'border-[#111111]/15 hover:border-[#C1121F] cursor-pointer hover:shadow-xl'
            : 'border-white/10 opacity-70 grayscale hover:grayscale-0 cursor-not-allowed bg-black/40'
        }`}
      >
        {/* Background Image with Zoom */}
        <img
          src={optimizeImageUrl(firstProductImg, 800, 75)}
          alt={`${cat.name} ${cat.department} Collection`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${
            isAvailable
              ? 'group-hover:scale-105 brightness-85 group-hover:brightness-95'
              : 'brightness-50'
          }`}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Details Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
          <div className="flex items-center justify-between">
            {isAvailable ? (
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                {count} {cat.department === 'Sneakers' ? 'Silhouettes' : 'Styles'}
              </span>
            ) : (
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] font-bold text-amber-300 uppercase tracking-widest border border-amber-300/30 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-300" />
                Coming Soon
              </span>
            )}

            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
              {cat.department}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white group-hover:text-[#C7A55B] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-[#C7A55B] uppercase tracking-widest font-bold">
                  {cat.department === 'Sneakers' ? 'Curated Footwear' : 'Luxury Apparel'}
                </span>
              </div>

              {isAvailable ? (
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#C1121F] group-hover:border-[#C1121F] transition-all">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              ) : (
                <span className="text-[11px] text-white/50 font-mono italic">
                  Drop Pending
                </span>
              )}
            </div>

            <p className="text-xs text-white/75 font-normal mt-2 line-clamp-2">
              {cat.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 bg-[#F8F8F8] relative border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C1121F] mb-2">
            ATELIER ARCHITECTURE
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] mb-4">
            BROWSE BY CATEGORY
          </h2>
          <p className="text-[#111111]/70 text-sm font-normal">
            Explore authentic imported footwear across global luxury icons, alongside tailored heavyweight cotton apparel.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* BLOCK 1: SNEAKERS (Six Brand Cards) */}
        {/* ---------------------------------------------------- */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#111111]/15 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-[0.2em]">
                <Crown className="w-4 h-4 text-[#C7A55B]" />
                <span>Department I</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111]">
                SNEAKERS
              </h3>
            </div>
            <p className="text-xs text-[#111111]/60 font-mono">
              6 Curated Global Brands • Verified Imports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SNEAKERS_CATEGORIES.map((cat, idx) => renderCategoryCard(cat, idx))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* BLOCK 2: CLOTHING (Three Type Cards) */}
        {/* ---------------------------------------------------- */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#111111]/15 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4 text-[#C7A55B]" />
                <span>Department II</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111]">
                CLOTHING
              </h3>
            </div>
            <p className="text-xs text-[#111111]/60 font-mono">
              Heavyweight Cotton Apparel • Tailored Cuts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLOTHING_CATEGORIES.map((cat, idx) => renderCategoryCard(cat, idx))}
          </div>
        </div>

      </div>
    </section>
  );
};
