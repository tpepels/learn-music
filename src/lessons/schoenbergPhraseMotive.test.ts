import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_STUDY_IDS,
  initialCompositionStudyState,
  studyBlocksAreRelated,
} from "../music/study";
import {
  getNextImplementedLesson,
  learningTracks,
  playLabLessons,
  schoenbergLessons,
} from "./course";
import { schoenbergPhraseMotiveLesson } from "./schoenbergPhraseMotive";
import type { LessonContext } from "./types";

function experiment(
  changes: number,
  values: string[] = [],
) {
  return { changes, min: null, max: null, values };
}

function context(
  compositionStudy = initialCompositionStudyState(),
  experiments: LessonContext["experiments"] = {},
): LessonContext {
  return {
    compositionStudy,
    experiments,
  } as LessonContext;
}

describe("Schoenberg learning track", () => {
  it("keeps the composition course separate from the existing PLAY / LAB course", () => {
    expect(playLabLessons).toHaveLength(37);
    expect(schoenbergLessons).toEqual([schoenbergPhraseMotiveLesson]);
    expect(learningTracks.map((track) => track.id)).toEqual([
      "play-lab",
      "schoenberg",
    ]);
    expect(getNextImplementedLesson(playLabLessons.at(-1)!.id)).toBeUndefined();
    expect(
      getNextImplementedLesson(schoenbergPhraseMotiveLesson.id),
    ).toBeUndefined();
  });

  it("recognises motive analysis after listening, marking, and changing notation", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_STUDY_IDS.analyse].selectedSteps = [0, 1, 2, 3];

    const checks = schoenbergPhraseMotiveLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(1, ["piano-roll"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("requires comparison of exact, related, and unrelated motive-forms", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_STUDY_IDS.compare].decision = "related";

    const checks = schoenbergPhraseMotiveLesson.exercises[1].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.variant": experiment(3, ["exact", "related", "unrelated"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a transformed continuation but not an arbitrary one", () => {
    const related = [
      60, 62, 65, 64,
      62, 64, 67, 66,
    ];
    const unrelated = [
      60, 62, 65, 64,
      67, 60, 58, 65,
    ];

    expect(studyBlocksAreRelated(related)).toBe(true);
    expect(studyBlocksAreRelated(unrelated)).toBe(false);

    const study = initialCompositionStudyState();
    study[SCHOENBERG_STUDY_IDS.repair].notes = [
      ...related,
      null, null, null, null, null, null, null, null,
    ];

    const checks = schoenbergPhraseMotiveLesson.exercises[2].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(3, ["4:62", "5:64", "6:67"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("keeps fresh and partial study state safe", () => {
    for (const exercise of schoenbergPhraseMotiveLesson.exercises) {
      expect(() =>
        exercise.evaluate(context({})),
      ).not.toThrow();
    }
  });
});
