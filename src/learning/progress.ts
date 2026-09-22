export type LessonProgressState = {
  currentLessonId: string;
  exerciseIndexByLesson: Record<string, number>;
  completedExerciseIds: string[];
  completedLessonIds: string[];
  currentStep: number;
};

export function resetLessonProgressState(
  state: LessonProgressState,
  lessonId: string,
  exerciseIds: string[],
): LessonProgressState {
  const exerciseIndexByLesson = { ...state.exerciseIndexByLesson };
  exerciseIndexByLesson[lessonId] = 0;

  return {
    ...state,
    exerciseIndexByLesson,
    completedExerciseIds: state.completedExerciseIds.filter(
      (id) => !exerciseIds.includes(id),
    ),
    completedLessonIds: state.completedLessonIds.filter(
      (id) => id !== lessonId,
    ),
    currentStep: state.currentLessonId === lessonId ? 0 : state.currentStep,
  };
}
