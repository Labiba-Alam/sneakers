import React, { useState } from 'react';
import { Crown, Mail, Phone, MapPin, Instagram, Facebook, ArrowRight, ShieldCheck, Award, Lock, Sparkles, Truck, RefreshCw, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PolicyView } from '../legal/PolicyModals';
import { ViewState } from '../../types';

export const Footer: React.FC = () => {
  const { setView, setFilters, setIsOrderTrackingOpen, setIsSizeGuideOpen, showToast } = useStore();
  const [activePolicy, setActivePolicy] = useState<ViewState | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleCategoryFilter = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat as any }));
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Subscribed to KINGSMAN drop alerts. Welcome drop code: KINGSMAN500', 'success');
    setNewsletterEmail('');
  };

  return (
    <>
      <footer className="bg-[#111111] text-[#F8F8F8] pt-20 pb-12 border-t border-white/10 font-sans relative overflow-hidden">
        
        {/* Background Decorative Crest Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C1121F]/10 blur-[120px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Top Trust Badges Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-16 border-b border-white/10 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#C7A55B]/40 text-[#C7A55B] flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Unisex Streetwear</h4>
                <p className="text-xs text-white/60">Curated premium imports</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#C1121F]/40 text-[#C1121F] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Nationwide Express</h4>
                <p className="text-xs text-white/60">Steadfast & Pathao courier</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#C7A55B]/40 text-[#C7A55B] flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">3-Day Defect Window</h4>
                <p className="text-xs text-white/60">Prompt exchange support</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-none bg-[#181818] border border-white/20 text-white flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Secure Payment</h4>
                <p className="text-xs text-white/60">bKash, Nagad & SSLCommerz</p>
              </div>
            </div>
          </div>

          {/* Main 5-Column Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-16 border-b border-white/10">
            
            {/* Col 1 & 2: Brand Identity */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-base shadow-md">
                  K
                </div>
                <span className="font-royal text-2xl font-black text-white tracking-[0.25em]">KINGSMAN</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light max-w-sm">
                KINGSMAN is a premium unisex streetwear sneaker brand based in Dhaka, Bangladesh. Every pair is thoroughly quality-checked before dispatch, featuring gold-tone accents, durable outsoles, and exceptional comfort.
              </p>
              
              {/* Official Social Links */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/kingsmanszn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/Kingsmanszn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@kingsmanszn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white font-bold text-xs flex items-center justify-center transition-colors font-mono"
                >
                  TK
                </a>
                <a
                  href="https://www.pinterest.com/kingsmanszn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white font-bold text-xs flex items-center justify-center transition-colors font-mono"
                >
                  PIN
                </a>
              </div>
            </div>

            {/* Col 3: Royal Collections */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-serif-luxury text-sm font-bold text-[#C7A55B] uppercase tracking-[0.2em]">Collections</h4>
              <ul className="space-y-2.5 text-xs text-white/70 font-light">
                <li>
                  <button onClick={() => handleCategoryFilter('Men Sneakers')} className="hover:text-white transition-colors cursor-pointer">Men Sneakers</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryFilter('Women Sneakers')} className="hover:text-white transition-colors cursor-pointer">Women Sneakers</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryFilter('High Tops')} className="hover:text-white transition-colors cursor-pointer">High Tops</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryFilter('Casual Sneakers')} className="hover:text-white transition-colors cursor-pointer">Casual Sneakers</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryFilter('Running Shoes')} className="hover:text-white transition-colors cursor-pointer">Running Silhouettes</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryFilter('Accessories')} className="hover:text-white transition-colors cursor-pointer">Accessories & Trees</button>
                </li>
              </ul>
            </div>

            {/* Col 4: Customer Services & Policies */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-[0.2em]">Policies & Care</h4>
              <ul className="space-y-2.5 text-xs text-white/70 font-light">
                <li>
                  <button onClick={() => setActivePolicy('shipping-policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Shipping Policy (৳100/৳160)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('refund-policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Refund & Return Policy (3 Days)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('privacy-policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsOrderTrackingOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                    Track Order (Steadfast/Pathao)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Contact & WhatsApp (01581054939)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Private Invitation Newsletter */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-[#C7A55B]" />
                <span>Private Drop Archive</span>
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-white">RECEIVE NEW SNEAKER DROPS</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Subscribe to get private notifications on limited numbered releases and receive an instant ৳ 500 welcome promo code.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-3 bg-[#181818] border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C1121F]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#C1121F] hover:bg-[#9E0E18] text-white text-xs font-bold uppercase tracking-widest shrink-0 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Operations & Legal Strip */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50">
            
            <div className="flex items-center gap-2 text-center md:text-left">
              <MapPin className="w-4 h-4 text-[#C7A55B] shrink-0" />
              <span>House 44, Road 3, Block B, Mirpur 12, Dhaka (Corporate & Dispatch Office • Online Only)</span>
            </div>

            {/* Payment & Logistics Badges */}
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">bKash</span>
              <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">Nagad</span>
              <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">Rocket</span>
              <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">SSLCommerz</span>
              <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">COD</span>
              <span className="px-2.5 py-1 bg-[#C7A55B]/20 text-[#C7A55B] font-mono text-[10px] font-bold">Steadfast</span>
              <span className="px-2.5 py-1 bg-[#C1121F]/20 text-[#C1121F] font-mono text-[10px] font-bold">Pathao</span>
            </div>

            <p className="text-[11px] font-mono tracking-wider text-center md:text-right">
              © 2026 KINGSMAN LUXURY SNEAKERS. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </footer>

      {/* Render Policy Modal when active */}
      {activePolicy && (
        <PolicyView view={activePolicy} onClose={() => setActivePolicy(null)} />
      )}
    </>
  );
};
