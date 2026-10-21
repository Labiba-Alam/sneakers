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
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { Heart } from 'lucide-react';

// Lazy-Loaded Heavy Modals & Views (Code Splitting for Optimal Bundle Size)
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SizeGuideModal = lazy(() => import('./components/SizeGuideModal').then(m => ({ default: m.SizeGuideModal })));
const OrderConfirmationModal = lazy(() => import('./components/OrderConfirmationModal').then(m => ({ default: m.OrderConfirmationModal })));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal').then(m => ({ default: m.OrderTrackingModal })));
const WishlistView = lazy(() => import('./components/WishlistView').then(m => ({ default: m.WishlistView })));
const ContactView = lazy(() => import('./components/ContactView').then(m => ({ default: m.ContactView })));
const PolicyView = lazy(() => import('./components/legal/PolicyModals').then(m => ({ default: m.PolicyView })));

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

        {(view === 'admin' || view === 'admin-login') && (
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

        {view === 'contact' && (
          <Suspense fallback={<SuspenseFallback />}>
            <ContactView />
          </Suspense>
        )}

        {view === 'wishlist' && (
          <Suspense fallback={<SuspenseFallback />}>
            <WishlistView />
          </Suspense>
        )}

        {['shipping-policy', 'refund-policy', 'terms', 'privacy-policy'].includes(view) && (
          <Suspense fallback={<SuspenseFallback />}>
            <PolicyView view={view} onClose={() => setView('home')} />
          </Suspense>
        )}
      </ResponsiveLayout>

      {/* Overlays & Modals */}
      <CartDrawer />
      <SearchModal />
      <CustomerAccountModal />
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
