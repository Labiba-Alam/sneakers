import React from 'react';
import { motion } from 'framer-motion';
import { Crown, ArrowRight, Sparkles, Flame, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { megaMenuSlide } from '../../styles/animations';
import { SNEAKER_BRANDS, CLOTHING_TYPES } from '../../data/products';
import { SneakerBrand, ClothingType } from '../../types';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const { setFilters, setView, products } = useStore();

  if (!isOpen) return null;

  const handleBrandClick = (brand: SneakerBrand) => {
    setFilters(prev => ({
      ...prev,
      department: 'Sneakers',
      brand: brand,
      clothingType: 'All',
      category: brand,
      isSaleOnly: false,
      isNewArrivalsOnly: false,
      searchQuery: '',
    }));
    setView('catalog');
    onClose();
  };

  const handleClothingClick = (type: ClothingType) => {
    setFilters(prev => ({
      ...prev,
      department: 'Clothing',
      clothingType: type,
      brand: 'All',
      category: type,
      isSaleOnly: false,
      isNewArrivalsOnly: false,
      searchQuery: '',
    }));
    setView('catalog');
    onClose();
  };

  const handleNewCollectionClick = () => {
    setFilters(prev => ({
      ...prev,
      department: 'All',
      category: 'All',
      brand: 'All',
      clothingType: 'All',
      isNewArrivalsOnly: true,
      isSaleOnly: false,
      searchQuery: '',
    }));
    setView('catalog');
    onClose();
  };

  const handleSaleClick = () => {
    setFilters(prev => ({
      ...prev,
      department: 'All',
      category: 'All',
      brand: 'All',
      clothingType: 'All',
      isSaleOnly: true,
      isNewArrivalsOnly: false,
      searchQuery: '',
    }));
    setView('catalog');
    onClose();
  };

  const sneakerSubtitles: Record<SneakerBrand, string> = {
    'Nike': 'Air Force 1, Dunk Low, and iconic court silhouettes',
    'Jordan': 'Retro Highs, AJ4s, and numbered court heritage',
    'Adidas': 'Terrace Sambas, Gazelle Bolds, and classic 3-Stripes',
    'New Balance': 'Made in USA 990v6s and archival 550 basketball lows',
    'Converse': 'Upgraded Chuck 70s and 1986 Weapon court low tops',
    'Louis Vuitton': 'Handcrafted Fiesso d’Artico Italian luxury trainers',
  };

  const clothingSubtitles: Record<ClothingType, string> = {
    'T-Shirt': '280 GSM heavyweight organic cotton drop-shoulder tees',
    'Hoodie': '450 GSM French Terry thermal-lined boxy hoodies',
    'Sweatshirt': '380 GSM brushed raglan crewneck pullovers',
  };

  return (
    <motion.div
      variants={megaMenuSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseLeave={onClose}
      className="absolute top-full inset-x-0 bg-white border-b border-[#111111]/15 shadow-2xl z-50 text-[#111111]"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Top Two-Column Grid: Column 1 = Sneakers (Brands) | Column 2 = Clothing (Types) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-6 border-b border-[#111111]/10">
          
          {/* Column 1: SNEAKERS (BRANDS) */}
          <div className="md:col-span-6 space-y-4 md:border-r md:border-[#111111]/10 md:pr-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#C1121F] text-[11px] font-bold uppercase tracking-[0.2em]">
                <Crown className="w-4 h-4 text-[#C7A55B]" />
                <span>Sneakers (Brands)</span>
              </div>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, department: 'Sneakers', category: 'All', brand: 'All' }));
                  setView('catalog');
                  onClose();
                }}
                className="text-[10px] text-[#C1121F] hover:underline font-bold uppercase tracking-wider"
              >
                View All Sneakers &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SNEAKER_BRANDS.map((brand) => {
                const count = products.filter(p => p.department === 'Sneakers' && p.brand === brand).length;
                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                    className="text-left p-3 hover:bg-[#F3F3F3] transition-colors rounded group flex flex-col justify-between border border-transparent hover:border-[#111111]/10"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif-luxury text-sm font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors">
                        {brand}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 font-semibold">
                        {count}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#111111]/60 font-normal mt-1 line-clamp-1">
                      {sneakerSubtitles[brand]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: CLOTHING (TYPES) */}
          <div className="md:col-span-6 space-y-4 md:pl-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#111111] text-[11px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4 text-[#C7A55B]" />
                <span>Clothing (Types)</span>
              </div>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, department: 'Clothing', category: 'All', clothingType: 'All' }));
                  setView('catalog');
                  onClose();
                }}
                className="text-[10px] text-[#C1121F] hover:underline font-bold uppercase tracking-wider"
              >
                View All Clothing &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {CLOTHING_TYPES.map((type) => {
                const count = products.filter(p => p.department === 'Clothing' && p.clothingType === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => handleClothingClick(type)}
                    className="w-full text-left p-3 hover:bg-[#F3F3F3] transition-colors rounded group flex items-center justify-between border border-transparent hover:border-[#111111]/10"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif-luxury text-sm font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors">
                          {type}
                        </span>
                        <span className="px-2 py-0.5 bg-black/5 text-[#111111] text-[9px] font-bold uppercase rounded">
                          {count} Models
                        </span>
                      </div>
                      <p className="text-[11px] text-[#111111]/60 font-normal mt-0.5">
                        {clothingSubtitles[type]}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#111111]/40 group-hover:text-[#C1121F] group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Direct Collection Links (New Arrivals & Sale) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewCollectionClick}
              className="px-4 py-2 bg-[#F8F8F8] hover:bg-[#F0F0F0] border border-[#111111]/10 text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 rounded transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C7A55B]" />
              <span>New Arrivals</span>
              <span className="px-1.5 py-0.2 bg-[#C7A55B] text-black text-[9px] font-black rounded">
                Latest
              </span>
            </button>

            <button
              onClick={handleSaleClick}
              className="px-4 py-2 bg-[#C1121F]/10 hover:bg-[#C1121F]/20 border border-[#C1121F]/30 text-xs font-bold uppercase tracking-wider text-[#C1121F] flex items-center gap-2 rounded transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-[#C1121F]" />
              <span>Sale & Special Offers</span>
              <span className="px-1.5 py-0.2 bg-[#C1121F] text-white text-[9px] font-black rounded">
                Up to 20%
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({
                ...prev,
                department: 'All',
                category: 'All',
                brand: 'All',
                clothingType: 'All',
                gender: 'All',
                isSaleOnly: false,
                isNewArrivalsOnly: false,
              }));
              setView('catalog');
              onClose();
            }}
            className="text-xs uppercase font-bold tracking-widest text-[#111111] hover:text-[#C1121F] flex items-center gap-1.5 transition-colors"
          >
            <span>Browse Complete Atelier Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
