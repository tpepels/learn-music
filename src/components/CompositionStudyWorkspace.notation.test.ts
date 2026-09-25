import { describe, expect, it } from "vitest";
import {
  studyLedgerYs,
  studyStaffY,
  studyStemDirection,
} from "./CompositionStudyWorkspace";

describe("composition-study staff notation", () => {
  it("adds ledger lines below the treble staff", () => {
    const c4 = studyStaffY(60);
    expect(c4).toBeGreaterThan(77);
    expect(studyLedgerYs(c4)).toContain(85);
  });

  it("adds ledger lines above the treble staff", () => {
    const c6 = studyStaffY(84);
    expect(c6).toBeLessThan(45);
    expect(studyLedgerYs(c6).length).toBeGreaterThan(0);
  });

  it("reverses stem direction around the middle line", () => {
    expect(studyStemDirection(studyStaffY(60))).toBe("up");
    expect(studyStemDirection(studyStaffY(77))).toBe("down");
  });
});
