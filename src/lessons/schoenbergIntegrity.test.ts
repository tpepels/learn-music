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

function normalizeExampleToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[–—]/g, "-");
}

function exampleTokensIn(text: string): string[] {
  const pattern =
    /\b(?:ex(?:ample)?s?\.?)\s*(\d+(?:[a-z])?(?:\s*[-–—]\s*\d+(?:[a-z])?)?)/gi;
  return [...text.matchAll(pattern)].map((match) =>
    normalizeExampleToken(match[1]),
  );
}

function exampleTokenFromId(id: string): string | null {
  const match = id.match(/\.ex(.+)$/i);
  return match ? normalizeExampleToken(match[1]) : null;
}

function numericExample(value: string): number | null {
  const match = value.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

function availableTokenCovers(
  availableToken: string,
  namedToken: string,
): boolean {
  if (availableToken === namedToken) return true;

  if (/^\d+$/.test(availableToken)) {
    const namedNumber = numericExample(namedToken);
    if (namedNumber === Number(availableToken)) return true;
  }

  const range = availableToken.match(/^(\d+)-(\d+)$/);
  if (!range) return false;

  const namedNumber = numericExample(namedToken);
  if (namedNumber === null) return false;

  return namedNumber >= Number(range[1]) && namedNumber <= Number(range[2]);
}

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

  it("keeps named book examples required by a task on the same exercise screen", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        const available = new Set(
          (exercise.source?.exampleIds ?? [])
            .map(exampleTokenFromId)
            .filter((value): value is string => Boolean(value)),
        );

        const taskCopy = [exercise.instruction, exercise.recognition].join(" ");
        for (const namedExample of exampleTokensIn(taskCopy)) {
          const covered = [...available].some((availableToken) =>
            availableTokenCovers(availableToken, namedExample),
          );
          expect(
            covered,
            `${exercise.id} names Example ${namedExample} in the task but does not render matching source material`,
          ).toBe(true);
        }
      }
    }
  });

  it("uses Example rather than Ex. in learner tasks", () => {
    const abbreviatedExample = /\bExs?\./;

    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        const taskCopy = [exercise.instruction, exercise.recognition].join(" ");
        expect(taskCopy, exercise.id).not.toMatch(abbreviatedExample);
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
