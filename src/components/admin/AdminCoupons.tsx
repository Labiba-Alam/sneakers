import React, { useState } from 'react';
import { Ticket, Plus, Copy, Trash2, CheckCircle2, Clock, Percent, DollarSign, Truck } from 'lucide-react';
import { Coupon } from '../../types';

interface AdminCouponsProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  isCreateModalOpenFromParent?: boolean;
  onCloseCreateModalFromParent?: () => void;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  isCreateModalOpenFromParent,
  onCloseCreateModalFromParent
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isCreateModalOpenFromParent || false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  React.useEffect(() => {
    if (isCreateModalOpenFromParent) {
      setIsModalOpen(true);
    }
  }, [isCreateModalOpenFromParent]);

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: 'ROYAL20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 250,
    description: '20% Royal privileges discount for orders above $250',
    isActive: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code?.trim()) return;

    const newCoupon: Coupon = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType as any || 'percentage',
      discountValue: Number(formData.discountValue) || 10,
      minSpend: Number(formData.minSpend) || 0,
      description: formData.description || 'Exclusive discount coupon',
      isActive: formData.isActive ?? true
    };

    onAddCoupon(newCoupon);
    setIsModalOpen(false);
    if (onCloseCreateModalFromParent) onCloseCreateModalFromParent();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            PROMOTIONS & COUPON ENGINE
          </h1>
          <p className="text-xs text-white/60">
            Create percentage discounts, fixed reductions & free shipping promotions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C1121F] text-white text-xs uppercase font-bold tracking-wider rounded shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="bg-[#141414] border border-white/10 rounded-lg p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded bg-[#C7A55B]/20 text-[#C7A55B]">
                    {coupon.discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                  </span>
                  <div>
                    <h3 className="font-mono font-bold text-lg text-[#C7A55B]">{coupon.code}</h3>
                    <p className="text-[10px] text-white/50">{coupon.description}</p>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${coupon.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {coupon.isActive ? 'Active' : 'Expired'}
                </span>
              </div>

              <div className="p-3 bg-[#181818] rounded font-mono text-xs space-y-1">
                <p className="text-white">Discount: <strong className="text-emerald-400">{coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}</strong></p>
                <p className="text-white/60">Minimum Spend: ${coupon.minSpend}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <button
                onClick={() => copyCode(coupon.code)}
                className="flex items-center gap-1.5 text-[#C7A55B] hover:underline font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => onDeleteCoupon(coupon.code)}
                className="text-red-400 hover:text-red-300 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-[#C7A55B]/40 p-6 rounded-lg text-white">
            <h2 className="font-serif-luxury text-lg font-bold mb-4">CREATE PROMO COUPON</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
                  placeholder="KINGSMAN25"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Min Order Spend ($)</label>
                <input
                  type="number"
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono rounded"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/10 text-white font-bold rounded">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#C1121F] text-white font-bold rounded">
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
