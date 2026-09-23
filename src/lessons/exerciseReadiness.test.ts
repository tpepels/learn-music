import { describe, expect, it } from "vitest";
import { isExerciseReady } from "./exerciseReadiness";

describe("exercise readiness", () => {
  it("unlocks as soon as the exercise-specific checks are complete", () => {
    expect(
      isExerciseReady({
        checksReady: true,
        completed: false,
      }),
    ).toBe(true);
  });

  it("does not require an unrelated extra edit when inherited state already proves the goal", () => {
    expect(
      isExerciseReady({
        checksReady: true,
        completed: false,
      }),
    ).toBe(true);
  });

  it("keeps previously completed exercises available", () => {
    expect(
      isExerciseReady({
        checksReady: false,
        completed: true,
      }),
    ).toBe(true);
  });

  it("stays locked when the actual checks are incomplete", () => {
    expect(
      isExerciseReady({
        checksReady: false,
        completed: false,
      }),
    ).toBe(false);
  });
});
