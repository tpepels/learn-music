import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_CONNECTION_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudyConnectionOperationsState,
  studyConnectionChangedFormCount,
  studyConnectionRelatedFormCount,
  studyConnectionSequence,
} from "../music/study";
import { schoenbergConnectingMotiveFormsLesson } from "./schoenbergConnectingMotiveForms";
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

describe("Schoenberg S03 connecting motive-forms", () => {
  it("distinguishes connected variation from sameness and disconnection", () => {
    const connected = studyConnectionSequence("related");
    const same = studyConnectionSequence("exact");
    const disconnected = studyConnectionSequence("unrelated");

    expect(studyConnectionRelatedFormCount(connected.notes)).toBe(3);
    expect(studyConnectionChangedFormCount(
      connected.notes,
      connected.durations,
    )).toBeGreaterThanOrEqual(2);

    expect(studyConnectionChangedFormCount(
      same.notes,
      same.durations,
    )).toBe(0);

    expect(studyConnectionRelatedFormCount(disconnected.notes)).toBeLessThan(3);
  });

  it("requires comparison of sameness, connection, and foreign material", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_CONNECTION_IDS.compare].decision = "related";

    const checks = schoenbergConnectingMotiveFormsLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.variant": experiment(3, ["exact", "related", "unrelated"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("requires listening to all three bridge alternatives before choosing the connected form", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_CONNECTION_IDS.bridge].decision = "related";

    const checks = schoenbergConnectingMotiveFormsLesson.exercises[1].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.variant": experiment(3, ["exact", "related", "unrelated"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a repaired chain only when all later forms reconnect to the basic motive", () => {
    const study = initialCompositionStudyState();
    const repaired = studyConnectionSequence("related");
    study[SCHOENBERG_CONNECTION_IDS.repair] = {
      ...study[SCHOENBERG_CONNECTION_IDS.repair],
      notes: [...repaired.notes],
      durations: [...repaired.durations],
    };

    const checks = schoenbergConnectingMotiveFormsLesson.exercises[2].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(2, ["8:62", "9:64"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("builds a four-form phrase from three distinct transformations", () => {
    const study = initialCompositionStudyState();
    let state = setStudyConnectionOperationsState(
      study[SCHOENBERG_CONNECTION_IDS.compose],
      ["rhythm", "reduction", "displacement"],
    );

    state = {
      ...state,
      notes: state.notes.map((note, index) =>
        index === 4 && note !== null ? note + 2 : note,
      ),
    };
    study[SCHOENBERG_CONNECTION_IDS.compose] = state;

    const checks = schoenbergConnectingMotiveFormsLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(1, ["4:64"]),
        "study.notation": experiment(2, ["staff", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates earlier Schoenberg study state and remains safe on partial state", () => {
    const previous = initialCompositionStudyState();
    delete previous[SCHOENBERG_CONNECTION_IDS.compare];
    delete previous[SCHOENBERG_CONNECTION_IDS.bridge];
    delete previous[SCHOENBERG_CONNECTION_IDS.repair];
    delete previous[SCHOENBERG_CONNECTION_IDS.compose];

    const migrated = mergeCompositionStudyState(previous);
    expect(migrated[SCHOENBERG_CONNECTION_IDS.compare]).toBeDefined();
    expect(migrated[SCHOENBERG_CONNECTION_IDS.compose].notes).toHaveLength(16);

    for (const exercise of schoenbergConnectingMotiveFormsLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
