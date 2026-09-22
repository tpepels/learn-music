import { describe, expect, it } from "vitest";
import {
  cloneArrangement,
  cloneAutomationSettings,
  clonePattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialMelody,
  initialMixerSettings,
  initialPattern,
  initialReferenceMixSettings,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  bassRootMidi,
  type ChordProgression,
  type MelodySequence,
  type StepPattern,
} from "../music/model";
import { arrangementFormLesson } from "./arrangementForm";
import { automationDynamicsLesson } from "./automationDynamics";
import { bassLinesLesson } from "./bassLines";
import { chordProgressionLesson } from "./chordProgressions";
import { effectsTransitionsLesson } from "./effectsTransitions";
import { eqSpectralBalanceLesson } from "./eqSpectralBalance";
import { finalProjectLesson } from "./finalProject";
import { grooveFeelLesson } from "./grooveFeel";
import { mixingSpaceLesson } from "./mixingSpace";
import { motifDevelopmentLesson } from "./motifDevelopment";
import { melodyOverHarmonyLesson } from "./melodyOverHarmony";
import { harmonicFunctionLesson } from "./harmonicFunction";
import { phraseFormLesson } from "./phraseForm";
import { textureOrchestrationLesson } from "./textureOrchestration";
import { pianoCompositionLesson } from "./pianoComposition";
import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { referenceMixingLesson } from "./referenceMixing";
import { rhythmVariationLesson } from "./rhythmVariation";
import { saturationLesson } from "./saturation";
import { sidechainLesson } from "./sidechain";
import { soundSynthesisLesson } from "./soundSynthesis";
import { stereoMonoLesson } from "./stereoMono";
import { voiceLeadingLesson } from "./voiceLeading";
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
    effectsSettings: { ...initialEffectsSettings },
    projectMilestones: { exported: false },
    voicingSettings: { inversions: [...initialVoicingSettings.inversions] },
    bassSequence: [...initialBassSequence],
    grooveFeelSettings: {
      swing: initialGrooveFeelSettings.swing,
      velocities: {
        kick: [...initialGrooveFeelSettings.velocities.kick],
        snare: [...initialGrooveFeelSettings.velocities.snare],
        hat: [...initialGrooveFeelSettings.velocities.hat],
      },
    },
    formSettings: {
      sections: [...initialFormSettings.sections],
      roles: [...initialFormSettings.roles],
    },
    textureSettings: { ...initialTextureSettings },
    eqSettings: {
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { ...initialEqSettings.chords },
      melody: { ...initialEqSettings.melody },
    },
    saturationSettings: {
      drums: { ...initialSaturationSettings.drums },
      bass: { ...initialSaturationSettings.bass },
      chords: { ...initialSaturationSettings.chords },
      melody: { ...initialSaturationSettings.melody },
    },
    sidechainSettings: { ...initialSidechainSettings },
    stereoSettings: {
      widths: { ...initialStereoSettings.widths },
      monoAudition: false,
      monoChecked: false,
    },
    referenceMixSettings: {
      ...initialReferenceMixSettings,
      snapshot: null,
    },
    ...overrides,
  } as LessonContext;
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


