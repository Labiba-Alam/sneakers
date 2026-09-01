import React from 'react';
import { ShieldCheck, Award, Truck, Banknote, RefreshCw } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: '100% Quality Checked',
      subtitle: 'Multi-point inspection',
      color: 'text-[#C7A55B]'
    },
    {
      icon: Award,
      title: 'Curated Imports',
      subtitle: 'Premium sneaker styles',
      color: 'text-[#C1121F]'
    },
    {
      icon: Truck,
      title: 'Fast Nationwide Delivery',
      subtitle: '24-48 hr inside Dhaka',
      color: 'text-[#111111]'
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      subtitle: 'Inspect before payment',
      color: 'text-[#C7A55B]'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      subtitle: '7-day replacement policy',
      color: 'text-[#C1121F]'
    }
  ];

  return (
    <section className="bg-white border-b border-[#111111]/10 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col items-center justify-center p-3 hover:bg-[#F8F8F8] transition-colors rounded-none group">
              <div className="w-10 h-10 rounded-full bg-[#111111]/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h4 className="font-serif-luxury text-xs font-bold uppercase tracking-wider text-[#111111]">
                {item.title}
              </h4>
              <p className="text-[10px] text-[#111111]/60 font-medium tracking-wide mt-0.5">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
