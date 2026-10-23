import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, Search, X, Check, Clock, PackageCheck, MapPin, Box, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, formatPrice } = useStore();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setTrackedOrder(null);
    setHasSearched(false);

    const trimmedOrderId = orderId.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedOrderId) {
      setSearchError('Order ID is required.');
      return;
    }

    if (!trimmedPhone) {
      setSearchError('Customer phone number is required.');
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/orders?orderId=${encodeURIComponent(trimmedOrderId)}&phone=${encodeURIComponent(trimmedPhone)}`
      );
      const data = await res.json().catch(() => ({}));

      setHasSearched(true);
      if (!res.ok) {
        setSearchError(data.error || 'Order not found. Please verify both your Order ID and phone number.');
        setTrackedOrder(null);
        return;
      }

      const orderResult: Order = Array.isArray(data) ? data[0] : data;
      if (orderResult && orderResult.id) {
        setTrackedOrder(orderResult);
      } else {
        setSearchError('Order not found. Please verify both your Order ID and phone number.');
      }
    } catch {
      setHasSearched(true);
      setSearchError('Unable to connect to order tracking service. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Pending', label: 'Order Placed', desc: 'Order logged into KINGSMAN dispatch queue.' },
    { status: 'Confirmed', label: 'Confirmed', desc: 'Order confirmed and scheduled for packaging.' },
    { status: 'Packaging', label: 'Packaging', desc: 'Atelier master craftsman inspecting & boxing footwear.' },
    { status: 'Ready for Pickup', label: 'Ready for Courier', desc: 'Handed to express logistics hub.' },
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
          onClick={() => {
            setIsOrderTrackingOpen(false);
            setSearchError('');
            setTrackedOrder(null);
            setHasSearched(false);
          }}
          className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Close Tracking Modal"
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
            For security, please enter both your <strong>Order ID</strong> and the <strong>phone number</strong> used during checkout.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                Order ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KNG-2026-8942"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                Contact Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Locate & Track Order</span>
              </>
            )}
          </button>
        </form>

        {/* Search Error Message */}
        {searchError && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Search Result Display */}
        {hasSearched && trackedOrder && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="bg-[#181818] border border-white/10 p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div>
                  <p className="text-sm font-serif-luxury font-bold text-[#C7A55B]">Order ID: {trackedOrder.id}</p>
                  <p className="text-xs text-white/60">
                    Recipient: {trackedOrder.customerName} • {trackedOrder.district || trackedOrder.city}
                  </p>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    Courier: {trackedOrder.courierPartner || 'Steadfast'} Express
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="px-3 py-1 bg-[#C1121F] text-white text-[10px] uppercase font-bold tracking-widest">
                    {trackedOrder.orderStatus}
                  </span>
                  <p className="text-[10px] font-mono text-white/50 mt-1">
                    Tracking: {trackedOrder.trackingNumber || 'TRK-ASSIGNED'}
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Ordered Footwear</p>
                <div className="space-y-2">
                  {trackedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs text-white/80 py-1 border-b border-white/5">
                      <span>{item.product.name} (EU {item.selectedSize}) × {item.quantity}</span>
                      <span className="font-mono text-white">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between text-xs text-[#C7A55B] font-bold">
                  <span>Grand Total:</span>
                  <span className="font-mono">৳{trackedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Timeline Step Progression */}
              <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepProgressIndex(trackedOrder.orderStatus);
                  const isDone = idx <= currentIdx && currentIdx >= 0;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.status} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                        isDone 
                          ? 'bg-[#C1121F] border-[#C1121F] text-white' 
                          : 'bg-[#111111] border-white/20 text-white/30'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="pt-1">
                        <p className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-[#C7A55B]' : isDone ? 'text-white' : 'text-white/40'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-white/50 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
