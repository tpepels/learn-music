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

export type RampableParam = {
  rampTo(value: number, rampTime: number): unknown;
};

export type ScheduledRampParam = {
  cancelScheduledValues(time: number): unknown;
  setValueAtTime(value: number, time: number): unknown;
  linearRampToValueAtTime(value: number, time: number): unknown;
};

export function applyMixerControlTargets(
  params: {
    pan?: RampableParam;
    highpass?: RampableParam;
    reverb?: RampableParam;
    delay?: RampableParam;
  },
  targets: MixerControlTargets,
  rampTime = 0.03,
): void {
  params.pan?.rampTo(targets.pan, rampTime);
  params.highpass?.rampTo(targets.highpass, rampTime);
  params.reverb?.rampTo(targets.reverb, rampTime);
  params.delay?.rampTo(targets.delay, rampTime);
}

export function applyDynamicsControlTargets(
  params: {
    threshold: RampableParam;
    ratio: RampableParam;
    attack: RampableParam;
    release: RampableParam;
  },
  targets: {
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
  },
  rampTime = 0.02,
): void {
  params.threshold.rampTo(targets.threshold, rampTime);
  params.ratio.rampTo(targets.ratio, rampTime);
  params.attack.rampTo(targets.attack, rampTime);
  params.release.rampTo(targets.release, rampTime);
}

export type AutomationRampPlan = {
  current: number;
  next: number;
  remainingSteps: number;
};

export function automationRampPlanAtStep(
  values: readonly number[],
  globalStep: number,
  stepsPerBar = 16,
): AutomationRampPlan {
  if (values.length === 0) {
    return {
      current: 0,
      next: 0,
      remainingSteps: stepsPerBar,
    };
  }

  const safeStep = Math.max(0, globalStep);
  const localStep = safeStep % stepsPerBar;
  const barIndex = Math.floor(safeStep / stepsPerBar) % values.length;
  const nextBar = (barIndex + 1) % values.length;

  return {
    current: automationValueAtStep(values, safeStep, stepsPerBar),
    next: values[nextBar] ?? values[barIndex] ?? 0,
    remainingSteps: stepsPerBar - localStep,
  };
}

export function replaceScheduledLinearRamp(
  param: ScheduledRampParam,
  current: number,
  next: number,
  now: number,
  duration: number,
): void {
  param.cancelScheduledValues(now);
  param.setValueAtTime(current, now);
  param.linearRampToValueAtTime(next, now + Math.max(0, duration));
}

