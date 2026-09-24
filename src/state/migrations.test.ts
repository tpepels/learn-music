import { describe, expect, it } from "vitest";
import {
  ARRANGEMENT_BARS,
  MELODY_STEPS,
  STEPS,
  initialAutomationSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialInstrumentSettings,
  initialMixerSettings,
  initialStereoSettings,
  initialTextureSettings,
} from "../music/model";
import {
  migrateFormSettings,
  migrateGrooveFeelSettings,
  migratePersistedStudioState,
} from "./migrations";

describe("persisted form-state migration", () => {
  it("repairs v1.9 form settings that do not contain layer plans", () => {
    const migrated = migrateFormSettings({
      sections: ["A", "A′", "B", "A"],
      roles: ["statement", "answer", "contrast", "return"],
    });

    expect(migrated.sections).toEqual(["A", "A′", "B", "A"]);
    expect(migrated.roles).toEqual(["statement", "answer", "contrast", "return"]);
    expect(migrated.layers).toEqual(initialFormSettings.layers);
    expect(migrated.layers).not.toBe(initialFormSettings.layers);
  });

  it("preserves valid persisted layer choices", () => {
    const layers = [
      { drums: true, bass: false, chords: false, melody: false },
      { drums: true, bass: true, chords: false, melody: false },
      { drums: true, bass: true, chords: true, melody: true },
      { drums: true, bass: false, chords: true, melody: true },
    ];

    const migrated = migrateFormSettings({
      sections: ["A", "A′", "B", "A"],
      roles: ["statement", "answer", "contrast", "return"],
      layers,
    });

    expect(migrated.layers).toEqual(layers);
  });

  it("falls back safely when persisted nested form data is malformed", () => {
    const migrated = migrateFormSettings({
      sections: ["A"],
      roles: null,
      layers: [{ drums: "yes" }],
    });

    expect(migrated).toEqual({
      sections: initialFormSettings.sections,
      roles: initialFormSettings.roles,
      layers: initialFormSettings.layers,
    });
  });
});


describe("persisted groove-state migration", () => {
  it("repairs legacy groove settings that contain swing but no velocity lanes", () => {
    const migrated = migrateGrooveFeelSettings({ swing: 0.18 });

    expect(migrated.swing).toBe(0.18);
    expect(migrated.velocities).toEqual(initialGrooveFeelSettings.velocities);
    expect(migrated.velocities.kick).not.toBe(
      initialGrooveFeelSettings.velocities.kick,
    );
  });

  it("preserves valid velocity values and fills missing entries from defaults", () => {
    const migrated = migrateGrooveFeelSettings({
      swing: 0.12,
      velocities: {
        kick: [0.5, 0.6],
        snare: [0.3],
      },
    });

    expect(migrated.velocities.kick[0]).toBe(0.5);
    expect(migrated.velocities.kick[1]).toBe(0.6);
    expect(migrated.velocities.kick[2]).toBe(
      initialGrooveFeelSettings.velocities.kick[2],
    );
    expect(migrated.velocities.snare[0]).toBe(0.3);
    expect(migrated.velocities.hat).toEqual(
      initialGrooveFeelSettings.velocities.hat,
    );
  });

  it("falls back safely from malformed persisted groove data", () => {
    expect(
      migrateGrooveFeelSettings({
        swing: "lots",
        velocities: {
          kick: null,
          snare: ["loud"],
          hat: {},
        },
      }),
    ).toEqual(initialGrooveFeelSettings);
  });
});


