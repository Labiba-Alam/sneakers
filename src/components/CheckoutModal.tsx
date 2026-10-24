import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Crown, 
  Truck, 
  AlertCircle, 
  MapPin, 
  Banknote, 
  CheckCircle2, 
  Copy, 
  PhoneCall, 
  MessageCircle,
  HelpCircle,
  Check,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { optimizeImageUrl } from '../lib/imageUtils';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    subtotal, 
    discountAmount, 
    formatPrice, 
    placeOrder, 
    setView, 
    showToast,
    settings,
    calculateShippingFee
  } = useStore();

  // Guest Checkout Form State (Guest checkout only)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('Dhaka - Inside City');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Optional MFS payment details (order CAN be placed without them)
  const [mfsMethod, setMfsMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderMfsPhone, setSenderMfsPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Selected District & Delivery Fee Calculation
  const selectedDistrict = BANGLADESH_DISTRICTS.find(d => d.name === selectedDistrictName) || BANGLADESH_DISTRICTS[0];
  const isInsideDhaka = selectedDistrict.isDhaka;
  
  // Total parcel weight: sum(weightGrams * quantity)
  const totalWeightGrams = cart.reduce((sum, item) => {
    const w = (item.product?.weightGrams && item.product.weightGrams > 0) ? item.product.weightGrams : 1000;
    return sum + w * item.quantity;
  }, 0);

  // Dynamic delivery charge calculation
  const deliveryCharge = calculateShippingFee(selectedDistrict.name, cart);
  const codAmountToCollect = Math.max(0, subtotal - discountAmount);
  const grandTotal = codAmountToCollect + deliveryCharge;

  // Bangladeshi Mobile Number Validation (013-019XXXXXXXX or +8801XXXXXXXXX)
  const validateBDPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return bdRegex.test(cleaned);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${key} number: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictName(e.target.value);
  };

  const cleanWhatsAppNumber = (settings.whatsappNumber || '01581054939').replace(/^(\+?88)?0?/, '880');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setSubmitError('');

    // Required fields: Name, Phone, Full address, District
    if (!customerName.trim() || customerName.trim().length < 2) {
      showToast('Please enter your full recipient name.', 'error');
      return;
    }

    if (!validateBDPhone(customerPhone)) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      showToast('Invalid Bangladeshi phone number.', 'error');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      showToast('Please enter your complete delivery street address (at least 5 characters).', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      return;
    }

    if (senderMfsPhone.trim() && !validateBDPhone(senderMfsPhone)) {
      showToast('Please check your sender number: must be an 11-digit mobile number.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const orderPayload = {
        idempotencyKey,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        district: selectedDistrict.name,
        city: selectedDistrict.division || selectedDistrict.name,
        area: selectedDistrict.name,
        address: address.trim(),
        notes: notes.trim() || undefined,
        paymentMethod: 'COD' as const,
        paymentStatus: 'Due' as const,
        orderStatus: 'Awaiting Delivery Charge' as const,
        deliveryChargePaid: false,
        mfsMethod: mfsMethod,
        senderMfsPhone: senderMfsPhone.trim() || undefined,
        advanceDeliveryFeeTrxId: trxId.trim() || undefined,
        subtotal,
        discountAmount,
        shippingFee: deliveryCharge,
        total: grandTotal,
        codAmountToCollect,
        remainingAmountDue: codAmountToCollect,
        totalWeightGrams,
        courierName: 'Steadfast' as const,
        courierPartner: 'Steadfast' as const,
      };

      await placeOrder(orderPayload);
      triggerConfetti();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to place order. Please check your information and try again.');
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#0e0e0e] min-h-screen text-[#F8F8F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            onClick={() => setView('catalog')}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C7A55B] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Guest Checkout • Cash on Delivery</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Owner Payment Policy Callout Box */}
            <div className="bg-[#181818] border-2 border-[#C7A55B]/60 p-5 sm:p-6 rounded-lg shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#C7A55B] text-black text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                Advance Required
              </div>

              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
                    Delivery Charge Payment Instructions
                  </h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
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

              {/* MFS Quick Copy Numbers & WhatsApp Button */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/10 mt-3">
                
                {/* bKash Copy */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.bkashNumber || '01581054939', 'bKash')}
                  className="flex items-center justify-between px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#E2136E]/60 rounded text-left transition-all group"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#E2136E] font-bold block">bKash (Send-Money)</span>
                    <span className="font-mono text-xs text-white group-hover:text-white">{settings.bkashNumber || '01581054939'}</span>
                  </div>
                  {copiedKey === 'bKash' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/50 group-hover:text-white shrink-0" />
                  )}
                </button>

                {/* Nagad Copy */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.nagadNumber || '01581054939', 'Nagad')}
                  className="flex items-center justify-between px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#F7921E]/60 rounded text-left transition-all group"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#F7921E] font-bold block">Nagad (Send-Money)</span>
                    <span className="font-mono text-xs text-white group-hover:text-white">{settings.nagadNumber || '01581054939'}</span>
                  </div>
                  {copiedKey === 'Nagad' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/50 group-hover:text-white shrink-0" />
                  )}
                </button>

                {/* Rocket Copy */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.rocketNumber || '01581054939', 'Rocket')}
                  className="flex items-center justify-between px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#8C3494]/60 rounded text-left transition-all group"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#B845C2] font-bold block">Rocket (Send-Money)</span>
                    <span className="font-mono text-xs text-white group-hover:text-white">{settings.rocketNumber || '01581054939'}</span>
                  </div>
                  {copiedKey === 'Rocket' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/50 group-hover:text-white shrink-0" />
                  )}
                </button>

              </div>

              {/* Direct WhatsApp Confirmation Button */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-white/60">
                  Product price is paid in cash when parcel is delivered (COD).
                </span>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hi KINGSMAN, I want to confirm my delivery charge payment.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Guest Checkout Information Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              <div className="bg-[#141414] border border-white/10 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h2 className="font-serif-luxury text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C7A55B]" />
                    <span>Recipient Delivery Information</span>
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider text-white/50">No account required</span>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name (Required) */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/80 block mb-1">
                      Full Name <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asif Mahmud"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/15 focus:border-[#C7A55B] text-white text-xs rounded outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Number (Required) */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/80 block mb-1">
                      Phone Number <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setPhoneError('');
                      }}
                      className={`w-full px-3 py-2.5 bg-[#1a1a1a] border ${phoneError ? 'border-red-500' : 'border-white/15'} focus:border-[#C7A55B] text-white text-xs font-mono rounded outline-none transition-colors`}
                    />
                    {phoneError && <p className="text-[10px] text-red-400 mt-1">{phoneError}</p>}
                  </div>

                  {/* District Dropdown (Required) */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-white/80 block mb-1">
                      District & Delivery Zone <span className="text-[#C1121F]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDistrictName}
                        onChange={handleDistrictChange}
                        className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/15 focus:border-[#C7A55B] text-white text-xs rounded outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <optgroup label="Inside Dhaka (Delivery Charge: ৳ 100)">
                          {BANGLADESH_DISTRICTS.filter(d => d.isDhaka).map(d => (
                            <option key={d.name} value={d.name}>
                              {d.name} (Inside Dhaka — ৳ 100)
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Outside Dhaka (Delivery Charge: ৳ 160)">
                          {BANGLADESH_DISTRICTS.filter(d => !d.isDhaka).map(d => (
                            <option key={d.name} value={d.name}>
                              {d.name} (Outside Dhaka — ৳ 160)
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/50">
                        <Truck className="w-3.5 h-3.5 text-[#C7A55B]" />
                      </div>
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">
                      {isInsideDhaka 
                        ? 'Inside Dhaka delivery rate: ৳ 100 (1-3 working days)' 
                        : 'Outside Dhaka / District rate: ৳ 160 (2-5 working days via Steadfast / Pathao)'}
                    </p>
                  </div>

                  {/* Full Address (Required) */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-white/80 block mb-1">
                      Full Delivery Address <span className="text-[#C1121F]">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat #, Road #, Area / Thana, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/15 focus:border-[#C7A55B] text-white text-xs rounded outline-none transition-colors"
                    />
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                      Email Address <span className="text-white/40">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. asif@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/15 focus:border-[#C7A55B] text-white text-xs rounded outline-none transition-colors"
                    />
                  </div>

                  {/* Order Note (Optional) */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                      Order Note <span className="text-white/40">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leave with security, call before arrival"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/15 focus:border-[#C7A55B] text-white text-xs rounded outline-none transition-colors"
                    />
                  </div>

                </div>
              </div>

              {/* Optional Advance Delivery Charge Input Details */}
              <div className="bg-[#141414] border border-white/10 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h2 className="font-serif-luxury text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#C7A55B]" />
                    <span>Advance Delivery Charge Details</span>
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Optional at checkout
                  </span>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded text-xs text-white/70 space-y-1">
                  <p>
                    <strong className="text-white">Have you already sent the delivery charge of {formatPrice(deliveryCharge)}?</strong>
                  </p>
                  <p className="text-[11px] text-white/60">
                    You may provide your transaction details below now, or submit the order without them. If submitted without them, our concierge will verify and call or WhatsApp you before dispatch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Method Used */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                      Method Used
                    </label>
                    <select
                      value={mfsMethod}
                      onChange={(e) => setMfsMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/15 text-white text-xs rounded outline-none cursor-pointer"
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                    </select>
                  </div>

                  {/* Sender Number */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                      Sender Number
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={senderMfsPhone}
                      onChange={(e) => setSenderMfsPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/15 text-white text-xs font-mono rounded outline-none"
                    />
                  </div>

                  {/* Transaction ID (TrxID) */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                      Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BLX987654"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/15 text-white text-xs font-mono uppercase rounded outline-none"
                    />
                  </div>

                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a30f1a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Logging Order & Checking Stock...</span>
                ) : (
                  <>
                    <span>Confirm Order • Cash on Delivery</span>
                    <span className="text-white/60">|</span>
                    <span className="text-[#C7A55B]">Pay Delivery Charge ৳{deliveryCharge} Advance</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-[10px] text-white/50 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C7A55B]" />
                  <span>Authenticity Guaranteed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C7A55B]" />
                  <span>Steadfast & Pathao Courier</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-[#C7A55B]" />
                  <span>COD at Delivery</span>
                </span>
              </div>

            </form>

          </div>

          {/* Order Summary & Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#141414] border border-white/10 p-6 rounded-lg space-y-6 shadow-xl sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
                  Order Summary
                </h3>
                <span className="text-xs text-[#C7A55B] font-mono font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              </div>

              {/* Cart Items Mini List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-white/5">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={optimizeImageUrl(item.product?.images?.[0] || '', 120, 60)}
                      alt={item.product?.name || 'Product'}
                      className="w-12 h-12 bg-black object-contain border border-white/10 rounded shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product?.name}</h4>
                      <p className="text-[10px] text-white/50">
                        Size: {item.selectedSize} • Color: {item.selectedColor?.name || 'Standard'} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#C7A55B] font-mono shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exact Breakdown Requested by Owner */}
              <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                
                {/* Products Total */}
                <div className="flex justify-between text-white/80">
                  <span>Products Total</span>
                  <span className="font-mono font-semibold text-white">{formatPrice(subtotal)}</span>
                </div>

                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C7A55B]">
                    <span>Discount</span>
                    <span className="font-mono font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Parcel Weight */}
                <div className="flex justify-between text-white/60 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Parcel Total Weight</span>
                  </span>
                  <span className="font-mono">{(totalWeightGrams / 1000).toFixed(2)} kg</span>
                </div>

                {/* Delivery Charge (Auto calculated) */}
                <div className="flex justify-between text-white/80">
                  <span className="flex items-center gap-1.5">
                    <span>Delivery Charge ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  </span>
                  <span className="font-mono font-semibold text-white">{formatPrice(deliveryCharge)}</span>
                </div>

                {/* Clear Split Boxes */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  
                  {/* Advance: Delivery Charge */}
                  <div className="p-3 bg-[#C7A55B]/10 border border-[#C7A55B]/40 rounded flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C7A55B] font-bold block">
                        Pay now (advance)
                      </span>
                      <span className="text-[11px] text-white/70">Delivery charge via bKash/Nagad/Rocket</span>
                    </div>
                    <span className="font-mono text-base font-bold text-[#C7A55B]">
                      {formatPrice(deliveryCharge)}
                    </span>
                  </div>

                  {/* COD: Products total minus discount */}
                  <div className="p-3 bg-white/5 border border-white/15 rounded flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                        Pay on delivery (COD)
                      </span>
                      <span className="text-[11px] text-white/70">Products total upon parcel handover</span>
                    </div>
                    <span className="font-mono text-base font-bold text-white">
                      {formatPrice(codAmountToCollect)}
                    </span>
                  </div>

                </div>

                {/* Grand Total */}
                <div className="pt-2 flex justify-between items-center text-sm font-bold text-white">
                  <span>Grand Total</span>
                  <span className="font-mono text-lg text-[#C7A55B]">{formatPrice(grandTotal)}</span>
                </div>

              </div>

              {/* Courier Partner Info */}
              <div className="p-3 bg-[#111111] border border-white/10 rounded space-y-1.5 text-[11px] text-white/60">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Truck className="w-3.5 h-3.5 text-[#C7A55B]" />
                  <span>Official Delivery Partner</span>
                </div>
                <p>
                  Dispatched via <strong className="text-white">Steadfast Express</strong> or <strong className="text-white">Pathao Courier</strong>. The parcel is delivered to your doorstep with tracking code provided upon dispatch.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
