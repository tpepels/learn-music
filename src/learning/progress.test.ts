import { describe, expect, it } from "vitest";
import {
  resetLessonProgressState,
  sanitizeLearningProgress,
} from "./progress";

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


describe("sanitizeLearningProgress", () => {
  const lessons = [
    {
      id: "lesson.one",
      exerciseIds: ["lesson.one.a", "lesson.one.b"],
    },
    {
      id: "lesson.two",
      exerciseIds: ["lesson.two.a", "lesson.two.b", "lesson.two.c"],
    },
  ];

  it("removes stale curriculum IDs and repairs the current lesson", () => {
    const result = sanitizeLearningProgress(
      {
        currentLessonId: "lesson.removed",
        exerciseIndexByLesson: {
          "lesson.one": 1,
          "lesson.two": 99,
          "lesson.removed": 3,
        },
        completedExerciseIds: [
          "lesson.one.a",
          "lesson.one.a",
          "lesson.removed.a",
        ],
        completedLessonIds: [
          "lesson.one",
          "lesson.one",
          "lesson.removed",
        ],
      },
      lessons,
      "lesson.one",
    );

    expect(result).toEqual({
      currentLessonId: "lesson.one",
      exerciseIndexByLesson: {
        "lesson.one": 1,
        "lesson.two": 2,
      },
      completedExerciseIds: ["lesson.one.a"],
      completedLessonIds: [],
    });
  });

  it("reopens a lesson when new exercises are missing from saved completion", () => {
    const result = sanitizeLearningProgress(
      {
        currentLessonId: "lesson.one",
        exerciseIndexByLesson: { "lesson.one": 1 },
        completedExerciseIds: ["lesson.one.a", "lesson.one.b"],
        completedLessonIds: ["lesson.one"],
      },
      [
        {
          id: "lesson.one",
          exerciseIds: ["lesson.one.a", "lesson.one.b", "lesson.one.c"],
        },
      ],
      "lesson.one",
    );

    expect(result.completedLessonIds).toEqual([]);
    expect(result.completedExerciseIds).toEqual([
      "lesson.one.a",
      "lesson.one.b",
    ]);
  });

  it("uses the first current lesson when the configured fallback no longer exists", () => {
    const result = sanitizeLearningProgress(
      {
        currentLessonId: "lesson.removed",
        exerciseIndexByLesson: {},
        completedExerciseIds: [],
        completedLessonIds: [],
      },
      lessons,
      "another.removed.lesson",
    );

    expect(result.currentLessonId).toBe("lesson.one");
  });
});
