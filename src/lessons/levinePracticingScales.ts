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

function melodicLine(notes: number[]): Array<[number, number[]]> {
  return notes.map((note, step) => [step, [note]]);
}

const lesson = lessonContentSchema.parse({
  id: "levine.practicing-scales",
  number: 11,
  title: "Practicing scales",
  eyebrow: "Jazz Piano · Chapter 11",
  hero: "Practice scales from every starting note and in changing directions so your fingers stop treating the root as the only entrance.",
  description:
    "Replace four-octave root-to-root drills with modal starts, direction changes, key rotation, symmetrical-scale patterns and practical fingering.",
  overview:
    "The goal is availability: any scale tone should be able to become the beginning of a line. Traditional fingering remains useful, but it serves the musical destination rather than becoming an inflexible rule.",
});

export const levinePracticingScalesLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.practicing-scales.a",
        letter: "A",
        title: "Start away from the root",
        learn:
          "Practice the C-major collection first from C, then from D, while reversing direction so the hand cannot rely on one memorized run.",
        explanation:
          "Root-to-root scale practice trains only one of the possible entrances into a scale. Replace that habit by starting on each note of the collection and reversing direction as the exercise moves.\n\nThe point is to de-program the idea that a scale begins on its root. In improvisation you need the whole pitch field under your hands, including entries that begin on the third, fifth, seventh or any other scale degree.",
        instruction:
          "Study the starting-note routine. Clear the grid. Write C4-D4-E4-F4-G4-A4-B4-C5 on steps 1-8. Then start from D5 and descend D5-C5-B4-A4-G4-F4-E4-D4 on steps 9-16. Play both directions without a pause.",
        recognition:
          "Does the D-starting descent still sound like the same C-major collection even though neither its first nor last note is C?",
        source: {
          reference: "Chapter Eleven - Figures 11-1 through 11-3",
          focus:
            "Scale practice begins on different notes of the collection and reverses direction so every degree becomes a usable entry point.",
          exampleIds: ["l11.starting-notes"],
        },
        terms: [
          {
            term: "Scale entry",
            definition:
              "The note and direction from which a player enters a pitch collection in a melodic line.",
          },
          {
            term: "Root conditioning",
            definition:
              "The habit of treating the root as the automatic beginning and ending of every scale run.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Change the starting note and direction",
        successLabel: "You used the C-major collection without depending on C as the only entrance",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the starting-note routine",
          complete: studiedSource(experiments, "l11.starting-notes"),
        },
        {
          label: "The C-start and D-start lines are written",
          complete: exactStudy(harmonySequence, melodicLine([
            60, 62, 64, 65, 67, 69, 71, 72,
            74, 72, 71, 69, 67, 65, 64, 62,
          ])),
        },
        {
          label: "You entered both directions",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened through the changed starting point",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practicing-scales.b",
        letter: "B",
        title: "Move the routine to a new key",
        learn:
          "Use the same contour in C major and D major so key rotation becomes part of the practice instead of a separate theory exercise.",
        explanation:
          "Change the major key from day to day rather than exhausting every key in one session. A practical rotation might begin with C on one day, D on the next, then E, and continue until the keyboard feels equally available away from familiar keys.\n\nThe exercise below compresses that long-term routine into one comparison. The contour remains the same while F and C become F-sharp and C-sharp in D major.",
        instruction:
          "Study the key-rotation plan. Clear the grid. Write C4-D4-E4-F4-G4-A4-B4-C5 on steps 1-8. Then write D4-E4-F-sharp4-G4-A4-B4-C-sharp5-D5 on steps 17-24. Play the two keys with the same pulse and contour.",
        recognition:
          "Can you hear the key change without changing the physical idea of the exercise?",
        source: {
          reference: "Chapter Eleven - practice discussion following Figures 11-1 through 11-3",
          focus:
            "Major-scale practice rotates to a different key on different days so the same flexible-start routine becomes available across the keyboard.",
          exampleIds: ["l11.key-rotation"],
        },
        terms: [
          {
            term: "Key rotation",
            definition:
              "A practice schedule that moves the same task through different keys over successive sessions.",
          },
          {
            term: "Transposition",
            definition:
              "Moving the same interval pattern to a new pitch level.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Transfer the routine to D major",
        successLabel: "You preserved the practice shape while changing key",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the key-rotation routine",
          complete: studiedSource(experiments, "l11.key-rotation"),
        },
        {
          label: "C major and D major are both written",
          complete: exactStudy(harmonySequence, [
            [0,[60]],[1,[62]],[2,[64]],[3,[65]],[4,[67]],[5,[69]],[6,[71]],[7,[72]],
            [16,[62]],[17,[64]],[18,[66]],[19,[67]],[20,[69]],[21,[71]],[22,[73]],[23,[74]],
          ]),
        },
        {
          label: "You entered both keys",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the transposed routine",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practicing-scales.c",
        letter: "C",
        title: "Give symmetrical scales their own practice shapes",
        learn:
          "Practice an eight-note diminished collection and a six-note whole-tone collection as different interval systems instead of forcing one major-scale fingering idea onto both.",
        explanation:
          "The diminished and whole-tone scales need slightly different practice patterns because their interval structures are different from the seven-note major and melodic-minor scales. The diminished scale has eight notes and alternates two interval sizes; the whole-tone scale has six notes and only one interval size.\n\nUse separate practice shapes for these systems so the pattern reinforces each scale's own symmetry rather than hiding it behind a generic root-to-root run.",
        instruction:
          "Study the symmetrical-scale practice map. Clear the grid. On steps 1-8 write G3-A-flat3-B-flat3-B3-C-sharp4-D4-E4-F4. On steps 17-22 write G3-A3-B3-C-sharp4-E-flat4-F4. Play the diminished collection first, then the whole-tone collection.",
        recognition:
          "Can you feel the alternating half/whole pulse of the diminished scale versus the completely even spacing of the whole-tone scale?",
        source: {
          reference: "Chapter Eleven - Figures 11-4 through 11-7",
          focus:
            "Diminished and whole-tone scales receive their own practice patterns because their eight-note and six-note structures differ from ordinary seven-note scales.",
          exampleIds: ["l11.symmetric-practice"],
        },
        terms: [
          {
            term: "Eight-note scale",
            definition:
              "A scale containing eight distinct pitch classes before the octave, as in the diminished scale.",
          },
          {
            term: "Six-note scale",
            definition:
              "A scale containing six distinct pitch classes before the octave, as in the whole-tone scale.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Practice both symmetrical systems",
        successLabel: "You heard each symmetrical scale through its own interval structure",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the symmetrical practice patterns",
          complete: studiedSource(experiments, "l11.symmetric-practice"),
        },
        {
          label: "The diminished and whole-tone collections are written",
          complete: exactStudy(harmonySequence, [
            [0,[55]],[1,[56]],[2,[58]],[3,[59]],[4,[61]],[5,[62]],[6,[64]],[7,[65]],
            [16,[55]],[17,[57]],[18,[59]],[19,[61]],[20,[63]],[21,[65]],
          ]),
        },
        {
          label: "You entered both scale systems",
          complete: changedControl(experiments, "harmony.note-edit", 14),
        },
        {
          label: "You listened to both interval patterns",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.practicing-scales.d",
        letter: "D",
        title: "Use fingering as a tool, not a rule",
        learn:
          "Play a conventional right-hand C-major fingering, then recognize when a shorter musical destination makes the thumb-under motion unnecessary.",
        explanation:
          "Traditional fingering is still useful because it makes fluent scale motion repeatable. For a one-octave right-hand C-major scale, the familiar pattern is 1-2-3-1-2-3-4-5. Useful fourth-finger anchor notes help orient other keys, and the fingering changes for melodic minor, diminished and whole-tone scales.\n\nBut fingering serves the phrase. If a line stops before the point where the thumb-under motion would become useful, following the full scale fingering mechanically can create extra motion. The destination of the actual line decides whether to continue the standard pattern or break it.",
        instruction:
          "Study the fingering map. Clear the grid. Write C4-D4-E4-F4-G4-A4-B4-C5 on steps 1-8 and play it on your keyboard with right-hand fingers 1-2-3-1-2-3-4-5. Then replay only C-D-E-F and notice that a phrase ending on F does not need the same continuation strategy as a full octave.",
        recognition:
          "Can you keep the standard fingering available while treating it as a means to fluent motion rather than an obligation independent of the phrase?",
        source: {
          reference: "Chapter Eleven - Figures 11-8 through 11-10 and fingering discussion",
          focus:
            "Traditional scale fingering is recommended as a practical default, with dedicated charts for the scale families and explicit permission to alter the fingering when the phrase's range makes that more sensible.",
          exampleIds: ["l11.fingering"],
        },
        terms: [
          {
            term: "Thumb under",
            definition:
              "Passing the thumb beneath the hand to continue a scale beyond the first finger group.",
          },
          {
            term: "Fingering anchor",
            definition:
              "A note assigned to a particular finger to make a scale pattern repeatable and orient the hand in the key.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write and finger the C-major scale",
        successLabel: "You separated the useful default fingering from the musical decision about where the phrase ends",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the fingering principles",
          complete: studiedSource(experiments, "l11.fingering"),
        },
        {
          label: "The one-octave C-major scale is written",
          complete: exactStudy(harmonySequence, melodicLine([
            60, 62, 64, 65, 67, 69, 71, 72,
          ])),
        },
        {
          label: "You entered the complete scale",
          complete: changedControl(experiments, "harmony.note-edit", 8),
        },
        {
          label: "You listened while practicing the fingering",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
