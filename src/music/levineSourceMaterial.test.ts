import { describe, expect, it } from "vitest";
import {
  getLevineSourceMaterial,
  levineSourceMaterial,
} from "./levineSourceMaterial";

describe("Levine source material", () => {
  it("keeps every source representation explicit about fidelity", () => {
    for (const material of Object.values(levineSourceMaterial)) {
      expect(material.fidelityNote.length, material.id).toBeGreaterThan(20);
      if (material.kind === "score") {
        expect(material.events.length, material.id).toBeGreaterThan(0);
        expect(material.analysis?.length ?? 0, material.id).toBeGreaterThan(0);
      } else {
        expect(material.segments.length, material.id).toBeGreaterThan(0);
      }
    }
  });

  it("stores the complete middle-C interval chart", () => {
    const material = getLevineSourceMaterial("l01.fig1-1");
    expect(material?.kind).toBe("score");
    if (!material || material.kind !== "score") return;

    expect(material.events).toHaveLength(12);
    expect(
      material.events.map((event) =>
        Array.isArray(event.midi) ? event.midi[1] : null,
      ),
    ).toEqual([61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]);
    expect(material.events[0]?.accidentals).toEqual([null, "♭"]);
    expect(material.events[5]?.accidentals).toEqual([null, "♯"]);
  });

  it("stores the four C triad qualities exactly", () => {
    const material = getLevineSourceMaterial("l01.fig1-6");
    expect(material?.kind).toBe("score");
    if (!material || material.kind !== "score") return;

    expect(material.events.map((event) => event.midi)).toEqual([
      [60, 64, 67],
      [60, 63, 67],
      [60, 63, 66],
      [60, 64, 68],
    ]);
    expect(material.events[1]?.accidentals).toEqual([null, "♭", null]);
    expect(material.events[2]?.accidentals).toEqual([null, "♭", "♭"]);
    expect(material.events[3]?.accidentals).toEqual([null, null, "♯"]);
  });

  it("stores both major and minor inversion cycles", () => {
    const material = getLevineSourceMaterial("l01.fig1-7");
    expect(material?.kind).toBe("score");
    if (!material || material.kind !== "score") return;

    expect(material.events.map((event) => event.midi)).toEqual([
      [60, 64, 67],
      [64, 67, 72],
      [67, 72, 76],
      [60, 63, 67],
      [63, 67, 72],
      [67, 72, 75],
    ]);
  });

  it("derives the three central seventh-chord qualities from the modes", () => {
    const ionian = getLevineSourceMaterial("l02.fig2-2");
    const dorian = getLevineSourceMaterial("l02.fig2-4");
    const mixolydian = getLevineSourceMaterial("l02.fig2-6");

    expect(ionian?.kind).toBe("score");
    expect(dorian?.kind).toBe("score");
    expect(mixolydian?.kind).toBe("score");
    if (
      !ionian || ionian.kind !== "score" ||
      !dorian || dorian.kind !== "score" ||
      !mixolydian || mixolydian.kind !== "score"
    ) return;

    expect(ionian.events.at(-1)?.midi).toEqual([60, 64, 67, 71]);
    expect(dorian.events.at(-1)?.midi).toEqual([62, 65, 69, 72]);
    expect(mixolydian.events.at(-1)?.midi).toEqual([67, 71, 74, 77]);
  });

  it("stores both three-note II-V-I source positions", () => {
    const first = getLevineSourceMaterial("l03.fig3-2");
    const second = getLevineSourceMaterial("l03.fig3-4");

    expect(first?.kind).toBe("score");
    expect(second?.kind).toBe("score");
    if (
      !first || first.kind !== "score" ||
      !second || second.kind !== "score"
    ) return;

    expect(first.events.map((event) => event.midi)).toEqual([
      50,
      [65, 72],
      43,
      [65, 71],
      48,
      [64, 71],
    ]);
    expect(second.events.map((event) => event.midi)).toEqual([
      50,
      [60, 65],
      43,
      [59, 65],
      48,
      [59, 64],
    ]);
    expect(first.events.map((event) => event.staff)).toEqual([
      "bass", "treble", "bass", "treble", "bass", "treble",
    ]);
  });

  it("keeps Chapters Four through Eleven as source-analysis maps rather than invented score transcriptions", () => {
    const ids = [
      "l04.sus-construction",
      "l04.sus-third",
      "l04.phrygian",
      "l04.ii-v-compression",
      "l05.add-to-shells",
      "l05.dominant-colour",
      "l05.major-colour-context",
      "l05.special-chords",
      "l06.basic-substitution",
      "l06.shared-tritone",
      "l06.dual-resolution",
      "l06.substitute-ii-v",
      "l07.rootless-purpose",
      "l07.a-position",
      "l07.b-position",
      "l07.cycle-practice",
      "l08.half-diminished",
      "l08.dominant-alterations",
      "l08.sharp-eleven-minor-major",
      "l08.diminished-derivation",
      "l08.sus-phrygian-selection",
      "l09.major-scale-harmony",
      "l09.melodic-minor-harmony",
      "l09.half-diminished-modes",
      "l09.diminished-harmony",
      "l09.whole-tone-harmony",
      "l10.sequence-linking",
      "l10.continuous-entry",
      "l10.pattern-variants",
      "l10.musical-use",
      "l11.starting-notes",
      "l11.key-rotation",
      "l11.symmetric-practice",
      "l11.fingering",
    ];

    for (const id of ids) {
      const material = getLevineSourceMaterial(id);
      expect(material?.kind, id).toBe("map");
      if (!material || material.kind !== "map") continue;
      expect(material.segments.length, id).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps source-card titles and analysis labels free of book indices", () => {
    const bookIndex = /\b(?:Figure|Chapter)\s+\d/i;

    for (const material of Object.values(levineSourceMaterial)) {
      expect(material.title, material.id).not.toMatch(bookIndex);
      const segments =
        material.kind === "score" ? material.analysis ?? [] : material.segments;
      for (const segment of segments) {
        expect(segment.label, material.id).not.toMatch(bookIndex);
        expect(segment.detail, material.id).not.toMatch(bookIndex);
      }
    }
  });
});
