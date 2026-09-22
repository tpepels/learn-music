import { z } from "zod";
import type { StepPattern } from "../music/model";

export const lessonContentSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  eyebrow: z.string(),
  hero: z.string(),
  description: z.string(),
  instruction: z.string(),
  concept: z.string(),
  sequencerTitle: z.string(),
  checksLabel: z.string(),
  successLabel: z.string(),
  patternMode: z.enum(["single", "compare"]),
});

export type LessonContent = z.infer<typeof lessonContentSchema>;
export type LessonCheck = { label: string; complete: boolean };
export type LessonContext = { A: StepPattern; B: StepPattern };
export type LessonDefinition = LessonContent & {
  evaluate: (context: LessonContext) => LessonCheck[];
};
