import type { ExerciseDefinition } from "../lessons/types";
import type { MixerTrackId } from "../music/model";

type Workspace = ExerciseDefinition["workspace"];

const fullMix = ["drums", "bass", "chords", "melody"] as const;

export const workspacePlaybackLayers: Partial<
  Record<Workspace, readonly MixerTrackId[]>
> = {
  melody: ["drums", "melody"],
  motif: ["drums", "melody"],
  "minor-key": ["drums", "melody"],
  "harmonic-minor": ["drums", "melody"],
  transposition: ["chords", "melody"],
  "melody-harmony": ["drums", "chords", "melody"],
  "harmony-song": ["drums", "chords", "melody"],
  "harmonic-function": ["drums", "chords", "melody"],
  "minor-harmony": ["drums", "chords", "melody"],
  "seventh-harmony": ["drums", "chords"],
  "borrowed-harmony": ["drums", "chords"],
  "jazz-piano": ["chords"],
  bass: ["drums", "chords", "bass"],
  "phrase-form": fullMix,
  arrangement: fullMix,
  mixer: fullMix,
  "automation-dynamics": fullMix,
  effects: fullMix,
  "final-project": fullMix,
  texture: fullMix,
  eq: fullMix,
  saturation: fullMix,
  sidechain: fullMix,
  stereo: fullMix,
  reference: fullMix,
  "instrument-palette": fullMix,
};

export const productionAuditionWorkspaces: readonly Workspace[] = [
  "mixer",
  "automation-dynamics",
  "effects",
  "eq",
  "saturation",
  "sidechain",
  "stereo",
  "reference",
  "instrument-palette",
];

export function playbackLayersForWorkspace(
  workspace: Workspace,
): readonly MixerTrackId[] {
  return workspacePlaybackLayers[workspace] ?? [];
}

export function isProductionAuditionWorkspace(
  workspace: Workspace,
): boolean {
  return productionAuditionWorkspaces.includes(workspace);
}
