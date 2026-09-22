import { z } from "zod";
import {
  ARRANGEMENT_BARS,
  BASS_STEPS,
  MELODY_STEPS,
  STEPS,
  chordNames,
  initialBassSequence,
  initialVoicingSettings,
  patternIds,
  synthWaveforms,
  type ProjectData,
} from "../music/model";

const stepPatternSchema = z.object({
  kick: z.array(z.boolean()).length(STEPS),
  snare: z.array(z.boolean()).length(STEPS),
  hat: z.array(z.boolean()).length(STEPS),
});

const mixerTrackSchema = z.object({
  volume: z.number(),
  pan: z.number(),
  highpass: z.number(),
  reverb: z.number(),
  delay: z.number(),
});

export const projectFileSchema = z.object({
  format: z.literal("play-lab-project"),
  version: z.literal(1),
  exportedAt: z.string(),
  project: z.object({
    bpm: z.number().min(40).max(240),
    patterns: z.object({
      A: stepPatternSchema,
      B: stepPatternSchema,
    }),
    melody: z
      .array(z.union([z.number().int().min(0).max(127), z.null()]))
      .length(MELODY_STEPS),
    chordProgression: z
      .array(z.union([z.enum(chordNames), z.null()]))
      .length(4),
    synthSettings: z.object({
      waveform: z.enum(synthWaveforms),
      cutoff: z.number().positive(),
      attack: z.number().nonnegative(),
      release: z.number().nonnegative(),
    }),
    arrangement: z
      .array(
        z.object({
          drums: z.boolean(),
          bass: z.boolean(),
          chords: z.boolean(),
          melody: z.boolean(),
        }),
      )
      .length(ARRANGEMENT_BARS),
    mixerSettings: z.object({
      drums: mixerTrackSchema,
      bass: mixerTrackSchema,
      chords: mixerTrackSchema,
      melody: mixerTrackSchema,
    }),
    automationSettings: z.object({
      melodyVolumeDb: z.array(z.number()).length(ARRANGEMENT_BARS),
      chordFilterHz: z.array(z.number().positive()).length(ARRANGEMENT_BARS),
    }),
    dynamicsSettings: z.object({
      threshold: z.number(),
      ratio: z.number().positive(),
      attack: z.number().nonnegative(),
      release: z.number().nonnegative(),
    }),
    effectsSettings: z.object({
      reverbDecay: z.number().positive(),
      reverbPreDelay: z.number().nonnegative(),
      delayFeedback: z.number().min(0).max(0.99),
      chorusWet: z.number().min(0).max(1),
    }),
    voicingSettings: z
      .object({
        inversions: z.array(z.union([z.literal(0), z.literal(1), z.literal(2)])).length(4),
      })
      .optional(),
    bassSequence: z
      .array(z.union([z.number().int().min(0).max(127), z.null()]))
      .length(BASS_STEPS)
      .optional(),
  }),
});

export type ProjectFile = z.infer<typeof projectFileSchema>;

export function parseProjectFile(input: unknown): ProjectData {
  const project = projectFileSchema.parse(input).project;

  return {
    ...project,
    voicingSettings: project.voicingSettings ?? {
      inversions: [...initialVoicingSettings.inversions],
    },
    bassSequence: project.bassSequence ?? [...initialBassSequence],
  } as ProjectData;
}
