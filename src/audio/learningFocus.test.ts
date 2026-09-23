import { describe, expect, it } from "vitest";
import {
  LEARNING_CONTEXT_CEILING_DB,
  LEARNING_FOCUS_FLOOR_DB,
  applyLearningFocusVolume,
  shouldMuteLearningContext,
} from "./learningFocus";

describe("learning audio focus", () => {
  it("leaves the project mixer untouched when learning focus is disabled", () => {
    expect(applyLearningFocusVolume(4, "drums", null)).toBe(4);
    expect(applyLearningFocusVolume(-18, "melody", null)).toBe(-18);
  });

  it("raises a quiet focused layer to a useful foreground floor", () => {
    expect(applyLearningFocusVolume(-18, "bass", "bass")).toBe(
      LEARNING_FOCUS_FLOOR_DB,
    );
  });

  it("does not turn down a focused layer that is already louder than the floor", () => {
    expect(applyLearningFocusVolume(1, "melody", "melody")).toBe(1);
  });

  it("caps context layers below the focused layer without raising already quiet context", () => {
    expect(applyLearningFocusVolume(4, "drums", "bass")).toBe(
      LEARNING_CONTEXT_CEILING_DB,
    );
    expect(applyLearningFocusVolume(-16, "chords", "bass")).toBe(-16);
  });

  it("mutes only earlier context when Solo current is enabled", () => {
    expect(shouldMuteLearningContext("drums", "bass", true)).toBe(true);
    expect(shouldMuteLearningContext("chords", "bass", true)).toBe(true);
    expect(shouldMuteLearningContext("bass", "bass", true)).toBe(false);
    expect(shouldMuteLearningContext("drums", "bass", false)).toBe(false);
    expect(shouldMuteLearningContext("drums", null, true)).toBe(false);
  });
});
