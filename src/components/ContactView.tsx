import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Bespoke Sizing & Consultation',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you. A KINGSMAN Concierge will contact you within 2 hours.', 'success');
      setFormData({ name: '', phone: '', email: '', subject: 'Bespoke Sizing & Consultation', message: '' });
    }, 800);
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F8F8F8] min-h-[70vh] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Client Services</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-4xl font-black text-white tracking-wider">
            ATELIER CONCIERGE & SHOWROOMS
          </h1>
          <p className="text-xs text-white/60 leading-relaxed">
            Our royal sneaker specialists in Dhaka and Chattogram are at your service for appointments, order inquiries, and bespoke fittings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Flagship Showroom Locations & Direct Lines */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dhanmondi Atelier Flagship */}
            <div className="p-6 bg-[#141414] border border-[#C7A55B]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Dhanmondi Atelier Flagship</span>
              </div>
              <h3 className="font-royal text-lg font-bold text-white">House 42, Road 7/A, Dhanmondi R/A</h3>
              <p className="text-xs text-white/60">Dhaka-1209, Bangladesh</p>
              <div className="pt-2 text-xs text-white/70 space-y-1">
                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-white/40" /> 10:00 AM – 9:30 PM (7 Days a Week)</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-white/40" /> +880 1711-234567 (VIP Concierge)</p>
              </div>
            </div>

            {/* Gulshan VIP Salon */}
            <div className="p-6 bg-[#141414] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Gulshan-2 Private Salon</span>
              </div>
              <h3 className="font-royal text-lg font-bold text-white">Avenue 104, Gulshan-2 Commercial Zone</h3>
              <p className="text-xs text-white/60">Dhaka-1212, Bangladesh</p>
              <div className="pt-2 text-xs text-white/70 space-y-1">
                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-white/40" /> 11:00 AM – 9:00 PM (By Appointment)</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-white/40" /> +880 1819-987654 (Appointment Line)</p>
              </div>
            </div>

            {/* Digital Service Guarantees */}
            <div className="p-4 bg-white/5 border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#C7A55B] shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white uppercase tracking-wider">Direct WhatsApp Assistance</p>
                <p className="text-white/60">Chat with a personal footwear stylist 24/7 at +880 1912-345678.</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#141414] border border-white/10 p-8 space-y-6">
            <div>
              <h2 className="font-royal text-xl font-bold text-white mb-1">
                DISPATCH A CONCIERGE MESSAGE
              </h2>
              <p className="text-xs text-white/50">
                Inquire about custom sizing, limited drops, or tracking inquiries.
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
                    placeholder="Lord / Lady Sterling"
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
                    placeholder="017XXXXXXXX"
                    className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Email Address
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
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                  >
                    <option value="Bespoke Sizing & Consultation">Bespoke Sizing & Consultation</option>
                    <option value="Order Tracking & Delivery Status">Order Tracking & Delivery Status</option>
                    <option value="Private Showroom Appointment">Private Showroom Appointment</option>
                    <option value="Corporate & VIP Inquiries">Corporate & VIP Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                  Message <span className="text-[#C1121F]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our concierge assist your footwear acquisition today?"
                  className="w-full px-4 py-3 bg-[#111111] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a00f1a] text-white text-xs uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Request...' : 'Send to Atelier Concierge'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
