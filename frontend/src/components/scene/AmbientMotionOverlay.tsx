import React from 'react';
import { motion } from 'framer-motion';

// Falling Leaf SVG Component
const LeafSprite: React.FC<{
  left: string;
  top: string;
  delay: number;
  duration: number;
  scale: number;
}> = ({ left, top, delay, duration, scale }) => {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="absolute pointer-events-none z-10 opacity-80"
      style={{ left, top, width: 16 * scale, height: 16 * scale }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: [-20, -80, -140, -200],
        y: [0, 120, 260, 420],
        rotate: [0, 120, 240, 360],
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
        fill="#7cb534"
      />
      <path
        d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 12v-4H8l4-6v4h3l-4 6z"
        fill="#5d9322"
      />
    </motion.svg>
  );
};

// Realistic Wind-Swaying Grass Blade Clump
const GrassBladeClump: React.FC<{ left: string; height: number; delay: number; color?: string }> = ({
  left,
  height,
  delay,
  color = '#6ba829',
}) => {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 16 45"
      className="absolute bottom-0 pointer-events-none z-10 origin-bottom"
      style={{ left, height: `${height}px`, width: '16px' }}
      animate={{
        rotate: [-6, 6, -6],
        skewX: [-4, 4, -4],
      }}
      transition={{
        duration: 2.8 + (delay % 1.5),
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <path d="M4 45 Q1 20 4 0 Q7 20 4 45 Z" fill={color} />
      <path d="M11 45 Q8 25 11 8 Q14 25 11 45 Z" fill="#58941f" />
    </motion.svg>
  );
};

// Realistic Wind-Swaying Daisy Flower
const DaisyFlower: React.FC<{ left: string; bottom: string; size: number; delay: number }> = ({
  left,
  bottom,
  size,
  delay,
}) => {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none z-15 origin-bottom"
      style={{ left, bottom, width: `${size}px`, height: `${size * 1.5}px` }}
      animate={{
        rotate: [-7, 7, -7],
        y: [0, -2, 0],
      }}
      transition={{
        duration: 3.2 + (delay % 1.8),
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 30 45" className="w-full h-full">
        {/* Flower Stem */}
        <path d="M15 45 Q13 25 15 12" stroke="#5d9622" strokeWidth="2.5" fill="none" />
        {/* Leaves on Stem */}
        <path d="M14 30 Q8 26 10 22 Q14 25 14 30 Z" fill="#5d9622" />
        <path d="M16 25 Q22 21 20 17 Q16 20 16 25 Z" fill="#4c8019" />
        {/* White Daisy Petals */}
        <g transform="translate(15, 12)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-7"
              rx="2.5"
              ry="6"
              fill="#ffffff"
              transform={`rotate(${angle})`}
            />
          ))}
          {/* Yellow Center Disk */}
          <circle cx="0" cy="0" r="4" fill="#ffcc00" />
        </g>
      </svg>
    </motion.div>
  );
};

export const AmbientMotionOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
    >
      {/* 1. Falling Leaves Layer */}
      <LeafSprite left="75%" top="15%" delay={0} duration={9} scale={1.1} />
      <LeafSprite left="82%" top="10%" delay={2.5} duration={11} scale={0.9} />
      <LeafSprite left="68%" top="18%" delay={4.2} duration={8.5} scale={1.2} />
      <LeafSprite left="88%" top="12%" delay={1.2} duration={10.5} scale={0.8} />
      <LeafSprite left="62%" top="22%" delay={3.6} duration={9.5} scale={1.0} />
      <LeafSprite left="79%" top="8%" delay={5.8} duration={12} scale={0.95} />

      {/* 2. Tree Canopy Subtle Sway Layer */}
      <motion.div
        className="absolute right-0 top-0 w-[45%] h-[40%] origin-top-right"
        animate={{ rotate: [-0.6, 0.6, -0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-full h-full bg-gradient-to-b from-green-500/5 to-transparent blur-sm" />
      </motion.div>

      {/* 3. Lantern Pendulum Swing & Glow Layer */}
      <motion.div
        className="absolute right-[17.5%] top-[23%] origin-top"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Lantern Soft Warm Glow */}
        <motion.div
          className="w-12 h-12 rounded-full bg-amber-400/30 blur-md -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.6, 0.9, 0.6], scale: [0.95, 1.1, 0.95] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* 4. Wick's Flame Organic Flicker Layer */}
      <div className="absolute right-[28%] bottom-[20%] w-24 h-24 pointer-events-none">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500/40 via-ember-500/30 to-yellow-300/20 blur-xl"
          animate={{
            scale: [0.95, 1.08, 0.98, 1.05],
            opacity: [0.5, 0.85, 0.6, 0.9],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 5. Water Shimmer Horizontal Layer */}
      <div className="absolute left-[22%] top-[54%] w-[42%] h-[11%] overflow-hidden rounded-full opacity-30">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-transparent via-sky-200/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* 6. Cloud Drift Layer */}
      <div className="absolute left-0 top-[6%] w-full h-[25%] opacity-20 pointer-events-none">
        <motion.div
          className="w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-2xl"
          animate={{ x: ['-10%', '5%', '-10%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 7. Realistic Bottom Foreground Grass & White Daisy Flowers Wind Simulation */}
      <GrassBladeClump left="3%" height={38} delay={0.1} color="#68a327" />
      <GrassBladeClump left="8%" height={32} delay={0.5} color="#58941f" />
      <GrassBladeClump left="14%" height={42} delay={1.2} color="#7cb534" />
      <GrassBladeClump left="22%" height={35} delay={0.8} color="#68a327" />
      <GrassBladeClump left="31%" height={40} delay={1.6} color="#58941f" />
      <GrassBladeClump left="39%" height={34} delay={0.4} color="#7cb534" />
      <GrassBladeClump left="48%" height={44} delay={2.0} color="#68a327" />
      <GrassBladeClump left="57%" height={36} delay={1.3} color="#58941f" />
      <GrassBladeClump left="66%" height={41} delay={0.7} color="#7cb534" />
      <GrassBladeClump left="75%" height={33} delay={1.9} color="#68a327" />
      <GrassBladeClump left="83%" height={45} delay={1.0} color="#58941f" />
      <GrassBladeClump left="91%" height={37} delay={0.3} color="#7cb534" />
      <GrassBladeClump left="96%" height={40} delay={1.5} color="#68a327" />

      {/* Wind-Swaying White Daisy Flowers matching footer location */}
      <DaisyFlower left="4%" bottom="2px" size={24} delay={0.2} />
      <DaisyFlower left="41%" bottom="4px" size={22} delay={0.9} />
      <DaisyFlower left="58%" bottom="3px" size={26} delay={1.7} />
      <DaisyFlower left="82%" bottom="1px" size={28} delay={1.1} />
    </div>
  );
};
