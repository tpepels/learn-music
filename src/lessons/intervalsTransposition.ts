import { heardPlayback } from "./learningEvidence";
import {
  progressionMatchesDegrees,
  progressionSymbols,
} from "../music/harmony";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonDefinition,
} from "./types";

function noteAt(sequence: Array<number | null>, step: number, midi: number) {
  return sequence[step] === midi;
}

const lesson = lessonContentSchema.parse({
  id: "pitch.intervals-transposition",
  number: 29,
  title: "Intervals & transposition",
  eyebrow: "Pitch · New keys",
  hero: "Keep the relationships when the starting point changes.",
  description:
    "Learn to hear pitch distance as an interval, transpose a motif, and move melody and harmony into a new key without changing their internal function.",
  overview:
    "Intervals describe distances between notes. Harmonic degrees describe relationships to a tonic. Transposition preserves those relationships while the absolute note and chord names change.",
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
        successLabel: "You can hear three common intervals from the same root",
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
          "C-D-E-G becomes D-E-F♯-A when every note moves up two semitones. The absolute pitches change, but the contour and interval pattern stay the same.",
        instruction:
          "Write C4-D4-E4-G4 on steps 1, 3, 5 and 7. Then write its whole-step transposition D4-E4-F♯4-A4 on steps 9, 11, 13 and 15.",
        recognition:
          "Listen for identity rather than pitch height. Does the second half sound like the same idea moved upward?",
        terms: [
          { term: "Transposition", definition: "Moving musical material by the same interval while preserving its internal relationships." },
          { term: "Contour", definition: "The rising and falling shape of a melodic line." },
          { term: "Semitone", definition: "The smallest step in the twelve-note chromatic system." },
        ],
        workspace: "melody",
        checksLabel: "Move the motif",
        successLabel: "The same motif now exists at two pitch levels",
      }),
      evaluate: ({ melody, experiments }) => {
        const source = [60, 62, 64, 67];
        const target = [62, 64, 66, 69];
        const steps = [0, 2, 4, 6];
        return [
          {
            label: "The source motif is C-D-E-G",
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
        title: "Transpose harmony by function",
        learn: "Separate an absolute chord symbol from the harmonic degree it represents.",
        explanation:
          "I-IV-V-I is a relationship to the tonic, not a fixed list of chord names. In C major it is C-F-G-C. Change the tonic to D and the same stored harmonic identities become D-G-A-D while the Roman numerals stay I-IV-V-I.",
        instruction:
          "In the combined workspace choose C major and build I-IV-V-I. Then change only the tonic to D with the key control. Do not use the whole-project transpose buttons yet. Play the result and compare the chord symbols with the Roman numerals.",
        recognition:
          "Watch the two labels on each chord. Which part changes when C becomes D, and which part stays fixed?",
        terms: [
          { term: "Harmonic degree", definition: "A chord's position and role relative to the tonic, written here with a Roman numeral." },
          { term: "Chord symbol", definition: "The absolute root and quality of a chord, such as C, F♯m or B♭." },
          { term: "Functional transposition", definition: "Moving harmony to another tonic while preserving its scale-degree relationships." },
        ],
        workspace: "transposition",
        checksLabel: "Keep the function",
        successLabel: "The symbols moved to D major while I-IV-V-I stayed intact",
      }),
      evaluate: ({ tonalContext, harmonicProgression, experiments }) => {
        const symbols = progressionSymbols(harmonicProgression, tonalContext);
        return [
          {
            label: "The key is D major",
            complete: tonalContext.tonic === 2 && tonalContext.mode === "major",
          },
          {
            label: "The progression still has degrees I-IV-V-I",
            complete: progressionMatchesDegrees(harmonicProgression, [1, 4, 5, 1]),
          },
          {
            label: "The absolute chords are D-G-A-D",
            complete: symbols.join("|") === "D|G|A|D",
          },
          { label: "You listened to the transposed harmony", complete: heardPlayback(experiments) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "pitch.intervals-transposition.d",
        letter: "D",
        title: "Move melody and harmony together",
        learn: "Apply one transposition to written notes and to the tonal framework.",
        explanation:
          "Changing a key label can respell generated harmony, but written MIDI notes are still absolute pitches. A full project transposition moves those notes by the same interval while the structural chord progression keeps its degrees.",
        instruction:
          "Set the key to C major without using a project-transpose button. Put C4-D4-E4-G4 on steps 1, 3, 5 and 7 and keep I-IV-V-I in the chord track. Then press the D whole-project transpose button once. The motif should become D4-E4-F♯4-A4 and the harmony D-G-A-D.",
        recognition:
          "Play before and after if you want to compare them. The register moved, but the melodic intervals and the harmonic degrees should be unchanged.",
        terms: [
          { term: "Absolute pitch", definition: "A specific sounding pitch, represented by a MIDI note number in the editor." },
          { term: "Tonal context", definition: "The tonic and mode used to interpret harmonic degrees." },
          { term: "Structural identity", definition: "The interval or harmonic relationship that survives transposition." },
        ],
        workspace: "transposition",
        checksLabel: "Transpose the complete idea",
        successLabel: "Melody and harmony now moved together without changing their relationships",
      }),
      evaluate: ({ melody, tonalContext, harmonicProgression, experiments }) => {
        const target = [62, 64, 66, 69];
        const steps = [0, 2, 4, 6];
        return [
          {
            label: "The project is now in D major",
            complete: tonalContext.tonic === 2 && tonalContext.mode === "major",
          },
          {
            label: "The first motif is D-E-F♯-A",
            complete: steps.every((step, i) => melody[step] === target[i]),
          },
          {
            label: "Harmony still has degrees I-IV-V-I",
            complete: progressionMatchesDegrees(harmonicProgression, [1, 4, 5, 1]),
          },
          {
            label: "You used whole-project transposition",
            complete: (experiments["harmony.transpose"]?.changes ?? 0) >= 1,
          },
          { label: "You listened after transposing", complete: heardPlayback(experiments) },
        ];
      },
    },
  ],
};
