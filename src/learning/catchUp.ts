import {
  cloneArrangement,
  cloneEqSettings,
  cloneGrooveFeelSettings,
  cloneHarmonyDurations,
  cloneHarmonySequence,
  cloneMixerSettings,
  cloneSaturationSettings,
  cloneStereoSettings,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassDurations,
  initialBassSequence,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialInstrumentSettings,
  initialMixerSettings,
  initialReferenceMixSettings,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  type ChordProgression,
  type HarmonyDurations,
  type HarmonySequence,
  type MelodySequence,
  type NoteDurationLane,
  type ProjectData,
  type StepPattern,
} from "../music/model";
import {
  cloneTonalContext,
  diatonicChord,
  initialTonalContext,
} from "../music/harmony";

export const LESSON_FIVE_ID = "sound.synthesis";

export const RECOVERED_LESSON_IDS = [
  "rhythm.pulse-and-groove",
  "rhythm.variation",
  "pitch.melody",
  "harmony.chords",
] as const;

export const RECOVERED_EXERCISE_IDS = RECOVERED_LESSON_IDS.flatMap(
  (lessonId) => ["a", "b", "c", "d"].map((letter) => lessonId + "." + letter),
);

export const LESSON_FIVE_RECOVERY_PITCH_CLASSES = [
  "C",
  "D",
  "E",
  "F",
  "G",
  "A",
  "B",
] as const;

function pattern(
  kick: number[],
  snare: number[],
  hat: number[],
): StepPattern {
  const lane = (active: number[]) =>
    Array.from({ length: 16 }, (_, step) => active.includes(step));

  return {
    kick: lane(kick),
    snare: lane(snare),
    hat: lane(hat),
  };
}

function buildHarmony(): HarmonySequence {
  const sequence: HarmonySequence = Array.from({ length: 32 }, () => []);
  const bars = [
    { notes: [48, 52, 55], steps: [0, 2, 5] },
    { notes: [53, 57, 60], steps: [0, 3, 4] },
    { notes: [55, 59, 62], steps: [0, 2, 5, 7] },
    { notes: [48, 52, 55], steps: [0, 3, 6] },
  ];

  bars.forEach((bar, barIndex) => {
    bar.steps.forEach((localStep) => {
      sequence[barIndex * 8 + localStep] = [...bar.notes];
    });
  });

  return sequence;
}

function buildHarmonyDurations(
  sequence: HarmonySequence,
): HarmonyDurations {
  return sequence.map((notes) =>
    Object.fromEntries(notes.map((midi) => [String(midi), 1])),
  );
}

const melody: MelodySequence = [
  60, 62, 64, 67,
  60, 62, 64, 67,
  67, 69, 67, 64,
  65, 64, 62, 60,
];

const melodyDurations: NoteDurationLane = Array(16).fill(1);
const harmonySequence = buildHarmony();

export function buildLessonFiveRecoveryProject(): ProjectData {
  return {
    bpm: 104,
    patterns: {
      A: pattern(
        [0, 4, 8, 10, 12],
        [4, 12],
        [0, 2, 4, 6, 8, 10, 12, 14],
      ),
      B: pattern(
        [0, 4, 8, 11, 12, 15],
        [4, 12, 14, 15],
        [0, 2, 4, 6, 8, 10, 12, 15],
      ),
    },
    melody: [...melody],
    melodyDurations: [...melodyDurations],
    tonalContext: cloneTonalContext(initialTonalContext),
    harmonicProgression: [
      diatonicChord(initialTonalContext, 1),
      diatonicChord(initialTonalContext, 4),
      diatonicChord(initialTonalContext, 5),
      diatonicChord(initialTonalContext, 1),
    ],
    chordProgression: ["C", "F", "G", "C"] satisfies ChordProgression,
    harmonySequence: cloneHarmonySequence(harmonySequence),
    harmonyDurations: cloneHarmonyDurations(
      buildHarmonyDurations(harmonySequence),
    ),
    accompanimentPattern: initialAccompanimentPattern,
    synthSettings: { ...initialSynthSettings },
    arrangement: cloneArrangement(initialArrangement),
    mixerSettings: cloneMixerSettings(initialMixerSettings),
    automationSettings: {
      melodyVolumeDb: [...initialAutomationSettings.melodyVolumeDb],
      chordFilterHz: [...initialAutomationSettings.chordFilterHz],
    },
    dynamicsSettings: { ...initialDynamicsSettings },
    effectsSettings: { ...initialEffectsSettings },
    voicingSettings: {
      inversions: [...initialVoicingSettings.inversions],
    },
    bassSequence: [...initialBassSequence],
    bassDurations: [...initialBassDurations],
    grooveFeelSettings: cloneGrooveFeelSettings(initialGrooveFeelSettings),
    formSettings: {
      sections: [...initialFormSettings.sections],
      roles: [...initialFormSettings.roles],
      layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
    },
    textureSettings: { ...initialTextureSettings },
    instrumentSettings: { ...initialInstrumentSettings },
    eqSettings: cloneEqSettings(initialEqSettings),
    saturationSettings: cloneSaturationSettings(initialSaturationSettings),
    sidechainSettings: { ...initialSidechainSettings },
    stereoSettings: cloneStereoSettings(initialStereoSettings),
    referenceMixSettings: {
      ...initialReferenceMixSettings,
      snapshot: null,
    },
  };
}

export const lessonFiveRecoveryProject = buildLessonFiveRecoveryProject();
