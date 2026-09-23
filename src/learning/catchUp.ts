import type {
  ChordProgression,
  HarmonyDurations,
  HarmonySequence,
  MelodySequence,
  NoteDurationLane,
  StepPattern,
} from "../music/model";

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

export const lessonFiveRecoveryProject = {
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
  selectedPitchClasses: ["C", "D", "E", "F", "G", "A", "B"],
  melody,
  melodyDurations,
  chordProgression: ["C", "F", "G", "C"] satisfies ChordProgression,
  harmonySequence,
  harmonyDurations: buildHarmonyDurations(harmonySequence),
} as const;
