import { describe, expect, it } from "vitest";
import {
  diatonicChord,
  type HarmonicProgression,
  type TonalContext,
} from "../music/harmony";
import type { ArrangementBar } from "../music/model";
import type { LessonContext } from "./types";
import { schoenbergLargeFormFunctionsLesson } from "./schoenbergLargeFormFunctions";
import { schoenbergRondoLesson } from "./schoenbergRondo";
import { schoenbergSonataAllegroLesson } from "./schoenbergSonataAllegro";

function experiment(changes: number, values: string[] = []) {
  return { changes, min: null, max: null, values };
}

function layers(
  drums: boolean,
  bass: boolean,
  chords: boolean,
  melody: boolean,
): ArrangementBar {
  return { drums, bass, chords, melody };
}

const tonalContext: TonalContext = { tonic: 0, mode: "major" };

function harmonicRoute(): HarmonicProgression {
  return [
    diatonicChord(tonalContext, 1),
    diatonicChord(tonalContext, 4),
    diatonicChord(tonalContext, 2),
    diatonicChord(tonalContext, 5),
  ];
}

function context(overrides: Partial<LessonContext>): LessonContext {
  return {
    experiments: {},
    melody: Array(16).fill(null),
    harmonicProgression: harmonicRoute(),
    arrangement: Array.from({ length: 8 }, () => layers(false, false, false, false)),
    formSettings: {
      sections: ["A", "A′", "B", "A"],
      roles: ["statement", "answer", "contrast", "return"],
      layers: Array.from({ length: 4 }, () => layers(false, false, false, false)),
    },
    ...overrides,
  } as LessonContext;
}

