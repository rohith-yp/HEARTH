import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// 1. Falling Leaf Sprite Component (Day View: Tree Canopy Top-Right)
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
      className="absolute pointer-events-none z-15 select-none opacity-85"
      style={{ left, top, width: 14 * scale, height: 14 * scale }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: xDrift,
        y: [0, 120, 260, 420],
        rotate: rotations,
        opacity: [0, 0.9, 0.8, 0],
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
        fill="#72b026"
      />
      <path
        d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 12v-4H8l4-6v4h3l-4 6z"
        fill="#477a16"
      />
    </motion.svg>
  );
};

// 2. Shooting Star Meteor Streak Component (Night View)
const ShootingStar: React.FC<{
  left: string;
  top: string;
  delay: number;
  duration: number;
}> = ({ left, top, delay, duration }) => {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none z-15 select-none"
      style={{ left, top }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
      animate={{
        x: [0, -180, -320],
        y: [0, 140, 260],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 2.5,
        ease: 'easeOut',
      }}
    >
      <div className="relative w-28 h-[2px] bg-gradient-to-r from-transparent via-cyan-200 to-white -rotate-[35deg] blur-[0.5px] shadow-[0_0_10px_rgba(255,255,255,0.9)]">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#fff]" />
      </div>
    </motion.div>
  );
};

