import { describe, expect, it } from "vitest";
import type { ArrangementBar } from "../music/model";
import type { LessonContext } from "./types";
import { schoenbergSmallTernaryLesson } from "./schoenbergSmallTernary";
import { schoenbergIrregularConstructionLesson } from "./schoenbergIrregularConstruction";
import { schoenbergMinuetLesson } from "./schoenbergMinuet";
import { schoenbergScherzoLesson } from "./schoenbergScherzo";
import { schoenbergThemeVariationsLesson } from "./schoenbergThemeVariations";

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

function context(
  overrides: Partial<LessonContext>,
): LessonContext {
  return {
    experiments: {},
    melody: Array(16).fill(null),
    harmonySequence: Array.from({ length: 32 }, () => []),
    arrangement: Array.from({ length: 8 }, () => layers(false, false, false, false)),
    formSettings: {
      sections: ["A", "A′", "B", "A"],
      roles: ["statement", "answer", "contrast", "return"],
      layers: Array.from({ length: 4 }, () => layers(false, false, false, false)),
    },
    textureSettings: {
      bassOctave: 0,
      chordsOctave: 0,
      melodyOctave: 0,
      openChords: false,
      melodyOctaveDouble: false,
    },
    ...overrides,
  } as LessonContext;
}

describe("Schoenberg S11-S15 evaluator logic", () => {
  it("recognises a coherent small ternary departure and return", () => {
    const a = layers(true, true, true, false);
    const b = layers(true, false, false, true);
    const aPrime = layers(true, true, false, true);
    const checks = schoenbergSmallTernaryLesson.exercises[0].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "A′", "A′"],
          roles: ["statement", "contrast", "return", "return"],
          layers: [a, b, aPrime, aPrime],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s11.ternary-form:0",
            "s11.ternary-form:1",
            "s11.ternary-form:2",
            "s11.ternary-form:3",
          ]),
          "form.layer.test": experiment(2),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises an irregular phrase with off-centre punctuation and closure", () => {
    const melody = [
      60, 62, 64, 65,
      null, null, 67, 69,
      60, null, 64, null,
      67, null, null, 72,
    ];
    const checks = schoenbergIrregularConstructionLesson.exercises[3].evaluate(
      context({
        melody,
        experiments: {
          "melody.edit": experiment(6),
          "transport.play": experiment(2),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises minuet-trio contrast followed by an exact principal return", () => {
    const a = layers(true, true, true, false);
    const trio = layers(true, false, false, true);
    const checks = schoenbergMinuetLesson.exercises[2].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "A", "A′"],
          roles: ["statement", "contrast", "return", "return"],
          layers: [a, trio, { ...a }, { ...a }],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s13.trio:0",
            "s13.trio:1",
            "s13.trio:2",
            "s13.trio:3",
          ]),
          "form.layer.test": experiment(3),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises liquidation into a sparse residue before the scherzo return", () => {
    const melody = [
      60, 62, 65, 64,
      67, 65, 64, 62,
      60, 62, 64, 65,
      60, null, null, null,
    ];
    const checks = schoenbergScherzoLesson.exercises[2].evaluate(
      context({
        melody,
        experiments: {
          "source.analysis": experiment(4, [
            "s14.modulatory-middle:0",
            "s14.modulatory-middle:1",
            "s14.modulatory-middle:2",
            "s14.modulatory-middle:3",
          ]),
          "melody.edit": experiment(4),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises a variation set with distinct sparse-to-full characters", () => {
    const arrangement = [
      layers(true, false, false, false),
      layers(true, true, false, false),
      layers(true, true, true, false),
      layers(true, true, true, true),
      ...Array.from({ length: 4 }, () => layers(false, false, false, false)),
    ];
    const checks = schoenbergThemeVariationsLesson.exercises[3].evaluate(
      context({
        arrangement,
        experiments: {
          "source.analysis": experiment(5, [
            "s15.variation-set:0",
            "s15.variation-set:1",
            "s15.variation-set:2",
            "s15.variation-set:3",
            "s15.variation-set:4",
          ]),
          "arrangement.edit": experiment(6),
          "transport.play": experiment(1),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });
});
