import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, X, Trash2, Check, ShoppingBag, Star, Crown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { optimizeImageUrl } from '../../lib/imageUtils';

export const ShopCompareDrawer: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, products, formatPrice, addToCart } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareList.length === 0) return null;

  const comparedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <>
      {/* Floating Bottom Compare Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#161616]/95 border border-[#C7A55B]/40 text-white p-3 sm:px-6 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 w-[95%] max-w-2xl"
      >
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C7A55B] shrink-0">
            <Layers className="w-4 h-4 text-[#C7A55B]" />
            <span className="hidden sm:inline">Compare ({compareList.length}/4)</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.map(p => (
              <div key={p.id} className="relative group shrink-0">
                <img
                  src={optimizeImageUrl(p.images[0], 120, 70)}
                  alt={`${p.name} - Compare Silhouette Thumbnail`}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 object-contain bg-[#222] border border-white/20 p-1"
                />
                <button
                  onClick={() => toggleCompare(p.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C1121F] text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#C7A55B] hover:bg-[#b59449] text-black text-xs font-black uppercase tracking-wider transition-colors"
          >
            Compare Now
          </button>

          <button
            onClick={clearCompare}
            className="p-2 text-white/50 hover:text-white"
            title="Clear comparison"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Comparison Modal Table */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-5xl bg-[#121212] border border-[#C7A55B]/50 text-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#C7A55B]" />
                  <h3 className="font-serif-luxury text-xl font-bold text-white uppercase tracking-wider">
                    Silhouette Specification Matrix
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Specification Table */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 font-mono text-[#C7A55B] uppercase tracking-widest w-1/5">Attribute</th>
                      {comparedProducts.map(p => (
                        <th key={p.id} className="p-3 text-center min-w-[180px]">
                          <img
                            src={optimizeImageUrl(p.images[0], 300, 75)}
                            alt={`${p.name} - Matrix Compare Header`}
                            loading="lazy"
                            decoding="async"
                            className="w-24 h-24 object-contain mx-auto mb-2 bg-[#1A1A1A] p-2 border border-white/10"
                          />
                          <p className="font-serif-luxury text-sm font-bold text-white line-clamp-1">{p.name}</p>
                          <p className="font-mono text-xs font-bold text-[#C7A55B] mt-0.5">{formatPrice(p.price)}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light">
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Category</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center font-bold text-white">{p.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Rating</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center text-[#C7A55B] font-bold">
                          ★ {p.rating} ({p.reviewCount})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Materials</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center text-white/80">{p.materials}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Available EU Sizes</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center text-white/80">{p.sizes.join(', ')}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Stock Status</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center">
                          <span className={p.stock > 0 ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
                            {p.stock > 0 ? `In Stock (${p.stock})` : 'Sold Out'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Special Edition</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center text-[#C7A55B]">
                          {p.isLimitedEdition ? '24K Gold Minted Edition' : 'Standard Royal Batch'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white/70 uppercase tracking-wider">Action</td>
                      {comparedProducts.map(p => (
                        <td key={p.id} className="p-3 text-center">
                          <button
                            onClick={() => {
                              addToCart(p, p.sizes[0] || 42, p.colors[0] || { name: 'Royal Black', hex: '#111111' }, 1);
                              setIsModalOpen(false);
                            }}
                            className="w-full py-2 bg-[#C1121F] hover:bg-[#a30f1a] text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add Bag</span>
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
