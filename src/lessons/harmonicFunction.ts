import { chordFunction } from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

const lesson = lessonContentSchema.parse({
  id: "harmony.function",
  number: 16,
  title: "Harmonic function",
  eyebrow: "Composition · Harmony",
  hero: "Stop memorizing progressions as recipes.",
  description:
    "Hear chords as roles: tonic provides home, predominant moves away, dominant creates expectation, and resolution completes the motion. Then use deceptive resolution and a secondary dominant.",
  overview:
    "Functional harmony describes what a chord is doing in a tonal context. Different chord symbols can share similar roles. Understanding function makes progressions easier to invent because you can choose a role first and a specific chord second.",
});

export const harmonicFunctionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.a",
        letter: "A",
        title: "Build home → departure → tension → return",
        learn: "Hear tonic, predominant, and dominant as a directed cycle rather than four unrelated chords.",
        explanation:
          "Tonic feels stable, predominant moves away from tonic, dominant creates strong expectation, and tonic resolves that expectation. This functional path underlies a huge amount of tonal music.",
        instruction:
          "Set the four slots to C → F → G → C. Play it and follow the function strip: TONIC → PREDOMINANT → DOMINANT → TONIC.",
        recognition:
          "C feels like home, F opens the phrase, G feels unfinished, and the final C answers that tension.",
        terms: [
          { term: "Tonic", definition: "The harmonic function associated with stability and home." },
          { term: "Predominant", definition: "A function that moves away from tonic and commonly prepares dominant harmony." },
          { term: "Dominant", definition: "A tension-producing function that strongly points toward tonic." },
          { term: "Harmonic function", definition: "The role a chord plays in creating stability, departure, tension, or resolution." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Build the functional cycle",
        successLabel: "The progression now demonstrates the basic tonal motion",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression is C → F → G → C",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "F" &&
            chordProgression[2] === "G" &&
            chordProgression[3] === "C",
        },
        {
          label: "Functions read tonic → predominant → dominant → tonic",
          complete:
            chordProgression.every(Boolean) &&
            chordProgression.map((chord) => chord && chordFunction[chord]).join("|") ===
              "tonic|predominant|dominant|tonic",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.b",
        letter: "B",
        title: "Use ii–V–I",
        learn: "Hear one of the clearest predominant–dominant–tonic progressions.",
        explanation:
          "In C major, D minor is ii and acts as predominant; G is V and acts as dominant; C is I and tonic. ii–V–I is important because its roots, voices, and functions all create strong forward motion.",
        instruction:
          "Set slots 1–3 to Dm → G → C. Put C in slot 4 so the resolution has time to settle.",
        recognition:
          "Dm should sound like departure, G like the strongest tension, and C like arrival.",
        terms: [
          { term: "ii–V–I", definition: "A predominant–dominant–tonic progression built on scale degrees 2, 5, and 1." },
          { term: "Cadential progression", definition: "A harmonic pattern that strongly creates or confirms arrival." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Make a ii–V–I",
        successLabel: "Predominant, dominant, and tonic now form one directed cadence",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "First three slots are Dm → G → C",
          complete:
            chordProgression[0] === "Dm" &&
            chordProgression[1] === "G" &&
            chordProgression[2] === "C",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.c",
        letter: "C",
        title: "Avoid the expected tonic",
        learn: "Create a deceptive resolution by letting dominant move somewhere tonic-like but unexpected.",
        explanation:
          "After V, the ear strongly expects I. A deceptive resolution redirects that expectation—often to vi—so the tension changes character instead of closing completely.",
        instruction:
          "Create C → G → Am → F. Listen closely to G → Am: the dominant moves to vi instead of the expected C.",
        recognition:
          "The G chord should make you expect C. Am partially satisfies the motion but keeps the phrase open.",
        terms: [
          { term: "Deceptive resolution", definition: "A dominant chord resolving somewhere other than the expected tonic, commonly V→vi." },
          { term: "Expectation", definition: "A listener's learned sense that a musical event is likely to lead to another event." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Redirect the dominant",
        successLabel: "The dominant now resolves deceptively to vi",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "Progression contains G → Am as the central resolution",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "G" &&
            chordProgression[2] === "Am",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.function.d",
        letter: "D",
        title: "Tonicize the dominant",
        learn: "Use a chromatic secondary dominant to make one diatonic chord temporarily feel like a destination.",
        explanation:
          "D7 contains F♯, a pitch outside C major. That chromatic note gives D7 dominant function toward G. D7 is therefore V/V: the dominant of the dominant.",
        instruction:
          "Set D7 → G → C in the first three slots. Use any tonic-function chord in slot 4. Play the loop and hear how D7 makes G sound temporarily like an arrival before G itself points to C.",
        recognition:
          "D7 should sound brighter and more urgent than diatonic Dm. Its F♯ pulls toward G, then G pulls onward toward C.",
        terms: [
          { term: "Secondary dominant", definition: "A dominant-function chord that temporarily points to a diatonic chord other than the tonic." },
          { term: "V/V", definition: "The dominant of the dominant; in C major this is D7 resolving to G." },
          { term: "Tonicization", definition: "Temporarily making a non-tonic chord feel like a local point of arrival." },
          { term: "Chromatic harmony", definition: "Harmony using pitches or chords outside the current diatonic scale." },
        ],
        workspace: "harmonic-function",
        checksLabel: "Use V/V",
        successLabel: "A chromatic dominant now intensifies the route to V and I",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "D7 resolves to G",
          complete:
            chordProgression[0] === "D7" &&
            chordProgression[1] === "G",
        },
        {
          label: "G then resolves to C",
          complete:
            chordProgression[1] === "G" &&
            chordProgression[2] === "C",
        },
        {
          label: "Slot 4 returns to tonic function",
          complete: Boolean(
            chordProgression[3] &&
              chordFunction[chordProgression[3]] === "tonic",
          ),
        },
      ],
    },
  ],
};
