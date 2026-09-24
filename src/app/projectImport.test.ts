import { describe, expect, it } from "vitest";
import type { ProjectData } from "../music/model";
import { commitProjectImport } from "./projectImport";

describe("project import", () => {
  it("stops active audio before replacing project state", () => {
    const order: string[] = [];
    const project = {} as ProjectData;

    commitProjectImport(project, {
      stopAudio: () => order.push("stop"),
      loadProject: (loadedProject) => {
        expect(loadedProject).toBe(project);
        order.push("load");
      },
    });

    expect(order).toEqual(["stop", "load"]);
  });
});
