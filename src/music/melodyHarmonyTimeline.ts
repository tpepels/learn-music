export const MELODY_HARMONY_BAR_EIGHTHS = 8;
export const MELODY_HARMONY_BAR_COUNT = 4;
export const MELODY_HARMONY_PLAYBACK_EIGHTHS =
  MELODY_HARMONY_BAR_EIGHTHS * MELODY_HARMONY_BAR_COUNT;

export type MelodyHarmonyFrame = {
  playbackStep: number;
  barIndex: number;
  melodyStep: number;
  localBarStep: number;
};

export function melodyHarmonyFrame(
  playbackStep: number,
  melodyLength: number,
): MelodyHarmonyFrame {
  if (!Number.isInteger(playbackStep) || playbackStep < 0) {
    throw new Error("Playback step must be a non-negative integer");
  }
  if (!Number.isInteger(melodyLength) || melodyLength <= 0) {
    throw new Error("Melody length must be a positive integer");
  }

  return {
    playbackStep,
    barIndex: Math.floor(playbackStep / MELODY_HARMONY_BAR_EIGHTHS),
    melodyStep: playbackStep % melodyLength,
    localBarStep: playbackStep % MELODY_HARMONY_BAR_EIGHTHS,
  };
}

export function chordSlotForMelodyStep(
  melodyStep: number,
  pass: 0 | 1,
): number {
  return pass * 2 + Math.floor(melodyStep / MELODY_HARMONY_BAR_EIGHTHS);
}
