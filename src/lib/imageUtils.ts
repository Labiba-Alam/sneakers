/**
 * Image Optimization & Compression Utilities for KINGSMAN Atelier
 */

export const optimizeImageUrl = (url?: string, width = 800, quality = 75): string => {
  if (!url) return '';
  
  // If it's an Unsplash CDN image, apply optimal format, compression, and dimension scaling
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', quality.toString());
      return parsedUrl.toString();
    } catch {
      // Fallback string replacement
      return url.split('?')[0] + `?auto=format&fit=crop&w=${width}&q=${quality}`;
    }
  }

  return url;
};
