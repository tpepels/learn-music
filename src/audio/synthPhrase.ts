import type { MelodySequence, NoteDurationLane } from "../music/model";

export type SynthPhraseEvent = {
  midi: number;
  step: number;
  durationSteps: number;
};

export function getSynthPhraseEvents(
  melody: MelodySequence,
  durations: NoteDurationLane,
): SynthPhraseEvent[] {
  return melody.flatMap((midi, step) =>
    midi === null
      ? []
      : [
          {
            midi,
            step,
            durationSteps: durations[step] ?? 1,
          },
        ],
  );
}
