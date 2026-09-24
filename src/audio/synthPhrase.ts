import type { MelodySequence, NoteDurationLane } from "../music/model";

export type SynthPhraseEvent = {
  midi: number;
  step: number;
  durationSteps: number;
};

export type ScheduledSynthPhraseEvent = SynthPhraseEvent & {
  startSeconds: number;
  durationSeconds: number;
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

export function eighthNoteSeconds(bpm: number): number {
  if (!Number.isFinite(bpm) || bpm <= 0) {
    throw new Error("BPM must be a positive finite number");
  }

  return 30 / bpm;
}

export function getSynthPhraseSchedule(
  melody: MelodySequence,
  durations: NoteDurationLane,
  bpm: number,
): ScheduledSynthPhraseEvent[] {
  const eighth = eighthNoteSeconds(bpm);

  return getSynthPhraseEvents(melody, durations).map((event) => ({
    ...event,
    startSeconds: event.step * eighth,
    durationSeconds: Math.max(1, event.durationSteps) * eighth,
  }));
}
