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
  id: "levine.fourth-chords",
  number: 13,
  title: "Fourth chords",
  eyebrow: "Jazz Piano · Chapter 13",
  hero: "Build voicings directly from fourths, then let the major scale reshape those fourths into tritones where the mode demands it.",
  description:
    "Learn the all-fourths major-six-nine shape, extend it diatonically, simplify it under a melody, and compare open consonant fourths with sharper scale-derived structures.",
  overview:
    "Fourth voicings are not limited to perfect fourths. When the stack is derived from a scale, augmented fourths and other tensions appear naturally. The useful skill is to hear the family resemblance while choosing a register and density that supports the melody.",
});

export const levineFourthChordsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.fourth-chords.a",
        letter: "A",
        title: "Build C six-nine as four perfect fourths",
        learn:
          "Voice C six-nine from its third upward as E-A-D-G-C and hear the chord as an interval stack rather than a tertian spelling.",
        explanation:
          "A C six-nine chord can be voiced E-A-D-G-C. Relative to C, the notes are third, sixth, ninth, fifth and root. On the keyboard the easier pattern is simply four consecutive perfect fourths.\n\nThis voicing puts the root on top instead of in the bass, which makes it especially useful when the left hand or bass instrument already supplies the harmonic foundation.",
        instruction:
          "Study the fourth-stack construction. Clear the grid. In bar 1 write the ordinary C6/9 collection C3-E3-G3-A3-D4. In bar 2 reorganize it as E3-A3-D4-G4-C5. Leave bars 3-4 empty and play the comparison.",
        recognition:
          "Can you hear that the second voicing contains the same basic tonic colour while its fourth-based spacing sounds more open?",
        source: {
          reference: "Chapter Thirteen - Figure 13-4",
          focus:
            "A C six-nine voicing is read from the bottom as third, sixth, ninth, fifth and root, which forms a stack of perfect fourths.",
          exampleIds: ["l13.c69-fourths"],
        },
        terms: [
          {
            term: "Fourth chord",
            definition:
              "A voicing organized primarily by fourths rather than by stacked thirds.",
          },
          {
            term: "Six-nine chord",
            definition:
              "A major or minor tonic colour containing the sixth and ninth instead of requiring a seventh.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Revoice C six-nine in fourths",
        successLabel: "You reorganized the tonic into a pure stack of fourths",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the fourth-stack construction",
          complete: studiedSource(experiments, "l13.c69-fourths"),
        },
        {
          label: "The tertian collection and fourth voicing are written",
          complete: exactStudy(harmonySequence, [
            [0, [48, 52, 55, 57, 62]],
            [8, [52, 57, 62, 67, 72]],
          ]),
        },
        {
          label: "You entered both versions",
          complete: changedControl(experiments, "harmony.note-edit", 10),
        },
        {
          label: "You listened to the spacing change",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.fourth-chords.b",
        letter: "B",
        title: "Move the stack through C major",
        learn:
          "Shift every voice to the next scale degree and notice where the major scale turns a perfect fourth into a tritone.",
        explanation:
          "If every note of E-A-D-G-C moves one step upward inside C major, the next shapes are F-B-E-A-D and G-C-F-B-E. The scale determines the intervals, so not every adjacent pair remains a perfect fourth. F-B is an augmented fourth.\n\nThat tritone is not an error. It is part of the diatonic fourth-voicing vocabulary and can provide exactly the tension needed in modal or nonfunctional harmony.",
        instruction:
          "Study the diatonic fourth family. Clear the grid. Write E3-A3-D4-G4-C5 in bar 1, F3-B3-E4-A4-D5 in bar 2, and G3-C4-F4-B4-E5 in bar 3. Leave bar 4 empty and play the three voicings.",
        recognition:
          "Can you hear the F-B tritone intensify the second voicing while the stacked-fourth family resemblance remains clear?",
        source: {
          reference: "Chapter Thirteen - Figure 13-5",
          focus:
            "Fourth voicings are extended diatonically through C major, so the scale introduces tritones among the otherwise fourth-based intervals.",
          exampleIds: ["l13.diatonic-fourths"],
        },
        terms: [
          {
            term: "Augmented fourth",
            definition:
              "A fourth widened by one semitone; enharmonically it is the same sounding interval as a diminished fifth.",
          },
          {
            term: "Diatonic fourth voicing",
            definition:
              "A fourth-based shape whose notes are constrained to a particular scale, allowing perfect and augmented fourths to coexist.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Extend the fourth voicing diatonically",
        successLabel: "You heard the tritone as part of the scale-derived voicing rather than a broken fourth stack",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the diatonic fourth family",
          complete: studiedSource(experiments, "l13.diatonic-fourths"),
        },
        {
          label: "Three scale-derived fourth voicings are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 57, 62, 67, 72]],
            [8, [53, 59, 64, 69, 74]],
            [16, [55, 60, 65, 71, 76]],
          ]),
        },
        {
          label: "You entered the three voicings",
          complete: changedControl(experiments, "harmony.note-edit", 15),
        },
        {
          label: "You listened for the tritone",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.fourth-chords.c",
        letter: "C",
        title: "Leave the melody note out of the accompaniment",
        learn:
          "Remove the top note from a five-note fourth voicing when the melody already supplies it.",
        explanation:
          "A five- or six-note fourth chord does not have to be played in full every time. If the melody already contains the top note, leaving that pitch out of the accompaniment creates space and prevents unnecessary doubling.\n\nThe harmony remains recognizable because the lower fourth structure carries most of the voicing's identity. This also gives the hands more room when the melody sits close to the accompaniment register.",
        instruction:
          "Study the melody-omission principle. Clear the grid. In bar 1 write E3-A3-D4-G4-C5. In bar 2 remove the top C and write only E3-A3-D4-G4. Leave bars 3-4 empty. Play both, then play C5 yourself above the shorter bar-2 shape.",
        recognition:
          "Does the four-note accompaniment still imply the same C-major colour once your right hand supplies the missing top note?",
        source: {
          reference: "Chapter Thirteen - Figure 13-6 and surrounding discussion",
          focus:
            "Fourth voicings can omit a top note when the melody supplies it, creating more practical choices and avoiding unnecessary duplication.",
          exampleIds: ["l13.melody-omission"],
        },
        terms: [
          {
            term: "Omission",
            definition:
              "Deliberately leaving a chord tone out because another musical layer already supplies it or the voicing works without it.",
          },
          {
            term: "Register collision",
            definition:
              "Crowding that occurs when accompaniment notes occupy the same pitch area as the melody.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare full and reduced fourth voicings",
        successLabel: "You kept the harmonic identity while making room for the melody",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the melody-omission principle",
          complete: studiedSource(experiments, "l13.melody-omission"),
        },
        {
          label: "The full and reduced shapes are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 57, 62, 67, 72]],
            [8, [52, 57, 62, 67]],
          ]),
        },
        {
          label: "You entered both densities",
          complete: changedControl(experiments, "harmony.note-edit", 9),
        },
        {
          label: "You listened to the reduced accompaniment",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.fourth-chords.d",
        letter: "D",
        title: "Contrast pure and tense fourth structures",
        learn:
          "Compare a stack of perfect fourths with scale-derived shapes that place the tritone at different levels.",
        explanation:
          "Fourth voicings work well in succession because a listener hears their common spacing even when one of the fourths becomes augmented. Changing where the tritone appears changes the tension profile of the chord.\n\nThis gives you a small palette: an all-perfect-fourths shape for openness, a tritone near the bottom for immediate bite, or a tritone higher in the voicing for a different kind of edge.",
        instruction:
          "Study the combined-fourths idea. Clear the grid. Write E3-A3-D4-G4 in bar 1, F3-B3-E4-A4 in bar 2, and G3-C4-F4-B4 in bar 3. Leave bar 4 empty and play them as a progression.",
        recognition:
          "Can you hear how the location of the tritone changes the tension even though all three voicings belong to the same fourth-based language?",
        source: {
          reference: "Chapter Thirteen - Figures 13-7 and 13-8",
          focus:
            "Fourth voicings are combined in progressions, including shapes with a tritone at different points in the stack.",
          exampleIds: ["l13.combined-fourths"],
        },
        terms: [
          {
            term: "Tension profile",
            definition:
              "The character of a voicing created by where its dissonant intervals sit in the register.",
          },
          {
            term: "Quartal language",
            definition:
              "Harmony whose recognizable sound comes primarily from fourth-based spacing.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare three tension profiles",
        successLabel: "You heard the tritone placement reshape the colour without leaving quartal harmony",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied how fourth voicings combine",
          complete: studiedSource(experiments, "l13.combined-fourths"),
        },
        {
          label: "Three contrasting fourth structures are written",
          complete: exactStudy(harmonySequence, [
            [0, [52, 57, 62, 67]],
            [8, [53, 59, 64, 69]],
            [16, [55, 60, 65, 71]],
          ]),
        },
        {
          label: "You entered the three structures",
          complete: changedControl(experiments, "harmony.note-edit", 12),
        },
        {
          label: "You listened to the changing tritone placement",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
