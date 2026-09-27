import { describe, expect, it } from "vitest";
import {
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
  it("does not call a single Play click listening", () => {
    expect(
      heardPlayback({
        "transport.play": experiment(1, ["melody"]),
      }),
    ).toBe(false);
  });

  it("counts listening only after playback completes a loop", () => {
    expect(
      heardPlayback({
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
