import { describe, expect, it } from "vitest";
import {
  initialArrangement,
  initialBassSequence,
  initialHarmonySequence,
  initialPattern,
} from "../music/model";
import {
  chordSymbol,
  diatonicChord,
  type HarmonicProgression,
  type TonalContext,
} from "../music/harmony";
import {
  ensureProductionLayersPresent,
  fallbackBassRoot,
  hasBassContent,
  hasDrumContent,
  hasWrittenHarmony,
  resolveContextDrumPattern,
  resolveContextProgression,
} from "./playbackFallbacks";

describe("layered playback fallbacks", () => {
  it("gives an empty contextual drum layer an audible groove", () => {
    expect(hasDrumContent(initialPattern)).toBe(false);

    const resolved = resolveContextDrumPattern(initialPattern);

    expect(resolved.kick.some(Boolean)).toBe(true);
    expect(resolved.snare.some(Boolean)).toBe(true);
    expect(resolved.hat.some(Boolean)).toBe(true);
    expect(hasDrumContent(initialPattern)).toBe(false);
  });

  it("never adds fallback hits once the learner has written a drum event", () => {
    const pattern = {
      kick: [...initialPattern.kick],
      snare: [...initialPattern.snare],
      hat: [...initialPattern.hat],
    };
    pattern.kick[3] = true;

    const resolved = resolveContextDrumPattern(pattern);

    expect(resolved).toBe(pattern);
    expect(resolved.kick.filter(Boolean)).toHaveLength(1);
    expect(resolved.snare.some(Boolean)).toBe(false);
    expect(resolved.hat.some(Boolean)).toBe(false);
  });

  it("creates a key-aware I-IV-V-I when harmony has never been written", () => {
    const context: TonalContext = { tonic: 2, mode: "major" };
    const empty: HarmonicProgression = [null, null, null, null];

    const resolved = resolveContextProgression(empty, context);

    expect(resolved.map((chord) => chord && chordSymbol(chord, context)))
      .toEqual(["D", "G", "A", "D"]);
  });

  it("preserves learner harmony as soon as any chord exists", () => {
    const context: TonalContext = { tonic: 0, mode: "major" };
    const progression: HarmonicProgression = [
      diatonicChord(context, 2),
      null,
      null,
      null,
    ];

    expect(resolveContextProgression(progression, context)).toBe(progression);
  });

  it("detects whether written harmony and bass can supply their own audio", () => {
    expect(hasWrittenHarmony(initialHarmonySequence)).toBe(false);
    expect(hasBassContent(initialBassSequence)).toBe(false);

    const harmony = initialHarmonySequence.map((notes) => [...notes]);
    harmony[7] = [60, 64, 67];
    const bass = [...initialBassSequence];
    bass[12] = 36;

    expect(hasWrittenHarmony(harmony)).toBe(true);
    expect(hasBassContent(bass)).toBe(true);
  });

  it("derives a bass fallback from the current tonal context", () => {
    const context: TonalContext = { tonic: 2, mode: "major" };
    expect(fallbackBassRoot([null, null, null, null], context, 0) % 12).toBe(2);
    expect(fallbackBassRoot([null, null, null, null], context, 1) % 12).toBe(7);
    expect(fallbackBassRoot([null, null, null, null], context, 2) % 12).toBe(9);
  });

  it("makes every production fader audible when arrangement work was skipped", () => {
    const resolved = ensureProductionLayersPresent(initialArrangement);

    for (const bar of resolved) {
      expect(bar).toEqual({
        drums: true,
        bass: true,
        chords: true,
        melody: true,
      });
    }

    expect(initialArrangement.every((bar) =>
      Object.values(bar).every((active) => !active),
    )).toBe(true);
  });

  it("preserves existing arrangement decisions and only fills globally absent layers", () => {
    const arrangement = initialArrangement.map((bar) => ({ ...bar }));
    arrangement[0].drums = true;
    arrangement[4].bass = true;

    const resolved = ensureProductionLayersPresent(arrangement);

    expect(resolved.map((bar) => bar.drums)).toEqual([
      true, false, false, false, false, false, false, false,
    ]);
    expect(resolved.map((bar) => bar.bass)).toEqual([
      false, false, false, false, true, false, false, false,
    ]);
    expect(resolved.every((bar) => bar.chords)).toBe(true);
    expect(resolved.every((bar) => bar.melody)).toBe(true);
  });
});
