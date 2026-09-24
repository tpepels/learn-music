import type { ExerciseExperiments } from "../music/model";

export function heardPlayback(experiments: ExerciseExperiments): boolean {
  return (experiments["transport.play"]?.changes ?? 0) >= 1;
}

export function heardSourceExample(
  experiments: ExerciseExperiments,
  exampleId: string,
): boolean {
  return (experiments["source-score.play"]?.values ?? []).includes(exampleId);
}

export function inspectedSourceSegment(
  experiments: ExerciseExperiments,
  exampleId: string,
  segmentId: string,
): boolean {
  return (experiments["source-score.segment"]?.values ?? []).includes(
    exampleId + ":" + segmentId,
  );
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
