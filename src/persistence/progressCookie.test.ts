import { describe, expect, it } from "vitest";
import {
  decodeLearningProgress,
  encodeLearningProgress,
  type LearningProgressCookie,
} from "./progressCookie";

describe("learning progress cookie", () => {
  it("round-trips lesson and exercise progress using the compact v2 format", () => {
    const progress: LearningProgressCookie = {
      version: 2,
      currentLessonId: "harmony.voice-leading",
      exerciseIndexByLesson: {
        "rhythm.pulse-and-groove": 3,
        "harmony.voice-leading": 2,
      },
      completedExerciseIds: [
        "rhythm.pulse-and-groove.a",
        "rhythm.pulse-and-groove.b",
        "harmony.voice-leading.a",
        "schoenberg.phrase-motive.e",
        "schoenberg.phrase-motive.j",
        "schoenberg.completing-sentence.k",
        "schoenberg.completing-sentence.l",
      ],
      completedLessonIds: ["rhythm.pulse-and-groove"],
    };

    const encoded = encodeLearningProgress(progress);

    expect(decodeLearningProgress(encoded)).toEqual(progress);
    expect(decodeURIComponent(encoded)).toContain('"v":2');
    expect(decodeURIComponent(encoded)).not.toContain(
      "rhythm.pulse-and-groove.a",
    );
  });

  it("migrates the original verbose v1 cookie", () => {
    const legacy = {
      version: 1,
      currentLessonId: "pitch.melody",
      exerciseIndexByLesson: { "pitch.melody": 1 },
      completedExerciseIds: ["pitch.melody.a"],
      completedLessonIds: [],
    };

    expect(
      decodeLearningProgress(encodeURIComponent(JSON.stringify(legacy))),
    ).toEqual({
      version: 2,
      currentLessonId: "pitch.melody",
      exerciseIndexByLesson: { "pitch.melody": 1 },
      completedExerciseIds: ["pitch.melody.a"],
      completedLessonIds: [],
    });
  });

  it("rejects malformed data", () => {
    expect(decodeLearningProgress(encodeURIComponent('{"v":3}'))).toBeNull();
    expect(decodeLearningProgress("%not-json")).toBeNull();
  });
});
