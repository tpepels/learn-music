import { describe, expect, it } from "vitest";
import {
  canWorkspaceUseTransport,
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
    expect(canWorkspaceUseTransport("mixer")).toBe(true);
  });

  it("treats direct-audition keyboard and synth exercises as non-transport views", () => {
    expect(canWorkspaceUseTransport("piano-key")).toBe(false);
    expect(canWorkspaceUseTransport("synth")).toBe(false);
  });
});
