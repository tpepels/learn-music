import {
  cloneStereoSettings,
  initialEffectsSettings,
  initialMixerSettings,
  initialStereoSettings,
  mixerTrackIds,
  type EffectsSettings,
  type MixerSettings,
  type StereoSettings,
} from "../music/model";

export function resetEffectsWorkspaceState(
  mixerSettings: MixerSettings,
): {
  mixerSettings: MixerSettings;
  effectsSettings: EffectsSettings;
} {
  return {
    mixerSettings: {
      ...mixerSettings,
      chords: {
        ...mixerSettings.chords,
        reverb: initialMixerSettings.chords.reverb,
      },
      melody: {
        ...mixerSettings.melody,
        delay: initialMixerSettings.melody.delay,
      },
    },
    effectsSettings: { ...initialEffectsSettings },
  };
}

export function resetStereoWorkspaceState(
  mixerSettings: MixerSettings,
): {
  mixerSettings: MixerSettings;
  stereoSettings: StereoSettings;
} {
  return {
    mixerSettings: Object.fromEntries(
      mixerTrackIds.map((track) => [
        track,
        {
          ...mixerSettings[track],
          pan: initialMixerSettings[track].pan,
        },
      ]),
    ) as MixerSettings,
    stereoSettings: cloneStereoSettings(initialStereoSettings),
  };
}
