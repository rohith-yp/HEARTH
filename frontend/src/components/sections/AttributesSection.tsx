import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Shield, Brain, Heart, Compass } from 'lucide-react';
import { Attribute, UserProfile } from '../../services/api';

interface AttributesSectionProps {
  profile: UserProfile | null;
  attributes: Attribute[];
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({
  profile,
  attributes,
}) => {
  const totalXp = profile?.total_xp || 250;

  return (
    <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-500/20 border border-amber-300/70 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold shadow-sm mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Balanced Life Growth</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-amber-100 font-cinzel drop-shadow-sm">
          Level Up Every Area of Life.
        </h2>
        <p className="text-base text-slate-700 dark:text-amber-100/90 font-medium mt-3 leading-relaxed">
          Categorize your tasks under core life pillars—Focus, Health, Knowledge, Discipline, and Creativity—and watch your character stats grow organically.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {attributes.map((attr, idx) => (
          <motion.div
            key={attr.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="rounded-2xl p-5 bg-white/80 dark:bg-[#18132b]/85 border border-amber-200/60 dark:border-amber-500/20 shadow-sm hover:shadow-md hover:border-amber-500/40 flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-200/50 dark:border-amber-500/30">
                  Lvl {attr.level}
                </span>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-amber-100">{attr.name}</h3>
              <p className="text-xs text-slate-600 dark:text-amber-100/80 font-medium mt-1">{attr.xp} Total XP</p>
            </div>

            <div className="w-full h-2 rounded-full bg-amber-100 dark:bg-[#100c1e] mt-4 overflow-hidden border border-amber-200/40 dark:border-amber-500/20">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-sm"
                style={{ width: `${Math.min(100, attr.xp % 100)}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
