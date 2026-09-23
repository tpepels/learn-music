import { describe, expect, it } from "vitest";
import { isExerciseReady } from "./exerciseReadiness";

describe("exercise readiness", () => {
  it("unlocks as soon as the exercise's own checks are satisfied", () => {
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
        checksReady: true,
        completed: true,
      }),
    ).toBe(true);
  });

  it("does not unlock while the exercise's own checks are incomplete", () => {
    expect(
      isExerciseReady({
        checksReady: false,
        completed: false,
      }),
    ).toBe(false);
  });

  it("does not revoke an exercise that was already completed", () => {
    expect(
      isExerciseReady({
        checksReady: false,
        completed: true,
      }),
    ).toBe(true);
  });
});
