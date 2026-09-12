import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Zap, Flame } from 'lucide-react';
import { UserProfile, Attribute } from '../services/api';

interface XpGrowthPanelProps {
  profile: UserProfile | null;
  attributes: Attribute[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const STAGE_XP_MAP: Record<string, number> = {
  Spark: 100,
  Ember: 300,
  Flame: 700,
  Blaze: 1500,
  Hearthkeeper: 3000,
};

export const XpGrowthPanel: React.FC<XpGrowthPanelProps> = ({
  profile,
  attributes,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4 pointer-events-auto min-h-[320px]">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 rounded-lg skeleton-shimmer" />
          <div className="h-6 w-16 rounded-lg skeleton-shimmer" />
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="w-36 h-36 rounded-full skeleton-shimmer" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full rounded-md skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center pointer-events-auto min-h-[320px]">
        <p className="text-sm text-rose-400 font-medium mb-3">Failed to load XP & Growth</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-all text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const totalXp = profile?.total_xp || 0;

  // Calculate current stage and target XP
  let currentStage = 'Spark';
  let targetXp = 100;
  let prevStageXp = 0;

  if (totalXp >= 1500) {
    currentStage = 'Hearthkeeper';
    targetXp = 3000;
    prevStageXp = 1500;
  } else if (totalXp >= 700) {
    currentStage = 'Blaze';
    targetXp = 1500;
    prevStageXp = 700;
  } else if (totalXp >= 300) {
    currentStage = 'Flame';
    targetXp = 700;
    prevStageXp = 300;
  } else if (totalXp >= 100) {
    currentStage = 'Ember';
    targetXp = 300;
    prevStageXp = 100;
  }

  const stageProgress = Math.min(
    100,
    Math.max(0, ((totalXp - prevStageXp) / (targetXp - prevStageXp)) * 100)
  );

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stageProgress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel rounded-3xl p-6 pointer-events-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-cinzel">
            Growth & XP
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ember-500/10 text-ember-500 border border-ember-500/20">
          Level {Math.floor(totalXp / 100) + 1}
        </span>
      </div>

      {/* Circular Progress Ring */}
      <div className="flex flex-col items-center justify-center relative py-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-ember-500"
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span
              key={totalXp}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-extrabold text-slate-900 dark:text-white"
            >
              {totalXp}
            </motion.span>
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
              Total XP
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {Math.round(targetXp - totalXp)} XP until next evolution
        </p>
      </div>

      {/* Attributes Bar Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Life Attributes</span>
          <span>Level & XP</span>
        </div>

        {attributes.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-2">
            No attributes unlocked yet
          </p>
        ) : (
          attributes.map((attr) => {
            const attrLevelProgress = (attr.xp % 100);
            return (
              <div key={attr.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {attr.name}
                  </span>
                  <span className="text-amber-500 font-bold text-[11px]">
                    Lvl {attr.level} ({attr.xp} XP)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-ember-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, attrLevelProgress)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
