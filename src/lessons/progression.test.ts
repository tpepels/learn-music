import { describe, expect, it } from "vitest";
import { getNextImplementedLesson, implementedLessons } from "./course";
import { getAdvanceDestination } from "./progression";

describe("lesson progression", () => {
  it("keeps the full curriculum intact", () => {
    expect(implementedLessons).toHaveLength(37);
    expect(
      implementedLessons.flatMap((lesson) => lesson.exercises),
    ).toHaveLength(148);
    expect(implementedLessons.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 37 }, (_, index) => index + 1),
    );
    expect(implementedLessons.slice(-9, -5).map((lesson) => lesson.id)).toEqual([
      "pitch.intervals-transposition",
      "harmony.chord-colour",
      "rhythm.phrasing-space",
      "production.gain-staging-loudness",
    ]);
    expect(implementedLessons.slice(-5).map((lesson) => lesson.id)).toEqual([
      "style.house",
      "style.funk",
      "style.hip-hop",
      "style.ambient",
      "style.pop",
    ]);
  });

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
