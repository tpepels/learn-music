import type { ProjectData } from "../music/model";

type ProjectImportActions = {
  stopAudio: () => void;
  loadProject: (project: ProjectData) => void;
};

export function commitProjectImport(
  project: ProjectData,
  actions: ProjectImportActions,
): void {
  actions.stopAudio();
  actions.loadProject(project);
}
