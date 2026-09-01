import React from 'react';
import { Crown, Gem, ShieldCheck, HeartHandshake, Sparkles, Award } from 'lucide-react';

export const WhyKingsman: React.FC = () => {
  const PILLARS = [
    {
      icon: Crown,
      title: 'CURATED EXCELLENCE',
      desc: 'Carefully selected international sneaker silhouettes bringing world-class street luxury to Bangladesh.'
    },
    {
      icon: Gem,
      title: 'GOLD-TONE HARDWARE',
      desc: 'Custom-cast metallic lace aglets and heel crests finished in polished gold tone that resists tarnishing.'
    },
    {
      icon: ShieldCheck,
      title: 'QUALITY INSPECTION',
      desc: 'Every single pair is hand-checked for stitch integrity, shape, and finish before it ships to you.'
    },
    {
      icon: HeartHandshake,
      title: 'ALL-DAY COMFORT',
      desc: 'Anatomical memory foam sockliners with soft inner lining that molds smoothly to your footprint.'
    },
    {
      icon: Sparkles,
      title: 'DURABLE OUTSOLES',
      desc: 'High-durability rubber outsoles providing superior urban traction, grip, and lasting wear.'
    },
    {
      icon: Award,
      title: 'INDIVIDUAL SERIALIZATION',
      desc: 'Every pair features a unique serial identifier on the inner tongue tag, certifying authentic delivery.'
    }
  ];

  return (
    <section className="py-24 bg-[#F8F8F8] text-[#111111] border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C1121F] mb-2">
            THE KINGSMAN PROMISE
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111] mb-4">
            WHY KINGSMAN
          </h2>
          <p className="text-[#111111]/70 text-sm font-normal">
            An uncompromising standard of luxury where every seam, accent, and texture has a mathematical purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white border border-[#111111]/10 hover:border-[#C1121F] p-8 space-y-4 transition-all duration-300 group shadow-sm hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-[#111111] border border-[#C7A55B]/40 text-[#C7A55B] flex items-center justify-center group-hover:bg-[#C1121F] group-hover:border-[#C1121F] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#111111]/70 font-normal leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
