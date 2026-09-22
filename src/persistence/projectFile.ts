import { z } from "zod";
import {
  ARRANGEMENT_BARS,
  BASS_STEPS,
  MELODY_STEPS,
  STEPS,
  chordNames,
  initialBassSequence,
  initialGrooveFeelSettings,
  initialFormSettings,
  initialTextureSettings,
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
    grooveFeelSettings: z
      .object({
        swing: z.number().min(0).max(0.6),
        velocities: z.object({
          kick: z.array(z.number().min(0.05).max(1)).length(STEPS),
          snare: z.array(z.number().min(0.05).max(1)).length(STEPS),
          hat: z.array(z.number().min(0.05).max(1)).length(STEPS),
        }),
      })
      .optional(),
    formSettings: z
      .object({
        sections: z.array(z.enum(["A", "A′", "B", "C"])).length(4),
        roles: z
          .array(z.enum(["statement", "answer", "contrast", "return"]))
          .length(4),
      })
      .optional(),
    textureSettings: z
      .object({
        bassOctave: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
        chordsOctave: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
        melodyOctave: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
        openChords: z.boolean(),
        melodyOctaveDouble: z.boolean(),
      })
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
    grooveFeelSettings: project.grooveFeelSettings ?? {
      swing: initialGrooveFeelSettings.swing,
      velocities: {
        kick: [...initialGrooveFeelSettings.velocities.kick],
        snare: [...initialGrooveFeelSettings.velocities.snare],
        hat: [...initialGrooveFeelSettings.velocities.hat],
      },
    },
    formSettings: project.formSettings ?? {
      sections: [...initialFormSettings.sections],
      roles: [...initialFormSettings.roles],
    },
    textureSettings: project.textureSettings ?? {
      ...initialTextureSettings,
    },
  } as ProjectData;
}
