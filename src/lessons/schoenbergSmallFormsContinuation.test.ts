import { describe, expect, it } from "vitest";
import { schoenbergSourceMaterial } from "../music/schoenbergSourceMaterial";
import { schoenbergSmallTernaryLesson } from "./schoenbergSmallTernary";
import { schoenbergIrregularConstructionLesson } from "./schoenbergIrregularConstruction";
import { schoenbergMinuetLesson } from "./schoenbergMinuet";
import { schoenbergScherzoLesson } from "./schoenbergScherzo";
import { schoenbergThemeVariationsLesson } from "./schoenbergThemeVariations";

const lessons = [
  schoenbergSmallTernaryLesson,
  schoenbergIrregularConstructionLesson,
  schoenbergMinuetLesson,
  schoenbergScherzoLesson,
  schoenbergThemeVariationsLesson,
];

const sourceIds = [
  "s11.ternary-form",
  "s11.middle-section",
  "s11.recapitulation",
  "s12.irregular-construction",
  "s13.minuet-form",
  "s13.trio",
  "s14.scherzo-form",
  "s14.modulatory-middle",
  "s14.return-coda",
  "s15.variation-theme",
  "s15.variation-motive",
  "s15.variation-set",
];

describe("Schoenberg small-form continuation", () => {
  it("implements lessons 11-15 in source order", () => {
    expect(lessons.map((lesson) => lesson.number)).toEqual([11, 12, 13, 14, 15]);
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "schoenberg.small-ternary",
      "schoenberg.irregular-construction",
      "schoenberg.minuet",
      "schoenberg.scherzo",
      "schoenberg.theme-variations",
    ]);
  });

  it("keeps four substantial practical exercises in every lesson", () => {
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

  it("grounds every new exercise in registered source material", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        expect(exercise.source?.exampleIds?.length ?? 0, exercise.id).toBeGreaterThan(0);
        for (const id of exercise.source?.exampleIds ?? []) {
          expect(schoenbergSourceMaterial[id], id).toBeDefined();
        }
      }
    }
  });

  it("does not invent native notation for untranscribed Part II examples", () => {
    for (const id of sourceIds) {
      expect(schoenbergSourceMaterial[id]?.kind, id).toBe("map");
    }
  });

  it("keeps the source registry complete for the new block", () => {
    for (const id of sourceIds) {
      expect(schoenbergSourceMaterial[id], id).toBeDefined();
    }
  });
});
