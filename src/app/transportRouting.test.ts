import { describe, expect, it } from "vitest";
import { resolveTransportWorkspace } from "./transportRouting";

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
});
