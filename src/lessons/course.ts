import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { rhythmVariationLesson } from "./rhythmVariation";
import type { LessonDefinition } from "./types";

export const implementedLessons: LessonDefinition[] = [
  pulseAndGrooveLesson,
  rhythmVariationLesson,
];

export const courseOutline = [
  { id: pulseAndGrooveLesson.id, number: 1, title: pulseAndGrooveLesson.title, implemented: true },
  { id: rhythmVariationLesson.id, number: 2, title: rhythmVariationLesson.title, implemented: true },
  { id: "pitch.melody", number: 3, title: "Pitch & melody", implemented: false },
  { id: "harmony.bass", number: 4, title: "Bass & harmony", implemented: false },
  { id: "sound.synthesis", number: 5, title: "Sound & synthesis", implemented: false },
  { id: "form.arrangement", number: 6, title: "Arrangement", implemented: false },
] as const;

export function getLesson(id: string): LessonDefinition {
  return implementedLessons.find((lesson) => lesson.id === id) ?? pulseAndGrooveLesson;
}

export function getNextImplementedLesson(id: string): LessonDefinition | undefined {
  const index = implementedLessons.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? implementedLessons[index + 1] : undefined;
}
