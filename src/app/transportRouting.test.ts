import { describe, expect, it } from "vitest";
import {
  canWorkspaceUseTransport,
  resolveLearningFocusTrack,
  resolveTransportWorkspace,
} from "./transportRouting";

describe("transport routing", () => {
  it("uses the active lesson workspace in Learn", () => {
    expect(resolveTransportWorkspace("learn", "bass", "mixer")).toBe("bass");
  });

  it("uses the active Studio module instead of hard-wiring Arrangement", () => {
    expect(resolveTransportWorkspace("studio", "drums", "bass")).toBe("bass");
    expect(resolveTransportWorkspace("studio", "drums", "voicing")).toBe("voicing");
    expect(resolveTransportWorkspace("studio", "drums", "melody")).toBe("melody");
  });

  it("uses the arrangement as the shared playback context in Create", () => {
    expect(resolveTransportWorkspace("create", "drums", "bass")).toBe("arrangement");
  });

  it("keeps loop transport available for sequencer, melody, chord, and production workspaces", () => {
    expect(canWorkspaceUseTransport("drums")).toBe(true);
    expect(canWorkspaceUseTransport("melody")).toBe(true);
    expect(canWorkspaceUseTransport("chords")).toBe(true);
    expect(canWorkspaceUseTransport("harmony-song")).toBe(true);
    expect(canWorkspaceUseTransport("mixer")).toBe(true);
  });

  it("treats direct-audition keyboard and synth exercises as non-transport views", () => {
    expect(canWorkspaceUseTransport("piano-key")).toBe(false);
    expect(canWorkspaceUseTransport("synth")).toBe(false);
  });

  it("focuses the musical layer currently being learned", () => {
    expect(resolveLearningFocusTrack("learn", "groove-feel")).toBe("drums");
    expect(resolveLearningFocusTrack("learn", "melody-harmony")).toBe("melody");
    expect(resolveLearningFocusTrack("learn", "harmonic-function")).toBe("chords");
    expect(resolveLearningFocusTrack("learn", "bass")).toBe("bass");
  });

  it("keeps production-balancing lessons and non-Learn modes neutral", () => {
    expect(resolveLearningFocusTrack("learn", "mixer")).toBeNull();
    expect(resolveLearningFocusTrack("learn", "eq")).toBeNull();
    expect(resolveLearningFocusTrack("learn", "reference")).toBeNull();
    expect(resolveLearningFocusTrack("studio", "bass")).toBeNull();
    expect(resolveLearningFocusTrack("create", "melody")).toBeNull();
  });
});
