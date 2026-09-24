import { arrangementFormLesson } from "./arrangementForm";
import { automationDynamicsLesson } from "./automationDynamics";
import { bassLinesLesson } from "./bassLines";
import { chordProgressionLesson } from "./chordProgressions";
import { effectsTransitionsLesson } from "./effectsTransitions";
import { eqSpectralBalanceLesson } from "./eqSpectralBalance";
import { finalProjectLesson } from "./finalProject";
import { grooveFeelLesson } from "./grooveFeel";
import { gainStagingLoudnessLesson } from "./gainStagingLoudness";
import { mixingSpaceLesson } from "./mixingSpace";
import { modalMixtureLesson } from "./modalMixture";
import { chordColorExtensionsLesson } from "./chordColorExtensions";
import { minorCadencesLesson } from "./minorCadences";
import { motifDevelopmentLesson } from "./motifDevelopment";
import { melodyOverHarmonyLesson } from "./melodyOverHarmony";
import { harmonicFunctionLesson } from "./harmonicFunction";
import { harmonicMinorLesson } from "./harmonicMinor";
import { intervalsTranspositionLesson } from "./intervalsTransposition";
import { phraseFormLesson } from "./phraseForm";
import { textureOrchestrationLesson } from "./textureOrchestration";
import { pianoCompositionLesson } from "./pianoComposition";
import { pulseAndGrooveLesson } from "./pulseAndGroove";
import { referenceMixingLesson } from "./referenceMixing";
import { relativeMinorLesson } from "./relativeMinor";
import { rhythmVariationLesson } from "./rhythmVariation";
import { rhythmicPhrasingSpaceLesson } from "./rhythmicPhrasingSpace";
import { saturationLesson } from "./saturation";
import { seventhChordsLesson } from "./seventhChords";
import { sidechainLesson } from "./sidechain";
import { soundSynthesisLesson } from "./soundSynthesis";
import { stereoMonoLesson } from "./stereoMono";
import { voiceLeadingLesson } from "./voiceLeading";
import {
  ambientStyleLesson,
  funkStyleLesson,
  hipHopStyleLesson,
  houseStyleLesson,
  popStyleLesson,
} from "./styleGenreLab";
import { schoenbergPhraseMotiveLesson } from "./schoenbergPhraseMotive";
import { schoenbergDevelopingVariationLesson } from "./schoenbergDevelopingVariation";
import { schoenbergConnectingMotiveFormsLesson } from "./schoenbergConnectingMotiveForms";
import { schoenbergBeginningSentenceLesson } from "./schoenbergBeginningSentence";
import type { LessonDefinition } from "./types";

export const playLabLessons: LessonDefinition[] = [
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
  eqSpectralBalanceLesson,
  saturationLesson,
  sidechainLesson,
  stereoMonoLesson,
  referenceMixingLesson,
  relativeMinorLesson,
  harmonicMinorLesson,
  minorCadencesLesson,
  seventhChordsLesson,
  modalMixtureLesson,
  intervalsTranspositionLesson,
  chordColorExtensionsLesson,
  rhythmicPhrasingSpaceLesson,
  gainStagingLoudnessLesson,
  houseStyleLesson,
  funkStyleLesson,
  hipHopStyleLesson,
  ambientStyleLesson,
  popStyleLesson,
];

export const schoenbergLessons: LessonDefinition[] = [
  schoenbergPhraseMotiveLesson,
  schoenbergDevelopingVariationLesson,
  schoenbergConnectingMotiveFormsLesson,
  schoenbergBeginningSentenceLesson,
];

export type LearningTrackId = "play-lab" | "schoenberg";

export type LearningTrackDefinition = {
  id: LearningTrackId;
  label: string;
  title: string;
  description: string;
  lessons: LessonDefinition[];
};

export const learningTracks: LearningTrackDefinition[] = [
  {
    id: "play-lab",
    label: "PLAY / LAB",
    title: "Music & Production",
    description: "The existing practical course in rhythm, harmony, production and style.",
    lessons: playLabLessons,
  },
  {
    id: "schoenberg",
    label: "SCHOENBERG",
    title: "Composition & Form",
    description: "A separate composition track based on Fundamentals of Musical Composition.",
    lessons: schoenbergLessons,
  },
];

export const implementedLessons: LessonDefinition[] = [
  ...playLabLessons,
  ...schoenbergLessons,
];

export const courseOutline = playLabLessons.map((lesson) => ({
  id: lesson.id,
  number: lesson.number,
  title: lesson.title,
  implemented: true as const,
}));

export function getLesson(id: string): LessonDefinition {
  return implementedLessons.find((lesson) => lesson.id === id) ?? pulseAndGrooveLesson;
}

export function getLearningTrack(id: LearningTrackId): LearningTrackDefinition {
  return learningTracks.find((track) => track.id === id) ?? learningTracks[0];
}

export function getTrackForLesson(id: string): LearningTrackDefinition {
  return learningTracks.find((track) =>
    track.lessons.some((lesson) => lesson.id === id),
  ) ?? learningTracks[0];
}

export function getTrackOutline(id: LearningTrackId) {
  return getLearningTrack(id).lessons.map((lesson) => ({
    id: lesson.id,
    number: lesson.number,
    title: lesson.title,
    implemented: true as const,
  }));
}

export function getFirstIncompleteLesson(
  trackId: LearningTrackId,
  completedLessonIds: string[],
): LessonDefinition {
  const track = getLearningTrack(trackId);
  return (
    track.lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ??
    track.lessons.at(-1) ??
    playLabLessons[0]
  );
}

export function getNextImplementedLesson(id: string): LessonDefinition | undefined {
  const track = getTrackForLesson(id);
  const index = track.lessons.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? track.lessons[index + 1] : undefined;
}
