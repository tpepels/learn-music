import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_SENTENCE_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudySentenceModeState,
  setStudySentenceSourceStepState,
  studySentenceBookSequence,
  studySentenceHalvesRelated,
  studySentenceHarmonyIsComplementary,
  studySentenceHasImmediateRepetition,
  studySentenceSequence,
} from "../music/study";
import { schoenbergBeginningSentenceLesson } from "./schoenbergBeginningSentence";
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

describe("Schoenberg S04 beginning the sentence", () => {
  it("expands Chapter V into a source-grounded A-J sequence", () => {
    expect(schoenbergBeginningSentenceLesson.exercises).toHaveLength(10);
    expect(
      schoenbergBeginningSentenceLesson.exercises.map(
        (exercise) => exercise.letter,
      ),
    ).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]);

    for (const exercise of schoenbergBeginningSentenceLesson.exercises) {
      expect(exercise.source?.reference).toBeTruthy();
      expect(exercise.source?.focus).toBeTruthy();
    }
  });

  it("distinguishes sentence-style immediate repetition from postponed return", () => {
    const immediate = studySentenceSequence("immediate");
    const delayed = studySentenceSequence("delayed");
    const contrast = studySentenceSequence("contrast");

    expect(studySentenceHasImmediateRepetition(immediate.notes)).toBe(true);
    expect(studySentenceHasImmediateRepetition(delayed.notes)).toBe(false);
    expect(studySentenceHasImmediateRepetition(contrast.notes)).toBe(false);

    const study = initialCompositionStudyState();
    study[SCHOENBERG_SENTENCE_IDS.recognise] = {
      ...study[SCHOENBERG_SENTENCE_IDS.recognise],
      ...immediate,
      sentenceMode: "immediate",
      decision: "related",
    };

    const checks = schoenbergBeginningSentenceLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.sentence-mode": experiment(3, [
          "immediate",
          "delayed",
          "contrast",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("keeps transposed and complementary repetition related to one basic idea", () => {
    const study = initialCompositionStudyState();

    study[SCHOENBERG_SENTENCE_IDS.repetition] = {
      ...study[SCHOENBERG_SENTENCE_IDS.repetition],
      ...studySentenceSequence("transposed"),
      sentenceMode: "transposed",
      decision: "related",
    };

    const complementary = studySentenceSequence("complementary");
    study[SCHOENBERG_SENTENCE_IDS.harmony] = {
      ...study[SCHOENBERG_SENTENCE_IDS.harmony],
      ...complementary,
      harmony: complementary.harmony ?? [],
      sentenceMode: "complementary",
      decision: "related",
    };

    expect(
      studySentenceHasImmediateRepetition(
        study[SCHOENBERG_SENTENCE_IDS.repetition].notes,
      ),
    ).toBe(true);
    expect(
      studySentenceHarmonyIsComplementary(
        study[SCHOENBERG_SENTENCE_IDS.harmony].harmony,
      ),
    ).toBe(true);
    expect(
      studySentenceHalvesRelated(
        study[SCHOENBERG_SENTENCE_IDS.harmony].notes,
      ),
    ).toBe(true);

    const repetitionChecks =
      schoenbergBeginningSentenceLesson.exercises[1].evaluate(
        context(study, {
          "transport.play": experiment(3, ["composition-study"]),
          "study.sentence-mode": experiment(3, [
            "exact",
            "transposed",
            "contrast",
          ]),
          "study.notation": experiment(2, ["staff", "degrees"]),
        }),
      );
    const harmonyChecks =
      schoenbergBeginningSentenceLesson.exercises[2].evaluate(
        context(study, {
          "transport.play": experiment(3, ["composition-study"]),
          "study.sentence-mode": experiment(3, [
            "tonic-repeat",
            "complementary",
            "contrast",
          ]),
        }),
      );

    expect(repetitionChecks.every((check) => check.complete)).toBe(true);
    expect(harmonyChecks.every((check) => check.complete)).toBe(true);
  });

  it("models Examples 35-39 as increasingly flexible tonic/dominant relations", () => {
    const ex35 = studySentenceBookSequence("ex35");
    const ex36_37 = studySentenceBookSequence("ex36_37");
    const ex38_39 = studySentenceBookSequence("ex38_39");

    expect(ex35.harmony?.[0]).toBe("I");
    expect(ex35.harmony?.[8]).toBe("V");
    expect(ex36_37.harmony?.filter((entry) => entry !== null)).toHaveLength(6);
    expect(ex38_39.harmony?.slice(0, 8).filter((entry) => entry !== null))
      .toHaveLength(4);
    expect(ex38_39.harmony?.slice(8).filter((entry) => entry !== null))
      .toHaveLength(2);

    const study = initialCompositionStudyState();
    [
      SCHOENBERG_SENTENCE_IDS.ex35,
      SCHOENBERG_SENTENCE_IDS.ex36_37,
      SCHOENBERG_SENTENCE_IDS.ex38_39,
    ].forEach((id) => {
      study[id].decision = "related";
    });

    for (let index = 4; index <= 6; index += 1) {
      const checks = schoenbergBeginningSentenceLesson.exercises[index].evaluate(
        context(study, {
          "transport.play": experiment(1, ["composition-study"]),
          "study.notation": experiment(2, ["staff", "degrees"]),
          "source.play": experiment(2, ["s04.ex35a", "s04.ex35b"]),
        }),
      );
      expect(
        checks.every((check) => check.complete),
        schoenbergBeginningSentenceLesson.exercises[index].id,
      ).toBe(true);
    }
  });

  it("makes Ex. 40 a two-pair comparison of strict contour and freer contour", () => {
    const sequence = studySentenceBookSequence("ex40");
    expect(sequence.notes).toHaveLength(32);
    expect(sequence.harmony?.[0]).toBe("I");
    expect(sequence.harmony?.[8]).toBe("V");
    expect(sequence.harmony?.[16]).toBe("I");
    expect(sequence.harmony?.[24]).toBe("V");

    const study = initialCompositionStudyState();
    study[SCHOENBERG_SENTENCE_IDS.ex40].decision = "related";

    const checks = schoenbergBeginningSentenceLesson.exercises[7].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(2, ["staff", "piano-roll"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("makes Ex. 41 compare busy literal answering with a reduced harmonic skeleton", () => {
    const sequence = studySentenceBookSequence("ex41");
    expect(sequence.notes).toHaveLength(32);
    expect(sequence.harmony?.filter((entry) => entry !== null).length)
      .toBeGreaterThan(8);

    const study = initialCompositionStudyState();
    study[SCHOENBERG_SENTENCE_IDS.ex41].decision = "related";

    const checks = schoenbergBeginningSentenceLesson.exercises[8].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("keeps the first composition attempt editable and related", () => {
    const study = initialCompositionStudyState();
    let state = study[SCHOENBERG_SENTENCE_IDS.compose];

    state = setStudySentenceSourceStepState(state, 0, 62);
    state = setStudySentenceSourceStepState(state, 2, 65);
    state = setStudySentenceSourceStepState(state, 5, 67);
    state = setStudySentenceModeState(state, "transposed");
    study[SCHOENBERG_SENTENCE_IDS.compose] = state;

    const checks = schoenbergBeginningSentenceLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(3, ["0:62", "2:65", "5:67"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("accepts a rebuilt final opening after four source edits", () => {
    const study = initialCompositionStudyState();
    let state = study[SCHOENBERG_SENTENCE_IDS.final];

    state = setStudySentenceSourceStepState(state, 0, 62);
    state = setStudySentenceSourceStepState(state, 2, 65);
    state = setStudySentenceSourceStepState(state, 4, 67);
    state = setStudySentenceSourceStepState(state, 6, 64);
    state = setStudySentenceModeState(state, "complementary");
    study[SCHOENBERG_SENTENCE_IDS.final] = state;

    const checks = schoenbergBeginningSentenceLesson.exercises[9].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(4, [
          "0:62",
          "2:65",
          "4:67",
          "6:64",
        ]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates older S04 state, adds E-J, and remains safe on partial state", () => {
    const previous = initialCompositionStudyState();
    delete previous[SCHOENBERG_SENTENCE_IDS.ex35];
    delete previous[SCHOENBERG_SENTENCE_IDS.ex36_37];
    delete previous[SCHOENBERG_SENTENCE_IDS.ex38_39];
    delete previous[SCHOENBERG_SENTENCE_IDS.ex40];
    delete previous[SCHOENBERG_SENTENCE_IDS.ex41];
    delete previous[SCHOENBERG_SENTENCE_IDS.final];

    const migrated = mergeCompositionStudyState(previous);
    expect(migrated[SCHOENBERG_SENTENCE_IDS.ex35]).toBeDefined();
    expect(migrated[SCHOENBERG_SENTENCE_IDS.ex40].notes).toHaveLength(32);
    expect(migrated[SCHOENBERG_SENTENCE_IDS.final]).toBeDefined();

    for (const exercise of schoenbergBeginningSentenceLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
