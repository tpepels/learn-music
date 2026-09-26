import { describe, expect, it } from "vitest";
import { belkinSourceMaterial } from "../music/belkinSourceMaterial";
import { belkinBinaryFormLesson } from "./belkinBinaryForm";
import { belkinPresentingLesson } from "./belkinPresenting";
import { belkinPunctuatingLesson } from "./belkinPunctuating";
import { belkinLessons, learningTracks, schoenbergLessons } from "./course";

const lessons = [
  belkinPunctuatingLesson,
  belkinPresentingLesson,
  belkinBinaryFormLesson,
];

const sourceIds = [
  "b01.punctuation-dimensions",
  "b01.elision",
  "b01.punctuation-hierarchy",
  "b01.cadential-shaping",
  "b02.presenting-stability",
  "b02.phrase-length",
  "b02.paragraph",
  "b02.period-paragraph",
  "b03.binary-identity",
  "b03.second-half",
  "b03.rounded-return",
  "b03.finality",
];

describe("Belkin craft foundations", () => {
  it("implements the first three Belkin lessons in deliberate source order", () => {
    expect(lessons.map((lesson) => lesson.number)).toEqual([1, 2, 3]);
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "belkin.punctuating",
      "belkin.presenting",
      "belkin.binary-form",
    ]);
    expect(belkinLessons.map((lesson) => lesson.id)).toEqual(
      lessons.map((lesson) => lesson.id),
    );
  });

  it("keeps the Belkin material in its own learning track", () => {
    const belkin = learningTracks.find((track) => track.id === "belkin");
    expect(belkin?.lessons.map((lesson) => lesson.id)).toEqual(
      lessons.map((lesson) => lesson.id),
    );
    expect(schoenbergLessons).toHaveLength(18);
    expect(schoenbergLessons.some((lesson) => lesson.id.startsWith("belkin."))).toBe(false);
  });

  it("keeps four practical exercises in each initial lesson", () => {
    for (const lesson of lessons) {
      expect(lesson.exercises, lesson.id).toHaveLength(4);
      expect(lesson.exercises.map((exercise) => exercise.letter)).toEqual([
        "A",
        "B",
        "C",
        "D",
      ]);
    }
  });

  it("grounds every exercise in registered Belkin source analysis", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        expect(exercise.source?.exampleIds?.length ?? 0, exercise.id).toBeGreaterThan(0);
        for (const id of exercise.source?.exampleIds ?? []) {
          expect(id.startsWith("b"), id).toBe(true);
          expect(belkinSourceMaterial[id], id).toBeDefined();
        }
      }
    }
  });

  it("keeps the first block analysis-only rather than inventing source notation", () => {
    for (const id of sourceIds) {
      expect(belkinSourceMaterial[id], id).toBeDefined();
      expect(belkinSourceMaterial[id]?.kind, id).toBe("map");
    }
  });
});
