import { describe, expect, it } from "vitest";
import { implementedLessons } from "./course";

function firstInstructionWord(instruction: string) {
  return instruction
    .trim()
    .split(/\s+/)[0]
    .replace(/[^A-Za-zÀ-ÿ]/g, "")
    .toLowerCase();
}

describe("exercise instruction variety", () => {
  it("never falls back to generic mutation busywork", () => {
    const banned = /\b(?:make|do)\s+(?:at least\s+)?(?:one|a)\s+change\b/i;

    for (const lesson of implementedLessons) {
      for (const exercise of lesson.exercises) {
        expect(
          banned.test(exercise.instruction),
          exercise.id + " uses generic change wording",
        ).toBe(false);
      }
    }
  });

  it("varies the instructional opening within each four-exercise lesson", () => {
    for (const lesson of implementedLessons) {
      if (lesson.exercises.length < 4) continue;

      const openings = new Set(
        lesson.exercises.map((exercise) =>
          firstInstructionWord(exercise.instruction),
        ),
      );

      expect(
        openings.size,
        lesson.id + " repeats the same instructional framing too often",
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
