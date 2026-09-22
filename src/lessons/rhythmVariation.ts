import { countPatternDifferences, hasNewOffbeatEvent } from "../music/model";
import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const lesson = lessonContentSchema.parse({
  id: "rhythm.variation",
  number: 2,
  title: "Repetition & variation",
  eyebrow: "Composition · Rhythm",
  hero: "Keep an idea recognisable while changing its surface.",
  description:
    "Pattern A is your reference. Pattern B starts as a copy and becomes a variation. You will change small details, create a fill, use anticipation, and shape the end of the bar.",
  overview:
    "Composition depends heavily on memory. Repetition lets the listener recognise an idea; variation prevents that idea from becoming static. The useful question is usually not 'change or repeat?' but 'what should remain the same while something else changes?'",
});

function rangeDifferences(A: boolean[], B: boolean[], start: number, end: number): number {
  let count = 0;
  for (let step = start; step < end; step += 1) {
    if (A[step] !== B[step]) count += 1;
  }
  return count;
}

export const rhythmVariationLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.variation.a",
        letter: "A",
        title: "Make a close variation",
        learn: "Change a groove without losing its identity.",
        explanation:
          "A variation keeps enough of the original material that the listener hears a relationship. In rhythm, changing only a few events is often more effective than rewriting the whole pattern.",
        instruction:
          "Edit Pattern B so it differs from A in two to four steps. Keep the snare backbeat on beats 2 and 4. Switch between A and B while playing.",
        recognition:
          "A good close variation should make you think 'the same groove, but slightly different' rather than 'a new groove'.",
        terms: [
          { term: "Repetition", definition: "Reusing musical material so the listener can recognise it." },
          { term: "Variation", definition: "Changing some features of an idea while preserving enough of it to remain recognisable." },
        ],
        workspace: "compare",
        checksLabel: "Compare",
        successLabel: "A and B are clearly related",
      }),
      evaluate: ({ A, B }) => {
        const differences = countPatternDifferences(A, B);
        return [
          { label: "B differs in at least two steps", complete: differences >= 2 },
          { label: "B changes no more than four steps", complete: differences >= 2 && differences <= 4 },
          { label: "Snare still lands on beats 2 and 4", complete: B.snare[4] && B.snare[12] },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.variation.b",
        letter: "B",
        title: "Write a fill",
        learn: "Use a short burst of activity to mark the end of a phrase.",
        explanation:
          "A fill is a temporary departure from the repeating groove, often near the end of a bar or phrase. Drummers use fills to signal that something is about to change or return.",
        instruction:
          "In Pattern B, add one or more extra snare hits during the final beat of the bar, after beat 4. Keep the main backbeat intact.",
        recognition:
          "A fill usually sounds busier than the groove around it and often points toward the next downbeat.",
        terms: [
          { term: "Fill", definition: "A short decorative rhythmic passage that interrupts or embellishes the main groove." },
          { term: "Downbeat", definition: "The first beat of a bar, usually felt as the strongest point of arrival." },
        ],
        workspace: "compare",
        checksLabel: "Shape the ending",
        successLabel: "The end of the bar now signals movement",
      }),
      evaluate: ({ A, B }) => [
        { label: "Backbeat remains on beats 2 and 4", complete: B.snare[4] && B.snare[12] },
        { label: "A snare fill appears after beat 4", complete: [13, 14, 15].some((step) => B.snare[step] && !A.snare[step]) },
        { label: "B is still recognisably related to A", complete: countPatternDifferences(A, B) <= 7 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.variation.c",
        letter: "C",
        title: "Anticipate the next beat",
        learn: "Create forward motion by arriving slightly early.",
        explanation:
          "An anticipation places a note just before an expected strong beat. The ear hears the event as leaning into what follows, so it can make a groove feel more urgent without changing the tempo.",
        instruction:
          "Add a kick immediately before beat 3, beat 4, or the next bar. On the grid those positions are steps 8, 12, or 16 in ordinary counting: indices 7, 11, or 15.",
        recognition:
          "If a hit seems to pull you into the following beat because it arrives a fraction early, you are hearing anticipation.",
        terms: [
          { term: "Anticipation", definition: "A note that arrives shortly before the beat or harmony it seems to belong to." },
        ],
        workspace: "compare",
        checksLabel: "Pull forward",
        successLabel: "The groove now leans into a strong beat",
      }),
      evaluate: ({ A, B }) => [
        { label: "An anticipatory kick is added", complete: [7, 11, 15].some((step) => B.kick[step] && !A.kick[step]) },
        { label: "The original downbeats remain audible", complete: [0, 4, 8, 12].filter((step) => B.kick[step]).length >= 3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.variation.d",
        letter: "D",
        title: "Create a turnaround",
        learn: "Make the end of a loop feel different from its beginning.",
        explanation:
          "A turnaround is material near the end of a phrase that prepares the return to the beginning. In loop-based music, changing the final part of a bar is one of the simplest ways to make repetition feel intentional.",
        instruction:
          "Keep the first half of B close to A, but make at least two changes in the second half. Listen to the loop until the return to beat 1 feels clearly prepared.",
        recognition:
          "You should hear relative stability at the start of the bar and increased activity or difference near the end, followed by a satisfying return to beat 1.",
        terms: [
          { term: "Turnaround", definition: "Music near the end of a phrase that leads back to its beginning or into the next phrase." },
          { term: "Phrase", definition: "A coherent span of music that feels like a musical sentence or unit." },
        ],
        workspace: "compare",
        checksLabel: "Shape the phrase",
        successLabel: "The loop now has a beginning and an ending",
      }),
      evaluate: ({ A, B }) => {
        const firstHalf =
          rangeDifferences(A.kick, B.kick, 0, 8) +
          rangeDifferences(A.snare, B.snare, 0, 8) +
          rangeDifferences(A.hat, B.hat, 0, 8);
        const secondHalf =
          rangeDifferences(A.kick, B.kick, 8, 16) +
          rangeDifferences(A.snare, B.snare, 8, 16) +
          rangeDifferences(A.hat, B.hat, 8, 16);
        return [
          { label: "First half stays close to A", complete: firstHalf <= 2 },
          { label: "Second half contains at least two changes", complete: secondHalf >= 2 },
          { label: "At least one change is off the main beats", complete: hasNewOffbeatEvent(A, B) },
        ];
      },
    },
  ],
};
