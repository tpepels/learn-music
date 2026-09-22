import { Chord } from "tonal";
import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const lesson = lessonContentSchema.parse({
  id: "harmony.chords",
  number: 4,
  title: "Chords & progressions",
  eyebrow: "Piano · Harmony",
  hero: "Turn single notes into harmonic motion.",
  description:
    "Build major and minor triads, learn their Roman numerals in C major, hear tonic-subdominant-dominant movement, and assemble a common four-chord progression.",
  overview:
    "Harmony is what happens when pitches sound together and when one chord follows another. Chords gain meaning from the key they are in: I feels like home, IV opens the harmony outward, V creates strong tension toward I, and vi offers a softer minor alternative.",
});

const cMajor = Chord.get("C");
const fMajor = Chord.get("F");
const gMajor = Chord.get("G");

export const chordProgressionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.a",
        letter: "A",
        title: "Build the tonic triad",
        learn: "Recognise a major triad as root, third, and fifth.",
        explanation:
          "A triad is a three-note chord built by stacking thirds. C major contains C-E-G. C is the root, E is the third, and G is the fifth. Because C is the tonic of C major, this chord is called the I chord.",
        instruction:
          "Set the first chord slot to C major and audition it. Listen to how stable it sounds compared with the other available chords.",
        recognition:
          "A tonic major triad usually feels settled and complete. In C major, C-E-G is the strongest harmonic point of rest.",
        terms: [
          { term: "Chord", definition: "Two or more pitches heard together as a harmonic unit." },
          { term: "Triad", definition: "A three-note chord built from a root, third, and fifth." },
          { term: "Root", definition: "The note that gives a chord its name and basic identity." },
          { term: "I chord", definition: "The chord built on scale degree 1. In C major, I is C major." },
        ],
        workspace: "chords",
        checksLabel: "Build",
        successLabel: "The tonic triad is in place",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "Slot 1 contains C major", complete: chordProgression[0] === "C" },
        { label: "C major is the triad C-E-G", complete: cMajor.notes.join("-") === "C-E-G" },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.b",
        letter: "B",
        title: "Add IV and V",
        learn: "Hear three primary harmonic functions in a major key.",
        explanation:
          "In C major, the IV chord is F major (F-A-C) and the V chord is G major (G-B-D). I feels like home, IV moves away from home, and V creates the strongest pull back toward I.",
        instruction:
          "Keep C major in slot 1. Put F major in slot 2 and G major in slot 3. Audition the three chords in order.",
        recognition:
          "I sounds settled. IV often feels broader or more open. V sounds comparatively tense and unfinished, especially when you expect C major to follow.",
        terms: [
          { term: "Roman numeral", definition: "A way to name a chord by its scale degree rather than by an absolute note name." },
          { term: "IV chord", definition: "The chord built on scale degree 4. In C major, IV is F major." },
          { term: "V chord", definition: "The chord built on scale degree 5. In C major, V is G major." },
          { term: "Harmonic function", definition: "The role a chord plays in creating stability, departure, or tension inside a key." },
        ],
        workspace: "chords",
        checksLabel: "Hear function",
        successLabel: "I, IV, and V are mapped",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "I: C major in slot 1", complete: chordProgression[0] === "C" },
        { label: "IV: F major in slot 2", complete: chordProgression[1] === "F" },
        { label: "V: G major in slot 3", complete: chordProgression[2] === "G" },
        { label: "F is F-A-C and G is G-B-D", complete: fMajor.notes.join("-") === "F-A-C" && gMajor.notes.join("-") === "G-B-D" },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.c",
        letter: "C",
        title: "Make a V-I cadence",
        learn: "Hear the strongest common harmonic resolution in tonal music.",
        explanation:
          "A cadence is a harmonic gesture that marks arrival or closure. The movement V-I is especially strong because notes inside the V chord pull naturally toward notes of the tonic chord.",
        instruction:
          "Create C-F-G-C across the four slots: I-IV-V-I. Play the full progression and focus on the final G-to-C movement.",
        recognition:
          "The V chord should sound unresolved; the following I chord should sound like arrival. If you stop on G, the progression feels unfinished. If you continue to C, it settles.",
        terms: [
          { term: "Cadence", definition: "A harmonic or melodic gesture that creates a sense of pause, arrival, or ending." },
          { term: "V-I cadence", definition: "Movement from the dominant chord to the tonic; one of the strongest resolutions in tonal harmony." },
          { term: "Resolution", definition: "The release of musical tension into a more stable sound." },
        ],
        workspace: "chords",
        checksLabel: "Resolve",
        successLabel: "You created a clear V-I arrival",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "Progression begins on I", complete: chordProgression[0] === "C" },
        { label: "IV follows", complete: chordProgression[1] === "F" },
        { label: "V prepares the ending", complete: chordProgression[2] === "G" },
        { label: "Final I resolves the cadence", complete: chordProgression[3] === "C" },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.d",
        letter: "D",
        title: "Build I-V-vi-IV",
        learn: "Hear how the same key can support a different emotional trajectory.",
        explanation:
          "A chord progression is an ordered sequence of chords. I-V-vi-IV is common in pop because it balances stability, dominant tension, a relative-minor colour, and a return toward the tonic area without fully closing.",
        instruction:
          "Change the four slots to C-G-Am-F. Play the progression repeatedly and compare its looping quality with the stronger ending of I-IV-V-I.",
        recognition:
          "Unlike V-I, this progression does not finish with a strong cadence. F at the end leads smoothly back to C, which makes the sequence feel naturally loopable.",
        terms: [
          { term: "Chord progression", definition: "An ordered sequence of chords that creates harmonic motion over time." },
          { term: "vi chord", definition: "The chord built on scale degree 6. In C major, vi is A minor." },
          { term: "Relative minor", definition: "The minor key that shares the same key signature as a major key. A minor is relative to C major." },
        ],
        workspace: "chords",
        checksLabel: "Build the progression",
        successLabel: "You created I-V-vi-IV",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "I = C", complete: chordProgression[0] === "C" },
        { label: "V = G", complete: chordProgression[1] === "G" },
        { label: "vi = Am", complete: chordProgression[2] === "Am" },
        { label: "IV = F", complete: chordProgression[3] === "F" },
      ],
    },
  ],
};
