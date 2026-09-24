import { describe, expect, it } from "vitest";
import { reverbValueChanged } from "./reverbState";

describe("reverb state", () => {
  it("does not regenerate an impulse response for unchanged values", () => {
    expect(reverbValueChanged(2.4, 2.4)).toBe(false);
    expect(reverbValueChanged(0.03, 0.03)).toBe(false);
  });

  it("detects real decay and pre-delay changes", () => {
    expect(reverbValueChanged(2.4, 3.2)).toBe(true);
    expect(reverbValueChanged(0.03, 0.05)).toBe(true);
  });
});
