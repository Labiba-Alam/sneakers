import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { ShieldCheck, Lock, CreditCard, ArrowLeft, Crown, Truck, AlertCircle, MapPin, Banknote, Sparkles } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Selected District & Delivery Fee Calculation (BDT)
  const selectedDistrict = BANGLADESH_DISTRICTS.find(d => d.name === selectedDistrictName) || BANGLADESH_DISTRICTS[0];
  const isInsideDhaka = selectedDistrict.isDhaka;
  const deliveryCharge = isInsideDhaka ? 80 : (selectedDistrict.deliveryChargeBDT || 130);
  const freeDeliveryThreshold = 5000; // Free delivery in Bangladesh over ৳ 5,000
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || discountAmount >= subtotal;
  const actualDeliveryCharge = isFreeDelivery ? 0 : deliveryCharge;
  const grandTotal = Math.max(0, subtotal - discountAmount + actualDeliveryCharge);

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
      setPhoneError('Please enter a valid 11-digit Bangladeshi number (e.g. 017XXXXXXXX or +88017XXXXXXXX).');
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

    setIsSubmitting(true);

    try {
      const orderPayload = {
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
        currency,
      };

      if (paymentMethod === 'SSLCommerz/Card') {
        // Online Payment via SSLCommerz Aggregator
        showToast('Initiating SSLCommerz secure payment gateway...', 'info');

        const res = await fetch('/api/payment/sslcommerz/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const data = await res.json();

        if (data.success && data.gatewayUrl) {
          // Redirect user to SSLCommerz unified payment gateway
          window.location.href = data.gatewayUrl;
          return;
        } else {
          throw new Error(data.error || 'Could not connect to payment gateway.');
        }
      } else {
        // Cash on Delivery (COD) - Direct Order Placement
        await placeOrder({
          ...orderPayload,
          paymentMethod: 'COD',
          paymentStatus: 'Due',
          paymentDetails: {
            transactionId: `COD-KNG-${Date.now().toString().slice(-6)}`,
          },
        });

        triggerConfetti();
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
        
        {/* Return Button */}
        <button
          onClick={() => setView('catalog')}
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white uppercase tracking-widest font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Footwear Archive</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Checkout Form Column */}
          <div className="lg:w-7/12 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                <Crown className="w-4 h-4" />
                <span>KINGSMAN Atelier Express Delivery</span>
              </div>
              <h1 className="font-serif-luxury text-3xl font-bold text-white">
                GUEST CHECKOUT
              </h1>
              <p className="text-xs text-white/60 mt-1 font-light">
                No account required. Please provide your delivery details below for priority fulfillment.
              </p>
            </div>

            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Section 1: Recipient & Delivery Information */}
              <div className="bg-[#161616] border border-white/10 p-6 space-y-4 shadow-xl">
                <h3 className="font-serif-luxury text-lg font-bold text-white pb-3 border-b border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C1121F]" />
                    <span>1. Delivery Address</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-sans tracking-widest uppercase font-bold">
                    All 64 Districts Supported
                  </span>
                </h3>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Full Name <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hossain"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] transition-colors placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Mobile Number (BD) <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setPhoneError('');
                      }}
                      className={`w-full px-4 py-3 bg-[#111111] border text-white text-xs focus:outline-none transition-colors placeholder:text-white/30 ${
                        phoneError ? 'border-red-500' : 'border-white/20 focus:border-[#C1121F]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {phoneError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Email Address <span className="text-white/40 text-[10px] lowercase">(optional for digital receipt)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="tanvir@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      District <span className="text-[#C1121F]">*</span>
                    </label>
                    <select
                      value={selectedDistrictName}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] cursor-pointer"
                    >
                      {BANGLADESH_DISTRICTS.map(d => (
                        <option key={d.name} value={d.name} className="bg-[#111111] text-white">
                          {d.name} ({d.isDhaka ? 'Inside Dhaka • ৳80' : `Outside Dhaka • ৳${d.deliveryChargeBDT}`})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      City / Division <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka / Chattogram / Sylhet"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                      Area / Thana / Upazila <span className="text-[#C1121F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gulshan-2 / Dhanmondi / Agrabad"
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

                {/* Delivery Notes */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                    Delivery Instructions <span className="text-white/40 text-[10px] lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gate code, call before delivery, prefer evening delivery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F] placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Section 2: Payment Method Selection */}
              <div className="bg-[#161616] border border-white/10 p-6 space-y-4 shadow-xl">
                <h3 className="font-serif-luxury text-lg font-bold text-white pb-3 border-b border-white/10 flex justify-between items-center">
                  <span>2. Payment Method</span>
                  <span className="text-[10px] text-[#C7A55B] font-mono">SSLCommerz Secured</span>
                </h3>

                <div className="space-y-3">
                  
                  {/* Option 1: Cash on Delivery */}
                  <label
                    className={`p-4 border cursor-pointer transition-all flex items-start justify-between ${
                      paymentMethod === 'COD'
                        ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-[#111111] border-white/10 hover:border-white/30'
                    }`}
                  >
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
                          <span>Cash on Delivery (COD)</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold rounded">
                            Due on Delivery
                          </span>
                        </p>
                        <p className="text-[11px] text-white/60 mt-1">
                          Pay cash directly to the courier agent upon receiving and inspecting your package.
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  </label>

                  {/* Option 2: Pay Online (SSLCommerz Aggregator: bKash / Nagad / Rocket / Cards) */}
                  <label
                    className={`p-4 border cursor-pointer transition-all flex items-start justify-between ${
                      paymentMethod === 'SSLCommerz/Card'
                        ? 'bg-[#C1121F]/10 border-[#C1121F] ring-1 ring-[#C1121F]/50'
                        : 'bg-[#111111] border-white/10 hover:border-white/30'
                    }`}
                  >
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
                          <span>Pay Online (bKash / Nagad / Rocket / Card)</span>
                          <span className="px-2 py-0.5 bg-[#C7A55B]/20 text-[#C7A55B] text-[10px] uppercase font-bold rounded">
                            Instant Verification
                          </span>
                        </p>
                        <p className="text-[11px] text-white/60 mt-1">
                          Redirects securely to SSLCommerz Gateway supporting bKash, Nagad, Rocket, Upay, Visa, Mastercard, and Internet Banking.
                        </p>
                        
                        {/* Channel Badges */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 flex-wrap">
                          <span className="px-1.5 py-0.5 bg-[#E2136E]/20 text-[#E2136E] text-[10px] font-bold">bKash</span>
                          <span className="px-1.5 py-0.5 bg-[#F7921E]/20 text-[#F7921E] text-[10px] font-bold">Nagad</span>
                          <span className="px-1.5 py-0.5 bg-[#8C3494]/20 text-[#8C3494] text-[10px] font-bold">Rocket</span>
                          <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold">Visa / MC</span>
                        </div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
                  </label>

                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-2xl red-border-glow flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 text-white" />
                )}
                <span>
                  {isSubmitting 
                    ? (paymentMethod === 'SSLCommerz/Card' ? 'Redirecting to SSLCommerz...' : 'Confirming Order...') 
                    : (paymentMethod === 'SSLCommerz/Card' 
                        ? `Proceed to Online Payment (${formatPrice(grandTotal)})` 
                        : `Place Order with Cash on Delivery (${formatPrice(grandTotal)})`
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
                    <span>{isInsideDhaka ? 'Inside Dhaka City' : 'Outside Dhaka (District Courier)'}</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {actualDeliveryCharge === 0 ? 'FREE' : formatPrice(actualDeliveryCharge)}
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Estimated Delivery: <strong className="text-white">{selectedDistrict.estimatedDays}</strong>
                </p>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2.5 text-xs text-white/70 pt-2 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                    <span>Delivery Charge</span>
                    <span className="text-[10px] text-white/40">({isInsideDhaka ? 'Inside Dhaka ৳80' : 'Outside Dhaka ৳150'})</span>
                  </div>
                  <span className="font-semibold text-white">
                    {actualDeliveryCharge === 0 ? (
                      <strong className="text-emerald-400 uppercase font-bold">FREE</strong>
                    ) : (
                      formatPrice(actualDeliveryCharge)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-[#C7A55B] text-xl">{formatPrice(grandTotal)}</span>
                </div>

                {paymentMethod === 'COD' && (
                  <p className="text-[10px] text-emerald-400 text-right">
                    Payment Status: <strong className="uppercase">Due on Delivery</strong>
                  </p>
                )}
              </div>

              {/* Production & Verification Guarantee */}
              <div className="p-3.5 bg-white/5 border border-white/10 text-[10px] text-white/60 space-y-1">
                <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KINGSMAN Quality Assurance</span>
                </p>
                <p>
                  Every pair is thoroughly inspected before dispatch. Safe boxed packaging & verified courier tracking.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
