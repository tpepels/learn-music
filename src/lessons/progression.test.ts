import { describe, expect, it } from "vitest";
import {
  belkinLessons,
  getNextImplementedLesson,
  implementedLessons,
  learningTracks,
  levineLessons,
  playLabLessons,
  schoenbergLessons,
} from "./course";
import { getAdvanceDestination } from "./progression";

describe("lesson progression", () => {
  it("keeps the existing curriculum intact and adds separate source-based tracks", () => {
    expect(playLabLessons).toHaveLength(37);
    expect(
      playLabLessons.flatMap((lesson) => lesson.exercises),
    ).toHaveLength(148);
    expect(playLabLessons.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 37 }, (_, index) => index + 1),
    );
    expect(playLabLessons.slice(-9, -5).map((lesson) => lesson.id)).toEqual([
      "pitch.intervals-transposition",
      "harmony.chord-colour",
      "rhythm.phrasing-space",
      "production.gain-staging-loudness",
    ]);
    expect(playLabLessons.slice(-5).map((lesson) => lesson.id)).toEqual([
      "style.house",
      "style.funk",
      "style.hip-hop",
      "style.ambient",
      "style.pop",
    ]);

    expect(schoenbergLessons).toHaveLength(18);
    expect(schoenbergLessons.map((lesson) => lesson.id)).toEqual([
      "schoenberg.phrase-motive",
      "schoenberg.developing-variation",
      "schoenberg.connecting-motive-forms",
      "schoenberg.beginning-sentence",
      "schoenberg.completing-sentence",
      "schoenberg.period",
      "schoenberg.accompaniment",
      "schoenberg.character-mood",
      "schoenberg.melody-theme",
      "schoenberg.self-criticism",
      "schoenberg.small-ternary",
      "schoenberg.irregular-construction",
      "schoenberg.minuet",
      "schoenberg.scherzo",
      "schoenberg.theme-variations",
      "schoenberg.large-form-functions",
      "schoenberg.rondo",
      "schoenberg.sonata-allegro",
    ]);
    expect(belkinLessons.map((lesson) => lesson.id)).toEqual([
      "belkin.punctuating",
      "belkin.presenting",
      "belkin.binary-form",
      "belkin.contrasting",
      "belkin.connecting",
      "belkin.progressing",
    ]);
    expect(levineLessons.map((lesson) => lesson.id)).toEqual([
      "levine.intervals-triads",
      "levine.major-modes-ii-v-i",
      "levine.three-note-voicings",
    ]);
    expect(implementedLessons).toHaveLength(64);
    expect(learningTracks.map((track) => track.id)).toEqual([
      "play-lab",
      "schoenberg",
      "belkin",
      "levine",
    ]);
    expect(getNextImplementedLesson("belkin.binary-form")?.id).toBe(
      "belkin.contrasting",
    );
    expect(getNextImplementedLesson("belkin.contrasting")?.id).toBe(
      "belkin.connecting",
    );
    expect(getNextImplementedLesson("belkin.connecting")?.id).toBe(
      "belkin.progressing",
    );
    expect(getNextImplementedLesson("belkin.progressing")).toBeUndefined();
  });

  it("advances from one exercise to the next inside a lesson", () => {
    const lesson = implementedLessons[0];
    expect(getAdvanceDestination(lesson, 0, implementedLessons[1])).toEqual({
      type: "exercise",
      exerciseIndex: 1,
    });
  });

  it("advances directly from the final exercise to the next lesson within each track", () => {
    for (const track of learningTracks) {
      for (let index = 0; index < track.lessons.length - 1; index += 1) {
        const lesson = track.lessons[index];
        const nextLesson = getNextImplementedLesson(lesson.id);

        expect(
          getAdvanceDestination(
            lesson,
            lesson.exercises.length - 1,
            nextLesson,
          ),
        ).toEqual({
          type: "lesson",
          lessonId: track.lessons[index + 1].id,
        });
      }
    }
  });

  it("marks the end of each learning track after its final lesson", () => {
    for (const track of learningTracks) {
      const lesson = track.lessons[track.lessons.length - 1];
      expect(
        getAdvanceDestination(
          lesson,
          lesson.exercises.length - 1,
          getNextImplementedLesson(lesson.id),
        ),
      ).toEqual({ type: "complete" });
    }
  });
});
