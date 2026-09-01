import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, Search, X, Check, Clock, PackageCheck, MapPin, Box, CheckCircle2 } from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(searchQuery.trim())}&phone=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setSearchedOrders(Array.isArray(data) ? data : []);
    } catch {
      setSearchedOrders([]);
    } finally {
      setIsSearching(false);
    }
  };

  const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Pending', label: 'Order Placed', desc: 'Order logged into KINGSMAN dispatch queue.' },
    { status: 'Confirmed', label: 'Confirmed', desc: 'Payment verified & order confirmed.' },
    { status: 'Packaging', label: 'Packaging', desc: 'Atelier master craftsman inspecting & boxing footwear.' },
    { status: 'Ready for Pickup', label: 'Ready for Courier Pickup', desc: 'Handed to express logistics hub.' },
    { status: 'Shipped', label: 'Shipped', desc: 'In transit with courier to your destination.' },
    { status: 'Delivered', label: 'Delivered', desc: 'Successfully delivered to recipient.' }
  ];

  const getStepProgressIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Packaging': return 2;
      case 'Ready for Pickup': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return -1;
      case 'Returned': return -1;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#141414] border border-white/10 p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOrderTrackingOpen(false)}
          className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            <Truck className="w-4 h-4 text-[#C1121F]" />
            <span>KINGSMAN Royal Dispatch Portal</span>
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            TRACK YOUR SHIPMENT
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Enter your Order ID (e.g. KSM-2026-8942) or mobile number to track status live.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Enter Order ID or Phone number (e.g. 01712345678)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F]"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {/* Search Results Display */}
        {searchedOrders !== null && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            {searchedOrders.length === 0 ? (
              <div className="text-center py-8 bg-[#181818] border border-white/5 p-4">
                <p className="text-xs text-white/60">
                  No orders found for "<strong className="text-white">{searchQuery}</strong>". Please verify your Order ID or phone number.
                </p>
              </div>
            ) : (
              searchedOrders.map(order => {
                const currentIdx = getStepProgressIndex(order.orderStatus);

                return (
                  <div key={order.id} className="bg-[#181818] border border-white/10 p-6 space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                      <div>
                        <p className="text-sm font-serif-luxury font-bold text-[#C7A55B]">Order ID: {order.id}</p>
                        <p className="text-xs text-white/60">Recipient: {order.customerName} • {order.district || order.city}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="px-3 py-1 bg-[#C1121F] text-white text-[10px] uppercase font-bold tracking-widest">
                          {order.orderStatus}
                        </span>
                        <p className="text-[10px] font-mono text-white/50 mt-1">Tracking: {order.trackingNumber}</p>
                      </div>
                    </div>

                    {/* Timeline Step Progression */}
                    <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentIdx && currentIdx >= 0;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={step.status} className="flex items-start gap-4 relative z-10">
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isDone ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-lg' : 'bg-[#111111] border-white/20 text-white/30'
                            }`}>
                              {isDone ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>

                            <div className="pt-1">
                              <p className={`text-xs font-bold uppercase tracking-wider ${
                                isCurrent ? 'text-[#C7A55B]' : isDone ? 'text-white' : 'text-white/40'
                              }`}>
                                {step.label}
                              </p>
                              <p className="text-[11px] text-white/50 font-light mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
};
