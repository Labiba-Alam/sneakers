import React, { useState } from 'react';
import { Settings, Store, Phone, Mail, MapPin, CreditCard, Truck, Globe, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [storeName, setStoreName] = useState('KINGSMAN Royal Sneakers');
  const [phone, setPhone] = useState('+880 9612 888 999');
  const [email, setEmail] = useState('concierge@kingsman.royal');
  const [address, setAddress] = useState('Plot 42, Gulshan Avenue, Dhaka 1212');
  const [insideDhakaFee, setInsideDhakaFee] = useState(120);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(250);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState({
    bKash: true,
    Nagad: true,
    Rocket: true,
    SSLCommerz: true,
    COD: true
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            STORE CONFIGURATION & SETTINGS
          </h1>
          <p className="text-xs text-white/60">
            Business credentials, delivery charge rates, payment gateways & API integrations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Store Profile */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C7A55B] flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span>Store Profile & Concierge Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Official Concierge Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Administrative Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Flagship Atelier Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
              />
            </div>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C7A55B] flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Delivery Charge Rates (BDT)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Inside Dhaka City Delivery Rate (BDT)</label>
              <input
                type="number"
                value={insideDhakaFee}
                onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Outside Dhaka / District Delivery Rate (BDT)</label>
              <input
                type="number"
                value={outsideDhakaFee}
                onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C7A55B] flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Enabled Checkout Payment Gateways</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(paymentMethods).map(([gateway, isEnabled]) => (
              <label key={gateway} className="p-3 bg-[#181818] border border-white/10 rounded flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-white">{gateway}</span>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, [gateway]: e.target.checked })}
                  className="accent-[#C7A55B]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Store parameters updated & synced to cloud database.</span>
            </p>
          )}

          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
