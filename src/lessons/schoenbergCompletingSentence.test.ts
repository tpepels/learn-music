import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_COMPLETION_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudyCompletionModeState,
  setStudyCompletionSourceStepState,
  studyCompletionHasCadence,
  studyCompletionHasDevelopment,
  studyCompletionHasLiquidation,
  studyCompletionHasSequence,
  studyCompletionSequence,
} from "../music/study";
import { schoenbergCompletingSentenceLesson } from "./schoenbergCompletingSentence";
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

function sourceVisits(id: string, count: number) {
  return Array.from({ length: count }, (_, index) => id + ":" + index);
}

describe("Schoenberg S05 completing the sentence", () => {
  it("follows Chapter VIII through an A-L sequence", () => {
    expect(schoenbergCompletingSentenceLesson.title).toBe(
      "Completing the sentence",
    );
    expect(schoenbergCompletingSentenceLesson.exercises).toHaveLength(12);
    expect(
      schoenbergCompletingSentenceLesson.exercises.map(
        (exercise) => exercise.letter,
      ),
    ).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]);

    for (const exercise of schoenbergCompletingSentenceLesson.exercises) {
      expect(exercise.source?.reference).toBeTruthy();
      expect(exercise.source?.focus).toBeTruthy();
      expect(exercise.source?.exampleIds?.length).toBeGreaterThan(0);
    }
  });

  it("keeps the practice sentence developmental rather than repetitive or foreign", () => {
    const complete = studyCompletionSequence("complete");
    const repeated = studyCompletionSequence("repeat-presentation");
    const foreign = studyCompletionSequence("foreign-continuation");

    expect(complete.notes).toHaveLength(32);
    expect(complete.durations).toHaveLength(32);
    expect(complete.harmony).toHaveLength(32);
    expect(complete.notes.slice(0, 16)).toEqual(repeated.notes.slice(0, 16));
    expect(complete.notes.slice(16)).not.toEqual(repeated.notes.slice(16));
    expect(complete.notes.slice(16)).not.toEqual(foreign.notes.slice(16));
    expect(studyCompletionHasDevelopment(complete.notes)).toBe(true);
    expect(studyCompletionHasDevelopment(repeated.notes)).toBe(false);
  });

  it("recognises continuation, sequence and liquidation in the first three exercises", () => {
    const study = initialCompositionStudyState();

    study[SCHOENBERG_COMPLETION_IDS.function] = {
      ...study[SCHOENBERG_COMPLETION_IDS.function],
      ...studyCompletionSequence("developed-continuation"),
      completionMode: "developed-continuation",
      decision: "related",
    };
    study[SCHOENBERG_COMPLETION_IDS.sequence] = {
      ...study[SCHOENBERG_COMPLETION_IDS.sequence],
      ...studyCompletionSequence("sequence"),
      completionMode: "sequence",
      decision: "related",
    };
    study[SCHOENBERG_COMPLETION_IDS.liquidation] = {
      ...study[SCHOENBERG_COMPLETION_IDS.liquidation],
      ...studyCompletionSequence("liquidation"),
      completionMode: "liquidation",
      decision: "related",
    };

    const functionChecks =
      schoenbergCompletingSentenceLesson.exercises[0].evaluate(
        context(study, {
          "transport.play": experiment(1, ["composition-study"]),
          "study.completion-mode": experiment(3, [
            "repeat-presentation",
            "developed-continuation",
            "foreign-continuation",
          ]),
        }),
      );
    const sequenceChecks =
      schoenbergCompletingSentenceLesson.exercises[1].evaluate(
        context(study, {
          "transport.play": experiment(1, ["composition-study"]),
          "study.completion-mode": experiment(3, [
            "static-fragment",
            "sequence",
            "foreign-continuation",
          ]),
        }),
      );
    const liquidationChecks =
      schoenbergCompletingSentenceLesson.exercises[2].evaluate(
        context(study, {
          "transport.play": experiment(1, ["composition-study"]),
          "study.completion-mode": experiment(3, [
            "unliquidated",
            "liquidation",
            "abrupt",
          ]),
        }),
      );

    expect(functionChecks.every((check) => check.complete)).toBe(true);
    expect(sequenceChecks.every((check) => check.complete)).toBe(true);
    expect(liquidationChecks.every((check) => check.complete)).toBe(true);

    expect(
      studyCompletionHasSequence(
        study[SCHOENBERG_COMPLETION_IDS.sequence].notes,
      ),
    ).toBe(true);
    expect(
      studyCompletionHasLiquidation(
        study[SCHOENBERG_COMPLETION_IDS.liquidation].notes,
      ),
    ).toBe(true);
  });

  it("makes every book-example exercise require interaction with its own source analysis", () => {
    const specs = [
      { index: 4, id: "s05.ex52", count: 5 },
      { index: 5, id: "s05.ex53", count: 4 },
      { index: 6, id: "s05.ex54-56", count: 5 },
      { index: 7, id: "s05.ex57-58", count: 4 },
      { index: 8, id: "s05.ex59", count: 5 },
      { index: 9, id: "s05.ex60", count: 5 },
      { index: 10, id: "s05.ex61", count: 5 },
    ];

    for (const spec of specs) {
      const sourceAnalysis = sourceVisits(spec.id, spec.count);
      const experiments: LessonContext["experiments"] = {
        "transport.play": experiment(1, ["composition-study"]),
        "source.analysis": experiment(spec.count, sourceAnalysis),
      };
      if (spec.id === "s05.ex59") {
        experiments["source.play"] = experiment(1, ["s05.ex59a"]);
      }

      const checks =
        schoenbergCompletingSentenceLesson.exercises[spec.index].evaluate(
          context(initialCompositionStudyState(), experiments),
        );
      expect(
        checks.every((check) => check.complete),
        schoenbergCompletingSentenceLesson.exercises[spec.index].id,
      ).toBe(true);

      const incompleteExperiments: LessonContext["experiments"] = {
        "transport.play": experiment(1, ["composition-study"]),
        "source.analysis": experiment(
          Math.max(0, spec.count - 1),
          sourceVisits(spec.id, Math.max(0, spec.count - 1)),
        ),
      };
      if (spec.id === "s05.ex59") {
        incompleteExperiments["source.play"] = experiment(1, ["s05.ex59a"]);
      }
      const incomplete =
        schoenbergCompletingSentenceLesson.exercises[spec.index].evaluate(
          context(initialCompositionStudyState(), incompleteExperiments),
        );
      expect(incomplete.some((check) => !check.complete)).toBe(true);
    }
  });

  it("lets the first composition attempt revise continuation while preserving the source and cadence", () => {
    const study = initialCompositionStudyState();
    let state = study[SCHOENBERG_COMPLETION_IDS.compose];

    state = setStudyCompletionSourceStepState(state, 16, 64);
    state = setStudyCompletionSourceStepState(state, 18, 67);
    state = setStudyCompletionModeState(state, "complete");
    study[SCHOENBERG_COMPLETION_IDS.compose] = state;

    const checks = schoenbergCompletingSentenceLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(2, ["16:64", "18:67"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
    expect(studyCompletionHasCadence(state.notes, state.harmony)).toBe(true);
  });

  it("accepts a rebuilt final sentence after four continuation edits and source study", () => {
    const study = initialCompositionStudyState();
    let state = study[SCHOENBERG_COMPLETION_IDS.final];

    state = setStudyCompletionSourceStepState(state, 16, 64);
    state = setStudyCompletionSourceStepState(state, 18, 67);
    state = setStudyCompletionSourceStepState(state, 20, 66);
    state = setStudyCompletionSourceStepState(state, 22, 69);
    state = setStudyCompletionModeState(state, "complete");
    study[SCHOENBERG_COMPLETION_IDS.final] = state;

    const checks = schoenbergCompletingSentenceLesson.exercises[11].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(4, [
          "16:64",
          "18:67",
          "20:66",
          "22:69",
        ]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
        "source.analysis": experiment(7, [
          "s05.ex52:0",
          "s05.ex53:0",
          "s05.ex54-56:0",
          "s05.ex57-58:0",
          "s05.ex59:0",
          "s05.ex60:0",
          "s05.ex61:0",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates older S05 state, adds E-L, and remains safe on partial state", () => {
    const previous = initialCompositionStudyState();
    delete previous[SCHOENBERG_COMPLETION_IDS.ex52];
    delete previous[SCHOENBERG_COMPLETION_IDS.ex53];
    delete previous[SCHOENBERG_COMPLETION_IDS.ex54_56];
    delete previous[SCHOENBERG_COMPLETION_IDS.ex57_58];
    delete previous[SCHOENBERG_COMPLETION_IDS.ex59];
    delete previous[SCHOENBERG_COMPLETION_IDS.ex60];
    delete previous[SCHOENBERG_COMPLETION_IDS.ex61];
    delete previous[SCHOENBERG_COMPLETION_IDS.final];

    const migrated = mergeCompositionStudyState(previous);
    expect(migrated[SCHOENBERG_COMPLETION_IDS.ex52]).toBeDefined();
    expect(migrated[SCHOENBERG_COMPLETION_IDS.ex61]).toBeDefined();
    expect(migrated[SCHOENBERG_COMPLETION_IDS.final]).toBeDefined();

    for (const exercise of schoenbergCompletingSentenceLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
