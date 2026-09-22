import { countPatternDifferences } from "../music/model";
import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const lesson = lessonContentSchema.parse({
  id: "rhythm.variation",
  number: 2,
  title: "Repetition & variation",
  eyebrow: "Composition · Rhythm",
  hero: "Change the groove without losing the groove."
  description:
    "Pattern A is your reference. Pattern B starts as a copy and becomes a variation. You will change small details, create a fill, use anticipation, and shape the end of the bar.",
  overview:
    "A loop becomes memorable through repetition, but a completely fixed loop can go flat. Keep enough of Pattern A that the ear recognises it, then change only the part that needs motion.",
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
          "Switch A/B without watching the grid. Does B still feel like the same groove? Which change do you notice first?",
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
          "Loop A/B. Does the busier ending make beat 1 feel more prepared, or does it simply add noise?",
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
          "Listen to the note before the strong beat. Does it make the next beat feel as if it arrives sooner?",
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
          "Now make a distinct turnaround rather than only adding more hits. Keep the first half close to A. In the second half, remove at least one event from A and add at least two new events. Listen for the ending to change shape before beat 1 returns.",
        recognition:
          "With your eyes off the grid, can you hear where the bar starts changing shape and where beat 1 feels like a return?",
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

        const additions = ["kick", "snare", "hat"].reduce((total, track) => {
          const aTrack = A[track as keyof typeof A];
          const bTrack = B[track as keyof typeof B];
          return (
            total +
            bTrack.reduce(
              (count, active, step) =>
                count + (step >= 8 && active && !aTrack[step] ? 1 : 0),
              0,
            )
          );
        }, 0);

        const removals = ["kick", "snare", "hat"].reduce((total, track) => {
          const aTrack = A[track as keyof typeof A];
          const bTrack = B[track as keyof typeof B];
          return (
            total +
            aTrack.reduce(
              (count, active, step) =>
                count + (step >= 8 && active && !bTrack[step] ? 1 : 0),
              0,
            )
          );
        }, 0);

        return [
          { label: "First half stays close to A", complete: firstHalf <= 2 },
          { label: "At least two new ending events are added", complete: additions >= 2 },
          { label: "At least one original ending event is removed", complete: removals >= 1 },
        ];
      },
    },
  ],
};
