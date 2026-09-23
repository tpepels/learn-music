import type { Arrangement } from "../music/model";

export const ARRANGEMENT_STEPS_PER_BAR = 16;

export type ArrangementFrame = {
  barIndex: number;
  localStep: number;
  bar: Arrangement[number] | undefined;
  loopSteps: number;
};

export function resolveArrangementFrame(
  arrangement: Arrangement,
  globalStep: number,
): ArrangementFrame {
  const barCount = Math.max(1, arrangement.length);
  const loopSteps = barCount * ARRANGEMENT_STEPS_PER_BAR;
  const loopStep =
    ((globalStep % loopSteps) + loopSteps) % loopSteps;
  const barIndex = Math.floor(
    loopStep / ARRANGEMENT_STEPS_PER_BAR,
  );

  return {
    barIndex,
    localStep: loopStep % ARRANGEMENT_STEPS_PER_BAR,
    bar: arrangement[barIndex],
    loopSteps,
  };
}

export function resolveArrangementMelodyStep(
  globalStep: number,
  melodyLength: number,
): number | null {
  if (globalStep % 2 !== 0 || melodyLength <= 0) return null;
  return Math.floor(globalStep / 2) % melodyLength;
}
