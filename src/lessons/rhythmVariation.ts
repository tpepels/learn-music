import {
  countPatternDifferences,
  hasNewOffbeatEvent,
  type StepPattern,
} from "../music/model";
import {
  lessonContentSchema,
  type LessonCheck,
  type LessonDefinition,
} from "./types";

const content = lessonContentSchema.parse({
  id: "rhythm.variation",
  number: 2,
  title: "Rhythm & variation",
  eyebrow: "Composition · Rhythm",
  hero: "Change enough to create movement, but keep the idea recognisable.",
  description:
    "Pattern A is your original groove. Pattern B begins as a copy. Change B, then switch between A and B while the transport is running.",
  concept:
    "Variation works because the listener can hear both sameness and change. Keeping the backbeat while altering a few smaller events creates a clear relationship between A and B.",
  instruction:
    "Leave A intact. Edit B so it differs in a few places, keeps the snare backbeat, and introduces at least one event between the main beats.",
  sequencerTitle: "Create a B variation",
  checksLabel: "Variation rules",
  successLabel: "Variation complete",
  patternMode: "compare",
});

export function evaluateRhythmVariation(
  reference: StepPattern,
  variation: StepPattern,
): LessonCheck[] {
  const differences = countPatternDifferences(reference, variation);

  return [
    { label: "B differs from A in at least two steps", complete: differences >= 2 },
    { label: "B changes no more than six steps", complete: differences >= 2 && differences <= 6 },
    { label: "The snare backbeat stays on beats 2 and 4", complete: variation.snare[4] && variation.snare[12] },
    { label: "B adds an offbeat event", complete: hasNewOffbeatEvent(reference, variation) },
  ];
}

export const rhythmVariationLesson: LessonDefinition = {
  ...content,
  evaluate: ({ A, B }) => evaluateRhythmVariation(A, B),
};
