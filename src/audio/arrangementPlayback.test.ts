import { describe, expect, it } from "vitest";
import {
  resolveArrangementFrame,
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
});
