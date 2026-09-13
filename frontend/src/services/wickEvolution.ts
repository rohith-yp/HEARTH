export interface StageDefinition {
  name: string;
  requiredXp: number;
  nextStageXp: number | null;
  subtitle: string;
  description: string;
  feeling: string;
  scale: number;
  flameHeight: number;
  lightRadius: number;
  emissiveIntensity: number;
  particleCount: number;
  auraColor: string;
  badgeBg: string;
  badgeText: string;
  borderStyle: string;
}

export const WICK_STAGES: StageDefinition[] = [
  {
    name: 'Spark',
    requiredXp: 0,
    nextStageXp: 100,
    subtitle: 'The First Spark',
    description: 'A tiny gentle ember waiting to be kindled.',
    feeling: 'A tiny spark waiting to become something.',
    scale: 0.78,
    flameHeight: 0.45,
    lightRadius: 4,
    emissiveIntensity: 0.5,
    particleCount: 8,
    auraColor: 'from-amber-400/20 via-amber-300/10 to-yellow-500/20',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    badgeText: '0 XP Required',
    borderStyle: 'border-amber-500/30',
  },
  {
    name: 'Ember',
    requiredXp: 100,
    nextStageXp: 300,
    subtitle: 'Kindled Companion',
    description: 'Warm glow taking shape beside your daily habits.',
    feeling: 'Wick has begun to grow beside the user.',
    scale: 1.0,
    flameHeight: 0.6,
    lightRadius: 6,
    emissiveIntensity: 0.8,
    particleCount: 16,
    auraColor: 'from-orange-500/30 via-amber-500/20 to-amber-300/30',
    badgeBg: 'bg-amber-500/30 text-amber-200 border-amber-500/40',
    badgeText: '100 XP Required',
    borderStyle: 'border-amber-500/50',
  },
  {
    name: 'Flame',
    requiredXp: 300,
    nextStageXp: 700,
    subtitle: 'Radiant Life Flame',
    description: 'Strong confident companion radiating motivation.',
    feeling: 'Wick is becoming stronger.',
    scale: 1.18,
    flameHeight: 0.8,
    lightRadius: 8,
    emissiveIntensity: 1.2,
    particleCount: 28,
    auraColor: 'from-amber-500/40 via-orange-600/30 to-red-500/30',
    badgeBg: 'bg-amber-500 text-slate-950',
    badgeText: '300 XP Required',
    borderStyle: 'border-amber-400',
  },
  {
    name: 'Blaze',
    requiredXp: 700,
    nextStageXp: 1500,
    subtitle: 'Milestone Powerhouse',
    description: 'Vibrant powerhouse celebrating your milestones.',
    feeling: "Wick is celebrating the user's growing consistency.",
    scale: 1.35,
    flameHeight: 1.05,
    lightRadius: 10,
    emissiveIntensity: 1.7,
    particleCount: 45,
    auraColor: 'from-red-500/50 via-amber-500/40 to-yellow-400/40',
    badgeBg: 'bg-orange-500 text-slate-950',
    badgeText: '700 XP Required',
    borderStyle: 'border-orange-400',
  },
  {
    name: 'Hearthkeeper',
    requiredXp: 1500,
    nextStageXp: null,
    subtitle: 'Guardian of the Hearth',
    description: 'Ultimate evolved guardian of your hearth.',
    feeling: 'The companion has reached its highest form.',
    scale: 1.5,
    flameHeight: 1.3,
    lightRadius: 13,
    emissiveIntensity: 2.3,
    particleCount: 65,
    auraColor: 'from-amber-300/60 via-yellow-400/50 to-orange-500/50',
    badgeBg: 'bg-yellow-400 text-slate-950 font-black',
    badgeText: '1500 XP Required',
    borderStyle: 'border-yellow-300',
  },
];

export interface StageProgress {
  currentStage: StageDefinition;
  nextStage: StageDefinition | null;
  currentXp: number;
  xpInCurrentStage: number;
  xpToNextStage: number;
  progressPercent: number;
  remainingXp: number;
  isMaxStage: boolean;
}

export function getStageInfo(stageName?: string): StageDefinition {
  if (!stageName) return WICK_STAGES[1]; // Baseline Ember
  const nameLower = stageName.toLowerCase();
  return (
    WICK_STAGES.find((s) => s.name.toLowerCase() === nameLower) || WICK_STAGES[1]
  );
}

export function getStageProgress(
  totalXp: number = 0,
  currentStageName?: string
): StageProgress {
  const currentStage = getStageInfo(currentStageName);
  const currentIdx = WICK_STAGES.findIndex(
    (s) => s.name.toLowerCase() === currentStage.name.toLowerCase()
  );

  const nextStage =
    currentIdx >= 0 && currentIdx < WICK_STAGES.length - 1
      ? WICK_STAGES[currentIdx + 1]
      : null;

  if (!nextStage) {
    return {
      currentStage,
      nextStage: null,
      currentXp: totalXp,
      xpInCurrentStage: totalXp - currentStage.requiredXp,
      xpToNextStage: 0,
      progressPercent: 100,
      remainingXp: 0,
      isMaxStage: true,
    };
  }

  const stageXpSpan = nextStage.requiredXp - currentStage.requiredXp;
  const xpAcquiredInStage = Math.max(0, totalXp - currentStage.requiredXp);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpAcquiredInStage / stageXpSpan) * 100))
  );
  const remainingXp = Math.max(0, nextStage.requiredXp - totalXp);

  return {
    currentStage,
    nextStage,
    currentXp: totalXp,
    xpInCurrentStage: xpAcquiredInStage,
    xpToNextStage: stageXpSpan,
    progressPercent,
    remainingXp,
    isMaxStage: false,
  };
}

export function getMoodAnimationParams(mood: string = 'happy') {
  switch (mood.toLowerCase()) {
    case 'joyful':
      return {
        floatSpeed: 2.6,
        bounceHeight: 0.12,
        lightColor: '#ffd700',
        particleMult: 1.4,
        emissiveBoost: 1.25,
      };
    case 'happy':
      return {
        floatSpeed: 2.0,
        bounceHeight: 0.07,
        lightColor: '#ff9933',
        particleMult: 1.0,
        emissiveBoost: 1.0,
      };
    case 'quiet':
      return {
        floatSpeed: 1.2,
        bounceHeight: 0.04,
        lightColor: '#ffbb44',
        particleMult: 0.7,
        emissiveBoost: 0.85,
      };
    case 'tired':
      return {
        floatSpeed: 0.8,
        bounceHeight: 0.02,
        lightColor: '#ff4411',
        particleMult: 0.5,
        emissiveBoost: 0.65,
      };
    default:
      return {
        floatSpeed: 1.5,
        bounceHeight: 0.05,
        lightColor: '#ff6611',
        particleMult: 0.8,
        emissiveBoost: 0.9,
      };
  }
}
