import React, { useState } from 'react';
import { Product } from '../../types';
import { ChevronRight, Award, ShieldCheck, Feather, Sparkles } from 'lucide-react';

interface ProductAccordionsProps {
  product: Product;
}

export const ProductAccordions: React.FC<ProductAccordionsProps> = ({ product }) => {
  const [openTab, setOpenTab] = useState<'desc' | 'specs' | 'care' | 'authenticity'>('desc');

  const toggleTab = (tab: 'desc' | 'specs' | 'care' | 'authenticity') => {
    setOpenTab(openTab === tab ? ('' as any) : tab);
  };

  return (
    <div className="py-6 border-t border-white/10 space-y-3">
      
      {/* 1. Description & Story Accordion */}
      <div className="border border-white/10 bg-[#161616]">
        <button
          type="button"
          onClick={() => toggleTab('desc')}
          className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-[#C7A55B] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C7A55B]" />
            Craftsmanship Story & Heritage
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${openTab === 'desc' ? 'rotate-90 text-[#C1121F]' : 'text-white/40'}`} />
        </button>

        {openTab === 'desc' && (
          <div className="px-5 pb-5 pt-2 text-xs text-white/70 font-light leading-relaxed border-t border-white/5 space-y-3">
            <p className="font-medium text-white">{product.description}</p>
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C7A55B] font-bold block">Master Artisan Details:</span>
              <ul className="list-disc list-inside space-y-1 text-white/80">
                {product.craftsmanshipDetails.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 2. Technical Specifications Accordion */}
      <div className="border border-white/10 bg-[#161616]">
        <button
          type="button"
          onClick={() => toggleTab('specs')}
          className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-[#C7A55B] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C7A55B]" />
            Technical Specifications
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${openTab === 'specs' ? 'rotate-90 text-[#C1121F]' : 'text-white/40'}`} />
        </button>

        {openTab === 'specs' && (
          <div className="px-5 pb-5 pt-2 text-xs text-white/80 border-t border-white/5">
            <table className="w-full text-left text-xs divide-y divide-white/10">
              <tbody>
                <tr>
                  <td className="py-2.5 font-bold text-white/50 w-1/3">Upper Material</td>
                  <td className="py-2.5 font-medium text-white">{product.materials}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white/50">Lining</td>
                  <td className="py-2.5 font-medium text-white">Breathable Cushioned Sockliner</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white/50">Outsole</td>
                  <td className="py-2.5 font-medium text-white">High-Traction Anti-Slip Rubber Outsole</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white/50">Hardware</td>
                  <td className="py-2.5 font-medium text-[#C7A55B] font-bold">Polished Gold-Tone Eyelets & Crown Insignia</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white/50">Weight</td>
                  <td className="py-2.5 font-medium text-white">Approx. 440g per shoe (Size EU 42)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white/50">Quality Verification</td>
                  <td className="py-2.5 font-medium text-white">Quality-checked & verified in Bangladesh</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Care & Maintenance Accordion */}
      <div className="border border-white/10 bg-[#161616]">
        <button
          type="button"
          onClick={() => toggleTab('care')}
          className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-[#C7A55B] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#C7A55B]" />
            Care & Maintenance Instructions
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${openTab === 'care' ? 'rotate-90 text-[#C1121F]' : 'text-white/40'}`} />
        </button>

        {openTab === 'care' && (
          <div className="px-5 pb-5 pt-2 text-xs text-white/70 font-light leading-relaxed border-t border-white/5 space-y-2">
            <p>{product.careInstructions}</p>
            <ul className="list-disc list-inside space-y-1 pt-1 text-white/80">
              <li>Store in the provided dust bags to preserve shoe shape and finish.</li>
              <li>Clean sole rubber with a soft damp cloth and mild neutral cleanser.</li>
              <li>Avoid direct prolonged exposure to extreme moisture or heat sources.</li>
            </ul>
          </div>
        )}
      </div>

      {/* 4. Authenticity Certificate */}
      <div className="border border-white/10 bg-[#161616]">
        <button
          type="button"
          onClick={() => toggleTab('authenticity')}
          className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-[#C7A55B] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C7A55B]" />
            Authenticity & Quality Guarantee
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${openTab === 'authenticity' ? 'rotate-90 text-[#C1121F]' : 'text-white/40'}`} />
        </button>

        {openTab === 'authenticity' && (
          <div className="px-5 pb-5 pt-2 text-xs text-white/70 font-light leading-relaxed border-t border-white/5 space-y-2">
            <p className="text-[#C7A55B] font-bold">
              KINGSMAN Verified Authentic Import
            </p>
            <p>
              Each pair of KINGSMAN footwear is individually quality-checked by our fulfillment team before shipping. Backed by our 7-day hassle-free return and replacement policy.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
