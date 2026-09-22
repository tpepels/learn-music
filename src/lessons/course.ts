import { arrangementFormLesson } from "./arrangementForm";
import { automationDynamicsLesson } from "./automationDynamics";
import { chordProgressionLesson } from "./chordProgressions";
import { mixingSpaceLesson } from "./mixingSpace";
import { pianoCompositionLesson } from "./pianoComposition";
import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { rhythmVariationLesson } from "./rhythmVariation";
import { soundSynthesisLesson } from "./soundSynthesis";
import type { LessonDefinition } from "./types";

export const implementedLessons: LessonDefinition[] = [
  pulseAndGrooveLesson,
  rhythmVariationLesson,
  pianoCompositionLesson,
  chordProgressionLesson,
  soundSynthesisLesson,
  arrangementFormLesson,
  mixingSpaceLesson,
  automationDynamicsLesson,
];

export const courseOutline = implementedLessons.map((lesson) => ({
  id: lesson.id,
  number: lesson.number,
  title: lesson.title,
  implemented: true as const,
}));

export function getLesson(id: string): LessonDefinition {
  return implementedLessons.find((lesson) => lesson.id === id) ?? pulseAndGrooveLesson;
}

export function getNextImplementedLesson(id: string): LessonDefinition | undefined {
  const index = implementedLessons.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? implementedLessons[index + 1] : undefined;
}
