import { describe, expect, it } from "vitest";
import {
  initialArrangement,
  initialAutomationSettings,
  initialEffectsSettings,
  initialMixerSettings,
  initialStereoSettings,
} from "../music/model";
import {
  LESSON_FIVE_ID,
  LESSON_FIVE_RECOVERY_PITCH_CLASSES,
  RECOVERED_EXERCISE_IDS,
  RECOVERED_LESSON_IDS,
  buildLessonFiveRecoveryProject,
  lessonFiveRecoveryProject,
} from "./catchUp";

describe("lesson five recovery project", () => {
  it("restores all four prerequisite lessons and their exercises", () => {
    expect(LESSON_FIVE_ID).toBe("sound.synthesis");
    expect(RECOVERED_LESSON_IDS).toHaveLength(4);
    expect(RECOVERED_EXERCISE_IDS).toHaveLength(16);
  });

  it("contains a complete groove and a distinct variation", () => {
    const { A, B } = lessonFiveRecoveryProject.patterns;

    expect([0, 4, 8, 12].every((step) => A.kick[step])).toBe(true);
    expect(A.snare[4] && A.snare[12]).toBe(true);
    expect(A.hat.filter(Boolean)).toHaveLength(8);
    expect(B).not.toEqual(A);
  });

  it("contains the melodic and harmonic material lesson five expects", () => {
    const project = lessonFiveRecoveryProject;

    expect(project.melody).toHaveLength(16);
    expect(project.melody.at(-1)).toBe(60);
    expect(project.chordProgression).toEqual(["C", "F", "G", "C"]);
    expect(project.harmonySequence).toHaveLength(32);
    expect(project.harmonySequence.filter((notes) => notes.length > 0).length)
      .toBeGreaterThanOrEqual(12);
    expect(LESSON_FIVE_RECOVERY_PITCH_CLASSES).toEqual([
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B",
    ]);
  });

  it("resets later production state instead of carrying it into lesson five", () => {
    const project = buildLessonFiveRecoveryProject();

    expect(project.arrangement).toEqual(initialArrangement);
    expect(project.mixerSettings).toEqual(initialMixerSettings);
    expect(project.automationSettings).toEqual(initialAutomationSettings);
    expect(project.effectsSettings).toEqual(initialEffectsSettings);
    expect(project.stereoSettings).toEqual(initialStereoSettings);
  });

  it("returns fresh nested project data on every recovery", () => {
    const first = buildLessonFiveRecoveryProject();
    const second = buildLessonFiveRecoveryProject();

    first.arrangement[0].drums = true;
    first.mixerSettings.chords.reverb = 0.5;
    first.automationSettings.melodyVolumeDb[0] = -12;

    expect(second.arrangement[0].drums).toBe(false);
    expect(second.mixerSettings.chords.reverb).toBe(
      initialMixerSettings.chords.reverb,
    );
    expect(second.automationSettings.melodyVolumeDb[0]).toBe(
      initialAutomationSettings.melodyVolumeDb[0],
    );
  });
});
