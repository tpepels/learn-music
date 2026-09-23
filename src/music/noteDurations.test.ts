import { describe, expect, it } from "vitest";
import {
  maxHarmonyDuration,
  maxMonophonicDuration,
  normalizeHarmonyDurations,
  normalizeMonophonicDurations,
  truncateHarmonyDurationsAtOnset,
  truncateMonophonicDurationsAtOnset,
  type HarmonyDurations,
  type HarmonySequence,
} from "./model";

describe("MIDI note duration rules", () => {
  it("stops a melody or bass note at the next onset", () => {
    const sequence = [60, null, null, 64, null, null];

    expect(maxMonophonicDuration(sequence, 0)).toBe(3);
    expect(maxMonophonicDuration(sequence, 3)).toBe(3);

    expect(
      normalizeMonophonicDurations(sequence, [8, 1, 1, 8, 1, 1]),
    ).toEqual([3, 1, 1, 3, 1, 1]);
  });

  it("ends a held monophonic note when a new onset is inserted inside it", () => {
    const sequence = [60, null, null, null, null, null];
    const durations = [6, 1, 1, 1, 1, 1];

    expect(
      truncateMonophonicDurationsAtOnset(sequence, durations, 2),
    ).toEqual([2, 1, 1, 1, 1, 1]);
  });

  it("only stops the matching pitch in polyphonic harmony", () => {
    const sequence: HarmonySequence = Array.from(
      { length: 8 },
      () => [],
    );
    sequence[0] = [60, 64, 67];
    sequence[3] = [60];

    const durations: HarmonyDurations = Array.from(
      { length: 32 },
      () => ({}),
    );
    durations[0] = { "60": 8, "64": 8, "67": 8 };

    expect(maxHarmonyDuration(sequence, 0, 60)).toBe(3);
    expect(maxHarmonyDuration(sequence, 0, 64)).toBe(8);

    const normalized = normalizeHarmonyDurations(sequence, durations);
    expect(normalized[0]).toEqual({
      "60": 3,
      "64": 8,
      "67": 8,
    });
  });

  it("truncates an earlier held harmony note when the same pitch is retriggered", () => {
    const sequence: HarmonySequence = Array.from(
      { length: 32 },
      () => [],
    );
    sequence[0] = [60, 64];
    const durations: HarmonyDurations = Array.from(
      { length: 32 },
      () => ({}),
    );
    durations[0] = { "60": 8, "64": 8 };

    const truncated = truncateHarmonyDurationsAtOnset(
      sequence,
      durations,
      3,
      60,
    );

    expect(truncated[0]).toEqual({
      "60": 3,
      "64": 8,
    });
  });
});
