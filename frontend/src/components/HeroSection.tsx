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
    <section className="relative w-full h-screen overflow-hidden pointer-events-auto select-none bg-sky-300">
      {/* 1. Full-screen untouched background image matching reference */}
      <img
        src="/hero-bg.png"
        alt="HEARTH Living World"
        className="w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* 2. Independent Ambient Motion Overlays (Falling Leaves, Wick Organic Flame Flicker, Steam from Mug) */}
      <AmbientMotionOverlay />

      {/* 3. 100% Clean Seamless Interactive Hotspots (No gray background boxes, no tooltips, smooth click response) */}

      {/* Top Left Logo & Title Hotspot */}
      <div
        onClick={() => onNavigate('home')}
        className="absolute left-[3%] top-[1.5%] sm:top-[2%] w-[180px] sm:w-[220px] h-[45px] sm:h-[50px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />

      {/* Top Nav Links Hotspots */}
      <div
        onClick={() => onNavigate('home')}
        className="hidden md:block absolute right-[33.5%] lg:right-[34%] top-[1.8%] sm:top-[2%] w-[65px] h-[40px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-125 active:scale-95"
      />
      <div
        onClick={() => onNavigate('features')}
        className="hidden md:block absolute right-[27%] lg:right-[27.5%] top-[1.8%] sm:top-[2%] w-[82px] h-[40px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-125 active:scale-95"
      />
      <div
        onClick={() => onNavigate('journey')}
        className="hidden md:block absolute right-[20.5%] lg:right-[21%] top-[1.8%] sm:top-[2%] w-[78px] h-[40px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-125 active:scale-95"
      />
      <div
        onClick={() => onNavigate('about')}
        className="hidden md:block absolute right-[15%] lg:right-[15.5%] top-[1.8%] sm:top-[2%] w-[65px] h-[40px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-125 active:scale-95"
      />

      {/* Top Right Login / Register Pill Button Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[2.5%] sm:right-[3%] top-[1.5%] sm:top-[1.8%] w-[145px] sm:w-[170px] h-[44px] sm:h-[48px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />

      {/* Hero Primary CTA: "Start Your Journey ->" Button Hotspot */}
      <div
        onClick={onStartJourney}
        className="absolute left-[5.5%] top-[51.5%] sm:top-[52%] w-[135px] sm:w-[155px] lg:w-[175px] h-[48px] sm:h-[52px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />

      {/* Hero Secondary CTA: "Watch Demo ▷" Button Hotspot */}
      <div
        onClick={onWatchDemo}
        className="absolute left-[20%] sm:left-[17.5%] lg:left-[16%] top-[51.5%] sm:top-[52%] w-[115px] sm:w-[135px] lg:w-[150px] h-[48px] sm:h-[52px] cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />

      {/* Interactive Wick Companion Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[27.5%] bottom-[17%] w-36 h-36 rounded-full cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />

      {/* Interactive Laptop & Mug Hotspot */}
      <div
        onClick={isAuthenticated ? onOpenDashboard : onOpenAuth}
        className="absolute right-[13.5%] bottom-[17%] w-48 h-36 rounded-2xl cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />

      {/* Bottom Right "Scroll to explore" Indicator Hotspot */}
      <div
        onClick={() => onNavigate('features')}
        className="absolute right-6 sm:right-12 bottom-6 w-36 h-10 cursor-pointer bg-transparent border-none outline-none select-none transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
      />
    </section>
  );
};
