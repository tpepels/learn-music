import { describe, expect, it } from "vitest";
import {
  initialFormSettings,
  initialGrooveFeelSettings,
} from "../music/model";
import {
  migrateFormSettings,
  migrateGrooveFeelSettings,
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
