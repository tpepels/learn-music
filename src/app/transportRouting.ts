import type { ExerciseDefinition } from "../lessons/types";
import type { MixerTrackId } from "../music/model";

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


export function canWorkspaceUseTransport(
  workspace: ExerciseDefinition["workspace"],
): boolean {
  return workspace !== "piano-key" && workspace !== "synth";
}


export function resolveLearningFocusTrack(
  appMode: AppMode,
  workspace: ExerciseDefinition["workspace"],
): MixerTrackId | null {
  if (appMode !== "learn") return null;

  switch (workspace) {
    case "drums":
    case "compare":
    case "groove-feel":
      return "drums";

    case "piano-key":
    case "melody":
    case "motif":
    case "melody-harmony":
    case "minor-key":
    case "harmonic-minor":
    case "transposition":
    case "composition-study":
      return "melody";

    case "chords":
    case "harmony-song":
    case "voicing":
    case "harmonic-function":
    case "minor-harmony":
    case "seventh-harmony":
    case "borrowed-harmony":
      return "chords";

    case "bass":
      return "bass";

    default:
      return null;
  }
}
