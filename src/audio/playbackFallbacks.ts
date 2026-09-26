import {
  clonePattern,
  type Arrangement,
  type BassSequence,
  type HarmonySequence,
  type StepPattern,
} from "../music/model";
import {
  diatonicChord,
  harmonicBassRootMidi,
  type HarmonicProgression,
  type TonalContext,
} from "../music/harmony";

const FALLBACK_DEGREES = [1, 4, 5, 1] as const;

const fallbackDrumPattern: StepPattern = {
  kick: Array.from({ length: 16 }, (_, step) => step === 0 || step === 8),
  snare: Array.from({ length: 16 }, (_, step) => step === 4 || step === 12),
  hat: Array.from({ length: 16 }, (_, step) => step % 2 === 0),
};

export function hasDrumContent(pattern: StepPattern): boolean {
  return Object.values(pattern).some((lane) => lane.some(Boolean));
}

export function resolveContextDrumPattern(pattern: StepPattern): StepPattern {
  return hasDrumContent(pattern)
    ? pattern
    : clonePattern(fallbackDrumPattern);
}

export function hasWrittenHarmony(sequence: HarmonySequence): boolean {
  return sequence.some((notes) => notes.length > 0);
}

export function hasBassContent(sequence: BassSequence): boolean {
  return sequence.some((note) => note !== null);
}

export function resolveContextProgression(
  progression: HarmonicProgression,
  context: TonalContext,
): HarmonicProgression {
  if (progression.some((chord) => chord !== null)) return progression;

  return FALLBACK_DEGREES.map((degree) =>
    diatonicChord(context, degree),
  );
}

export function fallbackBassRoot(
  progression: HarmonicProgression,
  context: TonalContext,
  barIndex: number,
): number {
  const resolved = resolveContextProgression(progression, context);
  const chord =
    resolved[barIndex % resolved.length] ??
    diatonicChord(context, 1);
  return harmonicBassRootMidi(chord, context);
}

/**
 * Production-learning workspaces need every processor to have a continuous
 * audible target. They intentionally audition all four project layers in
 * every bar, without mutating the learner's stored arrangement.
 */
export function ensureProductionLayersPresent(
  arrangement: Arrangement,
): Arrangement {
  const barCount = Math.max(1, arrangement.length);
  return Array.from({ length: barCount }, () => ({
    drums: true,
    bass: true,
    chords: true,
    melody: true,
  }));
}