describe("persisted studio-state migration", () => {
  it("repairs short legacy lanes without discarding valid saved values", () => {
    const migrated = migratePersistedStudioState({
      patterns: {
        A: {
          kick: [true, false],
          snare: [false],
          hat: [],
        },
      },
      melody: [60, 62, 64, 65, 67, 69, 71, 72],
      arrangement: [
        { drums: true, bass: false, chords: false, melody: false },
        { drums: true, bass: true, chords: false, melody: false },
        { drums: true, bass: true, chords: true, melody: false },
        { drums: true, bass: true, chords: true, melody: true },
      ],
      automationSettings: {
        melodyVolumeDb: [-12, -9, -6, -3],
      },
    });

    expect(migrated.patterns.A.kick).toHaveLength(STEPS);
    expect(migrated.patterns.A.kick.slice(0, 2)).toEqual([true, false]);
    expect(migrated.melody).toHaveLength(MELODY_STEPS);
    expect(migrated.melody.slice(0, 8)).toEqual([
      60, 62, 64, 65, 67, 69, 71, 72,
    ]);
    expect(migrated.arrangement).toHaveLength(ARRANGEMENT_BARS);
    expect(migrated.arrangement[3].melody).toBe(true);
    expect(migrated.arrangement[7]).toEqual({
      drums: false,
      bass: false,
      chords: false,
      melody: false,
    });
    expect(migrated.automationSettings.melodyVolumeDb).toEqual([
      -12, -9, -6, -3, 0, 0, 0, 0,
    ]);
    expect(migrated.automationSettings.chordFilterHz).toEqual(
      initialAutomationSettings.chordFilterHz,
    );
  });

  it("fills missing nested production fields from defaults", () => {
    const migrated = migratePersistedStudioState({
      mixerSettings: {
        melody: {
          volume: -4,
        },
      },
      textureSettings: {
        melodyOctave: 1,
      },
      instrumentSettings: {
        chordVoice: "pad",
      },
      eqSettings: {
        chords: {
          gain: -3,
        },
      },
      stereoSettings: {
        widths: {
          melody: 0.9,
        },
      },
    });

    expect(migrated.mixerSettings.melody.volume).toBe(-4);
    expect(migrated.mixerSettings.melody.pan).toBe(
      initialMixerSettings.melody.pan,
    );
    expect(migrated.mixerSettings.drums).toEqual(initialMixerSettings.drums);

    expect(migrated.textureSettings).toEqual({
      ...initialTextureSettings,
      melodyOctave: 1,
    });
    expect(migrated.instrumentSettings).toEqual({
      ...initialInstrumentSettings,
      chordVoice: "pad",
    });

    expect(migrated.eqSettings.chords.gain).toBe(-3);
    expect(migrated.eqSettings.chords.frequency).toBe(
      initialEqSettings.chords.frequency,
    );
    expect(migrated.eqSettings.melody).toEqual(initialEqSettings.melody);

    expect(migrated.stereoSettings.widths.melody).toBe(0.9);
    expect(migrated.stereoSettings.widths.drums).toBe(
      initialStereoSettings.widths.drums,
    );
    expect(migrated.stereoSettings.monoAudition).toBe(
      initialStereoSettings.monoAudition,
    );
  });

  it("repairs partial reference snapshots instead of hydrating unsafe nested objects", () => {
    const migrated = migratePersistedStudioState({
      referenceMixSettings: {
        snapshot: {
          mixerSettings: {
            melody: { volume: -7 },
          },
          stereoWidths: {
            melody: 0.75,
          },
        },
        trimDb: -2,
      },
    });

    expect(migrated.referenceMixSettings.trimDb).toBe(-2);
    expect(migrated.referenceMixSettings.snapshot).not.toBeNull();
    expect(
      migrated.referenceMixSettings.snapshot?.mixerSettings.melody.volume,
    ).toBe(-7);
    expect(
      migrated.referenceMixSettings.snapshot?.mixerSettings.melody.highpass,
    ).toBe(initialMixerSettings.melody.highpass);
    expect(
      migrated.referenceMixSettings.snapshot?.stereoWidths.melody,
    ).toBe(0.75);
    expect(
      migrated.referenceMixSettings.snapshot?.stereoWidths.bass,
    ).toBe(initialStereoSettings.widths.bass);
  });
});
