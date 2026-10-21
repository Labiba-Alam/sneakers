import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Sneaker Sizing & Order Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you for reaching out. A KINGSMAN representative will reply via WhatsApp or email shortly.', 'success');
      setFormData({ name: '', phone: '', email: '', subject: 'Sneaker Sizing & Order Inquiry', message: '' });
    }, 600);
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F8F8F8] min-h-[70vh] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Care & Concierge</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-4xl font-black text-white tracking-wider">
            CONTACT KINGSMAN
          </h1>
          <p className="text-xs text-white/60 leading-relaxed">
            Need guidance on unisex sizing, advance delivery fees, or tracking a Steadfast / Pathao parcel? Our Dhaka team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Channel */}
            <div className="p-6 bg-[#141414] border border-[#25D366]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#25D366] text-xs font-bold uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Support</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-[#25D366]/20 text-[#25D366] font-bold rounded">
                  Fastest Response
                </span>
              </div>
              <h3 className="font-royal text-xl font-bold text-white tracking-wide">01581054939</h3>
              <p className="text-xs text-white/60">
                Direct chat with our sneaker stylists for live size advice, video inspects, and payment confirmation.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/8801581054939"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline"
                >
                  <span>Open WhatsApp Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Official Support Email */}
            <div className="p-6 bg-[#141414] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Official Email Inquiries</span>
              </div>
              <h3 className="font-royal text-lg font-bold text-white">kingsmanszn@gmail.com</h3>
              <p className="text-xs text-white/60">
                For order receipts, corporate partnerships, and refund queries.
              </p>
              <p className="text-[11px] text-white/50 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                <span>Responses within 2 to 6 business hours</span>
              </p>
            </div>

            {/* Corporate & Dispatch Office (Online Only - No Showroom) */}
            <div className="p-6 bg-[#141414] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Corporate Operations & Dispatch Office</span>
              </div>
              <h3 className="font-royal text-base font-bold text-white leading-snug">
                House 44, Road 3, Block B, Mirpur 12
              </h3>
              <p className="text-xs text-white/60">Dhaka-1216, Bangladesh</p>
              <div className="p-2.5 bg-[#C1121F]/10 border border-[#C1121F]/30 text-[11px] text-[#C1121F] font-semibold">
                ⚠️ Notice: Online store fulfillment & dispatch center only. Strictly no walk-in showroom.
              </div>
              <p className="text-[11px] text-white/50 flex items-center gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                <span>Dispatch Hours: 10:00 AM – 8:00 PM (Saturday – Thursday)</span>
              </p>
            </div>

            {/* Official Social Media Channels */}
            <div className="p-5 bg-white/5 border border-white/10 space-y-3">
              <p className="text-[11px] uppercase tracking-wider font-bold text-white">
                Official Brand Social Channels
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://www.facebook.com/Kingsmanszn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#111111] border border-white/10 hover:border-[#C7A55B] flex items-center justify-between text-white/80 hover:text-white transition-all"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>

                <a
                  href="https://www.instagram.com/kingsmanszn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#111111] border border-white/10 hover:border-[#C7A55B] flex items-center justify-between text-white/80 hover:text-white transition-all"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>

                <a
                  href="https://www.tiktok.com/@kingsmanszn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#111111] border border-white/10 hover:border-[#C7A55B] flex items-center justify-between text-white/80 hover:text-white transition-all"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>

                <a
                  href="https://www.pinterest.com/kingsmanszn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#111111] border border-white/10 hover:border-[#C7A55B] flex items-center justify-between text-white/80 hover:text-white transition-all"
                >
                  <span>Pinterest</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#141414] border border-white/10 p-8 space-y-6">
            <div>
              <h2 className="font-royal text-xl font-bold text-white mb-1">
                DISPATCH A MESSAGE TO KINGSMAN
              </h2>
              <p className="text-xs text-white/50">
                Inquire about unisex sizing, limited drops, advance fee confirmation, or parcel tracking.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Your Name <span className="text-[#C1121F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Mobile Number (Bangladesh) <span className="text-[#C1121F]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Email Address <span className="text-white/40 text-[9px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                  >
                    <option value="Sneaker Sizing & Order Inquiry">Sneaker Sizing & Fit Guidance</option>
                    <option value="Advance Delivery Fee Confirmation">Advance Delivery Fee Confirmation</option>
                    <option value="Steadfast / Pathao Parcel Tracking">Parcel Tracking (Steadfast / Pathao)</option>
                    <option value="Exchange or Return Request">Defective / Incorrect Item (within 3 days)</option>
                    <option value="Wholesale / Bulk Inquiry">Wholesale / Special Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                  Your Message <span className="text-[#C1121F]">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you need assistance with..."
                  className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
                <span>Send Inquiry</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
