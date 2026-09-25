import { describe, expect, it } from "vitest";
import { schoenbergSourceMaterial } from "../music/schoenbergSourceMaterial";
import { schoenbergPhraseMotiveLesson } from "./schoenbergPhraseMotive";
import { schoenbergDevelopingVariationLesson } from "./schoenbergDevelopingVariation";
import { schoenbergConnectingMotiveFormsLesson } from "./schoenbergConnectingMotiveForms";
import { schoenbergBeginningSentenceLesson } from "./schoenbergBeginningSentence";
import { schoenbergCompletingSentenceLesson } from "./schoenbergCompletingSentence";

const lessons = [
  schoenbergPhraseMotiveLesson,
  schoenbergDevelopingVariationLesson,
  schoenbergConnectingMotiveFormsLesson,
  schoenbergBeginningSentenceLesson,
  schoenbergCompletingSentenceLesson,
];

describe("Schoenberg architecture integrity", () => {
  it("resolves every source example id through the source registry", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        for (const id of exercise.source?.exampleIds ?? []) {
          expect(
            schoenbergSourceMaterial[id],
            `${exercise.id} references missing source material ${id}`,
          ).toBeDefined();
        }
      }
    }
  });

  it("keeps book indices out of learner-facing content", () => {
    const bookIndex = /\b(?:Exs?\.\s*\d|Examples?\s+\d)/i;

    for (const lesson of lessons) {
      const lessonCopy = [
        lesson.title,
        lesson.hero,
        lesson.description,
        lesson.overview,
      ].join(" ");
      expect(lessonCopy, lesson.id).not.toMatch(bookIndex);

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

        expect(learnerCopy, exercise.id).not.toMatch(bookIndex);
      }
    }
  });

  it("reserves the word exercise for PLAY / LAB lettered steps", () => {
    const numberedExercise = /\bexercises?\s+\d/i;

    for (const lesson of lessons) {
      const lessonCopy = [
        lesson.hero,
        lesson.description,
        lesson.overview,
      ].join(" ");
      expect(lessonCopy, lesson.id).not.toMatch(numberedExercise);

      for (const exercise of lesson.exercises) {
        const learnerCopy = [
          exercise.learn,
          exercise.explanation,
          exercise.instruction,
          exercise.recognition,
        ].join(" ");

        expect(learnerCopy, exercise.id).not.toMatch(numberedExercise);
      }
    }
  });
});
