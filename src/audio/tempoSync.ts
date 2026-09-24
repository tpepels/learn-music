import { eighthNoteSeconds } from "./synthPhrase";

export type RampableDelayTime = {
  rampTo: (value: number, rampTime: number) => unknown;
};

export function syncEighthNoteDelay(
  delayTime: RampableDelayTime,
  bpm: number,
  rampTime = 0.05,
): number {
  const seconds = eighthNoteSeconds(bpm);
  delayTime.rampTo(seconds, rampTime);
  return seconds;
}
