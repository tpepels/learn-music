import type { Arrangement, MelodySequence } from "../music/model";
import {
  scaleSemitones,
  type TonalContext,
} from "../music/harmony";

export const ARRANGEMENT_STEPS_PER_BAR = 16;

const FALLBACK_MELODY_DEGREES = [
  0, 1, 2, 4,
  0, 1, 2, 4,
  4, 5, 4, 2,
  3, 2, 1, 0,
] as const;

export type ArrangementFrame = {
  barIndex: number;
  localStep: number;
  bar: Arrangement[number] | undefined;
  loopSteps: number;
};

export type ArrangementMelodyEvent = {
  step: number;
  midi: number | null;
  fallback: boolean;
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

export function hasArrangementMelody(
  melody: MelodySequence,
): boolean {
  return melody.some((note) => note !== null);
}

export function buildArrangementFallbackMelody(
  context: TonalContext,
): number[] {
  const tonicMidi = 60 + context.tonic;
  const scale = scaleSemitones[context.mode];

  return FALLBACK_MELODY_DEGREES.map(
    (degreeIndex) => tonicMidi + scale[degreeIndex],
  );
}

export function resolveArrangementMelodyEvent(
  globalStep: number,
  melody: MelodySequence,
  context: TonalContext,
): ArrangementMelodyEvent | null {
  const fallback = !hasArrangementMelody(melody);
  const source = fallback
    ? buildArrangementFallbackMelody(context)
    : melody;
  const step = resolveArrangementMelodyStep(globalStep, source.length);

  if (step === null) return null;

  return {
    step,
    midi: source[step] ?? null,
    fallback,
  };
}
