import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_CONNECTION_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudyConnectionOperationsState,
  studyConnectionBookSequence,
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
  it("expands Chapter IV into a source-grounded A-J sequence", () => {
    expect(schoenbergConnectingMotiveFormsLesson.title).toBe(
      "Connecting motive-forms & building phrases",
    );
    expect(schoenbergConnectingMotiveFormsLesson.exercises).toHaveLength(10);
    expect(
      schoenbergConnectingMotiveFormsLesson.exercises.map(
        (exercise) => exercise.letter,
      ),
    ).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]);

    for (const exercise of schoenbergConnectingMotiveFormsLesson.exercises) {
      expect(exercise.source?.reference).toBeTruthy();
      expect(exercise.source?.focus).toBeTruthy();
    }
  });

  it("distinguishes connected variation from sameness and disconnection", () => {
    const connected = studyConnectionSequence("related");
    const same = studyConnectionSequence("exact");
    const disconnected = studyConnectionSequence("unrelated");

    expect(studyConnectionRelatedFormCount(connected.notes)).toBe(3);
    expect(
      studyConnectionChangedFormCount(
        connected.notes,
        connected.durations,
      ),
    ).toBeGreaterThanOrEqual(2);

    expect(
      studyConnectionChangedFormCount(
        same.notes,
        same.durations,
      ),
    ).toBe(0);

    expect(studyConnectionRelatedFormCount(disconnected.notes)).toBeLessThan(3);
  });

  it("keeps the existing connection and repair practice intact", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_CONNECTION_IDS.compare].decision = "related";
    study[SCHOENBERG_CONNECTION_IDS.bridge].decision = "related";

    const compareChecks =
      schoenbergConnectingMotiveFormsLesson.exercises[0].evaluate(
        context(study, {
          "transport.play": experiment(3, ["composition-study"]),
          "study.variant": experiment(3, ["exact", "related", "unrelated"]),
        }),
      );
    const bridgeChecks =
      schoenbergConnectingMotiveFormsLesson.exercises[1].evaluate(
        context(study, {
          "transport.play": experiment(3, ["composition-study"]),
          "study.variant": experiment(3, ["exact", "related", "unrelated"]),
        }),
      );

    expect(compareChecks.every((check) => check.complete)).toBe(true);
    expect(bridgeChecks.every((check) => check.complete)).toBe(true);

    const repaired = studyConnectionSequence("related");
    study[SCHOENBERG_CONNECTION_IDS.repair] = {
      ...study[SCHOENBERG_CONNECTION_IDS.repair],
      notes: [...repaired.notes],
      durations: [...repaired.durations],
    };

    const repairChecks =
      schoenbergConnectingMotiveFormsLesson.exercises[2].evaluate(
        context(study, {
          "transport.play": experiment(1, ["composition-study"]),
          "study.note-edit": experiment(2, ["8:62", "9:64"]),
        }),
      );

    expect(repairChecks.every((check) => check.complete)).toBe(true);
  });

  it("still builds a four-form phrase from distinct transformations", () => {
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

  it("models Schoenberg's melodic-wave paragraph before the examples", () => {
    const wave = studyConnectionBookSequence("wave");
    expect(Math.max(...wave.notes.filter((note): note is number => note !== null)))
      .toBe(69);
    expect(wave.notes.slice(0, 8)).toEqual([
      60, 62, 64, 65, 67, 65, 64, 62,
    ]);

    const study = initialCompositionStudyState();
    study[SCHOENBERG_CONNECTION_IDS.wave].decision = "related";

    const checks = schoenbergConnectingMotiveFormsLesson.exercises[4].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(2, ["staff", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("uses separate reductions for Examples 30-34", () => {
    const ex30 = studyConnectionBookSequence("ex30");
    const ex31 = studyConnectionBookSequence("ex31");
    const ex32 = studyConnectionBookSequence("ex32");
    const ex33 = studyConnectionBookSequence("ex33");
    const ex34 = studyConnectionBookSequence("ex34");

    expect(ex30.notes).not.toEqual(ex31.notes);
    expect(ex31.durations.slice(0, 4)).toEqual(
      ex31.durations.slice(4, 8),
    );
    expect(ex32.durations.slice(0, 4)).toEqual(
      ex32.durations.slice(12, 16),
    );
    expect(new Set(ex33.durations).size).toBeGreaterThan(1);
    expect(ex34.notes.filter((note) => note === null).length).toBeGreaterThan(3);
  });

  it("completes Exs. 30-34 only after the book-specific identification", () => {
    const study = initialCompositionStudyState();
    const ids = [
      SCHOENBERG_CONNECTION_IDS.ex30,
      SCHOENBERG_CONNECTION_IDS.ex31,
      SCHOENBERG_CONNECTION_IDS.ex32,
      SCHOENBERG_CONNECTION_IDS.ex33,
      SCHOENBERG_CONNECTION_IDS.ex34,
    ];

    ids.forEach((id) => {
      study[id].decision = "related";
    });

    const shared = {
      "transport.play": experiment(1, ["composition-study"]),
      "study.notation": experiment(2, ["staff", "degrees"]),
    };

    for (let index = 5; index <= 9; index += 1) {
      const checks = schoenbergConnectingMotiveFormsLesson.exercises[
        index
      ].evaluate(context(study, shared));
      expect(
        checks.every((check) => check.complete),
        schoenbergConnectingMotiveFormsLesson.exercises[index].id,
      ).toBe(true);
    }
  });

  it("migrates earlier S03 state and adds the new E-J studies", () => {
    const previous = initialCompositionStudyState();
    delete previous[SCHOENBERG_CONNECTION_IDS.wave];
    delete previous[SCHOENBERG_CONNECTION_IDS.ex30];
    delete previous[SCHOENBERG_CONNECTION_IDS.ex31];
    delete previous[SCHOENBERG_CONNECTION_IDS.ex32];
    delete previous[SCHOENBERG_CONNECTION_IDS.ex33];
    delete previous[SCHOENBERG_CONNECTION_IDS.ex34];

    const migrated = mergeCompositionStudyState(previous);
    expect(migrated[SCHOENBERG_CONNECTION_IDS.wave]).toBeDefined();
    expect(migrated[SCHOENBERG_CONNECTION_IDS.ex34]).toBeDefined();
    expect(migrated[SCHOENBERG_CONNECTION_IDS.ex34].notes).toHaveLength(16);

    for (const exercise of schoenbergConnectingMotiveFormsLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
