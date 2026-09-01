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
  const { selectedProduct, products, addToRecentlyViewed } = useStore();

  // If no product is selected, fall back to first product from store
  const product = selectedProduct || products[0];

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, addToRecentlyViewed]);

  const [selectedSize, setSelectedSize] = useState<number>(product?.sizes[0] || 42);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] || { name: 'Royal Crimson', hex: '#C1121F' }
  );
  const [quantity, setQuantity] = useState(1);

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
