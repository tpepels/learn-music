import { describe, expect, it } from "vitest";
import {
  applyLearningFocusVolume,
  shouldMuteLearningContext,
} from "./learningFocus";

describe("learning audio focus", () => {
  it("keeps mixer faders authoritative even when a lesson has a focus track", () => {
    expect(applyLearningFocusVolume(4, "drums", "bass")).toBe(4);
    expect(applyLearningFocusVolume(-18, "melody", "melody")).toBe(-18);
    expect(applyLearningFocusVolume(-7.5, "chords", null)).toBe(-7.5);
  });

  it("mutes only context layers when the explicit mute action is enabled", () => {
    expect(shouldMuteLearningContext("drums", "bass", true)).toBe(true);
    expect(shouldMuteLearningContext("chords", "bass", true)).toBe(true);
    expect(shouldMuteLearningContext("bass", "bass", true)).toBe(false);
    expect(shouldMuteLearningContext("drums", "bass", false)).toBe(false);
    expect(shouldMuteLearningContext("drums", null, true)).toBe(false);
  });
});
