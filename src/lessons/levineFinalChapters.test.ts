import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineCompingLesson } from "./levineComping";
import { levineLooseEndsLesson } from "./levineLooseEnds";
import { levinePracticePracticePracticeLesson } from "./levinePracticePracticePractice";
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

describe("Levine final chapters", () => {
  it("accepts the comping timing comparison", () => {
    const checks = levineCompingLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [1,[60,64,67,69]],
          [8,[60,64,67,69]],
          [15,[60,64,67,69]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l21.timing:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the three sus families and their common resolution", () => {
    const checks = levineLooseEndsLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[55]],[1,[57]],[2,[59]],[3,[60]],[4,[62]],[5,[64]],[6,[65]],[7,[67]],
          [8,[55]],[9,[56]],[10,[58]],[11,[60]],[12,[62]],[13,[63]],[14,[65]],[15,[67]],
          [16,[55]],[17,[56]],[18,[58]],[19,[60]],[20,[62]],[21,[64]],[22,[65]],[23,[67]],
          [24,[48,52,55,59]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l22.sus-families:0"]),
          "harmony.note-edit": experiment(28),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the major-third-cycle turnaround", () => {
    const checks = levineLooseEndsLesson.exercises[4].evaluate(
      context({
        harmonySequence: sequence([
          [0,[52,55,59,62]],
          [4,[53,57,60,63]],
          [8,[46,50,53,57]],
          [12,[49,53,56,59]],
          [16,[42,46,49,53]],
          [20,[45,49,52,55]],
          [24,[50,54,57,61]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l22.coltrane-cycle:0"]),
          "harmony.note-edit": experiment(28),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the all-keys rootless II-V-I practice", () => {
    const checks = levinePracticePracticePracticeLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[53,57,60,64]],[4,[53,57,59,64]],[6,[52,55,57,62]],
          [16,[58,62,65,69]],[20,[58,62,64,69]],[22,[57,60,62,67]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l23.all-keys:0"]),
          "harmony.note-edit": experiment(24),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not complete the final phrase-variation study from notes alone", () => {
    const checks = levinePracticePracticePracticeLesson.exercises[4].evaluate(
      context({
        harmonySequence: sequence([
          [0,[67]],[1,[69]],[2,[71]],[3,[76]],
          [8,[74]],[9,[71]],[10,[69]],[11,[67]],
          [16,[72]],[17,[74]],[18,[76]],[19,[81]],
          [24,[79]],[25,[76]],[26,[74]],[27,[72]],
        ]),
      }),
    );
    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
