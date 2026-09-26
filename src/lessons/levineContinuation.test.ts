import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineSusPhrygianLesson } from "./levineSusPhrygian";
import { levineAddingNotesLesson } from "./levineAddingNotes";
import { levineTritoneSubstitutionLesson } from "./levineTritoneSubstitution";
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

describe("Levine Chapters Four through Six evaluators", () => {
  it("accepts the G7-over-E Phrygian resolution only with study, edits and listening", () => {
    const checks = levineSusPhrygianLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0, [52, 55, 59, 62, 65]],
          [8, [57, 61, 64, 68]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l04.phrygian:0"]),
          "harmony.note-edit": experiment(9),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the enriched II-V-I with the fifth-to-ninth common tone", () => {
    const checks = levineAddingNotesLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0, [50, 65, 69, 72]],
          [8, [55, 65, 69, 71]],
          [16, [48, 64, 67, 71]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l05.add-to-shells:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts original and tritone-substituted II-V-I comparisons", () => {
    const checks = levineTritoneSubstitutionLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0, [50, 53, 57, 60]],
          [4, [55, 59, 62, 65]],
          [8, [48, 52, 55, 59]],
          [16, [50, 53, 57, 60]],
          [20, [49, 53, 56, 59]],
          [24, [48, 52, 55, 59]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l06.basic-substitution:0"]),
          "harmony.note-edit": experiment(24),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not complete a new lesson from inherited notes alone", () => {
    const checks = levineTritoneSubstitutionLesson.exercises[1].evaluate(
      context({
        harmonySequence: sequence([
          [0, [55, 59, 65]],
          [8, [49, 59, 65]],
        ]),
      }),
    );

    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
