import React, { useState } from 'react';
import { Product } from '../../types';
import { ZoomIn, Crown, Play, RotateCw, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { optimizeImageUrl } from '../../lib/imageUtils';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'photos' | 'video' | '360'>('photos');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const colorNames = product.colors?.map(c => c.name).join(' / ') || 'Signature Edition';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Toggle Switcher: Photos / Video / 360 Spin */}
      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('photos')}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'photos'
                ? 'bg-[#C1121F] text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Studio Photography
          </button>
          <button
            onClick={() => setViewMode('video')}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
              viewMode === 'video'
                ? 'bg-[#C1121F] text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3 text-[#C7A55B]" />
            Catwalk Video
          </button>
          <button
            onClick={() => setViewMode('360')}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
              viewMode === '360'
                ? 'bg-[#C1121F] text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <RotateCw className="w-3 h-3 text-[#C7A55B]" />
            360° Studio Spin
          </button>
        </div>

        <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
          HD Florentine Lens 4K
        </span>
      </div>

      {/* Main Display Stage */}
      <div 
        className="relative aspect-square w-full bg-[#151515] border border-white/10 overflow-hidden group select-none cursor-zoom-in"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        {viewMode === 'photos' && (
          <div className="w-full h-full relative flex items-center justify-center p-6">
            <img
              src={optimizeImageUrl(product.images[activeIndex] || product.images[0], 900, 80)}
              alt={`${product.name} in ${colorNames} - Luxury ${product.category} Sneaker Studio Angle ${activeIndex + 1} of ${product.images.length}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isZooming ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Magnifier Zoom Lens Effect */}
            {isZooming && (
              <div
                className="absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-200"
                style={{
                  backgroundImage: `url(${optimizeImageUrl(product.images[activeIndex] || product.images[0], 1600, 85)})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%',
                }}
              />
            )}
          </div>
        )}

        {viewMode === 'video' && (
          <div className="w-full h-full bg-[#0F0F0F] flex flex-col items-center justify-center p-8 text-center relative">
            <div className="w-20 h-20 rounded-full bg-[#C1121F]/20 border border-[#C1121F] flex items-center justify-center mb-4 animate-pulse">
              <Play className="w-8 h-8 text-[#C1121F] fill-[#C1121F] ml-1" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">
              Catwalk Showcase Video
            </h4>
            <p className="text-xs text-white/60 max-w-sm">
              Experience the movement of hand-burnished Tuscan leather in 4K HDR.
            </p>
            <button
              onClick={() => setViewMode('photos')}
              className="mt-4 text-xs text-[#C7A55B] font-bold uppercase underline"
            >
              Back to Studio Photos
            </button>
          </div>
        )}

        {viewMode === '360' && (
          <div className="w-full h-full bg-[#141414] flex flex-col items-center justify-center p-8 text-center relative">
            <RotateCw className="w-16 h-16 text-[#C7A55B] animate-spin mb-4 duration-3000" />
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">
              360° Atelier Interactive Spin
            </h4>
            <p className="text-xs text-white/60 max-w-sm">
              Drag left or right to inspect 360 degrees of 24K Gold Minted details.
            </p>
          </div>
        )}

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

        {/* Action Controls Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-transform hover:scale-105"
            title="Fullscreen Gallery"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Arrows on Hover */}
        {product.images.length > 1 && viewMode === 'photos' && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black text-white rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black text-white rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveIndex(idx);
              setViewMode('photos');
            }}
            className={`aspect-square bg-[#171717] border p-1.5 transition-all overflow-hidden relative ${
              activeIndex === idx && viewMode === 'photos'
                ? 'border-[#C1121F] ring-1 ring-[#C1121F]'
                : 'border-white/10 opacity-70 hover:opacity-100'
            }`}
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8">
            {/* Header Controls */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold">{product.name}</h3>
                <p className="text-xs text-white/50 font-mono">
                  Image {activeIndex + 1} of {product.images.length}
                </p>
              </div>

              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
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
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-white rounded-full border border-white/20 hover:bg-black"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-white rounded-full border border-white/20 hover:bg-black"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-14 h-14 bg-[#111] border p-1 shrink-0 ${
                    activeIndex === idx ? 'border-[#C1121F]' : 'border-white/20 opacity-50'
                  }`}
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
