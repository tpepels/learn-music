import { progressionMatchesDegrees } from "../music/harmony";
import { changedControl, heardPlayback, studiedSource } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function sameNotes(actual: number[] | undefined, expected: number[]): boolean {
  if (!actual || actual.length !== expected.length) return false;
  const left = [...actual].sort((a, b) => a - b);
  const right = [...expected].sort((a, b) => a - b);
  return left.every((note, index) => note === right[index]);
}

function exactStudy(
  sequence: LessonContext["harmonySequence"],
  entries: Array<[number, number[]]>,
): boolean {
  const expectedSteps = new Set(entries.map(([step]) => step));
  return (
    entries.every(([step, notes]) => sameNotes(sequence[step], notes)) &&
    sequence.every((notes, step) => notes.length === 0 || expectedSteps.has(step))
  );
}

const lesson = lessonContentSchema.parse({
  id: "levine.major-modes-ii-v-i",
  number: 2,
  title: "Major modes & II-V-I",
  eyebrow: "Jazz Piano · Chapter 2",
  hero: "Derive seventh chords from the major scale, then hear II-V-I as one transposable harmonic relationship.",
  description:
    "Use the major-scale modes as a way to see where jazz seventh chords come from. Extract root, third, fifth and seventh from Ionian, Dorian and Mixolydian, then combine the resulting major-seventh, minor-seventh and dominant-seventh qualities into II-V-I.",
  overview:
    "The point is not to memorize seven unrelated scales. The same major-scale note collection produces different modal roots and chord qualities. Once II, V and I are understood as degrees, the whole progression can move intact to another major key.",
});

export const levineMajorModesIiViLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.major-modes-ii-v-i.a",
        letter: "A",
        title: "Build seventh chords from modes",
        learn:
          "Take every other note from a mode - 1, 3, 5 and 7 - and hear the seventh-chord quality that results.",
        explanation:
          "The seven modes in this chapter are rotations of the major-scale note collection: each begins on a different degree. Their names remain attached to those degrees in every major key. A seventh chord is formed by selecting alternate notes from the mode, so its root, third, fifth and seventh reveal the quality.

