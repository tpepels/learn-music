import { describe, expect, it, vi } from "vitest";
import { syncEighthNoteDelay } from "./tempoSync";

describe("tempo-synced delay", () => {
  it("retimes an eighth-note delay when BPM changes", () => {
    const rampTo = vi.fn();

    expect(syncEighthNoteDelay({ rampTo }, 120)).toBeCloseTo(0.25);
    expect(rampTo).toHaveBeenCalledWith(0.25, 0.05);

    expect(syncEighthNoteDelay({ rampTo }, 60)).toBeCloseTo(0.5);
    expect(rampTo).toHaveBeenLastCalledWith(0.5, 0.05);
  });

  it("allows an immediate retime when preparing playback", () => {
    const rampTo = vi.fn();

    syncEighthNoteDelay({ rampTo }, 96, 0);

    expect(rampTo).toHaveBeenCalledWith(0.3125, 0);
  });
});
