import { describe, expect, it } from "vitest";
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

describe("Schoenberg learner-facing copy", () => {
  it("teaches the music directly instead of describing implementation or provenance", () => {
    const forbidden =
      /\bSchoenberg\b|\bnative\b|source-analysis|source map|PLAY \/ LAB|\btranscription\b|\bprinted\b|the book/i;

    for (const lesson of lessons) {
      const lessonCopy = [
        lesson.hero,
        lesson.description,
        lesson.overview,
      ].join(" ");

      expect(lessonCopy, lesson.id).not.toMatch(forbidden);

      for (const exercise of lesson.exercises) {
        const exerciseCopy = [
          exercise.learn,
          exercise.explanation,
          exercise.instruction,
          exercise.recognition,
        ].join(" ");

        expect(exerciseCopy, exercise.id).not.toMatch(forbidden);
      }
    }
  });
});
