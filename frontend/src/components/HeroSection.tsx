import React from 'react';
import { motion } from 'framer-motion';
import { Flame, User, ArrowRight, Play, Mouse, Sun, Moon } from 'lucide-react';
import { AmbientMotionOverlay } from './scene/AmbientMotionOverlay';
import { useAuth } from '../services/authContext';

interface HeroSectionProps {
  onStartJourney: () => void;
  onWatchDemo: () => void;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
  onNavigate: (sectionId: string) => void;
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartJourney,
  onWatchDemo,
  onOpenDashboard,
  onOpenAuth,
  onNavigate,
  isAuthenticated,
}) => {
  const { theme, toggleTheme } = useAuth();
  const isNightMode = theme === 'dark';

  return (
    <section id="home" className="relative w-full h-screen min-h-[680px] overflow-hidden select-none bg-slate-950">
      {/* 1. Background Pixel Art Layers with Day/Night Crossfade */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        {/* Day Background */}
        <motion.img
          src="/hero-bg-clean.png"
          alt="HEARTH Day Pixel World"
          className="absolute inset-0 w-full h-full object-cover object-[82%_center] sm:object-center"
          initial={false}
          animate={{ opacity: isNightMode ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Night Background */}
        <motion.img
          src="/hero-bg-night-clean.png"
          alt="HEARTH Night Pixel World"
          className="absolute inset-0 w-full h-full object-cover object-[82%_center] sm:object-center"
          initial={false}
          animate={{ opacity: isNightMode ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>

      {/* 2. Ambient Particles & Motion Overlays (Leaves for Day, Shooting Stars for Night) */}
      <AmbientMotionOverlay isNightMode={isNightMode} />

      {/* Subtle Sky Vignette for Enhanced Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-950/50 via-sky-950/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-sky-950/20 pointer-events-none" />

      {/* 3. Real Interactive Header (Clean & Borderless, No Gray Background Box) */}
      <header className="relative z-30 w-full px-4 sm:px-6 lg:px-14 py-3.5 sm:py-5 flex items-center justify-between pointer-events-auto">
        {/* Brand Logo */}
        <motion.div
          onClick={() => onNavigate('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-md border border-white/30 group-hover:rotate-6 transition-transform duration-300 flex-shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-[0.18em] text-white font-cinzel drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              HEARTH
            </span>
            <span className="text-[9px] sm:text-[10px] text-sky-100 font-semibold tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] uppercase">
              Life RPG Companion
            </span>
          </div>
        </motion.div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {[
            { id: 'home', label: 'Home' },
            { id: 'features', label: 'Features' },
            { id: 'journey', label: 'Journey' },
            { id: 'about', label: 'About' },
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ y: -2, color: '#fef08a' }}
              whileTap={{ scale: 0.95 }}
              className="relative py-1 transition-colors hover:text-amber-200"
            >
              {item.label}
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-300 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                layoutId="navUnderline"
              />
            </motion.button>
          ))}
        </nav>

        {/* Right Header Controls: Theme Toggle & Auth Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Theme View Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            title={isNightMode ? 'Switch to Day View' : 'Switch to Night View'}
          >
            {isNightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300" />
                <span className="hidden sm:inline">Night View</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">Day View</span>
              </>
            )}
          </motion.button>

          {/* Auth Action Pill Button */}
          <motion.button
            onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-amber-50 transition-all border border-white/50"
          >
            {isAuthenticated ? (
              <>
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 fill-amber-500" />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
                <span>Login / Register</span>
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* 4. Hero Content Area (Shifted Downwards into Balanced Mid-Sky Zone) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 pt-20 sm:pt-32 lg:pt-44 flex flex-col items-start justify-start pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xs sm:max-w-md lg:max-w-lg text-left"
        >
          {/* 1-Line Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-sans"
          >
            A Healthier, Happier You Starts Here.
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-sky-100 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-xs sm:max-w-md"
          >
            Turn your everyday actions into a meaningful journey, build better habits, grow with Wick, and become your best self.
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-3.5"
          >
            {/* Primary CTA Button */}
            <motion.button
              onClick={onStartJourney}
              whileHover={{
                scale: 1.04,
                y: -1,
                boxShadow: '0 8px 20px -3px rgba(255, 255, 255, 0.4)',
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-xl transition-all border border-white/80 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Secondary CTA Button */}
            <motion.button
              onClick={onWatchDemo}
              whileHover={{
                scale: 1.04,
                y: -1,
                boxShadow: '0 8px 20px -3px rgba(255, 255, 255, 0.2)',
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Watch Demo</span>
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* 6. Footer Details: Quote Card & Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-14 right-4 sm:right-6 lg:right-14 z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2.5 pointer-events-auto">
        {/* Quote Card (Bottom-Left) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-[240px] sm:max-w-md backdrop-blur-sm bg-black/30 sm:bg-black/15 p-2.5 sm:p-3 rounded-xl border border-white/10 shadow-lg"
        >
          <p className="text-[11px] sm:text-sm text-sky-100 font-medium italic drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] leading-tight sm:leading-normal">
            &ldquo;Progress feels different when you&apos;re not alone.&rdquo;
          </p>
          <p className="text-[9px] sm:text-xs text-sky-200/80 font-bold tracking-wider uppercase mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            — HEARTH
          </p>
        </motion.div>

        {/* Scroll Indicator (Bottom-Right) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          onClick={() => onNavigate('features')}
          whileHover={{ scale: 1.06, color: '#fef08a' }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 cursor-pointer text-white font-semibold text-xs sm:text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] bg-black/30 sm:bg-black/15 backdrop-blur-sm px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-white/10 group self-end sm:self-auto"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Mouse className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-200 group-hover:text-amber-300" />
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

