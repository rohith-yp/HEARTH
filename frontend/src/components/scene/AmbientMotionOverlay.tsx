import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Layer 1: Falling Leaf Sprite Component
const FallingLeaf: React.FC<{
  left: string;
  top: string;
  delay: number;
  duration: number;
  scale: number;
  xDrift: number[];
  rotations: number[];
}> = ({ left, top, delay, duration, scale, xDrift, rotations }) => {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="absolute pointer-events-none z-10 select-none opacity-85"
      style={{ left, top, width: 15 * scale, height: 15 * scale }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: xDrift,
        y: [0, 140, 300, 480],
        rotate: rotations,
        opacity: [0, 0.85, 0.75, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <path
        d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2 6.5 5 8 1.5.8 3.5 1 5 1 5.5 0 10-4.5 10-10 0-5.5-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"
        fill="#6fa828"
      />
      <path
        d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 12v-4H8l4-6v4h3l-4 6z"
        fill="#4d7c1b"
      />
    </motion.svg>
  );
};

// Layer 2: Wick's Organic Flame Flicker (SVG Silhouette Morphing)
// Subtly morphs top flare & waist contours rather than simple mechanical scale pulse
const WickOrganicFlame: React.FC = () => {
  // 5 subtly morphing flame paths matching Wick's silhouette
  const pathVariants = [
    "M 16 2 C 18 8, 26 12, 26 20 C 26 27, 21 30, 16 30 C 11 30, 6 27, 6 20 C 6 12, 14 8, 16 2 Z",
    "M 18 2 C 17 9, 27 13, 27 21 C 26 28, 20 30, 16 30 C 11 30, 5 26, 5 19 C 5 11, 15 7, 18 2 Z",
    "M 14 2 C 19 7, 25 11, 25 19 C 25 26, 21 30, 16 30 C 10 30, 6 26, 6 18 C 6 11, 12 7, 14 2 Z",
    "M 16 1 C 18 7, 27 12, 26 20 C 25 27, 20 30, 15 30 C 11 30, 6 27, 6 20 C 6 13, 14 7, 16 1 Z",
    "M 17 3 C 16 9, 26 12, 26 20 C 26 27, 21 30, 16 30 C 11 30, 6 27, 6 20 C 6 12, 13 8, 17 3 Z",
    "M 16 2 C 18 8, 26 12, 26 20 C 26 27, 21 30, 16 30 C 11 30, 6 27, 6 20 C 6 12, 14 8, 16 2 Z",
  ];

  return (
    <div className="absolute right-[28.8%] bottom-[25.2%] w-16 h-20 pointer-events-none z-15 mix-blend-screen opacity-90">
      {/* Outer Soft Warm Glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500/40 via-orange-500/30 to-yellow-300/20 blur-md"
        animate={{
          scale: [0.96, 1.06, 0.98, 1.04, 0.96],
          opacity: [0.6, 0.85, 0.65, 0.9, 0.6],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* SVG Path Morph Flame Core */}
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,160,0,0.8)]">
        <motion.path
          animate={{ d: pathVariants }}
          fill="url(#wickFlameGrad)"
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <defs>
          <linearGradient id="wickFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ffaa00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff3a1" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Layer 3: Steam Wisp Rising from the Mug
const MugSteamWisp: React.FC<{ delay: number; duration: number; xDrift: number[] }> = ({
  delay,
  duration,
  xDrift,
}) => {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 30 70"
      className="absolute pointer-events-none z-15 opacity-70"
      style={{ width: '22px', height: '50px' }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        y: [0, -22, -45, -68],
        x: xDrift,
        opacity: [0, 0.45, 0.25, 0],
        scaleX: [0.8, 1.2, 1.6, 2.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <path
        d="M15 70 C10 50, 20 35, 15 20 C10 10, 18 5, 15 0"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        className="blur-[1px]"
      />
    </motion.svg>
  );
};

export const AmbientMotionOverlay: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion) {
    return null; // Respect accessibility fallback
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
    >
      {/* 1. Falling Leaves Layer (6 randomized independent falling leaf sprites) */}
      <FallingLeaf
        left="72%"
        top="8%"
        delay={0}
        duration={9.2}
        scale={1.0}
        xDrift={[-10, -50, -110, -160]}
        rotations={[0, 90, 180, 290]}
      />
      <FallingLeaf
        left="81%"
        top="5%"
        delay={2.1}
        duration={11.5}
        scale={0.85}
        xDrift={[-15, -70, -130, -190]}
        rotations={[15, -60, -150, -270]}
      />
      <FallingLeaf
        left="67%"
        top="14%"
        delay={4.3}
        duration={8.4}
        scale={1.15}
        xDrift={[-5, -40, -90, -140]}
        rotations={[0, 110, 220, 340]}
      />
      <FallingLeaf
        left="86%"
        top="10%"
        delay={1.5}
        duration={10.8}
        scale={0.75}
        xDrift={[-20, -80, -150, -210]}
        rotations={[-20, 70, 190, 310]}
      />
      <FallingLeaf
        left="76%"
        top="18%"
        delay={3.7}
        duration={9.8}
        scale={1.05}
        xDrift={[-12, -55, -105, -165]}
        rotations={[10, -80, -170, -250]}
      />
      <FallingLeaf
        left="63%"
        top="6%"
        delay={5.9}
        duration={12.2}
        scale={0.9}
        xDrift={[-8, -45, -95, -150]}
        rotations={[0, 130, 240, 360]}
      />

      {/* 2. Wick's Flame Flicker Layer (Organic SVG Silhouette Path Morph) */}
      <WickOrganicFlame />

      {/* 3. Steam from the Mug Layer (Pixel-aligned to mug next to laptop on deck) */}
      <div className="absolute right-[15.2%] bottom-[23.5%] pointer-events-none z-15">
        <MugSteamWisp delay={0} duration={3.6} xDrift={[0, 4, -5, 3]} />
        <MugSteamWisp delay={1.8} duration={4.2} xDrift={[0, -5, 3, -4]} />
        <MugSteamWisp delay={0.9} duration={3.2} xDrift={[0, 3, -3, 5]} />
      </div>
    </div>
  );
};
