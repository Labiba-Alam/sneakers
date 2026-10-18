import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShopBreadcrumb } from './shop/ShopBreadcrumb';
import { ShopRecommendations } from './shop/ShopRecommendations';
import { ShopRecentlyViewed } from './shop/ShopRecentlyViewed';
import { ProductSEO } from './product/ProductSEO';
import { ProductGallery } from './product/ProductGallery';
import { ProductInfoSection } from './product/ProductInfoSection';
import { SizeSelector } from './product/SizeSelector';
import { ProductActions } from './product/ProductActions';
import { DeliveryAndPayments } from './product/DeliveryAndPayments';
import { ProductAccordions } from './product/ProductAccordions';
import { FrequentlyBoughtTogether } from './product/FrequentlyBoughtTogether';
import { ProductReviewsSection } from './product/ProductReviewsSection';
import { StickyMobileCartBar } from './product/StickyMobileCartBar';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, products, addToRecentlyViewed, setView } = useStore();

  const product = selectedProduct;

  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>({
    name: 'Royal Crimson',
    hex: '#C1121F'
  });
  const [quantity, setQuantity] = useState(1);

  // Sync size and color when product changes
  useEffect(() => {
    if (product) {
      if (product.sizes?.length) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors?.length) {
        setSelectedColor(product.colors[0]);
      }
      setQuantity(1);
    }
  }, [product?.id]);

  // Track recently viewed once when product ID changes
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  // If no product is selected and products catalog is loading
  if (products.length === 0) {
    return (
      <div className="bg-[#0B0B0B] text-[#F8F8F8] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 w-48 bg-white/10 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 aspect-[4/3] bg-white/10" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-4 w-32 bg-white/10" />
              <div className="h-8 w-64 bg-white/10" />
              <div className="h-6 w-24 bg-white/10" />
              <div className="h-24 w-full bg-white/10" />
              <div className="h-12 w-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no product is found/matched
  if (!selectedProduct && products.length > 0) {
    return (
      <div className="bg-[#0B0B0B] text-[#F8F8F8] min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-white/5 border border-white/15 flex items-center justify-center text-2xl font-serif text-[#C7A55B]">
            404
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-royal font-black tracking-wider text-white">
              SILHOUETTE NOT FOUND
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              The sneaker you are looking for has retired from our active archive or the URL may be incorrect.
            </p>
          </div>
          <button
            onClick={() => {
              setView('catalog');
              try { window.history.pushState({ view: 'catalog' }, '', '/shop'); } catch {}
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C1121F] hover:bg-[#a00f1a] text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-[#0B0B0B] text-[#F8F8F8] min-h-screen py-8 pb-32 sm:pb-20">
      
      {/* 1. Dynamic Head SEO & JSON-LD Schema Injection */}
      <ProductSEO product={product} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. Breadcrumbs Navigation */}
        <div className="mb-6">
          <ShopBreadcrumb currentItemName={product.name} category={product.category} />
        </div>

        {/* 3. Main Product Section (2 Columns Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Left Column: Gallery & Zoom Lightbox (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Product Information & Purchase Controls (5 Cols Sticky) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="sticky top-24 space-y-2">
              
              {/* Product Info Section (Brand, Name, Rating, Price, Stock) */}
              <ProductInfoSection product={product} />

              {/* Color Selection if multiple colors */}
              {product.colors && product.colors.length > 1 && (
                <div className="py-3 border-b border-white/10">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">
                    Color Finish: <span className="text-white font-bold">{selectedColor.name}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        style={{ backgroundColor: col.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor.name === col.name ? 'border-[#C7A55B] scale-110 shadow-lg' : 'border-white/20 hover:scale-105'
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector Matrix with AI Advisor Integration */}
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                productStock={product.stock}
              />

              {/* Primary Action Buttons (Quantity, Add to Cart, Buy Now, Wishlist, Compare) */}
              <ProductActions
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              {/* Delivery, Returns & Payment Badges */}
              <DeliveryAndPayments />

              {/* Product Accordions (Description, Specs, Care, Authenticity) */}
              <ProductAccordions product={product} />

            </div>
          </div>

        </div>

        {/* 4. Frequently Bought Together Bundle Module */}
        <FrequentlyBoughtTogether currentProduct={product} />

        {/* 5. Product Reviews & Q&A Module */}
        <ProductReviewsSection product={product} />

        {/* 6. Curated Product Recommendations */}
        <div className="py-12 border-t border-white/10">
          <ShopRecommendations />
        </div>

        {/* 7. Recently Viewed Products */}
        <div className="pb-12">
          <ShopRecentlyViewed />
        </div>

      </div>

      {/* 8. Sticky Mobile Cart Bar */}
      <StickyMobileCartBar
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />

    </div>
  );
};
