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

function melodicLine(entries: Array<[number, number]>): Array<[number, number[]]> {
  return entries.map(([step, note]) => [step, [note]]);
}

const lesson = lessonContentSchema.parse({
  id: "levine.scale-theory",
  number: 9,
  title: "Scale theory",
  eyebrow: "Jazz Piano · Chapter 9",
  hero: "Hear scales as the horizontal form of harmony: the available pitch field changes when the chord quality changes.",
  description:
    "Connect major-scale modes, melodic-minor modes, diminished harmony and whole-tone harmony directly to the chords they support.",
  overview:
    "The point is not to recite scale names. The useful question is which pitch collection belongs to the chord in front of you, which notes need special handling, and how symmetrical scales create several equivalent harmonic readings.",
});

export const levineScaleTheoryLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.scale-theory.a",
        letter: "A",
        title: "Replace Ionian's fourth with Lydian's sharp fourth",
        learn:
          "Compare C Ionian with C Lydian and isolate the one pitch that changes the major-seventh colour.",
        explanation:
          "A scale and its chord are two forms of the same harmonic material: one heard horizontally, the other vertically. Over C major seventh, C Ionian supplies the notes of the C-major scale, but the fourth F creates a strong rub when it is held against the chord. This is often called an avoid note, but the term is not absolute - a passing or quickly resolved dissonance can still be musical.\n\nC Lydian changes only that fourth, raising F to F-sharp. That removes the semitone against E and gives the major-seventh chord a different colour while leaving the remaining C-major chord tones intact.",
        instruction:
          "Study the major-scale harmony map. Clear the piano grid. In bar 1 write C4-D4-E4-F4-G4-A4-B4-C5 on steps 1-8. In bar 3 write C4-D4-E4-F-sharp4-G4-A4-B4-C5 on steps 17-24. Play the loop and focus on F versus F-sharp.",
        recognition:
          "Can you hear why the natural fourth needs more care over C major seventh while the raised fourth settles into the chord more easily?",
        source: {
          reference: "Chapter Nine - Figures 9-3 through 9-10",
          focus:
            "Major-scale modes pair with their diatonic seventh chords; the fourth over a major-seventh chord needs special handling, and Lydian replaces it with a raised fourth.",
          exampleIds: ["l09.major-scale-harmony"],
        },
        terms: [
          {
            term: "Avoid note",
            definition:
              "A scale tone that creates a conspicuous clash when sustained against a chord; it may still work as a passing, resolving or otherwise contextual dissonance.",
          },
          {
            term: "Lydian",
            definition:
              "A major mode with a raised fourth, giving a major-seventh chord a sharp-eleven colour.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare Ionian and Lydian",
        successLabel: "You isolated the fourth as the pitch that changes the major-seventh colour",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the major-scale harmony map",
          complete: studiedSource(experiments, "l09.major-scale-harmony"),
        },
        {
          label: "Both C modes are written",
          complete: exactStudy(harmonySequence, melodicLine([
            [0, 60], [1, 62], [2, 64], [3, 65], [4, 67], [5, 69], [6, 71], [7, 72],
            [16, 60], [17, 62], [18, 64], [19, 66], [20, 67], [21, 69], [22, 71], [23, 72],
          ])),
        },
        {
          label: "You entered the two pitch fields",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the fourth and sharp fourth",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.scale-theory.b",
        letter: "B",
        title: "Rotate one melodic-minor collection",
        learn:
          "Hear C melodic minor, F Lydian dominant and B altered as different roots applied to the same seven notes.",
        explanation:
          "Melodic minor harmony uses the same principle as major-scale harmony: modes are rotations of one pitch collection, but their chord qualities are different. C melodic minor is C-D-E-flat-F-G-A-B. Starting the same notes on F gives F Lydian dominant; starting on B gives the altered mode.\n\nThe altered mode compresses many dominant alterations into one scale: flat nine, sharp nine, sharp eleven and flat thirteen are all present around the dominant's third and seventh. The chord symbol is usually shortened to alt instead of listing every alteration.",
        instruction:
          "Study the melodic-minor mode map. Clear the grid. Write C-D-E-flat-F-G-A-B-C on steps 1-8, F-G-A-B-C-D-E-flat-F on steps 9-16, and B-C-D-E-flat-F-G-A-B on steps 17-24. Play all three lines without changing the pitch collection.",
        recognition:
          "Can you hear that the notes remain the same while the starting point changes the harmonic identity from minor-major to Lydian dominant to altered dominant?",
        source: {
          reference: "Chapter Nine - Figures 9-19 through 9-25",
          focus:
            "The melodic-minor modes share one pitch collection while supporting minor-major, Lydian-dominant, half-diminished and altered harmonies.",
          exampleIds: ["l09.melodic-minor-harmony"],
        },
        terms: [
          {
            term: "Lydian dominant",
            definition:
              "A dominant mode with a raised fourth, built here from the fourth degree of melodic minor.",
          },
          {
            term: "Altered mode",
            definition:
              "The seventh mode of melodic minor, containing the dominant third and seventh plus the common altered tensions.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Rotate the melodic-minor collection",
        successLabel: "You heard three harmonic identities inside one seven-note collection",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied melodic-minor harmony",
          complete: studiedSource(experiments, "l09.melodic-minor-harmony"),
        },
        {
          label: "The three rotations are written",
          complete: exactStudy(harmonySequence, melodicLine([
            [0, 60], [1, 62], [2, 63], [3, 65], [4, 67], [5, 69], [6, 71], [7, 72],
            [8, 65], [9, 67], [10, 69], [11, 71], [12, 72], [13, 74], [14, 75], [15, 77],
            [16, 59], [17, 60], [18, 62], [19, 63], [20, 65], [21, 67], [22, 69], [23, 71],
          ])),
        },
        {
          label: "You entered all three modal rotations",
          complete: changedControl(experiments, "harmony.note-edit", 24),
        },
        {
          label: "You listened to the changing roots",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.scale-theory.c",
        letter: "C",
        title: "Give the half-diminished chord a natural ninth",
        learn:
          "Compare A Locrian with A Locrian sharp-two and hear how only the ninth changes.",
        explanation:
          "A half-diminished chord can be paired with ordinary Locrian from a major scale, but that scale gives the chord a flat ninth. The sixth mode of melodic minor raises that note while leaving the root, minor third, flat fifth and minor seventh intact.\n\nOn A half-diminished, A Locrian contains B-flat; A Locrian sharp-two contains B-natural. The natural-nine version is a common choice, while the older Locrian sound remains valid.",
        instruction:
          "Study the half-diminished comparison. Clear the grid. Write A3-B-flat3-C4-D4-E-flat4-F4-G4-A4 on steps 1-8. Then write A3-B3-C4-D4-E-flat4-F4-G4-A4 on steps 17-24. Play the two modes and listen only to the second scale degree.",
        recognition:
          "Can you hear the natural ninth as a cleaner colour without losing the half-diminished identity?",
        source: {
          reference: "Chapter Nine - Figures 9-13, 9-22 and 9-23",
          focus:
            "Half-diminished harmony can use Locrian from major harmony or Locrian sharp-two from melodic minor; the difference is the ninth.",
          exampleIds: ["l09.half-diminished-modes"],
        },
        terms: [
          {
            term: "Locrian",
            definition:
              "A mode with a minor third, flat fifth, minor seventh and flat second above the root.",
          },
          {
            term: "Locrian sharp-two",
            definition:
              "A half-diminished mode with a natural second or ninth, derived from the sixth degree of melodic minor.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare the two half-diminished modes",
        successLabel: "You changed one pitch and heard the ninth reshape the chord-scale colour",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the half-diminished mode comparison",
          complete: studiedSource(experiments, "l09.half-diminished-modes"),
        },
        {
          label: "Both A half-diminished modes are written",
          complete: exactStudy(harmonySequence, melodicLine([
            [0, 57], [1, 58], [2, 60], [3, 62], [4, 63], [5, 65], [6, 67], [7, 69],
            [16, 57], [17, 59], [18, 60], [19, 62], [20, 63], [21, 65], [22, 67], [23, 69],
          ])),
        },
        {
          label: "You entered both scale forms",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to flat-nine versus natural-nine",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.scale-theory.d",
        letter: "D",
        title: "Hear diminished symmetry by a minor third",
        learn:
          "Start the same half-step/whole-step diminished collection on G and E and discover that the pitch set is unchanged.",
        explanation:
          "The diminished scale alternates half steps and whole steps. Because that interval pattern is symmetrical, transposing the scale by a minor third reproduces the same collection. A G half-step/whole-step scale and an E half-step/whole-step scale therefore contain exactly the same eight pitch classes.\n\nThat symmetry is also why dominant flat-nine chords whose roots lie a minor third apart can share diminished-scale material. This harmonic ambiguity does not mean every apparent diminished chord is automatically a substitute dominant; the bass and surrounding progression still matter.",
        instruction:
          "Study the diminished symmetry map. Clear the grid. Write G3-A-flat3-B-flat3-B3-C-sharp4-D4-E4-F4 on steps 1-8. On steps 17-24 write the same pitch collection starting from E3: E3-F3-G3-A-flat3-B-flat3-B3-C-sharp4-D4. Play the two rotations.",
        recognition:
          "Can you hear the second line as the same eight-note world rotated by a minor third rather than as a newly constructed scale?",
        source: {
          reference: "Chapter Nine - Figures 9-27 through 9-39",
          focus:
            "Diminished scales alternate half and whole steps, repeat under minor-third transposition, and support several dominant-flat-nine readings from one symmetrical collection.",
          exampleIds: ["l09.diminished-harmony"],
        },
        terms: [
          {
            term: "Symmetrical scale",
            definition:
              "A scale built from a repeating interval pattern that reproduces the same pitch collection under certain transpositions.",
          },
          {
            term: "Half-step/whole-step diminished",
            definition:
              "An eight-note scale alternating semitone and whole-tone intervals, commonly used over dominant-flat-nine harmony.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Rotate the diminished collection",
        successLabel: "You heard the minor-third symmetry directly instead of treating it as a memorized rule",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied diminished-scale symmetry",
          complete: studiedSource(experiments, "l09.diminished-harmony"),
        },
        {
          label: "Both diminished rotations are written",
          complete: exactStudy(harmonySequence, melodicLine([
            [0, 55], [1, 56], [2, 58], [3, 59], [4, 61], [5, 62], [6, 64], [7, 65],
            [16, 52], [17, 53], [18, 55], [19, 56], [20, 58], [21, 59], [22, 61], [23, 62],
          ])),
        },
        {
          label: "You entered the two rotations",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened for the repeated interval pattern",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.scale-theory.e",
        letter: "E",
        title: "Reduce whole-tone harmony to two collections",
        learn:
          "Compare the two possible whole-tone scales and hear why transposing within one of them does not create a new pitch set.",
        explanation:
          "A whole-tone scale contains only whole steps. That makes it symmetrical: move the starting note by a whole step and the same six pitch classes return in a different order. There are therefore only two distinct whole-tone collections.\n\nIn dominant harmony the scale naturally contains the major third, minor seventh, raised fourth and raised fifth. Its notes are freely interchangeable within that sound, and the colour is most effective in relatively short doses because the symmetry weakens any sense of tonal hierarchy.",
        instruction:
          "Study the whole-tone harmony map. Clear the grid. Write G3-A3-B3-C-sharp4-E-flat4-F4 on steps 1-6. On steps 17-22 write the other collection: A-flat3-B-flat3-C4-D4-E4-F-sharp4. Play both six-note scales and compare their uniform spacing.",
        recognition:
          "Can you hear that each collection has no half-step landmarks and therefore feels less anchored than the major or melodic-minor modes?",
        source: {
          reference: "Chapter Nine - Figures 9-40 through 9-42",
          focus:
            "Whole-tone harmony uses a six-note symmetrical scale, has only two distinct pitch collections, and supplies dominant raised-five colour without an avoid note.",
          exampleIds: ["l09.whole-tone-harmony"],
        },
        terms: [
          {
            term: "Whole-tone scale",
            definition:
              "A six-note scale made entirely of whole steps.",
          },
          {
            term: "Augmented fifth",
            definition:
              "A perfect fifth raised by a semitone; in dominant harmony it shares the same piano key as a flat thirteenth.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare the two whole-tone collections",
        successLabel: "You reduced the whole-tone system to its two symmetrical pitch sets",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied whole-tone harmony",
          complete: studiedSource(experiments, "l09.whole-tone-harmony"),
        },
        {
          label: "Both whole-tone collections are written",
          complete: exactStudy(harmonySequence, melodicLine([
            [0, 55], [1, 57], [2, 59], [3, 61], [4, 63], [5, 65],
            [16, 56], [17, 58], [18, 60], [19, 62], [20, 64], [21, 66],
          ])),
        },
        {
          label: "You entered both six-note collections",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the symmetrical spacing",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
