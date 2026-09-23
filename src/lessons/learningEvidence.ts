import type { ExerciseExperiments } from "../music/model";

export function heardPlayback(experiments: ExerciseExperiments): boolean {
  return (experiments["transport.play"]?.changes ?? 0) >= 1;
}

export function changedControl(
  experiments: ExerciseExperiments,
  key: string,
  minimumChanges = 1,
): boolean {
  return (experiments[key]?.changes ?? 0) >= minimumChanges;
}

export function comparedValues(
  experiments: ExerciseExperiments,
  key: string,
  minimumValues = 2,
): boolean {
  return (experiments[key]?.values.length ?? 0) >= minimumValues;
}
