import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, RotateCcw, Lock, Sparkles, Trophy } from 'lucide-react';
import { WickState, UserProfile } from '../../services/api';
import { WICK_STAGES, getStageInfo, getStageProgress } from '../../services/wickEvolution';

interface WickShowcaseSectionProps {
  wick?: WickState | null;
  profile?: UserProfile | null;
}

export const WickShowcaseSection: React.FC<WickShowcaseSectionProps> = ({
  wick,
  profile,
}) => {
  const currentStageName = wick?.stage || 'Ember';
  const totalXp = profile?.total_xp ?? 250;

  const [selectedStageName, setSelectedStageName] = useState<string | null>(null);
  const autoReturnTimer = useRef<NodeJS.Timeout | null>(null);

  const activeStageName = selectedStageName || currentStageName;
  const activeStageInfo = getStageInfo(activeStageName);
  const progressInfo = getStageProgress(totalXp, currentStageName);

  const handleSelectStage = (stageName: string) => {
    if (autoReturnTimer.current) clearTimeout(autoReturnTimer.current);

    if (stageName.toLowerCase() === currentStageName.toLowerCase()) {
      setSelectedStageName(null);
      return;
    }

    setSelectedStageName(stageName);

    // Automatically return to user's active stage after 5 seconds
    autoReturnTimer.current = setTimeout(() => {
      setSelectedStageName(null);
    }, 5000);
  };

  const handleResetToCurrent = () => {
    if (autoReturnTimer.current) clearTimeout(autoReturnTimer.current);
    setSelectedStageName(null);
  };

  useEffect(() => {
    return () => {
      if (autoReturnTimer.current) clearTimeout(autoReturnTimer.current);
    };
  }, []);

  return (
    <section id="journey" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      {/* Header Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-500/20 border border-amber-300/70 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold shadow-sm mb-4">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Wick Five-Stage Evolution</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-amber-100 font-cinzel drop-shadow-sm">
          Wick Grows As You Grow.
        </h2>
        <p className="text-base text-slate-700 dark:text-amber-100/90 font-medium mt-3 leading-relaxed">
          Every completed habit awards XP and elevates Wick through 5 distinct evolution forms—from a fragile Spark to the ultimate Hearthkeeper.
        </p>
      </motion.div>

      {/* Real XP Progression Indicator Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto mb-10 p-4 rounded-2xl bg-white/80 dark:bg-[#18132b]/85 border border-amber-200/60 dark:border-amber-500/30 shadow-md backdrop-blur-md"
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-amber-100 mb-2">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Active Stage: <strong>{progressInfo.currentStage.name}</strong></span>
          </span>
          <span className="text-amber-600 dark:text-amber-300 font-extrabold">
            {totalXp} Total XP
          </span>
        </div>

        {/* Progress Bar Fill */}
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-amber-300/40 dark:border-amber-500/20 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressInfo.progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-amber-200/80 mt-2">
          <span>{progressInfo.progressPercent}% Progress</span>
          {progressInfo.isMaxStage ? (
            <span className="text-amber-400 font-bold">★ Highest Form Achieved!</span>
          ) : (
            <span>
              {progressInfo.remainingXp} XP until <strong>{progressInfo.nextStage?.name}</strong> ({progressInfo.nextStage?.requiredXp} XP)
            </span>
          )}
        </div>
      </motion.div>

      {/* Featured Evolved Wick Companion Display */}
      <div className="relative my-8 max-w-md mx-auto">
        <motion.div
          key={activeStageInfo.name}
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative p-2.5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-md overflow-hidden"
        >
          <div className="relative rounded-2xl overflow-hidden aspect-square border border-amber-500/20 shadow-lg bg-slate-950">
            {/* Base Image with Stage Scale Parameterization */}
            <motion.img
              src="/wick-doll.jpg"
              alt={`Wick ${activeStageInfo.name} Form`}
              animate={{
                scale: activeStageInfo.scale,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full object-cover object-center"
            />

            {/* Stage Overlay Details */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-between p-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${activeStageInfo.badgeBg} shadow-sm border border-white/20`}>
                  {activeStageInfo.badgeText}
                </span>

                {selectedStageName && (
                  <button
                    onClick={handleResetToCurrent}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Active Stage ({currentStageName})</span>
                  </button>
                )}
              </div>

              {/* Stage Description & Feeling */}
              <div className="text-left text-white">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-0.5">
                  ★ {activeStageInfo.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
                  Wick ({activeStageInfo.name})
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/90 font-medium mt-1 leading-relaxed">
                  {activeStageInfo.description}
                </p>
                <p className="text-[11px] text-amber-300/80 italic mt-1 font-semibold">
                  &ldquo;{activeStageInfo.feeling}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive 5-Stage Selection Grid (Spark, Ember, Flame, Blaze, Hearthkeeper) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
        {WICK_STAGES.map((stage, idx) => {
          const isActualCurrent = stage.name.toLowerCase() === currentStageName.toLowerCase();
          const isSelected = stage.name.toLowerCase() === activeStageName.toLowerCase();
          const isUnlocked = totalXp >= stage.requiredXp;

          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleSelectStage(stage.name)}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer backdrop-blur-md relative overflow-hidden ${
                isSelected
                  ? 'border-2 border-amber-500 bg-white/95 dark:bg-[#1f1935] shadow-lg scale-[1.02]'
                  : isUnlocked
                  ? 'bg-white/80 dark:bg-[#161226]/85 border border-amber-200/80 dark:border-amber-500/20 shadow-sm hover:bg-white dark:hover:bg-[#1c1630] hover:border-amber-500/40 hover:shadow-md'
                  : 'bg-amber-100/40 dark:bg-slate-900/60 border border-amber-300/40 dark:border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header Badge & Lock Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isActualCurrent
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                        : isUnlocked
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {stage.requiredXp} XP
                  </span>

                  {isActualCurrent ? (
                    <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  ) : isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-amber-100 font-cinzel">
                  {stage.name}
                </h3>
                <p className="text-xs text-slate-700 dark:text-amber-100/80 font-medium mt-2 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-500/20 text-[11px] font-bold flex items-center justify-between">
                {isActualCurrent ? (
                  <span className="text-amber-600 dark:text-amber-300">Active Stage</span>
                ) : isUnlocked ? (
                  <span className="text-emerald-700 dark:text-emerald-400">Unlocked</span>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400">
                    Requires {stage.requiredXp - totalXp} more XP
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
