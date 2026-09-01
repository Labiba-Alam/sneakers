/**
 * KINGSMAN Royal Sneakers - Main Application Entry
 */

import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { FeaturedCollection } from './components/FeaturedCollection';
import { CategoryGrid } from './components/CategoryGrid';
import { LimitedDrop } from './components/LimitedDrop';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { BrandStory } from './components/BrandStory';
import { WhyKingsman } from './components/WhyKingsman';
import { ReviewsSection } from './components/ReviewsSection';
import { InstagramGallery } from './components/InstagramGallery';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { SearchModal } from './components/SearchModal';
import { SEOHead } from './components/SEOHead';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ResponsiveLayout } from './components/layout/ResponsiveLayout';
import { Heart } from 'lucide-react';

// Lazy-Loaded Heavy Modals & Views (Code Splitting for Optimal Bundle Size)
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SizeGuideModal = lazy(() => import('./components/SizeGuideModal').then(m => ({ default: m.SizeGuideModal })));
const OrderConfirmationModal = lazy(() => import('./components/OrderConfirmationModal').then(m => ({ default: m.OrderConfirmationModal })));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal').then(m => ({ default: m.OrderTrackingModal })));

const SuspenseFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[#0D0D0D]">
    <div className="w-8 h-8 border-2 border-[#C7A55B]/30 border-t-[#C7A55B] rounded-full animate-spin mb-4" />
    <span className="font-serif-luxury text-xs text-[#C7A55B] tracking-widest uppercase">Accessing Atelier...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { view, wishlist, setView, selectedProduct, filters } = useStore();

  return (
    <>
      <SEOHead 
        product={view === 'product-detail' ? selectedProduct || undefined : undefined}
        categoryName={view === 'catalog' && filters.category !== 'All' ? filters.category : undefined}
      />
      <ResponsiveLayout

        headerNav={<Header />}
        footerNav={<Footer />}
      >
        {view === 'home' && (
          <>
            <Hero />
            <TrustBar />
            <FeaturedCollection />
            <CategoryGrid />
            <LimitedDrop />
            <BrandStory />
            <WhyKingsman />
            <ReviewsSection />
            <InstagramGallery />
            <Newsletter />
          </>
        )}

        {view === 'catalog' && <ProductGrid />}

        {view === 'product-detail' && (
          <Suspense fallback={<SuspenseFallback />}>
            <ProductDetailModal />
          </Suspense>
        )}

        {view === 'checkout' && (
          <Suspense fallback={<SuspenseFallback />}>
            <CheckoutModal />
          </Suspense>
        )}

        {view === 'order-confirmation' && (
          <Suspense fallback={<SuspenseFallback />}>
            <OrderConfirmationModal />
          </Suspense>
        )}

        {view === 'admin' && (
          <Suspense fallback={<SuspenseFallback />}>
            <AdminDashboard />
          </Suspense>
        )}

        {view === 'brand-story' && (
          <>
            <BrandStory />
            <WhyKingsman />
            <ReviewsSection />
          </>
        )}

        {view === 'wishlist' && (
          <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-widest mb-1">
                <Heart className="w-4 h-4 fill-[#C1121F]" />
                <span>Royal Wishlist</span>
              </div>
              <h1 className="font-serif-luxury text-3xl font-bold text-[#111111]">YOUR SAVED SILHOUETTES</h1>
            </div>
            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#111111]/10 p-8 shadow-sm">
                <Heart className="w-12 h-12 text-[#111111]/20 mx-auto mb-4" />
                <p className="font-serif-luxury text-xl font-bold text-[#111111] mb-2">Your Wishlist is Empty</p>
                <p className="text-xs text-[#111111]/60 mb-6">Explore the collection and click the heart icon on any silhouette.</p>
                <button onClick={() => setView('catalog')} className="px-6 py-3 bg-[#C1121F] text-white text-xs font-bold uppercase tracking-widest">
                  Discover Sneakers
                </button>
              </div>
            ) : (
              <ProductGrid />
            )}
          </div>
        )}
      </ResponsiveLayout>

      {/* Overlays & Modals */}
      <CartDrawer />
      <SearchModal />
      <Suspense fallback={null}>
        <SizeGuideModal />
        <OrderTrackingModal />
      </Suspense>
      <ToastContainer />
      <PWAInstallPrompt />
      <CookieConsentBanner />
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
