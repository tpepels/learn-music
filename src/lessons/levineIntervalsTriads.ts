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
  id: "levine.intervals-triads",
  number: 1,
  title: "Intervals & triads",
  eyebrow: "Jazz Piano · Chapter 1",
  hero: "Build a reliable keyboard vocabulary from intervals, triad quality and inversion.",
  description:
    "Start with pitch distance rather than chord symbols. Hear intervals from a fixed C, learn what happens when an interval is inverted, then build the four basic triad qualities and move major and minor triads through their inversions.",
  overview:
    "The chapter is a review, but it establishes material the rest of the course assumes. Every task connects notation to a playable keyboard shape and to the sound of the interval or chord.",
});

export const levineIntervalsTriadsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.intervals-triads.a",
        letter: "A",
        title: "Hear interval size from one fixed note",
        learn:
          "Treat an interval as the distance between two notes, then hear how that distance changes while the lower C stays fixed.",
        explanation:
          "An interval describes the space between two notes. The source chart keeps middle C on the bottom and moves the upper note from the minor second all the way to the octave, so interval size can be compared without also changing the reference pitch. The most useful habit is to connect three things at once: the written interval, its physical span on the keyboard, and its sound.

Major, minor and perfect describe interval quality; the tritone can be named an augmented fourth or diminished fifth. Do not reduce the exercise to counting semitones. The staff spelling and the sound are both part of the interval.",
        instruction:
          "Play the complete interval chart below first. Then clear the piano study and build four dyads, one at the start of each bar: C4-D-flat4, C4-E4, C4-F-sharp4 and C4-G4. Play the four-bar study and compare how the minor second, major third, tritone and perfect fifth expand away from the same C.",
        recognition:
          "Can you hear the order from most compressed to most open without looking at the labels?",
        source: {
          reference: "Chapter One - Figure 1-1",
          focus:
            "The chart fixes middle C below every interval from the minor second through the octave.",
          exampleIds: ["l01.fig1-1"],
        },
        terms: [
          {
            term: "Interval",
            definition: "The pitch distance between two notes.",
          },
          {
            term: "Tritone",
            definition:
              "The six-semitone interval halfway through the octave, written as an augmented fourth or diminished fifth.",
          },
          {
            term: "Interval quality",
            definition:
              "The major, minor, perfect, augmented or diminished form of an interval.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build four reference intervals",
        successLabel: "You connected four interval names to their keyboard shapes and sounds",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the complete interval chart",
          complete: studiedSource(experiments, "l01.fig1-1"),
        },
        {
          label: "The four bars contain m2, M3, tritone and P5 above C",
          complete: exactStudy(harmonySequence, [
            [0, [60, 61]],
            [8, [60, 64]],
            [16, [60, 66]],
            [24, [60, 67]],
          ]),
        },
        {
          label: "You entered the interval study yourself",
          complete: changedControl(experiments, "harmony.note-edit", 8),
        },
        {
          label: "You listened to the four intervals",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.intervals-triads.b",
        letter: "B",
        title: "Invert the interval",
        learn:
          "Move one note through the octave and hear the complementary interval that results.",
        explanation:
          "To invert an interval, move the lower note above the upper note, or the upper note below the lower note. The numerical names are complementary: they add to nine. A third becomes a sixth, a second becomes a seventh, and a fourth becomes a fifth.

The quality follows a second rule. Major becomes minor and minor becomes major; perfect stays perfect; the tritone remains a tritone. These are practical keyboard rules, not only written-theory facts: they let you recognize the same two pitch classes in a different register.",
        instruction:
          "Work through the three source-analysis tabs. Clear the study, then place C4-E4 in bar 1 and E4-C5 in bar 2. In bars 3-4 place C4-F4 and F4-C5. Play the loop. The major third should become a minor sixth, while the perfect fourth becomes a perfect fifth.",
        recognition:
          "Does the inversion sound related even though the spacing and the bottom note have changed?",
        source: {
          reference: "Chapter One - Figures 1-2 through 1-4",
          focus:
            "The interval-inversion rules pair complementary numbers and qualities.",
          exampleIds: ["l01.interval-inversion"],
        },
        terms: [
          {
            term: "Inversion",
            definition:
              "Reversing the order of an interval by moving one note through the octave.",
          },
          {
            term: "Complementary intervals",
            definition:
              "An interval and its inversion, whose numerical names add to nine.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Invert two intervals",
        successLabel: "You heard both the numerical and quality changes caused by inversion",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You inspected the interval-inversion rules",
          complete: studiedSource(experiments, "l01.interval-inversion"),
        },
        {
          label: "Major third and minor sixth are both written",
          complete:
            sameNotes(harmonySequence[0], [60, 64]) &&
            sameNotes(harmonySequence[8], [64, 72]),
        },
        {
          label: "Perfect fourth and perfect fifth are both written",
          complete:
            sameNotes(harmonySequence[16], [60, 65]) &&
            sameNotes(harmonySequence[24], [65, 72]),
        },
        {
          label: "You rebuilt the study in this exercise",
          complete: changedControl(experiments, "harmony.note-edit", 8),
        },
        {
          label: "You listened to the inversions",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.intervals-triads.c",
        letter: "C",
        title: "Build the four triad qualities",
        learn:
          "Hear triad quality as the result of stacking two thirds in different combinations.",
        explanation:
          "A triad stacks one third on top of another. Four basic combinations follow. Major uses a major third with a minor third above it; minor reverses that order; diminished stacks two minor thirds; augmented stacks two major thirds. The source keeps C as the common root so the quality change is isolated.

Listen to the difference before attaching an emotional label. The important technical point is that changing one chord tone can change the quality while the root stays fixed.",
        instruction:
          "Play the four source triads. Clear the study, then put one root-position C triad at the start of each bar: C-E-G, C-E-flat-G, C-E-flat-G-flat, and C-E-G-sharp. Play all four in sequence and identify which third changed from one quality to the next.",
        recognition:
          "Can you identify major, minor, diminished and augmented by sound before checking the notes?",
        source: {
          reference: "Chapter One - Figure 1-6",
          focus:
            "Four C-root triads isolate the four possible major/minor-third stackings.",
          exampleIds: ["l01.fig1-6"],
        },
        terms: [
          {
            term: "Triad",
            definition: "A three-note chord formed by stacking one third above another.",
          },
          {
            term: "Diminished triad",
            definition: "A triad made from two stacked minor thirds.",
          },
          {
            term: "Augmented triad",
            definition: "A triad made from two stacked major thirds.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build all four qualities",
        successLabel: "The same C root now produces four clearly different triad qualities",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the four source triads",
          complete: studiedSource(experiments, "l01.fig1-6"),
        },
        {
          label: "All four C-root triad qualities are correct",
          complete: exactStudy(harmonySequence, [
            [0, [60, 64, 67]],
            [8, [60, 63, 67]],
            [16, [60, 63, 66]],
            [24, [60, 64, 68]],
          ]),
        },
        {
          label: "You entered the triads yourself",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the four qualities",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.intervals-triads.d",
        letter: "D",
        title: "Move triads through their inversions",
        learn:
          "Keep chord identity while changing which chord tone is on the bottom.",
        explanation:
          "A triad is in root position when the root is the lowest note. Put the third on the bottom and it becomes first inversion; put the fifth on the bottom and it becomes second inversion. The chord tones do not change, but the spacing, bass note and keyboard shape do.

This distinction becomes central later when jazz voicings are chosen for smooth movement rather than for root-position clarity. For now, keep the task literal: same three chord tones, three possible bass notes.",
        instruction:
          "Play the inversion chart below. Clear the study. In the first two bars place C major on steps 1, 5 and 9 as C4-E4-G4, E3-G3-C4 and G3-C4-E4. In the last two bars place C minor on steps 17, 21 and 25 as C4-E-flat4-G4, E-flat3-G3-C4 and G3-C4-E-flat4. Play the complete loop and follow the lowest note of each voicing.",
        recognition:
          "Can you hear the bass move C-E-G and C-E-flat-G while the chord still remains recognizably C major or C minor?",
        source: {
          reference: "Chapter One - Figure 1-7",
          focus:
            "C major and C minor are shown in root position, first inversion and second inversion.",
          exampleIds: ["l01.fig1-7"],
        },
        terms: [
          {
            term: "Root position",
            definition: "A chord with its root as the lowest note.",
          },
          {
            term: "First inversion",
            definition: "A triad with its third as the lowest note.",
          },
          {
            term: "Second inversion",
            definition: "A triad with its fifth as the lowest note.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write both inversion cycles",
        successLabel: "You can now move major and minor triads through all three bass positions",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the source inversion chart",
          complete: studiedSource(experiments, "l01.fig1-7"),
        },
        {
          label: "C major appears in all three inversions",
          complete:
            sameNotes(harmonySequence[0], [60, 64, 67]) &&
            sameNotes(harmonySequence[4], [52, 55, 60]) &&
            sameNotes(harmonySequence[8], [55, 60, 64]),
        },
        {
          label: "C minor appears in all three inversions",
          complete:
            sameNotes(harmonySequence[16], [60, 63, 67]) &&
            sameNotes(harmonySequence[20], [51, 55, 60]) &&
            sameNotes(harmonySequence[24], [55, 60, 63]),
        },
        {
          label: "You entered the inversion study yourself",
          complete: changedControl(experiments, "harmony.note-edit", 18),
        },
        {
          label: "You listened to both inversion cycles",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
