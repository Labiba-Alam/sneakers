import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopHeroBanner: React.FC = () => {
  const { filters } = useStore();

  const getBannerContent = () => {
    if (filters.isSaleOnly) {
      return {
        title: 'EXCLUSIVE SALE ARCHIVE',
        subtitle: 'Privilege reductions on authentic footwear and luxury apparel',
        badge: 'Limited Reductions'
      };
    }
    if (filters.isNewArrivalsOnly) {
      return {
        title: 'NEW ARRIVALS DROP',
        subtitle: 'The latest seasonal acquisitions fresh from Florence atelier',
        badge: 'Just Landed'
      };
    }

    switch (filters.category) {
      case 'Nike':
        return {
          title: 'NIKE HERITAGE & INNOVATION',
          subtitle: 'Air Max, Dunk Low, and iconic silhouettes crafted with premium materials',
          badge: 'Iconic Athleisure'
        };
      case 'Jordan':
        return {
          title: 'AIR JORDAN ARCHIVE',
          subtitle: 'Retro Highs, championship legacies, and premium Italian leather finishes',
          badge: 'Court Royalty'
        };
      case 'Adidas':
        return {
          title: 'ADIDAS ORIGINALS & PERFORMANCE',
          subtitle: 'Terrace culture classics and contemporary comfort silhouettes',
          badge: 'Three Stripes Heritage'
        };
      case 'New Balance':
        return {
          title: 'NEW BALANCE HERITAGE',
          subtitle: 'Timeless lifestyle running designs built on ergonomic support and prestige suede',
          badge: 'Classic Craft'
        };
      case 'Converse':
        return {
          title: 'CONVERSE STATEMENT CHUCKS',
          subtitle: 'Deconstructed 70s canvas elevations with luxury vulcanized accents',
          badge: 'Enduring Silhouette'
        };
      case 'Louis Vuitton':
        return {
          title: 'LOUIS VUITTON MAISON FOOTWEAR',
          subtitle: 'Artisanal runway craftsmanship, monogram embossing, and calf leather luxury',
          badge: 'Haute Horlogerie & Fashion'
        };
      case 'T-Shirt':
        return {
          title: 'LUXURY ESSENTIAL T-SHIRTS',
          subtitle: 'Heavyweight organic combed cotton with tailored streetwear drape',
          badge: 'Wardrobe Foundation'
        };
      case 'Hoodie':
        return {
          title: 'PREMIUM OVERSIZED HOODIES',
          subtitle: 'French terry fleece, brushed interior warmth, and minimalist branding',
          badge: 'Cold Season Essential'
        };
      case 'Sweatshirt':
        return {
          title: 'HERITAGE CREWNECK SWEATSHIRTS',
          subtitle: 'Double-stitched structural tailoring for enduring leisure comfort',
          badge: 'Subtle Sophistication'
        };
      default:
        if (filters.department === 'Sneakers') {
          return {
            title: 'SNEAKERS COLLECTION',
            subtitle: 'Curated international brands: Nike, Jordan, Adidas, New Balance, Converse, and Louis Vuitton',
            badge: 'Footwear Atelier'
          };
        }
        if (filters.department === 'Clothing') {
          return {
            title: 'CLOTHING & APPAREL',
            subtitle: 'Heavyweight luxury basics: T-Shirts, Hoodies, and Sweatshirts engineered for distinction',
            badge: 'Apparel Studio'
          };
        }
        return {
          title: 'KINGSMAN LUXURY ARCHIVE',
          subtitle: 'Handcrafted luxury sneakers and bespoke streetwear curated for Dhaka connoisseurs',
          badge: 'Current Season'
        };
    }
  };

  const content = getBannerContent();

  return (
    <div className="relative bg-[#0D0D0D] border-b border-white/10 py-5 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Soft Gradient Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-[#C1121F]/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/5 border border-white/10 text-[9px] sm:text-[10px] text-[#C7A55B] font-bold uppercase tracking-widest mb-1.5 sm:mb-2.5">
            <Sparkles className="w-3 h-3 text-[#C7A55B]" />
            <span>{content.badge}</span>
          </div>

          <h1 className="font-serif-luxury text-xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {content.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/60 font-light mt-1 sm:mt-2 max-w-2xl leading-relaxed hidden sm:block">
            {content.subtitle}
          </p>
        </div>

        {/* Desktop Quick Badge */}
        <div className="hidden lg:block shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-[#C7A55B] uppercase tracking-widest font-mono block">Authentic Luxury Import</span>
            <span className="text-xs text-white/50">Verified & Delivered in Dhaka</span>
          </div>
        </div>
      </div>
    </div>
  );
};
