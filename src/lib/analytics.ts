// KINGSMAN Direct Production Tracking Engine - GA4 & Meta Pixel
import { Product, Order, CartItem } from '../types';
import { env, isGA4Available, isMetaPixelAvailable } from './env';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export type ConsentStatus = 'granted' | 'declined' | null;

const COOKIE_CONSENT_KEY = 'kingsman_cookie_consent';

/**
 * Check if the visitor has explicitly granted tracking consent
 */
export const getCookieConsent = (): ConsentStatus => {
  try {
    if (typeof window === 'undefined') return null;
    const val = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (val === 'granted' || val === 'declined') return val;
    return null;
  } catch {
    return null;
  }
};

/**
 * Returns true if tracking consent is granted
 */
export const hasTrackingConsent = (): boolean => {
  return getCookieConsent() === 'granted';
};

/**
 * Grant tracking consent & immediately initialize scripts if env vars are present
 */
export const grantTrackingConsent = () => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COOKIE_CONSENT_KEY, 'granted');
    initTrackingScripts();
  } catch {
    // Safely ignore storage errors
  }
};

/**
 * Decline tracking consent
 */
export const declineTrackingConsent = () => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
  } catch {
    // Safely ignore storage errors
  }
};

let isInitialized = false;

/**
 * Dynamically injects GA4 and Meta Pixel tracking scripts
 * Only loads if:
 * 1. User has granted cookie consent
 * 2. Valid, non-placeholder environment variables are configured
 */
export const initTrackingScripts = () => {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (isInitialized) return;

  try {
    // 1. Initialize GA4 directly (no GTM wrapper)
    if (isGA4Available()) {
      const gaId = env.GA_MEASUREMENT_ID.trim();
      
      // Inject Google Analytics gtag.js script if not already present
      if (!document.getElementById('kingsman-ga4-script')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'kingsman-ga4-script';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer?.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', gaId, {
          send_page_view: false, // We dispatch page_view manually on SPA route transitions
        });
      }
    }

    // 2. Initialize Meta Pixel directly (no GTM wrapper)
    if (isMetaPixelAvailable()) {
      const pixelId = env.META_PIXEL_ID.trim();

      if (!document.getElementById('kingsman-meta-pixel-script')) {
        /* eslint-disable */
        (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.id = 'kingsman-meta-pixel-script';
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */

        if (window.fbq) {
          window.fbq('init', pixelId);
        }
      }
    }

    isInitialized = true;
  } catch {
    // Keep local dev clean and ignore errors silently
  }
};

// ==========================================
// Core E-Commerce & Lifecycle Event Dispatchers
// ==========================================

/**
 * 1. Page View Tracking
 * Fired on SPA view transitions
 */
export const trackPageView = (url: string, title: string = 'KINGSMAN Luxury Footwear') => {
  try {
    if (!hasTrackingConsent()) return;

    // GA4
    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
        page_location: window.location.href,
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('track', 'PageView');
    }
  } catch {
    // Silent fail
  }
};

/**
 * 2. View Item Tracking
 * Fired when a customer opens a product detail modal or quick view
 */
export const trackProductView = (product: Product, currency: string = 'USD') => {
  try {
    if (!hasTrackingConsent() || !product) return;

    // GA4
    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', 'view_item', {
        currency: currency,
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            item_brand: 'KINGSMAN',
            item_variant: product.sku,
          },
        ],
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: currency,
      });
    }
  } catch {
    // Silent fail
  }
};

/**
 * 3. Add to Cart Tracking
 * Fired when a customer selects a size and adds footwear to bag
 */
export const trackAddToCart = (
  product: Product,
  selectedSize: number,
  selectedColor?: { name: string; hex: string },
  quantity: number = 1,
  currency: string = 'USD'
) => {
  try {
    if (!hasTrackingConsent() || !product) return;
    const value = product.price * quantity;

    // GA4
    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', 'add_to_cart', {
        currency: currency,
        value: value,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_variant: `EU ${selectedSize}${selectedColor ? ` / ${selectedColor.name}` : ''}`,
            price: product.price,
            quantity: quantity,
            item_brand: 'KINGSMAN',
          },
        ],
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: value,
        currency: currency,
      });
    }
  } catch {
    // Silent fail
  }
};

/**
 * 4. Add to Wishlist Tracking
 * Fired when a customer saves a silhouette to their Royal Wishlist
 */
export const trackAddToWishlist = (product: Product, currency: string = 'USD') => {
  try {
    if (!hasTrackingConsent() || !product) return;

    // GA4
    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', 'add_to_wishlist', {
        currency: currency,
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            item_brand: 'KINGSMAN',
          },
        ],
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('track', 'AddToWishlist', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: currency,
      });
    }
  } catch {
    // Silent fail
  }
};

/**
 * 5. Begin Checkout Tracking
 * Fired when a customer proceeds to checkout with their shopping bag
 */
export const trackBeginCheckout = (items: CartItem[], subtotal: number, currency: string = 'USD') => {
  try {
    if (!hasTrackingConsent() || !items || items.length === 0) return;

    // GA4
    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', 'begin_checkout', {
        currency: currency,
        value: subtotal,
        items: items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          item_category: item.product.category,
          item_variant: `EU ${item.selectedSize}`,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('track', 'InitiateCheckout', {
        value: subtotal,
        currency: currency,
        num_items: items.reduce((sum, i) => sum + (i.quantity || 1), 0),
        content_ids: items.map((i) => i.product.id),
        content_type: 'product',
      });
    }
  } catch {
    // Silent fail
  }
};

/**
 * 6. Purchase Tracking
 * Fired when an order is successfully placed or online payment is verified
 * Transmits value, currency, transaction ID, and full item details
 */
export const trackPurchase = (order: Order) => {
  try {
    if (!hasTrackingConsent() || !order) return;

    const currency = order.currency || 'USD';
    const items = order.items || [];

    // GA4
    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        value: order.total,
        currency: currency,
        shipping: order.shippingFee || 0,
        tax: 0,
        coupon: order.discountAmount ? 'PROMO_DISCOUNT' : undefined,
        items: items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          item_category: item.product.category,
          item_variant: `EU ${item.selectedSize}${item.selectedColor ? ` / ${item.selectedColor.name}` : ''}`,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('track', 'Purchase', {
        value: order.total,
        currency: currency,
        content_type: 'product',
        content_ids: items.map((i) => i.product.id),
        contents: items.map((i) => ({
          id: i.product.id,
          quantity: i.quantity,
          item_price: i.product.price,
        })),
        num_items: items.reduce((sum, i) => sum + (i.quantity || 1), 0),
      });
    }
  } catch {
    // Silent fail
  }
};

/**
 * Custom Event Tracking Helper (e.g. WhatsApp, Call, Size Guide)
 */
export const trackCustomEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    if (!hasTrackingConsent()) return;

    if (typeof window !== 'undefined' && window.gtag && isGA4Available()) {
      window.gtag('event', eventName, params);
    }
    if (typeof window !== 'undefined' && window.fbq && isMetaPixelAvailable()) {
      window.fbq('trackCustom', eventName, params);
    }
  } catch {
    // Silent fail
  }
};
