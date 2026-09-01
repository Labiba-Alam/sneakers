import React from 'react';
import { Sparkles, Crown, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopHeroBanner: React.FC = () => {
  const { filters } = useStore();

  const getBannerContent = () => {
    switch (filters.category) {
      case 'Limited Edition':
        return {
          title: 'LIMITED EDITION VAULT',
          subtitle: 'Minted Florence Silhouettes • 24K Gold Hardware • Certified Numbered Pairs',
          accent: 'text-[#C7A55B]',
          badge: 'Exclusive Drops'
        };
      case 'Running':
        return {
          title: 'HIGH PERFORMANCE RUNNING',
          subtitle: 'Engineered Vibram Outsoles & Ergonomic Carbon Fibre Cushioning',
          accent: 'text-[#C1121F]',
          badge: 'Athletic Luxury'
        };
      case 'Basketball':
        return {
          title: 'COURT ARCHITECTURE',
          subtitle: 'Ankle Stability & Micro-Perforated Italian Calfskin Uppers',
          accent: 'text-[#C7A55B]',
          badge: 'Pro Performance'
        };
      case 'High Tops':
        return {
          title: 'HIGH TOP HERITAGE',
          subtitle: 'Hand-burnished Tuscan Leather High-Tops for Statement Elevation',
          accent: 'text-white',
          badge: 'Statement Silhouette'
        };
      case 'Low Tops':
        return {
          title: 'ESSENTIAL LOW TOPS',
          subtitle: 'Minimalist Modern Classic Footwear for Everyday Royalty',
          accent: 'text-white',
          badge: 'Daily Essential'
        };
      default:
        return {
          title: 'ROYAL SNEAKER ARCHIVE',
          subtitle: 'Handcrafted by Master Artisans in Florence using Tuscan Leather & 24K Gold Hardware',
          accent: 'text-[#C7A55B]',
          badge: 'Autumn / Winter MMXXVI'
        };
    }
  };

  const content = getBannerContent();

  return (
    <div className="relative bg-[#0D0D0D] border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Soft Gradient Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-[#C1121F]/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-[#C7A55B] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C7A55B]" />
            <span>{content.badge}</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {content.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/60 font-light mt-2 max-w-2xl leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Quick CTA */}
        <div className="shrink-0">
          <a
            href="#catalog-grid"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
