/**
 * KINGSMAN Environment Configuration Utility
 * 
 * Safely accesses runtime environment variables without throwing errors when secrets are missing.
 * Provides sensible default fallback placeholders for zero-configuration local development.
 */

// Universal safe environment getter (works in browser Vite client and Node.js server)
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    // 1. Check Node.js process.env
    if (typeof process !== 'undefined' && process && process.env && process.env[key]) {
      return process.env[key] || defaultValue;
    }
  } catch {
    // Ignore ReferenceError if process is not defined
  }

  try {
    // 2. Check Vite client import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key] || defaultValue;
    }
  } catch {
    // Ignore if import.meta is not available
  }

  return defaultValue;
};

export const env = {
  // App & Base URLs
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  APP_URL: getEnvVar('APP_URL', 'https://kingsman-luxury.com'),
  PORT: 3000,

  // AI & Gemini
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY', ''),

  // Supabase (Optional)
  SUPABASE_URL: getEnvVar('SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', ''),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),

  // Analytics & Tracking (Production Tracking via GA4 and Meta Pixel)
  GA_MEASUREMENT_ID: getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID', getEnvVar('VITE_GA_MEASUREMENT_ID', getEnvVar('GA_MEASUREMENT_ID', ''))),
  META_PIXEL_ID: getEnvVar('NEXT_PUBLIC_META_PIXEL_ID', getEnvVar('VITE_META_PIXEL_ID', getEnvVar('META_PIXEL_ID', ''))),
  GTM_ID: getEnvVar('NEXT_PUBLIC_GTM_ID', getEnvVar('VITE_GTM_ID', '')),
  GOOGLE_ADS_CONVERSION_ID: getEnvVar('NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID', getEnvVar('VITE_GOOGLE_ADS_CONVERSION_ID', '')),

  // Email & Notifications (Optional)
  RESEND_API_KEY: getEnvVar('RESEND_API_KEY', ''),
  SENDER_EMAIL: getEnvVar('SENDER_EMAIL', 'concierge@kingsman-luxury.com'),
  OWNER_EMAIL: getEnvVar('OWNER_EMAIL', 'orders@kingsman-luxury.com'),

  // Google Sheets Order Sync Webhook (Optional)
  GOOGLE_SHEETS_WEBHOOK_URL: getEnvVar('GOOGLE_SHEETS_WEBHOOK_URL', ''),

  // Monitoring (Optional)
  SENTRY_DSN: getEnvVar('SENTRY_DSN', ''),

  // SSLCommerz Payment Gateway Configuration
  SSLCOMMERZ_STORE_ID: getEnvVar('SSLCOMMERZ_STORE_ID', 'testbox'),
  SSLCOMMERZ_STORE_PASSWORD: getEnvVar('SSLCOMMERZ_STORE_PASSWORD', 'qwerty'),
  SSLCOMMERZ_IS_SANDBOX: getEnvVar('SSLCOMMERZ_IS_SANDBOX', 'true') === 'true',

  // Security & Admin (Optional)
  ADMIN_SECRET_KEY: getEnvVar('ADMIN_SECRET_KEY', 'kingsman-admin-demo-key'),
  JWT_SECRET: getEnvVar('JWT_SECRET', 'kingsman-jwt-demo-secret'),
};

// Helper checks for optional third-party integrations
export const isGeminiAvailable = (): boolean => Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
export const isSupabaseAvailable = (): boolean => Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
export const isSSLCommerzConfigured = (): boolean => Boolean(env.SSLCOMMERZ_STORE_ID && env.SSLCOMMERZ_STORE_PASSWORD);
export const isGoogleSheetsSyncConfigured = (): boolean => Boolean(env.GOOGLE_SHEETS_WEBHOOK_URL && !env.GOOGLE_SHEETS_WEBHOOK_URL.includes('your-google-script-url'));
export const isGA4Available = (): boolean => {
  const id = (env.GA_MEASUREMENT_ID || '').trim();
  return Boolean(
    id &&
    !id.includes('XXXXX') &&
    !id.includes('MY_GA') &&
    !id.includes('placeholder') &&
    !id.includes('G-0000000000') &&
    id.length >= 7
  );
};

export const isMetaPixelAvailable = (): boolean => {
  const id = (env.META_PIXEL_ID || '').trim();
  return Boolean(
    id &&
    !id.includes('123456789') &&
    !id.includes('XXXXX') &&
    !id.includes('MY_PIXEL') &&
    !id.includes('placeholder') &&
    /^\d{5,25}$/.test(id)
  );
};
export const isResendAvailable = (): boolean => Boolean(env.RESEND_API_KEY && !env.RESEND_API_KEY.includes('abcdef'));
export const isSentryAvailable = (): boolean => Boolean(env.SENTRY_DSN && !env.SENTRY_DSN.includes('xxxxxx'));

export default env;
