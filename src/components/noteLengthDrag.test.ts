import { describe, expect, it } from "vitest";
import {
  findHarmonyNoteStart,
  findMonophonicNoteStart,
} from "./noteLengthDrag";

describe("drawn MIDI note coverage", () => {
  it("finds a sustained monophonic note across its duration", () => {
    const sequence = [60, null, null, null, 64, null];
    const durations = [4, 1, 1, 1, 2, 1];

    expect(findMonophonicNoteStart(sequence, durations, 60, 0)).toBe(0);
    expect(findMonophonicNoteStart(sequence, durations, 60, 3)).toBe(0);
    expect(findMonophonicNoteStart(sequence, durations, 60, 4)).toBeNull();
    expect(findMonophonicNoteStart(sequence, durations, 64, 5)).toBe(4);
  });

  it("keeps polyphonic harmony durations independent per pitch", () => {
    const sequence = Array.from({ length: 8 }, () => [] as number[]);
    sequence[0] = [60, 64, 67];

    const durations = Array.from(
      { length: 8 },
      () => ({} as Record<string, number>),
    );
    durations[0] = { "60": 2, "64": 4, "67": 1 };

    expect(findHarmonyNoteStart(sequence, durations, 60, 1)).toBe(0);
    expect(findHarmonyNoteStart(sequence, durations, 60, 2)).toBeNull();
    expect(findHarmonyNoteStart(sequence, durations, 64, 3)).toBe(0);
    expect(findHarmonyNoteStart(sequence, durations, 67, 1)).toBeNull();
  });

  it("prefers the latest overlapping start of the same pitch", () => {
    const sequence = [60, null, 60, null, null];
    const durations = [5, 1, 2, 1, 1];

    expect(findMonophonicNoteStart(sequence, durations, 60, 2)).toBe(2);
    expect(findMonophonicNoteStart(sequence, durations, 60, 3)).toBe(2);
    expect(findMonophonicNoteStart(sequence, durations, 60, 4)).toBe(0);
  });
});
