import { describe, expect, it } from "vitest";
import {
  cloneArrangement,
  cloneAutomationSettings,
  clonePattern,
  chordMidi,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassDurations,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialHarmonyDurations,
  initialHarmonySequence,
  initialInstrumentSettings,
  initialMelody,
  initialMelodyDurations,
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
  type HarmonySequence,
  type MelodySequence,
  type StepPattern,
} from "../music/model";
import {
  cloneHarmonicProgression,
  cloneTonalContext,
  initialHarmonicProgression,
  initialTonalContext,
} from "../music/harmony";
import { arrangementFormLesson } from "./arrangementForm";
import { automationDynamicsLesson } from "./automationDynamics";
import { bassLinesLesson } from "./bassLines";
import { chordProgressionLesson } from "./chordProgressions";
import { effectsTransitionsLesson } from "./effectsTransitions";
import { eqSpectralBalanceLesson } from "./eqSpectralBalance";
import { finalProjectLesson } from "./finalProject";
import { grooveFeelLesson } from "./grooveFeel";
import { mixingSpaceLesson } from "./mixingSpace";
import { modalMixtureLesson } from "./modalMixture";
import { minorCadencesLesson } from "./minorCadences";
import { motifDevelopmentLesson } from "./motifDevelopment";
import { melodyOverHarmonyLesson } from "./melodyOverHarmony";
import { harmonicFunctionLesson } from "./harmonicFunction";
import { harmonicMinorLesson } from "./harmonicMinor";
import { phraseFormLesson } from "./phraseForm";
import { textureOrchestrationLesson } from "./textureOrchestration";
import { pianoCompositionLesson } from "./pianoComposition";
import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { relativeMinorLesson } from "./relativeMinor";
import { referenceMixingLesson } from "./referenceMixing";
import { rhythmVariationLesson } from "./rhythmVariation";
import { saturationLesson } from "./saturation";
import { seventhChordsLesson } from "./seventhChords";
import { sidechainLesson } from "./sidechain";
import { soundSynthesisLesson } from "./soundSynthesis";
import { stereoMonoLesson } from "./stereoMono";
import { voiceLeadingLesson } from "./voiceLeading";
import { implementedLessons } from "./course";
import {
  ambientStyleLesson,
  funkStyleLesson,
  hipHopStyleLesson,
  houseStyleLesson,
  popStyleLesson,
} from "./styleGenreLab";
import type { LessonContext } from "./types";

function context(overrides: Partial<LessonContext> = {}): LessonContext {
  return {
    A: clonePattern(initialPattern),
    B: clonePattern(initialPattern),
    selectedPitchClasses: [],
    melody: [...initialMelody],
    melodyDurations: [...initialMelodyDurations],
    tonalContext: cloneTonalContext(initialTonalContext),
    harmonicProgression: cloneHarmonicProgression(initialHarmonicProgression),
    chordProgression: [...initialChordProgression],
    harmonySequence: initialHarmonySequence.map((notes) => [...notes]),
    harmonyDurations: initialHarmonyDurations.map((entry) => ({ ...entry })),
    accompanimentPattern: initialAccompanimentPattern,
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
    bassDurations: [...initialBassDurations],
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
      layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
    },
    textureSettings: { ...initialTextureSettings },
    instrumentSettings: { ...initialInstrumentSettings },
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
    experiments: {
      "transport.play": experiment(1, null, null, ["continued"]),
      ...(overrides.experiments ?? {}),
    },
  } as LessonContext;
}

