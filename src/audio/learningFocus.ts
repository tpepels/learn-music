import type { MixerTrackId } from "../music/model";

/**
 * Learning focus now controls only the explicit "Mute earlier parts" action.
 * Layer faders must always describe the level the learner actually hears.
 */
export function applyLearningFocusVolume(
  baseVolumeDb: number,
  _track: MixerTrackId,
  _focusTrack: MixerTrackId | null,
): number {
  return baseVolumeDb;
}

export function shouldMuteLearningContext(
  track: MixerTrackId,
  focusTrack: MixerTrackId | null,
  soloCurrent: boolean,
): boolean {
  return soloCurrent && focusTrack !== null && track !== focusTrack;
}
