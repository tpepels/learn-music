import { describe, expect, it } from "vitest";
import {
  cloneArrangement,
  cloneAutomationSettings,
  cloneMixerSettings,
  clonePattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialMelody,
  initialMixerSettings,
  initialPattern,
  initialSynthSettings,
  initialVoicingSettings,
  type ProjectData,
} from "../music/model";
import { parseProjectFile, projectFileSchema } from "./projectFile";

function sampleProject(): ProjectData {
  return {
    bpm: 104,
    patterns: {
      A: clonePattern(initialPattern),
      B: clonePattern(initialPattern),
    },
    melody: [...initialMelody],
    chordProgression: [...initialChordProgression],
    synthSettings: { ...initialSynthSettings },
    arrangement: cloneArrangement(initialArrangement),
    mixerSettings: cloneMixerSettings(initialMixerSettings),
    automationSettings: cloneAutomationSettings(initialAutomationSettings),
    dynamicsSettings: { ...initialDynamicsSettings },
    effectsSettings: { ...initialEffectsSettings },
    voicingSettings: { inversions: [...initialVoicingSettings.inversions] },
    bassSequence: [...initialBassSequence],
  };
}

describe("PLAY / LAB project files", () => {
  it("round-trips a valid version 1 project", () => {
    const file = {
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project: sampleProject(),
    };

    expect(projectFileSchema.safeParse(file).success).toBe(true);
    expect(parseProjectFile(file)).toEqual(file.project);
  });

  it("rejects malformed or incompatible project data", () => {
    const file = {
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project: {
        ...sampleProject(),
        arrangement: [],
      },
    };

    expect(projectFileSchema.safeParse(file).success).toBe(false);
  });
});
