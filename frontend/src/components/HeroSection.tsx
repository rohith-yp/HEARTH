import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, MousePointer } from 'lucide-react';

interface HeroSectionProps {
  onStartJourney: () => void;
  onWatchDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartJourney,
  onWatchDemo,
}) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 lg:px-16 pt-32 pb-12 pointer-events-auto">
      {/* Hero Copy (Left-Aligned) */}
      <div className="max-w-xl my-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] font-sans tracking-tight"
        >
          A Healthier <br />
          Happier You <br />
          <span className="text-slate-950 font-bold">Starts Here.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg text-slate-700 font-medium mt-6 leading-relaxed max-w-lg"
        >
          Turn your everyday actions into a meaningful journey. Build better habits,
          grow with your companion, and become the best version of yourself.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-4 mt-8"
        >
          {/* Primary CTA */}
          <button
            onClick={onStartJourney}
            className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold shadow-xl shadow-slate-950/10 transition-all hover:scale-105"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onWatchDemo}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/40 hover:bg-white/60 text-slate-900 font-bold backdrop-blur-md border border-white/60 transition-all hover:scale-105"
          >
            <span>Watch Demo</span>
            <div className="w-5 h-5 rounded-full bg-slate-900/10 flex items-center justify-center">
              <Play className="w-3 h-3 text-slate-900 fill-slate-900 translate-x-0.5" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Footer Quote (Left) & Scroll Indicator (Right) */}
      <div className="flex items-end justify-between w-full mt-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-sm"
        >
          <p className="text-xs italic font-semibold text-slate-800">
            "Progress feels different when you're not alone."
          </p>
          <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5 block">
            — HEARTH
          </span>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-800"
        >
          <MousePointer className="w-4 h-4 text-slate-900 animate-bounce" />
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};
