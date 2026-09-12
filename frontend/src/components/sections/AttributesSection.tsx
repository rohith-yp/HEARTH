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
    <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-amber-700 text-xs font-bold shadow-sm mb-4">
          <Trophy className="w-4 h-4" />
          <span>Balanced Life Growth</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-cinzel">
          Level Up Every Area of Life.
        </h2>
        <p className="text-base text-slate-700 font-medium mt-3 leading-relaxed">
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
            className="glass-panel rounded-2xl p-5 bg-white/70 border-white/90 shadow-md flex flex-col justify-between hover:scale-105 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full">
                  Lvl {attr.level}
                </span>
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{attr.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{attr.xp} Total XP</p>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 mt-4 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min(100, attr.xp % 100)}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
