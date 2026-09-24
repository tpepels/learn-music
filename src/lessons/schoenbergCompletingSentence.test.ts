import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_COMPLETION_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudyCompletionModeState,
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
  it("extends the 16-step beginning into a 32-step sentence", () => {
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

  it("recognises continuation after comparing repetition and replacement", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_COMPLETION_IDS.function] = {
      ...study[SCHOENBERG_COMPLETION_IDS.function],
      ...studyCompletionSequence("developed-continuation"),
      completionMode: "developed-continuation",
      decision: "related",
    };

    const checks = schoenbergCompletingSentenceLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.completion-mode": experiment(3, [
          "repeat-presentation",
          "developed-continuation",
          "foreign-continuation",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("distinguishes a sequence-like continuation from static repetition", () => {
    const sequence = studyCompletionSequence("sequence");
    const staticFragment = studyCompletionSequence("static-fragment");

    expect(studyCompletionHasSequence(sequence.notes)).toBe(true);
    expect(studyCompletionHasSequence(staticFragment.notes)).toBe(true);
    expect(sequence.notes.slice(16, 20)).not.toEqual(
      sequence.notes.slice(20, 24),
    );
    expect(staticFragment.notes.slice(16, 20)).toEqual(
      staticFragment.notes.slice(20, 24),
    );

    const study = initialCompositionStudyState();
    study[SCHOENBERG_COMPLETION_IDS.sequence] = {
      ...study[SCHOENBERG_COMPLETION_IDS.sequence],
      ...sequence,
      completionMode: "sequence",
      decision: "related",
    };

    const checks = schoenbergCompletingSentenceLesson.exercises[1].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.completion-mode": experiment(3, [
          "static-fragment",
          "sequence",
          "foreign-continuation",
        ]),
        "study.notation": experiment(2, ["staff", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("makes liquidation sparser and closes it with V to I", () => {
    const liquidated = studyCompletionSequence("liquidation");
    const unliquidated = studyCompletionSequence("unliquidated");

    expect(studyCompletionHasLiquidation(liquidated.notes)).toBe(true);
    expect(studyCompletionHasLiquidation(unliquidated.notes)).toBe(false);
    expect(
      studyCompletionHasCadence(
        liquidated.notes,
        liquidated.harmony ?? [],
      ),
    ).toBe(true);

    const study = initialCompositionStudyState();
    study[SCHOENBERG_COMPLETION_IDS.liquidation] = {
      ...study[SCHOENBERG_COMPLETION_IDS.liquidation],
      ...liquidated,
      completionMode: "liquidation",
      decision: "related",
    };

    const checks = schoenbergCompletingSentenceLesson.exercises[2].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.completion-mode": experiment(3, [
          "unliquidated",
          "liquidation",
          "abrupt",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a revised full sentence while preserving liquidation and cadence", () => {
    const study = initialCompositionStudyState();
    let state = setStudyCompletionModeState(
      study[SCHOENBERG_COMPLETION_IDS.compose],
      "complete",
    );
    state = {
      ...state,
      notes: state.notes.map((note, index) => {
        if (index === 16) return 64;
        if (index === 20) return 62;
        return note;
      }),
    };
    study[SCHOENBERG_COMPLETION_IDS.compose] = state;

    const checks = schoenbergCompletingSentenceLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(2, ["16:64", "20:62"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
        "study.completion-mode": experiment(1, ["complete"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates earlier composition-study state and keeps old exercises at 16 steps", () => {
    const previous = initialCompositionStudyState();
    delete previous[SCHOENBERG_COMPLETION_IDS.function];
    delete previous[SCHOENBERG_COMPLETION_IDS.sequence];
    delete previous[SCHOENBERG_COMPLETION_IDS.liquidation];
    delete previous[SCHOENBERG_COMPLETION_IDS.compose];

    const migrated = mergeCompositionStudyState(previous);

    expect(migrated[SCHOENBERG_COMPLETION_IDS.function].notes).toHaveLength(32);
    expect(migrated[SCHOENBERG_COMPLETION_IDS.compose].harmony).toHaveLength(32);
    expect(migrated["schoenberg.beginning-sentence.a"].notes).toHaveLength(16);

    for (const exercise of schoenbergCompletingSentenceLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
