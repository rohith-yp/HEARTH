import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Zap, Heart } from 'lucide-react';
import { WickState } from '../../services/api';

interface WickShowcaseSectionProps {
  wick: WickState | null;
}

const STAGES_LIST = [
  { name: 'Spark', xp: '0 XP', desc: 'A tiny gentle ember waiting to be kindled.' },
  { name: 'Ember', xp: '100 XP', desc: 'Warm glow taking shape beside your daily habits.' },
  { name: 'Flame', xp: '300 XP', desc: 'Strong confident companion radiating motivation.' },
  { name: 'Blaze', xp: '700 XP', desc: 'Vibrant powerhouse celebrating your milestones.' },
  { name: 'Hearthkeeper', xp: '1500 XP', desc: 'Ultimate evolved guardian of your hearth.' },
];

export const WickShowcaseSection: React.FC<WickShowcaseSectionProps> = ({ wick }) => {
  const currentStage = wick?.stage || 'Ember';

  return (
    <section id="journey" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-ember-600 text-xs font-bold shadow-sm mb-4">
          <Flame className="w-4 h-4" />
          <span>Meet Your Companion</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-cinzel">
          Wick Grows As You Grow.
        </h2>
        <p className="text-base text-slate-700 font-medium mt-3 leading-relaxed">
          Wick is not a static chatbot. Wick is a living ember being whose energy, mood, and stage respond directly to your real productivity and daily habits.
        </p>
      </motion.div>

      {/* Stage Evolution Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAGES_LIST.map((stage, idx) => {
          const isCurrent = stage.name.toLowerCase() === currentStage.toLowerCase();
          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass-panel rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-2 border-ember-500 bg-white/90 shadow-xl shadow-ember-500/20 scale-105'
                  : 'bg-white/60 border-white/80 hover:bg-white/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isCurrent ? 'bg-ember-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stage.xp}
                  </span>
                  {isCurrent && (
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-cinzel">
                  {stage.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {isCurrent && (
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-bold text-ember-600 flex items-center justify-between">
                  <span>Current Stage</span>
                  <span>Energy: {wick?.energy ?? 85}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
