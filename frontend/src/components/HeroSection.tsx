import React from 'react';
import { AmbientMotionOverlay } from './scene/AmbientMotionOverlay';

interface HeroSectionProps {
  onStartJourney: () => void;
  onWatchDemo: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onNavigate: (sectionId: string) => void;
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartJourney,
  onWatchDemo,
  onOpenAuth,
  onOpenDashboard,
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

      {/* 2. Independent Ambient Motion Layers Overlay */}
      <AmbientMotionOverlay />

      {/* 2. Interactive Hotspots over the image UI elements */}

      {/* Top Left Logo & Title Hotspot */}
      <div
        onClick={() => onNavigate('home')}
        className="absolute top-5 left-6 lg:left-12 w-48 h-12 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
        title="HEARTH Home"
      />

      {/* Top Navigation Links Hotspots */}
      <div className="hidden md:flex absolute top-5 right-64 items-center gap-6 h-12">
        <div
          onClick={() => onNavigate('home')}
          className="w-14 h-full cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
          title="Home"
        />
        <div
          onClick={() => onNavigate('features')}
          className="w-16 h-full cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
          title="Features"
        />
        <div
          onClick={() => onNavigate('journey')}
          className="w-16 h-full cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
          title="Journey"
        />
        <div
          onClick={() => onNavigate('about')}
          className="w-14 h-full cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
          title="About"
        />
      </div>

      {/* Top Right Login / Register Pill Button Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute top-5 right-6 lg:right-12 w-40 h-12 cursor-pointer hover:bg-white/20 rounded-full transition-all hover:scale-105"
        title={isAuthenticated ? 'Open Dashboard' : 'Login / Register'}
      />

      {/* Hero Primary CTA: "Start Your Journey ->" Button Hotspot */}
      <div
        onClick={onStartJourney}
        className="absolute left-[5.5%] top-[51.5%] sm:top-[52%] w-[130px] sm:w-[150px] lg:w-[170px] h-[45px] sm:h-[50px] cursor-pointer hover:bg-white/20 rounded-full transition-all hover:scale-105"
        title="Start Your Journey"
      />

      {/* Hero Secondary CTA: "Watch Demo ▷" Button Hotspot */}
      <div
        onClick={onWatchDemo}
        className="absolute left-[20%] sm:left-[17.5%] lg:left-[16%] top-[51.5%] sm:top-[52%] w-[110px] sm:w-[130px] lg:w-[145px] h-[45px] sm:h-[50px] cursor-pointer hover:bg-white/20 rounded-full transition-all hover:scale-105"
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