// Twinkling Star Component (Night View)
const TwinklingStar: React.FC<{ left: string; top: string; delay: number }> = ({ left, top, delay }) => {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-cyan-100 shadow-[0_0_8px_#67e8f9] pointer-events-none z-15"
      style={{ left, top }}
      animate={{
        scale: [0.6, 1.4, 0.6],
        opacity: [0.3, 0.95, 0.3],
      }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// 3. Laptop Screen Thought Typing Overlay (Dead-center inside laptop screen display)
const LaptopScreenTyping: React.FC<{ isNightMode: boolean }> = ({ isNightMode }) => {
  const phrases = [
    'Better Habits,\nBrighter Days_',
    'Kindle Your Ember,\nStep by Step_',
    'Focus • Health •\nDiscipline_',
    'Small Steps,\nBrighter Days_',
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 85);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <div
      aria-hidden="true"
      className="absolute right-[15.8%] bottom-[24.5%] sm:right-[16.4%] sm:bottom-[25.5%] lg:right-[17.2%] lg:bottom-[26.5%] w-[58px] sm:w-[76px] lg:w-[90px] h-[34px] sm:h-[44px] lg:h-[54px] pointer-events-none z-15 flex items-center justify-center overflow-hidden max-w-full max-h-full"
      style={{
        transform: 'rotate(-2.5deg) skewY(-2deg)',
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center text-center overflow-hidden pointer-events-none">
        <p
          className={`text-[5.5px] sm:text-[7.5px] lg:text-[9.5px] font-mono font-extrabold whitespace-pre-line leading-tight tracking-tight overflow-hidden text-ellipsis select-none text-center ${
            isNightMode
              ? 'text-slate-950 font-black drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]'
              : 'text-slate-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
          }`}
        >
          {displayedText}
        </p>
      </div>
    </div>
  );
};

// 4. Coffee Mug Smoke Wisps Animation Overlay (Originates directly from inside mug rim)
const MugSmokeWisp: React.FC<{ delay: number; duration: number; xDrift: number[]; isNightMode?: boolean }> = ({
  delay,
  duration,
  xDrift,
  isNightMode = false,
}) => {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 30 70"
      className="absolute pointer-events-none z-20"
      style={{ width: '20px', height: '50px' }}
      initial={{ opacity: 0, y: 0, scaleX: 0.6 }}
      animate={{
        y: [0, -20, -42, -65],
        x: xDrift,
        opacity: [0, 0.75, 0.4, 0],
        scaleX: [0.6, 1.1, 1.6, 2.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <path
        d="M15 70 C8 50, 22 35, 15 20 C8 10, 18 5, 15 0"
        stroke={isNightMode ? 'rgba(224, 242, 254, 0.85)' : 'rgba(255, 255, 255, 0.75)'}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        className={isNightMode ? 'blur-[0.8px] drop-shadow-[0_0_4px_rgba(186,230,253,0.8)]' : 'blur-[1px]'}
      />
    </motion.svg>
  );
};

// 5. Wind-Swaying Grass & Flowers Animation Overlay along the Bottom Hill
const WindBreezeGrassFlowers: React.FC = () => {
  return (
    <div className="absolute left-[2%] bottom-[2%] w-[45%] h-[12%] pointer-events-none z-15 overflow-hidden flex items-end justify-start gap-4 opacity-90">
      {/* Grass & Daisy Tuft 1 */}
      <motion.svg
        viewBox="0 0 60 50"
        className="w-12 h-10 origin-bottom select-none"
        animate={{
          rotate: [-1.5, 3.5, -2, 2.5, -1.5],
          skewX: [-3, 4, -2, 3, -3],
          x: [-1.5, 2, -1, 1.5, -1.5],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <path d="M10 50 Q 15 20 8 5 Q 22 22 25 50 Z" fill="#66a828" />
        <path d="M25 50 Q 30 15 36 2 Q 38 25 45 50 Z" fill="#7cc730" />
        <circle cx="36" cy="4" r="3" fill="#ffffff" />
        <circle cx="36" cy="4" r="1.2" fill="#eab308" />
      </motion.svg>

      {/* Grass & Daisy Tuft 2 */}
      <motion.svg
        viewBox="0 0 60 50"
        className="w-14 h-12 origin-bottom select-none ml-8"
        animate={{
          rotate: [2, -3, 1.8, -2.5, 2],
          skewX: [3, -4, 2, -3, 3],
          x: [1.5, -2, 1, -1.5, 1.5],
        }}
        transition={{
          duration: 4.8,
          delay: 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <path d="M12 50 Q 18 18 10 3 Q 25 20 30 50 Z" fill="#528e1c" />
        <path d="M30 50 Q 38 12 42 1 Q 44 22 50 50 Z" fill="#7cc730" />
        <circle cx="10" cy="4" r="3.2" fill="#ffffff" />
        <circle cx="10" cy="4" r="1.3" fill="#f59e0b" />
        <circle cx="42" cy="2" r="2.8" fill="#ffffff" />
        <circle cx="42" cy="2" r="1" fill="#f59e0b" />
      </motion.svg>

      {/* Grass & Daisy Tuft 3 */}
      <motion.svg
        viewBox="0 0 60 50"
        className="w-10 h-9 origin-bottom select-none ml-12"
        animate={{
          rotate: [-2.5, 3, -1.8, 2, -2.5],
          skewX: [-4, 3, -2, 2.5, -4],
        }}
        transition={{
          duration: 3.9,
          delay: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <path d="M8 50 Q 14 15 5 2 Q 20 18 24 50 Z" fill="#66a828" />
        <path d="M24 50 Q 32 10 38 0 Q 40 20 48 50 Z" fill="#88d834" />
        <circle cx="5" cy="3" r="2.8" fill="#ffffff" />
        <circle cx="5" cy="3" r="1" fill="#eab308" />
      </motion.svg>
    </div>
  );
};

interface AmbientMotionOverlayProps {
  isNightMode?: boolean;
}

export const AmbientMotionOverlay: React.FC<AmbientMotionOverlayProps> = ({ isNightMode = false }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
    >
      {/* Day View: Falling Leaves from Tree Canopy */}
      {!isNightMode && (
        <>
          <FallingLeaf
            left="64%"
            top="4%"
            delay={0}
            duration={8.5}
            scale={1.0}
            xDrift={[-10, -50, -110, -170]}
            rotations={[0, 90, 180, 290]}
          />
          <FallingLeaf
            left="74%"
            top="2%"
            delay={1.8}
            duration={10.2}
            scale={0.85}
            xDrift={[-15, -65, -125, -190]}
            rotations={[15, -60, -150, -270]}
          />
          <FallingLeaf
            left="82%"
            top="6%"
            delay={3.5}
            duration={9.0}
            scale={1.1}
            xDrift={[-20, -75, -140, -210]}
            rotations={[0, 110, 220, 340]}
          />
          <FallingLeaf
            left="68%"
            top="10%"
            delay={5.2}
            duration={11.0}
            scale={0.75}
            xDrift={[-12, -55, -105, -165]}
            rotations={[-20, 70, 190, 310]}
          />
          <FallingLeaf
            left="78%"
            top="12%"
            delay={2.9}
            duration={9.6}
            scale={1.05}
            xDrift={[-18, -70, -130, -195]}
            rotations={[10, -80, -170, -250]}
          />
          <FallingLeaf
            left="86%"
            top="3%"
            delay={4.6}
            duration={11.8}
            scale={0.9}
            xDrift={[-25, -85, -155, -230]}
            rotations={[0, 130, 240, 360]}
          />
        </>
      )}

      {/* Night View: Shooting Stars & Twinkling Night Sky Particles */}
      {isNightMode && (
        <>
          <ShootingStar left="55%" top="4%" delay={0.5} duration={2.8} />
          <ShootingStar left="72%" top="2%" delay={3.2} duration={3.2} />
          <ShootingStar left="40%" top="8%" delay={5.8} duration={2.6} />

          <TwinklingStar left="18%" top="12%" delay={0.2} />
          <TwinklingStar left="28%" top="8%" delay={1.4} />
          <TwinklingStar left="45%" top="15%" delay={0.9} />
          <TwinklingStar left="62%" top="10%" delay={2.1} />
          <TwinklingStar left="75%" top="18%" delay={1.7} />
          <TwinklingStar left="88%" top="8%" delay={0.6} />
        </>
      )}

      {/* Laptop Screen Thought Typing Overlay */}
      <LaptopScreenTyping isNightMode={isNightMode} />

      {/* Coffee Mug Smoke Animation Overlay (Aligned dead-center inside coffee mug opening) */}
      <div className="absolute right-[13.0%] bottom-[22.2%] sm:right-[13.5%] sm:bottom-[23.0%] lg:right-[13.8%] lg:bottom-[23.6%] pointer-events-none z-20 flex flex-col items-center justify-end">
        <MugSmokeWisp delay={0} duration={3.4} xDrift={[0, 2, -2, 1]} isNightMode={isNightMode} />
        <MugSmokeWisp delay={1.4} duration={3.8} xDrift={[0, -3, 2, -1]} isNightMode={isNightMode} />
        <MugSmokeWisp delay={0.7} duration={3.0} xDrift={[0, 2, -1, 2]} isNightMode={isNightMode} />
      </div>

      {/* Wind-Swaying Grass & Flowers Animation at Bottom */}
      <WindBreezeGrassFlowers />
    </div>
  );
};

