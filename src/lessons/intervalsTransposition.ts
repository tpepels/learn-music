import { heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const pc = (midi: number) => ((midi % 12) + 12) % 12;

function noteAt(sequence: Array<number | null>, step: number, midi: number) {
  return sequence[step] === midi;
}

function activeNotes(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

const lesson = lessonContentSchema.parse({
  id: "pitch.intervals-transposition",
  number: 29,
  title: "Intervals & transposition",
  eyebrow: "Pitch · New keys",
  hero: "Keep the relationships when the starting note changes.",
  description:
    "Learn to hear pitch distance as an interval, transpose a motif without changing its shape, and write a phrase that belongs clearly to D major rather than falling back into C.",
  overview:
    "A key is not a collection of memorised piano shapes. Intervals describe distances between notes, and transposition preserves those distances while moving the music somewhere else.",
});

export const intervalsTranspositionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "pitch.intervals-transposition.a",
        letter: "A",
        title: "Build three intervals from C",
        learn: "Hear a second, third and fifth as distances rather than note names.",
        explanation:
          "From C, D is a major second above, E is a major third above and G is a perfect fifth above. The note names change in another key; the distances do not.",
        instruction:
          "In the melody grid place C4 on step 1, D4 on step 3, E4 on step 5 and G4 on step 7. Play the loop and listen to each jump away from C.",
        recognition:
          "Which distance feels closest to the starting note, and which sounds most open? Try singing the destination before it plays.",
        terms: [
          { term: "Interval", definition: "The pitch distance between two notes." },
          { term: "Major second", definition: "A distance of two semitones." },
          { term: "Major third", definition: "A distance of four semitones." },
          { term: "Perfect fifth", definition: "A distance of seven semitones." },
        ],
        workspace: "melody",
        checksLabel: "Build the distances",
        successLabel: "You can now hear three common intervals from the same root",
      }),
      evaluate: ({ melody, experiments }) => [
        { label: "Step 1 is C4", complete: noteAt(melody, 0, 60) },
        { label: "Step 3 is D4", complete: noteAt(melody, 2, 62) },
        { label: "Step 5 is E4", complete: noteAt(melody, 4, 64) },
        { label: "Step 7 is G4", complete: noteAt(melody, 6, 67) },
        { label: "You listened to the intervals", complete: heardPlayback(experiments) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.intervals-transposition.b",
        letter: "B",
        title: "Transpose a motif up a whole step",
        learn: "Preserve a motif by moving every note by the same interval.",
        explanation:
          "C–D–E–G becomes D–E–F♯–A when every note moves up two semitones. The absolute pitches change, but the contour and interval pattern stay the same.",
        instruction:
          "Write C4–D4–E4–G4 on steps 1, 3, 5 and 7. Then write its whole-step transposition D4–E4–F♯4–A4 on steps 9, 11, 13 and 15.",
        recognition:
          "Listen for identity rather than pitch height. Does the second half sound like the same idea moved upward?",
        terms: [
          { term: "Transposition", definition: "Moving musical material by the same interval while preserving its internal relationships." },
          { term: "Contour", definition: "The rising and falling shape of a melodic line." },
          { term: "Semitone", definition: "The smallest step in the twelve-note chromatic system." },
        ],
        workspace: "melody",
        checksLabel: "Move the motif",
        successLabel: "The same motif now exists in two keys",
      }),
      evaluate: ({ melody, experiments }) => {
        const source = [60, 62, 64, 67];
        const target = [62, 64, 66, 69];
        const steps = [0, 2, 4, 6];
        return [
          {
            label: "The source motif is C–D–E–G",
            complete: steps.every((step, i) => melody[step] === source[i]),
          },
          {
            label: "The second motif is exactly two semitones higher",
            complete: steps.every((step, i) => melody[step + 8] === target[i]),
          },
          { label: "You listened to both versions", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.intervals-transposition.c",
        letter: "C",
        title: "Map D major",
        learn: "Stop treating C major as the default map of music.",
        explanation:
          "D major contains D, E, F♯, G, A, B and C♯. Those pitches follow the same major-scale interval pattern as C major, but the keyboard shape is different.",
        instruction:
          "Use the melody grid to place all seven pitch classes of D major somewhere in the 16 steps: C♯, D, E, F♯, G, A and B. Order is up to you. Play the phrase and listen for F♯ and C♯ as the notes that make this key distinct from C major.",
        recognition:
          "Temporarily replace F♯ with F natural or C♯ with C natural. Which change most strongly pulls the phrase away from D major?",
        terms: [
          { term: "Major scale", definition: "A seven-note collection following the whole–whole–half–whole–whole–whole–half interval pattern." },
          { term: "Key", definition: "A tonal framework organised around a home pitch and its related scale and harmony." },
          { term: "Pitch class", definition: "All notes sharing the same letter-name pitch regardless of octave." },
        ],
        workspace: "melody",
        checksLabel: "Map the new key",
        successLabel: "Your phrase now contains the complete D-major pitch collection",
      }),
      evaluate: ({ melody, experiments }) => {
        const pcs = new Set(activeNotes(melody).map(pc));
        const dMajor = [1, 2, 4, 6, 7, 9, 11];
        return [
          {
            label: "All seven D-major pitch classes appear",
            complete: dMajor.every((pitchClass) => pcs.has(pitchClass)),
          },
          {
            label: "No pitch outside D major appears",
            complete: activeNotes(melody).every((midi) => dMajor.includes(pc(midi))),
          },
          { label: "You listened in the new key", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.intervals-transposition.d",
        letter: "D",
        title: "Write a phrase that belongs to D",
        learn: "Use tonic, characteristic scale tones and contour to establish a new tonal centre.",
        explanation:
          "A phrase can make D sound like home without copying a fixed melody. Starting or ending on D, using F♯ and C♯, and shaping a clear contour gives the ear evidence for the new key.",
        instruction:
          "Write six to ten melody onsets using only D-major notes. Start and end on D, include both F♯ and C♯ somewhere, and include at least one melodic leap of five semitones or more. Leave some empty steps.",
        recognition:
          "Does the final D sound like arrival? If not, simplify the last few notes before adding more material.",
        terms: [
          { term: "Tonal centre", definition: "The pitch heard as the point of rest or home." },
          { term: "Leap", definition: "A melodic move larger than an adjacent scale step." },
          { term: "Resolution", definition: "A move from relative instability toward a more stable pitch or harmony." },
        ],
        workspace: "melody",
        checksLabel: "Establish D",
        successLabel: "You wrote a phrase whose pitch relationships point to a new tonic",
      }),
      evaluate: ({ melody, experiments }) => {
        const notes = activeNotes(melody);
        const indexed = melody
          .map((note, step) => ({ note, step }))
          .filter((item): item is { note: number; step: number } => item.note !== null);
        const dMajor = [1, 2, 4, 6, 7, 9, 11];
        const leaps = indexed.slice(1).some((item, i) =>
          Math.abs(item.note - indexed[i].note) >= 5,
        );
        return [
          { label: "The phrase uses six to ten onsets", complete: notes.length >= 6 && notes.length <= 10 },
          { label: "The first and last sounding notes are D", complete: notes.length > 0 && pc(notes[0]) === 2 && pc(notes[notes.length - 1]) === 2 },
          { label: "F♯ and C♯ both appear", complete: notes.some((n) => pc(n) === 6) && notes.some((n) => pc(n) === 1) },
          { label: "Every note belongs to D major", complete: notes.every((n) => dMajor.includes(pc(n))) },
          { label: "The phrase contains at least one leap", complete: leaps },
          { label: "You listened for D as home", complete: heardPlayback(experiments) },
        ];
      },
    },
  ],
};
