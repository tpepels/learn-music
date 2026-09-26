import type { ExerciseDefinition } from "../lessons/types";

type Workspace = ExerciseDefinition["workspace"];

export type WorkspacePlaybackMode =
  | "direct-audition"
  | "drums"
  | "context-drums"
  | "melody-groove"
  | "harmony-with-melody"
  | "harmony-no-melody"
  | "chord-melody"
  | "composition-study"
  | "jazz-piano"
  | "chords"
  | "voicing-context"
  | "bass"
  | "form"
  | "arrangement"
  | "context-arrangement"
  | "texture-context"
  | "production-mix";

export const workspacePlaybackModes: Record<Workspace, WorkspacePlaybackMode> = {
  drums: "drums",
  compare: "drums",
  "piano-key": "direct-audition",
  melody: "melody-groove",
  chords: "chords",
  "harmony-song": "harmony-with-melody",
  synth: "direct-audition",
  arrangement: "arrangement",
  mixer: "production-mix",
  "automation-dynamics": "production-mix",
  effects: "production-mix",
  "final-project": "context-arrangement",
  voicing: "voicing-context",
  bass: "bass",
  "groove-feel": "context-drums",
  motif: "melody-groove",
  "melody-harmony": "harmony-with-melody",
  "harmonic-function": "harmony-with-melody",
  "phrase-form": "form",
  texture: "texture-context",
  eq: "production-mix",
  saturation: "production-mix",
  sidechain: "production-mix",
  stereo: "production-mix",
  reference: "production-mix",
  "minor-key": "melody-groove",
  "harmonic-minor": "melody-groove",
  "minor-harmony": "harmony-with-melody",
  "seventh-harmony": "harmony-no-melody",
  "borrowed-harmony": "harmony-no-melody",
  "instrument-palette": "production-mix",
  transposition: "chord-melody",
  "composition-study": "composition-study",
  "jazz-piano": "jazz-piano",
};

export function playbackModeForWorkspace(
  workspace: Workspace,
): WorkspacePlaybackMode {
  return workspacePlaybackModes[workspace];
}

/**
 * These lesson workspaces are authored and evaluated against the primary
 * Pattern A groove. Pattern B is reserved for the explicit comparison lesson.
 */
export function workspaceRequiresPatternA(workspace: Workspace): boolean {
  return (
    workspace === "drums" ||
    workspace === "groove-feel" ||
    workspace === "sidechain"
  );
}
