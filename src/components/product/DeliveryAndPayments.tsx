import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Banknote, CreditCard, CheckCircle2 } from 'lucide-react';

export const DeliveryAndPayments: React.FC = () => {
  return (
    <div className="py-5 border-t border-white/10 space-y-4">
      
      {/* Guarantees Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#161616] border border-white/10 p-3 flex items-start gap-3">
          <Truck className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Dhaka & Nationwide Express Delivery
            </h5>
            <p className="text-[11px] text-white/60 font-light mt-0.5">
              Inside Dhaka: <span className="text-white font-medium">24-48 Hours</span> • Outside Dhaka: <span className="text-white font-medium">48-72 Hours</span>
            </p>
          </div>
        </div>

        <div className="bg-[#161616] border border-white/10 p-3 flex items-start gap-3">
          <Banknote className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              100% Cash on Delivery
            </h5>
            <p className="text-[11px] text-white/60 font-light mt-0.5">
              Inspect your pair before paying courier. Full peace of mind.
            </p>
          </div>
        </div>

        <div className="bg-[#161616] border border-white/10 p-3 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Quality Guarantee
            </h5>
            <p className="text-[11px] text-white/60 font-light mt-0.5">
              Verified import serial number & premium build quality check.
            </p>
          </div>
        </div>

        <div className="bg-[#161616] border border-white/10 p-3 flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-[#C7A55B] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              30-Day Royal Returns
            </h5>
            <p className="text-[11px] text-white/60 font-light mt-0.5">
              Hassle-free size exchange with doorstep courier pickup.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Gateway Badges */}
      <div className="bg-white/5 border border-white/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold shrink-0">
          Payment Process:
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          {/* COD */}
          <span className="px-2 py-1 bg-[#1A1A1A] text-[#C7A55B] font-bold text-[10px] tracking-wider border border-[#C7A55B]/40">
            Cash on Delivery (COD)
          </span>
          {/* bKash */}
          <span className="px-2 py-1 bg-[#E2136E] text-white font-bold text-[10px] tracking-wider">
            bKash Advance
          </span>
          {/* Nagad */}
          <span className="px-2 py-1 bg-[#F7931E] text-white font-bold text-[10px] tracking-wider">
            Nagad Advance
          </span>
          {/* Rocket */}
          <span className="px-2 py-1 bg-[#8C3494] text-white font-bold text-[10px] tracking-wider">
            Rocket Advance
          </span>
        </div>
      </div>

    </div>
  );
};
