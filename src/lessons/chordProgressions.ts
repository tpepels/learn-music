import {
  chordPitchClasses,
  type ChordProgression,
  type HarmonySequence,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function barSteps(sequence: HarmonySequence, bar: number): number[][] {
  return sequence.slice(bar * 8, bar * 8 + 8);
}

function activeStepCount(sequence: HarmonySequence, bar?: number): number {
  const steps = bar === undefined ? sequence : barSteps(sequence, bar);
  return steps.filter((notes) => notes.length > 0).length;
}

function noteEventCount(sequence: HarmonySequence): number {
  return sequence.reduce((total, notes) => total + notes.length, 0);
}

function pitchClasses(notes: number[]): Set<number> {
  return new Set(notes.map((midi) => ((midi % 12) + 12) % 12));
}

function barUsesAllChordTones(
  sequence: HarmonySequence,
  progression: ChordProgression,
  bar: number,
): boolean {
  const chord = progression[bar];
  if (!chord) return false;
  const written = pitchClasses(barSteps(sequence, bar).flat());
  return chordPitchClasses(chord).every((pitchClass) => written.has(pitchClass));
}

function writtenNotesFitChords(
  sequence: HarmonySequence,
  progression: ChordProgression,
): boolean {
  let found = false;

  for (let step = 0; step < sequence.length; step += 1) {
    const notes = sequence[step] ?? [];
    if (notes.length === 0) continue;
    found = true;

    const chord = progression[Math.floor(step / 8)];
    if (!chord) return false;
    const allowed = chordPitchClasses(chord);
    if (
      notes.some(
        (midi) => !allowed.includes(((midi % 12) + 12) % 12),
      )
    ) {
      return false;
    }
  }

  return found;
}

function rhythmSignature(sequence: HarmonySequence, bar: number): string {
  return barSteps(sequence, bar)
    .map((notes) => (notes.length > 0 ? "1" : "0"))
    .join("");
}

const lesson = lessonContentSchema.parse({
  id: "harmony.chords",
  number: 4,
  title: "Chords & progressions",
  eyebrow: "Piano · Harmony",
  hero: "Build the harmony with your own hands.",
  description:
    "Choose the chord for each bar, then write the actual notes and rhythm in a four-bar piano roll while your groove and melody keep playing.",
  overview:
    "A chord symbol only tells you which harmony is available. The musical part begins when you decide which chord tones sound, when they sound, whether they arrive together or separately, and how that rhythm interacts with the rest of the track.",
});

export const chordProgressionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.a",
        letter: "A",
        title: "Build C major yourself",
        learn: "Turn the symbol C into actual notes you place in time.",
        explanation:
          "C major contains C, E, and G. Those notes can appear in different octaves and do not have to arrive together. The chord symbol is a harmonic guide; the piano roll is where you make the part.",
        instruction:
          "Choose C for bar 1. On the first eighth-note position, stack a C, E, and G yourself in the piano roll. Press Play and hear your own notes enter with the groove and melody.",
        recognition:
          "The three notes should fuse into one stable harmony, but you should also be able to see and identify the individual notes you placed.",
        terms: [
          { term: "Chord", definition: "A harmonic identity made from two or more pitches heard in relation to one another." },
          { term: "Triad", definition: "A three-note chord containing root, third, and fifth." },
          { term: "Root", definition: "The note that gives the chord its name and basic identity." },
          { term: "Piano roll", definition: "A sequencer view with pitch vertically and time horizontally." },
        ],
        workspace: "harmony-song",
        checksLabel: "Build it",
        successLabel: "You wrote C major into the sequence",
      }),
      evaluate: ({ chordProgression, harmonySequence }) => {
        const first = pitchClasses(harmonySequence[0] ?? []);
        return [
          {
            label: "Bar 1 is C major",
            complete: chordProgression[0] === "C",
          },
          {
            label: "The first step contains C, E, and G",
            complete: [0, 4, 7].every((pitchClass) => first.has(pitchClass)),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.b",
        letter: "B",
        title: "Write I–IV–V–I",
        learn: "Make harmonic function audible by writing every chord into the phrase.",
        explanation:
          "In C major, I is C major, IV is F major, and V is G major. I feels like home, IV moves away, V creates expectation, and the last I answers that tension. You will now build those sounds rather than letting the app perform them for you.",
        instruction:
          "Set the four bars to C–F–G–C. In each bar, place all three notes of that chord somewhere in its eight-step region. They may be stacked or spread out. Keep Play running while you work.",
        recognition:
          "The chord tones should change with each bar while the existing groove and melody keep their identity. G should make the final C feel like an arrival.",
        terms: [
          { term: "I chord", definition: "The tonic chord built on scale degree 1; C major in the key of C." },
          { term: "IV chord", definition: "A predominant chord built on scale degree 4; F major in C." },
          { term: "V chord", definition: "The dominant chord built on scale degree 5; G major in C." },
          { term: "Harmonic function", definition: "The role harmony plays in stability, departure, tension, and resolution." },
        ],
        workspace: "harmony-song",
        checksLabel: "Write the phrase",
        successLabel: "Every bar now contains harmony you entered yourself",
      }),
      evaluate: ({ chordProgression, harmonySequence }) => [
        {
          label: "The progression is C → F → G → C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "F" &&
            chordProgression[2] === "G" &&
            chordProgression[3] === "C",
        },
        {
          label: "Every bar uses all three notes of its chord",
          complete: [0, 1, 2, 3].every((bar) =>
            barUsesAllChordTones(harmonySequence, chordProgression, bar),
          ),
        },
        {
          label: "Every written note belongs to the chord above that bar",
          complete: writtenNotesFitChords(harmonySequence, chordProgression),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.c",
        letter: "C",
        title: "Turn chords into a rhythm",
        learn: "Stop treating chords as four blocks and make an accompaniment pattern.",
        explanation:
          "A progression says which harmony is active; accompaniment says how you perform it. You can repeat a chord, split its notes, leave gaps, answer the drums, or place notes between the strong beats. That rhythmic decision is part of composition.",
        instruction:
          "Keep C–F–G–C, but spread the chord tones through time. Use at least eight different time positions across the phrase, including at least two offbeat eighths. Make at least one bar use three or more separate positions.",
        recognition:
          "The harmony should now behave like a part in the track rather than four labels. Listen for notes locking with or pushing against the groove.",
        terms: [
          { term: "Accompaniment", definition: "A musical part that supports another part while having its own rhythm and shape." },
          { term: "Broken chord", definition: "Chord tones played separately instead of all at once." },
          { term: "Offbeat", definition: "A weaker subdivision between the main beats." },
          { term: "Rhythmic placement", definition: "The decision of exactly where musical events happen in time." },
        ],
        workspace: "harmony-song",
        checksLabel: "Make it move",
        successLabel: "The chords now have a rhythm you composed",
      }),
      evaluate: ({ chordProgression, harmonySequence }) => {
        const offbeats = harmonySequence.filter(
          (notes, step) => notes.length > 0 && step % 2 === 1,
        ).length;
        const busiestBar = Math.max(
          ...[0, 1, 2, 3].map((bar) => activeStepCount(harmonySequence, bar)),
        );

        return [
          {
            label: "At least eight time positions contain harmony",
            complete: activeStepCount(harmonySequence) >= 8,
          },
          {
            label: "At least two harmony events land on offbeats",
            complete: offbeats >= 2,
          },
          {
            label: "At least one bar uses three or more separate positions",
            complete: busiestBar >= 3,
          },
          {
            label: "The notes still fit the chords",
            complete: writtenNotesFitChords(harmonySequence, chordProgression),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.d",
        letter: "D",
        title: "Write your accompaniment",
        learn: "Compose a four-bar chord part that has its own shape while still supporting the song.",
        explanation:
          "Now the harmonic rule becomes a constraint rather than an answer. Keep tonic as the frame and dominant before the final return, but decide the middle harmony and write a rhythm that develops across the four bars.",
        instruction:
          "Keep C in bars 1 and 4 and G in bar 3. Choose a different diatonic chord for bar 2. Rewrite the piano roll into a four-bar accompaniment: use at least two notes in every bar, at least twelve active time positions overall, at least three offbeats, and make the rhythm of at least one bar differ from another.",
        recognition:
          "You should hear one continuous musical part with a beginning, movement, dominant tension, and return—not a demonstration of four chord names.",
        terms: [
          { term: "Tonic", definition: "The harmonic home of the key." },
          { term: "Dominant", definition: "Harmony that strongly points toward tonic." },
          { term: "Voice", definition: "One pitch line within a chordal texture." },
          { term: "Pattern", definition: "A recurring arrangement of events in time that can be repeated or varied." },
        ],
        workspace: "harmony-song",
        checksLabel: "Compose",
        successLabel: "You wrote a real four-bar harmony part",
      }),
      evaluate: ({ chordProgression, harmonySequence }) => {
        const signatures = [0, 1, 2, 3].map((bar) =>
          rhythmSignature(harmonySequence, bar),
        );
        const offbeats = harmonySequence.filter(
          (notes, step) => notes.length > 0 && step % 2 === 1,
        ).length;

        return [
          {
            label: "C frames the phrase and G prepares the final return",
            complete:
              chordProgression[0] === "C" &&
              chordProgression[2] === "G" &&
              chordProgression[3] === "C",
          },
          {
            label: "Bar 2 uses a different chord from tonic C",
            complete:
              chordProgression[1] !== null &&
              chordProgression[1] !== "C",
          },
          {
            label: "Every bar contains at least two written time positions",
            complete: [0, 1, 2, 3].every(
              (bar) => activeStepCount(harmonySequence, bar) >= 2,
            ),
          },
          {
            label: "The part uses at least twelve time positions and three offbeats",
            complete:
              activeStepCount(harmonySequence) >= 12 &&
              offbeats >= 3 &&
              noteEventCount(harmonySequence) >= 12,
          },
          {
            label: "At least two bars have different rhythms",
            complete: new Set(signatures).size >= 2,
          },
          {
            label: "Every written note belongs to its current chord",
            complete: writtenNotesFitChords(harmonySequence, chordProgression),
          },
        ];
      },
    },
  ],
};
