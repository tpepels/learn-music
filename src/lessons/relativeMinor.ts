import {
  aNaturalMinorPitchClasses,
  isANaturalMinorMidi,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function notes(melody: Array<number | null>): number[] {
  return melody.filter((note): note is number => note !== null);
}

function lastInRange(melody: Array<number | null>, start: number, end: number) {
  for (let index = end - 1; index >= start; index -= 1) {
    if (melody[index] !== null) return melody[index];
  }
  return null;
}

const lesson = lessonContentSchema.parse({
  id: "harmony.relative-minor",
  number: 24,
  title: "Relative minor",
  eyebrow: "Piano · Tonality",
  hero: "Keep the seven notes. Move the feeling of home."
  description:
    "Move from C major to A natural minor without changing the pitch collection. Hear how tonic, scale degrees, phrase endings, and melodic emphasis create a new tonal centre.",
  overview:
    "C major and A minor use the same seven notes. What changes is where the line settles and which notes feel structural. Put A in the places where C used to feel final and the same pitch collection starts behaving like A minor.",
});

export const relativeMinorLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.relative-minor.a",
        letter: "A",
        title: "Find A natural minor",
        learn: "Recognise that A natural minor and C major use the same pitch collection but a different tonic.",
        explanation:
          "A natural minor is A-B-C-D-E-F-G. These are exactly the same pitch classes as C major. The difference is tonal centre: A now behaves as home, and C becomes the minor third above it.",
        instruction:
          "Select A, B, C, D, E, F, and G on the chromatic keyboard. Leave all other pitch classes unselected. Then place A as the first note of the melody.",
        recognition:
          "Play the same seven notes once from C and once from A. Which starting point changes the shape of the scale most clearly to your ear?",
        terms: [
          { term: "Relative minor", definition: "The minor key sharing the same key signature and pitch collection as a major key. A minor is relative to C major." },
          { term: "Natural minor", definition: "A seven-note minor scale with degrees 1, 2, ♭3, 4, 5, ♭6, and ♭7." },
          { term: "Tonal centre", definition: "The pitch or chord perceived as the main point of stability or home." },
          { term: "Minor third", definition: "An interval of three semitones; in A minor, C is the minor third above A." },
        ],
        workspace: "minor-key",
        checksLabel: "Reframe the pitch collection",
        successLabel: "The C-major notes now point toward A as tonic",
      }),
      evaluate: ({ selectedPitchClasses, melody }) => [
        {
          label: "The seven A-natural-minor pitch classes are selected",
          complete: aNaturalMinorPitchClasses.every((pitch) =>
            selectedPitchClasses.includes(pitch),
          ),
        },
        {
          label: "No pitch outside A natural minor is selected",
          complete:
            selectedPitchClasses.length === 7 &&
            selectedPitchClasses.every((pitch) =>
              (aNaturalMinorPitchClasses as readonly string[]).includes(pitch),
            ),
        },
        {
          label: "The first sounding melody note is A",
          complete: notes(melody)[0] % 12 === 9,
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.relative-minor.b",
        letter: "B",
        title: "Make A feel like home",
        learn: "Create minor-key tonic gravity through phrase placement rather than by changing the available notes.",
        explanation:
          "A note feels structurally important when it appears at strong positions: beginnings, endings, longer notes, or repeated points of rest. In a minor-key melody, placing A at both ends helps the ear interpret the shared C-major/A-minor note collection around A.",
        instruction:
          "Write at least six notes using only A natural minor. Begin on A and make the final sounding note A as well.",
        recognition:
          "Stop the phrase on C once, then restore the final A. Which ending sounds complete in the version you wrote?",
        terms: [
          { term: "Tonic gravity", definition: "The tendency for notes and phrases to feel oriented toward the tonic as a point of rest." },
          { term: "Structural note", definition: "A note given extra importance by position, duration, repetition, or harmony." },
          { term: "Phrase ending", definition: "The final part of a musical phrase, where tonal stability or openness is often made clear." },
        ],
        workspace: "minor-key",
        checksLabel: "Establish tonic A",
        successLabel: "Your melody now begins and resolves on A",
      }),
      evaluate: ({ melody }) => {
        const sounding = notes(melody);
        return [
          { label: "At least six notes are present", complete: sounding.length >= 6 },
          {
            label: "Every note belongs to A natural minor",
            complete: sounding.length > 0 && sounding.every(isANaturalMinorMidi),
          },
          { label: "The melody begins on A", complete: sounding[0] % 12 === 9 },
          {
            label: "The final sounding note is A",
            complete: sounding[sounding.length - 1] % 12 === 9,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.relative-minor.c",
        letter: "C",
        title: "Hear the relative-key pivot",
        learn: "Use phrase endings to make the same notes point first toward C major, then toward A minor.",
        explanation:
          "Relative keys are closely related because they share every pitch. A melody can therefore shift emphasis between them without any chromatic note. Ending one phrase on C and the next on A is a simple way to hear that reinterpretation.",
        instruction:
          "Use only A-natural-minor/C-major notes. Make the last sounding note of steps 1–8 a C. Make the last sounding note of steps 9–16 an A.",
        recognition:
          "Play the two halves separately. Do their endings make the same seven notes point to different centres?",
        terms: [
          { term: "Relative keys", definition: "A major and minor key that share the same key signature and pitch collection." },
          { term: "Pivot", definition: "A musical element that can be understood in two tonal contexts and helps connect them." },
          { term: "Reinterpretation", definition: "Hearing the same pitch or chord with a different tonal role because the surrounding context has changed." },
        ],
        workspace: "minor-key",
        checksLabel: "Shift the tonal centre",
        successLabel: "The same note collection now points to two different homes",
      }),
      evaluate: ({ melody }) => {
        const firstEnding = lastInRange(melody, 0, 8);
        const secondEnding = lastInRange(melody, 8, 16);
        return [
          {
            label: "All sounding notes stay in the shared C-major/A-minor collection",
            complete: notes(melody).every(isANaturalMinorMidi),
          },
          {
            label: "The first phrase ends on C",
            complete: firstEnding !== null && firstEnding % 12 === 0,
          },
          {
            label: "The second phrase ends on A",
            complete: secondEnding !== null && secondEnding % 12 === 9,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.relative-minor.d",
        letter: "D",
        title: "Write the minor colour into the line",
        learn: "Use characteristic minor scale degrees while keeping the tonic clear.",
        explanation:
          "Natural minor is especially coloured by ♭3, ♭6, and ♭7. In A minor those are C, F, and G. Using them does not automatically make a melody expressive, but they distinguish the interval pattern from A major.",
        instruction:
          "Write at least eight notes. Include C, F, and G somewhere, stay inside A natural minor, and finish on A.",
        recognition:
          "Listen to C, F and G against A. Which of those notes most strongly changes the colour from the major-key phrases you wrote earlier?",
        terms: [
          { term: "♭3", definition: "The lowered third scale degree; one of the defining intervals of a minor scale." },
          { term: "♭6", definition: "The lowered sixth scale degree of natural minor." },
          { term: "♭7", definition: "The lowered seventh scale degree of natural minor, one whole tone below the tonic." },
        ],
        workspace: "minor-key",
        checksLabel: "Use the characteristic degrees",
        successLabel: "The melody now clearly speaks in natural minor",
      }),
      evaluate: ({ melody }) => {
        const sounding = notes(melody);
        const pcs = sounding.map((note) => note % 12);
        return [
          { label: "At least eight notes are present", complete: sounding.length >= 8 },
          { label: "C (♭3) appears", complete: pcs.includes(0) },
          { label: "F (♭6) appears", complete: pcs.includes(5) },
          { label: "G (♭7) appears", complete: pcs.includes(7) },
          {
            label: "The melody ends on tonic A",
            complete: sounding.length > 0 && sounding[sounding.length - 1] % 12 === 9,
          },
        ];
      },
    },
  ],
};
