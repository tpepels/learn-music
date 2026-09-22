import { Scale } from "tonal";
import { isCMajorMidi } from "../music/model";
import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const cMajorNotes = Scale.get("C major").notes;

function soundingNotes(melody: Array<number | null>): number[] {
  return melody.filter((note): note is number => note !== null);
}

function lastSoundingNote(melody: Array<number | null>): number | null {
  for (let i = melody.length - 1; i >= 0; i -= 1) {
    if (melody[i] !== null) return melody[i];
  }
  return null;
}

const lesson = lessonContentSchema.parse({
  id: "pitch.melody",
  number: 3,
  title: "Keys & melody",
  eyebrow: "Piano · Composition",
  hero: "Learn where melodies get their sense of home.",
  description:
    "First map the notes of C major on the keyboard. Then use that key to write melodies, work with scale degrees, and build a short phrase from a repeated motif.",
  overview:
    "A key gives a collection of notes a hierarchy. The tonic feels like home; other notes create different degrees of stability and tension around it. Melody becomes easier to understand when you hear notes as positions inside a key rather than isolated piano keys.",
});

export const pianoCompositionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "pitch.melody.a",
        letter: "A",
        title: "Map the key of C major",
        learn: "Recognise the seven notes that belong to C major.",
        explanation:
          "A key is a tonal centre plus a family of notes that relate to it. C major uses C, D, E, F, G, A, and B: all the white-key pitch classes on the piano. C is the tonic, the note that feels most like home.",
        instruction:
          "Click the pitch classes that belong to C major. Audition them as you go. Select C, D, E, F, G, A, and B, but leave the black-key notes unselected.",
        recognition:
          "Play the selected notes in order from C upward. A major scale has the familiar do-re-mi-fa-sol-la-ti-do shape; in C major that shape uses only white keys.",
        terms: [
          { term: "Key", definition: "A tonal system organised around a home note and its related scale." },
          { term: "Tonic", definition: "Scale degree 1: the home note of a key. In C major, the tonic is C." },
          { term: "Scale", definition: "An ordered collection of pitches. The C major scale is C-D-E-F-G-A-B-C." },
          { term: "Semitone", definition: "The smallest distance between adjacent keys on a piano, including black and white keys." },
        ],
        workspace: "piano-key",
        checksLabel: "Find the key",
        successLabel: "You mapped C major",
      }),
      evaluate: ({ selectedPitchClasses }) => [
        {
          label: "All seven C-major notes are selected",
          complete: cMajorNotes.every((note) => selectedPitchClasses.includes(note)),
        },
        {
          label: "No notes outside C major are selected",
          complete: selectedPitchClasses.every((note) => cMajorNotes.includes(note)),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.melody.b",
        letter: "B",
        title: "Write inside the key",
        learn: "Compose a simple melody while staying inside C major.",
        explanation:
          "A melody is a succession of pitches heard as a line. Staying inside one key removes one variable so you can concentrate on contour, rhythm, repetition, and where the melody feels settled.",
        instruction:
          "Use the piano roll to place at least five notes. Keep every note inside C major and begin on C. Leave some empty steps if you want rests.",
        recognition:
          "A melody in C major will generally sound compatible with the C-major note collection you just mapped. Starting on C makes the tonal centre especially obvious.",
        terms: [
          { term: "Melody", definition: "A sequence of pitches perceived as a coherent musical line." },
          { term: "Contour", definition: "The overall rising, falling, or arch-like shape of a melody." },
          { term: "Rest", definition: "An intentional span of silence inside a musical line." },
        ],
        workspace: "melody",
        checksLabel: "Compose",
        successLabel: "Your first in-key melody is playable",
      }),
      evaluate: ({ melody }) => {
        const notes = soundingNotes(melody);
        return [
          { label: "At least five notes are present", complete: notes.length >= 5 },
          { label: "Every note belongs to C major", complete: notes.length > 0 && notes.every(isCMajorMidi) },
          { label: "The first sounding note is C", complete: notes.length > 0 && notes[0] % 12 === 0 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.melody.c",
        letter: "C",
        title: "Use scale degrees 1, 3, and 5",
        learn: "Hear notes by their function inside the key.",
        explanation:
          "Scale degrees number the notes of a scale from the tonic upward. In C major: C=1, D=2, E=3, F=4, G=5, A=6, B=7. Degrees 1, 3, and 5 form the C-major triad and tend to sound especially stable over C-major harmony.",
        instruction:
          "Edit your melody so it uses C, E, and G somewhere. End the melody on C and listen to the sense of arrival.",
        recognition:
          "Degree 1 sounds most settled. Degrees 3 and 5 also sound stable, while degrees such as 2, 4, and 7 often feel as though they want to move somewhere else.",
        terms: [
          { term: "Scale degree", definition: "The numbered position of a note inside a scale." },
          { term: "Degree 1", definition: "The tonic or home note." },
          { term: "Degrees 1-3-5", definition: "The root, third, and fifth of the tonic triad in a major key." },
        ],
        workspace: "melody",
        checksLabel: "Hear function",
        successLabel: "Your melody now outlines the tonic",
      }),
      evaluate: ({ melody }) => {
        const notes = soundingNotes(melody);
        const pcs = notes.map((note) => note % 12);
        const last = lastSoundingNote(melody);
        return [
          { label: "Degree 1 (C) appears", complete: pcs.includes(0) },
          { label: "Degree 3 (E) appears", complete: pcs.includes(4) },
          { label: "Degree 5 (G) appears", complete: pcs.includes(7) },
          { label: "The last sounding note is C", complete: last !== null && last % 12 === 0 },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.melody.d",
        letter: "D",
        title: "Build a motif and phrase",
        learn: "Turn a few notes into a recognisable musical idea.",
        explanation:
          "A motif is a short, memorable musical idea. A phrase is a larger unit built from one or more motifs. Repeating a motif establishes identity; answering it with something different creates direction.",
        instruction:
          "Write a four-step motif in steps 1-4. Repeat that exact motif in steps 5-8. Then use steps 9-16 as an answer that differs from the opening and ends on C.",
        recognition:
          "You should be able to point to a small idea, hear it return immediately, and then hear a longer answering gesture. The final C should make the whole phrase feel finished.",
        terms: [
          { term: "Motif", definition: "A short recurring musical idea with a recognisable pitch or rhythmic shape." },
          { term: "Phrase", definition: "A larger musical unit that feels like a complete or partial musical sentence." },
          { term: "Question-and-answer", definition: "Two related phrases where the first feels open and the second responds or completes it." },
        ],
        workspace: "melody",
        checksLabel: "Shape the phrase",
        successLabel: "You built a repeated motif and answer",
      }),
      evaluate: ({ melody }) => {
        const motif = melody.slice(0, 4);
        const repeat = melody.slice(4, 8);
        const answer = melody.slice(8, 16);
        const motifNotes = motif.filter((note) => note !== null).length;
        const repeated = motif.every((note, index) => note === repeat[index]);
        const answerDiffers = answer.some((note, index) => note !== melody[index]);
        const last = lastSoundingNote(melody);
        return [
          { label: "The opening motif contains at least two notes", complete: motifNotes >= 2 },
          { label: "Steps 5-8 repeat the motif exactly", complete: motifNotes >= 2 && repeated },
          { label: "The answering half differs from the opening", complete: answerDiffers },
          { label: "The phrase ends on tonic C", complete: last !== null && last % 12 === 0 },
        ];
      },
    },
  ],
};
