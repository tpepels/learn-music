import { describe, expect, it } from "vitest";
import {
  dawStages,
  getDawCheckpoint,
  getDawStageFamiliarity,
  getDawTransfer,
  getPlayLabRepresentation,
} from "./dawTransfer";
import type { ExerciseDefinition } from "../lessons/types";

const workspaces: ExerciseDefinition["workspace"][] = [
  "drums",
  "compare",
  "piano-key",
  "melody",
  "chords",
  "harmony-song",
  "synth",
  "arrangement",
  "mixer",
  "automation-dynamics",
  "effects",
  "final-project",
  "voicing",
  "bass",
  "groove-feel",
  "motif",
  "melody-harmony",
  "harmonic-function",
  "phrase-form",
  "texture",
  "eq",
  "saturation",
  "sidechain",
  "stereo",
  "reference",
  "minor-key",
  "harmonic-minor",
  "minor-harmony",
  "seventh-harmony",
  "borrowed-harmony",
  "instrument-palette",
];

describe("DAW transfer teaching", () => {
  it("covers every lesson workspace with a complete mental model", () => {
    for (const workspace of workspaces) {
      const profile = getDawTransfer(workspace);

      expect(profile.concept.length).toBeGreaterThan(35);
      expect(profile.changes.length).toBeGreaterThan(35);
      expect(profile.dawLocation.length).toBeGreaterThan(35);
      expect(profile.whyItMatters.length).toBeGreaterThan(35);
      expect(profile.pitfall.length).toBeGreaterThan(35);
      expect(profile.vocabulary.length).toBeGreaterThanOrEqual(4);
      expect(getPlayLabRepresentation(workspace).length).toBeGreaterThan(45);
      expect(dawStages.some((stage) => stage.id === profile.stage)).toBe(true);
    }
  });

  it("places explicit DAW-reading checkpoints through the course", () => {
    expect(getDawCheckpoint(5)?.title).toContain("piano roll");
    expect(getDawCheckpoint(10)?.title).toContain("project screen");
    expect(getDawCheckpoint(29)?.title).toContain("real DAW");
    expect(getDawCheckpoint(4)).toBeUndefined();
    expect(getDawCheckpoint(11)).toBeUndefined();
  });

  it("reveals the DAW architecture progressively", () => {
    expect(getDawStageFamiliarity("notes", "notes", 3)).toBe("current");
    expect(getDawStageFamiliarity("timeline", "notes", 3)).toBe("familiar");
    expect(getDawStageFamiliarity("instrument", "notes", 3)).toBe("upcoming");
    expect(getDawStageFamiliarity("effects", "instrument", 5)).toBe("upcoming");
    expect(getDawStageFamiliarity("mixer", "effects", 7)).toBe("familiar");
    expect(getDawStageFamiliarity("master", "timeline", 10)).toBe("familiar");
  });
});
