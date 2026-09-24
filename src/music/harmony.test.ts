import { describe, expect, it } from "vitest";
import {
  basicHarmonyPalette,
  borrowedMajorPalette,
  chordMidi,
  chordSymbol,
  diatonicChord,
  diatonicPalette,
  harmonicBassChordToneMidis,
  harmonicBassRootMidi,
  harmonicVoiceLeadingDistance,
  inferLegacyTonalContext,
  legacyChordToHarmonic,
  migrateLegacyProgression,
  progressionSymbols,
  romanNumeral,
  scaleDegreePitchClass,
  voicedHarmonicChordMidi,
  type TonalContext,
} from "./harmony";

const C_MAJOR: TonalContext = { tonic: 0, mode: "major" };
const D_MAJOR: TonalContext = { tonic: 2, mode: "major" };
const E_FLAT_MAJOR: TonalContext = { tonic: 3, mode: "major" };

describe("key-agnostic harmony", () => {
  it("generates major-key triads from harmonic degree rather than chord names", () => {
    expect(diatonicPalette(C_MAJOR).map((chord) => chordSymbol(chord, C_MAJOR))).toEqual([
      "C", "Dm", "Em", "F", "G", "Am", "Bdim",
    ]);
    expect(diatonicPalette(D_MAJOR).map((chord) => chordSymbol(chord, D_MAJOR))).toEqual([
      "D", "Em", "F♯m", "G", "A", "Bm", "C♯dim",
    ]);
    expect(diatonicPalette(E_FLAT_MAJOR).map((chord) => chordSymbol(chord, E_FLAT_MAJOR))).toEqual([
      "E♭", "Fm", "Gm", "A♭", "B♭", "Cm", "Ddim",
    ]);
  });

  it("generates natural- and harmonic-minor triads correctly", () => {
    const aNatural: TonalContext = { tonic: 9, mode: "natural-minor" };
    const aHarmonic: TonalContext = { tonic: 9, mode: "harmonic-minor" };

    expect(diatonicPalette(aNatural).map((chord) => chordSymbol(chord, aNatural))).toEqual([
      "Am", "Bdim", "C", "Dm", "Em", "F", "G",
    ]);
    expect(diatonicPalette(aHarmonic).map((chord) => chordSymbol(chord, aHarmonic))).toEqual([
      "Am", "Bdim", "Caug", "Dm", "E", "F", "G♯dim",
    ]);
  });

  it("keeps Roman-numeral identity independent of tonic", () => {
    const c = [1, 4, 5, 1].map((degree) =>
      diatonicChord(C_MAJOR, degree as 1 | 4 | 5),
    );
    const d = [1, 4, 5, 1].map((degree) =>
      diatonicChord(D_MAJOR, degree as 1 | 4 | 5),
    );

    expect(c.map((chord) => romanNumeral(chord, C_MAJOR))).toEqual(["I", "IV", "V", "I"]);
    expect(d.map((chord) => romanNumeral(chord, D_MAJOR))).toEqual(["I", "IV", "V", "I"]);
  });

  it("transposes I-IV-V-I through C, D, and E-flat by changing only tonal context", () => {
    const progression = [1, 4, 5, 1].map((degree) =>
      diatonicChord(C_MAJOR, degree as 1 | 4 | 5),
    );
    expect(progressionSymbols(progression, C_MAJOR)).toEqual(["C", "F", "G", "C"]);
    expect(progressionSymbols(progression, D_MAJOR)).toEqual(["D", "G", "A", "D"]);
    expect(progressionSymbols(progression, E_FLAT_MAJOR)).toEqual(["E♭", "A♭", "B♭", "E♭"]);
  });

  it("derives MIDI notes, bass roots, chord tones, and inversions after transposition", () => {
    const tonic = diatonicChord(C_MAJOR, 1);
    expect(chordMidi(tonic, C_MAJOR)).toEqual([48, 52, 55]);
    expect(chordMidi(tonic, D_MAJOR)).toEqual([50, 54, 57]);
    expect(harmonicBassRootMidi(tonic, D_MAJOR)).toBe(38);
    expect(harmonicBassChordToneMidis(tonic, D_MAJOR)).toEqual([38, 42, 45]);
    expect(voicedHarmonicChordMidi(tonic, D_MAJOR, 1)).toEqual([42, 45, 50]);
  });

  it("keeps voice-leading calculations key-independent under exact transposition", () => {
    const progression = [1, 4, 5, 1].map((degree) =>
      diatonicChord(C_MAJOR, degree as 1 | 4 | 5),
    );
    const inversions = [0, 1, 2, 0] as const;
    expect(
      harmonicVoiceLeadingDistance(progression, C_MAJOR, [...inversions]),
    ).toBe(
      harmonicVoiceLeadingDistance(progression, D_MAJOR, [...inversions]),
    );
  });

  it("spells borrowed chords and secondary dominants from function", () => {
    const borrowed = borrowedMajorPalette(E_FLAT_MAJOR);
    expect(borrowed.slice(-2).map((chord) => chordSymbol(chord, E_FLAT_MAJOR))).toEqual([
      "A♭m",
      "D♭",
    ]);
    expect(borrowed.slice(-2).map((chord) => romanNumeral(chord, E_FLAT_MAJOR))).toEqual([
      "iv",
      "♭VII",
    ]);

    const secondary = basicHarmonyPalette(D_MAJOR).at(-1)!;
    expect(chordSymbol(secondary, D_MAJOR)).toBe("E7");
    expect(romanNumeral(secondary, D_MAJOR)).toBe("V7/V");
  });

  it("preserves scale-degree spelling in sharp and flat keys", () => {
    expect(scaleDegreePitchClass(D_MAJOR, 7)).toBe(1);
    expect(chordSymbol(diatonicChord(D_MAJOR, 7), D_MAJOR)).toBe("C♯dim");
    expect(chordSymbol(diatonicChord(E_FLAT_MAJOR, 4), E_FLAT_MAJOR)).toBe("A♭");
  });

  it("migrates legacy C-major and A-minor symbols without changing their sound", () => {
    const cLegacy = ["C", "F", "G", "C"];
    const cContext = inferLegacyTonalContext(cLegacy);
    const cMigrated = migrateLegacyProgression(cLegacy, cContext);
    expect(cContext).toEqual(C_MAJOR);
    expect(progressionSymbols(cMigrated, cContext)).toEqual(cLegacy);

    const aLegacy = ["Am", "Dm", "E7", "Am"];
    const aContext = inferLegacyTonalContext(aLegacy);
    const aMigrated = migrateLegacyProgression(aLegacy, aContext);
    expect(aContext).toEqual({ tonic: 9, mode: "natural-minor" });
    expect(progressionSymbols(aMigrated, aContext)).toEqual(aLegacy);
    expect(romanNumeral(aMigrated[2]!, aContext)).toBe("V7/i");
  });

  it("maps legacy special chords to structural roles", () => {
    expect(legacyChordToHarmonic("Fm", C_MAJOR)).toMatchObject({
      degree: 4,
      quality: "minor",
      role: "borrowed",
    });
    expect(legacyChordToHarmonic("B♭", C_MAJOR)).toMatchObject({
      degree: 7,
      rootAlteration: -1,
      quality: "major",
      role: "borrowed",
    });
    expect(legacyChordToHarmonic("D7", C_MAJOR)).toMatchObject({
      degree: 2,
      quality: "major",
      seventh: "minor",
      role: "secondary-dominant",
      targetDegree: 5,
    });
  });
});
