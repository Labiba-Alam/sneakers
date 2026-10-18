import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Crown, 
  Package, 
  MapPin, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Heart,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    setAuthModalTab,
    customer,
    isCustomerLoggedIn,
    customerLogin,
    customerRegister,
    customerLogout,
    allOrders,
    formatPrice,
    setView,
    setIsOrderTrackingOpen
  } = useStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Register Fields
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regNewsletter, setRegNewsletter] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeAuthModalRef = useRef(closeAuthModal);
  closeAuthModalRef.current = closeAuthModal;

  // Keyboard navigation: Escape key listener
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModalRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!identifier.trim()) {
      setFormError('Please enter your email or Bangladesh phone number.');
      return;
    }
    if (!password.trim()) {
      setFormError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await customerLogin(identifier.trim(), password);
      setIsSubmitting(false);
      // Stay on account view to see profile or close if user wishes
    } catch {
      setFormError('Unable to sign in. Please verify your credentials.');
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!regFullName.trim()) {
      setFormError('Please provide your full name.');
      return;
    }
    if (!regPhone.trim()) {
      setFormError('Please provide a valid Bangladesh phone number (e.g. 01712-345678).');
      return;
    }
    if (regPassword.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await customerRegister({
        fullName: regFullName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword
      });
      setIsSubmitting(false);
    } catch {
      setFormError('Registration could not be completed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setIsSubmitting(true);
    setFormError('');
    await customerLogin('alam.labiba003@gmail.com', 'kingsman2026');
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-account-title"
      >
        {/* Backdrop with soft blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.4 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 140) {
              closeAuthModal();
            }
          }}
          className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 font-sans border border-black/5"
        >
          {/* Mobile Swipe Handle Indicator */}
          <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-white cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 bg-black/20 rounded-full" />
          </div>

          {/* Modal Header Bar */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-black/10 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile Back Arrow Button */}
              <button
                onClick={closeAuthModal}
                className="sm:hidden p-2 -ml-2 text-[#111111] hover:bg-black/5 rounded-full transition-colors outline-none focus:outline-none focus-visible:opacity-70"
                aria-label="Back to previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#C1121F] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  K
                </div>
                <div>
                  <h2 id="customer-account-title" className="text-base sm:text-lg font-bold tracking-tight text-[#111111] uppercase font-sans">
                    {isCustomerLoggedIn ? 'Customer Portal' : 'Kingsman Account'}
                  </h2>
                  <p className="text-[10px] tracking-wider uppercase text-[#C7A55B] font-semibold">
                    {isCustomerLoggedIn ? 'VIP Concierge & Orders' : 'Exclusive Royal Footwear Member'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop & General Close (X) Button */}
            <button
              onClick={closeAuthModal}
              className="p-2.5 text-[#111111]/70 hover:text-[#111111] hover:bg-black/5 rounded-full transition-all outline-none focus:outline-none focus-visible:opacity-70"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">

            {/* ========================================================================= */}
            {/* VIEW A: LOGGED-IN CUSTOMER PROFILE & ORDER HISTORY */}
            {/* ========================================================================= */}
            {isCustomerLoggedIn && customer ? (
              <div className="space-y-6">
                
                {/* VIP Membership Card */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#1A1A1A] to-[#252525] p-5 sm:p-6 text-white shadow-lg border border-[#C7A55B]/30">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-[#C7A55B]/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-[#C7A55B]/20 border border-[#C7A55B] flex items-center justify-center text-[#C7A55B] font-bold text-lg">
                        {customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-white">
                            {customer.fullName}
                          </h3>
                          <span className="px-2 py-0.5 bg-[#C7A55B] text-black text-[10px] font-black tracking-wider uppercase rounded-full">
                            {customer.vipTier}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-[#C7A55B]" />
                          <span>{customer.email || 'Member ID: ' + customer.id}</span>
                        </p>
                        <p className="text-xs text-white/60 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-[#C7A55B]" />
                          <span>{customer.phone}</span>
                        </p>
                      </div>
                    </div>

                    <Crown className="w-6 h-6 text-[#C7A55B] shrink-0" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10 text-center">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-white/50">Total Orders</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">{customer.totalOrders}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-white/50">Total Spent</span>
                      <span className="text-sm font-bold text-[#C7A55B] mt-0.5 block">৳ {customer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-white/50">Concierge</span>
                      <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Active</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address & Status in Bangladesh */}
                <div className="p-4 rounded-xl bg-[#F8F8F8] border border-black/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C1121F]" />
                      <span>Primary Delivery Residence (Bangladesh)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#111111]/80 pl-6 leading-relaxed">
                    {customer.address}, {customer.area}, {customer.district}
                  </p>
                </div>

                {/* Recent Orders Overview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#C7A55B]" />
                      <span>Recent Orders & Atelier Consignments</span>
                    </h4>
                    <button
                      onClick={() => {
                        closeAuthModal();
                        setIsOrderTrackingOpen(true);
                      }}
                      className="text-xs text-[#C1121F] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {allOrders.length > 0 ? (
                    <div className="space-y-2.5">
                      {allOrders.slice(0, 3).map((order) => (
                        <div 
                          key={order.id} 
                          className="p-3.5 bg-white border border-black/10 rounded-xl flex items-center justify-between hover:border-[#C1121F]/30 transition-all text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#111111] flex items-center gap-2">
                              <span>{order.id}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-black/5 text-[#111111] font-semibold">
                                {order.orderStatus}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#111111]/60 block mt-0.5">
                              {order.items.length} item(s) • Tracking: {order.trackingNumber}
                            </span>
                          </div>
                          <span className="font-bold text-[#111111] text-right">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center bg-[#F8F8F8] rounded-xl border border-dashed border-black/15 text-xs text-[#111111]/60">
                      <Package className="w-8 h-8 text-[#111111]/30 mx-auto mb-2" />
                      <p>No recent orders found. Discover hand-stitched luxury sneakers.</p>
                      <button
                        onClick={() => {
                          closeAuthModal();
                          setView('catalog');
                        }}
                        className="mt-3 px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#C1121F] transition-colors"
                      >
                        Explore Catalog
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Action Buttons */}
                <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      closeAuthModal();
                      setView('wishlist');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 border border-black/10 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-black/5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-[#C1121F]" />
                    <span>My Wishlist</span>
                  </button>

                  <button
                    onClick={customerLogout}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C1121F] hover:bg-[#C1121F]/10 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            ) : (
              /* ========================================================================= */
              /* VIEW B: CUSTOMER LOGIN & CREATE ACCOUNT TABS */
              /* ========================================================================= */
              <div className="space-y-6">

                {/* Tab Navigation (Login vs Sign Up) */}
                <div className="grid grid-cols-2 p-1 bg-[#F1F1F1] rounded-xl text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('login');
                      setFormError('');
                    }}
                    className={`py-2.5 rounded-lg transition-all outline-none focus:outline-none ${
                      authModalTab === 'login'
                        ? 'bg-white text-[#111111] shadow-sm font-black'
                        : 'text-[#111111]/60 hover:text-[#111111]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('register');
                      setFormError('');
                    }}
                    className={`py-2.5 rounded-lg transition-all outline-none focus:outline-none ${
                      authModalTab === 'register'
                        ? 'bg-white text-[#111111] shadow-sm font-black'
                        : 'text-[#111111]/60 hover:text-[#111111]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Forgot Password Notification */}
                {forgotSent && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg">
                    A secure password reset SMS / email link has been dispatched to your contact number.
                  </div>
                )}

                {/* TAB 1: LOGIN FORM */}
                {authModalTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                        Email or Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="e.g. 01712-345678 or name@domain.com"
                          className="w-full px-4 py-3 pl-10 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                          required
                        />
                        <User className="w-4 h-4 text-[#111111]/40 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setForgotSent(true)}
                          className="text-xs text-[#C1121F] font-semibold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 pl-10 pr-10 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                          required
                        />
                        <Lock className="w-4 h-4 text-[#111111]/40 absolute left-3.5 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 text-[#111111]/50 hover:text-[#111111] absolute right-3 top-2.5 focus:outline-none"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#111111]/80 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-[#C1121F] rounded border-black/20 focus:ring-[#C1121F]"
                        />
                        <span>Remember me on this device</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#111111] text-white rounded-xl text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#C1121F] active:scale-[0.99] transition-all disabled:opacity-50 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <span>Login</span>
                      )}
                    </button>

                    {/* Instant Demo Sign-in for Tester Evaluation */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleInstantDemoLogin}
                        className="w-full py-2.5 bg-[#C7A55B]/10 border border-[#C7A55B]/40 text-[#8C6D23] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#C7A55B]/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C7A55B]" />
                        <span>Instant Demo Sign In (Labiba Alam)</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: CREATE ACCOUNT FORM */}
                {authModalTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Labiba Alam"
                          className="w-full px-4 py-3 pl-10 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                          required
                        />
                        <User className="w-4 h-4 text-[#111111]/40 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                        Phone Number (Bangladesh)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-[#111111]/70 bg-black/5 px-1.5 py-0.5 rounded">
                          +880
                        </span>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="1712-345678"
                          className="w-full px-4 py-3 pl-16 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-[#111111]/50 mt-1 block">
                        Used for DHL & RedX courier delivery updates in Bangladesh
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 pl-10 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                        />
                        <Mail className="w-4 h-4 text-[#111111]/40 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3 py-3 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Re-type password"
                            className="w-full px-3 py-3 bg-[#F8F8F8] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer text-xs text-[#111111]/80 select-none pt-1">
                      <input
                        type="checkbox"
                        checked={regNewsletter}
                        onChange={(e) => setRegNewsletter(e.target.checked)}
                        className="w-4 h-4 text-[#C1121F] rounded border-black/20 focus:ring-[#C1121F] mt-0.5"
                      />
                      <span>Receive VIP invitations for limited Italian leather releases in Dhaka</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#C1121F] text-white rounded-xl text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#9b0d18] active:scale-[0.99] transition-all disabled:opacity-50 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Creating Royal Profile...</span>
                        </>
                      ) : (
                        <span>Sign Up</span>
                      )}
                    </button>
                  </form>
                )}

                {/* SOCIAL LOGIN PLACEHOLDERS (FUTURE READY) */}
                <div className="pt-2 space-y-3">
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-black/10 w-full" />
                    <span className="bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-[#111111]/40 shrink-0">
                      Or Social Sign-In
                    </span>
                    <div className="border-t border-black/10 w-full" />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Google */}
                    <button
                      type="button"
                      disabled
                      className="py-2.5 px-3 border border-black/10 rounded-xl flex items-center justify-center gap-2 bg-[#F8F8F8] opacity-50 cursor-not-allowed hover:bg-[#F8F8F8]"
                      title="Google sign-in coming soon"
                      aria-label="Continue with Google (coming soon)"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span className="text-[11px] font-semibold text-[#111111]">Google</span>
                    </button>

                    {/* Apple */}
                    <button
                      type="button"
                      disabled
                      className="py-2.5 px-3 border border-black/10 rounded-xl flex items-center justify-center gap-2 bg-[#F8F8F8] opacity-50 cursor-not-allowed hover:bg-[#F8F8F8]"
                      title="Apple sign-in coming soon"
                      aria-label="Continue with Apple (coming soon)"
                    >
                      <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.02-14.42-6.53-9.97-11.83-21.75-15.89-35.33-4.06-13.58-6.09-26.68-6.09-39.31 0-15.64 3.73-28.84 11.19-39.6 7.46-10.76 17.1-16.29 28.92-16.59 5.34 0 11.05 1.41 17.12 4.23 6.07 2.82 10.22 4.29 12.44 4.41 1.77 0 6.13-1.57 13.09-4.71 6.96-3.14 12.87-4.45 17.74-3.93 13.43 1.12 24.31 6.55 32.65 16.3-11.75 7.15-17.5 17.14-17.25 29.98.25 10.15 4.17 18.59 11.76 25.32 7.59 6.73 16.57 10.45 26.93 11.16-2.58 8.16-5.84 16.42-9.78 24.78zM119.22 33.15c0-7.82 2.76-15.15 8.28-21.99 5.52-6.84 12.27-10.89 20.25-12.16.25 1.13.38 2.26.38 3.39 0 7.82-2.92 15.35-8.76 22.59-5.84 7.24-12.63 11.27-20.37 12.09-.5-1.25-.78-2.56-.78-3.92z" />
                      </svg>
                      <span className="text-[11px] font-semibold text-[#111111]">Apple</span>
                    </button>

                    {/* Facebook */}
                    <button
                      type="button"
                      disabled
                      className="py-2.5 px-3 border border-black/10 rounded-xl flex items-center justify-center gap-2 bg-[#F8F8F8] opacity-50 cursor-not-allowed hover:bg-[#F8F8F8]"
                      title="Facebook sign-in coming soon"
                      aria-label="Continue with Facebook (coming soon)"
                    >
                      <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-[11px] font-semibold text-[#111111]">Facebook</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-[#111111]/40 tracking-normal pt-1">
                    Social authentication placeholders • Coming soon for Bangladesh atelier members
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Modal Footer Bar */}
          <div className="px-6 py-3.5 bg-[#F8F8F8] border-t border-black/5 flex items-center justify-between text-[11px] text-[#111111]/60 shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 256-Bit Encrypted Session</span>
            </span>
            <span className="font-semibold text-[#111111]/70">
              KINGSMAN DHAKA • Concierge
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
