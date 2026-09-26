import { describe, expect, it, vi } from "vitest";
import {
  applyDynamicsControlTargets,
  applyMixerControlTargets,
  automationRampPlanAtStep,
  automationValueAtStep,
  effectiveMonoAudition,
  mixerControlTargets,
  replaceScheduledLinearRamp,
} from "./productionControlPolicy";

describe("production control audio policy", () => {
  it("keeps mono audition local to the stereo lesson", () => {
    expect(effectiveMonoAudition("stereo", true)).toBe(true);
    expect(effectiveMonoAudition("mixer", true)).toBe(false);
    expect(effectiveMonoAudition("automation-dynamics", true)).toBe(false);
    expect(effectiveMonoAudition("effects", true)).toBe(false);
  });

  it("maps Lesson 7 controls to distinct audible mixer targets", () => {
    const settings = {
      volume: -3,
      pan: -0.8,
      highpass: 275,
      reverb: 0.34,
      delay: 0.22,
    };

    expect(mixerControlTargets(settings, false)).toEqual({
      pan: -0.8,
      highpass: 275,
      reverb: 0.34,
      delay: 0.22,
    });
  });

  it("only collapses spatial controls during an explicit mono check", () => {
    const settings = {
      volume: 0,
      pan: 0.75,
      highpass: 180,
      reverb: 0.25,
      delay: 0.18,
    };

    expect(mixerControlTargets(settings, true)).toEqual({
      pan: 0,
      highpass: 180,
      reverb: 0,
      delay: 0,
    });
  });

  it("pushes every Lesson 7 control into its live audio parameter", () => {
    const pan = { rampTo: vi.fn() };
    const highpass = { rampTo: vi.fn() };
    const reverb = { rampTo: vi.fn() };
    const delay = { rampTo: vi.fn() };

    applyMixerControlTargets(
      { pan, highpass, reverb, delay },
      {
        pan: -0.75,
        highpass: 1200,
        reverb: 0.4,
        delay: 0.3,
      },
    );

    expect(pan.rampTo).toHaveBeenCalledWith(-0.75, 0.03);
    expect(highpass.rampTo).toHaveBeenCalledWith(1200, 0.03);
    expect(reverb.rampTo).toHaveBeenCalledWith(0.4, 0.03);
    expect(delay.rampTo).toHaveBeenCalledWith(0.3, 0.03);
  });

  it("pushes every Lesson 8 compressor control into the live compressor", () => {
    const threshold = { rampTo: vi.fn() };
    const ratio = { rampTo: vi.fn() };
    const attack = { rampTo: vi.fn() };
    const release = { rampTo: vi.fn() };

    applyDynamicsControlTargets(
      { threshold, ratio, attack, release },
      {
        threshold: -34,
        ratio: 9,
        attack: 0.08,
        release: 0.7,
      },
    );

    expect(threshold.rampTo).toHaveBeenCalledWith(-34, 0.02);
    expect(ratio.rampTo).toHaveBeenCalledWith(9, 0.02);
    expect(attack.rampTo).toHaveBeenCalledWith(0.08, 0.02);
    expect(release.rampTo).toHaveBeenCalledWith(0.7, 0.02);
  });

  it("replaces stale live automation ramps instead of letting them overwrite edits", () => {
    const param = {
      cancelScheduledValues: vi.fn(),
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    };

    replaceScheduledLinearRamp(param, 800, 5000, 12.5, 0.75);

    expect(param.cancelScheduledValues).toHaveBeenCalledWith(12.5);
    expect(param.setValueAtTime).toHaveBeenCalledWith(800, 12.5);
    expect(param.linearRampToValueAtTime).toHaveBeenCalledWith(5000, 13.25);
  });

  it("plans a live automation replacement from the current point to the next bar", () => {
    expect(automationRampPlanAtStep([-12, -4, 0, 3], 8)).toEqual({
      current: -8,
      next: -4,
      remainingSteps: 8,
    });
    expect(automationRampPlanAtStep([400, 4000, 8000, 12000], 56)).toEqual({
      current: 6200,
      next: 400,
      remainingSteps: 8,
    });
  });

  it("interpolates Lesson 8 automation continuously inside each bar", () => {
    const values = [-12, -4, 0, 3];

    expect(automationValueAtStep(values, 0)).toBe(-12);
    expect(automationValueAtStep(values, 8)).toBe(-8);
    expect(automationValueAtStep(values, 16)).toBe(-4);
    expect(automationValueAtStep(values, 24)).toBe(-2);
    expect(automationValueAtStep(values, 32)).toBe(0);
  });

  it("wraps the final automation bar back toward the first", () => {
    const values = [400, 4000, 8000, 12000];

    expect(automationValueAtStep(values, 48)).toBe(12000);
    expect(automationValueAtStep(values, 56)).toBe(6200);
    expect(automationValueAtStep(values, 64)).toBe(400);
  });
});
