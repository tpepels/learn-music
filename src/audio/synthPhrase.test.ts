import { describe, expect, it } from "vitest";
import { getSynthPhraseEvents } from "./synthPhrase";

describe("synth phrase scheduling", () => {
  it("keeps every written melody event instead of truncating after eight notes", () => {
    const melody = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, null, null];
    const durations = Array(melody.length).fill(1);

    const events = getSynthPhraseEvents(melody, durations);

    expect(events).toHaveLength(10);
    expect(events.at(-1)).toMatchObject({ midi: 76, step: 9 });
  });

  it("preserves sparse timing and written note durations", () => {
    const melody = [60, null, 64, null, null, 67];
    const durations = [2, 1, 4, 1, 1, 3];

    expect(getSynthPhraseEvents(melody, durations)).toEqual([
      { midi: 60, step: 0, durationSteps: 2 },
      { midi: 64, step: 2, durationSteps: 4 },
      { midi: 67, step: 5, durationSteps: 3 },
    ]);
  });
});
