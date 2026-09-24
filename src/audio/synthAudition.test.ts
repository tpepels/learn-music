import { describe, expect, it } from "vitest";
import { disposeSynthAudition } from "./synthAudition";

describe("synth audition disposal", () => {
  it("releases sounding voices and disposes the synth so queued attacks cannot leak", () => {
    const calls: string[] = [];
    const synth = {
      releaseAll: () => calls.push("release"),
      dispose: () => calls.push("dispose"),
    };

    expect(disposeSynthAudition(synth)).toBeNull();
    expect(calls).toEqual(["release", "dispose"]);
  });

  it("accepts an already empty audition", () => {
    expect(disposeSynthAudition(null)).toBeNull();
  });
});
