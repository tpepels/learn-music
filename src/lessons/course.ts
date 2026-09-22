import { arrangementFormLesson } from "./arrangementForm";
import { automationDynamicsLesson } from "./automationDynamics";
import { bassLinesLesson } from "./bassLines";
import { chordProgressionLesson } from "./chordProgressions";
import { effectsTransitionsLesson } from "./effectsTransitions";
import { finalProjectLesson } from "./finalProject";
import { grooveFeelLesson } from "./grooveFeel";
import { mixingSpaceLesson } from "./mixingSpace";
import { motifDevelopmentLesson } from "./motifDevelopment";
import { melodyOverHarmonyLesson } from "./melodyOverHarmony";
import { harmonicFunctionLesson } from "./harmonicFunction";
import { phraseFormLesson } from "./phraseForm";
import { textureOrchestrationLesson } from "./textureOrchestration";
import { pianoCompositionLesson } from "./pianoComposition";
import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { rhythmVariationLesson } from "./rhythmVariation";
import { soundSynthesisLesson } from "./soundSynthesis";
import { voiceLeadingLesson } from "./voiceLeading";
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
  effectsTransitionsLesson,
  finalProjectLesson,
  voiceLeadingLesson,
  bassLinesLesson,
  grooveFeelLesson,
  motifDevelopmentLesson,
  melodyOverHarmonyLesson,
  harmonicFunctionLesson,
  phraseFormLesson,
  textureOrchestrationLesson,
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
