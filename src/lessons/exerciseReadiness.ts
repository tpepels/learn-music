export type ExerciseReadinessInput = {
  checksReady: boolean;
  completed: boolean;
  entryExerciseId: string;
  currentExerciseId: string;
  entryFingerprint: string;
  currentFingerprint: string;
};

export function isExerciseReady({
  checksReady,
  completed,
  entryExerciseId,
  currentExerciseId,
  entryFingerprint,
  currentFingerprint,
}: ExerciseReadinessInput): boolean {
  if (!checksReady) return false;
  if (completed) return true;

  return (
    entryExerciseId === currentExerciseId &&
    entryFingerprint !== currentFingerprint
  );
}
