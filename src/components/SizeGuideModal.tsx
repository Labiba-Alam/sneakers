import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Ruler, Crown } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();

  if (!isSizeGuideOpen) return null;

  const SIZING_MATRIX = [
    { eu: 39, us: 6.5, uk: 5.5, cm: 24.5 },
    { eu: 40, us: 7.5, uk: 6.5, cm: 25.0 },
    { eu: 41, us: 8.0, uk: 7.0, cm: 26.0 },
    { eu: 42, us: 9.0, uk: 8.0, cm: 26.5 },
    { eu: 43, us: 10.0, uk: 9.0, cm: 27.5 },
    { eu: 44, us: 11.0, uk: 10.0, cm: 28.0 },
    { eu: 45, us: 12.0, uk: 11.0, cm: 29.0 },
    { eu: 46, us: 13.0, uk: 12.0, cm: 30.0 }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#141414] border border-white/10 p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            <Ruler className="w-4 h-4" />
            <span>Royal Sizing Precision</span>
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            EU TO GLOBAL SIZING MATRIX
          </h2>
          <p className="text-xs text-white/60 mt-1 font-light">
            KINGSMAN footwear fits true to European standard sizes. If you sit between half sizes, we recommend sizing down for low-tops and sizing up for high-tops.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 uppercase tracking-widest font-semibold bg-white/5">
                <th className="py-3 px-4">EU Size</th>
                <th className="py-3 px-4">US Men</th>
                <th className="py-3 px-4">UK Size</th>
                <th className="py-3 px-4">Foot Length (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {SIZING_MATRIX.map(row => (
                <tr key={row.eu} className="hover:bg-white/5">
                  <td className="py-3 px-4 font-bold text-[#C7A55B]">EU {row.eu}</td>
                  <td className="py-3 px-4">{row.us}</td>
                  <td className="py-3 px-4">{row.uk}</td>
                  <td className="py-3 px-4">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-white/60">
          <strong className="text-white block mb-1">💡 Sizing Advice</strong>
          Need personalized advice? Contact our customer support team or leave your exact foot measurements in order notes during checkout.
        </div>
      </div>
    </div>
  );
};