describe("Schoenberg S16-S18 evaluator logic", () => {
  it("recognises a harmonic transition that ends in dominant preparation", () => {
    const checks = schoenbergLargeFormFunctionsLesson.exercises[0].evaluate(
      context({
        experiments: {
          "source.analysis": experiment(4, [
            "s16.transition:0",
            "s16.transition:1",
            "s16.transition:2",
            "s16.transition:3",
          ]),
          "harmony.chord.0": experiment(3),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises motivic liquidation into a retransition residue", () => {
    const melody = [
      60, 62, 64, 65,
      67, 65, 64, 62,
      60, 62, null, null,
      60, null, null, null,
    ];
    const checks = schoenbergLargeFormFunctionsLesson.exercises[1].evaluate(
      context({
        melody,
        experiments: {
          "source.analysis": experiment(4, [
            "s16.retransition:0",
            "s16.retransition:1",
            "s16.retransition:2",
            "s16.retransition:3",
          ]),
          "melody.edit": experiment(5),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises a contrasting but internally related subordinate group", () => {
    const a = layers(true, true, true, false);
    const b1 = layers(true, false, false, true);
    const b2 = layers(true, true, false, true);
    const checks = schoenbergLargeFormFunctionsLesson.exercises[2].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "B", "A′"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [a, b1, b2, a],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s16.subordinate-group:0",
            "s16.subordinate-group:1",
            "s16.subordinate-group:2",
            "s16.subordinate-group:3",
          ]),
          "form.layer.test": experiment(4),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises a reduced coda after a fuller return", () => {
    const opening = layers(true, true, true, false);
    const contrast = layers(true, false, false, true);
    const returning = layers(true, true, true, true);
    const coda = layers(true, true, false, false);
    const checks = schoenbergLargeFormFunctionsLesson.exercises[3].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "A′", "A′"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [opening, contrast, returning, coda],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s16.coda:0",
            "s16.coda:1",
            "s16.coda:2",
            "s16.coda:3",
          ]),
          "form.layer.test": experiment(4),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises refrain, episodes and return in the rondo model", () => {
    const a = layers(true, true, true, false);
    const b = layers(true, false, false, true);
    const c = layers(false, true, true, true);
    const checks = schoenbergRondoLesson.exercises[0].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "A", "C"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [a, b, { ...a }, c],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s17.rondo-types:0",
            "s17.rondo-types:1",
            "s17.rondo-types:2",
            "s17.rondo-types:3",
          ]),
          "form.layer.test": experiment(5),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises a varied but identifiable refrain", () => {
    const a = layers(true, true, true, false);
    const b = layers(true, false, false, true);
    const aPrime = layers(true, true, false, true);
    const c = layers(false, true, true, true);
    const checks = schoenbergRondoLesson.exercises[1].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "A′", "C"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [a, b, aPrime, c],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s17.return-variation:0",
            "s17.return-variation:1",
            "s17.return-variation:2",
            "s17.return-variation:3",
          ]),
          "form.layer.test": experiment(5),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises adapted subordinate material", () => {
    const melody = [
      60, 62, 64, null,
      67, null, 65, null,
      60, 62, 65, null,
      null, null, null, null,
    ];
    const checks = schoenbergRondoLesson.exercises[2].evaluate(
      context({
        melody,
        experiments: {
          "source.analysis": experiment(4, [
            "s17.subordinate-return:0",
            "s17.subordinate-return:1",
            "s17.subordinate-return:2",
            "s17.subordinate-return:3",
          ]),
          "melody.edit": experiment(5),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises a developmental C section in the sonata-rondo model", () => {
    const a = layers(true, true, true, false);
    const b = layers(true, false, false, true);
    const c = layers(true, true, false, true);
    const checks = schoenbergRondoLesson.exercises[3].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "A", "C"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [a, b, { ...a }, c],
        },
        experiments: {
          "source.analysis": experiment(4, [
            "s17.sonata-rondo:0",
            "s17.sonata-rondo:1",
            "s17.sonata-rondo:2",
            "s17.sonata-rondo:3",
          ]),
          "form.layer.test": experiment(6),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises the four functions of a compressed exposition", () => {
    const principal = layers(true, true, true, false);
    const transition = layers(true, true, false, false);
    const subordinate = layers(true, false, false, true);
    const closing = layers(true, false, false, true);
    const arrangement = [
      principal,
      principal,
      transition,
      transition,
      subordinate,
      subordinate,
      closing,
      closing,
    ];
    const checks = schoenbergSonataAllegroLesson.exercises[0].evaluate(
      context({
        arrangement,
        experiments: {
          "source.analysis": experiment(4, [
            "s18.exposition:0",
            "s18.exposition:1",
            "s18.exposition:2",
            "s18.exposition:3",
          ]),
          "arrangement.edit": experiment(6),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises related elaboration followed by liquidation", () => {
    const melody = [
      60, 62, 64, null,
      60, 63, 64, null,
      62, 64, 60, null,
      60, null, null, null,
    ];
    const checks = schoenbergSonataAllegroLesson.exercises[1].evaluate(
      context({
        melody,
        experiments: {
          "source.analysis": experiment(5, [
            "s18.elaboration:0",
            "s18.elaboration:1",
            "s18.elaboration:2",
            "s18.elaboration:3",
            "s18.elaboration:4",
          ]),
          "melody.edit": experiment(8),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises dominant preparation before recapitulation", () => {
    const checks = schoenbergSonataAllegroLesson.exercises[2].evaluate(
      context({
        experiments: {
          "source.analysis": experiment(4, [
            "s18.retransition:0",
            "s18.retransition:1",
            "s18.retransition:2",
            "s18.retransition:3",
          ]),
          "harmony.chord.0": experiment(3),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });

  it("recognises the full stability-instability-preparation-return arc", () => {
    const exposition = layers(true, true, true, false);
    const elaboration = layers(true, false, false, true);
    const retransition = layers(true, false, false, false);
    const recapitulation = layers(true, true, false, true);
    const checks = schoenbergSonataAllegroLesson.exercises[3].evaluate(
      context({
        formSettings: {
          sections: ["A", "B", "C", "A′"],
          roles: ["statement", "answer", "contrast", "return"],
          layers: [exposition, elaboration, retransition, recapitulation],
        },
        experiments: {
          "source.analysis": experiment(8, [
            "s18.sonata-architecture:0",
            "s18.sonata-architecture:1",
            "s18.sonata-architecture:2",
            "s18.sonata-architecture:3",
            "s18.recapitulation-coda:0",
            "s18.recapitulation-coda:1",
            "s18.recapitulation-coda:2",
            "s18.recapitulation-coda:3",
          ]),
          "form.layer.test": experiment(7),
          "transport.play": experiment(1),
        },
      }),
    );
    expect(checks.every((check) => check.complete)).toBe(true);
  });
});