describe("lesson 9: creative effects and transitions", () => {
  it("accepts a spacious transition with delay, chorus, and filter movement", () => {
    const ctx = context({
      mixerSettings: {
        drums: { ...initialMixerSettings.drums },
        bass: { ...initialMixerSettings.bass },
        chords: { ...initialMixerSettings.chords, reverb: 0.2 },
        melody: { ...initialMixerSettings.melody, delay: 0.12 },
      },
      automationSettings: {
        melodyVolumeDb: [-10, -9, -8, -7, -5, -4, -2, 0],
        chordFilterHz: [1000, 1600, 2600, 3800, 5200, 7000, 9000, 11000],
      },
      effectsSettings: {
        reverbDecay: 3.6,
        reverbPreDelay: 0.03,
        delayFeedback: 0.36,
        chorusWet: 0.28,
      },
    });

    for (const exercise of effectsTransitionsLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 10: final project", () => {
  it("accepts a complete project and exported snapshot", () => {
    const A = completedGroove();
    const arrangement = [
      { drums: true, bass: false, chords: false, melody: false },
      { drums: true, bass: true, chords: false, melody: false },
      { drums: true, bass: true, chords: true, melody: false },
      { drums: true, bass: true, chords: true, melody: true },
      { drums: true, bass: true, chords: true, melody: false },
      { drums: true, bass: true, chords: true, melody: true },
      { drums: true, bass: true, chords: true, melody: true },
      { drums: true, bass: false, chords: false, melody: false },
    ];
    const melody: MelodySequence = [
      60, 64, 67, null,
      62, 65, 69, null,
      67, 64, 62, 60,
      null, null, null, null,
    ];

    const ctx = context({
      A,
      melody,
      chordProgression: ["C", "G", "Am", "F"],
      arrangement,
      mixerSettings: {
        drums: { ...initialMixerSettings.drums, volume: -4 },
        bass: { ...initialMixerSettings.bass, volume: -7 },
        chords: { ...initialMixerSettings.chords, volume: -11, reverb: 0.2 },
        melody: { ...initialMixerSettings.melody, volume: -7, reverb: 0.15, delay: 0.1 },
      },
      automationSettings: {
        melodyVolumeDb: [-10, -9, -8, -6, -5, -3, -1, 0],
        chordFilterHz: [1200, 1800, 2600, 3600, 5000, 6800, 8800, 10500],
      },
      dynamicsSettings: {
        threshold: -14,
        ratio: 4,
        attack: 0.04,
        release: 0.16,
      },
      effectsSettings: {
        reverbDecay: 3.6,
        reverbPreDelay: 0.03,
        delayFeedback: 0.36,
        chorusWet: 0.28,
      },
      projectMilestones: { exported: true },
    });

    for (const exercise of finalProjectLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 11: voicing and voice leading", () => {
  it("accepts a progression with root, first, second inversion, and reduced motion", () => {
    const progression: ChordProgression = ["C", "G", "Am", "F"];

    const rootContext = context({
      chordProgression: progression,
      voicingSettings: { inversions: [0, 0, 0, 0] },
    });
    expect(
      voiceLeadingLesson.exercises[0]
        .evaluate(rootContext)
        .every((check) => check.complete),
    ).toBe(true);

    const firstContext = context({
      chordProgression: progression,
      voicingSettings: { inversions: [0, 1, 0, 0] },
    });
    expect(
      voiceLeadingLesson.exercises[1]
        .evaluate(firstContext)
        .every((check) => check.complete),
    ).toBe(true);

    const mixedContext = context({
      chordProgression: progression,
      voicingSettings: { inversions: [0, 1, 1, 2] },
    });
    expect(
      voiceLeadingLesson.exercises[2]
        .evaluate(mixedContext)
        .every((check) => check.complete),
    ).toBe(true);
    expect(
      voiceLeadingLesson.exercises[3]
        .evaluate(mixedContext)
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 12: bass lines", () => {
  it("accepts roots, chord tones, approaches, and a complete bass phrase", () => {
    const progression: ChordProgression = ["C", "G", "Am", "F"];
    const bass = [...initialBassSequence];

    [0, 8, 16, 24].forEach((step, bar) => {
      bass[step] = bassRootMidi(progression[bar]!);
    });

    bass[4] = 40;
    bass[12] = 38;
    bass[20] = 40;
    bass[28] = 41;

    bass[7] = 42;
    bass[15] = 44;
    bass[23] = 40;
    bass[31] = 37;

    bass[2] = 43;
    bass[10] = 47;

    const ctx = context({
      chordProgression: progression,
      bassSequence: bass,
    });

    for (const exercise of bassLinesLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 13: velocity, accents, and swing", () => {
  it("accepts accented drums, dynamic hats, a ghost snare, and moderate swing", () => {
    const A = completedGroove();
    A.snare[10] = true;

    const grooveFeelSettings = {
      swing: 0.22,
      velocities: {
        kick: Array(16).fill(0.7),
        snare: Array(16).fill(0.72),
        hat: Array(16).fill(0.35),
      },
    };

    [0, 4, 8, 12].forEach((step) => {
      grooveFeelSettings.velocities.kick[step] = 0.9;
      grooveFeelSettings.velocities.hat[step] = 0.72;
    });
    [2, 6, 10, 14].forEach((step) => {
      grooveFeelSettings.velocities.hat[step] = 0.4;
    });
    grooveFeelSettings.velocities.snare[4] = 0.8;
    grooveFeelSettings.velocities.snare[12] = 0.8;
    grooveFeelSettings.velocities.snare[10] = 0.25;

    const ctx = context({ A, grooveFeelSettings });

    for (const exercise of grooveFeelLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 14: motif development", () => {
  it("recognises repetition, transposition, fragmentation, and response", () => {
    const melody: MelodySequence = [
      60, 64, 67, 64,
      60, 64, 67, 64,
      62, 66, 69, 66,
      60, null, null, null,
    ];
    const ctx = context({ melody });

    for (const exercise of motifDevelopmentLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 15: melody over harmony", () => {
  it("recognises chord-tone anchors, passing tones, neighbour motion, and resolutions", () => {
    const melody: MelodySequence = [
      60, 62, 64, 65,
      65, 67, 65, 69,
      67, 69, 71, 66,
      67, 62, 64, 60,
    ];
    const chordProgression: ChordProgression = ["C", "F", "G", "C"];
    const ctx = context({ melody, chordProgression });

    for (const exercise of melodyOverHarmonyLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 16: harmonic function", () => {
  it("recognises the tonic-predominant-dominant-tonic cycle", () => {
    const ctx = context({ chordProgression: ["C", "F", "G", "C"] });
    expect(
      harmonicFunctionLesson.exercises[0]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises ii-V-I", () => {
    const ctx = context({ chordProgression: ["Dm", "G", "C", "C"] });
    expect(
      harmonicFunctionLesson.exercises[1]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises deceptive V-vi motion", () => {
    const ctx = context({ chordProgression: ["C", "G", "Am", "F"] });
    expect(
      harmonicFunctionLesson.exercises[2]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises V/V resolving through V to I", () => {
    const ctx = context({ chordProgression: ["D7", "G", "C", "Am"] });
    expect(
      harmonicFunctionLesson.exercises[3]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 17: phrase and form", () => {
  it("recognises antecedent/consequent A to A-prime", () => {
    const ctx = context({
      formSettings: {
        sections: ["A", "A′", "B", "A"],
        roles: ["statement", "answer", "contrast", "return"],
      },
    });
    expect(
      phraseFormLesson.exercises[0]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises binary form", () => {
    const ctx = context({
      formSettings: {
        sections: ["A", "A", "B", "B"],
        roles: ["statement", "answer", "contrast", "return"],
      },
    });
    expect(
      phraseFormLesson.exercises[1]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises ternary return", () => {
    const ctx = context({
      formSettings: {
        sections: ["A", "B", "A", "A′"],
        roles: ["statement", "answer", "contrast", "return"],
      },
    });
    expect(
      phraseFormLesson.exercises[2]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises AABA", () => {
    const ctx = context({
      formSettings: {
        sections: ["A", "A", "B", "A"],
        roles: ["statement", "answer", "contrast", "return"],
      },
    });
    expect(
      phraseFormLesson.exercises[3]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 18: texture and orchestration", () => {
  it("accepts register separation, open voicing, doubling, and density contrast", () => {
    const arrangement = cloneArrangement(initialArrangement);
    arrangement[0] = { drums: true, bass: false, chords: false, melody: false };
    arrangement[6] = { drums: true, bass: true, chords: true, melody: true };

    const ctx = context({
      arrangement,
      textureSettings: {
        bassOctave: -1,
        chordsOctave: 0,
        melodyOctave: 1,
        openChords: true,
        melodyOctaveDouble: true,
      },
    });

    for (const exercise of textureOrchestrationLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 19: EQ and spectral balance", () => {
  it("recognises low-cut cleanup", () => {
    const mixerSettings = {
      ...initialMixerSettings,
      drums: { ...initialMixerSettings.drums },
      bass: { ...initialMixerSettings.bass },
      chords: { ...initialMixerSettings.chords, highpass: 140 },
      melody: { ...initialMixerSettings.melody },
    };
    expect(
      eqSpectralBalanceLesson.exercises[0]
        .evaluate(context({ mixerSettings }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises a narrow boosted search sweep", () => {
    const eqSettings = {
      ...initialEqSettings,
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { frequency: 1200, gain: 8, q: 4 },
      melody: { ...initialEqSettings.melody },
    };
    expect(
      eqSpectralBalanceLesson.exercises[1]
        .evaluate(context({ eqSettings }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises a corrective cut", () => {
    const eqSettings = {
      ...initialEqSettings,
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { frequency: 1200, gain: -3.5, q: 3 },
      melody: { ...initialEqSettings.melody },
    };
    expect(
      eqSpectralBalanceLesson.exercises[2]
        .evaluate(context({ eqSettings }))
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises complementary EQ between chords and melody", () => {
    const eqSettings = {
      ...initialEqSettings,
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { frequency: 1500, gain: -3, q: 2 },
      melody: { frequency: 2400, gain: 2.5, q: 1.2 },
    };
    expect(
      eqSpectralBalanceLesson.exercises[3]
        .evaluate(context({ eqSettings }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 20: saturation and distortion", () => {
  it("accepts a selective saturation palette", () => {
    const saturationSettings = {
      drums: { drive: 0.6, wet: 0.3 },
      bass: { drive: 0.28, wet: 0.4 },
      chords: { drive: 0.22, wet: 0.2 },
      melody: { drive: 0.05, wet: 0.05 },
    };

    const ctx = context({ saturationSettings });
    for (const exercise of saturationLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 21: sidechain ducking", () => {
  it("accepts moderate kick-triggered ducking", () => {
    const A = completedGroove();
    const ctx = context({
      A,
      sidechainSettings: { enabled: true, amountDb: 4, release: 0.18 },
    });
    expect(
      sidechainLesson.exercises[0]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises obvious pumping", () => {
    const ctx = context({
      sidechainSettings: { enabled: true, amountDb: 9, release: 0.45 },
    });
    expect(
      sidechainLesson.exercises[1]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises transparent settings", () => {
    const ctx = context({
      sidechainSettings: { enabled: true, amountDb: 3.5, release: 0.16 },
    });
    expect(
      sidechainLesson.exercises[2]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("connects ducking to a real kick/bass arrangement overlap", () => {
    const arrangement = cloneArrangement(initialArrangement);
    arrangement[2] = { drums: true, bass: true, chords: false, melody: false };
    const ctx = context({
      arrangement,
      sidechainSettings: { enabled: true, amountDb: 3.5, release: 0.16 },
    });
    expect(
      sidechainLesson.exercises[3]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 22: stereo width and mono", () => {
  it("accepts a centred low end, opposite pan support, width contrast, and mono check", () => {
    const mixerSettings = {
      drums: { ...initialMixerSettings.drums, pan: 0 },
      bass: { ...initialMixerSettings.bass, pan: 0 },
      chords: { ...initialMixerSettings.chords, pan: -0.35 },
      melody: { ...initialMixerSettings.melody, pan: 0.35 },
    };
    const stereoSettings = {
      widths: {
        drums: 0.5,
        bass: 0.4,
        chords: 0.8,
        melody: 0.65,
      },
      monoAudition: false,
      monoChecked: true,
    };
    const ctx = context({ mixerSettings, stereoSettings });

    for (const exercise of stereoMonoLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 23: reference mixing", () => {
  it("accepts captured, changed, level-matched, repeatedly compared translation checks", () => {
    const snapshotMixer = {
      drums: { ...initialMixerSettings.drums, volume: -4 },
      bass: { ...initialMixerSettings.bass, volume: -7 },
      chords: { ...initialMixerSettings.chords, volume: -10 },
      melody: { ...initialMixerSettings.melody, volume: -8 },
    };
    const currentMixer = {
      drums: { ...snapshotMixer.drums },
      bass: { ...snapshotMixer.bass, volume: -4 },
      chords: { ...snapshotMixer.chords },
      melody: { ...snapshotMixer.melody },
    };
    const snapshot = {
      mixerSettings: snapshotMixer,
      eqSettings: {
        drums: { ...initialEqSettings.drums },
        bass: { ...initialEqSettings.bass },
        chords: { ...initialEqSettings.chords },
        melody: { ...initialEqSettings.melody },
      },
      saturationSettings: {
        drums: { ...initialSaturationSettings.drums },
        bass: { ...initialSaturationSettings.bass },
        chords: { ...initialSaturationSettings.chords },
        melody: { ...initialSaturationSettings.melody },
      },
      stereoWidths: { ...initialStereoSettings.widths },
    };
    const suggested =
      (currentMixer.drums.volume +
        currentMixer.bass.volume +
        currentMixer.chords.volume +
        currentMixer.melody.volume) /
        4 -
      (snapshotMixer.drums.volume +
        snapshotMixer.bass.volume +
        snapshotMixer.chords.volume +
        snapshotMixer.melody.volume) /
        4;

    const ctx = context({
      mixerSettings: currentMixer,
      referenceMixSettings: {
        snapshot,
        trimDb: suggested,
        comparisons: 4,
        quietChecked: true,
      },
      stereoSettings: {
        widths: { ...initialStereoSettings.widths },
        monoAudition: false,
        monoChecked: true,
      },
    });

    for (const exercise of referenceMixingLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});
