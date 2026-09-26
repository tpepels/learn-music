import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineStrideBudPowellLesson } from "./levineStrideBudPowell";
import { levineFourNoteScalesLesson } from "./levineFourNoteScales";
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

describe("Levine stride and four-note scale chapters", () => {
  it("accepts the four-bar stride pulse", () => {
    const checks = levineStrideBudPowellLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[36]],[2,[52,55,60]],[4,[43]],[6,[52,55,60]],
          [8,[45]],[10,[55,61,64]],[12,[40]],[14,[55,61,64]],
          [16,[38]],[18,[48,54,57]],[20,[45]],[22,[48,54,57]],
          [24,[43]],[26,[53,59,62]],[28,[38]],[30,[53,59,62]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l17.stride-pulse:0"]),
          "harmony.note-edit": experiment(32),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the Bud Powell shell comparison", () => {
    const checks = levineStrideBudPowellLesson.exercises[3].evaluate(
      context({
        harmonySequence: sequence([
          [0,[43,53]],[8,[48,58]],[16,[41,57]],[24,[52,55,57,62]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l17.bud-powell-shells:0"]),
          "harmony.note-edit": experiment(10),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the minor-sixth scale reinterpretation", () => {
    const checks = levineFourNoteScalesLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60]],[1,[63]],[2,[67]],[3,[69]],
          [16,[52,58,60]],[17,[52,58,63]],[18,[52,58,67]],[19,[52,58,69]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l18.minor-sixth:0"]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts all four modes of the invented C-D-F-G cell", () => {
    const checks = levineFourNoteScalesLesson.exercises[4].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60]],[1,[62]],[2,[65]],[3,[67]],
          [8,[62]],[9,[65]],[10,[67]],[11,[72]],
          [16,[65]],[17,[67]],[18,[72]],[19,[74]],
          [24,[67]],[25,[72]],[26,[74]],[27,[77]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l18.invent-and-rotate:0"]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not complete a four-note-scale study from notes alone", () => {
    const checks = levineFourNoteScalesLesson.exercises[3].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60,63,67,71]],
          [8,[63,67,71,74]],
          [16,[60,63,67,71]],
          [20,[63,67,71,74]],
        ]),
      }),
    );
    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
