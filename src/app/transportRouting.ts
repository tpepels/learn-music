import type { ExerciseDefinition } from "../lessons/types";

export type AppMode = "learn" | "create" | "studio";

export function resolveTransportWorkspace(
  appMode: AppMode,
  lessonWorkspace: ExerciseDefinition["workspace"],
  studioWorkspace: ExerciseDefinition["workspace"],
): ExerciseDefinition["workspace"] {
  if (appMode === "learn") return lessonWorkspace;
  if (appMode === "studio") return studioWorkspace;
  return "arrangement";
}
