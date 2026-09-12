import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  onStartJourney: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartJourney }) => {
  return (
    <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-panel rounded-3xl p-10 sm:p-16 bg-white/80 border-white/95 shadow-2xl relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-ember-500 flex items-center justify-center shadow-xl shadow-ember-500/30 mx-auto mb-6">
          <Flame className="w-9 h-9 text-white animate-pulse" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-cinzel max-w-2xl mx-auto leading-tight">
          Kindle Your Hearth Today.
        </h2>
        <p className="text-base text-slate-700 font-medium mt-4 max-w-xl mx-auto leading-relaxed">
          Join thousands who are building habits, leveling up their life attributes, and growing alongside their living companion.
        </p>

        <button
          onClick={onStartJourney}
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-slate-950/20 transition-all hover:scale-105"
        >
          <span>Start Your Journey</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
};
