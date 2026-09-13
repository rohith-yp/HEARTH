import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Trophy, ArrowRight, Award } from 'lucide-react';
import { getStageInfo, StageDefinition } from '../services/wickEvolution';

interface WickEvolutionModalProps {
  isOpen: boolean;
  oldStage: string;
  newStage: string;
  onClose: () => void;
}

export const WickEvolutionModal: React.FC<WickEvolutionModalProps> = ({
  isOpen,
  oldStage,
  newStage,
  onClose,
}) => {
  const [phase, setPhase] = useState<'darken' | 'flare' | 'reveal'>('darken');

  const oldStageInfo = getStageInfo(oldStage);
  const newStageInfo = getStageInfo(newStage);

  useEffect(() => {
    if (!isOpen) return;

    setPhase('darken');

    // Sequence timer: darken -> flare -> reveal
    const t1 = setTimeout(() => setPhase('flare'), 700);
    const t2 = setTimeout(() => setPhase('reveal'), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen, oldStage, newStage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-auto">
        {/* Darkened Portal Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'flare' ? 0.95 : 0.88 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl"
          onClick={phase === 'reveal' ? onClose : undefined}
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-lg w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#1c152e] via-[#140e24] to-[#0c0917] border border-amber-500/40 shadow-2xl text-center z-10 overflow-hidden"
        >
          {/* Ambient Warm Sparkle Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: phase === 'flare' ? [1, 1.4, 1.2] : [1, 1.1, 1],
                opacity: phase === 'flare' ? [0.4, 0.9, 0.6] : 0.3,
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: phase === 'flare' ? [1, 1.5, 1.1] : [1, 1.2, 1],
                opacity: phase === 'flare' ? [0.4, 0.9, 0.5] : 0.3,
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"
            />
          </div>

          {/* Header Evolution Banner */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Evolution Unlocked</span>
          </motion.div>

          {/* Character Stage Transition Container */}
          <div className="relative my-4 flex items-center justify-center min-h-[160px]">
            <AnimatePresence mode="wait">
              {phase === 'darken' && (
                <motion.div
                  key="old"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-amber-500/30 bg-slate-900 overflow-hidden shadow-lg">
                    <img
                      src="/wick-doll.jpg"
                      alt={oldStageInfo.name}
                      className="w-full h-full object-cover rounded-full filter brightness-75"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Previous Stage: {oldStageInfo.name}
                  </span>
                </motion.div>
              )}

              {phase === 'flare' && (
                <motion.div
                  key="flare"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: [0.8, 1.25, 1.1] }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center justify-center relative"
                >
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 flex items-center justify-center shadow-2xl animate-pulse">
                    <Flame className="w-14 h-14 text-white animate-spin" />
                  </div>
                  <p className="text-xs font-bold text-amber-300 tracking-wider uppercase mt-3">
                    Wick is Evolving...
                  </p>
                </motion.div>
              )}

              {phase === 'reveal' && (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-300 border-2 border-amber-300 shadow-xl overflow-hidden relative group">
                    <img
                      src="/wick-doll.jpg"
                      alt={newStageInfo.name}
                      className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
                    {newStageInfo.badgeText}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === 'reveal' ? 1 : 0.6, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
              Wick Evolved into {newStageInfo.name}!
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-2 leading-relaxed max-w-sm mx-auto">
              &ldquo;{newStageInfo.feeling}&rdquo;
            </p>
          </motion.div>

          {/* CTA Action Button */}
          <div className="mt-8 pt-4 border-t border-amber-500/20">
            <button
              onClick={onClose}
              disabled={phase !== 'reveal'}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Celebrate & Continue Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
