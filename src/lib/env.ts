/**
 * KINGSMAN Client Environment Configuration Utility
 * 
 * Safely accesses client-side environment variables (prefixed with VITE_).
 * Server-only secrets are strictly isolated on the backend.
 */

// Universal safe environment getter for client bundle
const getClientEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    // Check Vite client import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return (import.meta.env[key] || defaultValue).toString().trim();
    }
  } catch {
    // Ignore if import.meta is unavailable
  }
  return defaultValue;
};

// Analytics & Marketing Variables
const rawGa4 = getClientEnvVar('VITE_GA4_ID', getClientEnvVar('VITE_GA_MEASUREMENT_ID', ''));
const rawPixel = getClientEnvVar('VITE_META_PIXEL_ID', '');
const rawGtm = getClientEnvVar('VITE_GTM_ID', '');
const rawGoogleAds = getClientEnvVar('VITE_GOOGLE_ADS_ID', getClientEnvVar('VITE_GOOGLE_ADS_CONVERSION_ID', ''));
const siteUrl = getClientEnvVar('VITE_SITE_URL', 'https://kingsmanszn.com');

export const env = {
  // Public Client & Marketing Variables
  SITE_URL: siteUrl,
  GA_MEASUREMENT_ID: rawGa4,
  VITE_GA4_ID: rawGa4,
  META_PIXEL_ID: rawPixel,
  VITE_META_PIXEL_ID: rawPixel,
  GTM_ID: rawGtm,
  VITE_GTM_ID: rawGtm,
  GOOGLE_ADS_CONVERSION_ID: rawGoogleAds,
  VITE_GOOGLE_ADS_ID: rawGoogleAds,
};

// Verification helpers
export const isGA4Available = (): boolean => {
  const id = env.GA_MEASUREMENT_ID;
  return Boolean(
    id &&
    !id.includes('XXXXX') &&
    !id.includes('placeholder') &&
    id.startsWith('G-') &&
    id.length >= 7
  );
};

export const isMetaPixelAvailable = (): boolean => {
  const id = env.META_PIXEL_ID;
  return Boolean(
    id &&
    !id.includes('XXXXX') &&
    !id.includes('placeholder') &&
    /^\d{5,25}$/.test(id)
  );
};

export const isGTMAvailable = (): boolean => {
  const id = env.GTM_ID;
  return Boolean(id && id.startsWith('GTM-') && !id.includes('XXXXX'));
};

export const isGoogleAdsAvailable = (): boolean => {
  const id = env.GOOGLE_ADS_CONVERSION_ID;
  return Boolean(id && id.startsWith('AW-') && !id.includes('XXXXX'));
};

export default env;
