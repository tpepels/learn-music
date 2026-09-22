export const trackNames = ["kick", "snare", "hat"] as const;

export type TrackName = (typeof trackNames)[number];
export type StepPattern = Record<TrackName, boolean[]>;

export const STEPS = 16;

export const initialPattern: StepPattern = {
  kick: [
    true, false, false, false,
    false, false, false, false,
    true, false, false, false,
    false, false, false, false,
  ],
  snare: Array(STEPS).fill(false),
  hat: [
    true, false, true, false,
    true, false, true, false,
    true, false, true, false,
    true, false, true, false,
  ],
};

export function clonePattern(pattern: StepPattern): StepPattern {
  return {
    kick: [...pattern.kick],
    snare: [...pattern.snare],
    hat: [...pattern.hat],
  };
}
