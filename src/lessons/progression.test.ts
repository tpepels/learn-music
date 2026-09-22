import { describe, expect, it } from "vitest";
import { getNextImplementedLesson, implementedLessons } from "./course";
import { getAdvanceDestination } from "./progression";

describe("lesson progression", () => {
  it("advances from one exercise to the next inside a lesson", () => {
    const lesson = implementedLessons[0];
    expect(getAdvanceDestination(lesson, 0, implementedLessons[1])).toEqual({
      type: "exercise",
      exerciseIndex: 1,
    });
  });

  it("advances directly from the final exercise to the next lesson", () => {
    for (let index = 0; index < implementedLessons.length - 1; index += 1) {
      const lesson = implementedLessons[index];
      const nextLesson = getNextImplementedLesson(lesson.id);

      expect(
        getAdvanceDestination(
          lesson,
          lesson.exercises.length - 1,
          nextLesson,
        ),
      ).toEqual({
        type: "lesson",
        lessonId: implementedLessons[index + 1].id,
      });
    }
  });

  it("marks the end of the current implemented course after the final lesson", () => {
    const lesson = implementedLessons[implementedLessons.length - 1];
    expect(
      getAdvanceDestination(
        lesson,
        lesson.exercises.length - 1,
        undefined,
      ),
    ).toEqual({ type: "complete" });
  });
});
