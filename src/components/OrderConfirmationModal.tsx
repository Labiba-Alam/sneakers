import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Printer, 
  Truck, 
  ArrowRight, 
  Crown, 
  ShieldCheck, 
  Copy, 
  Check, 
  MessageCircle, 
  PhoneCall, 
  AlertCircle,
  Banknote,
  MapPin
} from 'lucide-react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const OrderConfirmationModal: React.FC = () => {
  const { activeOrder, formatPrice, setView, showToast, setIsOrderTrackingOpen, settings } = useStore();
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!activeOrder) {
    return (
      <div className="py-24 text-center text-white bg-[#0e0e0e] min-h-screen">
        <p className="font-serif-luxury text-xl mb-4">No active order found.</p>
        <button onClick={() => setView('catalog')} className="px-6 py-3 bg-[#C1121F] text-xs uppercase font-bold tracking-wider rounded">
          Return to Footwear Archive
        </button>
      </div>
    );
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${key}: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const cleanWhatsAppNumber = (settings.whatsappNumber || '01581054939').replace(/^(\+?88)?0?/, '880');
  const codAmount = activeOrder.codAmountToCollect ?? (activeOrder.remainingAmountDue ?? Math.max(0, activeOrder.subtotal - activeOrder.discountAmount));
  const advanceFee = activeOrder.shippingFee || 100;

  return (
    <section className="py-8 sm:py-12 bg-[#0e0e0e] min-h-screen text-[#F8F8F8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Header Card */}
        <div className="bg-[#141414] border border-[#C7A55B]/40 p-6 sm:p-8 text-center space-y-4 shadow-2xl rounded-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7A55B]/10 border border-[#C7A55B]/30 text-[#C7A55B] text-[10px] uppercase font-bold tracking-widest rounded">
            <Crown className="w-3.5 h-3.5" />
            <span>Order #{activeOrder.id} Placed</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white tracking-wide">
            THANK YOU, {activeOrder.customerName.toUpperCase()}
          </h1>

          <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
            Your order has been recorded. To confirm dispatch, please send the delivery charge in advance as outlined below.
          </p>

          <div className="inline-flex items-center gap-3 bg-black/60 px-5 py-2.5 border border-white/10 rounded">
            <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Order ID:</span>
            <span className="text-sm font-serif-luxury font-bold text-[#C7A55B]">{activeOrder.id}</span>
            <button
              onClick={() => copyToClipboard(activeOrder.id, 'Order ID')}
              className="p-1 text-white/60 hover:text-white transition-colors"
              title="Copy Order ID"
            >
              {copiedKey === 'Order ID' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* OWNER INSTRUCTIONS HIGHLIGHTED BOX */}
        <div className="bg-[#181818] border-2 border-[#C7A55B] p-6 rounded-lg shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#C7A55B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
                Please Send Delivery Charge to Confirm Your Order
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Please send the delivery charge in advance to bKash / Nagad / Rocket:{' '}
                <span className="font-mono font-bold text-[#C7A55B] text-sm bg-black/40 px-1.5 py-0.5 rounded">
                  {settings.bkashNumber || '01581054939'}
                </span>
                . Your order is confirmed after the delivery charge is received. For quick confirmation call or WhatsApp{' '}
                <span className="font-mono font-bold text-[#C7A55B] text-sm bg-black/40 px-1.5 py-0.5 rounded">
                  {settings.whatsappNumber || '01581054939'}
                </span>
                .
              </p>
            </div>
          </div>

          {/* Advance Due vs COD Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-[#C7A55B]/10 border border-[#C7A55B]/40 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C7A55B] block">Advance Delivery Fee Due</span>
                <span className="text-xs text-white/70">Pay via bKash, Nagad, or Rocket</span>
              </div>
              <span className="font-mono text-xl font-bold text-[#C7A55B]">{formatPrice(advanceFee)}</span>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Cash on Delivery (COD)</span>
                <span className="text-xs text-white/70">Pay only when parcel arrives</span>
              </div>
              <span className="font-mono text-xl font-bold text-white">{formatPrice(codAmount)}</span>
            </div>
          </div>

          {/* Quick Copy Number Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            
            <button
              type="button"
              onClick={() => copyToClipboard(settings.bkashNumber || '01581054939', 'bKash')}
              className="flex items-center justify-between px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#E2136E]/60 rounded text-left transition-all"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#E2136E] font-bold block">bKash (Send-Money)</span>
                <span className="font-mono text-xs text-white">{settings.bkashNumber || '01581054939'}</span>
              </div>
              {copiedKey === 'bKash' ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-white/50 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(settings.nagadNumber || '01581054939', 'Nagad')}
              className="flex items-center justify-between px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#F7921E]/60 rounded text-left transition-all"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#F7921E] font-bold block">Nagad (Send-Money)</span>
                <span className="font-mono text-xs text-white">{settings.nagadNumber || '01581054939'}</span>
              </div>
              {copiedKey === 'Nagad' ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-white/50 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(settings.rocketNumber || '01581054939', 'Rocket')}
              className="flex items-center justify-between px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#8C3494]/60 rounded text-left transition-all"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B845C2] font-bold block">Rocket (Send-Money)</span>
                <span className="font-mono text-xs text-white">{settings.rocketNumber || '01581054939'}</span>
              </div>
              {copiedKey === 'Rocket' ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-white/50 shrink-0" />}
            </button>

          </div>

          {/* Quick Confirmation WhatsApp Button */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-white/70">
              Send money from your MFS app, then send a message or screenshot for instant confirmation:
            </span>
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(`Hi KINGSMAN, I placed order #${activeOrder.id}. Here is my delivery charge payment confirmation.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>WhatsApp Payment Slip</span>
            </a>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recipient & Courier Summary */}
          <div className="bg-[#141414] border border-white/10 p-6 space-y-3 rounded-lg shadow-xl text-xs">
            <h3 className="font-serif-luxury text-base font-bold text-white pb-2 border-b border-white/10 flex justify-between items-center">
              <span>Delivery Details</span>
              <Truck className="w-4 h-4 text-[#C7A55B]" />
            </h3>
            <div className="space-y-1.5 text-white/70">
              <p><strong className="text-white">Recipient:</strong> {activeOrder.customerName}</p>
              <p><strong className="text-white">Mobile:</strong> {activeOrder.customerPhone}</p>
              {activeOrder.customerEmail && <p><strong className="text-white">Email:</strong> {activeOrder.customerEmail}</p>}
              <p><strong className="text-white">District:</strong> {activeOrder.district}</p>
              <p><strong className="text-white">Address:</strong> {activeOrder.address}</p>
              <p><strong className="text-white">Courier:</strong> {activeOrder.courierName || 'Steadfast'} Express</p>
              <p><strong className="text-white">Tracking Number:</strong> <span className="font-mono text-[#C7A55B]">{activeOrder.trackingNumber}</span></p>
              <p><strong className="text-white">Status:</strong> <span className="font-semibold text-amber-400">{activeOrder.orderStatus}</span></p>
            </div>
          </div>

          {/* Payment & Amount Breakdown */}
          <div className="bg-[#141414] border border-white/10 p-6 space-y-3 rounded-lg shadow-xl text-xs">
            <h3 className="font-serif-luxury text-base font-bold text-white pb-2 border-b border-white/10 flex justify-between items-center">
              <span>Payment Summary</span>
              <Banknote className="w-4 h-4 text-[#C7A55B]" />
            </h3>
            <div className="space-y-2 text-white/70">
              <div className="flex justify-between">
                <span>Products Subtotal</span>
                <span className="font-mono font-semibold text-white">{formatPrice(activeOrder.subtotal)}</span>
              </div>
              {activeOrder.discountAmount > 0 && (
                <div className="flex justify-between text-[#C7A55B]">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">-{formatPrice(activeOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge ({activeOrder.district})</span>
                <span className="font-mono font-semibold text-white">{formatPrice(advanceFee)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white">
                <span>Advance Delivery Charge:</span>
                <span className="font-mono text-[#C7A55B]">{formatPrice(advanceFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Cash on Delivery (Parcel Handover):</span>
                <span className="font-mono text-emerald-400">{formatPrice(codAmount)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Order Items */}
        <div className="bg-[#141414] border border-white/10 p-6 space-y-4 rounded-lg shadow-xl">
          <h3 className="font-serif-luxury text-base font-bold text-white pb-3 border-b border-white/10">
            Ordered Silhouettes & Apparel
          </h3>
          <div className="divide-y divide-white/5">
            {activeOrder.items.map(item => (
              <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={optimizeImageUrl(item.product?.images?.[0] || '', 120, 60)}
                    alt={item.product?.name || 'Product'}
                    className="w-14 h-14 bg-black object-contain border border-white/10 rounded"
                  />
                  <div>
                    <h4 className="font-serif-luxury text-xs font-bold text-white">{item.product?.name}</h4>
                    <p className="text-[10px] text-white/50">
                      Size: {item.selectedSize} • Color: {item.selectedColor?.name || 'Standard'} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#C7A55B]">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons including Track Order Link */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          
          {/* Track Order Button */}
          <button
            onClick={() => setIsOrderTrackingOpen(true)}
            className="px-6 py-3.5 bg-[#C7A55B] hover:bg-[#b0904b] text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded transition-all shadow-lg"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </button>

          {/* Printable Invoice Slip Button */}
          <button
            onClick={() => setShowPrintInvoice(true)}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice / Slip</span>
          </button>

          {/* Continue Shopping */}
          <button
            onClick={() => setView('catalog')}
            className="px-6 py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded transition-all shadow"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Printable Invoice Slip Modal */}
      {showPrintInvoice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-black p-8 shadow-2xl rounded-none my-8 space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="font-royal text-2xl font-black text-[#111111] tracking-widest">KINGSMAN</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Luxury Footwear & Apparel Atelier • Bangladesh</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-base text-[#C1121F]">ORDER PARCEL SLIP</p>
                <p className="text-gray-600">ID: {activeOrder.id}</p>
                <p className="text-gray-600">Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <p className="font-bold text-black uppercase mb-1">Customer / Consignee:</p>
                <p>{activeOrder.customerName}</p>
                <p>{activeOrder.customerPhone}</p>
                <p>{activeOrder.address}</p>
                <p>{activeOrder.district}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-black uppercase mb-1">Courier & COD:</p>
                <p>Courier: {activeOrder.courierName || 'Steadfast'} Express</p>
                <p>Tracking #: {activeOrder.trackingNumber}</p>
                <p className="text-sm font-bold text-black mt-1">COD to Collect: ৳ {codAmount}</p>
                <p className="text-gray-500">Advance Delivery Fee: ৳ {advanceFee}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black uppercase text-[11px]">
                  <th className="py-2">Item</th>
                  <th className="py-2">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeOrder.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-2 font-semibold">{item.product?.name}</td>
                    <td className="py-2">{item.selectedSize}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">৳ {item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-black pt-3 flex justify-between items-center text-xs font-bold">
              <span>COD Amount to Collect from Customer:</span>
              <span className="text-lg text-[#C1121F]">৳ {codAmount}</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowPrintInvoice(false)}
                className="px-4 py-2 border border-gray-400 text-xs font-bold uppercase"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
