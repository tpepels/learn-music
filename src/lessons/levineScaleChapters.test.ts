import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineScaleTheoryLesson } from "./levineScaleTheory";
import { levinePuttingScalesToWorkLesson } from "./levinePuttingScalesToWork";
import { levinePracticingScalesLesson } from "./levinePracticingScales";
import type { LessonContext } from "./types";

function experiment(changes: number, values: string[] = []) {
  return { changes, min: null, max: null, values };
}

function blankSequence(): HarmonySequence {
  return Array.from({ length: 32 }, () => []);
}

function sequence(notes: Array<[number, number | number[]]>): HarmonySequence {
  const result = blankSequence();
  for (const [step, note] of notes) {
    result[step] = Array.isArray(note) ? [...note] : [note];
  }
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

describe("Levine scale chapters", () => {
  it("accepts the Ionian/Lydian comparison only with study, edits and listening", () => {
    const checks = levineScaleTheoryLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[52,59,60]],[1,[52,59,62]],[2,[52,59,64]],[3,[52,59,65]],
          [4,[52,59,67]],[5,[52,59,69]],[6,[52,59,71]],[7,[52,59,72]],
          [16,[52,59,60]],[17,[52,59,62]],[18,[52,59,64]],[19,[52,59,66]],
          [20,[52,59,67]],[21,[52,59,69]],[22,[52,59,71]],[23,[52,59,72]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l09.major-scale-harmony:0"]),
          "harmony.note-edit": experiment(48),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a continuous minor II-V-I sequence", () => {
    const checks = levinePuttingScalesToWorkLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,62],[1,64],[2,65],[3,67],
          [4,68],[5,70],[6,71],[7,73],
          [8,72],[9,74],[10,75],[11,77],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l10.sequence-linking:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the changed-starting-note practice routine", () => {
    const checks = levinePracticingScalesLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,60],[1,62],[2,64],[3,65],[4,67],[5,69],[6,71],[7,72],
          [8,74],[9,72],[10,71],[11,69],[12,67],[13,65],[14,64],[15,62],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l11.starting-notes:0"]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not complete scale studies from the notes alone", () => {
    const checks = levineScaleTheoryLesson.exercises[4].evaluate(
      context({
        harmonySequence: sequence([
          [0,55],[1,57],[2,59],[3,61],[4,63],[5,65],
          [16,56],[17,58],[18,60],[19,62],[20,64],[21,66],
        ]),
      }),
    );
    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
