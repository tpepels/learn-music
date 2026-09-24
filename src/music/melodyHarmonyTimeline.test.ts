import { describe, expect, it } from "vitest";
import {
  chordSlotForMelodyStep,
  melodyHarmonyFrame,
} from "./melodyHarmonyTimeline";

describe("melody/harmony timeline", () => {
  it("loops the two-bar melody once across four one-bar chord slots", () => {
    expect(melodyHarmonyFrame(0, 16)).toEqual({
      playbackStep: 0,
      barIndex: 0,
      melodyStep: 0,
      localBarStep: 0,
    });
    expect(melodyHarmonyFrame(8, 16)).toEqual({
      playbackStep: 8,
      barIndex: 1,
      melodyStep: 8,
      localBarStep: 0,
    });
    expect(melodyHarmonyFrame(16, 16)).toEqual({
      playbackStep: 16,
      barIndex: 2,
      melodyStep: 0,
      localBarStep: 0,
    });
    expect(melodyHarmonyFrame(24, 16)).toEqual({
      playbackStep: 24,
      barIndex: 3,
      melodyStep: 8,
      localBarStep: 0,
    });
    expect(melodyHarmonyFrame(31, 16)).toMatchObject({
      barIndex: 3,
      melodyStep: 15,
      localBarStep: 7,
    });
  });

  it("maps the 16 edit steps to the selected harmonic pass", () => {
    expect(chordSlotForMelodyStep(0, 0)).toBe(0);
    expect(chordSlotForMelodyStep(8, 0)).toBe(1);
    expect(chordSlotForMelodyStep(0, 1)).toBe(2);
    expect(chordSlotForMelodyStep(8, 1)).toBe(3);
  });
});
