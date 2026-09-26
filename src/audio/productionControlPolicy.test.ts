import { describe, expect, it } from "vitest";
import {
  automationValueAtStep,
  effectiveMonoAudition,
  mixerControlTargets,
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
