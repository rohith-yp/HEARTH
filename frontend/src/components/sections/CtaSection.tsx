import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, LayoutDashboard } from 'lucide-react';

interface CtaSectionProps {
  onStartJourney: () => void;
  isAuthenticated: boolean;
  onOpenDashboard?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  onStartJourney,
  isAuthenticated,
  onOpenDashboard,
}) => {
  return (
    <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-10 sm:p-16 bg-gradient-to-br from-white/95 via-amber-50/90 to-amber-100/70 dark:from-[#1d1733]/95 dark:via-[#161226]/90 dark:to-[#231a3d]/90 border border-amber-300/70 dark:border-amber-500/30 shadow-md hover:shadow-lg backdrop-blur-md relative overflow-hidden transition-all duration-300"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md mx-auto mb-6">
          <Flame className="w-9 h-9 text-slate-950" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-amber-100 font-cinzel max-w-2xl mx-auto leading-tight drop-shadow-sm">
          {isAuthenticated ? 'Welcome Back to Your Sanctuary.' : 'Kindle Your Hearth Today.'}
        </h2>
        <p className="text-base text-slate-700 dark:text-amber-100/90 font-medium mt-4 max-w-xl mx-auto leading-relaxed">
          {isAuthenticated
            ? 'Continue your daily habits, check on Wick’s energy, level up your life attributes, and track your RPG progression.'
            : 'Join thousands who are building habits, leveling up their life attributes, and growing alongside their living companion.'}
        </p>

        <button
          onClick={isAuthenticated ? (onOpenDashboard || onStartJourney) : onStartJourney}
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-extrabold text-sm sm:text-base shadow-md transition-all hover:scale-[1.02]"
        >
          {isAuthenticated ? (
            <>
              <LayoutDashboard className="w-5 h-5" />
              <span>Open Sanctuary Dashboard</span>
            </>
          ) : (
            <>
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </section>
  );
};
