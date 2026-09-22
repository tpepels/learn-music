import { describe, expect, it } from "vitest";
import { isExerciseReady } from "./exerciseReadiness";

describe("exercise readiness", () => {
  it("does not auto-complete a newly opened exercise from inherited state", () => {
    expect(
      isExerciseReady({
        checksReady: true,
        completed: false,
        entryExerciseId: "lesson.d",
        currentExerciseId: "lesson.d",
        entryFingerprint: "same-state",
        currentFingerprint: "same-state",
      }),
    ).toBe(false);
  });

  it("unlocks after the student makes a fresh project change", () => {
    expect(
      isExerciseReady({
        checksReady: true,
        completed: false,
        entryExerciseId: "lesson.d",
        currentExerciseId: "lesson.d",
        entryFingerprint: "before",
        currentFingerprint: "after",
      }),
    ).toBe(true);
  });

  it("keeps previously completed exercises available without forcing another edit", () => {
    expect(
      isExerciseReady({
        checksReady: true,
        completed: true,
        entryExerciseId: "lesson.d",
        currentExerciseId: "lesson.d",
        entryFingerprint: "same-state",
        currentFingerprint: "same-state",
      }),
    ).toBe(true);
  });

  it("never unlocks when the actual checks are incomplete", () => {
    expect(
      isExerciseReady({
        checksReady: false,
        completed: false,
        entryExerciseId: "lesson.d",
        currentExerciseId: "lesson.d",
        entryFingerprint: "before",
        currentFingerprint: "after",
      }),
    ).toBe(false);
  });
});
