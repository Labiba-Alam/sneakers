import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { ShieldCheck, Lock, CreditCard, ArrowLeft, Crown, Truck, AlertCircle, MapPin, Banknote, Sparkles, CheckCircle2, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { optimizeImageUrl } from '../lib/imageUtils';

export const CheckoutModal: React.FC = () => {
  const { cart, subtotal, discountAmount, formatPrice, placeOrder, setView, currency, showToast } = useStore();

  // Guest Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('Dhaka - Inside City');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Payment Mode
  // 'COD' = Cash on Delivery with advance delivery fee
  // 'SSLCommerz/Card' = 100% full online prepayment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  
  // Advance Delivery Fee Verification for COD
  const [advanceMethod, setAdvanceMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderMfsPhone, setSenderMfsPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<'Steadfast' | 'Pathao'>('Steadfast');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Selected District & Delivery Fee Calculation (BDT)
  // Confirmed: Inside Dhaka = ৳ 100, Outside Dhaka = ৳ 160
  const selectedDistrict = BANGLADESH_DISTRICTS.find(d => d.name === selectedDistrictName) || BANGLADESH_DISTRICTS[0];
  const isInsideDhaka = selectedDistrict.isDhaka;
  const deliveryCharge = isInsideDhaka ? 100 : 160;
  
  // Confirmed rule: Delivery charges must be paid in advance for both areas.
  const actualDeliveryCharge = deliveryCharge;
  const grandTotal = Math.max(0, subtotal - discountAmount + actualDeliveryCharge);
  const remainingDueOnDelivery = paymentMethod === 'COD' ? Math.max(0, subtotal - discountAmount) : 0;
  const payableNow = paymentMethod === 'COD' ? actualDeliveryCharge : grandTotal;

  // Bangladeshi Mobile Number Validation (01XXXXXXXXX or +8801XXXXXXXXX)
  const validateBDPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return bdRegex.test(cleaned);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrictName(districtName);
    const dist = BANGLADESH_DISTRICTS.find(d => d.name === districtName);
    if (dist) {
      setCity(dist.division || dist.name);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setSubmitError('');

    // Field Validations
    if (!customerName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    if (!validateBDPhone(customerPhone)) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi number (e.g. 017XXXXXXXX).');
      showToast('Invalid Bangladeshi phone number.', 'error');
      return;
    }

    if (!city.trim()) {
      showToast('Please enter your City / Division.', 'error');
      return;
    }

    if (!area.trim()) {
      showToast('Please enter your Area / Thana / Upazila.', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please enter your complete delivery street address.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      return;
    }

    // If COD, validate TrxID for advance delivery fee
    if (paymentMethod === 'COD') {
      if (!trxId.trim()) {
        showToast('Please enter the Transaction ID (TrxID) for the advance delivery fee.', 'error');
        return;
      }
      if (senderMfsPhone.trim() && !validateBDPhone(senderMfsPhone)) {
        showToast('Please enter a valid 11-digit sender phone number.', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Generate client-side idempotency key
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const orderPayload = {
        idempotencyKey,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        district: selectedDistrict.name,
        city: city.trim() || selectedDistrict.division,
        area: area.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        items: cart,
        subtotal,
        discountAmount,
        shippingFee: actualDeliveryCharge,
        total: grandTotal,
        currency: 'BDT' as const,
        advanceDeliveryFeePaid: paymentMethod === 'COD' ? true : false,
        advanceDeliveryFeeTrxId: paymentMethod === 'COD' ? trxId.trim() : undefined,
        advanceDeliveryFeeMethod: paymentMethod === 'COD' ? advanceMethod : 'Online Gateway',
        remainingAmountDue: remainingDueOnDelivery,
        courierPartner: selectedCourier,
      };

      if (paymentMethod === 'SSLCommerz/Card') {
        // Online Payment via SSLCommerz Gateway
        showToast('Connecting to SSLCommerz secure gateway...', 'info');

        const res = await fetch('/api/payment/sslcommerz/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const data = await res.json();

        if (data.success && data.gatewayUrl) {
          window.location.href = data.gatewayUrl;
          return;
        } else {
          throw new Error(data.error || 'Could not connect to payment gateway.');
        }
      } else {
        // Cash on Delivery with Verified Advance Delivery Fee
        await placeOrder({
          ...orderPayload,
          paymentMethod: 'COD',
          paymentStatus: 'Delivery Fee Paid',
          orderStatus: 'Confirmed',
          paymentDetails: {
            transactionId: trxId.trim(),
            mfsPhone: senderMfsPhone.trim() || customerPhone.trim(),
          },
        });

        triggerConfetti();
        showToast(`Order confirmed! Advance delivery fee (৳${actualDeliveryCharge}) logged.`, 'success');
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      setSubmitError(err.message || 'An error occurred while submitting your order. Please try again.');
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-[#111111] min-h-screen text-[#F8F8F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
          <button
            onClick={() => setView('cart')}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-[#C7A55B]">
            <Crown className="w-4 h-4" />
            <span className="font-serif-luxury font-bold tracking-wider">KINGSMAN DIRECT SECURE CHECKOUT</span>
          </div>
        </div>

        {submitError && (
          <div className="mb-8 p-4 bg-[#C1121F]/10 border border-[#C1121F] text-[#C1121F] text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Form Column */}
          <div className="lg:w-7/12 space-y-8">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* Section 1: Customer Contact & Dispatch Address */}
              <div className="bg-[#161616] border border-white/10 p-6 space-y-5 shadow-xl">
                <h3 className="font-serif-luxury text-lg font-bold text-white pb-3 border-b border-white/10 flex justify-between items-center">
                  <span>1. Contact & Dispatch Address</span>
                  <span className="text-[10px] text-white/40 font-mono">Step 1 of 2</span>
                </h3>

                {/* Name */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                    Full Name <span className="text-[#C1121F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                  />
                </div>

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Mobile Number (Bangladesh) <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (phoneError) setPhoneError('');
                      }}
                      className={`w-full px-4 py-3 bg-[#111111] border text-white text-xs focus:outline-none placeholder:text-white/30 ${
                        phoneError ? 'border-[#C1121F]' : 'border-white/20 focus:border-[#C1121F]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-[10px] text-[#C1121F] mt-1">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Email Address <span className="text-white/40 text-[10px] lowercase">(optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* District Selection */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                      District / Division <span className="text-[#C1121F]">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#C7A55B]">
                      {isInsideDhaka ? '৳100 (1-3 Days)' : '৳160 (2-5 Days)'}
                    </span>
                  </div>
                  <select
                    value={selectedDistrictName}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F]"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.isDhaka ? 'Inside Dhaka — ৳100' : 'Outside Dhaka — ৳160'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* City & Area Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      City / Thana <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka / Chattogram"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Area / Road / Sector <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mirpur-10 / Banani / Dhanmondi"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Full Street Address */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                    Complete Street Address <span className="text-[#C1121F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House No, Road No, Flat/Apartment, Landmark..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                  />
                </div>

                {/* Preferred Courier Partner */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/70 block mb-2 font-semibold">
                    Fulfillment Courier Partner
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCourier('Steadfast')}
                      className={`p-3 border text-left flex items-center justify-between transition-all ${
                        selectedCourier === 'Steadfast'
                          ? 'border-[#C7A55B] bg-[#C7A55B]/10 text-white'
                          : 'border-white/10 bg-[#111111] text-white/60 hover:text-white'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Steadfast Courier</p>
                        <p className="text-[10px] text-white/50">Nationwide doorstep tracking</p>
                      </div>
                      {selectedCourier === 'Steadfast' && <CheckCircle2 className="w-4 h-4 text-[#C7A55B]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCourier('Pathao')}
                      className={`p-3 border text-left flex items-center justify-between transition-all ${
                        selectedCourier === 'Pathao'
                          ? 'border-[#C7A55B] bg-[#C7A55B]/10 text-white'
                          : 'border-white/10 bg-[#111111] text-white/60 hover:text-white'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Pathao Express</p>
                        <p className="text-[10px] text-white/50">Fast city & hub delivery</p>
                      </div>
                      {selectedCourier === 'Pathao' && <CheckCircle2 className="w-4 h-4 text-[#C7A55B]" />}
                    </button>
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                    Delivery Instructions <span className="text-white/40 text-[10px] lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gate code, call before delivery, preferred delivery window..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Section 2: Payment Method & Advance Delivery Fee */}
              <div className="bg-[#161616] border border-white/10 p-6 space-y-5 shadow-xl">
                <div className="pb-3 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-serif-luxury text-lg font-bold text-white">
                    2. Payment & Advance Delivery Fee
                  </h3>
                  <span className="text-[10px] text-[#C7A55B] font-mono">Verified Policy</span>
                </div>

                {/* Confirmed Policy Callout */}
                <div className="p-3.5 bg-[#C7A55B]/10 border border-[#C7A55B]/30 flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#C7A55B] shrink-0 mt-0.5" />
                  <div className="text-xs text-white/80 space-y-1">
                    <p className="font-bold text-[#C7A55B]">Advance Delivery Fee Requirement</p>
                    <p className="text-[11px] leading-relaxed">
                      Delivery charges (<strong>৳{actualDeliveryCharge}</strong> for {isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}) must be paid in advance to confirm order booking. The remaining product amount of <strong>{formatPrice(remainingDueOnDelivery)}</strong> is payable in cash upon receiving your parcel.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  
                  {/* Option 1: Cash on Delivery with Advance Delivery Fee */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-white/5 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-[#111111] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="accent-emerald-500 mt-1"
                        />
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Cash on Delivery (Advance Fee via MFS)</span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold rounded">
                              Most Popular
                            </span>
                          </p>
                          <p className="text-[11px] text-white/60 mt-1">
                            Pay only <strong>৳{actualDeliveryCharge}</strong> delivery fee now via bKash/Nagad/Rocket. Pay the remaining <strong>{formatPrice(remainingDueOnDelivery)}</strong> cash to the courier.
                          </p>
                        </div>
                      </div>
                      <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    </div>

                    {/* Expandable MFS verification details when COD is active */}
                    {paymentMethod === 'COD' && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-3 bg-[#111111] border border-white/15 space-y-2 text-xs">
                          <p className="text-[11px] font-bold text-[#C7A55B] uppercase tracking-wider">
                            Step 1: Send Money ৳{actualDeliveryCharge} to Official KINGSMAN Account
                          </p>
                          <div className="flex items-center justify-between font-mono bg-black/40 px-3 py-2 border border-white/10">
                            <span className="text-white/70">Official WhatsApp / MFS Number:</span>
                            <span className="text-white font-bold text-sm tracking-widest text-[#C7A55B]">01581054939</span>
                          </div>
                          <p className="text-[10px] text-white/50">
                            Send Money via bKash, Nagad, or Rocket using Send Money option. Use your name or phone number as reference.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                            Step 2: Enter Advance Payment Details
                          </p>
                          
                          {/* MFS Selector */}
                          <div className="grid grid-cols-3 gap-2">
                            {(['bKash', 'Nagad', 'Rocket'] as const).map(provider => (
                              <button
                                key={provider}
                                type="button"
                                onClick={() => setAdvanceMethod(provider)}
                                className={`py-2 px-3 border text-xs font-bold uppercase transition-all ${
                                  advanceMethod === provider
                                    ? provider === 'bKash'
                                      ? 'border-[#E2136E] bg-[#E2136E]/20 text-[#E2136E]'
                                      : provider === 'Nagad'
                                      ? 'border-[#F7921E] bg-[#F7921E]/20 text-[#F7921E]'
                                      : 'border-[#8C3494] bg-[#8C3494]/20 text-[#8C3494]'
                                    : 'border-white/10 bg-[#111111] text-white/50'
                                }`}
                              >
                                {provider}
                              </button>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                                Sender Mobile Number <span className="text-[#C1121F]">*</span>
                              </label>
                              <input
                                type="tel"
                                required={paymentMethod === 'COD'}
                                placeholder="01XXXXXXXXX"
                                value={senderMfsPhone}
                                onChange={(e) => setSenderMfsPhone(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                                Transaction ID (TrxID) <span className="text-[#C1121F]">*</span>
                              </label>
                              <input
                                type="text"
                                required={paymentMethod === 'COD'}
                                placeholder="e.g. BL92XK38"
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                                className="w-full px-3 py-2.5 bg-[#111111] border border-white/20 text-white text-xs font-mono tracking-wider focus:outline-none focus:border-[#C7A55B]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Pay Full Amount Online (SSLCommerz) */}
                  <div
                    onClick={() => setPaymentMethod('SSLCommerz/Card')}
                    className={`p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'SSLCommerz/Card'
                        ? 'bg-[#C1121F]/10 border-[#C1121F] ring-1 ring-[#C1121F]/50'
                        : 'bg-[#111111] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'SSLCommerz/Card'}
                          onChange={() => setPaymentMethod('SSLCommerz/Card')}
                          className="accent-[#C1121F] mt-1"
                        />
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                            <span>Pay 100% Online (Cards / bKash / Nagad / Banking)</span>
                            <span className="px-2 py-0.5 bg-[#C7A55B]/20 text-[#C7A55B] text-[10px] uppercase font-bold rounded">
                              Zero COD Hassle
                            </span>
                          </p>
                          <p className="text-[11px] text-white/60 mt-1">
                            Pay the full amount of <strong>{formatPrice(grandTotal)}</strong> online via SSLCommerz gateway. Nothing to pay upon delivery.
                          </p>
                          
                          {/* Channel Badges */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-[#E2136E]/20 text-[#E2136E] text-[10px] font-bold">bKash</span>
                            <span className="px-1.5 py-0.5 bg-[#F7921E]/20 text-[#F7921E] text-[10px] font-bold">Nagad</span>
                            <span className="px-1.5 py-0.5 bg-[#8C3494]/20 text-[#8C3494] text-[10px] font-bold">Rocket</span>
                            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold">Visa / Mastercard</span>
                          </div>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 text-white" />
                )}
                <span>
                  {isSubmitting 
                    ? (paymentMethod === 'SSLCommerz/Card' ? 'Connecting to SSLCommerz...' : 'Verifying & Confirming...') 
                    : (paymentMethod === 'SSLCommerz/Card' 
                        ? `Pay Online Now (${formatPrice(grandTotal)})` 
                        : `Confirm Order with Advance Delivery Fee (৳${actualDeliveryCharge})`
                      )
                  }
                </span>
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar Column */}
          <div className="lg:w-5/12">
            <div className="bg-[#161616] border border-white/10 p-6 sticky top-28 space-y-6 shadow-2xl">
              <h3 className="font-serif-luxury text-xl font-bold text-white pb-4 border-b border-white/10 flex justify-between items-center">
                <span>Order Summary</span>
                <span className="text-xs text-[#C7A55B] font-bold">{cart.length} Item{cart.length !== 1 ? 's' : ''}</span>
              </h3>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-white/5">
                {cart.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={optimizeImageUrl(item.product.images[0], 150, 75)}
                      alt={`${item.product.name} in ${item.selectedColor.name} (EU ${item.selectedSize})`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 bg-[#111111] object-contain border border-white/10 shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">
                        Size: EU {item.selectedSize} • {item.selectedColor.name} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-[#C7A55B] shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Zone Details */}
              <div className="p-3.5 bg-[#111111] border border-white/10 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-white/90 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#C7A55B]" />
                    <span>{isInsideDhaka ? 'Inside Dhaka (৳100)' : 'Outside Dhaka (৳160)'}</span>
                  </span>
                  <span className="text-[#C7A55B] font-mono font-bold">
                    ৳ {actualDeliveryCharge}
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Estimated Delivery: <strong className="text-white">{selectedDistrict.estimatedDays}</strong>
                </p>
                <p className="text-[10px] text-emerald-400">
                  Courier Partner: <strong>{selectedCourier} Express Delivery</strong>
                </p>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2.5 text-xs text-white/70 pt-2 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C7A55B]">
                    <span>Promo Savings</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span>Advance Delivery Fee</span>
                    <span className="text-[10px] text-white/40">({isInsideDhaka ? 'Dhaka City ৳100' : 'Outside Dhaka ৳160'})</span>
                  </div>
                  <span className="font-semibold text-white">
                    ৳ {actualDeliveryCharge}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Total Order Value</span>
                  <span className="text-white text-lg">{formatPrice(grandTotal)}</span>
                </div>

                {/* Payable Now vs Remaining on Delivery */}
                <div className="p-3 bg-white/5 border border-white/10 space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs font-bold text-[#C7A55B]">
                    <span>Payable Now (Advance):</span>
                    <span>{formatPrice(payableNow)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Payable on Delivery:</span>
                    <span className="font-bold text-emerald-400">{formatPrice(remainingDueOnDelivery)}</span>
                  </div>
                </div>
              </div>

              {/* Production & Verification Guarantee */}
              <div className="p-3.5 bg-white/5 border border-white/10 text-[10px] text-white/60 space-y-1">
                <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KINGSMAN Quality & Dispatch Guarantee</span>
                </p>
                <p>
                  Every pair is thoroughly inspected in our Dhaka dispatch office before handover to Steadfast or Pathao.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
