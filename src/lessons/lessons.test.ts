import { describe, expect, it } from "vitest";
import {
  cloneArrangement,
  clonePattern,
  initialArrangement,
  initialChordProgression,
  initialMelody,
  initialPattern,
  initialSynthSettings,
  type ChordProgression,
  type MelodySequence,
  type StepPattern,
} from "../music/model";
import { arrangementFormLesson } from "./arrangementForm";
import { chordProgressionLesson } from "./chordProgressions";
import { pianoCompositionLesson } from "./pianoComposition";
import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { rhythmVariationLesson } from "./rhythmVariation";
import { soundSynthesisLesson } from "./soundSynthesis";
import type { LessonContext } from "./types";

function context(overrides: Partial<LessonContext> = {}): LessonContext {
  return {
    A: clonePattern(initialPattern),
    B: clonePattern(initialPattern),
    selectedPitchClasses: [],
    melody: [...initialMelody],
    chordProgression: [...initialChordProgression],
    synthSettings: { ...initialSynthSettings },
    arrangement: cloneArrangement(initialArrangement),
    ...overrides,
  };
}

function completedGroove(): StepPattern {
  const pattern = clonePattern(initialPattern);
  [0, 4, 8, 12, 2].forEach((step) => {
    pattern.kick[step] = true;
  });
  pattern.snare[4] = true;
  pattern.snare[12] = true;
  [0, 2, 4, 6, 8, 10, 12, 14].forEach((step) => {
    pattern.hat[step] = true;
  });
  return pattern;
}

describe("lesson 1: pulse and groove", () => {
  it("accepts a groove containing four-on-the-floor, backbeat, eighths, and syncopation", () => {
    const A = completedGroove();
    const ctx = context({ A });

    for (const exercise of pulseAndGrooveLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 2: repetition and variation", () => {
  it("accepts a related variation with fill, anticipation, and a changed ending", () => {
    const A = completedGroove();
    const B = clonePattern(A);

    B.kick[7] = true;
    B.snare[13] = true;
    B.hat[14] = false;

    const ctx = context({ A, B });

    for (const exercise of rhythmVariationLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 3: keys and melody", () => {
  const melody: MelodySequence = [
    60, 64, null, 67,
    60, 64, null, 67,
    62, 65, 67, 69,
    67, 64, 62, 60,
  ];

  it("recognises a correct C-major key map", () => {
    const checks = pianoCompositionLesson.exercises[0].evaluate(
      context({ selectedPitchClasses: ["C", "D", "E", "F", "G", "A", "B"] }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts an in-key melody with tonic degrees, motif repetition, and an answer", () => {
    const ctx = context({ melody });

    for (const exercise of pianoCompositionLesson.exercises.slice(1)) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 4: chords and progressions", () => {
  it("recognises the tonic triad", () => {
    const progression: ChordProgression = ["C", null, null, null];
    expect(
      chordProgressionLesson.exercises[0]
        .evaluate(context({ chordProgression: progression }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises I-IV-V", () => {
    const progression: ChordProgression = ["C", "F", "G", null];
    expect(
      chordProgressionLesson.exercises[1]
        .evaluate(context({ chordProgression: progression }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises I-IV-V-I cadence", () => {
    const progression: ChordProgression = ["C", "F", "G", "C"];
    expect(
      chordProgressionLesson.exercises[2]
        .evaluate(context({ chordProgression: progression }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises I-V-vi-IV", () => {
    const progression: ChordProgression = ["C", "G", "Am", "F"];
    expect(
      chordProgressionLesson.exercises[3]
        .evaluate(context({ chordProgression: progression }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});


describe("lesson 5: sound and synthesis", () => {
  it("accepts a deliberately shaped warm pad", () => {
    const ctx = context({
      synthSettings: {
        waveform: "sawtooth",
        cutoff: 1500,
        attack: 0.5,
        release: 1.2,
      },
    });

    for (const exercise of soundSynthesisLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 6: arrangement and form", () => {
  it("accepts an eight-bar density arc with A/B contrast, climax, and release", () => {
    const arrangement = [
      { drums: true, bass: false, chords: false, melody: false },
      { drums: true, bass: true, chords: false, melody: false },
      { drums: true, bass: true, chords: true, melody: false },
      { drums: true, bass: true, chords: true, melody: false },
      { drums: true, bass: true, chords: false, melody: false },
      { drums: true, bass: true, chords: true, melody: false },
      { drums: true, bass: true, chords: true, melody: true },
      { drums: true, bass: false, chords: false, melody: false },
    ];

    const ctx = context({ arrangement });

    for (const exercise of arrangementFormLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});
