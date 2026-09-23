import type { MixerTrackId } from "../music/model";

export const LEARNING_FOCUS_FLOOR_DB = -3;
export const LEARNING_CONTEXT_CEILING_DB = -9;

export function applyLearningFocusVolume(
  baseVolumeDb: number,
  track: MixerTrackId,
  focusTrack: MixerTrackId | null,
): number {
  if (focusTrack === null) return baseVolumeDb;

  if (track === focusTrack) {
    return Math.max(baseVolumeDb, LEARNING_FOCUS_FLOOR_DB);
  }

  return Math.min(baseVolumeDb, LEARNING_CONTEXT_CEILING_DB);
}
