import { describe, expect, it } from "vitest";
import { clonePattern, initialPattern, type StepPattern } from "../music/model";
import { evaluatePulseAndGroove } from "./pulseAndGroove";
import { evaluateRhythmVariation } from "./rhythmVariation";

describe("pulse and groove lesson", () => {
  it("requires the snare backbeat", () => {
    const pattern = clonePattern(initialPattern);
    expect(evaluatePulseAndGroove(pattern).every((check) => check.complete)).toBe(false);

    pattern.snare[4] = true;
    pattern.snare[12] = true;

    expect(evaluatePulseAndGroove(pattern).every((check) => check.complete)).toBe(true);
  });
});

describe("rhythm variation lesson", () => {
  function completedGroove(): StepPattern {
    const pattern = clonePattern(initialPattern);
    pattern.snare[4] = true;
    pattern.snare[12] = true;
    return pattern;
  }

  it("accepts a restrained offbeat variation", () => {
    const reference = completedGroove();
    const variation = clonePattern(reference);
    variation.kick[6] = true;
    variation.hat[14] = false;

    expect(evaluateRhythmVariation(reference, variation).every((check) => check.complete)).toBe(true);
  });

  it("rejects changing too much", () => {
    const reference = completedGroove();
    const variation = clonePattern(reference);

    for (let step = 0; step < 8; step += 1) {
      variation.hat[step] = !variation.hat[step];
    }

    const checks = evaluateRhythmVariation(reference, variation);
    expect(checks.find((check) => check.label.includes("no more than six"))?.complete).toBe(false);
  });
});
