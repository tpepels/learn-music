import { describe, expect, it } from "vitest";
import {
  initialEffectsSettings,
  initialMixerSettings,
  initialStereoSettings,
  type MixerSettings,
} from "../music/model";
import {
  resetEffectsWorkspaceState,
  resetStereoWorkspaceState,
} from "./workspaceReset";

function changedMixer(): MixerSettings {
  return {
    drums: { ...initialMixerSettings.drums, volume: -4, pan: -0.3 },
    bass: { ...initialMixerSettings.bass, volume: -5, pan: 0.2 },
    chords: {
      ...initialMixerSettings.chords,
      volume: -6,
      pan: -0.45,
      reverb: 0.28,
    },
    melody: {
      ...initialMixerSettings.melody,
      volume: -3,
      pan: 0.5,
      delay: 0.17,
    },
  };
}

describe("workspace reset semantics", () => {
  it("resets effect controls and owned sends without wiping the rest of the mix", () => {
    const before = changedMixer();
    const reset = resetEffectsWorkspaceState(before);

    expect(reset.effectsSettings).toEqual(initialEffectsSettings);
    expect(reset.mixerSettings.chords.reverb).toBe(
      initialMixerSettings.chords.reverb,
    );
    expect(reset.mixerSettings.melody.delay).toBe(
      initialMixerSettings.melody.delay,
    );
    expect(reset.mixerSettings.chords.volume).toBe(before.chords.volume);
    expect(reset.mixerSettings.chords.pan).toBe(before.chords.pan);
    expect(reset.mixerSettings.melody.volume).toBe(before.melody.volume);
  });

  it("resets pan and width owned by stereo without wiping mixer levels or sends", () => {
    const before = changedMixer();
    const reset = resetStereoWorkspaceState(before);

    expect(reset.stereoSettings).toEqual(initialStereoSettings);
    expect(reset.mixerSettings.drums.pan).toBe(0);
    expect(reset.mixerSettings.bass.pan).toBe(0);
    expect(reset.mixerSettings.chords.pan).toBe(0);
    expect(reset.mixerSettings.melody.pan).toBe(0);
    expect(reset.mixerSettings.chords.volume).toBe(before.chords.volume);
    expect(reset.mixerSettings.chords.reverb).toBe(before.chords.reverb);
    expect(reset.mixerSettings.melody.delay).toBe(before.melody.delay);
  });
});
