export const trackNames = ["kick", "snare", "hat"] as const;
export const patternIds = ["A", "B"] as const;

export type TrackName = (typeof trackNames)[number];
export type PatternId = (typeof patternIds)[number];
export type StepPattern = Record<TrackName, boolean[]>;

export const STEPS = 16;

export const initialPattern: StepPattern = {
  kick: [true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
  snare: Array(STEPS).fill(false),
  hat: [true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false],
};

export function clonePattern(pattern: StepPattern): StepPattern {
  return { kick: [...pattern.kick], snare: [...pattern.snare], hat: [...pattern.hat] };
}

export function countPatternDifferences(left: StepPattern, right: StepPattern): number {
  return trackNames.reduce(
    (total, track) =>
      total + left[track].reduce(
        (trackTotal, active, step) => trackTotal + (active !== right[track][step] ? 1 : 0),
        0,
      ),
    0,
  );
}

export function hasNewOffbeatEvent(reference: StepPattern, variation: StepPattern): boolean {
  return trackNames.some((track) =>
    variation[track].some(
      (active, step) => active && !reference[track][step] && step % 4 !== 0,
    ),
  );
}
