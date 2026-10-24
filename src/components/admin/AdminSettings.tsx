import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Save, 
  CheckCircle2, 
  Scale, 
  Banknote,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber || '01581054939');
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber || '01581054939');
  const [rocketNumber, setRocketNumber] = useState(settings.rocketNumber || '01581054939');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '01581054939');
  
  const [insideDhakaFee, setInsideDhakaFee] = useState<number>(settings.deliveryChargeInsideDhaka || 100);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState<number>(settings.deliveryChargeOutsideDhaka || 160);
  const [baseWeightGrams, setBaseWeightGrams] = useState<number>(settings.baseWeightGrams || 1000);
  const [extraChargePerKg, setExtraChargePerKg] = useState<number>(settings.extraChargePerKg || 0);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setBkashNumber(settings.bkashNumber || '01581054939');
      setNagadNumber(settings.nagadNumber || '01581054939');
      setRocketNumber(settings.rocketNumber || '01581054939');
      setWhatsappNumber(settings.whatsappNumber || '01581054939');
      setInsideDhakaFee(settings.deliveryChargeInsideDhaka ?? 100);
      setOutsideDhakaFee(settings.deliveryChargeOutsideDhaka ?? 160);
      setBaseWeightGrams(settings.baseWeightGrams ?? 1000);
      setExtraChargePerKg(settings.extraChargePerKg ?? 0);
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: Partial<StoreSettings> = {
      bkashNumber: bkashNumber.trim(),
      nagadNumber: nagadNumber.trim(),
      rocketNumber: rocketNumber.trim(),
      whatsappNumber: whatsappNumber.trim(),
      deliveryChargeInsideDhaka: Number(insideDhakaFee),
      deliveryChargeOutsideDhaka: Number(outsideDhakaFee),
      baseWeightGrams: Number(baseWeightGrams),
      extraChargePerKg: Number(extraChargePerKg),
    };

    await updateSettings(payload);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            STORE CONFIGURATION & SETTINGS
          </h1>
          <p className="text-xs text-white/60">
            MFS numbers for advance delivery fees, Dhaka & Outside delivery rates, and parcel weight surcharges.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Advance Delivery Charge MFS Accounts */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C7A55B] flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              <span>Advance Delivery Charge Accounts (Send-Money Numbers)</span>
            </h3>
            <span className="text-[10px] text-white/50">Displayed to customers on Checkout & Confirmation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#E2136E] block mb-1">
                bKash Number
              </label>
              <input
                type="text"
                required
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#F7921E] block mb-1">
                Nagad Number
              </label>
              <input
                type="text"
                required
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#B845C2] block mb-1">
                Rocket Number
              </label>
              <input
                type="text"
                required
                value={rocketNumber}
                onChange={(e) => setRocketNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#25D366] block mb-1">
                WhatsApp Hotline / Concierge Number
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
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
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                Inside Dhaka City Delivery Charge (BDT)
              </label>
              <input
                type="number"
                required
                value={insideDhakaFee}
                onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
              <span className="text-[10px] text-white/40 mt-1 block">Default: 100 BDT</span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                Outside Dhaka / District Delivery Charge (BDT)
              </label>
              <input
                type="number"
                required
                value={outsideDhakaFee}
                onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
              <span className="text-[10px] text-white/40 mt-1 block">Default: 160 BDT</span>
            </div>
          </div>
        </div>

        {/* Parcel Weight Settings */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C7A55B] flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>Heavy Parcel Weight Surcharge</span>
            </h3>
            <span className="text-[10px] text-white/50">Dynamic calculation: sum(weightGrams × quantity)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                Base Parcel Weight Allowance (Grams)
              </label>
              <input
                type="number"
                required
                value={baseWeightGrams}
                onChange={(e) => setBaseWeightGrams(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
              <span className="text-[10px] text-white/40 mt-1 block">
                Standard parcel weight included in base charge (e.g. 1000g = 1 kg).
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                Extra Charge Per Additional KG (BDT)
              </label>
              <input
                type="number"
                required
                value={extraChargePerKg}
                onChange={(e) => setExtraChargePerKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded outline-none focus:border-[#C7A55B]"
              />
              <span className="text-[10px] text-white/40 mt-1 block">
                Default: 0 BDT until owner decides to activate heavy parcel surcharge.
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Store parameters saved and active across storefront!</span>
            </p>
          )}

          <div className="ml-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
