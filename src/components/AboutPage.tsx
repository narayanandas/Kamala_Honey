import React from 'react';
import { Leaf, Award, Compass, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  const values = [
    {
      title: 'Biodiverse Harvesting',
      description: 'Extracted strictly during specific floral seasons near Western Ghats borders to capture unique medicinal properties.',
      icon: Leaf
    },
    {
      title: 'Zero Heat Filtration',
      description: 'Filtration is carried out purely via gravitational sifting, keeping vital pollen grains, royal jelly, and propolis in the jar.',
      icon: Compass
    },
    {
      title: 'Ethical Beekeeping',
      description: 'We prioritize bee colony health. No synthetic feeds, chemical miticides, or pesticide treatments are used in our apiaries.',
      icon: HeartHandshake
    },
    {
      title: 'Chemical Free Guarantee',
      description: 'Every batch undergoes local quality validation to check moisture content, ensuring absolutely zero sugar syrup dilution.',
      icon: Award
    }
  ];

  return (
    <div className="py-12 bg-white dark:bg-charcoal/30">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-16">
        
        {/* Head Block with modern design details */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs text-forest-green font-bold uppercase tracking-widest">Our Agricultural Origin Story</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-honey-brown dark:text-white font-heading">
            Traditional Honey Cultivation in Thirunelveli
          </h2>
          <p className="text-sm text-honey-brown/70 dark:text-honey-warm/70 leading-relaxed font-sans">
            Kamala Natural Honey Farm was founded with a single, unyielding mission: to rescue raw honey from commercial processing and mass commercial pasteurization, bringing pure Western Ghats medicinal honey directly to kitchens.
          </p>
        </div>

        {/* Visual Showcase bento blocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 overflow-hidden rounded-3xl border border-honey-brown/5 relative group">
            <img
              src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800"
              alt="Kamala Farm Apiary combs"
              className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-honey-gold text-honey-brown px-2 py-0.5 rounded">Our Pristine Hives</span>
              <p className="text-sm font-bold">Western Ghats Forests Border Hives</p>
            </div>
          </div>

          <div className="md:col-span-6 space-y-6">
            <h3 className="text-xl font-bold text-honey-brown dark:text-white font-heading">
              Preserving the Natural Heritage of Tamil Nadu Honey
            </h3>
            
            <p className="text-xs text-honey-brown/80 dark:text-honey-warm/80 leading-relaxed font-sans">
              Most store-bought honey is heavily pasteurized at 160°F to stay perfectly clear, but this destroys its living enzymes, natural antibiotic qualities, and floral pollens. At Kamala Farm, we harvest our honey at room temperature and run a clean gravitational sifting method to preserve the raw integrity of nature.
            </p>

            <p className="text-xs text-honey-brown/80 dark:text-honey-warm/80 leading-relaxed font-sans">
              Our bee colonies feed only on seasonal forest flowers, producing distinct blends like **Theen Nelli (Honey Amla)**, **Theen Inji (Honey Ginger)**, and seed-rich immunity formulations. Sourced locally, processed ethically, and delivered safely.
            </p>

            <div className="border-t border-honey-brown/15 pt-6 grid grid-cols-2 gap-4">
              <div>
                <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono">14+</span>
                <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/50 font-semibold tracking-wider uppercase">Local Farm Partners</p>
              </div>
              <div>
                <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono">100% PURE</span>
                <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/50 font-semibold tracking-wider uppercase flex items-center gap-1">No Added Sugar Syrup</p>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Standard Core Values Cards list */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-lg font-black text-honey-brown dark:text-white uppercase tracking-wider">
              Our Uncompromised Production Values
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div
                  key={i}
                  className="p-6 bg-honey-warm/15 dark:bg-charcoal/50 border border-honey-brown/5 rounded-2xl flex flex-col items-center text-center space-y-3"
                >
                  <div className="p-3 bg-honey-gold/20 text-honey-brown rounded-xl">
                    <IconComp size={20} />
                  </div>
                  <h4 className="text-sm font-black text-honey-brown dark:text-white">{v.title}</h4>
                  <p className="text-[11px] text-honey-brown/70 dark:text-honey-warm/75 leading-relaxed font-sans">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traditional Farm Certification Call */}
        <div className="bg-forest-green/10 dark:bg-forest-green/5 border border-forest-green/20 p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 max-w-2xl text-center sm:text-left">
            <h4 className="text-sm font-black text-forest-green uppercase tracking-wide">Are you in Tirunelveli?</h4>
            <p className="text-xs text-honey-brown/80 dark:text-honey-warm/80 leading-relaxed font-sans">
              Come visit our physical processing farm in Thirunelveli! We conduct weekly live comb extraction workshops for children, teaching the delicate art of apiculture and organic bee protection.
            </p>
          </div>
          <a
            href="https://wa.me/917708510872"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 bg-forest-green text-white font-black uppercase text-xs tracking-wider rounded-xl hover:bg-emerald-800 transition-colors shrink-0"
          >
            Locate Bee Farm (WA) 📍
          </a>
        </div>

      </div>
    </div>
  );
};
