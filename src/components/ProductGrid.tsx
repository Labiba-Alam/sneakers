import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X, Crown, RotateCcw, 
  ChevronDown, ArrowUpRight, Sparkles, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryType } from '../types';
import { ShopBreadcrumb } from './shop/ShopBreadcrumb';
import { ShopHeroBanner } from './shop/ShopHeroBanner';
import { ShopSearchHeader } from './shop/ShopSearchHeader';
import { ShopQuickViewModal } from './shop/ShopQuickViewModal';
import { ShopCompareDrawer } from './shop/ShopCompareDrawer';
import { ShopRecentlyViewed } from './shop/ShopRecentlyViewed';
import { ShopRecommendations } from './shop/ShopRecommendations';

const CATEGORIES: (CategoryType | 'All')[] = [
  'All',
  'Lifestyle',
  'Running',
  'Basketball',
  'High Tops',
  'Low Tops',
  'Limited Edition',
  'New Arrivals',
  'Sale',
  'Accessories'
];

const AVAILABLE_SIZES = [39, 40, 41, 42, 43, 44, 45, 46];

export const ProductGrid: React.FC = () => {
  const { products, filters, setFilters, resetFilters, formatPrice } = useStore();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewCols, setViewCols] = useState<3 | 4>(4);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category Filter
      if (filters.category !== 'All' && p.category !== filters.category) {
        return false;
      }
      // Search Filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSub = p.subtitle.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchTag = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchSub && !matchSku && !matchCat && !matchTag) return false;
      }
      // Price Range Filter
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }
      // Sizes Filter
      if (filters.selectedSizes.length > 0) {
        const hasSize = filters.selectedSizes.some(s => p.sizes.includes(s));
        if (!hasSize) return false;
      }
      // Special Flags
      if (filters.inStockOnly && p.stock <= 0) return false;
      if (filters.isFeaturedOnly && !p.isFeatured) return false;
      if (filters.isLimitedOnly && !p.isLimitedEdition) return false;
      if (filters.isSaleOnly && (!p.discountPercent || p.discountPercent <= 0)) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (filters.sortBy === 'oldest') return (a.isNewArrival ? 1 : 0) - (b.isNewArrival ? 1 : 0);
      if (filters.sortBy === 'popular' || filters.sortBy === 'best-selling') return b.reviewCount - a.reviewCount;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, filters]);

  const handleCategorySelect = (cat: CategoryType | 'All') => {
    setFilters(prev => ({ ...prev, category: cat }));
    setVisibleCount(8);
  };

  const handleSizeToggle = (size: number) => {
    setFilters(prev => {
      const exists = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter(s => s !== size)
          : [...prev.selectedSizes, size]
      };
    });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 450);
  };

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.selectedSizes.length > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.isLimitedOnly ? 1 : 0) +
    (filters.isSaleOnly ? 1 : 0) +
    (filters.maxPrice < 1500 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="bg-[#111111] min-h-screen text-white font-sans">
      
      {/* 1. Breadcrumb Navigation */}
      <ShopBreadcrumb />

      {/* 2. Hero Banner */}
      <ShopHeroBanner />

      {/* 3. Instant Search Header */}
      <ShopSearchHeader />

      {/* 4. Main Shop Catalog Layout */}
      <section id="catalog-grid" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Control Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <h2 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
              {filters.category === 'All' ? 'All Silhouettes' : `${filters.category}`}
            </h2>
            <p className="text-white/50 text-xs font-light mt-0.5">
              Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} handcrafted luxury sneakers
            </p>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-3">
            {/* Mobile / Tablet Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-4 py-2.5 bg-white/5 border border-white/15 hover:border-white/40 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C7A55B]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C1121F] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Selector */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-4 py-2.5 bg-[#181818] border border-white/15 text-white text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-[#C1121F]"
            >
              <option value="featured">Sort: Featured Drops</option>
              <option value="newest">Sort: Newest Arrivals</option>
              <option value="best-selling">Sort: Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Column Switcher */}
            <div className="hidden lg:flex items-center border border-white/15 p-1 bg-white/5">
              <button
                onClick={() => setViewCols(3)}
                className={`p-1.5 transition-colors ${viewCols === 3 ? 'bg-[#C1121F] text-white' : 'text-white/40 hover:text-white'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewCols(4)}
                className={`p-1.5 transition-colors ${viewCols === 4 ? 'bg-[#C1121F] text-white' : 'text-white/40 hover:text-white'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                filters.category === cat
                  ? 'bg-[#C1121F] text-white font-bold shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat === 'Limited Edition' && <Crown className="w-3 h-3 inline mr-1.5 text-[#C7A55B]" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8 bg-[#181818] p-3 border border-white/10">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mr-1">
              Active Filters:
            </span>
            {filters.category !== 'All' && (
              <span className="px-2.5 py-1 bg-[#222] border border-white/20 text-[11px] text-white flex items-center gap-1.5">
                Category: {filters.category}
                <X className="w-3 h-3 cursor-pointer hover:text-[#C1121F]" onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))} />
              </span>
            )}
            {filters.searchQuery && (
              <span className="px-2.5 py-1 bg-[#222] border border-white/20 text-[11px] text-white flex items-center gap-1.5">
                Query: "{filters.searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-[#C1121F]" onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} />
              </span>
            )}
            {filters.selectedSizes.map(size => (
              <span key={size} className="px-2.5 py-1 bg-[#222] border border-white/20 text-[11px] text-white flex items-center gap-1.5">
                EU {size}
                <X className="w-3 h-3 cursor-pointer hover:text-[#C1121F]" onClick={() => handleSizeToggle(size)} />
              </span>
            ))}
            {filters.isLimitedOnly && (
              <span className="px-2.5 py-1 bg-[#C7A55B] text-black text-[11px] font-bold flex items-center gap-1.5">
                Limited Edition
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, isLimitedOnly: false }))} />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#C1121F] hover:underline font-bold ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}

        {/* Layout Split: Desktop Sidebar + Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#141414] border border-white/10 p-5 space-y-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C7A55B]" />
                Filter Options
              </span>
              <button onClick={resetFilters} className="text-[10px] text-white/50 hover:text-white uppercase font-bold tracking-widest">
                Reset
              </button>
            </div>

            {/* Category Radio List */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-2">
                Categories
              </label>
              <div className="space-y-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2.5 transition-colors flex items-center justify-between ${
                      filters.category === cat ? 'bg-[#C1121F] text-white font-bold' : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter Grid */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-2">
                Shoe Size (EU)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {AVAILABLE_SIZES.map(size => {
                  const isSelected = filters.selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`py-1.5 text-xs font-bold border transition-colors ${
                        isSelected
                          ? 'bg-[#C1121F] border-[#C1121F] text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">
                <span>Max Price</span>
                <span className="text-[#C7A55B] font-bold">{formatPrice(filters.maxPrice)}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-[#C1121F] cursor-pointer"
              />
            </div>

            {/* Checkbox Flags */}
            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isLimitedOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, isLimitedOnly: e.target.checked }))}
                  className="w-4 h-4 accent-[#C1121F]"
                />
                <span className="text-[#C7A55B] font-bold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Limited Drops Only
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isSaleOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, isSaleOnly: e.target.checked }))}
                  className="w-4 h-4 accent-[#C1121F]"
                />
                <span>Sale Items Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                  className="w-4 h-4 accent-[#C1121F]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Main Product Grid Column */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-[#141414] border border-white/10 p-8">
                <Filter className="w-12 h-12 text-[#C1121F] mx-auto mb-4 opacity-70" />
                <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                  No Matching Silhouettes
                </h3>
                <p className="text-white/60 text-xs mb-6 font-light max-w-md mx-auto">
                  We couldn't find any sneakers matching your criteria. Try adjusting your query or resetting filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-widest transition-colors shadow-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={`grid grid-cols-2 sm:grid-cols-2 ${viewCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>
                  {displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Pagination */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-8 py-4 bg-white/5 border border-white/20 hover:border-[#C7A55B] text-white hover:text-[#C7A55B] text-xs font-bold uppercase tracking-[0.2em] transition-all inline-flex items-center gap-2 shadow-lg"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C7A55B]" />
                          <span>Loading Atelier Vault...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Silhouettes</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-white/40 font-mono mt-2">
                      Showing {displayedProducts.length} of {filteredProducts.length} Sneakers
                    </p>
                  </div>
                )}
              </>
            )}
          </main>

        </div>

      </section>

      {/* 5. Recently Viewed & Recommendations Sections */}
      <ShopRecentlyViewed />
      <ShopRecommendations />

      {/* 6. Overlays & Modals */}
      <ShopQuickViewModal />
      <ShopCompareDrawer />

      {/* Filter Mobile Drawer Overlay */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#141414] border-l border-white/10 h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2 text-white">
                    <SlidersHorizontal className="w-5 h-5 text-[#C7A55B]" />
                    <h3 className="font-serif-luxury text-xl font-bold">Filter Collection</h3>
                  </div>
                  <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-3">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-[#1B1B1B] border border-white/10 text-white text-xs font-semibold uppercase focus:outline-none focus:border-[#C1121F]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/60 font-semibold block mb-3">Shoe Size (EU)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {AVAILABLE_SIZES.map(size => {
                        const isSelected = filters.selectedSizes.includes(size);
                        return (
                          <button
                            key={size}
                            onClick={() => handleSizeToggle(size)}
                            className={`py-2 text-xs font-bold border transition-colors ${
                              isSelected ? 'bg-[#C1121F] border-[#C1121F] text-white' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            EU {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-white/60 font-semibold mb-2">
                      <span>Maximum Price</span>
                      <span className="text-[#C7A55B] font-bold">{formatPrice(filters.maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1500"
                      step="50"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-[#C1121F] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="w-1/2 py-3 bg-white/5 border border-white/10 text-white/80 hover:text-white text-xs uppercase font-bold tracking-widest"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-1/2 py-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-widest"
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
