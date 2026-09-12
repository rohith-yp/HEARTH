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
      {/* 1. Full-screen untouched background image matching reference */}
      <img
        src="/hero-bg.png"
        alt="HEARTH Living World"
        className="w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* 2. Independent Ambient Motion Overlays (Leaves, Canopy Sway, Lantern, Wick Flicker, Water Shimmer, Cloud Drift, Grass & Flower Sway) */}
      <AmbientMotionOverlay />

      {/* 3. 100% Clean Interactive Hotspots (No gray boxes, no tooltips, smooth click response) */}

      {/* Top Left Logo & Title Hotspot */}
      <div
        onClick={() => onNavigate('home')}
        className="absolute left-[3%] top-[2%] sm:top-[2.5%] w-[180px] sm:w-[220px] h-[45px] sm:h-[50px] cursor-pointer active:scale-95 transition-transform"
      />

      {/* Top Nav Links Hotspots */}
      <div
        onClick={() => onNavigate('home')}
        className="hidden md:block absolute right-[33.5%] lg:right-[34%] top-[2%] sm:top-[2.5%] w-[65px] h-[40px] cursor-pointer active:scale-95 transition-transform"
      />
      <div
        onClick={() => onNavigate('features')}
        className="hidden md:block absolute right-[27%] lg:right-[27.5%] top-[2%] sm:top-[2.5%] w-[80px] h-[40px] cursor-pointer active:scale-95 transition-transform"
      />
      <div
        onClick={() => onNavigate('journey')}
        className="hidden md:block absolute right-[21%] lg:right-[21.5%] top-[2%] sm:top-[2.5%] w-[75px] h-[40px] cursor-pointer active:scale-95 transition-transform"
      />
      <div
        onClick={() => onNavigate('about')}
        className="hidden md:block absolute right-[15.5%] lg:right-[16%] top-[2%] sm:top-[2.5%] w-[65px] h-[40px] cursor-pointer active:scale-95 transition-transform"
      />

      {/* Top Right Login / Register Pill Button Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[2.5%] sm:right-[3%] top-[1.8%] sm:top-[2%] w-[140px] sm:w-[170px] h-[44px] sm:h-[48px] cursor-pointer active:scale-95 transition-transform"
      />

      {/* Hero Primary CTA: "Start Your Journey ->" Button Hotspot */}
      <div
        onClick={onStartJourney}
        className="absolute left-[5.5%] top-[51.5%] sm:top-[52%] w-[135px] sm:w-[155px] lg:w-[175px] h-[48px] sm:h-[52px] cursor-pointer active:scale-95 transition-transform"
      />

      {/* Hero Secondary CTA: "Watch Demo ▷" Button Hotspot */}
      <div
        onClick={onWatchDemo}
        className="absolute left-[20%] sm:left-[17.5%] lg:left-[16%] top-[51.5%] sm:top-[52%] w-[115px] sm:w-[135px] lg:w-[150px] h-[48px] sm:h-[52px] cursor-pointer active:scale-95 transition-transform"
      />

      {/* Interactive Wick Companion Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[28%] bottom-[18%] w-36 h-36 rounded-full cursor-pointer active:scale-95 transition-transform"
      />

      {/* Interactive Laptop & Mug Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[14%] bottom-[18%] w-48 h-36 rounded-2xl cursor-pointer active:scale-95 transition-transform"
      />

      {/* Bottom Right "Scroll to explore" Indicator Hotspot */}
      <div
        onClick={() => onNavigate('features')}
        className="absolute right-6 sm:right-12 bottom-6 w-36 h-10 cursor-pointer active:scale-95 transition-transform"
      />
    </section>
  );
};
