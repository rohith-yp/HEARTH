import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Flame, Coins, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../services/authContext';
import { UserProfile } from '../services/api';

interface HeaderProps {
  profile: UserProfile | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenAuth }) => {
  const { theme, toggleTheme, logout, isAuthenticated, user } = useAuth();

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Seeker';

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-2xl px-6 py-3 transition-colors duration-500">
        {/* Brand Logo & Greeting */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ember-600 to-amber-400 flex items-center justify-center shadow-lg shadow-ember-500/30">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-slate-900 dark:text-white font-cinzel">
                HEARTH
              </h1>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Life RPG Companion
              </p>
            </div>
          </div>

          <div className="hidden md:block h-8 w-[1px] bg-slate-300 dark:bg-white/10 mx-2" />

          <div className="hidden md:block">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {getTimeOfDayGreeting()}, <span className="text-ember-500 font-bold">{displayName}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Wick is watching over your hearth
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Streak & Coins Badges */}
          {profile && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold">
                <Flame className="w-4 h-4 text-ember-500" />
                <span>{profile.current_streak}d Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm font-semibold">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span>{profile.coins}</span>
              </div>
            </div>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-200 hover:text-ember-500 hover:border-ember-500/40 transition-all duration-300 relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 0 : 180 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-amber-300" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
            </motion.div>
          </button>

          {/* Auth Button / User Profile Menu */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              title="Logout"
              className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 transition-all duration-300 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ember-600 to-amber-500 hover:from-ember-500 hover:to-amber-400 text-white font-semibold shadow-lg shadow-ember-500/25 transition-all duration-300 text-xs sm:text-sm"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
