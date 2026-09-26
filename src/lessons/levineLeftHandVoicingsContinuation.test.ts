import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineLeftHandVoicingsLesson } from "./levineLeftHandVoicings";
import { levineAlteredLeftHandVoicingsLesson } from "./levineAlteredLeftHandVoicings";
import type { LessonContext } from "./types";

function experiment(changes: number, values: string[] = []) {
  return { changes, min: null, max: null, values };
}

function blankSequence(): HarmonySequence {
  return Array.from({ length: 32 }, () => []);
}

function sequence(entries: Array<[number, number[]]>): HarmonySequence {
  const result = blankSequence();
  for (const [step, notes] of entries) result[step] = [...notes];
  return result;
}

function context(overrides: Partial<LessonContext>): LessonContext {
  return {
    tonalContext: { tonic: 0, mode: "major" },
    harmonicProgression: [null, null, null, null],
    harmonySequence: blankSequence(),
    experiments: {},
    ...overrides,
  } as LessonContext;
}

describe("Levine left-hand voicing continuation", () => {
  it("accepts the A-position rootless II-V-I only after study, edits and listening", () => {
    const checks = levineLeftHandVoicingsLesson.exercises[1].evaluate(
      context({
        harmonySequence: sequence([
          [0, [53, 57, 60, 64]],
          [8, [53, 57, 59, 64]],
          [16, [52, 55, 57, 62]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l07.a-position:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the B-position rootless II-V-I in the higher register", () => {
    const checks = levineLeftHandVoicingsLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0, [60, 64, 65, 69]],
          [8, [59, 64, 65, 69]],
          [16, [59, 60, 64, 67]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l07.b-position:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the four-stage dominant alteration comparison", () => {
    const checks = levineAlteredLeftHandVoicingsLesson.exercises[1].evaluate(
      context({
        harmonySequence: sequence([
          [0, [53, 57, 59, 64]],
          [8, [53, 56, 59, 64]],
          [16, [53, 57, 59, 63]],
          [24, [53, 58, 59, 63]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l08.dominant-alterations:0"]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the diminished-to-G7-flat-nine derivation", () => {
    const checks = levineAlteredLeftHandVoicingsLesson.exercises[3].evaluate(
      context({
        harmonySequence: sequence([
          [0, [53, 56, 59, 62]],
          [8, [53, 56, 59, 64]],
          [16, [59, 64, 65, 68]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l08.diminished-derivation:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not pre-complete an altered voicing study from notes alone", () => {
    const checks = levineAlteredLeftHandVoicingsLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0, [53, 57, 59, 64]],
          [8, [53, 57, 61, 64]],
          [16, [50, 53, 57, 61, 64]],
        ]),
      }),
    );

    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
