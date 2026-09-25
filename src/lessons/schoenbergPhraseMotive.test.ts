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
import { schoenbergBeginningSentenceLesson } from "./schoenbergBeginningSentence";
import { schoenbergCompletingSentenceLesson } from "./schoenbergCompletingSentence";
import { schoenbergConnectingMotiveFormsLesson } from "./schoenbergConnectingMotiveForms";
import { schoenbergDevelopingVariationLesson } from "./schoenbergDevelopingVariation";
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
    expect(schoenbergLessons).toEqual([
      schoenbergPhraseMotiveLesson,
      schoenbergDevelopingVariationLesson,
      schoenbergConnectingMotiveFormsLesson,
      schoenbergBeginningSentenceLesson,
      schoenbergCompletingSentenceLesson,
    ]);
    expect(learningTracks.map((track) => track.id)).toEqual([
      "play-lab",
      "schoenberg",
    ]);
    expect(getNextImplementedLesson(playLabLessons.at(-1)!.id)).toBeUndefined();
    expect(
      getNextImplementedLesson(schoenbergPhraseMotiveLesson.id)?.id,
    ).toBe(schoenbergDevelopingVariationLesson.id);
    expect(
      getNextImplementedLesson(schoenbergDevelopingVariationLesson.id)?.id,
    ).toBe(schoenbergConnectingMotiveFormsLesson.id);
    expect(
      getNextImplementedLesson(schoenbergConnectingMotiveFormsLesson.id)?.id,
    ).toBe(schoenbergBeginningSentenceLesson.id);
    expect(
      getNextImplementedLesson(schoenbergBeginningSentenceLesson.id)?.id,
    ).toBe(schoenbergCompletingSentenceLesson.id);
    expect(
      getNextImplementedLesson(schoenbergCompletingSentenceLesson.id),
    ).toBeUndefined();
  });

  it("expands S01 into a source-grounded A-J sequence", () => {
    expect(schoenbergPhraseMotiveLesson.title).toBe("Form & phrase");
    expect(schoenbergPhraseMotiveLesson.exercises).toHaveLength(10);
    expect(schoenbergPhraseMotiveLesson.exercises.map((exercise) => exercise.letter))
      .toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]);

    for (const exercise of schoenbergPhraseMotiveLesson.exercises) {
      expect(exercise.source?.reference).toBeTruthy();
      expect(exercise.source?.focus).toBeTruthy();
    }
  });

  it("keeps the Chapter I-II teaching substance in the learner copy", () => {
    const phrase = schoenbergPhraseMotiveLesson.exercises[0];
    const chordToneStudy = schoenbergPhraseMotiveLesson.exercises[3];
    const embellishment = schoenbergPhraseMotiveLesson.exercises[8];

    expect(phrase.explanation).toContain("metre and tempo");
    expect(phrase.explanation).toContain("crosses metrical divisions");
    expect(chordToneStudy.explanation).toContain("fixing the harmony first");
    expect(chordToneStudy.explanation).toContain("technical fluency");
    expect(embellishment.explanation).toContain("implied harmony");
  });

  it("uses native source material instead of raster book crops", () => {
    const literature = schoenbergPhraseMotiveLesson.exercises[1];
    const repair = schoenbergPhraseMotiveLesson.exercises[2];

    expect(literature.source?.exampleIds).toEqual(["s01.ex2e"]);
    expect(repair.source?.exampleIds).toEqual(["s01.ex2e", "s01.ex4c"]);

    expect(literature.instruction).toContain("Play Ex. 2e");
    expect(literature.instruction).not.toContain("native");
    expect(repair.instruction).toContain("Study Ex. 2e and Ex. 4c");
    expect(repair.instruction).not.toContain("source-analysis map");
  });

  it("recognises phrase analysis after listening, marking, and changing notation", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_STUDY_IDS.analyse].selectedSteps = [0, 1, 2, 3];

    const checks = schoenbergPhraseMotiveLesson.exercises[0].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(2, ["piano-roll", "degrees"]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("requires comparison of exact, related, and unrelated phrase relationships", () => {
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

  it("accepts the Ex. 5 chord-tone construction only inside one triad", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_STUDY_IDS.compose].notes = [
      60, 64, 67, 64, 60, 67, 64, 60,
      null, null, null, null, null, null, null, null,
    ];

    const checks = schoenbergPhraseMotiveLesson.exercises[3].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.note-edit": experiment(9, [
          "0:60", "1:64", "2:67", "3:64", "4:60", "5:67", "6:64", "7:60",
          "3:67", "3:64",
        ]),
      }),
    );

    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("uses the book's Exs. 6-11 as separate analysis steps", () => {
    const study = initialCompositionStudyState();
    const ids = [
      SCHOENBERG_STUDY_IDS.noteValues,
      SCHOENBERG_STUDY_IDS.upbeats,
      SCHOENBERG_STUDY_IDS.passingNotes,
      SCHOENBERG_STUDY_IDS.repetitions,
      SCHOENBERG_STUDY_IDS.embellishment,
    ];

    ids.forEach((id) => {
      study[id].decision = "related";
    });

    const sharedExperiments = {
      "transport.play": experiment(1, ["composition-study"]),
      "study.notation": experiment(2, ["staff", "degrees"]),
    };

    for (let index = 4; index <= 8; index += 1) {
      const checks = schoenbergPhraseMotiveLesson.exercises[index].evaluate(
        context(study, sharedExperiments),
      );
      expect(
        checks.every((check) => check.complete),
        schoenbergPhraseMotiveLesson.exercises[index].id,
      ).toBe(true);
    }
  });

  it("accepts a revised final phrase study with related but changed halves", () => {
    const study = initialCompositionStudyState();
    study[SCHOENBERG_STUDY_IDS.build].notes = [
      60, 62, 64, 65, 67, null, null, null,
      62, 64, 66, 67, 69, null, null, null,
    ];

    const checks = schoenbergPhraseMotiveLesson.exercises[9].evaluate(
      context(study, {
        "transport.play": experiment(1, ["composition-study"]),
        "study.notation": experiment(2, ["piano-roll", "staff"]),
        "study.note-edit": experiment(12, [
          "0:60", "1:62", "2:64", "3:65", "4:67",
          "8:62", "9:64", "10:66", "11:67", "12:69",
          "8:63", "8:62",
        ]),
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
