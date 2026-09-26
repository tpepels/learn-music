import { describe, expect, it } from "vitest";
import { playLabLessons } from "../lessons/course";
import {
  playbackModeForWorkspace,
  workspacePlaybackModes,
  workspaceRequiresPatternA,
} from "./workspacePlaybackPolicy";

describe("workspace playback wiring", () => {
  it("gives every Music & Production exercise an explicit playback route", () => {
    for (const exercise of playLabLessons.flatMap((lesson) => lesson.exercises)) {
      expect(
        workspacePlaybackModes[exercise.workspace],
        exercise.id + " has no playback wiring",
      ).toBeDefined();
    }
  });

  it("uses contextual sources where skipped earlier work would otherwise make controls dead", () => {
    expect(playbackModeForWorkspace("groove-feel")).toBe("context-drums");
    expect(playbackModeForWorkspace("voicing")).toBe("voicing-context");
    expect(playbackModeForWorkspace("texture")).toBe("texture-context");
    expect(playbackModeForWorkspace("final-project")).toBe("context-arrangement");
  });

  it("keeps processor lessons on the guaranteed full production audition mix", () => {
    for (const workspace of [
      "mixer",
      "automation-dynamics",
      "effects",
      "eq",
      "saturation",
      "sidechain",
      "stereo",
      "reference",
      "instrument-palette",
    ] as const) {
      expect(playbackModeForWorkspace(workspace)).toBe("production-mix");
    }
  });

  it("keeps Pattern A canonical outside the explicit A/B comparison", () => {
    expect(workspaceRequiresPatternA("drums")).toBe(true);
    expect(workspaceRequiresPatternA("groove-feel")).toBe(true);
    expect(workspaceRequiresPatternA("sidechain")).toBe(true);
    expect(workspaceRequiresPatternA("compare")).toBe(false);
    expect(workspaceRequiresPatternA("bass")).toBe(false);
  });
});
