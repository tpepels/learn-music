import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "harmony.modal-mixture",
  number: 28,
  title: "Borrowed chords & modal mixture",
  eyebrow: "Composition · Chromatic harmony",
  hero: "Leave the scale without leaving the key.",
  description:
    "Borrow iv and ♭VII from C minor while keeping C major as the tonal centre. Hear the minor-IV colour, the flat-seven sound, and combine both into a chromatic four-bar progression.",
  overview:
    "Modal mixture borrows chords or pitches from the parallel major or minor mode. C major and C minor share the same tonic but not the same scale. Borrowing F minor or B♭ major can colour a C-major progression without establishing a full modulation.",
});

export const modalMixtureLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.a",
        letter: "A",
        title: "Borrow the minor iv",
        learn: "Use F minor inside C major and hear its characteristic A♭ colour.",
        explanation:
          "F major is IV in C major. F minor changes A to A♭, borrowing iv from the parallel key C minor. The chromatic A♭ often falls smoothly to G or helps create a bittersweet plagal sound back to C.",
        instruction:
          "Set C → Fm → C → C. Play the progression and compare Fm with the ordinary F-major IV chord.",
        recognition:
          "Fm should darken the harmony suddenly without making C stop feeling like home.",
        terms: [
          { term: "Modal mixture", definition: "Borrowing notes or chords from the parallel major or minor mode while retaining the original tonic." },
          { term: "Borrowed chord", definition: "A chord imported from a parallel mode rather than the current diatonic scale." },
          { term: "Parallel minor", definition: "The minor key sharing the same tonic as a major key; C minor is parallel to C major." },
          { term: "Minor iv", definition: "A minor chord built on scale degree 4, borrowed into major from the parallel minor." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Borrow iv",
        successLabel: "C major now contains a clear borrowed-minor colour",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "C moves to borrowed Fm and returns to C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "Fm" &&
            chordProgression[2] === "C",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.b",
        letter: "B",
        title: "Use ♭VII",
        learn: "Hear the broad, non-leading-tone dominant alternative created by borrowed B♭ major.",
        explanation:
          "B♭ major is ♭VII in C major and comes naturally from C minor or C Mixolydian-like colour. Unlike G major, it contains no B natural leading tone, so it creates a less strongly functional, more modal kind of motion.",
        instruction:
          "Set C → B♭ → F → C.",
        recognition:
          "B♭ should sound outside the C-major scale but not necessarily tense in the dominant sense. The progression feels broad and modal rather than strongly cadential.",
        terms: [
          { term: "♭VII", definition: "A major chord built on the lowered seventh scale degree; B♭ major in C." },
          { term: "Modal harmony", definition: "Harmony whose colour comes from a mode and may rely less on dominant-to-tonic function." },
          { term: "Leading-tone dominant", definition: "Dominant harmony containing scale degree 7 a semitone below tonic, such as G major containing B in C major." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Borrow the flat-seven chord",
        successLabel: "The progression now has a clear ♭VII modal colour",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is C → B♭ → F → C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "B♭" &&
            chordProgression[2] === "F" &&
            chordProgression[3] === "C",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.c",
        letter: "C",
        title: "Use the minor-IV cliché",
        learn: "Hear one of the most recognisable borrowed-chord gestures in major-key songwriting.",
        explanation:
          "A common colour is IV→iv→I: F major becomes F minor before resolving to C. The note A descends chromatically to A♭ and then often to G inside C major, creating a smooth emotional change.",
        instruction:
          "Set C → F → Fm → C and loop it.",
        recognition:
          "Listen for one pitch inside the harmony sliding downward: A in F, A♭ in Fm, then G in C.",
        terms: [
          { term: "Chromatic line", definition: "A melodic line moving by successive semitones, even when it occurs inside chord voices." },
          { term: "IV–iv–I", definition: "A major subdominant changing to borrowed minor subdominant before tonic." },
          { term: "Plagal motion", definition: "Movement from subdominant-family harmony toward tonic, classically IV→I." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Create IV→iv→I",
        successLabel: "The borrowed iv now emerges from a chromatic inner line",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is C → F → Fm → C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "F" &&
            chordProgression[2] === "Fm" &&
            chordProgression[3] === "C",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.modal-mixture.d",
        letter: "D",
        title: "Combine two borrowed colours",
        learn: "Use chromatic harmony selectively while preserving the original tonic.",
        explanation:
          "Borrowed chords are strongest when they serve a musical direction rather than appearing merely because they are available. Combining ♭VII and iv creates two distinct chromatic colours while C at the beginning and end keeps the tonal centre explicit.",
        instruction:
          "Create C → B♭ → Fm → C.",
        recognition:
          "The middle of the progression should sound distinctly outside ordinary C major, yet the final C should still feel like the same home you started from.",
        terms: [
          { term: "Chromatic harmony", definition: "Harmony containing pitches or chords outside the prevailing diatonic scale." },
          { term: "Tonal anchor", definition: "A repeated or strategically placed tonic event that helps preserve a sense of key." },
          { term: "Colour chord", definition: "A chord chosen partly for timbral or emotional contrast rather than only for basic functional necessity." },
        ],
        workspace: "borrowed-harmony",
        checksLabel: "Use mixture without losing the tonic",
        successLabel: "Two borrowed chords now colour a still-recognisable C-major centre",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is C → B♭ → Fm → C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "B♭" &&
            chordProgression[2] === "Fm" &&
            chordProgression[3] === "C",
        },
      ],
    },
  ],
};
