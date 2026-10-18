import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { Crown, X, ChevronLeft, ChevronRight, Maximize2, ZoomIn } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { optimizeImageUrl } from '../../lib/imageUtils';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isZoomActive, setIsZoomActive] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const zoomLensRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchDeviceRef = useRef<boolean>(false);

  const colorNames = product.colors?.map(c => c.name).join(' / ') || 'Signature Edition';

  // Detect touch devices to disable hover zoom and enable native swipe
  useEffect(() => {
    isTouchDeviceRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Clean up any pending animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Lightbox keyboard navigation (Escape to close, Arrows to switch)
  useEffect(() => {
    if (!isFullscreenOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev + 1) % product.images.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev - 1 + product.images.length) % product.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen, product.images.length]);

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % product.images.length);
  }, [product.images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  }, [product.images.length]);

  // High-performance Desktop Hover Zoom (Zero React State on MouseMove)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDeviceRef.current) return;
    boundsRef.current = e.currentTarget.getBoundingClientRect();
    setIsZoomActive(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDeviceRef.current) return;

    // Cache bounds if missing
    if (!boundsRef.current) {
      boundsRef.current = e.currentTarget.getBoundingClientRect();
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    // RequestAnimationFrame throttling: maximum one DOM paint per frame
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        if (zoomLensRef.current && boundsRef.current) {
          const bounds = boundsRef.current;
          const x = Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100));
          const y = Math.max(0, Math.min(100, ((clientY - bounds.top) / bounds.height) * 100));
          zoomLensRef.current.style.backgroundPosition = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        }
        rafIdRef.current = null;
      });
    }
  };

  const handleMouseLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    boundsRef.current = null;
    setIsZoomActive(false);
  };

  // Mobile Touch Swipe Handlers (Preserves vertical scrolling 100%)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Only switch images if the user made an intentional horizontal swipe
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      
      {/* Main Display Stage — Expanded to fill available space without fake video/360 buttons */}
      <div 
        ref={stageRef}
        className="relative aspect-square w-full bg-[#141414] border border-white/10 overflow-hidden group select-none cursor-zoom-in touch-pan-y"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          // On mobile or on click, open fullscreen lightbox
          if (isTouchDeviceRef.current) {
            setIsFullscreenOpen(true);
          }
        }}
      >
        {/* Main Base Image */}
        <div className="w-full h-full relative flex items-center justify-center p-4 sm:p-8">
          <img
            src={optimizeImageUrl(product.images[activeIndex] || product.images[0], 900, 85)}
            alt={`${product.name} in ${colorNames} - Luxury ${product.category} Sneaker Angle ${activeIndex + 1} of ${product.images.length}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-contain transition-opacity duration-200 ${
              isZoomActive ? 'opacity-20 sm:opacity-0' : 'opacity-100'
            }`}
          />

          {/* Magnifier Zoom Lens Effect — pointer-events-none guarantees wheel/scroll works without interruption */}
          <div
            ref={zoomLensRef}
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-150 ${
              isZoomActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${optimizeImageUrl(product.images[activeIndex] || product.images[0], 1600, 85)})`,
              backgroundPosition: '50% 50%',
              backgroundSize: '240%',
            }}
          />
        </div>

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isLimitedEdition && (
            <span className="px-3 py-1 bg-[#C7A55B] text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <Crown className="w-3.5 h-3.5" />
              Limited Bespoke Pair
            </span>
          )}
          {product.discountPercent && (
            <span className="px-3 py-1 bg-[#C1121F] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Action Controls & Image Counter Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white/70 text-[10px] font-mono rounded">
            {activeIndex + 1} / {product.images.length}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreenOpen(true);
            }}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-transform hover:scale-105 focus:outline-none"
            title="Fullscreen Gallery"
            aria-label="View Fullscreen High Resolution Gallery"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Navigation Arrows on Hover */}
        {product.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black text-white rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black text-white rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
              aria-label="Next product image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2.5">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`aspect-square bg-[#171717] border p-1.5 transition-all overflow-hidden relative focus:outline-none ${
              activeIndex === idx
                ? 'border-[#C1121F] ring-1 ring-[#C1121F]'
                : 'border-white/10 opacity-70 hover:opacity-100'
            }`}
            aria-label={`Select product image ${idx + 1}`}
          >
            <img
              src={optimizeImageUrl(img, 200, 75)}
              alt={`${product.name} in ${colorNames} - Thumbnail View ${idx + 1}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="High Resolution Product Lightbox"
          >
            {/* Header Controls */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold">{product.name}</h3>
                <p className="text-xs text-white/50 font-mono">
                  Florentine High-Definition Archive • Image {activeIndex + 1} of {product.images.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreenOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors focus:outline-none"
                aria-label="Close fullscreen lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Stage Image */}
            <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center p-4">
              <img
                src={optimizeImageUrl(product.images[activeIndex], 1400, 85)}
                alt={`${product.name} in ${colorNames} - Ultra HD Zoom View ${activeIndex + 1}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl"
              />

              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-white rounded-full border border-white/20 hover:bg-black focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-white rounded-full border border-white/20 hover:bg-black focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-14 h-14 bg-[#111] border p-1 shrink-0 focus:outline-none ${
                    activeIndex === idx ? 'border-[#C1121F]' : 'border-white/20 opacity-50'
                  }`}
                  aria-label={`Jump to image ${idx + 1}`}
                >
                  <img
                    src={optimizeImageUrl(img, 150, 70)}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
