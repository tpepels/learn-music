import { describe, expect, it } from "vitest";
import {
  completedPlaybackCycle,
  heardPlayback,
  reflectedOnListening,
} from "./learningEvidence";
import type { ExerciseExperiments } from "../music/model";

function experiment(
  changes: number,
  values: string[] = [],
): ExerciseExperiments[string] {
  return {
    changes,
    min: null,
    max: null,
    values,
  };
}

describe("learning evidence", () => {
  it("retains the shared started-playback evidence used by source tracks", () => {
    expect(
      heardPlayback({
        "transport.play": experiment(1, ["melody"]),
      }),
    ).toBe(true);
  });

  it("distinguishes a completed playback cycle from a single Play click", () => {
    expect(
      completedPlaybackCycle({
        "transport.play": experiment(1, ["melody"]),
      }),
    ).toBe(false);

    expect(
      completedPlaybackCycle({
        "transport.play": experiment(1, ["melody"]),
        "transport.loop": experiment(1, ["melody"]),
      }),
    ).toBe(true);
  });

  it("requires a short learner observation rather than an empty acknowledgement", () => {
    expect(
      reflectedOnListening({
        "reflection.answer": experiment(1, ["more open"]),
      }),
    ).toBe(false);

    expect(
      reflectedOnListening({
        "reflection.answer": experiment(1, ["the harmony feels more open"]),
      }),
    ).toBe(true);
  });
});
