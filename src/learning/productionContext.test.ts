import { describe, expect, it } from "vitest";
import { playLabLessons } from "../lessons/course";
import { productionContext } from "./productionContext";

describe("producer context coverage", () => {
  it("explains why, when, tools, and real-world recognition for every PLAY / LAB exercise", () => {
    const exercises = playLabLessons.flatMap((lesson) => lesson.exercises);

    expect(exercises.length).toBeGreaterThan(0);

    for (const exercise of exercises) {
      const context = productionContext[exercise.id];

      expect(context, exercise.id + " is missing production context").toBeDefined();
      expect(context.why.length, exercise.id + " is missing WHY").toBeGreaterThan(20);
      expect(context.when.length, exercise.id + " is missing WHEN").toBeGreaterThan(20);
      expect(context.tools.length, exercise.id + " is missing WHAT tools").toBeGreaterThanOrEqual(2);
      expect(context.realWorld.length, exercise.id + " is missing real-world recognition").toBeGreaterThan(20);
      expect(context.visual, exercise.id + " is missing a visual").toBeTruthy();
    }
  });
});
