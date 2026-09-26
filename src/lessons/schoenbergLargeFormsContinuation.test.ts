import { describe, expect, it } from "vitest";
import { schoenbergSourceMaterial } from "../music/schoenbergSourceMaterial";
import { schoenbergLargeFormFunctionsLesson } from "./schoenbergLargeFormFunctions";
import { schoenbergRondoLesson } from "./schoenbergRondo";
import { schoenbergSonataAllegroLesson } from "./schoenbergSonataAllegro";

const lessons = [
  schoenbergLargeFormFunctionsLesson,
  schoenbergRondoLesson,
  schoenbergSonataAllegroLesson,
];

const sourceIds = [
  "s16.transition",
  "s16.retransition",
  "s16.subordinate-group",
  "s16.coda",
  "s17.rondo-types",
  "s17.return-variation",
  "s17.subordinate-return",
  "s17.sonata-rondo",
  "s18.exposition",
  "s18.elaboration",
  "s18.retransition",
  "s18.sonata-architecture",
  "s18.recapitulation-coda",
];

describe("Schoenberg large-form continuation", () => {
  it("implements lessons 16-18 in source order", () => {
    expect(lessons.map((lesson) => lesson.number)).toEqual([16, 17, 18]);
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "schoenberg.large-form-functions",
      "schoenberg.rondo",
      "schoenberg.sonata-allegro",
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

  it("does not invent native notation for untranscribed large-form examples", () => {
    for (const id of sourceIds) {
      expect(schoenbergSourceMaterial[id]?.kind, id).toBe("map");
    }
  });
});
