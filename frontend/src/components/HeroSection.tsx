import React from 'react';
import { AmbientMotionOverlay } from './scene/AmbientMotionOverlay';

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
  return (
    <section className="relative w-full h-screen overflow-hidden pointer-events-auto">
      {/* 1. Full-screen background image matching reference */}
      <img
        src="/hero-bg.png"
        alt="HEARTH Living World"
        className="w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* 2. Independent Ambient Motion Overlays (Leaves, Lantern, Wick Flicker, Water Shimmer, Grass Sway) */}
      <AmbientMotionOverlay />

      {/* 3. Interactive Hotspots over Hero elements */}

      {/* Primary CTA: "Start Your Journey ->" Button Hotspot */}
      <div
        onClick={onStartJourney}
        className="absolute left-[5.5%] top-[51.5%] sm:top-[52%] w-[135px] sm:w-[155px] lg:w-[175px] h-[48px] sm:h-[52px] cursor-pointer hover:bg-white/20 rounded-full transition-all hover:scale-105"
        title="Start Your Journey"
      />

      {/* Secondary CTA: "Watch Demo ▷" Button Hotspot */}
      <div
        onClick={onWatchDemo}
        className="absolute left-[20%] sm:left-[17.5%] lg:left-[16%] top-[51.5%] sm:top-[52%] w-[115px] sm:w-[135px] lg:w-[150px] h-[48px] sm:h-[52px] cursor-pointer hover:bg-white/20 rounded-full transition-all hover:scale-105"
        title="Watch Demo"
      />

      {/* Interactive Wick Companion Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[28%] bottom-[18%] w-36 h-36 rounded-full cursor-pointer hover:bg-amber-500/20 transition-all hover:scale-110"
        title="Interact with Wick AI"
      />

      {/* Interactive Laptop & Mug Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[14%] bottom-[18%] w-48 h-36 rounded-2xl cursor-pointer hover:bg-blue-500/20 transition-all hover:scale-105"
        title="Open Tasks & Habits Dashboard"
      />

      {/* Bottom Right "Scroll to explore" Indicator Hotspot */}
      <div
        onClick={() => onNavigate('features')}
        className="absolute right-6 sm:right-12 bottom-6 w-36 h-10 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
        title="Scroll to explore"
      />
    </section>
  );
};
