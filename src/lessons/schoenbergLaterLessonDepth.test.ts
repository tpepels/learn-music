import { describe, expect, it } from "vitest";
import { schoenbergDevelopingVariationLesson } from "./schoenbergDevelopingVariation";
import { schoenbergConnectingMotiveFormsLesson } from "./schoenbergConnectingMotiveForms";
import { schoenbergBeginningSentenceLesson } from "./schoenbergBeginningSentence";
import { schoenbergCompletingSentenceLesson } from "./schoenbergCompletingSentence";
import { schoenbergPeriodLesson } from "./schoenbergPeriod";
import { schoenbergAccompanimentLesson } from "./schoenbergAccompaniment";
import { schoenbergCharacterMoodLesson } from "./schoenbergCharacterMood";
import { schoenbergMelodyThemeLesson } from "./schoenbergMelodyTheme";
import { schoenbergSelfCriticismLesson } from "./schoenbergSelfCriticism";
import { schoenbergSmallTernaryLesson } from "./schoenbergSmallTernary";
import { schoenbergIrregularConstructionLesson } from "./schoenbergIrregularConstruction";
import { schoenbergMinuetLesson } from "./schoenbergMinuet";
import { schoenbergScherzoLesson } from "./schoenbergScherzo";
import { schoenbergThemeVariationsLesson } from "./schoenbergThemeVariations";

const laterLessons = [
  schoenbergDevelopingVariationLesson,
  schoenbergConnectingMotiveFormsLesson,
  schoenbergBeginningSentenceLesson,
  schoenbergCompletingSentenceLesson,
  schoenbergPeriodLesson,
  schoenbergAccompanimentLesson,
  schoenbergCharacterMoodLesson,
  schoenbergMelodyThemeLesson,
  schoenbergSelfCriticismLesson,
  schoenbergSmallTernaryLesson,
  schoenbergIrregularConstructionLesson,
  schoenbergMinuetLesson,
  schoenbergScherzoLesson,
  schoenbergThemeVariationsLesson,
];

describe("Schoenberg S02-S15 teaching depth", () => {
  it("keeps every concept explanation substantial and multi-paragraph", () => {
    for (const lesson of laterLessons) {
      for (const exercise of lesson.exercises) {
        const paragraphs = exercise.explanation
          .split(/\n\n+/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean);

        expect(
          exercise.explanation.length,
          `${exercise.id} explanation became too compressed`,
        ).toBeGreaterThanOrEqual(500);
        expect(
          paragraphs.length,
          `${exercise.id} should teach the concept in at least two paragraphs`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("keeps exercise instructions explicit enough to act without guessing", () => {
    for (const lesson of laterLessons) {
      for (const exercise of lesson.exercises) {
        expect(
          exercise.instruction.length,
          `${exercise.id} instruction became too sparse`,
        ).toBeGreaterThanOrEqual(280);
      }
    }
  });

  it("keeps provenance out of learner-facing vocabulary and completion text", () => {
    const provenance = /\bChapter\s+[IVXLC]+\b|\bSchoenberg(?:'s)?\b|\bExs?\.\s*\d|\bExamples?\s+\d/i;

    for (const lesson of laterLessons) {
      for (const exercise of lesson.exercises) {
        const learnerCopy = [
          exercise.title,
          exercise.learn,
          exercise.explanation,
          exercise.instruction,
          exercise.recognition,
          exercise.checksLabel,
          exercise.successLabel,
          ...exercise.terms.flatMap((term) => [term.term, term.definition]),
        ].join(" ");

        expect(learnerCopy, exercise.id).not.toMatch(provenance);
      }
    }
  });

  it("keeps source material attached to every exercise", () => {
    for (const lesson of laterLessons) {
      for (const exercise of lesson.exercises) {
        expect(
          exercise.source?.exampleIds?.length ?? 0,
          `${exercise.id} has no source material`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
