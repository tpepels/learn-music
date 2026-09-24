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