Three modes establish the central major-key chord types. C Ionian produces C major seventh; D Dorian produces D minor seventh; G Mixolydian produces G dominant seventh. The third and seventh are the variables that distinguish these qualities most clearly.",
        instruction:
          "Step through the seven-mode overview, then play the C-Ionian, D-Dorian and G-Mixolydian source scores. In the piano study set the key to C major. Clear the notes and set the four bar targets to Cmaj7, Dm7, G7 and Cmaj7. At the start of each bar write the four chord tones in root position: C-E-G-B, D-F-A-C, G-B-D-F, then C-E-G-B again.",
        recognition:
          "Can you hear that the note collection stays closely related while the root and the third/seventh combination change the chord quality?",
        source: {
          reference: "Chapter Two - Figures 2-1, 2-2, 2-4 and 2-6",
          focus:
            "The chapter derives seventh chords from major-scale modes by selecting root, third, fifth and seventh.",
          exampleIds: [
            "l02.fig2-1",
            "l02.fig2-2",
            "l02.fig2-4",
            "l02.fig2-6",
          ],
        },
        terms: [
          {
            term: "Mode",
            definition:
              "A scale organization heard from a particular degree of a parent scale.",
          },
          {
            term: "Major seventh chord",
            definition:
              "A chord with a major third, perfect fifth and major seventh above the root.",
          },
          {
            term: "Dominant seventh chord",
            definition:
              "A chord with a major third, perfect fifth and minor seventh above the root.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Derive the three chord qualities",
        successLabel: "You built Imaj7, ii7 and V7 from their modal chord tones",
      }),
      evaluate: ({ tonalContext, harmonicProgression, harmonySequence, experiments }) => [
        {
          label: "You studied the modes and all three source derivations",
          complete:
            studiedSource(experiments, "l02.fig2-1") &&
            studiedSource(experiments, "l02.fig2-2") &&
            studiedSource(experiments, "l02.fig2-4") &&
            studiedSource(experiments, "l02.fig2-6"),
        },
        {
          label: "The key is C major",
          complete: tonalContext.tonic === 0 && tonalContext.mode === "major",
        },
        {
          label: "The targets are Imaj7-ii7-V7-Imaj7",
          complete: progressionMatchesDegrees(harmonicProgression, [1, 2, 5, 1]),
        },
        {
          label: "All four root-position seventh chords are written",
          complete: exactStudy(harmonySequence, [
            [0, [48, 52, 55, 59]],
            [8, [50, 53, 57, 60]],
            [16, [55, 59, 62, 65]],
            [24, [48, 52, 55, 59]],
          ]),
        },
        {
          label: "You wrote the chord tones yourself",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the chord-quality sequence",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.major-modes-ii-v-i.b",
        letter: "B",
        title: "Hear II-V-I as one progression",
        learn:
          "Connect minor seventh, dominant seventh and major seventh into the basic major-key II-V-I.",
        explanation:
          "In a major key, the II, V and I chords combine three qualities already derived from the modes. II is minor seventh, V is dominant seventh and I is major seventh. In C major that gives Dm7-G7-Cmaj7.

Treat the Roman numerals as relationships rather than fixed chord names. II-V-I is useful precisely because the same relationship can be moved to another key. For now, keep the voicings in root position so the harmonic identity is unmistakable; smooth voice leading becomes the next chapter's problem.",
        instruction:
          "Study the II-V-I source analysis. Keep C major selected. Clear the fourth bar target and all written notes. Set bars 1-3 to Dm7, G7 and Cmaj7. Write each complete seventh chord at the start of its bar and leave bar 4 empty. Play the progression several times and listen to the dominant chord as the point of greatest pull before I.",
        recognition:
          "Does G7 sound like a destination, or does it make the following Cmaj7 feel necessary?",
        source: {
          reference: "Chapter Two - II-V-I explanation and practice",
          focus:
            "II is minor seventh, V dominant seventh and I major seventh; the relationship is practiced in every major key.",
          exampleIds: ["l02.ii-v-i"],
        },
        terms: [
          {
            term: "II-V-I",
            definition:
              "The major-key progression from the second-degree seventh chord through dominant to tonic.",
          },
          {
            term: "Harmonic degree",
            definition:
              "A chord's position relative to the key centre, expressed here with a Roman numeral.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write II-V-I in C",
        successLabel: "You can hear ii7-V7-Imaj7 as a directed three-chord progression",
      }),
      evaluate: ({ tonalContext, harmonicProgression, harmonySequence, experiments }) => [
        {
          label: "You studied the II-V-I source explanation",
          complete: studiedSource(experiments, "l02.ii-v-i"),
        },
        {
          label: "The key is C major",
          complete: tonalContext.tonic === 0 && tonalContext.mode === "major",
        },
        {
          label: "Bars 1-3 are ii7-V7-Imaj7",
          complete:
            progressionMatchesDegrees(harmonicProgression.slice(0, 3), [2, 5, 1]) &&
            harmonicProgression[3] === null,
        },
        {
          label: "Dm7-G7-Cmaj7 are written in root position",
          complete: exactStudy(harmonySequence, [
            [0, [50, 53, 57, 60]],
            [8, [55, 59, 62, 65]],
            [16, [48, 52, 55, 59]],
          ]),
        },
        {
          label: "You changed the targets and notes in this exercise",
          complete:
            changedControl(experiments, "harmony.note-edit", 12) &&
            changedControl(experiments, "harmony.chord.0") &&
            changedControl(experiments, "harmony.chord.1") &&
            changedControl(experiments, "harmony.chord.2"),
        },
        {
          label: "You listened to II-V-I",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.major-modes-ii-v-i.c",
        letter: "C",
        title: "Move II-V-I to F",
        learn:
          "Preserve harmonic function while every absolute chord name changes.",
        explanation:
          "A progression is learned more deeply when it is separated from one set of note names. In F major, the same II-V-I degrees become Gm7-C7-Fmaj7. The chord qualities do not change: II remains minor seventh, V remains dominant seventh and I remains major seventh.

Changing the key control preserves the stored harmonic degrees, but the written piano notes are absolute pitches. That distinction is useful: first watch the chord symbols move with the key, then deliberately rewrite the keyboard voicings for the new roots.",
        instruction:
          "Start from the C-major II-V-I, then change only the key to F major. Confirm that the targets read Gm7-C7-Fmaj7. Clear the written notes and rebuild those three root-position seventh chords at the starts of bars 1-3: G-B-flat-D-F, C-E-G-B-flat, F-A-C-E. Leave bar 4 empty and play the result.",
        recognition:
          "Can you hear the same II-V-I function even though every chord name and keyboard shape has moved?",
        source: {
          reference: "Chapter Two - II-V-I transposition practice",
          focus:
            "The chapter explicitly treats II-V-I as a progression to memorize in every major key.",
          exampleIds: ["l02.ii-v-i"],
        },
        terms: [
          {
            term: "Transposition by function",
            definition:
              "Moving a progression to another key while preserving the same scale-degree relationships.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transpose the progression",
        successLabel: "II-V-I now works in F without changing its harmonic functions",
      }),
      evaluate: ({ tonalContext, harmonicProgression, harmonySequence, experiments }) => [
        {
          label: "The final key is F major",
          complete: tonalContext.tonic === 5 && tonalContext.mode === "major",
        },
        {
          label: "The stored progression remains ii7-V7-Imaj7",
          complete:
            progressionMatchesDegrees(harmonicProgression.slice(0, 3), [2, 5, 1]) &&
            harmonicProgression[3] === null,
        },
        {
          label: "Gm7-C7-Fmaj7 are written in root position",
          complete: exactStudy(harmonySequence, [
            [0, [55, 58, 62, 65]],
            [8, [48, 52, 55, 58]],
            [16, [53, 57, 60, 64]],
          ]),
        },
        {
          label: "You actually changed key and rewrote the notes",
          complete:
            changedControl(experiments, "harmony.key") &&
            changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened in the new key",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
