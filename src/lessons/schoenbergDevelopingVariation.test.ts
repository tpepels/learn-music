import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_VARIATION_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudyOperationsState,
  studyVariationSequence,
} from "../music/study";
import { schoenbergDevelopingVariationLesson } from "./schoenbergDevelopingVariation";
import type { LessonContext } from "./types";

function experiment(changes: number, values: string[] = []) {
  return { changes, min: null, max: null, values };
}

function context(
  compositionStudy = initialCompositionStudyState(),
  experiments: LessonContext["experiments"] = {},
): LessonContext {
  return { compositionStudy, experiments } as LessonContext;
}

describe("Schoenberg S02 developing variation", () => {
  it("keeps rhythmic and pitch transformations tied to one source motive", () => {
    const source = studyVariationSequence("source");
    const rhythm = studyVariationSequence("rhythm");
    const intervals = studyVariationSequence("interval");

    expect(rhythm.notes.slice(0, 8)).toEqual(source.notes.slice(0, 8));
    expect(intervals.notes.slice(0, 8)).toEqual(source.notes.slice(0, 8));
    expect(rhythm.durations.slice(8)).not.toEqual(source.durations.slice(8));
    expect(intervals.notes.slice(8)).not.toEqual(source.notes.slice(8));
  });

  it("completes analysis after all five transformations are heard and classified", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_VARIATION_IDS.analyse].transformation = "displacement";

    const checks = schoenbergDevelopingVariationLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(5, ["composition-study"]),
        "study.notation": experiment(2, ["piano-roll", "degrees"]),
        "study.transformation": experiment(5, [
          "rhythm",
          "interval",
          "auxiliary",
          "reduction",
          "displacement",
        ]),
        "study.feature-answer": experiment(5, [
          "rhythm:rhythm",
          "interval:intervals",
          "auxiliary:ornamentation",
          "reduction:reduction",
          "displacement:position",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("requires comparison before settling on rhythmic and pitch motive-forms", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_VARIATION_IDS.rhythm] = {
      ...study[SCHOENBERG_VARIATION_IDS.rhythm],
      ...studyVariationSequence("rhythm"),
      transformation: "rhythm",
    };
    study[SCHOENBERG_VARIATION_IDS.intervals] = {
      ...study[SCHOENBERG_VARIATION_IDS.intervals],
      ...studyVariationSequence("auxiliary"),
      transformation: "auxiliary",
    };

    const rhythmChecks = schoenbergDevelopingVariationLesson.exercises[1].evaluate(
      context(study, {
        "transport.play": experiment(2, ["composition-study"]),
        "study.notation": experiment(2, ["staff", "piano-roll"]),
        "study.transformation": experiment(2, ["rhythm", "displacement"]),
      }),
    );
    const intervalChecks = schoenbergDevelopingVariationLesson.exercises[2].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.transformation": experiment(3, [
          "interval",
          "auxiliary",
          "reduction",
        ]),
      }),
    );

    expect(rhythmChecks.every((check) => check.complete)).toBe(true);
    expect(intervalChecks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a combined motive-form only when it remains changed and related", () => {
    const study = initialCompositionStudyState();
    let state = setStudyOperationsState(
      study[SCHOENBERG_VARIATION_IDS.compose],
      ["rhythm", "interval"],
    );
    const firstVariantNote = state.notes.findIndex(
      (note, index) => index >= 8 && note !== null,
    );
    state = {
      ...state,
      notes: state.notes.map((note, index) =>
        index === firstVariantNote && note !== null ? note + 1 : note,
      ),
    };
    study[SCHOENBERG_VARIATION_IDS.compose] = state;

    const checks = schoenbergDevelopingVariationLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(1, [firstVariantNote + ":61"]),
        "study.notation": experiment(2, ["staff", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates S01-only persisted study state and remains safe on partial state", () => {
    const oldState = {
      "schoenberg.phrase-motive.a": {
        notes: [60, 62, 64, 62],
        notation: "staff",
        selectedSteps: [0],
        decision: null,
        variant: "source",
      },
    };

    const migrated = mergeCompositionStudyState(oldState as never);
    expect(migrated[SCHOENBERG_VARIATION_IDS.analyse]).toBeDefined();
    expect(migrated["schoenberg.phrase-motive.a"].durations).toHaveLength(16);

    for (const exercise of schoenbergDevelopingVariationLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
