import React from 'react';
import { ShieldCheck, Leaf, Sprout, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export const Features: React.FC = () => {
  const cards = [
    {
      title: '100% Natural',
      description: 'Extracted raw from real hives near Western Ghats forests.',
      icon: Leaf,
      color: 'bg-[#FFF8E7] text-[#D4A017] dark:bg-honey-gold/15 dark:text-honey-gold'
    },
    {
      title: 'No Preservatives',
      description: 'Zero added sugar, colors or artificial chemical stabilizers.',
      icon: ShieldCheck,
      color: 'bg-[#FFF8E7] text-[#D4A017] dark:bg-honey-gold/15 dark:text-honey-gold'
    },
    {
      title: 'Farm Fresh',
      description: 'Directly sourced, curated and packed at our Thirunelveli farm.',
      icon: Sprout,
      color: 'bg-[#FFF8E7] text-[#D4A017] dark:bg-honey-gold/15 dark:text-honey-gold'
    },
    {
      title: 'Fast Delivery',
      description: 'Safely packed in high-quality jars, shipped immediately at your gate.',
      icon: Truck,
      color: 'bg-[#FFF8E7] text-[#D4A017] dark:bg-honey-gold/15 dark:text-honey-gold'
    }
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <section className="py-12 bg-white dark:bg-charcoal/40 border-y border-honey-brown/5 dark:border-honey-gold/10">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs text-forest-green font-bold uppercase tracking-widest">Our Unbending Quality Standard</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-honey-brown dark:text-white font-heading mt-1">
            Pure Honey, Hand-Processed for High Nutrition
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-honey-brown/5 bg-honey-warm/20 dark:bg-charcoal/50 dark:border-honey-gold/5 hover:border-honey-gold/40 hover:bg-white dark:hover:bg-charcoal dark:hover:border-honey-gold/20 transition-all duration-300 group"
              >
                <div className={`p-4 rounded-xl ${card.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-lg font-bold text-honey-brown dark:text-white font-heading">
                  {card.title}
                </h3>
                <p className="text-xs text-honey-brown/70 dark:text-honey-warm/70 mt-2 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
