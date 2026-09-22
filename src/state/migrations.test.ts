import { describe, expect, it } from "vitest";
import { initialFormSettings } from "../music/model";
import { migrateFormSettings } from "./migrations";

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
