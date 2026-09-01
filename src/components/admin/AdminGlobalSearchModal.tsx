import React, { useState } from 'react';
import { Search, ShoppingBag, Package, Users, Ticket, ArrowRight } from 'lucide-react';
import { Order, Product, CustomerAccount, Coupon } from '../../types';
import { AdminTab } from './AdminSidebar';

interface AdminGlobalSearchModalProps {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  onClose: () => void;
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminGlobalSearchModal: React.FC<AdminGlobalSearchModalProps> = ({
  orders,
  products,
  coupons,
  onClose,
  onNavigateTab,
  onSelectOrder
}) => {
  const [query, setQuery] = useState('');

  const matchedOrders = query.trim() ? orders.filter(o => 
    o.id.toLowerCase().includes(query.toLowerCase()) || 
    o.customerName.toLowerCase().includes(query.toLowerCase()) ||
    o.customerPhone.includes(query)
  ) : [];

  const matchedProducts = query.trim() ? products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const matchedCoupons = query.trim() ? coupons.filter(c =>
    c.code.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-[#141414] border border-[#C7A55B]/50 rounded-lg shadow-2xl p-5 text-white space-y-4 max-h-[80vh] flex flex-col">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#C7A55B] absolute left-3.5 top-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Global search across orders, products, coupons & SKU codes..."
            className="w-full pl-11 pr-10 py-3 bg-[#181818] border border-white/20 text-white text-sm rounded-md focus:outline-none focus:border-[#C7A55B]"
          />
          <button onClick={onClose} className="absolute right-3 top-3 text-white/50 hover:text-white">✕</button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
          {!query.trim() ? (
            <div className="text-center py-12 text-white/40 text-xs">
              Type anything to search across live Atelier database modules...
            </div>
          ) : (
            <>
              {/* Matched Orders */}
              {matchedOrders.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#C7A55B]">Matched Orders ({matchedOrders.length})</p>
                  {matchedOrders.map(o => (
                    <div
                      key={o.id}
                      onClick={() => {
                        onNavigateTab('orders');
                        onSelectOrder(o);
                        onClose();
                      }}
                      className="p-3 bg-[#181818] hover:bg-[#222] rounded border border-white/10 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold font-mono text-white">{o.id} - {o.customerName}</p>
                          <p className="text-[10px] text-white/50">{o.customerPhone} • ${o.total}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#C1121F] text-white font-bold rounded">{o.orderStatus}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Products */}
              {matchedProducts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#C7A55B]">Matched Silhouettes ({matchedProducts.length})</p>
                  {matchedProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onNavigateTab('products');
                        onClose();
                      }}
                      className="p-3 bg-[#181818] hover:bg-[#222] rounded border border-white/10 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-xs font-bold text-white">{p.name}</p>
                          <p className="text-[10px] text-white/50">SKU: {p.sku} • Category: {p.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#C7A55B]">${p.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Coupons */}
              {matchedCoupons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#C7A55B]">Matched Promos ({matchedCoupons.length})</p>
                  {matchedCoupons.map(c => (
                    <div
                      key={c.code}
                      onClick={() => {
                        onNavigateTab('coupons');
                        onClose();
                      }}
                      className="p-3 bg-[#181818] hover:bg-[#222] rounded border border-white/10 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="text-xs font-mono font-bold text-white">{c.code}</p>
                          <p className="text-[10px] text-white/50">{c.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedOrders.length === 0 && matchedProducts.length === 0 && matchedCoupons.length === 0 && (
                <p className="text-xs text-center py-8 text-white/50">No results found for "{query}".</p>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
