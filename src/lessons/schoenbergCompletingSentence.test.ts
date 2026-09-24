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

describe("Schoenberg S05 completing the sentence", () => {
  it("follows Chapter VIII as a source-grounded A-L sequence", () => {
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
    }

    expect(
      schoenbergCompletingSentenceLesson.exercises
        .slice(4, 10)
        .flatMap((exercise) => exercise.source?.exampleIds ?? []),
    ).toEqual([
      "s05-ex52",
      "s05-ex53-56",
      "s05-ex57-58",
      "s05-ex59",
      "s05-ex60",
      "s05-ex61",
    ]);
  });

  it("keeps continuation, sequence and liquidation as distinct audible functions", () => {
    const complete = studyCompletionSequence("complete");
    const repeated = studyCompletionSequence("repeat-presentation");
    const sequence = studyCompletionSequence("sequence");
    const staticFragment = studyCompletionSequence("static-fragment");
    const liquidated = studyCompletionSequence("liquidation");
    const unliquidated = studyCompletionSequence("unliquidated");

    expect(complete.notes).toHaveLength(32);
    expect(studyCompletionHasDevelopment(complete.notes)).toBe(true);
    expect(studyCompletionHasDevelopment(repeated.notes)).toBe(false);
    expect(studyCompletionHasSequence(sequence.notes)).toBe(true);
    expect(studyCompletionHasSequence(staticFragment.notes)).toBe(false);
    expect(studyCompletionHasLiquidation(liquidated.notes)).toBe(true);
    expect(studyCompletionHasLiquidation(unliquidated.notes)).toBe(false);
    expect(
      studyCompletionHasCadence(
        liquidated.notes,
        liquidated.harmony ?? [],
      ),
    ).toBe(true);
  });

  it("accepts the three conceptual comparison exercises", () => {
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

    const cases = [
      {
        index: 0,
        experiments: {
          "transport.play": experiment(1, ["composition-study"]),
          "study.completion-mode": experiment(3, [
            "repeat-presentation",
            "developed-continuation",
            "foreign-continuation",
          ]),
        },
      },
      {
        index: 1,
        experiments: {
          "transport.play": experiment(1, ["composition-study"]),
          "study.completion-mode": experiment(3, [
            "static-fragment",
            "sequence",
            "foreign-continuation",
          ]),
        },
      },
      {
        index: 2,
        experiments: {
          "transport.play": experiment(1, ["composition-study"]),
          "study.completion-mode": experiment(3, [
            "unliquidated",
            "liquidation",
            "abrupt",
          ]),
        },
      },
    ];

    cases.forEach(({ index, experiments }) => {
      const checks = schoenbergCompletingSentenceLesson.exercises[index].evaluate(
        context(study, experiments),
      );
      expect(checks.every((check) => check.complete)).toBe(true);
    });
  });

  it("accepts a revised first complete sentence", () => {
    const study = initialCompositionStudyState();
    let state = setStudyCompletionModeState(
      study[SCHOENBERG_COMPLETION_IDS.compose],
      "complete",
    );
    state = setStudyCompletionSourceStepState(state, 16, 64);
    state = setStudyCompletionSourceStepState(state, 20, 62);
    study[SCHOENBERG_COMPLETION_IDS.compose] = state;

    const checks = schoenbergCompletingSentenceLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(2, ["16:64", "20:62"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("requires native source playback and analysis for Examples 52-61", () => {
    const study = initialCompositionStudyState();
    [
      SCHOENBERG_COMPLETION_IDS.ex52,
      SCHOENBERG_COMPLETION_IDS.ex53_56,
      SCHOENBERG_COMPLETION_IDS.ex57_58,
      SCHOENBERG_COMPLETION_IDS.ex59,
      SCHOENBERG_COMPLETION_IDS.ex60,
      SCHOENBERG_COMPLETION_IDS.ex61,
    ].forEach((id) => {
      study[id].decision = "related";
    });

    const sourceCases = [
      {
        index: 4,
        play: "s05-ex52",
        segments: ["s05-ex52:reduce", "s05-ex52:liquidation"],
      },
      {
        index: 5,
        play: "s05-ex53-56",
        segments: [
          "s05-ex53-56:sequence",
          "s05-ex53-56:liquidate",
        ],
      },
      {
        index: 6,
        play: "s05-ex57-58",
        segments: [
          "s05-ex57-58:presentation",
          "s05-ex57-58:continuation",
        ],
      },
      {
        index: 7,
        play: "s05-ex59",
        segments: ["s05-ex59:insert"],
      },
      {
        index: 8,
        play: "s05-ex60",
        segments: ["s05-ex60:extension", "s05-ex60:cadence"],
      },
      {
        index: 9,
        play: "s05-ex61",
        segments: ["s05-ex61:develop", "s05-ex61:liquidate"],
      },
    ];

    sourceCases.forEach(({ index, play, segments }) => {
      const checks = schoenbergCompletingSentenceLesson.exercises[index].evaluate(
        context(study, {
          "source-score.play": experiment(1, [play]),
          "source-score.segment": experiment(segments.length, segments),
        }),
      );
      expect(
        checks.every((check) => check.complete),
        schoenbergCompletingSentenceLesson.exercises[index].id,
      ).toBe(true);
    });
  });

  it("compares three different source solutions before the final revision", () => {
    const checks = schoenbergCompletingSentenceLesson.exercises[10].evaluate(
      context(initialCompositionStudyState(), {
        "source-score.play": experiment(3, [
          "s05-ex52",
          "s05-ex59",
          "s05-ex61",
        ]),
        "source-score.segment": experiment(3, [
          "s05-ex52:liquidation",
          "s05-ex59:insert",
          "s05-ex61:develop",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a final post-source revision while preserving development, liquidation and cadence", () => {
    const study = initialCompositionStudyState();
    let state = setStudyCompletionModeState(
      study[SCHOENBERG_COMPLETION_IDS.final],
      "complete",
    );
    state = setStudyCompletionSourceStepState(state, 16, 64);
    state = setStudyCompletionSourceStepState(state, 18, 67);
    state = setStudyCompletionSourceStepState(state, 20, 62);
    study[SCHOENBERG_COMPLETION_IDS.final] = state;

    const checks = schoenbergCompletingSentenceLesson.exercises[11].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(3, ["16:64", "18:67", "20:62"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates earlier S05 state, adds E-L, and remains safe on partial state", () => {
    const previous = initialCompositionStudyState();
    [
      SCHOENBERG_COMPLETION_IDS.ex52,
      SCHOENBERG_COMPLETION_IDS.ex53_56,
      SCHOENBERG_COMPLETION_IDS.ex57_58,
      SCHOENBERG_COMPLETION_IDS.ex59,
      SCHOENBERG_COMPLETION_IDS.ex60,
      SCHOENBERG_COMPLETION_IDS.ex61,
      SCHOENBERG_COMPLETION_IDS.compare,
      SCHOENBERG_COMPLETION_IDS.final,
    ].forEach((id) => delete previous[id]);

    const migrated = mergeCompositionStudyState(previous);
    expect(migrated[SCHOENBERG_COMPLETION_IDS.ex52]).toBeDefined();
    expect(migrated[SCHOENBERG_COMPLETION_IDS.ex61]).toBeDefined();
    expect(migrated[SCHOENBERG_COMPLETION_IDS.final].notes).toHaveLength(32);

    for (const exercise of schoenbergCompletingSentenceLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
