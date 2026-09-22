import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "harmony.minor-cadences",
  number: 26,
  title: "Minor-key progressions",
  eyebrow: "Composition · Harmony",
  hero: "Give minor harmony a real dominant.",
  description:
    "Move from natural-minor chords to the E7 dominant created by harmonic minor. Build an authentic minor cadence, hear the Andalusian cadence, and use a deceptive resolution in a minor key.",
  overview:
    "Natural minor provides the diatonic chords, but tonal minor commonly raises scale degree 7 when dominant harmony needs stronger direction. In A minor that turns Em into E or E7. The resulting G♯ leads to A and makes V–i much more decisive.",
});

export const minorCadencesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.a",
        letter: "A",
        title: "Move from i to iv",
        learn: "Hear tonic and predominant function inside a minor key.",
        explanation:
          "In A minor, Am is i and Dm is iv. Both are minor triads. Moving i→iv shifts away from tonic without yet creating the strong dominant tension of E7.",
        instruction:
          "Set bar 1 to Am and bar 2 to Dm. Put Am in bars 3 and 4 for now. Play the progression and hear Dm as departure from tonic.",
        recognition:
          "Am should feel like home. Dm should feel related but less settled, preparing the ear for further motion.",
        terms: [
          { term: "i chord", definition: "The minor tonic triad built on scale degree 1." },
          { term: "iv chord", definition: "The minor predominant triad built on scale degree 4 in a minor key." },
          { term: "Predominant", definition: "Harmony that moves away from tonic and often prepares a dominant." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Establish minor tonic and predominant",
        successLabel: "A minor now has a clear i→iv departure",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "Bar 1 is Am (i)", complete: chordProgression[0] === "Am" },
        { label: "Bar 2 is Dm (iv)", complete: chordProgression[1] === "Dm" },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.b",
        letter: "B",
        title: "Build i–iv–V7–i",
        learn: "Create a strong authentic cadence in minor using the raised leading tone.",
        explanation:
          "E7 contains E-G♯-B-D. G♯ does not belong to A natural minor, but it comes from harmonic minor and strongly resolves to A. That makes E7 the dominant seventh, V7, of A minor.",
        instruction:
          "Set the four bars to Am → Dm → E7 → Am. Play the loop and focus on E7→Am.",
        recognition:
          "E7 should sound much more urgent than Em. The G♯ inside E7 pulls upward into A when the tonic returns.",
        terms: [
          { term: "Authentic cadence", definition: "A dominant-to-tonic cadence, usually V→I or V→i." },
          { term: "Dominant seventh", definition: "A major triad plus a minor seventh, often written V7 and strongly directed toward tonic." },
          { term: "V7–i", definition: "Dominant-seventh resolving to a minor tonic." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Create the minor cadence",
        successLabel: "E7 now drives decisively into A minor",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is Am → Dm → E7 → Am",
          complete:
            chordProgression[0] === "Am" &&
            chordProgression[1] === "Dm" &&
            chordProgression[2] === "E7" &&
            chordProgression[3] === "Am",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.c",
        letter: "C",
        title: "Play the Andalusian cadence",
        learn: "Recognise the descending i–VII–VI–V pattern by name and sound.",
        explanation:
          "The Andalusian cadence is commonly described as a descending minor progression i–VII–VI–V. In A minor that is Am–G–F–E or E7. It appears across flamenco, popular music, film scoring, and many other styles, though its historical and stylistic uses vary.",
        instruction:
          "Set the bars to Am → G → F → E7.",
        recognition:
          "Listen to the bass-root descent A–G–F–E. The final E7 remains tense, naturally pulling the loop back to Am.",
        terms: [
          { term: "Andalusian cadence", definition: "A commonly named descending minor-key progression, often i–VII–VI–V." },
          { term: "Descending bass", definition: "A bass line whose successive structural notes move downward." },
          { term: "Loop tension", definition: "Ending a repeating progression on a chord that strongly points back to its beginning." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Build the descending progression",
        successLabel: "You can now recognise and build the Andalusian cadence",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is Am → G → F → E7",
          complete:
            chordProgression[0] === "Am" &&
            chordProgression[1] === "G" &&
            chordProgression[2] === "F" &&
            chordProgression[3] === "E7",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.minor-cadences.d",
        letter: "D",
        title: "Make a deceptive minor resolution",
        learn: "Redirect V7 away from i to keep a phrase moving.",
        explanation:
          "Just as V can move deceptively to vi in major, V7 in minor can avoid tonic. In A minor, E7→F moves dominant tension into VI instead of resolving to Am. The G♯ still rises to A inside the F-major chord, but the bass avoids tonic.",
        instruction:
          "Create Am → Dm → E7 → F. Compare the ending with Am → Dm → E7 → Am.",
        recognition:
          "E7 creates the same expectation, but F changes the emotional result: the phrase opens outward instead of closing on tonic.",
        terms: [
          { term: "Deceptive cadence", definition: "A dominant resolving to an unexpected chord instead of tonic." },
          { term: "VI chord", definition: "The major triad built on the lowered sixth scale degree in natural minor; F major in A minor." },
          { term: "Common tone", definition: "A pitch shared by two successive chords, often helping connect them smoothly." },
        ],
        workspace: "minor-harmony",
        checksLabel: "Redirect V7",
        successLabel: "The dominant now resolves deceptively to VI",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "E7 moves to F rather than Am",
          complete:
            chordProgression[0] === "Am" &&
            chordProgression[1] === "Dm" &&
            chordProgression[2] === "E7" &&
            chordProgression[3] === "F",
        },
      ],
    },
  ],
};
