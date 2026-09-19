import { Currency } from '../types';

/**
 * Classnames Merger Utility
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(' ');
}

/**
 * Currency Formatter
 * Entire site uses BDT (৳)
 */
export function formatCurrency(
  amount: number, 
  currency: Currency = 'BDT'
): string {
  return `৳${Math.round(amount).toLocaleString('en-BD')}`;
}

/**
 * Calculate Discount Percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Email Format Validator
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Truncate String with Ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

/**
 * Generate Unique ID
 */
export function generateId(prefix: string = 'ks'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

/**
 * Format Date String
 */
export function formatDate(dateString?: string): string {
  const d = dateString ? new Date(dateString) : new Date();
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
