import { describe, expect, it } from "vitest";
import { chordColorExtensionsLesson } from "./chordColorExtensions";
import { gainStagingLoudnessLesson } from "./gainStagingLoudness";
import { intervalsTranspositionLesson } from "./intervalsTransposition";
import { rhythmicPhrasingSpaceLesson } from "./rhythmicPhrasingSpace";
import type { LessonContext } from "./types";

const experiment = (
  changes: number,
  min: number | null = null,
  max: number | null = null,
  values: string[] = [],
) => ({ changes, min, max, values });

const played = {
  "transport.play": experiment(1, null, null, ["continued"]),
};

function ctx(partial: Partial<LessonContext>): LessonContext {
  return {
    experiments: played,
    ...partial,
  } as unknown as LessonContext;
}

function melody(...notes: Array<number | null>) {
  return [...notes, ...Array(Math.max(0, 16 - notes.length)).fill(null)];
}

function harmony(...steps: number[][]) {
  return [...steps, ...Array.from({ length: Math.max(0, 32 - steps.length) }, () => [])];
}

describe("lesson 29: intervals and transposition", () => {
  it("recognises the interval examples and exact whole-step transposition", () => {
    const source = melody(60, null, 62, null, 64, null, 67, null, 62, null, 64, null, 66, null, 69);
    expect(
      intervalsTranspositionLesson.exercises[0]
        .evaluate(ctx({ melody: source }))
        .every((check) => check.complete),
    ).toBe(true);
    expect(
      intervalsTranspositionLesson.exercises[1]
        .evaluate(ctx({ melody: source }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("accepts a complete D-major pitch collection and a D-centred phrase", () => {
    const scaleMap = melody(61, 62, 64, 66, 67, 69, 71);
    expect(
      intervalsTranspositionLesson.exercises[2]
        .evaluate(ctx({ melody: scaleMap }))
        .every((check) => check.complete),
    ).toBe(true);

    const phrase = melody(62, 66, 61, 69, 71, 62);
    expect(
      intervalsTranspositionLesson.exercises[3]
        .evaluate(ctx({ melody: phrase }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 30: chord colour and extensions", () => {
  it("recognises suspension, add9, and major ninth voicings", () => {
    const sequence = harmony(
      [60, 65, 67],
      [60, 64, 67],
      [60, 62, 64, 67],
      [60, 62, 64, 67, 71],
    );
    for (const exercise of chordColorExtensionsLesson.exercises.slice(0, 3)) {
      expect(
        exercise.evaluate(ctx({ harmonySequence: sequence })).every((check) => check.complete),
      ).toBe(true);
    }
  });

  it("requires contrast between plain and extended harmony", () => {
    const sequence = harmony(
      [60, 64, 67],
      [60, 62, 64, 67],
      [60, 62, 64, 67, 71],
      [62, 65, 69, 72],
    );
    expect(
      chordColorExtensionsLesson.exercises[3]
        .evaluate(ctx({ harmonySequence: sequence }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 31: rhythmic phrasing and space", () => {
  it("accepts intentional rests, anticipation, and delayed entry", () => {
    const sparse = melody(60, null, 62, null, 64, null, 65, 67);
    expect(
      rhythmicPhrasingSpaceLesson.exercises[0]
        .evaluate(ctx({ melody: sparse }))
        .every((check) => check.complete),
    ).toBe(true);

    const anticipation = melody(60, null, 62, null, 64, null, 65, 67, null, null, 69);
    expect(
      rhythmicPhrasingSpaceLesson.exercises[1]
        .evaluate(ctx({ melody: anticipation }))
        .every((check) => check.complete),
    ).toBe(true);

    const delayed = melody(null, 60, 62, 64, null, 65, null, 67, null, 69, 71);
    expect(
      rhythmicPhrasingSpaceLesson.exercises[2]
        .evaluate(ctx({ melody: delayed }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("checks onset placement together with real note duration", () => {
    const phrase = melody(null, 60, null, 62, 64, null, 65, null, 67);
    const durations = Array(16).fill(1);
    durations[1] = 3;
    expect(
      rhythmicPhrasingSpaceLesson.exercises[3]
        .evaluate(ctx({ melody: phrase, melodyDurations: durations }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 32: gain staging, headroom, and loudness", () => {
  const mixer = (drums: number, bass: number, chords: number, melodyVolume: number) => ({
    drums: { volume: drums },
    bass: { volume: bass },
    chords: { volume: chords },
    melody: { volume: melodyVolume },
  }) as LessonContext["mixerSettings"];

  it("accepts a headroom-safe rebalance", () => {
    expect(
      gainStagingLoudnessLesson.exercises[0]
        .evaluate(ctx({ mixerSettings: mixer(-6, -6, -7, -8) }))
        .every((check) => check.complete),
    ).toBe(true);

    expect(
      gainStagingLoudnessLesson.exercises[1]
        .evaluate(ctx({ mixerSettings: mixer(-3, -6, -7, -9) }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("exposes loudness bias and then accepts a level-matched comparison", () => {
    const snapshot = {
      mixerSettings: mixer(-8, -8, -8, -8),
      eqSettings: {} as LessonContext["referenceMixSettings"]["snapshot"] extends infer _T ? never : never,
      saturationSettings: {} as never,
      stereoWidths: {} as never,
    };
    const live = mixer(-5, -5, -5, -5);
    const referenceMixSettings = {
      snapshot,
      trimDb: 3,
      comparisons: 3,
      quietChecked: true,
    } as unknown as LessonContext["referenceMixSettings"];
    const experiments = {
      ...played,
      "reference.compare": experiment(3),
    };

    expect(
      gainStagingLoudnessLesson.exercises[2]
        .evaluate(ctx({ mixerSettings: live, referenceMixSettings, experiments }))
        .every((check) => check.complete),
    ).toBe(true);
    expect(
      gainStagingLoudnessLesson.exercises[3]
        .evaluate(ctx({ mixerSettings: live, referenceMixSettings, experiments }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});
