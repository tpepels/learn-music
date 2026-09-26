import { describe, expect, it } from "vitest";
import type { HarmonySequence } from "../music/model";
import { levinePentatonicScalesLesson } from "./levinePentatonicScales";
import { levineVoicingsVoicingsLesson } from "./levineVoicingsVoicings";
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

describe("Levine pentatonic and voicing continuation", () => {
  it("accepts the major/minor pentatonic rotation", () => {
    const checks = levinePentatonicScalesLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0,[60]],[1,[62]],[2,[64]],[3,[67]],[4,[69]],
          [16,[57]],[17,[60]],[18,[62]],[19,[64]],[20,[67]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l15.major-pentatonic:0"]),
          "harmony.note-edit": experiment(10),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts one G pentatonic field across the full II-V-I", () => {
    const checks = levinePentatonicScalesLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0,[53,60,67]],[1,[53,60,69]],[2,[53,60,71]],[3,[53,60,74]],[4,[53,60,76]],
          [8,[53,59,67]],[9,[53,59,69]],[10,[53,59,71]],[11,[53,59,74]],[12,[53,59,76]],
          [16,[52,59,67]],[17,[52,59,69]],[18,[52,59,71]],[19,[52,59,74]],[20,[52,59,76]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l15.v-pentatonic-ii-v-i:0"]),
          "harmony.note-edit": experiment(45),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the double-diminished eight-note construction", () => {
    const checks = levineVoicingsVoicingsLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0,[42,45,48,51]],
          [8,[53,56,59,62]],
          [16,[42,45,48,51,53,56,59,62]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l16.double-diminished:0"]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts the compact three-note voicing families", () => {
    const checks = levineVoicingsVoicingsLesson.exercises[3].evaluate(
      context({
        harmonySequence: sequence([
          [0,[59,60,64]],
          [8,[64,65,69]],
          [16,[62,63,67]],
          [24,[60,61,64]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l16.three-note-bite:0"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not pre-complete a pentatonic study from notes alone", () => {
    const checks = levinePentatonicScalesLesson.exercises[4].evaluate(
      context({
        harmonySequence: sequence([
          [0,[64]],[1,[65]],[2,[69]],[3,[71]],[4,[74]],
          [16,[64]],[17,[65]],[18,[69]],[19,[71]],[20,[73]],
        ]),
      }),
    );
    expect(checks.some((check) => check.complete)).toBe(true);
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});
