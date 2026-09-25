import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  sourceContentStartX,
  sourceDisplayedAccidental,
  sourceNoteSpelling,
  sourceStemDirection,
  SchoenbergSourceMaterial,
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

  it("spells flat-key pitches on the correct staff positions", () => {
    expect(sourceNoteSpelling(51, -3).step).toBe(
      sourceNoteSpelling(52, 0).step,
    ); // E-flat uses the E position
    expect(sourceNoteSpelling(46, -3).step).toBe(
      sourceNoteSpelling(47, 0).step,
    ); // B-flat uses the B position
  });

  it("spells sharp-key pitches on the correct staff positions", () => {
    expect(sourceNoteSpelling(63, 4).step).toBe(
      sourceNoteSpelling(62, 0).step,
    ); // D-sharp uses the D position
  });

  it("shows accidentals relative to the key signature", () => {
    expect(sourceDisplayedAccidental(51, -3)).toBe("");
    expect(sourceDisplayedAccidental(52, -3)).toBe("♮");
    expect(sourceDisplayedAccidental(61, 1)).toBe("♯");
    expect(sourceDisplayedAccidental(61, -2)).toBe("♭");
  });

  it("uses conventional stem direction around the middle staff line", () => {
    expect(sourceStemDirection([60], "treble")).toBe("up");
    expect(sourceStemDirection([77], "treble")).toBe("down");
    expect(sourceStemDirection([43], "bass")).toBe("up");
    expect(sourceStemDirection([55], "bass")).toBe("down");
  });

  it("keeps grand-staff examples at grand-staff height", () => {
    const html = renderToStaticMarkup(
      <SchoenbergSourceMaterial id="s04.ex35a" />,
    );

    expect(html).toContain("source-score-svg is-grand");
  });

  it("does not add a separate analytical-extraction heading", () => {
    const html = renderToStaticMarkup(
      <SchoenbergSourceMaterial id="s01.ex4c" />,
    );

    expect(html).toContain("Ex. 4c");
    expect(html).not.toContain("Analytical extraction");
  });

  it("keeps compact examples compact when no meter is printed", () => {
    expect(sourceContentStartX(score({ keySignature: -1 }))).toBe(130);
  });
});
