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
  hero: "Write the chord part, note by note.",
  description:
    "Choose the chord for each bar, then write the actual notes and rhythm in a four-bar piano roll while your groove and melody keep playing.",
  overview:
    "The chord name is only a map. The part is the notes you enter: which tones you use, when they arrive, whether they hit together, and how they sit against the groove.",
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
          "C major is built from C, E and G. You can stack them, spread them across octaves, or place them at different moments. The symbol tells you the harmony; your MIDI decides how it sounds in time.",
        instruction:
          "The groove and melody are the ones you made in the previous lessons. Choose C for bar 1, then stack C, E, and G on the first eighth-note position. Press Play and hear that chord enter underneath your existing music.",
        recognition:
          "Play the three notes together, then remove one and add it back. What changes when the third or fifth disappears?",
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
          "In C major, I is C, IV is F and V is G. The return to C matters because G leaves the phrase hanging forward. Write the notes yourself so the function comes from the part you made.",
        instruction:
          "Set the four bars to C–F–G–C. In each bar, place all three notes of that chord somewhere in its eight-step region. They may be stacked or spread out. Keep Play running while you work.",
        recognition:
          "Listen across bars 3–4. If you stop after G, does the loop feel unfinished? What changes when C arrives?",
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
          "The progression tells you the chords. The accompaniment is the performance: repeated stabs, broken notes, gaps, answers to the snare, or notes that land between the beats.",
        instruction:
          "Keep C–F–G–C, but spread the chord tones through time. Use at least eight different time positions across the phrase, including at least two offbeat eighths. Make at least one bar use three or more separate positions.",
        recognition:
          "Which notes lock with the drums, and which ones push against them? Does the chord part have a rhythm you could tap by itself?",
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
          "Keep C as the frame and G before the final return, but make the middle and the rhythm yours. The theory narrows the field; it does not write the accompaniment for you.",
        instruction:
          "Keep C in bars 1 and 4 and G in bar 3. Choose a different diatonic chord for bar 2. Rewrite the piano roll into a four-bar accompaniment: use at least two notes in every bar, at least twelve active time positions overall, at least three offbeats, and make the rhythm of at least one bar differ from another.",
        recognition:
          "Mute the chord labels mentally. Does the accompaniment still sound like one four-bar gesture with a clear return?",
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
