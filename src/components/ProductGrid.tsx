import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X, Crown, RotateCcw, 
  ChevronDown, ChevronUp, Check, Loader2, Sparkles, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryType, DepartmentType, GenderType, SneakerBrand, ClothingType } from '../types';
import { SNEAKER_BRANDS, CLOTHING_TYPES } from '../data/products';
import { ShopBreadcrumb } from './shop/ShopBreadcrumb';
import { ShopHeroBanner } from './shop/ShopHeroBanner';
import { ShopQuickViewModal } from './shop/ShopQuickViewModal';
import { ShopCompareDrawer } from './shop/ShopCompareDrawer';
import { ShopRecentlyViewed } from './shop/ShopRecentlyViewed';
import { ShopRecommendations } from './shop/ShopRecommendations';

const SNEAKER_SIZES: number[] = [39, 40, 41, 42, 43, 44, 45, 46];
const CLOTHING_SIZES: string[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const ProductGrid: React.FC = () => {
  const { products, filters, setFilters, resetFilters, formatPrice } = useStore();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewCols, setViewCols] = useState<3 | 4>(4);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Desktop Collapsible Filter Sidebar Sections
  const [collapsedSections, setCollapsedSections] = useState<{
    department: boolean;
    brandType: boolean;
    gender: boolean;
    size: boolean;
    price: boolean;
    availability: boolean;
  }>({
    department: false,
    brandType: false,
    gender: false,
    size: false,
    price: false,
    availability: false
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isFilterDrawerOpen]);

  // Escape key to dismiss drawer
  useEffect(() => {
    if (!isFilterDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterDrawerOpen]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Department Filter
      if (filters.department && filters.department !== 'All') {
        if (p.department !== filters.department) return false;
      }

      // 2. Category / Brand / ClothingType Filter
      if (filters.category && filters.category !== 'All') {
        const matchesCategory = p.category === filters.category;
        const matchesBrand = p.brand === filters.category;
        const matchesClothingType = p.clothingType === filters.category;
        if (!matchesCategory && !matchesBrand && !matchesClothingType) return false;
      }

      // Brand specific filter
      if (filters.brand && filters.brand !== 'All') {
        if (p.brand !== filters.brand) return false;
      }

      // Clothing type specific filter
      if (filters.clothingType && filters.clothingType !== 'All') {
        if (p.clothingType !== filters.clothingType) return false;
      }

      // 3. Gender Filter
      if (filters.gender && filters.gender !== 'All') {
        if (filters.gender === 'Men') {
          if (p.gender !== 'Men' && p.gender !== 'Unisex') return false;
        } else if (filters.gender === 'Women') {
          if (p.gender !== 'Women' && p.gender !== 'Unisex') return false;
        } else if (filters.gender === 'Unisex') {
          if (p.gender !== 'Unisex') return false;
        }
      }

      // 4. Search Filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSub = (p.subtitle || '').toLowerCase().includes(q);
        const matchSku = (p.sku || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        const matchType = (p.clothingType || '').toLowerCase().includes(q);
        const matchDept = (p.department || '').toLowerCase().includes(q);
        const matchTag = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchSub && !matchSku && !matchCat && !matchBrand && !matchType && !matchDept && !matchTag) {
          return false;
        }
      }

      // 5. Price Range Filter in BDT
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      // 6. Sizes Filter (handles both number and string sizes)
      if (filters.selectedSizes.length > 0) {
        const productSizesStr = (p.sizes || []).map(String);
        const selectedSizesStr = filters.selectedSizes.map(String);
        const hasSize = selectedSizesStr.some(s => productSizesStr.includes(s));
        if (!hasSize) return false;
      }

      // 7. Special Flags
      if (filters.inStockOnly && p.stock <= 0) return false;
      if (filters.isFeaturedOnly && !p.isFeatured) return false;
      if (filters.isLimitedOnly && !p.isLimitedEdition) return false;
      if (filters.isSaleOnly) {
        const isDiscounted = (p.discountPercent && p.discountPercent > 0) || (p.originalPrice && p.originalPrice > p.price);
        if (!isDiscounted) return false;
      }
      if (filters.isNewArrivalsOnly && !p.isNewArrival) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, filters]);

  const handleDepartmentSelect = (dept: DepartmentType | 'All') => {
    setFilters(prev => ({
      ...prev,
      department: dept,
      category: 'All',
      brand: 'All',
      clothingType: 'All',
      selectedSizes: [] // Reset sizes since department changes sizing matrix
    }));
    setVisibleCount(8);
  };

  const handleCategorySelect = (cat: CategoryType | 'All') => {
    setFilters(prev => {
      const isSneaker = (SNEAKER_BRANDS as readonly string[]).includes(cat);
      const isClothing = (CLOTHING_TYPES as readonly string[]).includes(cat);
      return {
        ...prev,
        category: cat,
        department: isSneaker ? 'Sneakers' : isClothing ? 'Clothing' : prev.department,
        brand: isSneaker ? (cat as SneakerBrand) : 'All',
        clothingType: isClothing ? (cat as ClothingType) : 'All'
      };
    });
    setVisibleCount(8);
  };

  const handleGenderSelect = (gender: GenderType | 'All') => {
    setFilters(prev => ({ ...prev, gender }));
    setVisibleCount(8);
  };

  const handleSizeToggle = (size: number | string) => {
    setFilters(prev => {
      const sizeStr = String(size);
      const exists = prev.selectedSizes.map(String).includes(sizeStr);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter(s => String(s) !== sizeStr)
          : [...prev.selectedSizes, size]
      };
    });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 300);
  };

  const activeFilterCount =
    (filters.department && filters.department !== 'All' ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.gender && filters.gender !== 'All' ? 1 : 0) +
    filters.selectedSizes.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.isLimitedOnly ? 1 : 0) +
    (filters.isSaleOnly ? 1 : 0) +
    (filters.isNewArrivalsOnly ? 1 : 0) +
    (filters.maxPrice < 15000 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const currentCategoryTitle = useMemo(() => {
    if (filters.category !== 'All') return filters.category;
    if (filters.department && filters.department !== 'All') return `${filters.department} Collection`;
    if (filters.gender && filters.gender !== 'All') return `${filters.gender}'s Collection`;
    if (filters.isNewArrivalsOnly) return 'New Arrivals';
    if (filters.isSaleOnly) return 'Sale Collection';
    return 'All Products';
  }, [filters]);

  const showSneakerSizes = !filters.department || filters.department === 'All' || filters.department === 'Sneakers';
  const showClothingSizes = !filters.department || filters.department === 'All' || filters.department === 'Clothing';

  return (
    <div className="bg-[#111111] min-h-screen text-white font-sans">
      
      {/* 1. Breadcrumb Navigation */}
      <ShopBreadcrumb />

      {/* 2. Responsive Hero Banner */}
      <ShopHeroBanner />

      {/* 3. Main Catalog Section */}
      <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* ========================================================================= */}
        {/* MOBILE & TABLET STICKY TOOLBAR (< 1024px) */}
        {/* ========================================================================= */}
        <div className="lg:hidden sticky top-16 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 py-2.5 bg-[#141414]/95 backdrop-blur-md border-y border-white/10 mb-4 flex items-center justify-between gap-2 shadow-lg">
          {/* Filter Trigger Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex-1 py-2.5 px-3 bg-white/5 border border-white/15 hover:border-white/30 active:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] transition-colors"
            aria-label={`Open filter drawer. ${activeFilterCount} filters active`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C7A55B]" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C1121F] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Control */}
          <div className="flex-1 relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full py-2.5 px-3 bg-[#1C1C1C] border border-white/15 text-white text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-[#C1121F] min-h-[44px] cursor-pointer"
              aria-label="Sort product catalog"
            >
              <option value="featured">Sort: Recommended</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile Collection Title & Result Count */}
        <div className="lg:hidden flex items-baseline justify-between mb-3 px-0.5">
          <h2 className="font-serif-luxury text-lg font-bold text-white tracking-wide">
            {currentCategoryTitle}
          </h2>
          <span className="text-[11px] text-white/50 font-mono">
            {filteredProducts.length} items
          </span>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE FILTER CHIPS (VISIBLE ON ALL VIEWPORTS) */}
        {/* ========================================================================= */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 text-xs">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold shrink-0">
              Active:
            </span>
            {filters.department && filters.department !== 'All' && (
              <button
                onClick={() => handleDepartmentSelect('All')}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <span>Dept: {filters.department}</span>
                <X className="w-3 h-3 text-[#C1121F]" />
              </button>
            )}
            {filters.category !== 'All' && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, category: 'All', brand: 'All', clothingType: 'All' }))}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <span>{filters.category}</span>
                <X className="w-3 h-3 text-[#C1121F]" />
              </button>
            )}
            {filters.gender && filters.gender !== 'All' && (
              <button
                onClick={() => handleGenderSelect('All')}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <span>Gender: {filters.gender}</span>
                <X className="w-3 h-3 text-[#C1121F]" />
              </button>
            )}
            {filters.selectedSizes.map(size => (
              <button
                key={String(size)}
                onClick={() => handleSizeToggle(size)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <span>Size: {size}</span>
                <X className="w-3 h-3 text-[#C1121F]" />
              </button>
            ))}
            {filters.maxPrice < 15000 && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, maxPrice: 15000 }))}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <span>Max: {formatPrice(filters.maxPrice)}</span>
                <X className="w-3 h-3 text-[#C1121F]" />
              </button>
            )}
            {filters.isNewArrivalsOnly && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, isNewArrivalsOnly: false }))}
                className="px-2.5 py-1 bg-[#C7A55B]/20 border border-[#C7A55B] text-[#C7A55B] rounded text-[11px] flex items-center gap-1.5 shrink-0 font-bold"
              >
                <span>New Arrivals</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.isSaleOnly && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, isSaleOnly: false }))}
                className="px-2.5 py-1 bg-[#C1121F]/20 border border-[#C1121F] text-[#C1121F] rounded text-[11px] flex items-center gap-1.5 shrink-0 font-bold"
              >
                <span>Sale Items</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.inStockOnly && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, inStockOnly: false }))}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <span>In Stock</span>
                <X className="w-3 h-3 text-[#C1121F]" />
              </button>
            )}
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#C1121F] hover:underline font-bold ml-auto shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN LAYOUT SPLIT: DESKTOP SIDEBAR + RESPONSIVE GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* DESKTOP COMPACT FILTER SIDEBAR (>= 1024px ONLY) */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#141414] border border-white/10 p-5 space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C7A55B]" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#C1121F] text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters} 
                  className="text-[10px] text-[#C1121F] hover:underline uppercase font-bold tracking-widest"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. Department Selector */}
            <div className="border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('department')}
                className="w-full flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70 hover:text-white font-bold py-1"
              >
                <span>Department</span>
                {collapsedSections.department ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              
              {!collapsedSections.department && (
                <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                  {(['All', 'Sneakers', 'Clothing'] as const).map(dept => {
                    const isSelected = (!filters.department && dept === 'All') || filters.department === dept;
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => handleDepartmentSelect(dept)}
                        className={`py-1.5 text-xs font-semibold rounded border transition-colors ${
                          isSelected
                            ? 'bg-[#C1121F] border-[#C1121F] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {dept}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Brand / Clothing Type */}
            <div className="border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('brandType')}
                className="w-full flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70 hover:text-white font-bold py-1"
              >
                <span>
                  {filters.department === 'Clothing' ? 'Clothing Type' : filters.department === 'Sneakers' ? 'Sneaker Brand' : 'Brand / Type'}
                </span>
                {collapsedSections.brandType ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              
              {!collapsedSections.brandType && (
                <div className="space-y-1 mt-2.5 max-h-56 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
                      filters.category === 'All'
                        ? 'bg-[#C1121F] text-white font-bold shadow-sm' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>All Brands & Types</span>
                    {filters.category === 'All' && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Sneakers Brands */}
                  {(!filters.department || filters.department === 'All' || filters.department === 'Sneakers') && (
                    <>
                      <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider pt-2 pb-1 px-1">
                        Sneaker Brands
                      </div>
                      {SNEAKER_BRANDS.map(brand => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleCategorySelect(brand)}
                          className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
                            filters.category === brand 
                              ? 'bg-[#C1121F] text-white font-bold shadow-sm' 
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{brand}</span>
                          {filters.category === brand && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Clothing Types */}
                  {(!filters.department || filters.department === 'All' || filters.department === 'Clothing') && (
                    <>
                      <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider pt-2 pb-1 px-1">
                        Clothing Categories
                      </div>
                      {CLOTHING_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleCategorySelect(type)}
                          className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
                            filters.category === type 
                              ? 'bg-[#C1121F] text-white font-bold shadow-sm' 
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{type}</span>
                          {filters.category === type && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 3. Gender Filter */}
            <div className="border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('gender')}
                className="w-full flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70 hover:text-white font-bold py-1"
              >
                <span>Gender</span>
                {collapsedSections.gender ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              
              {!collapsedSections.gender && (
                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                  {(['All', 'Men', 'Women', 'Unisex'] as const).map(gender => {
                    const isSelected = (!filters.gender && gender === 'All') || filters.gender === gender;
                    return (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleGenderSelect(gender)}
                        className={`py-1.5 text-xs font-semibold rounded border transition-colors ${
                          isSelected
                            ? 'bg-[#C1121F] border-[#C1121F] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {gender}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Sizes */}
            <div className="border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('size')}
                className="w-full flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70 hover:text-white font-bold py-1"
              >
                <span>Size</span>
                {collapsedSections.size ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.size && (
                <div className="space-y-3 mt-2.5">
                  {showSneakerSizes && (
                    <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">
                        Sneakers (EU)
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {SNEAKER_SIZES.map(size => {
                          const isSelected = filters.selectedSizes.map(String).includes(String(size));
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`py-1.5 text-xs font-bold border transition-colors rounded ${
                                isSelected
                                  ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-sm'
                                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {showClothingSizes && (
                    <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">
                        Clothing
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {CLOTHING_SIZES.map(size => {
                          const isSelected = filters.selectedSizes.map(String).includes(String(size));
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`py-1.5 text-xs font-bold border transition-colors rounded ${
                                isSelected
                                  ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-sm'
                                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 5. Price Range in BDT */}
            <div className="border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70 hover:text-white font-bold py-1"
              >
                <span>Price (BDT)</span>
                {collapsedSections.price ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.price && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-white/70">
                    <span>Up to:</span>
                    <span className="text-[#C7A55B] font-bold">{formatPrice(filters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="15000"
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    className="w-full accent-[#C1121F] cursor-pointer h-1.5 bg-white/20 rounded"
                    aria-label="Filter maximum price in BDT"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>৳ 1,500</span>
                    <span>৳ 15,000</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Availability & Collections */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('availability')}
                className="w-full flex items-center justify-between text-[11px] uppercase tracking-widest text-white/70 hover:text-white font-bold py-1"
              >
                <span>Availability & Tags</span>
                {collapsedSections.availability ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.availability && (
                <div className="space-y-2.5 mt-2.5">
                  <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                      className="w-4 h-4 accent-[#C1121F] rounded"
                    />
                    <span>In-Stock Only</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(filters.isNewArrivalsOnly)}
                      onChange={(e) => setFilters(prev => ({ ...prev, isNewArrivalsOnly: e.target.checked }))}
                      className="w-4 h-4 accent-[#C7A55B] rounded"
                    />
                    <span className="text-[#C7A55B] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      New Arrivals Only
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.isSaleOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, isSaleOnly: e.target.checked }))}
                      className="w-4 h-4 accent-[#C1121F] rounded"
                    />
                    <span className="text-[#C1121F] font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      Sale Items Only
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.isLimitedOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, isLimitedOnly: e.target.checked }))}
                      className="w-4 h-4 accent-[#C1121F] rounded"
                    />
                    <span className="text-[#C7A55B] font-bold flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" />
                      Limited Drops
                    </span>
                  </label>
                </div>
              )}
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN PRODUCT GRID COLUMN */}
          {/* ========================================================================= */}
          <main className="lg:col-span-9">
            
            {/* Desktop & Tablet Top Bar (>= 1024px) */}
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-serif-luxury text-xl font-bold text-white tracking-wide">
                  {currentCategoryTitle}
                </h2>
                <p className="text-white/50 text-xs font-light mt-0.5">
                  Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} curated pieces
                </p>
              </div>

              {/* Desktop Controls: Sort + Columns */}
              <div className="flex items-center gap-3">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="px-3 py-2 bg-[#1C1C1C] border border-white/15 text-white text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-[#C1121F] cursor-pointer"
                  aria-label="Sort product catalog"
                >
                  <option value="featured">Sort: Recommended</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Column Switcher */}
                <div className="flex items-center border border-white/15 p-1 bg-white/5">
                  <button
                    onClick={() => setViewCols(3)}
                    className={`p-1.5 transition-colors ${viewCols === 3 ? 'bg-[#C1121F] text-white' : 'text-white/40 hover:text-white'}`}
                    title="3 Columns"
                    aria-label="3 column layout"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewCols(4)}
                    className={`p-1.5 transition-colors ${viewCols === 4 ? 'bg-[#C1121F] text-white' : 'text-white/40 hover:text-white'}`}
                    title="4 Columns"
                    aria-label="4 column layout"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-[#141414] border border-white/10 p-6 sm:p-8">
                <Filter className="w-10 h-10 sm:w-12 sm:h-12 text-[#C1121F] mx-auto mb-4 opacity-70" />
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mb-2">
                  No Matching Items
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mb-6 font-light max-w-md mx-auto">
                  We couldn't find any products matching your selected criteria. Try adjusting the department, brand, or size filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-widest transition-colors shadow-lg min-h-[44px]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Responsive Product Grid */}
                <div className={`grid grid-cols-2 sm:grid-cols-2 ${viewCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-3 sm:gap-6`}>
                  {displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Pagination */}
                {hasMore && (
                  <div className="mt-10 sm:mt-12 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-8 py-3.5 sm:py-4 bg-white/5 border border-white/20 hover:border-[#C7A55B] text-white hover:text-[#C7A55B] text-xs font-bold uppercase tracking-[0.2em] transition-all inline-flex items-center gap-2 shadow-lg min-h-[44px]"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C7A55B]" />
                          <span>Loading Collection...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Items</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-white/40 font-mono mt-2">
                      Showing {displayedProducts.length} of {filteredProducts.length} Products
                    </p>
                  </div>
                )}
              </>
            )}
          </main>

        </div>

      </section>

      {/* 4. Recently Viewed & Recommendations Sections */}
      <ShopRecentlyViewed />
      <ShopRecommendations />

      {/* 5. Overlays & Modals */}
      <ShopQuickViewModal />
      <ShopCompareDrawer />

      {/* ========================================================================= */}
      {/* MOBILE & TABLET BOTTOM SHEET / SLIDE DRAWER (< 1024px) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div 
            className="fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Filter collection"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-sm sm:max-w-md bg-[#141414] border-l border-white/10 h-full shadow-2xl p-5 sm:p-6 overflow-y-auto z-10 flex flex-col justify-between font-sans text-white"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#C7A55B]" />
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-bold">Filters</h3>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#C1121F] text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsFilterDrawerOpen(false)} 
                    className="p-2 text-white/60 hover:text-white rounded-full focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Department */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-2">
                      Department
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['All', 'Sneakers', 'Clothing'] as const).map(dept => {
                        const isSelected = (!filters.department && dept === 'All') || filters.department === dept;
                        return (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => handleDepartmentSelect(dept)}
                            className={`py-2.5 text-xs font-semibold rounded border transition-colors min-h-[40px] ${
                              isSelected
                                ? 'bg-[#C1121F] border-[#C1121F] text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            {dept}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Brand / Type Selector */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-2">
                      {filters.department === 'Clothing' ? 'Clothing Type' : filters.department === 'Sneakers' ? 'Sneaker Brand' : 'Brand / Type'}
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleCategorySelect(e.target.value as any)}
                      className="w-full px-3.5 py-3 bg-[#1C1C1C] border border-white/15 text-white text-xs font-semibold uppercase focus:outline-none focus:border-[#C1121F] min-h-[44px]"
                      aria-label="Filter by brand or clothing type"
                    >
                      <option value="All">All Brands & Types</option>
                      {(!filters.department || filters.department === 'All' || filters.department === 'Sneakers') && (
                        <optgroup label="Sneaker Brands">
                          {SNEAKER_BRANDS.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </optgroup>
                      )}
                      {(!filters.department || filters.department === 'All' || filters.department === 'Clothing') && (
                        <optgroup label="Clothing Categories">
                          {CLOTHING_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['All', 'Men', 'Women', 'Unisex'] as const).map(g => {
                        const isSelected = (!filters.gender && g === 'All') || filters.gender === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGenderSelect(g)}
                            className={`py-2 text-xs font-semibold rounded border transition-colors min-h-[38px] ${
                              isSelected
                                ? 'bg-[#C1121F] border-[#C1121F] text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sizes (Contextual) */}
                  {showSneakerSizes && (
                    <div>
                      <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-2">
                        Sneakers Size (EU)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {SNEAKER_SIZES.map(size => {
                          const isSelected = filters.selectedSizes.map(String).includes(String(size));
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`py-2 text-xs font-bold border transition-colors rounded min-h-[38px] flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-sm' 
                                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                              }`}
                            >
                              EU {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {showClothingSizes && (
                    <div>
                      <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-2">
                        Clothing Size
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {CLOTHING_SIZES.map(size => {
                          const isSelected = filters.selectedSizes.map(String).includes(String(size));
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`py-2 text-xs font-bold border transition-colors rounded min-h-[38px] flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-sm' 
                                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price Range Slider in BDT */}
                  <div>
                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-white/60 font-semibold mb-2">
                      <span>Maximum Price</span>
                      <span className="text-[#C7A55B] font-bold">{formatPrice(filters.maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="1500"
                      max="15000"
                      step="500"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-[#C1121F] cursor-pointer h-2 bg-white/20 rounded"
                      aria-label="Filter maximum price in BDT"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                      <span>৳ 1,500</span>
                      <span>৳ 15,000</span>
                    </div>
                  </div>

                  {/* Checkbox Options */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                        className="w-4 h-4 accent-[#C1121F] rounded"
                      />
                      <span>In-Stock Only</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={Boolean(filters.isNewArrivalsOnly)}
                        onChange={(e) => setFilters(prev => ({ ...prev, isNewArrivalsOnly: e.target.checked }))}
                        className="w-4 h-4 accent-[#C7A55B] rounded"
                      />
                      <span className="text-[#C7A55B] font-semibold">New Arrivals Only</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={filters.isSaleOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, isSaleOnly: e.target.checked }))}
                        className="w-4 h-4 accent-[#C1121F] rounded"
                      />
                      <span className="text-[#C1121F] font-semibold">Sale Items Only</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={filters.isLimitedOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, isLimitedOnly: e.target.checked }))}
                        className="w-4 h-4 accent-[#C1121F] rounded"
                      />
                      <span className="text-[#C7A55B] font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" />
                        Limited Drops
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-white/10 flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3.5 bg-white/5 border border-white/15 text-white/80 hover:text-white text-xs uppercase font-bold tracking-widest min-h-[44px] transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-widest shadow-lg min-h-[44px] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
