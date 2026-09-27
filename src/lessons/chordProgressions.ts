import {
  harmonicChordPitchClasses,
  harmonicIdentityEquals,
  progressionMatchesDegrees,
  type HarmonicProgression,
  type TonalContext,
} from "../music/harmony";
import { type HarmonySequence } from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
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
  progression: HarmonicProgression,
  tonalContext: TonalContext,
  bar: number,
): boolean {
  const chord = progression[bar];
  if (!chord) return false;
  const written = pitchClasses(barSteps(sequence, bar).flat());
  return harmonicChordPitchClasses(chord, tonalContext).every((pitchClass) =>
    written.has(pitchClass),
  );
}

function writtenNotesFitChords(
  sequence: HarmonySequence,
  progression: HarmonicProgression,
  tonalContext: TonalContext,
): boolean {
  let found = false;

  for (let step = 0; step < sequence.length; step += 1) {
    const notes = sequence[step] ?? [];
    if (notes.length === 0) continue;
    found = true;

    const chord = progression[Math.floor(step / 8)];
    if (!chord) return false;
    const allowed = harmonicChordPitchClasses(chord, tonalContext);
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
        title: "Build the tonic triad yourself",
        learn: "Build a triad from scale degrees 1, 3 and 5, then turn the chord symbol into notes in time.",
        explanation:
          "A diatonic triad is built by taking every other note of the scale: root, third and fifth. In C major, start on scale degree 1 and derive degrees 3 and 5 from the scale map you made in Lesson 3. You can then stack those pitches, spread them across octaves, or place them at different moments. The chord symbol names the harmony; your MIDI decides how it sounds in time.",
        instruction:
          "The groove and melody are the ones you made in the previous lessons. Choose the tonic chord for bar 1. Using your C-major scale, derive scale degrees 1, 3 and 5 and stack those three pitches on the first eighth-note position. Press Play and hear the chord underneath your existing music.",
        recognition:
          "Play the three notes together, then remove one and add it back. What changes when the third or fifth disappears?",
        terms: [
          { term: "Chord", definition: "A harmonic identity made from two or more pitches heard in relation to one another." },
          { term: "Triad", definition: "A three-note chord containing root, third, and fifth." },
          { term: "Diatonic triad", definition: "A triad made only from notes of the current key, built by stacking alternate scale degrees." },
          { term: "Root", definition: "The note that gives the chord its name and basic identity." },
          { term: "Piano roll", definition: "A sequencer view with pitch vertically and time horizontally." },
        ],
        workspace: "harmony-song",
        checksLabel: "Build it",
        successLabel: "You wrote C major into the sequence",
      }),
      evaluate: ({
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => {
        const first = pitchClasses(harmonySequence[0] ?? []);
        return [
          { label: "You built, disturbed, and restored the chord notes", complete: changedControl(experiments, "harmony.note-edit", 5) },
          { label: "You listened to C major under your existing music", complete: heardPlayback(experiments) },
          {
            label: "Bar 1 is C major",
            complete: harmonicIdentityEquals(harmonicProgression[0], {
              degree: 1,
              quality: "major",
            }),
          },
          {
            label: "The first step contains C, E, and G",
            complete:
              harmonicProgression[0] !== null &&
              harmonicChordPitchClasses(
                harmonicProgression[0],
                tonalContext,
              ).every((pitchClass) => first.has(pitchClass)),
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
          "Roman numerals name chords by scale degree. Build I, IV and V by starting on scale degrees 1, 4 and 5 and taking every other scale note to make a triad. In C major those three functions sound like home, departure and dominant tension; the return to I completes the motion.",
        instruction:
          "Set the four bars to I–IV–V–I in C major. Derive each triad from the scale rather than from the checklist, then place all three chord tones somewhere in each bar's eight-step region. They may be stacked or spread out. Keep Play running while you work.",
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
      evaluate: ({
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => [
        { label: "You wrote the progression into the piano roll", complete: changedControl(experiments, "harmony.note-edit", 6) },
        { label: "You listened across the four chord changes", complete: heardPlayback(experiments) },
        {
          label: "The progression is C → F → G → C",
          complete: progressionMatchesDegrees(
            harmonicProgression,
            [1, 4, 5, 1],
          ),
        },
        {
          label: "Every bar uses all three notes of its chord",
          complete: [0, 1, 2, 3].every((bar) =>
            barUsesAllChordTones(harmonySequence, harmonicProgression, tonalContext, bar),
          ),
        },
        {
          label: "Every written note belongs to the chord above that bar",
          complete: writtenNotesFitChords(harmonySequence, harmonicProgression, tonalContext),
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
      evaluate: ({
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => {
        const offbeats = harmonySequence.filter(
          (notes, step) => notes.length > 0 && step % 2 === 1,
        ).length;
        const busiestBar = Math.max(
          ...[0, 1, 2, 3].map((bar) => activeStepCount(harmonySequence, bar)),
        );

        return [
          { label: "You redistributed the harmony rhythm in this exercise", complete: changedControl(experiments, "harmony.note-edit", 4) },
          { label: "You listened to the accompaniment against the drums", complete: heardPlayback(experiments) },
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
            complete: writtenNotesFitChords(harmonySequence, harmonicProgression, tonalContext),
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
      evaluate: ({
        harmonicProgression,
        tonalContext,
        harmonySequence,
        experiments,
      }) => {
        const signatures = [0, 1, 2, 3].map((bar) =>
          rhythmSignature(harmonySequence, bar),
        );
        const offbeats = harmonySequence.filter(
          (notes, step) => notes.length > 0 && step % 2 === 1,
        ).length;

        return [
          { label: "You rewrote the accompaniment in this exercise", complete: changedControl(experiments, "harmony.note-edit", 4) },
          { label: "You listened to the complete four-bar gesture", complete: heardPlayback(experiments) },
          {
            label: "C frames the phrase and G prepares the final return",
            complete:
              harmonicProgression[0]?.degree === 1 &&
              harmonicProgression[2]?.degree === 5 &&
              harmonicProgression[3]?.degree === 1,
          },
          {
            label: "Bar 2 uses a different chord from tonic C",
            complete:
              harmonicProgression[1] !== null &&
              harmonicProgression[1]?.degree !== 1,
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
            complete: writtenNotesFitChords(harmonySequence, harmonicProgression, tonalContext),
          },
        ];
      },
    },
  ],
};
