import { describe, expect, it } from "vitest";
import { resetLessonProgressState } from "./progress";

describe("resetLessonProgressState", () => {
  it("clears only the selected lesson's completion and returns it to A", () => {
    const result = resetLessonProgressState(
      {
        currentLessonId: "rhythm.groove-feel",
        exerciseIndexByLesson: {
          "rhythm.groove-feel": 3,
          "composition.bass-lines": 2,
        },
        completedExerciseIds: [
          "rhythm.groove-feel.a",
          "rhythm.groove-feel.b",
          "composition.bass-lines.a",
        ],
        completedLessonIds: [
          "rhythm.groove-feel",
          "composition.bass-lines",
        ],
        currentStep: 12,
      },
      "rhythm.groove-feel",
      [
        "rhythm.groove-feel.a",
        "rhythm.groove-feel.b",
        "rhythm.groove-feel.c",
        "rhythm.groove-feel.d",
      ],
    );

    expect(result.exerciseIndexByLesson["rhythm.groove-feel"]).toBe(0);
    expect(result.exerciseIndexByLesson["composition.bass-lines"]).toBe(2);
    expect(result.completedExerciseIds).toEqual([
      "composition.bass-lines.a",
    ]);
    expect(result.completedLessonIds).toEqual([
      "composition.bass-lines",
    ]);
    expect(result.currentStep).toBe(0);
  });

  it("does not alter unrelated current playback position", () => {
    const result = resetLessonProgressState(
      {
        currentLessonId: "pitch.melody",
        exerciseIndexByLesson: { "rhythm.groove-feel": 2 },
        completedExerciseIds: ["rhythm.groove-feel.a"],
        completedLessonIds: [],
        currentStep: 7,
      },
      "rhythm.groove-feel",
      ["rhythm.groove-feel.a"],
    );

    expect(result.currentStep).toBe(7);
  });
});
