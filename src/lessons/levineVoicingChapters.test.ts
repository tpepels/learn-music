import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineSoWhatChordsLesson } from "./levineSoWhatChords";
import { levineFourthChordsLesson } from "./levineFourthChords";
import { levineUpperStructuresLesson } from "./levineUpperStructures";
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

describe("Levine quartal and upper-structure chapters", () => {
  it("accepts the transposed five-note So What shape", () => {
    const checks = levineSoWhatChordsLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0, [50, 55, 60, 65, 69]],
          [8, [52, 57, 62, 67, 71]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l12.basic-shape:0"]),
          "harmony.note-edit": experiment(10),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the diatonic quartal extension", () => {
    const checks = levineFourthChordsLesson.exercises[1].evaluate(
      context({
        harmonySequence: sequence([
          [0, [52, 57, 62, 67, 72]],
          [8, [53, 59, 64, 69, 74]],
          [16, [55, 60, 65, 71, 76]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l13.diatonic-fourths:0"]),
          "harmony.note-edit": experiment(15),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the four basic upper structures", () => {
    const checks = levineUpperStructuresLesson.exercises[1].evaluate(
      context({
        harmonySequence: sequence([
          [0, [52, 58, 62, 66, 69]],
          [8, [52, 58, 63, 68, 72]],
          [16, [52, 58, 64, 69, 73]],
          [24, [52, 58, 61, 66, 69]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l14.basic-family:0"]),
          "harmony.note-edit": experiment(20),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts diminished upper-structure motion only with full evidence", () => {
    const notes = sequence([
      [0, [59, 65, 70, 74]],
      [8, [59, 61, 65, 68]],
      [16, [59, 64, 65, 68, 71]],
      [24, [59, 65, 67, 71, 74]],
    ]);
    const complete = levineUpperStructuresLesson.exercises[4].evaluate(
      context({
        harmonySequence: notes,
        experiments: {
          "source.analysis": experiment(1, ["l14.diminished-symmetry:0"]),
          "harmony.note-edit": experiment(18),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(complete.every((check) => check.complete)).toBe(true);

    const notesOnly = levineUpperStructuresLesson.exercises[4].evaluate(
      context({ harmonySequence: notes }),
    );
    expect(notesOnly.some((check) => check.complete)).toBe(true);
    expect(notesOnly.every((check) => check.complete)).toBe(false);
  });
});
