import { describe, expect, it } from "vitest";
import { effectiveChorusWet } from "./stereoAudition";

describe("stereo audition routing", () => {
  it("removes chorus during mono audition", () => {
    expect(effectiveChorusWet(0.4, true)).toBe(0);
  });

  it("restores the chosen chorus amount in stereo and keeps it bounded", () => {
    expect(effectiveChorusWet(0.4, false)).toBe(0.4);
    expect(effectiveChorusWet(0.9, false)).toBe(0.65);
    expect(effectiveChorusWet(-0.2, false)).toBe(0);
  });
});
