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


export function changedRange(
  experiments: ExerciseExperiments,
  key: string,
  minimumRange: number,
): boolean {
  const experiment = experiments[key];
  const min = experiment?.min;
  const max = experiment?.max;

  return min != null && max != null && max - min >= minimumRange;
}


export function studiedSource(
  experiments: ExerciseExperiments,
  sourceId: string,
): boolean {
  const played = experiments["source.play"]?.values ?? [];
  const analysed = experiments["source.analysis"]?.values ?? [];
  const auditioned = experiments["source.note"]?.values ?? [];

  return (
    played.includes(sourceId) ||
    analysed.some((value) => value.startsWith(sourceId + ":")) ||
    auditioned.some((value) => value.startsWith(sourceId + ":"))
  );
}
