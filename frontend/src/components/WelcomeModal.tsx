import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  X,
  Sparkles,
  Zap,
  Award,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Bell,
  Compass,
  LogOut,
} from 'lucide-react';
import { UserProfile, WickState } from '../services/api';
import { useAuth } from '../services/authContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  wick: WickState | null;
  isSignup?: boolean;
  onOpenDashboard: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  profile,
  wick,
  isSignup = false,
  onOpenDashboard,
}) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const streak = profile?.current_streak ?? 1;
  const xp = profile?.total_xp ?? 250;
  const coins = profile?.coins ?? 45;
  const wickStage = wick?.stage ?? 'Ember';
  const wickEnergy = wick?.energy ?? 85;

  const displayName =
    profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Wanderer';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 max-w-xl w-full relative border border-amber-300/80 dark:border-amber-500/40 shadow-2xl bg-white/95 dark:bg-gradient-to-b dark:from-[#1c152e]/95 dark:via-[#140e24]/95 dark:to-[#0b0817]/95 text-slate-900 dark:text-white my-auto overflow-hidden"
        >
          {/* Ambient Background Aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-amber-500/25 to-ember-600/30 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Bowing Wick Companion & User Greeting */}
          <div className="flex flex-col items-center text-center relative z-10 mb-6">
            {/* Welcoming Animated Wick Doll Container */}
            <div className="relative mb-4">
              {/* Steady Golden Outer Frame */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 shadow-lg flex items-center justify-center relative cursor-pointer overflow-hidden border-2 border-amber-200/90">
                {/* Inner Wick Doll Image (Bows down forward to greet the user) */}
                <motion.img
                  src="/wick-doll.jpg"
                  alt="Wick Welcoming Companion Doll"
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{
                    opacity: 1,
                    y: [0, -3, 14, 14, -2, 0],
                    scaleY: [1.05, 1.05, 0.92, 0.92, 1.08, 1.05],
                    scaleX: [1.05, 1.05, 1.08, 1.08, 1.02, 1.05],
                  }}
                  transition={{
                    duration: 3,
                    times: [0, 0.2, 0.45, 0.7, 0.85, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut',
                  }}
                  className="w-full h-full object-cover object-center rounded-full origin-bottom"
                />
              </div>

              {/* Sparkle Badge */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 p-2 rounded-full shadow-md border border-amber-100">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Bowing Speech Bubble Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300/80 dark:border-amber-500/35 text-amber-900 dark:text-amber-300 text-xs font-bold shadow-md mb-2"
            >
              <motion.span
                animate={{ rotate: [0, -20, -20, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              >
                🙇‍♂️
              </motion.span>
              <span>Wick bows respectfully to welcome <strong className="text-slate-900 dark:text-white font-extrabold">{displayName}</strong>!</span>
            </motion.div>

            {/* Title & Tagline with User Name */}
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-slate-900 dark:text-amber-100 tracking-wide">
              {isSignup ? `Welcome to Hearth, ${displayName}! 🔥` : `Welcome Back, ${displayName}! 🔥`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-amber-300/90 font-medium mt-1 max-w-md">
              {isSignup
                ? `Your ember companion, Wick, has bowed & awakened for ${displayName}! Let us kindle your habits.`
                : `Wick bows in honor of your return, ${displayName}. Here is your current sanctuary status & guidance.`}
            </p>
          </div>

          {/* Current Status Notification Card ("Currently what has happened") */}
          <div className="relative z-10 mb-6 bg-amber-50/80 dark:bg-white/5 border border-amber-300/80 dark:border-amber-500/25 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 text-amber-800 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Current Status & Activity Log</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-amber-100/90 dark:bg-amber-500/10 border border-amber-300/60 dark:border-amber-500/20">
                <div className="flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 font-extrabold text-lg">
                  <Zap className="w-4 h-4 fill-amber-500" />
                  <span>{streak}d</span>
                </div>
                <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mt-0.5">
                  Daily Streak
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-100/90 dark:bg-amber-500/10 border border-amber-300/60 dark:border-amber-500/20">
                <div className="flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 font-extrabold text-lg">
                  <Award className="w-4 h-4" />
                  <span>{xp}</span>
                </div>
                <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mt-0.5">
                  Total XP
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-100/90 dark:bg-amber-500/10 border border-amber-300/60 dark:border-amber-500/20">
                <div className="flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 font-extrabold text-lg">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  <span>{wickEnergy}%</span>
                </div>
                <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mt-0.5">
                  {wickStage} Energy
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-300/60 dark:border-amber-500/20 text-xs text-slate-800 dark:text-amber-200/90 font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                {isSignup
                  ? 'Account activated successfully! Your starter quests and Wick AI connection are ready.'
                  : `Your ${streak}-day habit streak is active. Coins earned: ${coins} ✨`}
              </span>
            </div>
          </div>

          {/* Knowledge & Guidance Section ("What he should do next") */}
          <div className="relative z-10 mb-6 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>What You Should Do Next:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-700/60 hover:border-amber-500/50 transition-colors flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1. Complete Quests</h4>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    Check off daily tasks to grant Wick energy & earn XP.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-700/60 hover:border-amber-500/50 transition-colors flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2. Chat with Wick AI</h4>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    Get coaching, reflect on your goals, & record memories.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenDashboard();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-ember-600 via-amber-500 to-amber-400 hover:from-ember-500 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-sm transition-colors"
            >
              Got It
            </button>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              title="Log Out & Switch Account"
              className="py-3 px-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