function experiment(
  changes: number,
  min: number | null = null,
  max: number | null = null,
  values: string[] = [],
) {
  return { changes, min, max, values };
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
    const ctx = context({
      A,
      experiments: {
        "transport.play": experiment(1, null, null, ["drums"]),
        "drums.A.kick.edit": experiment(4, null, null, ["1:true", "3:true", "3:false", "2:true"]),
        "drums.A.snare.edit": experiment(4),
        "drums.A.hat.edit": experiment(8),
      },
    });

    for (const exercise of pulseAndGrooveLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("does not let the syncopation exercise pass without listening and trying positions", () => {
    const checks = pulseAndGrooveLesson.exercises[3].evaluate(
      context({ A: completedGroove() }),
    );
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});

describe("lesson 2: repetition and variation", () => {
  it("accepts a related variation with fill, anticipation, and a changed ending", () => {
    const A = completedGroove();
    const B = clonePattern(A);

    B.kick[7] = true;
    B.kick[11] = true;
    B.snare[13] = true;
    B.hat[14] = false;

    const ctx = context({
      A,
      B,
      experiments: {
        "pattern.select": experiment(2, null, null, ["A", "B"]),
        "drums.B.kick.edit": experiment(3),
        "drums.B.snare.edit": experiment(2),
        "drums.B.hat.edit": experiment(1),
      },
    });

    for (const exercise of rhythmVariationLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("does not pre-complete the turnaround after doing the fill and anticipation exercises", () => {
    const A = completedGroove();
    const B = clonePattern(A);

    B.snare[13] = true;
    B.kick[11] = true;

    const ctx = context({
      A,
      B,
      experiments: {
        "drums.B.kick.edit": experiment(1),
        "drums.B.snare.edit": experiment(1),
      },
    });
    expect(
      rhythmVariationLesson.exercises[1]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
    expect(
      rhythmVariationLesson.exercises[2]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
    expect(
      rhythmVariationLesson.exercises[3]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(false);
  });
});

describe("lesson 3: keys and melody", () => {
  const melody: MelodySequence = [
    60, 64, null, 67,
    60, 64, null, 67,
    62, 65, 67, 69,
    67, 64, 62, 60,
  ];


  it("does not mark the 'no outside notes' objective complete before the student selects anything", () => {
    const checks = pianoCompositionLesson.exercises[0].evaluate(
      context({ selectedPitchClasses: [] }),
    );
    expect(checks[0].complete).toBe(false);
    expect(checks[1].complete).toBe(false);
  });

  it("recognises a correct C-major key map", () => {
    const checks = pianoCompositionLesson.exercises[0].evaluate(
      context({
        selectedPitchClasses: ["C", "D", "E", "F", "G", "A", "B"],
        experiments: { "pitch-class.select": experiment(7) },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts an in-key melody with tonic degrees, motif repetition, and an answer", () => {
    const ctx = context({
      melody,
      experiments: { "melody.edit": experiment(8) },
    });

    for (const exercise of pianoCompositionLesson.exercises.slice(1)) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

function harmonyFor(
  progression: ChordProgression,
  rhythms: number[][] = [
    [0, 2, 4],
    [0, 3, 5],
    [0, 2, 5],
    [0, 3, 6],
  ],
): HarmonySequence {
  const sequence = initialHarmonySequence.map((notes) => [...notes]);
  progression.forEach((chord, bar) => {
    if (!chord) return;
    const notes = chordMidi[chord];
    const positions = rhythms[bar] ?? [0];
    positions.forEach((localStep, index) => {
      const step = bar * 8 + localStep;
      sequence[step] = index === 0 ? [...notes] : [notes[index % notes.length]];
    });
  });

  return sequence;
}

describe("lesson 4: chords and progressions", () => {
  it("requires the learner to place C, E, and G into the sequencer", () => {
    const sequence = initialHarmonySequence.map((notes) => [...notes]);
    sequence[0] = [48, 52, 55];

    const checks = chordProgressionLesson.exercises[0].evaluate(
      context({
        chordProgression: ["C", null, null, null],
        harmonySequence: sequence,
        experiments: { "harmony.note-edit": experiment(5) },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
    expect(chordProgressionLesson.exercises[0].workspace).toBe("harmony-song");
  });

  it("requires every bar of I-IV-V-I to contain its own chord tones", () => {
    const progression: ChordProgression = ["C", "F", "G", "C"];
    const sequence = harmonyFor(progression);

    const checks = chordProgressionLesson.exercises[1].evaluate(
      context({
        chordProgression: progression,
        harmonySequence: sequence,
        experiments: { "harmony.note-edit": experiment(6) },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("rejects automatic-looking bar-start blocks as rhythmic application", () => {
    const progression: ChordProgression = ["C", "F", "G", "C"];
    const blocks = harmonyFor(progression, [[0], [0], [0], [0]]);
    const checks = chordProgressionLesson.exercises[2].evaluate(
      context({ chordProgression: progression, harmonySequence: blocks }),
    );

    expect(checks.every((check) => check.complete)).toBe(false);
  });

  it("accepts a chord-tone accompaniment with offbeats and multiple positions", () => {
    const progression: ChordProgression = ["C", "F", "G", "C"];
    const sequence = harmonyFor(progression);

    const checks = chordProgressionLesson.exercises[2].evaluate(
      context({
        chordProgression: progression,
        harmonySequence: sequence,
        experiments: { "harmony.note-edit": experiment(4) },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts an independently written four-bar accompaniment", () => {
    const progression: ChordProgression = ["C", "Am", "G", "C"];
    const sequence = harmonyFor(progression, [
      [0, 2, 5],
      [0, 3, 6],
      [0, 1, 4],
      [0, 3, 5, 7],
    ]);

    const checks = chordProgressionLesson.exercises[3].evaluate(
      context({
        chordProgression: progression,
        harmonySequence: sequence,
        experiments: { "harmony.note-edit": experiment(4) },
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("rejects notes that do not belong to the chord above their bar", () => {
    const progression: ChordProgression = ["C", "F", "G", "C"];
    const sequence = harmonyFor(progression);
    sequence[9] = [61];

    const checks = chordProgressionLesson.exercises[3].evaluate(
      context({ chordProgression: progression, harmonySequence: sequence }),
    );

    expect(checks.at(-1)?.complete).toBe(false);
  });
});


describe("lesson 5: sound and synthesis", () => {
  it("requires waveform comparison, filter exploration, and phrase audition", () => {
    const raw = context({
      synthSettings: {
        waveform: "sawtooth",
        cutoff: 12000,
        attack: 0.01,
        release: 0.25,
      },
      experiments: {
        "synth.waveform": experiment(4, null, null, ["sine", "triangle", "square", "sawtooth"]),
      },
    });
    expect(soundSynthesisLesson.exercises[0].evaluate(raw).every((check) => check.complete)).toBe(true);

    const dark = context({
      synthSettings: {
        waveform: "sawtooth",
        cutoff: 1500,
        attack: 0.01,
        release: 0.25,
      },
      experiments: {
        "synth.cutoff": experiment(5, 1200, 9000, ["1200", "9000"]),
        "synth.note-audition": experiment(2, null, null, ["60", "64"]),
      },
    });
    expect(soundSynthesisLesson.exercises[1].evaluate(dark).every((check) => check.complete)).toBe(true);

    const pluck = context({
      synthSettings: {
        waveform: "triangle",
        cutoff: 1800,
        attack: 0.04,
        release: 0.3,
      },
      experiments: {
        "synth.phrase-audition": experiment(1, null, null, ["true"]),
      },
    });
    expect(soundSynthesisLesson.exercises[2].evaluate(pluck).every((check) => check.complete)).toBe(true);
    expect(soundSynthesisLesson.exercises[3].evaluate(pluck).every((check) => check.complete)).toBe(false);

    const pad = context({
      synthSettings: {
        waveform: "triangle",
        cutoff: 1800,
        attack: 0.55,
        release: 1.4,
      },
      experiments: {
        "synth.phrase-audition": experiment(1, null, null, ["true"]),
      },
    });
    expect(soundSynthesisLesson.exercises[3].evaluate(pad).every((check) => check.complete)).toBe(true);
  });

  it("does not pass waveform comparison from the final waveform alone", () => {
    const checks = soundSynthesisLesson.exercises[0].evaluate(
      context({
        synthSettings: { ...initialSynthSettings, waveform: "sawtooth" },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(false);
  });

  it("treats a missing cutoff experiment as incomplete instead of throwing", () => {
    const checks = soundSynthesisLesson.exercises[1].evaluate(
      context({
        synthSettings: {
          ...initialSynthSettings,
          waveform: "sawtooth",
          cutoff: 1500,
        },
        experiments: {},
      }),
    );

    expect(checks.find((check) =>
      check.label.includes("5000 Hz"),
    )?.complete).toBe(false);
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

    const ctx = context({
      arrangement,
      experiments: {
        "transport.play": experiment(1, null, null, ["arrangement"]),
        "arrangement.edit": experiment(6, null, null, ["0:drums:true", "2:chords:true"]),
      },
    });

    for (const exercise of arrangementFormLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("does not accept a final arrangement merely because its layer counts happen to fit", () => {
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
    const checks = arrangementFormLesson.exercises[3].evaluate(context({ arrangement }));
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});


describe("lesson 7: mixing and space", () => {
  it("requires exploration before accepting the final mix relationships", () => {
    const ctx = context({
      mixerSettings: {
        drums: { volume: -4, pan: 0, highpass: 30, reverb: 0.04, delay: 0.02 },
        bass: { volume: -7, pan: 0, highpass: 30, reverb: 0.03, delay: 0 },
        chords: { volume: -11, pan: -0.35, highpass: 120, reverb: 0.18, delay: 0.03 },
        melody: { volume: -7, pan: 0.35, highpass: 160, reverb: 0.16, delay: 0.1 },
      },
      experiments: {
        "mixer.melody.volume": experiment(5, -16, -4),
        "mixer.chords.volume": experiment(4, -15, -8),
        "mixer.chords.pan": experiment(7, -0.8, 0.8),
        "mixer.chords.highpass": experiment(8, 20, 300),
        "mixer.chords.reverb": experiment(5, 0, 0.38),
      },
    });

    for (const exercise of mixingSpaceLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("rejects a plausible final mix when the learner never explored the controls", () => {
    const ctx = context({
      mixerSettings: {
        drums: { volume: -4, pan: 0, highpass: 30, reverb: 0.04, delay: 0.02 },
        bass: { volume: -7, pan: 0, highpass: 30, reverb: 0.03, delay: 0 },
        chords: { volume: -11, pan: -0.35, highpass: 120, reverb: 0.18, delay: 0.03 },
        melody: { volume: -7, pan: 0.35, highpass: 160, reverb: 0.16, delay: 0.1 },
      },
    });
    expect(mixingSpaceLesson.exercises[0].evaluate(ctx).every((check) => check.complete)).toBe(false);
  });
});

describe("lesson 8: automation and dynamics", () => {
  it("accepts shaped automation and compressor comparisons", () => {
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
      experiments: {
        "automation.melodyVolumeDb": experiment(8, -12, 0),
        "automation.chordFilterHz": experiment(8, 1000, 10500),
        "dynamics.attack": experiment(4, 0.008, 0.04),
      },
    });

    expect(automationDynamicsLesson.exercises[0].evaluate(ctx).every((check) => check.complete)).toBe(true);
    expect(automationDynamicsLesson.exercises[1].evaluate(ctx).every((check) => check.complete)).toBe(true);

    const fastCompression = context({
      automationSettings: ctx.automationSettings,
      dynamicsSettings: {
        threshold: -16,
        ratio: 4,
        attack: 0.008,
        release: 0.16,
      },
      experiments: {
        "dynamics.ratio": experiment(4, 1, 4),
      },
    });
    expect(automationDynamicsLesson.exercises[2].evaluate(fastCompression).every((check) => check.complete)).toBe(true);
    expect(automationDynamicsLesson.exercises[3].evaluate(ctx).every((check) => check.complete)).toBe(true);
  });
});

describe("lesson 9: creative effects and transitions", () => {
  it("requires hearing exaggerated effects before settling on the transition", () => {
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
      experiments: {
        "effects.reverbDecay": experiment(4, 2.5, 6.5),
        "effects.delayFeedback": experiment(5, 0.15, 0.42),
        "mixer.melody.delay": experiment(4, 0.05, 0.25),
        "effects.chorusWet": experiment(5, 0, 0.62),
        "transport.play": experiment(1, null, null, ["effects"]),
      },
    });

    for (const exercise of effectsTransitionsLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 10: first track checkpoint", () => {
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
      harmonySequence: harmonyFor(["C", "G", "Am", "F"]),
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
      experiments: {
        "transport.play": experiment(1, null, null, ["final-project"]),
        "project.export": experiment(1, null, null, ["true"]),
      },
    });

    for (const exercise of finalProjectLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 11: voicing and voice leading", () => {
  it("accepts inversion learning and an exploratory low-motion final voicing", () => {
    const progression: ChordProgression = ["C", "G", "Am", "F"];

    const rootContext = context({
      chordProgression: progression,
      voicingSettings: { inversions: [0, 0, 0, 0] },
    });
    expect(voiceLeadingLesson.exercises[0].evaluate(rootContext).every((check) => check.complete)).toBe(true);

    const firstContext = context({
      chordProgression: progression,
      voicingSettings: { inversions: [0, 1, 0, 0] },
      experiments: {
        "voicing.slot.1": experiment(2, 0, 1, ["0", "1"]),
      },
    });
    expect(voiceLeadingLesson.exercises[1].evaluate(firstContext).every((check) => check.complete)).toBe(true);

    const mixedContext = context({
      chordProgression: progression,
      voicingSettings: { inversions: [0, 1, 1, 2] },
      experiments: {
        "voicing.slot.0": experiment(1, 0, 1),
        "voicing.slot.1": experiment(3, 0, 2, ["0", "1", "2"]),
        "voicing.slot.2": experiment(1, 0, 1, ["1"]),
        "voicing.slot.3": experiment(1, 0, 2, ["2"]),
      },
    });
    expect(voiceLeadingLesson.exercises[2].evaluate(mixedContext).every((check) => check.complete)).toBe(true);
    expect(voiceLeadingLesson.exercises[3].evaluate(mixedContext).every((check) => check.complete)).toBe(true);
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
      experiments: { "bass.edit": experiment(8) },
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

    const ctx = context({
      A,
      grooveFeelSettings,
      experiments: {
        "groove.kick.velocity": experiment(4),
        "groove.hat.velocity": experiment(8),
        "groove.snare.velocity": experiment(2),
        "groove.swing": experiment(4, 0, 0.22, ["0", "0.22"]),
      },
    });

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
    const ctx = context({
      melody,
      experiments: { "melody.edit": experiment(6) },
    });

    for (const exercise of motifDevelopmentLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 15: melody over harmony", () => {
  it("evaluates the two-bar melody across both passes of the four-bar harmony", () => {
    const melody: MelodySequence = [
      60, 62, 60, 64,
      65, 67, 69, 67,
      65, 67, 69, 67,
      66, 67, 64, 60,
    ];
    const chordProgression: ChordProgression = ["C", "F", "G", "C"];
    const ctx = context({
      melody,
      chordProgression,
      experiments: { "melody.edit": experiment(6) },
    });

    for (const exercise of melodyOverHarmonyLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("does not pretend bars 3–4 use new melody steps", () => {
    const melody: MelodySequence = [
      60, null, null, null, null, null, null, null,
      65, null, null, null, null, null, null, 60,
    ];
    const chordProgression: ChordProgression = ["C", "F", "G", "C"];
    const checks = melodyOverHarmonyLesson.exercises[0].evaluate(
      context({
        melody,
        chordProgression,
        experiments: { "melody.edit": experiment(4) },
      }),
    );

    expect(checks.find((check) => check.label.startsWith("Bar 1"))?.complete).toBe(true);
    expect(checks.find((check) => check.label.startsWith("Bar 2"))?.complete).toBe(true);
    expect(checks.find((check) => check.label.startsWith("Bar 3"))?.complete).toBe(false);
    expect(checks.find((check) => check.label.startsWith("Bar 4"))?.complete).toBe(true);
  });
});

describe("lesson 16: harmonic function", () => {
  it("requires the functional changes to be rewritten as MIDI", () => {
    const cases: Array<[number, ChordProgression, number]> = [
      [0, ["C", "F", "G", "C"], 4],
      [1, ["Dm", "G", "C", "C"], 3],
      [2, ["C", "G", "Am", "F"], 4],
      [3, ["D7", "G", "C", "Am"], 4],
    ];

    for (const [index, progression, changes] of cases) {
      const ctx = context({
        chordProgression: progression,
        harmonySequence: harmonyFor(progression),
        experiments: {
          "harmony.note-edit": experiment(changes),
        },
      });
      expect(harmonicFunctionLesson.exercises[index].evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("does not accept the right functional labels without written harmony", () => {
    const checks = harmonicFunctionLesson.exercises[0].evaluate(
      context({
        chordProgression: ["C", "F", "G", "C"],
        experiments: { "harmony.note-edit": experiment(4) },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});

describe("lesson 17: phrase and form", () => {
  const A = { drums: true, bass: true, chords: true, melody: false };
  const APrime = { drums: true, bass: true, chords: false, melody: true };
  const B = { drums: false, bass: false, chords: true, melody: true };

  it("requires audible material relationships, not labels alone", () => {
    const contexts = [
      context({
        formSettings: {
          sections: ["A", "A′", "B", "A"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [A, APrime, B, A],
        },
        experiments: { "form.layer.1.chords": experiment(2) },
      }),
      context({
        formSettings: {
          sections: ["A", "A", "B", "B"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [A, A, B, B],
        },
        experiments: { "form.layer.2.drums": experiment(2) },
      }),
      context({
        formSettings: {
          sections: ["A", "B", "A", "A′"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [A, B, A, APrime],
        },
        experiments: { "form.layer.1.bass": experiment(2) },
      }),
      context({
        formSettings: {
          sections: ["A", "A", "B", "A"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [A, A, B, A],
        },
        experiments: { "form.layer.2.drums": experiment(2) },
      }),
    ];

    phraseFormLesson.exercises.forEach((exercise, index) => {
      expect(exercise.evaluate(contexts[index]).every((check) => check.complete)).toBe(true);
    });
  });

  it("rejects AABA labels when all four sections sound identical", () => {
    const checks = phraseFormLesson.exercises[3].evaluate(
      context({
        formSettings: {
          sections: ["A", "A", "B", "A"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [A, A, A, A],
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(false);
  });
});

describe("lesson 18: texture and orchestration", () => {
  it("requires hearing crowded and separated texture states", () => {
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
      experiments: {
        "texture.bassOctave": experiment(2, -1, 1, ["1", "-1"]),
        "texture.melodyOctave": experiment(2, -1, 1, ["-1", "1"]),
        "texture.openChords": experiment(3, null, null, ["true", "false"]),
        "texture.melodyOctaveDouble": experiment(3, null, null, ["true", "false"]),
        "arrangement.edit": experiment(2),
      },
    });

    for (const exercise of textureOrchestrationLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 19: EQ and spectral balance", () => {
  it("requires destructive sweeps before accepting corrective EQ", () => {
    const mixerSettings = {
      ...initialMixerSettings,
      drums: { ...initialMixerSettings.drums },
      bass: { ...initialMixerSettings.bass },
      chords: { ...initialMixerSettings.chords, highpass: 140 },
      melody: { ...initialMixerSettings.melody },
    };

    const lowCut = context({
      mixerSettings,
      experiments: {
        "mixer.chords.highpass": experiment(8, 20, 300),
      },
    });
    expect(eqSpectralBalanceLesson.exercises[0].evaluate(lowCut).every((check) => check.complete)).toBe(true);

    const searchEq = {
      ...initialEqSettings,
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { frequency: 1200, gain: 8, q: 4 },
      melody: { ...initialEqSettings.melody },
    };
    expect(
      eqSpectralBalanceLesson.exercises[1]
        .evaluate(context({
          eqSettings: searchEq,
          experiments: { "eq.chords.frequency": experiment(8, 400, 3000) },
        }))
        .every((check) => check.complete),
    ).toBe(true);

    const cutEq = {
      ...searchEq,
      chords: { frequency: 1200, gain: -3.5, q: 3 },
    };
    expect(
      eqSpectralBalanceLesson.exercises[2]
        .evaluate(context({
          eqSettings: cutEq,
          experiments: { "eq.chords.gain": experiment(6, -3.5, 8) },
        }))
        .every((check) => check.complete),
    ).toBe(true);

    const complementary = {
      ...cutEq,
      chords: { frequency: 1500, gain: -3, q: 2 },
      melody: { frequency: 2600, gain: 2.5, q: 1.2 },
    };
    expect(
      eqSpectralBalanceLesson.exercises[3]
        .evaluate(context({
          eqSettings: complementary,
          experiments: { "eq.melody.frequency": experiment(6, 1400, 3000) },
        }))
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 20: saturation and distortion", () => {
  it("requires hearing obvious saturation before choosing selective colour", () => {
    const saturationSettings = {
      drums: { drive: 0.6, wet: 0.3 },
      bass: { drive: 0.28, wet: 0.4 },
      chords: { drive: 0.22, wet: 0.2 },
      melody: { drive: 0.05, wet: 0.05 },
    };

    const ctx = context({
      saturationSettings,
      experiments: {
        "saturation.bass.wet": experiment(5, 0, 0.65),
        "saturation.drums.wet": experiment(5, 0.1, 0.75),
        "saturation.chords.wet": experiment(5, 0, 0.5),
      },
    });
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
      experiments: {
        "transport.play": experiment(1, null, null, ["sidechain"]),
        "sidechain.enabled": experiment(3, null, null, ["true", "false"]),
        "sidechain.release": experiment(4, 0.08, 0.4),
      },
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
      experiments: {
        "transport.play": experiment(1, null, null, ["sidechain"]),
      },
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
      experiments: {
        "sidechain.enabled": experiment(3, null, null, ["true", "false"]),
      },
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
      experiments: {
        "transport.play": experiment(1, null, null, ["sidechain"]),
        "drums.A.kick.edit": experiment(2, null, null, ["7:true", "7:false"]),
      },
    });
    expect(
      sidechainLesson.exercises[3]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });
});

describe("lesson 22: stereo width and mono", () => {
  it("requires hearing bad stereo extremes before choosing a hierarchy", () => {
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
    const ctx = context({
      mixerSettings,
      stereoSettings,
      experiments: {
        "mixer.chords.pan": experiment(6, -0.55, 0.55),
        "stereo.bass.width": experiment(4, 0.4, 0.9),
        "stereo.mono": experiment(2, null, null, ["true", "false"]),
      },
    });

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
      experiments: {
        "reference.capture": experiment(1, null, null, ["true"]),
        "reference.compare": experiment(4, null, null, ["1", "2", "3", "4"]),
        "reference.quiet": experiment(1, null, null, ["true"]),
        "stereo.mono": experiment(2, null, null, ["true", "false"]),
      },
    });

    for (const exercise of referenceMixingLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("lesson 24: relative minor", () => {
  it("maps A natural minor and establishes A as tonic", () => {
    const melody: MelodySequence = [
      69, 67, 65, 64, 62, 60, 59, 60,
      60, 62, 64, 65, 67, 65, 60, 57,
    ];
    const ctx = context({
      selectedPitchClasses: ["A", "B", "C", "D", "E", "F", "G"],
      melody,
      experiments: { "melody.edit": experiment(4) },
    });

    expect(
      relativeMinorLesson.exercises[0]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
    expect(
      relativeMinorLesson.exercises[1]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises a C-ending first phrase and A-ending second phrase", () => {
    const melody: MelodySequence = [
      57, 60, 62, 64, null, 67, 64, 60,
      57, 59, 60, 62, 65, 67, 60, 57,
    ];
    const checks = relativeMinorLesson.exercises[2].evaluate(
      context({ melody, experiments: { "melody.edit": experiment(2) } }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises the characteristic natural-minor degrees", () => {
    const melody: MelodySequence = [
      57, 60, 62, 65, 67, 64, 60, 57,
      59, 60, 65, 67, 64, 62, 60, 57,
    ];
    const checks = relativeMinorLesson.exercises[3].evaluate(
      context({ melody, experiments: { "melody.edit": experiment(3) } }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });
});

describe("lesson 25: harmonic minor and leading tone", () => {
  it("recognises the A harmonic minor pitch collection", () => {
    const ctx = context({
      selectedPitchClasses: ["A", "B", "C", "D", "E", "F", "G♯"],
      experiments: { "pitch-class.select": experiment(2) },
    });
    expect(
      harmonicMinorLesson.exercises[0]
        .evaluate(ctx)
        .every((check) => check.complete),
    ).toBe(true);
  });

  it("recognises leading-tone and augmented-second resolutions", () => {
    const melody: MelodySequence = [
      57, 60, 62, 64, 65, 68, 69, null,
      64, 65, 68, 69, 60, 64, 68, 69,
    ];
    const ctx = context({
      melody,
      experiments: { "melody.edit": experiment(6) },
    });

    for (const exercise of harmonicMinorLesson.exercises.slice(1)) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 26: minor-key progressions", () => {
  it("requires the minor cadences to be written into the harmony roll", () => {
    const progressions: ChordProgression[] = [
      ["Am", "Dm", "Am", "Am"],
      ["Am", "Dm", "E7", "Am"],
      ["Am", "G", "F", "E7"],
      ["Am", "Dm", "E7", "F"],
    ];

    progressions.forEach((progression, index) => {
      const experiments: LessonContext["experiments"] = index === 3
        ? {
            "harmony.note-edit": experiment(4),
            "harmony.chord.3": experiment(2, null, null, ["Am", "F"]),
          }
        : { "harmony.note-edit": experiment(index === 0 ? 3 : 4) };

      const ctx = context({
        chordProgression: progression,
        harmonySequence: harmonyFor(progression),
        experiments,
      });
      expect(minorCadencesLesson.exercises[index].evaluate(ctx).every((check) => check.complete)).toBe(true);
    });
  });
});

describe("lesson 27: seventh chords", () => {
  it("requires the added seventh tones to exist in the MIDI", () => {
    const cases: Array<[number, ChordProgression, Record<string, ReturnType<typeof experiment>>]> = [
      [0, ["Cmaj7", null, null, null], {
        "harmony.note-edit": experiment(1),
        "harmony.chord.0": experiment(2, null, null, ["C", "Cmaj7"]),
      }],
      [1, ["Cmaj7", "G7", "Cmaj7", "Cmaj7"], {
        "harmony.note-edit": experiment(2),
      }],
      [2, ["Dm7", "G7", "Cmaj7", "Cmaj7"], {
        "harmony.note-edit": experiment(3),
      }],
      [3, ["Cmaj7", "Am7", "Dm7", "G7"], {
        "harmony.note-edit": experiment(4),
      }],
    ];

    for (const [index, progression, experiments] of cases) {
      const ctx = context({
        chordProgression: progression,
        harmonySequence: harmonyFor(progression),
        experiments,
      });
      expect(seventhChordsLesson.exercises[index].evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("lesson 28: borrowed chords and modal mixture", () => {
  it("requires the chromatic borrowed notes to be written and explored", () => {
    const cases: Array<[number, ChordProgression, Record<string, ReturnType<typeof experiment>>]> = [
      [0, ["C", "Fm", "C", "C"], {
        "harmony.note-edit": experiment(2),
        "harmony.chord.1": experiment(2, null, null, ["F", "Fm"]),
      }],
      [1, ["C", "B♭", "F", "C"], {
        "harmony.note-edit": experiment(3),
      }],
      [2, ["C", "F", "Fm", "C"], {
        "harmony.note-edit": experiment(3),
      }],
      [3, ["C", "B♭", "Fm", "C"], {
        "harmony.note-edit": experiment(4),
      }],
    ];

    for (const [index, progression, experiments] of cases) {
      const ctx = context({
        chordProgression: progression,
        harmonySequence: harmonyFor(progression),
        experiments,
      });
      expect(modalMixtureLesson.exercises[index].evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});

describe("expanded harmony model", () => {
  it("spells and stores the chromatic/seventh chord tones used by lessons 26-28", () => {
    expect(chordMidi.E7).toEqual([52, 56, 59, 62]);
    expect(chordMidi.Cmaj7).toEqual([48, 52, 55, 59]);
    expect(chordMidi.G7).toEqual([55, 59, 62, 65]);
    expect(chordMidi.Fm).toEqual([53, 56, 60]);
    expect(chordMidi["B♭"]).toEqual([58, 62, 65]);
  });
});


describe("style lab lessons", () => {
  it("requires House to be built through rhythm, timbre, sidechain and arrangement decisions", () => {
    const A = clonePattern(initialPattern);
    [0, 4, 8, 12].forEach((step) => { A.kick[step] = true; });
    [2, 6, 10, 14].forEach((step) => { A.hat[step] = true; });
    const arrangement = cloneArrangement(initialArrangement);
    arrangement[0] = { drums: true, bass: false, chords: false, melody: false };
    arrangement[1] = { drums: true, bass: true, chords: false, melody: false };
    arrangement[2] = { drums: true, bass: true, chords: true, melody: false };
    arrangement[3] = { drums: true, bass: true, chords: true, melody: true };
    arrangement[4] = { drums: true, bass: true, chords: false, melody: true };
    arrangement[5] = { drums: true, bass: true, chords: true, melody: true };
    arrangement[6] = { drums: true, bass: false, chords: true, melody: true };
    arrangement[7] = { drums: true, bass: true, chords: true, melody: false };

    const common = context({
      A,
      arrangement,
      sidechainSettings: { enabled: true, amountDb: 4, release: 0.2 },
      experiments: {
        "transport.play": experiment(2, null, null, ["drums", "arrangement"]),
        "drums.A.kick.edit": experiment(2),
        "drums.A.hat.edit": experiment(2),
        "instrument.bassVoice": experiment(2, null, null, ["electric", "sub"]),
        "instrument.chordVoice": experiment(2, null, null, ["piano", "pluck"]),
        "sidechain.enabled": experiment(2, null, null, ["false", "true"]),
        "sidechain.amountDb": experiment(3, 0, 6, ["0", "6", "4"]),
        "arrangement.edit": experiment(5),
      },
    });

    for (const exercise of houseStyleLesson.exercises) {
      expect(exercise.evaluate(common).every((check) => check.complete)).toBe(true);
    }
  });

  it("does not treat a genre-like final state as enough without comparisons", () => {
    const A = clonePattern(initialPattern);
    [0, 4, 8, 12].forEach((step) => { A.kick[step] = true; });
    [2, 6, 10, 14].forEach((step) => { A.hat[step] = true; });

    expect(
      houseStyleLesson.exercises[1]
        .evaluate(context({ A }))
        .every((check) => check.complete),
    ).toBe(false);
  });

  it("accepts a Funk pass with articulated hats, syncopated bass and rhythmic harmony", () => {
    const A = clonePattern(initialPattern);
    for (let step = 0; step < 16; step += 2) A.hat[step] = true;
    const grooveFeelSettings = {
      swing: 0.12,
      velocities: {
        kick: [...initialGrooveFeelSettings.velocities.kick],
        snare: [...initialGrooveFeelSettings.velocities.snare],
        hat: Array.from({ length: 16 }, (_, step) => step % 4 === 0 ? 0.9 : 0.55),
      },
    };
    const bass = [...initialBassSequence];
    [0, 3, 6, 9, 12, 15, 18, 21].forEach((step, index) => {
      bass[step] = 36 + (index % 4);
    });
    const harmony = initialHarmonySequence.map((notes) => [...notes]);
    [0, 3, 8, 11, 16, 19, 24, 27].forEach((step) => {
      harmony[step] = [60, 64, 67];
    });

    const ctx = context({
      A,
      grooveFeelSettings,
      bassSequence: bass,
      harmonySequence: harmony,
      experiments: {
        "groove.swing": experiment(3, 0, 0.12, ["0", "0.12"]),
        "transport.play": experiment(2, null, null, ["bass", "harmony-song"]),
        "instrument.bassVoice": experiment(2, null, null, ["electric", "synth"]),
        "instrument.chordVoice": experiment(2, null, null, ["piano", "electric"]),
      },
    });
    for (const exercise of funkStyleLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("accepts Hip-hop exploration only after timing, motif and timbre have been compared", () => {
    const A = clonePattern(initialPattern);
    [0, 7, 10].forEach((step) => { A.kick[step] = true; });
    A.snare[4] = true;
    A.snare[12] = true;
    [0, 4, 8, 12].forEach((step) => { A.hat[step] = true; });
    const melody = [...initialMelody];
    [60, 63, 60, 67, 63].forEach((note, index) => {
      melody[index * 2] = note;
    });
    const ctx = context({
      A,
      melody,
      grooveFeelSettings: {
        ...initialGrooveFeelSettings,
        swing: 0.16,
        velocities: {
          kick: [...initialGrooveFeelSettings.velocities.kick],
          snare: [...initialGrooveFeelSettings.velocities.snare],
          hat: [...initialGrooveFeelSettings.velocities.hat],
        },
      },
      experiments: {
        "transport.play": experiment(2, null, null, ["drums", "motif"]),
        "groove.swing": experiment(3, 0, 0.16, ["0", "0.16"]),
        "instrument.bassVoice": experiment(2, null, null, ["electric", "sub"]),
        "instrument.pianoTouch": experiment(2, null, null, ["soft", "strong"]),
      },
    });
    for (const exercise of hipHopStyleLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("accepts Ambient only when long harmony, spatial comparison and sparse texture are real", () => {
    const harmony = initialHarmonySequence.map((notes) => [...notes]);
    const harmonyDurations = initialHarmonyDurations.map((entry) => ({ ...entry }));
    [0, 8, 16, 24].forEach((step) => {
      harmony[step] = [60, 64, 67];
      harmonyDurations[step] = { "60": 4, "64": 4, "67": 4 };
    });
    const arrangement = cloneArrangement(initialArrangement);
    arrangement[0] = { drums: false, bass: false, chords: true, melody: false };
    arrangement[1] = { drums: false, bass: false, chords: true, melody: true };
    arrangement[2] = { drums: true, bass: false, chords: true, melody: true };
    arrangement[3] = { drums: true, bass: true, chords: true, melody: true };
    arrangement[4] = { drums: false, bass: true, chords: true, melody: false };
    arrangement[5] = { drums: false, bass: false, chords: true, melody: true };
    arrangement[6] = { drums: true, bass: true, chords: true, melody: false };
    arrangement[7] = { drums: true, bass: true, chords: true, melody: true };

    const ctx = context({
      harmonySequence: harmony,
      harmonyDurations,
      arrangement,
      effectsSettings: {
        ...initialEffectsSettings,
        reverbDecay: 4,
        delayFeedback: 0.3,
      },
      experiments: {
        "transport.play": experiment(2, null, null, ["instrument-palette", "effects"]),
        "instrument.chordVoice": experiment(2, null, null, ["piano", "pad"]),
        "instrument.pianoTouch": experiment(2, null, null, ["soft", "medium"]),
        "effects.reverbDecay": experiment(4, 1.8, 5.2, ["1.8", "5.2", "4"]),
        "effects.delayFeedback": experiment(2, 0.1, 0.35, ["0.1", "0.35"]),
      },
    });
    for (const exercise of ambientStyleLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });

  it("accepts Pop when hook, harmony, arrangement and foreground timbre are all deliberate", () => {
    const melody = [...initialMelody];
    [60, 64, 60, 67, 64, 69].forEach((note, index) => {
      melody[index * 2] = note;
    });
    const progression: ChordProgression = ["C", "Am", "F", "G"];
    const harmony = initialHarmonySequence.map((notes) => [...notes]);
    progression.forEach((chord, bar) => {
      harmony[bar * 8] = chordMidi[chord!];
    });
    const arrangement = cloneArrangement(initialArrangement);
    arrangement[0] = { drums: true, bass: false, chords: false, melody: true };
    arrangement[1] = { drums: true, bass: true, chords: false, melody: true };
    arrangement[2] = { drums: true, bass: true, chords: true, melody: true };
    arrangement[3] = { drums: true, bass: true, chords: true, melody: false };
    arrangement[4] = { drums: false, bass: false, chords: true, melody: true };
    arrangement[5] = { drums: true, bass: true, chords: true, melody: true };
    arrangement[6] = { drums: true, bass: false, chords: true, melody: true };
    arrangement[7] = { drums: true, bass: true, chords: true, melody: true };

    const ctx = context({
      melody,
      chordProgression: progression,
      harmonySequence: harmony,
      arrangement,
      experiments: {
        "transport.play": experiment(3, null, null, ["motif", "harmony-song", "instrument-palette"]),
        "arrangement.edit": experiment(5),
        "instrument.chordVoice": experiment(2, null, null, ["piano", "electric"]),
        "instrument.pianoTouch": experiment(2, null, null, ["soft", "strong"]),
      },
    });
    for (const exercise of popStyleLesson.exercises) {
      expect(exercise.evaluate(ctx).every((check) => check.complete)).toBe(true);
    }
  });
});


describe("curriculum evaluator safety", () => {
  it("does not throw when an exercise has no experiment history yet", () => {
    const fresh = context();
    fresh.experiments = {};

    for (const lesson of implementedLessons) {
      for (const exercise of lesson.exercises) {
        expect(
          () => exercise.evaluate(fresh),
          lesson.id + " / " + exercise.id,
        ).not.toThrow();
      }
    }
  });
});
