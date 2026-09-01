import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Printer, Truck, ArrowRight, Crown, ShieldCheck, Copy, Lock, UserCheck, Sparkles } from 'lucide-react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const OrderConfirmationModal: React.FC = () => {
  const { activeOrder, formatPrice, setView, showToast, setIsOrderTrackingOpen } = useStore();
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  // Optional Post-Purchase VIP Account Creation
  const [accountPassword, setAccountPassword] = useState('');
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [isRegisteringAccount, setIsRegisteringAccount] = useState(false);

  if (!activeOrder) {
    return (
      <div className="py-24 text-center text-white">
        <p className="font-serif-luxury text-xl mb-4">No active order found.</p>
        <button onClick={() => setView('catalog')} className="px-6 py-3 bg-[#C1121F] text-xs uppercase font-bold tracking-wider">
          Return to Footwear Archive
        </button>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(activeOrder.id);
    showToast(`Order ID ${activeOrder.id} copied to clipboard!`);
  };

  const handleCreateVipAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setIsRegisteringAccount(true);
    setTimeout(() => {
      setIsRegisteringAccount(false);
      setIsAccountCreated(true);
      showToast(`VIP Account created for ${activeOrder.customerName}! 500 Royal Reward points added.`, 'success');
    }, 1000);
  };

  return (
    <section className="py-12 bg-[#111111] min-h-screen text-[#F8F8F8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Card */}
        <div className="bg-[#161616] border border-[#C7A55B]/40 p-8 text-center space-y-4 shadow-2xl relative overflow-hidden mb-8">
          <div className="w-16 h-16 rounded-full bg-[#C1121F]/20 text-[#C1121F] flex items-center justify-center mx-auto border border-[#C1121F] shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7A55B]/10 border border-[#C7A55B]/30 text-[#C7A55B] text-[10px] uppercase font-bold tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>Royal Order Logged & Synced</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white tracking-wide">
            THANK YOU, {activeOrder.customerName.toUpperCase()}
          </h1>

          <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto font-light">
            Your order has been received and added to our fulfillment queue. A notification summary has been generated for your record.
          </p>

          <div className="inline-flex items-center gap-3 bg-[#111111] px-5 py-2.5 border border-white/10 mt-2">
            <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Order ID:</span>
            <span className="text-sm font-serif-luxury font-bold text-[#C7A55B]">{activeOrder.id}</span>
            <button onClick={handleCopyOrderId} className="p-1 text-white/60 hover:text-white transition-colors" title="Copy Order ID">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Customer & Shipping Summary */}
          <div className="bg-[#161616] border border-white/10 p-6 space-y-4 shadow-xl">
            <h3 className="font-serif-luxury text-lg font-bold text-white pb-3 border-b border-white/10 flex justify-between items-center">
              <span>Delivery Details</span>
              <Truck className="w-4 h-4 text-[#C7A55B]" />
            </h3>
            <div className="space-y-2 text-xs text-white/70 font-light">
              <p><strong className="text-white font-medium">Recipient:</strong> {activeOrder.customerName}</p>
              <p><strong className="text-white font-medium">Mobile:</strong> {activeOrder.customerPhone}</p>
              {activeOrder.customerEmail && <p><strong className="text-white font-medium">Email:</strong> {activeOrder.customerEmail}</p>}
              <p><strong className="text-white font-medium">District:</strong> {activeOrder.district || activeOrder.city}</p>
              <p><strong className="text-white font-medium">Address:</strong> {activeOrder.address}, {activeOrder.area}</p>
              <p><strong className="text-white font-medium">Payment Method:</strong> {activeOrder.paymentMethod} (<span className={activeOrder.paymentStatus === 'Paid' ? 'text-emerald-400 font-semibold' : activeOrder.paymentStatus === 'Due' ? 'text-amber-400 font-semibold' : 'text-white/80'}>{activeOrder.paymentStatus === 'Due' ? 'Due on Delivery' : activeOrder.paymentStatus}</span>)</p>
              <p><strong className="text-white font-medium">Tracking #:</strong> <span className="font-mono text-[#C7A55B]">{activeOrder.trackingNumber}</span></p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-[#161616] border border-white/10 p-6 space-y-4 shadow-xl">
            <h3 className="font-serif-luxury text-lg font-bold text-white pb-3 border-b border-white/10">
              Payment Breakdown
            </h3>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Subtotal ({activeOrder.items.length} items)</span>
                <span className="font-semibold text-white">{formatPrice(activeOrder.subtotal)}</span>
              </div>
              {activeOrder.discountAmount > 0 && (
                <div className="flex justify-between text-[#C7A55B]">
                  <span>Promo Savings</span>
                  <span className="font-semibold">-{formatPrice(activeOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Charge</span>
                <span className="font-semibold text-emerald-400">
                  {activeOrder.shippingFee === 0 ? 'Complimentary' : formatPrice(activeOrder.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                <span>{activeOrder.paymentStatus === 'Due' ? 'Grand Total (Due on Delivery)' : 'Grand Total Paid'}</span>
                <span className="text-[#C7A55B] text-xl">{formatPrice(activeOrder.total)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Purchased List */}
        <div className="bg-[#161616] border border-white/10 p-6 mb-8 space-y-4 shadow-xl">
          <h3 className="font-serif-luxury text-lg font-bold text-white pb-3 border-b border-white/10">
            Purchased Silhouettes
          </h3>
          <div className="space-y-4 divide-y divide-white/5">
            {activeOrder.items.map(item => (
              <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={optimizeImageUrl(item.product.images[0], 200, 75)}
                    alt={`${item.product.name} in ${item.selectedColor.name} (EU ${item.selectedSize}) - Confirmed Royal Purchase`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 bg-[#111111] object-contain border border-white/10"
                  />
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-white">{item.product.name}</h4>
                    <p className="text-[11px] text-white/50">
                      Size: EU {item.selectedSize} • Color: {item.selectedColor.name} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#C7A55B]">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Purchase VIP Account Creation Card */}
        <div className="bg-gradient-to-r from-[#1B1B1B] to-[#141414] border border-[#C7A55B]/30 p-6 mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2 text-[#C7A55B] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#C7A55B]" />
                <span>Save Your Information for Future Drops</span>
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-white">Create a KINGSMAN VIP Account</h4>
              <p className="text-xs text-white/60 font-light">
                Unlock 500 Royal Reward points, express 1-click checkout, and priority access to limited edition drops.
              </p>
            </div>

            {isAccountCreated ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 px-4 py-3">
                <UserCheck className="w-4 h-4" />
                <span>VIP Account Active! (500 pts)</span>
              </div>
            ) : (
              <form onSubmit={handleCreateVipAccount} className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  required
                  placeholder="Set account password"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  className="px-3 py-2 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C7A55B] min-w-[200px]"
                />
                <button
                  type="submit"
                  disabled={isRegisteringAccount}
                  className="px-4 py-2 bg-[#C7A55B] hover:bg-[#b0904b] text-[#111111] text-xs uppercase font-bold tracking-wider shrink-0 transition-all shadow-md"
                >
                  {isRegisteringAccount ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsOrderTrackingOpen(true)}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <Truck className="w-4 h-4 text-[#C7A55B]" />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={() => setShowPrintInvoice(true)}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Download Official Invoice</span>
          </button>

          <button
            onClick={() => setView('catalog')}
            className="px-8 py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Printable Invoice Modal */}
      {showPrintInvoice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-black p-8 shadow-2xl space-y-6 rounded-none my-8">
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h2 className="font-royal text-2xl font-black text-[#111111] tracking-widest">KINGSMAN</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Curated Luxury Sneakers • Bangladesh</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-[#C1121F]">OFFICIAL INVOICE</p>
                <p className="text-xs text-gray-600">ID: {activeOrder.id}</p>
                <p className="text-xs text-gray-600">Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs text-gray-700">
              <div>
                <p className="font-bold text-black uppercase mb-1">Billed & Shipped To:</p>
                <p>{activeOrder.customerName}</p>
                <p>{activeOrder.address}, {activeOrder.area}</p>
                <p>{activeOrder.district || activeOrder.city}</p>
                <p>Phone: {activeOrder.customerPhone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-black uppercase mb-1">Payment Method:</p>
                <p>{activeOrder.paymentMethod}</p>
                <p>Status: <span className="font-bold text-emerald-600">{activeOrder.paymentStatus}</span></p>
                <p>Tracking #: {activeOrder.trackingNumber}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-black uppercase">
                  <th className="py-2">Item</th>
                  <th className="py-2">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {activeOrder.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-2.5 font-semibold">{item.product.name}</td>
                    <td className="py-2.5">EU {item.selectedSize}</td>
                    <td className="py-2.5 text-center">{item.quantity}</td>
                    <td className="py-2.5 text-right">${item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-black pt-4 text-xs flex justify-between items-center font-bold">
              <span>Grand Total Paid:</span>
              <span className="text-lg text-[#C1121F]">${activeOrder.total}</span>
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
                <span>Print PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
