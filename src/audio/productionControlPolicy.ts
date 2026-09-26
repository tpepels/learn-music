import type { ExerciseDefinition } from "../lessons/types";
import type { MixerTrackSettings } from "../music/model";

export type MixerControlTargets = {
  pan: number;
  highpass: number;
  reverb: number;
  delay: number;
};

export function effectiveMonoAudition(
  workspace: ExerciseDefinition["workspace"],
  requested: boolean,
): boolean {
  return workspace === "stereo" && requested;
}

export function mixerControlTargets(
  settings: MixerTrackSettings,
  monoAudition: boolean,
): MixerControlTargets {
  return {
    pan: monoAudition ? 0 : settings.pan,
    highpass: Math.max(20, settings.highpass),
    reverb: monoAudition ? 0 : settings.reverb,
    delay: monoAudition ? 0 : settings.delay,
  };
}

export function automationValueAtStep(
  values: readonly number[],
  globalStep: number,
  stepsPerBar = 16,
): number {
  if (values.length === 0) return 0;

  const safeStep = Math.max(0, globalStep);
  const barIndex = Math.floor(safeStep / stepsPerBar) % values.length;
  const localStep = safeStep % stepsPerBar;
  const nextBar = (barIndex + 1) % values.length;
  const current = values[barIndex] ?? 0;
  const next = values[nextBar] ?? current;
  const progress = localStep / stepsPerBar;

  return current + (next - current) * progress;
}
