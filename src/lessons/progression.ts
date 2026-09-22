import type { LessonDefinition } from "./types";

export type AdvanceDestination =
  | { type: "exercise"; exerciseIndex: number }
  | { type: "lesson"; lessonId: string }
  | { type: "complete" };

export function getAdvanceDestination(
  lesson: LessonDefinition,
  exerciseIndex: number,
  nextLesson: LessonDefinition | undefined,
): AdvanceDestination {
  const isLastExercise = exerciseIndex >= lesson.exercises.length - 1;

  if (!isLastExercise) {
    return { type: "exercise", exerciseIndex: exerciseIndex + 1 };
  }

  if (nextLesson) {
    return { type: "lesson", lessonId: nextLesson.id };
  }

  return { type: "complete" };
}
