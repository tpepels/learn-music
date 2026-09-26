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
  id: "levine.so-what-chords",
  number: 12,
  title: "So What chords",
  eyebrow: "Jazz Piano · Chapter 12",
  hero: "Build the five-note fourth-based voicing, move it through inversions, and use parallel motion as a deliberate colour.",
  description:
    "Hear a minor-seventh harmony as three stacked perfect fourths with a major third on top, then extend that shape through inversions and modal parallel motion.",
  overview:
    "This voicing is easier to remember intervallically than as a list of chord tones. Its characteristic shape can be moved, inverted and extended diatonically, creating both consonant and deliberately dissonant modal colours.",
});

export const levineSoWhatChordsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.so-what-chords.a",
        letter: "A",
        title: "Build the five-note shape",
        learn:
          "Construct D minor-seventh colour as three perfect fourths with a major third on top, then transpose the whole shape up a whole step.",
        explanation:
          "From the bottom, the basic D voicing is D-G-C-F-A. Relative to D, those notes are root, eleventh, minor seventh, minor third and fifth. The more useful memory aid is the interval pattern: D-G-C-F gives three perfect fourths, and F-A adds a major third on top.\n\nBecause the identity is strongly tied to that interval shape, the entire voicing can be moved intact. Moving every note up a whole step produces E-A-D-G-B.",
        instruction:
          "Study the interval construction. Clear the piano grid. In bar 1 write D3-G3-C4-F4-A4. In bar 2 transpose the entire shape up a whole step to E3-A3-D4-G4-B4. Leave bars 3-4 empty and play the loop.",
        recognition:
          "Can you hear the same voicing identity after every note moves by the same interval?",
        source: {
          reference: "Chapter Twelve - Figures 12-2 through 12-4",
          focus:
            "The basic five-note voicing is understood as three perfect fourths plus a major third and can be transposed as a single intervallic shape.",
          exampleIds: ["l12.basic-shape"],
        },
        terms: [
          {
            term: "So What voicing",
            definition:
              "A five-note fourth-based voicing formed here by three stacked perfect fourths with a major third on top.",
          },
          {
            term: "Parallel transposition",
            definition:
              "Moving every note of a voicing by the same interval while preserving its internal spacing.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build and transpose the five-note shape",
        successLabel: "You heard the voicing as an interval pattern rather than a memorized chord spelling",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the interval construction",
          complete: studiedSource(experiments, "l12.basic-shape"),
        },
        {
          label: "Both five-note voicings are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 55, 60, 65, 69]],
            [8, [52, 57, 62, 67, 71]],
          ]),
        },
        {
          label: "You entered both shapes yourself",
          complete: changedControl(experiments, "harmony.note-edit", 10),
        },
        {
          label: "You listened to the parallel transposition",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.so-what-chords.b",
        letter: "B",
        title: "Rotate the major third through the voicing",
        learn:
          "Play successive inversions and track where the one major third appears inside an otherwise fourth-based structure.",
        explanation:
          "The five pitch classes can be inverted just like any other chord. Each inversion preserves the same collection, but the location of the major third changes. That makes the inversions sound related without being identical.\n\nOn a harmony that lasts for several beats or bars, moving through these inversions creates internal motion without changing the underlying chord.",
        instruction:
          "Study the inversion principle. Clear the grid. Write D3-G3-C4-F4-A4 in bar 1, G3-C4-F4-A4-D5 in bar 2, and C4-F4-A4-D5-G5 in bar 3. Leave bar 4 empty. Play the three positions slowly.",
        recognition:
          "Can you locate the major third by ear as it moves to a different place inside each inversion?",
        source: {
          reference: "Chapter Twelve - Figures 12-16 and 12-17",
          focus:
            "The five-note voicing has five inversions, and changing position can add movement when a modal chord is sustained.",
          exampleIds: ["l12.inversions"],
        },
        terms: [
          {
            term: "Inversion",
            definition:
              "A reordering of the same chord tones in which a different chord tone becomes the lowest note.",
          },
          {
            term: "Internal motion",
            definition:
              "Movement among voicings of the same harmony without changing the underlying chord function.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write three inversions",
        successLabel: "You heard one pitch collection remain stable while its internal interval placement changed",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the inversion pattern",
          complete: studiedSource(experiments, "l12.inversions"),
        },
        {
          label: "Three inversions are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 55, 60, 65, 69]],
            [8, [55, 60, 65, 69, 74]],
            [16, [60, 65, 69, 74, 79]],
          ]),
        },
        {
          label: "You entered all three positions",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to the moving major third",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.so-what-chords.c",
        letter: "C",
        title: "Move the whole voicing in parallel",
        learn:
          "Slide the complete shape upward by half step and whole step while keeping every internal interval unchanged.",
        explanation:
          "Parallel motion treats the voicing as one object. Instead of resolving individual voices according to common-practice rules, every note travels in the same direction by the same amount. The repeated structure makes the motion easy to hear even when the resulting harmony is strongly coloured.\n\nHalf-step parallel motion is especially striking because every note creates a chromatic neighbour at once. Whole-step motion retains the same effect with a slightly more open shift.",
        instruction:
          "Study the parallel-motion idea. Clear the grid. Write D3-G3-C4-F4-A4 in bar 1, E-flat3-A-flat3-D-flat4-G-flat4-B-flat4 in bar 2, and E3-A3-D4-G4-B4 in bar 3. Leave bar 4 empty and play all three.",
        recognition:
          "Does the repeated interval shape make the chromatic movement sound organized even though all five voices shift together?",
        source: {
          reference: "Chapter Twelve - Figures 12-10 through 12-15",
          focus:
            "The voicing is moved in parallel motion, often by half step or whole step, so the repeated structure becomes part of the musical effect.",
          exampleIds: ["l12.parallel-motion"],
        },
        terms: [
          {
            term: "Parallel motion",
            definition:
              "Several voices moving in the same direction by the same interval while preserving the shape between them.",
          },
          {
            term: "Planing",
            definition:
              "Moving a chord shape in parallel as a colouristic device rather than independently voice-leading each part.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Create chromatic planing",
        successLabel: "You heard the voicing behave as one movable harmonic object",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied parallel motion",
          complete: studiedSource(experiments, "l12.parallel-motion"),
        },
        {
          label: "The half-step and whole-step planing is written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 55, 60, 65, 69]],
            [8, [51, 56, 61, 66, 70]],
            [16, [52, 57, 62, 67, 71]],
          ]),
        },
        {
          label: "You entered all three parallel shapes",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to the chromatic motion",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.so-what-chords.d",
        letter: "D",
        title: "Extend the shape diatonically",
        learn:
          "Move every voice to the next note of C major and accept the tritones and minor ninths that appear as modal colour.",
        explanation:
          "The fourth-based shape can also move diatonically instead of chromatically. Starting from D-G-C-F-A, move every note one step higher inside C major: E-A-D-G-B, then F-B-E-A-C. The interval pattern is no longer identical because the major scale contains unequal step sizes.\n\nSome resulting shapes contain a tritone or a sharper dissonance. In modal playing those sounds can be used deliberately as passing or sustained colours rather than rejected simply because they no longer spell an ordinary minor-seventh chord.",
        instruction:
          "Study the diatonic extension. Clear the grid. Write D3-G3-C4-F4-A4 in bar 1, E3-A3-D4-G4-B4 in bar 2, and F3-B3-E4-A4-C5 in bar 3. Leave bar 4 empty and play the three related structures.",
        recognition:
          "Can you hear the third voicing as a more tense member of the same diatonic family rather than as an unrelated mistake?",
        source: {
          reference: "Chapter Twelve - Figure 12-7 and surrounding discussion",
          focus:
            "The five-note structure is extended diatonically through C major, producing modal voicings that may contain tritones or minor ninths.",
          exampleIds: ["l12.diatonic-extension"],
        },
        terms: [
          {
            term: "Diatonic planing",
            definition:
              "Moving every voice to the next note of a scale rather than preserving exact chromatic intervals.",
          },
          {
            term: "Modal colour",
            definition:
              "A sonority whose effect comes from the scale or mode around it rather than from ordinary functional chord resolution.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Move the structure through C major",
        successLabel: "You heard consonant and dissonant fourth-based shapes as one modal vocabulary",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the diatonic extension",
          complete: studiedSource(experiments, "l12.diatonic-extension"),
        },
        {
          label: "Three diatonic structures are written",
          complete: exactStudy(harmonySequence, [
            [0, [50, 55, 60, 65, 69]],
            [8, [52, 57, 62, 67, 71]],
            [16, [53, 59, 64, 69, 72]],
          ]),
        },
        {
          label: "You entered the three scale-derived shapes",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened to the changing dissonance",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
