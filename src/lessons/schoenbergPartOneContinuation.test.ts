import { describe, expect, it } from "vitest";
import {
  SCHOENBERG_PERIOD_IDS,
  initialCompositionStudyState,
  studyPeriodHasCadentialClose,
  studyPeriodHasContrast,
  studyPeriodHasReturn,
  studyPeriodSequence,
} from "../music/study";
import { schoenbergSourceMaterial } from "../music/schoenbergSourceMaterial";
import { schoenbergPeriodLesson } from "./schoenbergPeriod";
import { schoenbergAccompanimentLesson } from "./schoenbergAccompaniment";
import { schoenbergCharacterMoodLesson } from "./schoenbergCharacterMood";
import { schoenbergMelodyThemeLesson } from "./schoenbergMelodyTheme";
import { schoenbergSelfCriticismLesson } from "./schoenbergSelfCriticism";

const lessons = [
  schoenbergPeriodLesson,
  schoenbergAccompanimentLesson,
  schoenbergCharacterMoodLesson,
  schoenbergMelodyThemeLesson,
  schoenbergSelfCriticismLesson,
];

describe("Schoenberg Part I continuation", () => {
  it("implements lessons 6-10 in sequence", () => {
    expect(lessons.map((lesson) => lesson.number)).toEqual([6, 7, 8, 9, 10]);
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "schoenberg.period",
      "schoenberg.accompaniment",
      "schoenberg.character-mood",
      "schoenberg.melody-theme",
      "schoenberg.self-criticism",
    ]);
  });

  it("keeps every new exercise grounded in registered source material", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        expect(exercise.source?.exampleIds?.length ?? 0).toBeGreaterThan(0);
        for (const sourceId of exercise.source?.exampleIds ?? []) {
          expect(schoenbergSourceMaterial[sourceId], sourceId).toBeDefined();
        }
      }
    }
  });

  it("does not invent native notation for the newly added untranscribed chapters", () => {
    const ids = [
      "s06.period-overview",
      "s06.antecedent",
      "s06.consequent",
      "s07.accompaniment-function",
      "s07.accompaniment-space",
      "s07.accompaniment-motive",
      "s07.accompaniment-bass",
      "s08.character",
      "s08.descriptive-motion",
      "s09.vocal-melody",
      "s09.instrumental-melody",
      "s09.melody-theme",
      "s10.self-criticism",
      "s10.diagnostics",
    ];

    for (const id of ids) {
      expect(schoenbergSourceMaterial[id]?.kind, id).toBe("map");
    }
  });

  it("builds a period with contrast, return and a stronger close", () => {
    const period = studyPeriodSequence();
    expect(period.notes).toHaveLength(32);
    expect(studyPeriodHasContrast(period.notes)).toBe(true);
    expect(studyPeriodHasReturn(period.notes)).toBe(true);
    expect(
      studyPeriodHasCadentialClose(period.notes, period.harmony ?? []),
    ).toBe(true);
  });

  it("initializes all period exercises in the composition-study state", () => {
    const state = initialCompositionStudyState();
    for (const id of Object.values(SCHOENBERG_PERIOD_IDS)) {
      expect(state[id], id).toBeDefined();
    }
    expect(state[SCHOENBERG_PERIOD_IDS.compose].notation).toBe("piano-roll");
  });
});
