import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_SENTENCE_IDS,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  setStudySentenceModeState,
  setStudySentenceSourceStepState,
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
  it("distinguishes immediate repetition from delayed return and contrast", () => {
    const immediate = studySentenceSequence("immediate");
    const delayed = studySentenceSequence("delayed");
    const contrast = studySentenceSequence("contrast");

    expect(studySentenceHasImmediateRepetition(immediate.notes)).toBe(true);
    expect(studySentenceHasImmediateRepetition(delayed.notes)).toBe(false);
    expect(studySentenceHasImmediateRepetition(contrast.notes)).toBe(false);
  });

  it("recognises the characteristic sentence opening after comparison", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_SENTENCE_IDS.recognise] = {
      ...study[SCHOENBERG_SENTENCE_IDS.recognise],
      ...studySentenceSequence("immediate"),
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

  it("treats transposition as immediate repetition of the interval pattern", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_SENTENCE_IDS.repetition] = {
      ...study[SCHOENBERG_SENTENCE_IDS.repetition],
      ...studySentenceSequence("transposed"),
      sentenceMode: "transposed",
      decision: "related",
    };

    expect(
      studySentenceHasImmediateRepetition(
        study[SCHOENBERG_SENTENCE_IDS.repetition].notes,
      ),
    ).toBe(true);

    const checks = schoenbergBeginningSentenceLesson.exercises[1].evaluate(
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

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("models complementary repetition as related melody over I then V", () => {
    const study = initialCompositionStudyState();
    const complementary = studySentenceSequence("complementary");
    study[SCHOENBERG_SENTENCE_IDS.harmony] = {
      ...study[SCHOENBERG_SENTENCE_IDS.harmony],
      ...complementary,
      harmony: complementary.harmony ?? [],
      sentenceMode: "complementary",
      decision: "related",
    };

    expect(studySentenceHarmonyIsComplementary(
      study[SCHOENBERG_SENTENCE_IDS.harmony].harmony,
    )).toBe(true);
    expect(studySentenceHalvesRelated(
      study[SCHOENBERG_SENTENCE_IDS.harmony].notes,
    )).toBe(true);

    const checks = schoenbergBeginningSentenceLesson.exercises[2].evaluate(
      context(study, {
        "transport.play": experiment(3, ["composition-study"]),
        "study.sentence-mode": experiment(3, [
          "tonic-repeat",
          "complementary",
          "contrast",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("regenerates an immediate repetition from an edited basic idea", () => {
    const study = initialCompositionStudyState();
    let state = study[SCHOENBERG_SENTENCE_IDS.compose];

    state = setStudySentenceSourceStepState(state, 0, 62);
    state = setStudySentenceSourceStepState(state, 2, 65);
    state = setStudySentenceSourceStepState(state, 5, 67);
    state = setStudySentenceModeState(state, "transposed");
    study[SCHOENBERG_SENTENCE_IDS.compose] = state;

    expect(studySentenceHalvesRelated(state.notes)).toBe(true);

    const checks = schoenbergBeginningSentenceLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(3, ["0:62", "2:65", "5:67"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
        "study.sentence-mode": experiment(1, ["transposed"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("migrates S01-S03 study state and remains safe on partial state", () => {
    const previous = initialCompositionStudyState();
    delete previous[SCHOENBERG_SENTENCE_IDS.recognise];
    delete previous[SCHOENBERG_SENTENCE_IDS.repetition];
    delete previous[SCHOENBERG_SENTENCE_IDS.harmony];
    delete previous[SCHOENBERG_SENTENCE_IDS.compose];

    const migrated = mergeCompositionStudyState(previous);
    expect(migrated[SCHOENBERG_SENTENCE_IDS.recognise]).toBeDefined();
    expect(migrated[SCHOENBERG_SENTENCE_IDS.harmony].harmony).toHaveLength(16);

    for (const exercise of schoenbergBeginningSentenceLesson.exercises) {
      expect(() => exercise.evaluate(context({}))).not.toThrow();
    }
  });
});
