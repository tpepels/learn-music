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
  id: "levine.block-chords",
  number: 19,
  title: "Block chords",
  eyebrow: "Jazz Piano · Chapter 19",
  hero: "Harmonize a melody as one moving chordal surface, then open that surface with Shearing-style doubling, drop-2 spacing and chromatic parallel motion.",
  description:
    "Learn locked-hands block-chord thinking, four-way close voicings with diminished passing chords, melody doubling, drop 2, and chromatic approach shapes.",
  overview:
    "Block chords turn a melody line into a sequence of harmonized attacks. The hands move in the same rhythm, but the exact density can vary. A transparent approach often puts three notes in the right hand and one in the left, while other approaches add melody doubling or spread the same harmony with drop-2 spacing.",
});

export const levineBlockChordsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.block-chords.a",
        letter: "A",
        title: "Alternate four-way close and diminished passing chords",
        learn:
          "Hear a close-position C6 colour alternate with a rootless G7 flat-nine diminished shape.",
        explanation:
          "A basic block-chord texture keeps the melody on top and fills the notes directly underneath it. When a scale line moves stepwise, diminished-seventh passing chords can alternate with the main harmony so every melodic note receives a chord without repeating the same sonority twice in a row.\n\nThe diminished shape is not random. B-D-F-A-flat is a rootless G7 flat-nine, so it functions as dominant colour leading back toward C.",
        instruction:
          "Study the close-position alternation. Clear the grid. Write C6 as C4-E4-G4-A4 on step 1, rootless G7 flat nine as B3-D4-F4-A-flat4 on step 2, the C6 inversion E4-G4-A4-C5 on step 3, and the diminished inversion D4-F4-A-flat4-B4 on step 4. Repeat the four-step pattern once on steps 5-8 and play it.",
        recognition:
          "Can you hear the diminished sonority as a passing dominant colour rather than as an unrelated chord?",
        source: {
          reference: "Chapter Nineteen - Figures 19-3 through 19-5",
          focus:
            "Four-way-close major-sixth, minor-sixth, minor-seventh and dominant-seventh lines alternate with diminished-seventh shapes that can be heard as rootless dominant-flat-nine chords.",
          exampleIds: ["l19.four-way-close"],
        },
        terms: [
          {
            term: "Four-way close",
            definition:
              "A four-note block-chord voicing kept in close position beneath the melody.",
          },
          {
            term: "Passing diminished chord",
            definition:
              "A diminished sonority used between stable chord positions to harmonize a passing melody note and create smooth motion.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Build the close-position alternation",
        successLabel: "You heard diminished passing harmony connect the C6 positions",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied four-way-close harmony",
          complete: studiedSource(experiments, "l19.four-way-close"),
        },
        {
          label: "The eight-step close-position pattern is written",
          complete: exactStudy(harmonySequence, [
            [0,[60,64,67,69]],[1,[59,62,65,68]],[2,[64,67,69,72]],[3,[62,65,68,71]],
            [4,[60,64,67,69]],[5,[59,62,65,68]],[6,[64,67,69,72]],[7,[62,65,68,71]],
          ]),
        },
        {
          label: "You entered the alternating block chords",
          complete: changedControl(experiments, "harmony.note-edit", 32),
        },
        {
          label: "You listened to the passing diminished motion",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.block-chords.b",
        letter: "B",
        title: "Double the melody in Shearing style",
        learn:
          "Add the melody an octave below the four-way-close voicing and hear the chord become a five-note locked-hands texture.",
        explanation:
          "A classic locked-hands variation doubles the melody one octave below the right-hand four-way-close chord. If the melody note is A, the right hand can hold C-E-G-A while the left hand adds the lower A.\n\nThe lower melody note strengthens the melodic contour without changing the upper harmony. The two hands now move together rhythmically as one five-note object.",
        instruction:
          "Study melody doubling. Clear the grid. In bar 1 write C4-E4-G4-A4. In bar 2 add A3 underneath the same voicing, giving A3-C4-E4-G4-A4. In bar 3 move the doubled shape up a whole step to B3-D4-F-sharp4-A4-B4. Leave bar 4 empty and play the three versions.",
        recognition:
          "Does the doubled lower melody make the line feel stronger without making the harmony feel like a different chord family?",
        source: {
          reference: "Chapter Nineteen - Figures 19-6 and 19-7",
          focus:
            "The Shearing-style texture doubles the melody an octave below the four-way-close voicing, creating the characteristic locked-hands sound.",
          exampleIds: ["l19.shearing"],
        },
        terms: [
          {
            term: "Locked hands",
            definition:
              "A block-chord texture in which both hands move in the same rhythm as the harmonized melody.",
          },
          {
            term: "Melody doubling",
            definition:
              "Repeating the melody note in another octave while keeping the inner harmony between the two copies.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Add the lower melody octave",
        successLabel: "You turned four-way close into a five-note locked-hands texture",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the doubled-melody texture",
          complete: studiedSource(experiments, "l19.shearing"),
        },
        {
          label: "Close, doubled and transposed shapes are written",
          complete: exactStudy(harmonySequence, [
            [0,[60,64,67,69]],
            [8,[57,60,64,67,69]],
            [16,[59,62,66,69,71]],
          ]),
        },
        {
          label: "You entered all three block-chord shapes",
          complete: changedControl(experiments, "harmony.note-edit", 14),
        },
        {
          label: "You listened to the melody doubling",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.block-chords.c",
        letter: "C",
        title: "Convert four-way close into drop 2",
        learn:
          "Take the second note from the top of a close-position chord and move it down an octave.",
        explanation:
          "Drop 2 begins with the same four notes as four-way close. Count down from the melody: the second note from the top is moved down one octave. C-E-G-A therefore becomes G-C-E-A.\n\nNothing about the chord quality has changed, but the spacing becomes much wider and fuller. The dropped note often sits naturally in the left hand while the remaining three notes stay in the right hand.",
        instruction:
          "Study the drop-2 transformation. Clear the grid. Write C4-E4-G4-A4 in bar 1. In bar 2 drop G4 by one octave to make G3-C4-E4-A4. In bar 3 start from E4-G4-A4-C5 and drop A4 to A3, giving A3-E4-G4-C5. Leave bar 4 empty and play all three.",
        recognition:
          "Can you hear the same harmonic material open up when one inner note moves down an octave?",
        source: {
          reference: "Chapter Nineteen - Figure 19-8 and practice discussion",
          focus:
            "Drop 2 is formed by taking the second note from the top of a four-way-close voicing and lowering it an octave, producing a fuller spread sound.",
          exampleIds: ["l19.drop-two"],
        },
        terms: [
          {
            term: "Drop 2",
            definition:
              "A voicing technique that lowers the second-highest note of a close-position chord by one octave.",
          },
          {
            term: "Spread voicing",
            definition:
              "A chord whose notes occupy a wider register than close position.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transform two close voicings into drop 2",
        successLabel: "You preserved the chord tones while changing the spacing",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the drop-2 rule",
          complete: studiedSource(experiments, "l19.drop-two"),
        },
        {
          label: "The close and two drop-2 shapes are written",
          complete: exactStudy(harmonySequence, [
            [0,[60,64,67,69]],
            [8,[55,60,64,69]],
            [16,[57,64,67,72]],
          ]),
        },
        {
          label: "You entered all three voicings",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the wider spacing",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.block-chords.d",
        letter: "D",
        title: "Approach a drop-2 chord chromatically",
        learn:
          "Slide the entire voicing from a half step below and a half step above into the target chord.",
        explanation:
          "Drop-2 voicings can be used in parallel motion. A chromatic approach takes the entire shape from a half step below or above the destination, preserving the spacing while every voice moves together.\n\nThis is a colouristic device, not ordinary independent voice leading. The repeated geometry makes the chromatic tension sound intentional because all four voices resolve in the same direction.",
        instruction:
          "Study the chromatic approach. Clear the grid. Put G3-C4-E4-A4 in bar 2 as the target C6 drop-2 voicing. In bar 1 approach it from a half step below with F-sharp3-B3-E-flat4-A-flat4. In bar 3 approach the target from a half step above with A-flat3-D-flat4-F4-B-flat4, then return to G3-C4-E4-A4 in bar 4. Play the four-bar loop.",
        recognition:
          "Can you hear both outside shapes as parallel approaches whose tension disappears when every voice resolves by semitone?",
        source: {
          reference: "Chapter Nineteen - Figures 19-29 through 19-34",
          focus:
            "Drop-2 block chords are expanded through parallelism and chromatic approach, including half-step approaches from above or below and melodic-minor-derived altered colours.",
          exampleIds: ["l19.chromatic-parallelism"],
        },
        terms: [
          {
            term: "Chromatic approach",
            definition:
              "Approaching a target chord from a parallel voicing one semitone above or below.",
          },
          {
            term: "Parallel block motion",
            definition:
              "Moving all notes of a block-chord shape in the same direction by the same interval.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Approach the target from both sides",
        successLabel: "You used parallel semitone motion to create and release block-chord tension",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied chromatic drop-2 motion",
          complete: studiedSource(experiments, "l19.chromatic-parallelism"),
        },
        {
          label: "Both chromatic approaches and the target are written",
          complete: exactStudy(harmonySequence, [
            [0,[54,59,63,68]],
            [8,[55,60,64,69]],
            [16,[56,61,65,70]],
            [24,[55,60,64,69]],
          ]),
        },
        {
          label: "You entered the full approach sequence",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to both semitone resolutions",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
