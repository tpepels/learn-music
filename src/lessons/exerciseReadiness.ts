export type ExerciseReadinessInput = {
  checksReady: boolean;
  completed: boolean;
};

export function isExerciseReady({
  checksReady,
  completed,
}: ExerciseReadinessInput): boolean {
  return checksReady || completed;
}
