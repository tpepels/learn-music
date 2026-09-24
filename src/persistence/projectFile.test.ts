import { describe, expect, it } from "vitest";
import {
  cloneArrangement,
  cloneAutomationSettings,
  cloneMixerSettings,
  clonePattern,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassDurations,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialGrooveFeelSettings,
  initialHarmonyDurations,
  initialHarmonySequence,
  initialInstrumentSettings,
  initialEqSettings,
  initialFormSettings,
  initialMelody,
  initialMelodyDurations,
  initialMixerSettings,
  initialPattern,
  initialReferenceMixSettings,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  type ProjectData,
} from "../music/model";
import {
  cloneHarmonicProgression,
  cloneTonalContext,
  initialHarmonicProgression,
  initialTonalContext,
} from "../music/harmony";
import { parseProjectFile, projectFileSchema } from "./projectFile";

function sampleProject(): ProjectData {
  return {
    bpm: 104,
    patterns: {
      A: clonePattern(initialPattern),
      B: clonePattern(initialPattern),
    },
    melody: [...initialMelody],
    melodyDurations: [...initialMelodyDurations],
    tonalContext: cloneTonalContext(initialTonalContext),
    harmonicProgression: cloneHarmonicProgression(initialHarmonicProgression),
    chordProgression: [...initialChordProgression],
    harmonySequence: initialHarmonySequence.map((notes) => [...notes]),
    harmonyDurations: initialHarmonyDurations.map((entry) => ({ ...entry })),
    accompanimentPattern: initialAccompanimentPattern,
    synthSettings: { ...initialSynthSettings },
    arrangement: cloneArrangement(initialArrangement),
    mixerSettings: cloneMixerSettings(initialMixerSettings),
    automationSettings: cloneAutomationSettings(initialAutomationSettings),
    dynamicsSettings: { ...initialDynamicsSettings },
    effectsSettings: { ...initialEffectsSettings },
    voicingSettings: { inversions: [...initialVoicingSettings.inversions] },
    bassSequence: [...initialBassSequence],
    bassDurations: [...initialBassDurations],
    grooveFeelSettings: {
      swing: initialGrooveFeelSettings.swing,
      velocities: {
        kick: [...initialGrooveFeelSettings.velocities.kick],
        snare: [...initialGrooveFeelSettings.velocities.snare],
        hat: [...initialGrooveFeelSettings.velocities.hat],
      },
    },
    formSettings: {
      sections: [...initialFormSettings.sections],
      roles: [...initialFormSettings.roles],
      layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
    },
    textureSettings: { ...initialTextureSettings },
    instrumentSettings: { ...initialInstrumentSettings },
    eqSettings: {
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { ...initialEqSettings.chords },
      melody: { ...initialEqSettings.melody },
    },
    saturationSettings: {
      drums: { ...initialSaturationSettings.drums },
      bass: { ...initialSaturationSettings.bass },
      chords: { ...initialSaturationSettings.chords },
      melody: { ...initialSaturationSettings.melody },
    },
    sidechainSettings: { ...initialSidechainSettings },
    stereoSettings: {
      widths: { ...initialStereoSettings.widths },
      monoAudition: initialStereoSettings.monoAudition,
      monoChecked: initialStereoSettings.monoChecked,
    },
    referenceMixSettings: {
      ...initialReferenceMixSettings,
      snapshot: null,
    },
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






  it("round-trips and defaults the instrument palette", () => {
    const project = sampleProject();
    project.instrumentSettings = {
      bassVoice: "sub",
      chordVoice: "electric",
      pianoTouch: "strong",
    };

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-23T09:00:00.000Z",
      project,
    });

    expect(parsed.instrumentSettings).toEqual(project.instrumentSettings);

    const { instrumentSettings: _instrumentSettings, ...legacyProject } =
      sampleProject();
    const legacyParsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-23T09:00:00.000Z",
      project: legacyProject,
    });

    expect(legacyParsed.instrumentSettings).toEqual(initialInstrumentSettings);
  });

  it("round-trips drawn MIDI note durations", () => {
    const project = sampleProject();
    project.melody[0] = 60;
    project.melodyDurations[0] = 4;
    project.harmonySequence[0] = [60, 64, 67];
    project.harmonyDurations[0] = { "60": 2, "64": 4, "67": 8 };
    project.bassSequence[0] = 36;
    project.bassDurations[0] = 2;

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T20:00:00.000Z",
      project,
    });

    expect(parsed.melodyDurations[0]).toBe(4);
    expect(parsed.harmonyDurations[0]).toEqual({
      "60": 2,
      "64": 4,
      "67": 8,
    });
    expect(parsed.bassDurations[0]).toBe(2);
  });

  it("defaults note durations for projects saved before duration editing", () => {
    const project = sampleProject();
    const {
      melodyDurations: _melodyDurations,
      harmonyDurations: _harmonyDurations,
      bassDurations: _bassDurations,
      ...legacyProject
    } = project;

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T20:00:00.000Z",
      project: legacyProject,
    });

    expect(parsed.melodyDurations).toEqual(initialMelodyDurations);
    expect(parsed.harmonyDurations).toEqual(initialHarmonyDurations);
    expect(parsed.bassDurations).toEqual(initialBassDurations);
  });

  it("round-trips advanced minor, seventh, and borrowed chord symbols", () => {
    const project = sampleProject();
    project.chordProgression = ["E7", "Cmaj7", "Fm", "B♭"];

    const file = {
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T15:00:00.000Z",
      project,
    };

    expect(projectFileSchema.safeParse(file).success).toBe(true);
    expect(parseProjectFile(file).chordProgression).toEqual([
      "E7",
      "Cmaj7",
      "Fm",
      "B♭",
    ]);
  });

  it("round-trips learner-written harmony notes", () => {
    const project = sampleProject();
    project.chordProgression = ["C", "F", "G", "C"];
    project.harmonySequence[0] = [48, 52, 55];
    project.harmonySequence[11] = [57];
    project.harmonySequence[20] = [59, 62];

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project,
    });

    expect(parsed.harmonySequence).toEqual(project.harmonySequence);
  });

  it("defaults the harmony piano roll to empty for older projects", () => {
    const project = sampleProject();
    const { harmonySequence: _harmonySequence, ...legacyProject } = project;

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project: legacyProject,
    });

    expect(parsed.harmonySequence).toEqual(initialHarmonySequence);
  });

  it("defaults accompaniment to block when opening an older project", () => {
    const project = sampleProject();
    const { accompanimentPattern: _accompanimentPattern, ...legacyProject } = project;

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project: legacyProject,
    });

    expect(parsed.accompanimentPattern).toBe("block");
  });

  it("defaults macro-form layers when opening an older project", () => {
    const project = sampleProject();
    const legacyProject = {
      ...project,
      formSettings: {
        sections: [...project.formSettings.sections],
        roles: [...project.formSettings.roles],
      },
    };

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project: legacyProject,
    });

    expect(parsed.formSettings.layers).toEqual(initialFormSettings.layers);
  });

  it("fills advanced-production defaults when opening a pre-1.4 project", () => {
    const project = sampleProject();
    const {
      eqSettings: _eqSettings,
      saturationSettings: _saturationSettings,
      sidechainSettings: _sidechainSettings,
      stereoSettings: _stereoSettings,
      referenceMixSettings: _referenceMixSettings,
      ...legacyProject
    } = project;

    const parsed = parseProjectFile({
      format: "play-lab-project",
      version: 1,
      exportedAt: "2026-09-22T12:00:00.000Z",
      project: legacyProject,
    });

    expect(parsed.eqSettings).toEqual(initialEqSettings);
    expect(parsed.saturationSettings).toEqual(initialSaturationSettings);
    expect(parsed.sidechainSettings).toEqual(initialSidechainSettings);
    expect(parsed.stereoSettings).toEqual(initialStereoSettings);
    expect(parsed.referenceMixSettings).toEqual({
      ...initialReferenceMixSettings,
      snapshot: null,
    });
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
