import { describe, expect, it } from "vitest";
import { playLabLessons } from "./course";
import { playLabScopeByLessonId } from "./playLabScope";

describe("PLAY / LAB editorial scope", () => {
  it("defines an exact learning contract for every PLAY / LAB lesson and no others", () => {
    const lessonIds = playLabLessons.map((lesson) => lesson.id).sort();
    const scopeIds = Object.keys(playLabScopeByLessonId).sort();

    expect(scopeIds).toEqual(lessonIds);
    expect(scopeIds).toHaveLength(37);
  });

  it("keeps each lesson contract concise and explicit", () => {
    for (const lesson of playLabLessons) {
      const scope = playLabScopeByLessonId[lesson.id];

      expect(scope, lesson.id).toBeDefined();
      expect(scope.objectives.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(scope.objectives.length, lesson.id).toBeLessThanOrEqual(4);
      expect(new Set(scope.objectives).size, lesson.id).toBe(scope.objectives.length);
      expect(scope.objectives.every((objective) => objective.trim().length >= 24), lesson.id).toBe(true);
      expect(scope.scope.trim().length, lesson.id).toBeGreaterThanOrEqual(30);
    }
  });

  it("allows only the opening lesson to have no prerequisite statement", () => {
    for (const [index, lesson] of playLabLessons.entries()) {
      const prerequisites = playLabScopeByLessonId[lesson.id].prerequisites;

      if (index === 0) {
        expect(prerequisites).toEqual([]);
      } else {
        expect(prerequisites.length, lesson.id).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
