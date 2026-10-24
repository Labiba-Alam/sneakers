import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { ViewState } from '../../types';

interface PolicyViewProps {
  view: ViewState;
  onClose: () => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ view, onClose }) => {
  if (!['shipping-policy', 'refund-policy', 'terms', 'privacy-policy'].includes(view)) {
    return null;
  }

  const renderContent = () => {
    switch (view) {
      case 'shipping-policy':
        return (
          <div className="space-y-6 text-xs text-white/80 leading-relaxed">
            <div className="p-4 bg-[#C7A55B]/10 border border-[#C7A55B]/30 space-y-1">
              <h4 className="font-bold text-sm text-[#C7A55B] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Nationwide Shipping & Advance Delivery Fee Policy</span>
              </h4>
              <p className="text-[11px] text-white/70">
                Official delivery rates and courier guidelines for KINGSMAN Luxury Sneakers.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">1. Delivery Zones, Fees & Timelines</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px] text-[#C7A55B]">
                    Inside Dhaka City
                  </p>
                  <p className="text-xl font-bold font-mono text-white">৳ 100</p>
                  <p className="text-[11px] text-white/60">
                    Estimated Delivery: <strong>1 to 3 working days</strong>
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px] text-[#C7A55B]">
                    Outside Dhaka (All 63 Districts)
                  </p>
                  <p className="text-xl font-bold font-mono text-white">৳ 160</p>
                  <p className="text-[11px] text-white/60">
                    Estimated Delivery: <strong>2 to 5 working days</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">2. Mandatory Advance Delivery Fee</h5>
              <p>
                To confirm your order and prevent fraudulent bookings, <strong>delivery charges must be paid in advance for both areas (৳100 inside Dhaka / ৳160 outside Dhaka)</strong> via bKash, Nagad, Rocket, or Online Card Gateway.
              </p>
              <p>
                The remaining product balance is payable in cash upon parcel delivery to the courier agent (Cash on Delivery).
              </p>
              <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-white/70">
                <em>Note:</em> Standard delivery rates apply to standard shoebox parcels up to 1 kg. Additional delivery charges may apply for heavier parcels, multiple pairs, or remote perimeter zones.
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">3. Verified Courier Partners</h5>
              <p>
                All orders are dispatched through our contracted logistics partners: <strong>Steadfast Courier</strong> and <strong>Pathao Express</strong>. Customers receive an SMS and live tracking number upon courier handover.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-[11px] text-white/50">
              <p>Dispatched from: House 44, Road 3, Block B, Mirpur 12, Dhaka-1216, Bangladesh (Fulfillment Office).</p>
            </div>
          </div>
        );

      case 'refund-policy':
        return (
          <div className="space-y-6 text-xs text-white/80 leading-relaxed">
            <div className="p-4 bg-[#C1121F]/10 border border-[#C1121F]/30 space-y-1">
              <h4 className="font-bold text-sm text-[#C1121F] uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refund & Return Policy</span>
              </h4>
              <p className="text-[11px] text-white/70">
                Transparent return and defect resolution procedures for our customers.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">1. Reporting Window (Strict 3 Days)</h5>
              <p>
                Any damaged, defective, or incorrect products must be reported to KINGSMAN customer care <strong>within 3 days of delivery</strong>.
              </p>
              <p>
                To initiate a claim, please message our official WhatsApp at <strong>01581054939</strong> or email <strong>kingsmanszn@gmail.com</strong> with:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-white/70">
                <li>Your Order ID (e.g. KNG-2026-XXXX)</li>
                <li>Clear photos and an unboxing video showing the defect, tag, and sole condition</li>
                <li>Contact phone number used during checkout</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">2. Condition for Return & Exchange</h5>
              <p>
                Sneakers must be in unworn, brand-new condition with all original packaging, tags, dust bags, and accessories intact. Returns cannot be accepted if outsoles exhibit outdoor wear or scuff marks.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">3. Refund Processing Timeline</h5>
              <p>
                Once the returned item is received at our Dhaka inspection facility and verified, <strong>eligible refunds are processed within 7 to 10 working days</strong>. Refunds are issued directly to the customer’s original payment method or MFS account (bKash/Nagad/Rocket).
              </p>
              <p className="text-[11px] text-white/60">
                Please note that advance delivery charges incurred for courier dispatch are non-refundable unless the return is due to a verifiable manufacturing defect or an incorrect item sent by KINGSMAN.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6 text-xs text-white/80 leading-relaxed">
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C7A55B]" />
                <span>Terms & Conditions of Sale</span>
              </h4>
              <p className="text-[11px] text-white/70">
                Governing your purchases on the official KINGSMAN e-commerce platform.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">1. Brand & Products</h5>
              <p>
                KINGSMAN is a premium unisex streetwear sneaker brand based in Dhaka, Bangladesh. All products displayed on this store are curated, quality-inspected, and priced in Bangladeshi Taka (BDT).
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">2. Order Placement & Price Integrity</h5>
              <p>
                All orders are subject to stock availability and payment verification. While we make every effort to display accurate size stock, in the rare event of concurrent purchases, orders will be fulfilled in the order received or immediately refunded.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">3. Advance Delivery Fee Requirement</h5>
              <p>
                Customer orders requiring Cash on Delivery must have the mandatory delivery fee (৳100 inside Dhaka or ৳160 outside Dhaka) verified prior to parcel dispatch. Unverified orders will be held for 48 hours before automated cancellation.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">4. Order Cancellation</h5>
              <p>
                Orders may be cancelled free of charge prior to handover to our courier partners (Steadfast or Pathao). Once a tracking number has been generated and the package dispatched, the shipment is subject to our standard return policy.
              </p>
            </div>
          </div>
        );

      case 'privacy-policy':
        return (
          <div className="space-y-6 text-xs text-white/80 leading-relaxed">
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy & Data Protection Policy</span>
              </h4>
              <p className="text-[11px] text-white/70">
                How KINGSMAN collects, uses, and protects your personal shopping data.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">1. Information We Collect</h5>
              <p>
                We collect your full name, shipping address, mobile phone number, and optional email address exclusively to process orders, confirm delivery fees, arrange courier dispatch with Steadfast/Pathao, and provide customer support.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">2. Payment Data Security</h5>
              <p>
                KINGSMAN never asks for or stores account passwords or MFS PINs. The product price is collected strictly in cash upon delivery (COD), while advance delivery charges are transferred directly via customer MFS send-money (bKash / Nagad / Rocket).
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">3. Zero Third-Party Selling</h5>
              <p>
                We do not sell, rent, or trade your personal information to third-party advertisers or data brokers. Information is shared strictly with operational partners (contracted courier services and transactional SMS/email providers).
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'shipping-policy': return 'SHIPPING & DELIVERY POLICY';
      case 'refund-policy': return 'REFUND & RETURN POLICY';
      case 'terms': return 'TERMS & CONDITIONS';
      case 'privacy-policy': return 'PRIVACY & DATA POLICY';
      default: return 'POLICY';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-white/15 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-royal text-lg font-bold text-white tracking-wider">
            {getTitle()}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111111] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};
