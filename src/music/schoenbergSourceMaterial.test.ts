import { describe, expect, it } from "vitest";
import {
  getSchoenbergSourceMaterial,
  schoenbergSourceMaterial,
} from "./schoenbergSourceMaterial";
import { schoenbergPhraseMotiveLesson } from "../lessons/schoenbergPhraseMotive";
import { schoenbergDevelopingVariationLesson } from "../lessons/schoenbergDevelopingVariation";
import { schoenbergConnectingMotiveFormsLesson } from "../lessons/schoenbergConnectingMotiveForms";
import { schoenbergBeginningSentenceLesson } from "../lessons/schoenbergBeginningSentence";
import { schoenbergCompletingSentenceLesson } from "../lessons/schoenbergCompletingSentence";

const lessons = [
  schoenbergPhraseMotiveLesson,
  schoenbergDevelopingVariationLesson,
  schoenbergConnectingMotiveFormsLesson,
  schoenbergBeginningSentenceLesson,
  schoenbergCompletingSentenceLesson,
];

describe("Schoenberg source material", () => {
  it("resolves every source id used by S01-S05", () => {
    const ids = lessons.flatMap((lesson) =>
      lesson.exercises.flatMap((exercise) => exercise.source?.exampleIds ?? []),
    );
    expect(ids.length).toBeGreaterThan(20);
    for (const id of ids) {
      expect(getSchoenbergSourceMaterial(id), id).toBeDefined();
    }
  });

  it("keeps every source representation explicit about fidelity", () => {
    for (const material of Object.values(schoenbergSourceMaterial)) {
      expect(material.fidelityNote.length, material.id).toBeGreaterThan(20);
      if (material.kind === "score") {
        expect(material.events.length, material.id).toBeGreaterThan(0);
      } else {
        expect(material.segments.length, material.id).toBeGreaterThan(0);
      }
    }
  });

  it("stores Ex. 2e as the verified native melodic line", () => {
    const material = getSchoenbergSourceMaterial("s01.ex2e");
    expect(material?.kind).toBe("score");
    if (!material || material.kind !== "score") return;

    expect(material.clef).toBe("bass");
    expect(material.meter).toBe("3/4");
    expect(material.events.map((event) => event.midi)).toEqual([
      51, 55, 51, 46, 51, 55, 58, 51,
    ]);
    expect(material.events.map((event) => event.duration)).toEqual([
      4, 2, 4, 2, 2, 2, 2, 6,
    ]);
  });

  it("stores Schoenberg Ex. 5a as the actual F-major broken-chord study", () => {
    const material = getSchoenbergSourceMaterial("s01.ex5a");
    expect(material?.kind).toBe("score");
    if (!material || material.kind !== "score") return;

    expect(material.keyLabel).toContain("F major");
    expect(material.events.map((event) => event.midi)).toEqual([65, 69, 72]);
    expect(material.events.map((event) => event.duration)).toEqual([4, 4, 8]);
  });

  it("stores Exs. 6a-8a as verified native Chapter II source excerpts", () => {
    const ex6a = getSchoenbergSourceMaterial("s01.ex6a");
    const ex7a = getSchoenbergSourceMaterial("s01.ex7a");
    const ex8a = getSchoenbergSourceMaterial("s01.ex8a");

    expect(ex6a?.kind).toBe("score");
    expect(ex7a?.kind).toBe("score");
    expect(ex8a?.kind).toBe("score");
    if (
      !ex6a || ex6a.kind !== "score" ||
      !ex7a || ex7a.kind !== "score" ||
      !ex8a || ex8a.kind !== "score"
    ) return;

    expect(ex6a.events.map((event) => event.midi)).toEqual([
      65, 69, 72, null,
    ]);
    expect(ex6a.events.map((event) => event.duration)).toEqual([2, 2, 2, 2]);
    expect(ex6a.meter).toBeUndefined();

    expect(ex7a.events.map((event) => event.midi)).toEqual([70, 77, 74]);
    expect(ex7a.events.map((event) => event.duration)).toEqual([2, 4, 4]);
    expect(ex7a.events[0]?.barAfter).toBe(true);
    expect(ex7a.meter).toBeUndefined();

    expect(ex8a.events.map((event) => event.midi)).toEqual([65, 69, 70, 72]);
    expect(ex8a.events.map((event) => event.duration)).toEqual([4, 3, 1, 4]);
  });

  it("stores Beethoven 5 Ex. 12b as playable native note data", () => {
    const material = getSchoenbergSourceMaterial("s02.ex12b");
    expect(material?.kind).toBe("score");
    if (!material || material.kind !== "score") return;

    expect(material.events.slice(0, 4).map((event) => event.midi)).toEqual([
      67, 67, 67, 63,
    ]);
    expect(material.events.slice(4, 8).map((event) => event.midi)).toEqual([
      65, 65, 65, 62,
    ]);
  });

  it("stores Exs. 17a-19a as the printed broken-chord progression of techniques", () => {
    const ex17a = getSchoenbergSourceMaterial("s02.ex17a");
    const ex18a = getSchoenbergSourceMaterial("s02.ex18a");
    const ex19a = getSchoenbergSourceMaterial("s02.ex19a");

    expect(ex17a?.kind).toBe("score");
    expect(ex18a?.kind).toBe("score");
    expect(ex19a?.kind).toBe("score");
    if (
      !ex17a || ex17a.kind !== "score" ||
      !ex18a || ex18a.kind !== "score" ||
      !ex19a || ex19a.kind !== "score"
    ) return;

    expect(ex17a.events.map((event) => event.midi)).toEqual([72, 69, 65, 69]);
    expect(ex17a.events.map((event) => event.duration)).toEqual([2, 2, 2, 2]);

    expect(ex18a.events.map((event) => event.midi)).toEqual([
      72, 70, 69, 65, 69,
    ]);
    expect(ex18a.events.map((event) => event.duration)).toEqual([2, 1, 1, 2, 2]);

    expect(ex19a.events.map((event) => event.midi)).toEqual([69, 65, 60, 65]);
    expect(ex19a.events.map((event) => event.duration)).toEqual([2, 2, 2, 2]);
  });

  it("stores Ex. 14 diminution and augmentation as the same pitches at different scales", () => {
    const diminution = getSchoenbergSourceMaterial("s02.ex14b");
    const augmentation = getSchoenbergSourceMaterial("s02.ex14c");
    expect(diminution?.kind).toBe("score");
    expect(augmentation?.kind).toBe("score");
    if (
      !diminution || diminution.kind !== "score" ||
      !augmentation || augmentation.kind !== "score"
    ) return;

    const pitches = [67, 64, 60, 69, 65, 62, 61, 67];
    expect(diminution.events.map((event) => event.midi)).toEqual(pitches);
    expect(augmentation.events.map((event) => event.midi)).toEqual(pitches);
    expect(diminution.events.map((event) => event.duration)).toEqual(
      Array(8).fill(1),
    );
    expect(augmentation.events.map((event) => event.duration)).toEqual(
      Array(8).fill(4),
    );
    expect(diminution.meter).toBeUndefined();
    expect(augmentation.meter).toBeUndefined();
  });

  it("makes every native source score interactive beyond passive playback", () => {
    const scores = Object.values(schoenbergSourceMaterial).filter(
      (material) => material.kind === "score",
    );

    expect(scores.length).toBeGreaterThanOrEqual(8);
    for (const score of scores) {
      if (score.kind !== "score") continue;
      expect(score.analysis?.length ?? 0, score.id).toBeGreaterThan(0);

      for (const segment of score.analysis ?? []) {
        if (
          segment.startEvent === undefined ||
          segment.endEvent === undefined
        ) continue;
        expect(segment.startEvent, score.id + " " + segment.label)
          .toBeGreaterThanOrEqual(0);
        expect(segment.endEvent, score.id + " " + segment.label)
          .toBeLessThan(score.events.length);
        expect(segment.endEvent).toBeGreaterThanOrEqual(segment.startEvent);
      }
    }
  });

  it("keeps Chapter VIII literature examples separate and source-specific", () => {
    const ids = [
      "s05.ex52",
      "s05.ex53",
      "s05.ex54-56",
      "s05.ex57-58",
      "s05.ex59",
      "s05.ex60",
      "s05.ex61",
    ];

    for (const id of ids) {
      const material = getSchoenbergSourceMaterial(id);
      expect(material?.kind, id).toBe("map");
      if (!material || material.kind !== "map") continue;
      expect(material.segments.length, id).toBeGreaterThanOrEqual(4);
    }

    const ex59 = getSchoenbergSourceMaterial("s05.ex59");
    const ex60 = getSchoenbergSourceMaterial("s05.ex60");
    const ex61 = getSchoenbergSourceMaterial("s05.ex61");

    expect(
      ex59?.kind === "map"
        ? ex59.segments.some((segment) =>
            segment.detail.includes("omitting"),
          )
        : false,
    ).toBe(true);
    expect(
      ex60?.kind === "map"
        ? ex60.segments.some((segment) => segment.detail.includes("VI"))
        : false,
    ).toBe(true);
    expect(
      ex61?.kind === "map"
        ? ex61.segments.some((segment) =>
            (segment.label + " " + segment.detail).includes(
              "developing variation",
            ),
          )
        : false,
    ).toBe(true);
  });

  it("never names a specific example without in-app source material", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        const reference = exercise.source?.reference ?? "";
        const namesExample = /\bExample(?:s)?\b|\bEx\.?\s*\d/i.test(reference);
        if (!namesExample) continue;
        expect(
          exercise.source?.exampleIds?.length ?? 0,
          `${lesson.id} · ${exercise.id} · ${reference}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("covers all five lessons with in-app source material", () => {
    for (const lesson of lessons) {
      const sourceExerciseCount = lesson.exercises.filter(
        (exercise) => (exercise.source?.exampleIds?.length ?? 0) > 0,
      ).length;
      expect(sourceExerciseCount, lesson.id).toBeGreaterThan(0);
    }
  });
});
