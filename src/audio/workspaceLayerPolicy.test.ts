import { describe, expect, it } from "vitest";
import { playLabLessons } from "../lessons/course";
import {
  playbackLayersForWorkspace,
  productionAuditionWorkspaces,
} from "./workspaceLayerPolicy";

const intentionallySingleLayer = new Set([
  "drums",
  "compare",
  "piano-key",
  "synth",
  "groove-feel",
  "chords",
  "voicing",
  "composition-study",
]);

describe("Music & Production layer audibility contract", () => {
  it("classifies every multi-layer exercise in the complete track", () => {
    const exercises = playLabLessons.flatMap((lesson) => lesson.exercises);

    expect(exercises).toHaveLength(148);

    for (const exercise of exercises) {
      if (intentionallySingleLayer.has(exercise.workspace)) {
        expect(playbackLayersForWorkspace(exercise.workspace).length)
          .toBeLessThanOrEqual(1);
        continue;
      }

      expect(
        playbackLayersForWorkspace(exercise.workspace).length,
        exercise.id + " (" + exercise.workspace + ") must be genuinely multi-layer",
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses all four independent mixer layers in processor/audition workspaces", () => {
    for (const workspace of productionAuditionWorkspaces) {
      expect(playbackLayersForWorkspace(workspace)).toEqual([
        "drums",
        "bass",
        "chords",
        "melody",
      ]);
    }
  });

  it("does not classify deliberate arrangement/form silence as a missing source", () => {
    expect(playbackLayersForWorkspace("arrangement")).toEqual([
      "drums",
      "bass",
      "chords",
      "melody",
    ]);
    expect(playbackLayersForWorkspace("phrase-form")).toEqual([
      "drums",
      "bass",
      "chords",
      "melody",
    ]);
    expect(playbackLayersForWorkspace("texture")).toEqual([
      "drums",
      "bass",
      "chords",
      "melody",
    ]);
    expect(playbackLayersForWorkspace("final-project")).toEqual([
      "drums",
      "bass",
      "chords",
      "melody",
    ]);
  });
});
