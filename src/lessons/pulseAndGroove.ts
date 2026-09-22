import { z } from "zod";
import type { StepPattern } from "../music/model";

const lessonSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  eyebrow: z.string(),
  concept: z.string(),
  instruction: z.string(),
});

export const pulseAndGrooveLesson = lessonSchema.parse({
  id: "rhythm.pulse-and-groove",
  number: 1,
  title: "Pulse & groove",
  eyebrow: "Rhythm · Production",
  concept:
    "A steady pulse becomes a groove when different sounds take different roles. The grid divides one bar into sixteen equal steps.",
  instruction:
    "The kick already marks beats 1 and 3. Add the snare on beats 2 and 4, then listen to how the parts lock together.",
});

export type LessonCheck = {
  label: string;
  complete: boolean;
};

export function evaluatePulseAndGroove(pattern: StepPattern): LessonCheck[] {
  const activeHats = pattern.hat.filter(Boolean).length;
  const activeKicks = pattern.kick.filter(Boolean).length;

  return [
    {
      label: "Kick establishes the pulse",
      complete: activeKicks >= 2 && pattern.kick[0],
    },
    {
      label: "Snare lands on beat 2",
      complete: pattern.snare[4],
    },
    {
      label: "Snare lands on beat 4",
      complete: pattern.snare[12],
    },
    {
      label: "Hi-hat subdivides the bar",
      complete: activeHats >= 4,
    },
  ];
}
