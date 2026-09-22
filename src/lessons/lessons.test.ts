import { describe, expect, it } from "vitest";
import {
  cloneArrangement,
  cloneAutomationSettings,
  clonePattern,
  initialArrangement,
  initialAutomationSettings,
  initialChordProgression,
  initialDynamicsSettings,
  initialMelody,
  initialMixerSettings,
  initialPattern,
  initialSynthSettings,
  type ChordProgression,
  type MelodySequence,
  type StepPattern,
} from "../music/model";
import { arrangementFormLesson } from "./arrangementForm";
import { automationDynamicsLesson } from "./automationDynamics";
import { chordProgressionLesson } from "./chordProgressions";
import { mixingSpaceLesson } from "./mixingSpace";
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
    mixerSettings: {
      drums: { ...initialMixerSettings.drums },
      bass: { ...initialMixerSettings.bass },
      chords: { ...initialMixerSettings.chords },
      melody: { ...initialMixerSettings.melody },
    },
    automationSettings: cloneAutomationSettings(initialAutomationSettings),
    dynamicsSettings: { ...initialDynamicsSettings },
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


describe("lesson 7: mixing and space", () => {
  it("accepts a clear starter mix with level, pan, low-cut, and send choices", () => {
    const ctx = context({
      mixerSettings: {
        drums: {
          volume: -4,
          pan: 0,
          highpass: 30,
          reverb: 0.04,
          delay: 0.02,
        },
        bass: {
          volume: -7,
          pan: 0,
          highpass: 30,
          reverb: 0.03,
          delay: 0,
        },
        chords: {
          volume: -11,
          pan: -0.35,
          highpass: 120,
          reverb: 0.18,
          delay: 0.03,
        },
        melody: {
          volume: -7,
          pan: 0.35,
          highpass: 160,
          reverb: 0.16,
          delay: 0.1,
        },
      },
    });

    for (const exercise of mixingSpaceLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 8: automation and dynamics", () => {
  it("accepts an energy-building automation pass with punch-preserving compression", () => {
    const ctx = context({
      automationSettings: {
        melodyVolumeDb: [-12, -10, -9, -7, -5, -4, -2, 0],
        chordFilterHz: [1000, 1400, 2200, 3200, 4600, 6200, 8500, 10500],
      },
      dynamicsSettings: {
        threshold: -14,
        ratio: 4,
        attack: 0.04,
        release: 0.16,
      },
    });

    expect(
      automationDynamicsLesson.exercises[0]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);

    expect(
      automationDynamicsLesson.exercises[1]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);

    const fastCompression = context({
      automationSettings: ctx.automationSettings,
      dynamicsSettings: {
        threshold: -16,
        ratio: 4,
        attack: 0.008,
        release: 0.16,
      },
    });

    expect(
      automationDynamicsLesson.exercises[2]
        .evaluate(fastCompression)
        .every((check) => check.complete),
    ).toBe(true);

    expect(
      automationDynamicsLesson.exercises[3]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });
});
