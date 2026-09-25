import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_VARIATION_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudyOperationsState,
  setStudyTransformationState,
  studyVariationBookSequence,
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

describe("Schoenberg S02 - The motive", () => {
  it("follows Chapter III as a source-grounded A-J sequence", () => {
    expect(schoenbergDevelopingVariationLesson.title).toBe(
      "The motive - treatment & variation",
    );
    expect(schoenbergDevelopingVariationLesson.exercises).toHaveLength(10);
    expect(
      schoenbergDevelopingVariationLesson.exercises.map(
        (exercise) => exercise.letter,
      ),
    ).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]);

    for (const exercise of schoenbergDevelopingVariationLesson.exercises) {
      expect(exercise.source?.reference).toBeTruthy();
      expect(exercise.source?.focus).toBeTruthy();
    }
  });

  it("uses the Ex. 12 note-repetition principle for motive economy", () => {
    const reduction = studyVariationBookSequence("motive");
    expect(reduction.notes.slice(0, 4)).toEqual([67, 67, 67, 63]);

    const study = initialCompositionStudyState();
    study[SCHOENBERG_VARIATION_IDS.motive].decision = "related";

    const checks = schoenbergDevelopingVariationLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(2, ["staff", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("models Ex. 14 exact transformations as relationship-preserving operations", () => {
    const source = studyVariationSequence("source");
    const inversion = studyVariationSequence("inversion");
    const retrograde = studyVariationSequence("retrograde");
    const diminution = studyVariationSequence("diminution");
    const augmentation = studyVariationSequence("augmentation");

    for (const sequence of [inversion, retrograde, diminution, augmentation]) {
      expect(sequence.notes.slice(0, 8)).toEqual(source.notes.slice(0, 8));
    }
    expect(inversion.notes.slice(8)).not.toEqual(source.notes.slice(8));
    expect(retrograde.notes.slice(8)).not.toEqual(source.notes.slice(8));
    expect(diminution.durations.slice(8)).not.toEqual(
      source.durations.slice(8),
    );
    expect(augmentation.durations.slice(8)).not.toEqual(
      source.durations.slice(8),
    );

    const study = initialCompositionStudyState();
    study[SCHOENBERG_VARIATION_IDS.exact] = setStudyTransformationState(
      study[SCHOENBERG_VARIATION_IDS.exact],
      "augmentation",
    );

    const checks = schoenbergDevelopingVariationLesson.exercises[1].evaluate(
      context(study, {
        "transport.play": experiment(4, ["composition-study"]),
        "study.notation": experiment(2, ["staff", "piano-roll"]),
        "study.transformation": experiment(4, [
          "inversion",
          "retrograde",
          "diminution",
          "augmentation",
        ]),
        "source.play": experiment(2, ["s02.ex14b", "s02.ex14c"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("grounds cumulative treatment in Examples 15-16", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_VARIATION_IDS.literature].decision = "related";

    const checks = schoenbergDevelopingVariationLesson.exercises[2].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(2, ["staff", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("separates the systematic Ex. 17-24 transformation groups", () => {
    const study = initialCompositionStudyState();

    study[SCHOENBERG_VARIATION_IDS.rhythm] = setStudyTransformationState(
      study[SCHOENBERG_VARIATION_IDS.rhythm],
      "repetition",
    );
    study[SCHOENBERG_VARIATION_IDS.intervals] = setStudyTransformationState(
      study[SCHOENBERG_VARIATION_IDS.intervals],
      "reduction",
    );
    study[SCHOENBERG_VARIATION_IDS.metric] = setStudyTransformationState(
      study[SCHOENBERG_VARIATION_IDS.metric],
      "metre",
    );

    const rhythmChecks =
      schoenbergDevelopingVariationLesson.exercises[3].evaluate(
        context(study, {
          "transport.play": experiment(2, ["composition-study"]),
          "study.transformation": experiment(2, ["rhythm", "repetition"]),
        }),
      );
    const intervalChecks =
      schoenbergDevelopingVariationLesson.exercises[4].evaluate(
        context(study, {
          "transport.play": experiment(3, ["composition-study"]),
          "study.transformation": experiment(3, [
            "auxiliary",
            "interval",
            "reduction",
          ]),
        }),
      );
    const metricChecks =
      schoenbergDevelopingVariationLesson.exercises[5].evaluate(
        context(study, {
          "transport.play": experiment(3, ["composition-study"]),
          "study.notation": experiment(2, ["staff", "piano-roll"]),
          "study.transformation": experiment(3, [
            "upbeat",
            "displacement",
            "metre",
          ]),
        }),
      );

    expect(rhythmChecks.every((check) => check.complete)).toBe(true);
    expect(intervalChecks.every((check) => check.complete)).toBe(true);
    expect(metricChecks.every((check) => check.complete)).toBe(true);
  });

  it("keeps Examples 25-29 as harmonic and contextual adaptation studies", () => {
    const study = initialCompositionStudyState();
    const sourceIds = [
      SCHOENBERG_VARIATION_IDS.harmony,
      SCHOENBERG_VARIATION_IDS.substitution,
      SCHOENBERG_VARIATION_IDS.adaptation,
    ];
    sourceIds.forEach((id) => {
      study[id].decision = "related";
    });

    const shared = {
      "transport.play": experiment(1, ["composition-study"]),
      "study.notation": experiment(2, ["staff", "degrees"]),
    };

    for (let index = 6; index <= 8; index += 1) {
      const checks = schoenbergDevelopingVariationLesson.exercises[index].evaluate(
        context(study, shared),
      );
      expect(
        checks.every((check) => check.complete),
        schoenbergDevelopingVariationLesson.exercises[index].id,
      ).toBe(true);
    }

    expect(studyVariationBookSequence("harmony").harmony?.[0]).toBe("I");
    expect(studyVariationBookSequence("substitution").harmony?.[4]).toBe("V");
    expect(studyVariationBookSequence("adaptation").harmony?.[12]).toBe("V");
  });

  it("accepts a cumulative broken-chord variation study only when it changes and remains related", () => {
    const study = initialCompositionStudyState();
    let state = setStudyOperationsState(
      study[SCHOENBERG_VARIATION_IDS.compose],
      ["rhythm", "interval", "transposition"],
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

    const checks = schoenbergDevelopingVariationLesson.exercises[9].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(1, [firstVariantNote + ":63"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates older study state and remains safe on partial state", () => {
    const oldState = {
      "schoenberg.developing-variation.a": {
        notes: [60, 62, 64, 62],
        notation: "staff",
        selectedSteps: [],
        decision: null,
        variant: "source",
      },
    };

    const migrated = mergeCompositionStudyState(oldState as never);
    expect(migrated[SCHOENBERG_VARIATION_IDS.motive]).toBeDefined();
    expect(migrated[SCHOENBERG_VARIATION_IDS.compose]).toBeDefined();

    for (const exercise of schoenbergDevelopingVariationLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
