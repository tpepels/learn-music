import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levineBlockChordsLesson } from "./levineBlockChords";
import { levineSalsaLatinJazzLesson } from "./levineSalsaLatinJazz";
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

describe("Levine block-chord and salsa chapters", () => {
  it("accepts the four-way-close diminished alternation", () => {
    const checks = levineBlockChordsLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60,64,67,69]],[1,[59,62,65,68]],[2,[64,67,69,72]],[3,[62,65,68,71]],
          [4,[60,64,67,69]],[5,[59,62,65,68]],[6,[64,67,69,72]],[7,[62,65,68,71]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l19.four-way-close:0"]),
          "harmony.note-edit": experiment(32),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the drop-2 chromatic approach sequence", () => {
    const checks = levineBlockChordsLesson.exercises[3].evaluate(
      context({
        harmonySequence: sequence([
          [0,[54,59,63,68]],
          [8,[55,60,64,69]],
          [16,[56,61,65,70]],
          [24,[55,60,64,69]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l19.chromatic-parallelism:0"]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts forward and reverse son clave", () => {
    const checks = levineSalsaLatinJazzLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60]],[3,[60]],[6,[60]],[10,[60]],[12,[60]],
          [18,[60]],[20,[60]],[24,[60]],[27,[60]],[30,[60]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l20.clave:0"]),
          "harmony.note-edit": experiment(10),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a stable montuno rhythm across changing harmony", () => {
    const checks = levineSalsaLatinJazzLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60,63,67,69]],[3,[60,63,67,69]],[5,[60,63,67,69]],[7,[60,63,67,69]],
          [8,[60,63,67,70]],[11,[60,63,67,70]],[13,[60,63,67,70]],[15,[60,63,67,70]],
          [16,[60,64,67,70]],[19,[60,64,67,70]],[21,[60,64,67,70]],[23,[60,64,67,70]],
          [24,[59,62,65,67]],[27,[59,62,65,67]],[29,[59,62,65,67]],[31,[59,62,65,67]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l20.harmonic-montunos:0"]),
          "harmony.note-edit": experiment(64),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not complete a salsa study from notes alone", () => {
    const checks = levineSalsaLatinJazzLesson.exercises[4].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60,72]],[3,[60,72]],[6,[64,67,70,72]],
          [9,[62,74]],[13,[62,74]],[15,[64,67,70,74]],
          [16,[60,72]],[19,[60,72]],[22,[64,67,70,72]],
          [25,[62,74]],[29,[62,74]],[31,[64,67,70,74]],
        ]),
      }),
    );
    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
