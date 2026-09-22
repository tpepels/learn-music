import type { StepPattern } from "../music/model";
import {
  lessonContentSchema,
  type LessonCheck,
  type LessonDefinition,
} from "./types";

const content = lessonContentSchema.parse({
  id: "rhythm.pulse-and-groove",
  number: 1,
  title: "Pulse & groove",
  eyebrow: "Rhythm · Production",
  hero: "Feel the pulse before adding complexity.",
  description:
    "Click the grid to turn sounds on and off. Every group of four steps is one beat. Press play whenever you want to hear the result.",
  concept:
    "A steady pulse becomes a groove when different sounds take different roles. The grid divides one bar into sixteen equal steps.",
  instruction:
    "The kick already marks beats 1 and 3. Add the snare on beats 2 and 4, then listen to how the parts lock together.",
  sequencerTitle: "Build the groove",
  checksLabel: "Listen for",
  successLabel: "Groove complete",
  patternMode: "single",
});

export function evaluatePulseAndGroove(pattern: StepPattern): LessonCheck[] {
  const activeHats = pattern.hat.filter(Boolean).length;
  const activeKicks = pattern.kick.filter(Boolean).length;

  return [
    { label: "Kick establishes the pulse", complete: activeKicks >= 2 && pattern.kick[0] },
    { label: "Snare lands on beat 2", complete: pattern.snare[4] },
    { label: "Snare lands on beat 4", complete: pattern.snare[12] },
    { label: "Hi-hat subdivides the bar", complete: activeHats >= 4 },
  ];
}

export const pulseAndGrooveLesson: LessonDefinition = {
  ...content,
  evaluate: ({ A }) => evaluatePulseAndGroove(A),
};
