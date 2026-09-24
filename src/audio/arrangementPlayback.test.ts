import { describe, expect, it } from "vitest";
import {
  buildArrangementFallbackMelody,
  hasArrangementMelody,
  resolveArrangementFrame,
  resolveArrangementMelodyEvent,
  resolveArrangementMelodyStep,
} from "./arrangementPlayback";
import { initialArrangement } from "../music/model";

describe("arrangement playback mapping", () => {
  it("covers all eight bars before looping", () => {
    const seen = Array.from({ length: 8 }, (_, bar) =>
      resolveArrangementFrame(initialArrangement, bar * 16).barIndex,
    );

    expect(seen).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(resolveArrangementFrame(initialArrangement, 128).barIndex)
      .toBe(0);
  });

  it("reads the current arrangement rather than requiring a frozen copy", () => {
    const arrangement = initialArrangement.map((bar) => ({ ...bar }));
    expect(resolveArrangementFrame(arrangement, 64).bar?.melody).toBe(false);

    arrangement[4].melody = true;

    expect(resolveArrangementFrame(arrangement, 64).bar?.melody).toBe(true);
  });

  it("loops the complete 16-step melody across arrangement bars", () => {
    const steps = [0, 2, 14, 16, 18, 30, 32].map((globalStep) =>
      resolveArrangementMelodyStep(globalStep, 16),
    );

    expect(steps).toEqual([0, 1, 7, 8, 9, 15, 0]);
    expect(resolveArrangementMelodyStep(1, 16)).toBeNull();
  });

  it("uses the learner melody whenever at least one note exists", () => {
    const melody = Array<number | null>(16).fill(null);
    melody[0] = 72;

    expect(hasArrangementMelody(melody)).toBe(true);
    expect(
      resolveArrangementMelodyEvent(
        0,
        melody,
        { tonic: 2, mode: "major" },
      ),
    ).toEqual({
      step: 0,
      midi: 72,
      fallback: false,
    });
  });

  it("gives an empty project an audible key-aware fallback melody", () => {
    const empty = Array<number | null>(16).fill(null);
    const dMajor = { tonic: 2 as const, mode: "major" as const };
    const fallback = buildArrangementFallbackMelody(dMajor);

    expect(hasArrangementMelody(empty)).toBe(false);
    expect(fallback.slice(0, 4)).toEqual([62, 64, 66, 69]);
    expect(
      resolveArrangementMelodyEvent(0, empty, dMajor),
    ).toEqual({
      step: 0,
      midi: 62,
      fallback: true,
    });
    expect(resolveArrangementMelodyEvent(1, empty, dMajor)).toBeNull();
  });

  it("builds the fallback from the current minor scale rather than C major", () => {
    const aMinor = buildArrangementFallbackMelody({
      tonic: 9,
      mode: "natural-minor",
    });

    expect(aMinor.slice(0, 4)).toEqual([69, 71, 72, 76]);
  });
});
