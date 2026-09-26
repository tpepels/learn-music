import { describe, expect, it } from "vitest";
import { levineSourceMaterial } from "../music/levineSourceMaterial";
import { learningTracks, levineLessons } from "./course";

describe("Levine jazz-piano architecture integrity", () => {
  it("registers a separate Levine learning track", () => {
    const track = learningTracks.find((entry) => entry.id === "levine");
    expect(track).toBeDefined();
    expect(track?.lessons).toEqual(levineLessons);
    expect(track?.lessons.map((lesson) => lesson.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
  });

  it("resolves every source example id through the Levine source registry", () => {
    for (const lesson of levineLessons) {
      for (const exercise of lesson.exercises) {
        const ids = exercise.source?.exampleIds ?? [];
        expect(ids.length, exercise.id).toBeGreaterThan(0);
        for (const id of ids) {
          expect(
            levineSourceMaterial[id],
            `${exercise.id} references missing source material ${id}`,
          ).toBeDefined();
        }
      }
    }
  });

  it("uses the dedicated piano-only workspace for all current Levine exercises", () => {
    for (const lesson of levineLessons) {
      for (const exercise of lesson.exercises) {
        expect(exercise.workspace, exercise.id).toBe("jazz-piano");
      }
    }
  });

  it("keeps book indices and provenance language out of learner-facing copy", () => {
    const forbidden =
      /\bFigure\s+\d|\bLevine\b|\bnative\b|source-analysis|source map|\btranscription\b|\bprinted\b|the book/i;

    for (const lesson of levineLessons) {
      const lessonCopy = [
        lesson.title,
        lesson.hero,
        lesson.description,
        lesson.overview,
      ].join(" ");
      expect(lessonCopy, lesson.id).not.toMatch(forbidden);

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
        expect(learnerCopy, exercise.id).not.toMatch(forbidden);
      }
    }
  });

  it("keeps internal source references separate from source-card teaching", () => {
    for (const material of Object.values(levineSourceMaterial)) {
      expect(material.reference.length, material.id).toBeGreaterThan(0);
      expect(material.fidelityNote.length, material.id).toBeGreaterThan(20);
    }
  });
});
