import { describe, expect, it } from "vitest";
import { Note } from "tonal";
import {
  schoenbergSourceExamples,
  type SchoenbergSourceExampleId,
} from "./schoenbergSourceExamples";
import {
  schoenbergPhraseMotiveLesson,
} from "../lessons/schoenbergPhraseMotive";
import {
  schoenbergDevelopingVariationLesson,
} from "../lessons/schoenbergDevelopingVariation";
import {
  schoenbergConnectingMotiveFormsLesson,
} from "../lessons/schoenbergConnectingMotiveForms";
import {
  schoenbergBeginningSentenceLesson,
} from "../lessons/schoenbergBeginningSentence";
import {
  schoenbergCompletingSentenceLesson,
} from "../lessons/schoenbergCompletingSentence";

describe("Schoenberg native source examples", () => {
  it("keeps every source event and analysis segment inside its score bounds", () => {
    for (const example of Object.values(schoenbergSourceExamples)) {
      expect(example.totalUnits, example.id).toBeGreaterThan(0);
      expect(example.events.length, example.id).toBeGreaterThan(0);
      expect(example.scopeNote, example.id).toBeTruthy();

      for (const event of example.events) {
        expect(event.start, event.id).toBeGreaterThanOrEqual(0);
        expect(event.duration, event.id).toBeGreaterThan(0);
        expect(event.start + event.duration, event.id).toBeLessThanOrEqual(
          example.totalUnits,
        );
        for (const pitch of event.pitches) {
          expect(Note.midi(pitch), example.id + ":" + pitch).not.toBeNull();
        }
      }

      for (const segment of example.segments ?? []) {
        expect(segment.start, segment.id).toBeGreaterThanOrEqual(0);
        expect(segment.end, segment.id).toBeGreaterThan(segment.start);
        expect(segment.end, segment.id).toBeLessThanOrEqual(
          example.totalUnits,
        );
      }
    }
  });

  it("labels every non-full source reconstruction honestly", () => {
    for (const example of Object.values(schoenbergSourceExamples)) {
      if (example.scope !== "full excerpt") {
        expect(example.scopeNote).toMatch(
          /(transcription|extraction|reconstruction|represented|omitted|source)/i,
        );
      }
    }
  });

  it("resolves every native example id used by S01-S05", () => {
    const lessons = [
      schoenbergPhraseMotiveLesson,
      schoenbergDevelopingVariationLesson,
      schoenbergConnectingMotiveFormsLesson,
      schoenbergBeginningSentenceLesson,
      schoenbergCompletingSentenceLesson,
    ];
    const known = new Set(
      Object.keys(schoenbergSourceExamples) as SchoenbergSourceExampleId[],
    );

    const referenced = lessons.flatMap((lesson) =>
      lesson.exercises.flatMap(
        (exercise) => exercise.source?.exampleIds ?? [],
      ),
    );

    expect(referenced.length).toBeGreaterThan(0);
    for (const id of referenced) {
      expect(known.has(id as SchoenbergSourceExampleId), id).toBe(true);
    }
  });

  it("does not use raster score crops in the audited S01-S05 lessons", () => {
    const lessons = [
      schoenbergPhraseMotiveLesson,
      schoenbergDevelopingVariationLesson,
      schoenbergConnectingMotiveFormsLesson,
      schoenbergBeginningSentenceLesson,
      schoenbergCompletingSentenceLesson,
    ];

    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        expect(exercise.source?.examples ?? [], exercise.id).toEqual([]);
      }
    }
  });
});
