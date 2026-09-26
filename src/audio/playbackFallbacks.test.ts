import { describe, expect, it } from "vitest";
import {
  initialArrangement,
  initialBassSequence,
  initialHarmonySequence,
  initialPattern,
  type FormSettings,
} from "../music/model";
import {
  chordSymbol,
  diatonicChord,
  type HarmonicProgression,
  type TonalContext,
} from "../music/harmony";
import {
  ensureArrangementAudibleIfEmpty,
  ensureProductionLayersPresent,
  ensureTextureLayersPresent,
  fallbackBassRoot,
  formArrangementFromSettings,
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

  it("only supplies a final-project arrangement when the learner has none", () => {
    const emptyResolved = ensureArrangementAudibleIfEmpty(initialArrangement);
    expect(emptyResolved.every((bar) => Object.values(bar).every(Boolean))).toBe(true);

    const real = initialArrangement.map((bar) => ({ ...bar }));
    real[2].drums = true;
    const resolved = ensureArrangementAudibleIfEmpty(real);

    expect(resolved).toEqual(real);
    expect(resolved).not.toBe(real);
    expect(real[2].drums).toBe(true);
    expect(real[2].bass).toBe(false);
  });

  it("supplies only globally missing texture layers and preserves real arrangement choices", () => {
    const arrangement = initialArrangement.map((bar) => ({ ...bar }));
    arrangement[0].drums = true;
    arrangement[4].drums = true;
    arrangement[4].melody = true;

    const resolved = ensureTextureLayersPresent(arrangement);

    expect(resolved[0].drums).toBe(true);
    expect(resolved[1].drums).toBe(false);
    expect(resolved[0].melody).toBe(false);
    expect(resolved[4].melody).toBe(true);
    expect(resolved.every((bar) => bar.bass)).toBe(true);
    expect(resolved.every((bar) => bar.chords)).toBe(true);

    expect(arrangement[0]).toEqual({
      drums: true,
      bass: false,
      chords: false,
      melody: false,
    });
  });

  it("rebuilds form playback from the latest section-layer state", () => {
    const settings: FormSettings = {
      sections: ["A", "A′", "B", "A"],
      roles: ["statement", "answer", "contrast", "return"],
      layers: Array.from({ length: 4 }, () => ({
        drums: false,
        bass: false,
        chords: false,
        melody: false,
      })),
    };

    const before = formArrangementFromSettings(settings);
    expect(before.slice(0, 4).every((bar) => !bar.drums)).toBe(true);

    settings.layers[0].drums = true;
    const after = formArrangementFromSettings(settings);
    expect(after.slice(0, 4).every((bar) => bar.drums)).toBe(true);
    expect(after.slice(4).every((bar) => !bar.drums)).toBe(true);
  });

  it("uses a full audition mix without mutating sparse arrangement decisions", () => {
    const arrangement = initialArrangement.map((bar) => ({ ...bar }));
    arrangement[0].drums = true;
    arrangement[4].bass = true;

    const resolved = ensureProductionLayersPresent(arrangement);

    expect(resolved).toHaveLength(arrangement.length);
    expect(resolved.every((bar) =>
      Object.values(bar).every(Boolean),
    )).toBe(true);

    expect(arrangement[0]).toEqual({
      drums: true,
      bass: false,
      chords: false,
      melody: false,
    });
    expect(arrangement[4]).toEqual({
      drums: false,
      bass: true,
      chords: false,
      melody: false,
    });
  });
});
