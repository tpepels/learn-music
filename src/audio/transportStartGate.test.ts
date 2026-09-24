import { describe, expect, it } from "vitest";
import { TransportStartGate } from "./transportStartGate";

describe("transport start gate", () => {
  it("invalidates an older start when a newer start begins", () => {
    const gate = new TransportStartGate();
    const first = gate.begin();
    const second = gate.begin();

    expect(gate.isCurrent(first)).toBe(false);
    expect(gate.isCurrent(second)).toBe(true);
  });

  it("can cancel a pending start without beginning another one", () => {
    const gate = new TransportStartGate();
    const token = gate.begin();

    gate.invalidate();

    expect(gate.isCurrent(token)).toBe(false);
  });
});
