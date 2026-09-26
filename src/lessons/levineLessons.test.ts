import { describe, expect, it } from "vitest";
import { diatonicChord, type HarmonicProgression, type TonalContext } from "../music/harmony";
import type { HarmonySequence } from "../music/model";
import { levineIntervalsTriadsLesson } from "./levineIntervalsTriads";
import { levineMajorModesIiViLesson } from "./levineMajorModesIiVi";
import { levineThreeNoteVoicingsLesson } from "./levineThreeNoteVoicings";
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

function progression(
  context: TonalContext,
  degrees: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | null>,
): HarmonicProgression {
  return degrees.map((degree) =>
    degree === null ? null : diatonicChord(context, degree, true),
  );
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

describe("Levine lesson evaluators", () => {
  it("accepts the four-triad quality study only with source study, edits and listening", () => {
    const checks = levineIntervalsTriadsLesson.exercises[2].evaluate(
      context({
        harmonySequence: sequence([
          [0, [60, 64, 67]],
          [8, [60, 63, 67]],
          [16, [60, 63, 66]],
          [24, [60, 64, 68]],
        ]),
        experiments: {
          "source.play": experiment(1, ["l01.fig1-6"]),
          "harmony.note-edit": experiment(12),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("does not pre-complete an interval study from final notes alone", () => {
    const checks = levineIntervalsTriadsLesson.exercises[0].evaluate(
      context({
        harmonySequence: sequence([
          [0, [60, 61]],
          [8, [60, 64]],
          [16, [60, 66]],
          [24, [60, 67]],
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(false);
  });

  it("accepts the modal seventh-chord derivation in C", () => {
    const tonalContext: TonalContext = { tonic: 0, mode: "major" };
    const checks = levineMajorModesIiViLesson.exercises[0].evaluate(
      context({
        tonalContext,
        harmonicProgression: progression(tonalContext, [1, 2, 5, 1]),
        harmonySequence: sequence([
          [0, [48, 52, 55, 59]],
          [8, [50, 53, 57, 60]],
          [16, [55, 59, 62, 65]],
          [24, [48, 52, 55, 59]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l02.fig2-1:0"]),
          "source.play": experiment(3, [
            "l02.fig2-2",
            "l02.fig2-4",
            "l02.fig2-6",
          ]),
          "harmony.note-edit": experiment(16),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts II-V-I transposed to F only when the written notes move too", () => {
    const tonalContext: TonalContext = { tonic: 5, mode: "major" };
    const base = context({
      tonalContext,
      harmonicProgression: progression(tonalContext, [2, 5, 1, null]),
      experiments: {
        "harmony.key": experiment(1, ["5:major"]),
        "harmony.note-edit": experiment(12),
        "transport.play": experiment(1, ["jazz-piano"]),
      },
    });

    const correct = levineMajorModesIiViLesson.exercises[2].evaluate({
      ...base,
      harmonySequence: sequence([
        [0, [55, 58, 62, 65]],
        [8, [48, 52, 55, 58]],
        [16, [53, 57, 60, 64]],
      ]),
    });
    expect(correct.every((check) => check.complete)).toBe(true);

    const staleCNotes = levineMajorModesIiViLesson.exercises[2].evaluate({
      ...base,
      harmonySequence: sequence([
        [0, [50, 53, 57, 60]],
        [8, [55, 59, 62, 65]],
        [16, [48, 52, 55, 59]],
      ]),
    });
    expect(staleCNotes.every((check) => check.complete)).toBe(false);
  });

  it("accepts both compact C-major three-note voicing positions", () => {
    const tonalContext: TonalContext = { tonic: 0, mode: "major" };
    const harmonicProgression = progression(tonalContext, [2, 5, 1, null]);

    const first = levineThreeNoteVoicingsLesson.exercises[0].evaluate(
      context({
        tonalContext,
        harmonicProgression,
        harmonySequence: sequence([
          [0, [50, 65, 72]],
          [8, [55, 65, 71]],
          [16, [48, 64, 71]],
        ]),
        experiments: {
          "source.play": experiment(1, ["l03.fig3-2"]),
          "harmony.note-edit": experiment(9),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(first.every((check) => check.complete)).toBe(true);

    const second = levineThreeNoteVoicingsLesson.exercises[1].evaluate(
      context({
        tonalContext,
        harmonicProgression,
        harmonySequence: sequence([
          [0, [50, 60, 65]],
          [8, [55, 59, 65]],
          [16, [48, 59, 64]],
        ]),
        experiments: {
          "source.analysis": experiment(3, [
            "l03.fig3-4:0",
            "l03.fig3-4:1",
            "l03.fig3-4:2",
          ]),
          "harmony.note-edit": experiment(9),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );
    expect(second.every((check) => check.complete)).toBe(true);
  });

  it("accepts the compact voicing rule transposed to F", () => {
    const tonalContext: TonalContext = { tonic: 5, mode: "major" };
    const checks = levineThreeNoteVoicingsLesson.exercises[2].evaluate(
      context({
        tonalContext,
        harmonicProgression: progression(tonalContext, [2, 5, 1, null]),
        harmonySequence: sequence([
          [0, [55, 65, 70]],
          [8, [48, 64, 70]],
          [16, [53, 64, 69]],
        ]),
        experiments: {
          "source.analysis": experiment(1, ["l03.fig3-3:0"]),
          "harmony.key": experiment(1, ["5:major"]),
          "harmony.note-edit": experiment(9),
          "transport.play": experiment(1, ["jazz-piano"]),
        },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });
});
