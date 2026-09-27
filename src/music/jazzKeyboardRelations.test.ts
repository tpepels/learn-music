import { describe, expect, it } from "vitest";
import {
  describeJazzKeyboardShape,
  jazzIntervalDescription,
} from "./jazzKeyboardRelations";

describe("jazz keyboard relationships", () => {
  it("names the complementary interval pair used in the opening Levine lesson", () => {
    expect(jazzIntervalDescription(4)).toEqual({
      semitones: 4,
      name: "major 3rd",
    });
    expect(jazzIntervalDescription(8)).toEqual({
      semitones: 8,
      name: "minor 6th",
    });
    expect(jazzIntervalDescription(5).name).toBe("perfect 4th");
    expect(jazzIntervalDescription(7).name).toBe("perfect 5th");
  });

  it("describes adjacent intervals and the outer span of a voicing", () => {
    expect(describeJazzKeyboardShape([64, 60, 67, 71])).toEqual({
      notes: [60, 64, 67, 71],
      adjacent: [
        { semitones: 4, name: "major 3rd" },
        { semitones: 3, name: "minor 3rd" },
        { semitones: 4, name: "major 3rd" },
      ],
      span: { semitones: 11, name: "major 7th" },
    });
  });

  it("deduplicates repeated notes before describing a keyboard shape", () => {
    expect(describeJazzKeyboardShape([60, 60, 72])).toEqual({
      notes: [60, 72],
      adjacent: [{ semitones: 12, name: "octave" }],
      span: { semitones: 12, name: "octave" },
    });
  });
});
