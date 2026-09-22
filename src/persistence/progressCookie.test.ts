import { describe, expect, it } from "vitest";
import {
  decodeLearningProgress,
  encodeLearningProgress,
  type LearningProgressCookie,
} from "./progressCookie";

describe("learning progress cookie", () => {
  it("round-trips lesson and exercise progress", () => {
    const progress: LearningProgressCookie = {
      version: 1,
      currentLessonId: "harmony.voice-leading",
      exerciseIndexByLesson: {
        "rhythm.pulse-and-groove": 3,
        "harmony.voice-leading": 2,
      },
      completedExerciseIds: [
        "rhythm.pulse-and-groove.a",
        "rhythm.pulse-and-groove.b",
      ],
      completedLessonIds: ["rhythm.pulse-and-groove"],
    };

    expect(decodeLearningProgress(encodeLearningProgress(progress))).toEqual(
      progress,
    );
  });

  it("rejects malformed data", () => {
    expect(decodeLearningProgress(encodeURIComponent('{"version":2}'))).toBeNull();
    expect(decodeLearningProgress("%not-json")).toBeNull();
  });
});
