import { describe, expect, it } from "vitest";
import type { ArrangementBar } from "../music/model";
import type { LessonContext } from "./types";
import { belkinContrastingLesson } from "./belkinContrasting";
import { belkinConnectingLesson } from "./belkinConnecting";
import { belkinProgressingLesson } from "./belkinProgressing";

function experiment(changes: number, values: string[] = []) {
  return { changes, min: null, max: null, values };
}

function layers(
  drums: boolean,
  bass: boolean,
  chords: boolean,
  melody: boolean,
): ArrangementBar {
  return { drums, bass, chords, melody };
}

function context(overrides: Partial<LessonContext> = {}): LessonContext {
  return {
    experiments: {},
    melody: Array(16).fill(null),
    melodyDurations: Array(16).fill(1),
    arrangement: Array.from({ length: 8 }, () => layers(false, false, false, false)),
    ...overrides,
  } as LessonContext;
}

describe("Belkin B04-B06 evaluator logic", () => {
  it("recognises mild, moderate and strong degrees of contrast", () => {
    const base = layers(true, true, false, false);
    const arrangement = [
      base,
      base,
      layers(true, true, true, false),
      base,
      layers(true, false, true, true),
      base,
      layers(false, false, true, true),
      base,
    ];
    const checks = belkinContrastingLesson.exercises[0].evaluate(
      context({
        arrangement,
        experiments: {
          "source.analysis": experiment(4, [
            "b04.contrast-scale:0",
            "b04.contrast-scale:1",
            "b04.contrast-scale:2",
            "b04.contrast-scale:3",
          ]),
          "arrangement.edit": experiment(8),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises a smooth transition that changes at most one layer per step", () => {
    const arrangement = [
      layers(true, true, true, false),
      layers(true, true, true, true),
      layers(false, true, true, true),
      layers(false, false, true, true),
      layers(false, false, false, true),
      layers(false, false, false, true),
      layers(false, false, false, true),
      layers(false, false, false, true),
    ];
    const checks = belkinConnectingLesson.exercises[0].evaluate(
      context({
        arrangement,
        experiments: {
          "source.analysis": experiment(4, [
            "b05.gradual-transition:0",
            "b05.gradual-transition:1",
            "b05.gradual-transition:2",
            "b05.gradual-transition:3",
          ]),
          "arrangement.edit": experiment(8),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises an accelerating approach that resolves into a longer final event", () => {
    const melody = [
      60, null, 62, null,
      64, null, 65, null,
      67, 69, 71, null,
      72, 74, null, 76,
    ];
    const durations = [
      2, 1, 2, 1,
      2, 1, 2, 1,
      1, 1, 1, 1,
      1, 1, 1, 2,
    ];
    const checks = belkinProgressingLesson.exercises[3].evaluate(
      context({
        melody,
        melodyDurations: durations,
        experiments: {
          "source.analysis": experiment(3, [
            "b06.accelerating-climax:0",
            "b06.accelerating-climax:1",
            "b06.accelerating-climax:2",
          ]),
          "melody.edit": experiment(8),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("keeps every new evaluator safe on a fresh project state", () => {
    for (const lesson of [
      belkinContrastingLesson,
      belkinConnectingLesson,
      belkinProgressingLesson,
    ]) {
      for (const exercise of lesson.exercises) {
        expect(() => exercise.evaluate(context()), exercise.id).not.toThrow();
      }
    }
  });
});
