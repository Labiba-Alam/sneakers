import React from 'react';
import { Crown, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BrandStory: React.FC = () => {
  const { setView } = useStore();

  return (
    <section className="py-24 bg-[#F8F8F8] border-t border-b border-[#111111]/10 relative overflow-hidden text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full bg-white border border-[#111111]/15 overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85"
                alt="KINGSMAN Curated Sneaker Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel-dark border border-white/10">
                <p className="text-[10px] text-[#C7A55B] font-bold uppercase tracking-widest">CURATED SNEAKER IMPORTS • BANGLADESH</p>
                <p className="font-serif-luxury text-sm font-bold text-white mt-0.5">Every pair is quality-checked before it ships to you.</p>
              </div>
            </div>
          </div>

          {/* Right Brand Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#111111] text-[#C7A55B] text-xs font-bold uppercase tracking-[0.2em]">
              <Crown className="w-3.5 h-3.5 text-[#C7A55B]" />
              <span>Curated Luxury & Quality</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] leading-tight">
              CURATED FOR DISTINCTION. <br />
              <span className="italic font-normal text-[#111111]/70">REDEFINED FOR THE</span> <br />
              <span className="text-[#C1121F]">
                MODERN MONARCH.
              </span>
            </h2>

            <p className="text-[#111111]/80 text-sm font-normal leading-relaxed">
              KINGSMAN brings carefully curated premium sneaker imports to Bangladesh with uncompromising quality standards. Every pair is individually inspected for build precision, material finish, and cushioning comfort before nationwide dispatch.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#111111]/10">
              <div>
                <p className="font-serif-luxury text-xl font-bold text-[#111111]">Strict Quality Check</p>
                <p className="text-xs text-[#111111]/60 font-normal mt-1">Multi-point inspection on stitching, materials, and sole adhesion before delivery.</p>
              </div>
              <div>
                <p className="font-serif-luxury text-xl font-bold text-[#C1121F]">Gold-Tone Detailing</p>
                <p className="text-xs text-[#111111]/60 font-normal mt-1">Signature metallic aglets, heel crests, and accents designed for commanding presence.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setView('catalog')}
                className="px-8 py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-xl red-border-glow inline-flex items-center gap-3"
              >
                <span>Experience the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
