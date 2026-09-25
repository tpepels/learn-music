import { describe, expect, it } from "vitest";
import {
  sourceContentStartX,
  sourceStemDirection,
} from "./SchoenbergSourceMaterial";
import type { SchoenbergSourceScore } from "../music/schoenbergSourceMaterial";

function score(overrides: Partial<SchoenbergSourceScore> = {}): SchoenbergSourceScore {
  return {
    kind: "score",
    id: "test",
    reference: "Test",
    title: "Test",
    attribution: "Test",
    fidelity: "verified-excerpt",
    fidelityNote: "Test fidelity note long enough for the schema.",
    clef: "treble",
    keyLabel: "C major",
    bpm: 90,
    events: [{ midi: 60, duration: 2 }],
    ...overrides,
  };
}

describe("Schoenberg source score layout", () => {
  it("moves the music right when key and time signatures need more room", () => {
    const plain = sourceContentStartX(score());
    const threeFlats = sourceContentStartX(
      score({ keySignature: -3, meter: "3/4" }),
    );

    expect(plain).toBe(130);
    expect(threeFlats).toBeGreaterThan(150);

    const meterX = 84 + 3 * 13;
    expect(threeFlats - meterX).toBeGreaterThanOrEqual(38);
  });

  it("uses conventional stem direction around the middle staff line", () => {
    expect(sourceStemDirection([60], "treble")).toBe("up");
    expect(sourceStemDirection([77], "treble")).toBe("down");
    expect(sourceStemDirection([43], "bass")).toBe("up");
    expect(sourceStemDirection([55], "bass")).toBe("down");
  });

  it("keeps compact examples compact when no meter is printed", () => {
    expect(sourceContentStartX(score({ keySignature: -1 }))).toBe(130);
  });
});
