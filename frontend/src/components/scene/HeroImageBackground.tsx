import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroImageBackgroundProps {
  onWickClick?: () => void;
  onLaptopClick?: () => void;
}

export const HeroImageBackground: React.FC<HeroImageBackgroundProps> = ({
  onWickClick,
  onLaptopClick,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15; // Max 15px shift
      const y = (e.clientY / innerHeight - 0.5) * 10; // Max 10px shift
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-900 pointer-events-none select-none">
      {/* Crisp Reference Image Background with Subtle Parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          scale: 1.03,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 80 }}
      >
        <img
          src="/hero-bg.png"
          alt="HEARTH Living World"
          className="w-full h-full object-cover object-center"
        />

        {/* Ambient Pulsing Warm Ember Glow over Wick's Deck Area */}
        <div className="absolute right-[22%] bottom-[18%] w-64 h-64 rounded-full bg-amber-500/20 blur-3xl animate-pulse pointer-events-none" />

        {/* Interactive Hotspot Trigger over Wick & Laptop */}
        <div
          onClick={onWickClick}
          className="absolute right-[28%] bottom-[20%] w-36 h-36 rounded-full cursor-pointer pointer-events-auto hover:bg-amber-500/10 transition-colors rounded-full"
          title="Speak with Wick"
        />

        <div
          onClick={onLaptopClick}
          className="absolute right-[18%] bottom-[20%] w-44 h-32 cursor-pointer pointer-events-auto hover:bg-blue-500/10 transition-colors rounded-xl"
          title="Open Tasks & Habits Dashboard"
        />
      </motion.div>

      {/* Soft Vignette Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/20 pointer-events-none" />
    </div>
  );
};
