export const AnimationSpeed = {
  INSTANT: 'instant',
  FAST: 'fast',
  MEDIUM: 'medium',
  SLOW: 'slow',
  VERY_SLOW: 'very-slow',
} as const;

export type AnimationSpeed = (typeof AnimationSpeed)[keyof typeof AnimationSpeed];

export interface AnimationSpeedConfig {
  delay: number; // milliseconds per batch
  batchSize: number; // nodes to process per batch
}

export const ANIMATION_SPEED_CONFIGS: Record<AnimationSpeed, AnimationSpeedConfig> = {
  [AnimationSpeed.INSTANT]: {
    delay: 0,
    batchSize: Infinity, // Process all at once
  },
  [AnimationSpeed.FAST]: {
    delay: 5,
    batchSize: 50,
  },
  [AnimationSpeed.MEDIUM]: {
    delay: 10,
    batchSize: 20,
  },
  [AnimationSpeed.SLOW]: {
    delay: 20,
    batchSize: 5,
  },
  [AnimationSpeed.VERY_SLOW]: {
    delay: 50,
    batchSize: 1,
  },
};

export const ANIMATION_SPEED_LABELS: Record<AnimationSpeed, string> = {
  [AnimationSpeed.INSTANT]: 'Instant',
  [AnimationSpeed.FAST]: 'Fast',
  [AnimationSpeed.MEDIUM]: 'Medium',
  [AnimationSpeed.SLOW]: 'Slow',
  [AnimationSpeed.VERY_SLOW]: 'Very Slow',
};
