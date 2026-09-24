export type LearningProgressSnapshot = {
  currentLessonId: string;
  exerciseIndexByLesson: Record<string, number>;
  completedExerciseIds: string[];
  completedLessonIds: string[];
};

export type LessonProgressState = LearningProgressSnapshot & {
  currentStep: number;
};

export type LessonProgressDefinition = {
  id: string;
  exerciseIds: string[];
};

export function sanitizeLearningProgress(
  progress: LearningProgressSnapshot,
  lessons: LessonProgressDefinition[],
  fallbackLessonId: string,
): LearningProgressSnapshot {
  const validLessonIds = new Set(lessons.map((lesson) => lesson.id));
  const validExerciseIds = new Set(
    lessons.flatMap((lesson) => lesson.exerciseIds),
  );
  const lessonById = new Map(
    lessons.map((lesson) => [lesson.id, lesson] as const),
  );
  const safeFallback = validLessonIds.has(fallbackLessonId)
    ? fallbackLessonId
    : lessons[0]?.id ?? fallbackLessonId;
  const currentLessonId = validLessonIds.has(progress.currentLessonId)
    ? progress.currentLessonId
    : safeFallback;

  const exerciseIndexByLesson = Object.fromEntries(
    Object.entries(progress.exerciseIndexByLesson).flatMap(
      ([lessonId, index]) => {
        const lesson = lessonById.get(lessonId);
        if (!lesson) return [];

        const maxIndex = Math.max(0, lesson.exerciseIds.length - 1);
        return [[lessonId, Math.min(index, maxIndex)]];
      },
    ),
  );

  return {
    currentLessonId,
    exerciseIndexByLesson,
    completedExerciseIds: [
      ...new Set(
        progress.completedExerciseIds.filter((id) =>
          validExerciseIds.has(id),
        ),
      ),
    ],
    completedLessonIds: [
      ...new Set(
        progress.completedLessonIds.filter((id) =>
          validLessonIds.has(id),
        ),
      ),
    ],
  };
}

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
