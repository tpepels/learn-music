import { z } from "zod";
import {
  ARRANGEMENT_BARS,
  BASS_STEPS,
  HARMONY_STEPS,
  MELODY_STEPS,
  STEPS,
  accompanimentPatterns,
  chordNames,
  initialAccompanimentPattern,
  initialBassDurations,
  initialBassSequence,
  initialGrooveFeelSettings,
  initialHarmonyDurations,
  initialHarmonySequence,
  initialInstrumentSettings,
  initialEqSettings,
  initialFormSettings,
  initialMelodyDurations,
  initialReferenceMixSettings,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialTextureSettings,
  initialVoicingSettings,
  patternIds,
  synthWaveforms,
  type ProjectData,
} from "../music/model";
import {
  chordQualities,
  harmonicRoles,
  inferLegacyTonalContext,
  migrateLegacyProgression,
  sanitizeHarmonicProgression,
  sanitizeTonalContext,
  seventhQualities,
  tonalModes,
} from "../music/harmony";

const tonalContextSchema = z.object({
  tonic: z.number().int().min(0).max(11),
  mode: z.enum(tonalModes),
});

const harmonicChordSchema = z.object({
  degree: z.number().int().min(1).max(7),
  rootAlteration: z.union([
    z.literal(-2),
    z.literal(-1),
    z.literal(0),
    z.literal(1),
    z.literal(2),
  ]),
  quality: z.enum(chordQualities),
  seventh: z.union([z.enum(seventhQualities), z.null()]),
  role: z.enum(harmonicRoles),
  targetDegree: z.number().int().min(1).max(7).optional(),
});

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
  version: z.union([z.literal(1), z.literal(2)]),
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
    melodyDurations: z
      .array(z.number().int().min(1).max(MELODY_STEPS))
      .length(MELODY_STEPS)
      .optional(),
    tonalContext: tonalContextSchema.optional(),
    harmonicProgression: z
      .array(z.union([harmonicChordSchema, z.null()]))
      .length(4)
      .optional(),
    chordProgression: z
      .array(z.union([z.enum(chordNames), z.null()]))
      .length(4),
    harmonySequence: z
      .array(z.array(z.number().int().min(0).max(127)))
      .length(HARMONY_STEPS)
      .optional(),
    harmonyDurations: z
      .array(z.record(z.string(), z.number().int().min(1).max(HARMONY_STEPS)))
      .length(HARMONY_STEPS)
      .optional(),
    accompanimentPattern: z.enum(accompanimentPatterns).optional(),
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
    bassDurations: z
      .array(z.number().int().min(1).max(BASS_STEPS))
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
        layers: z
          .array(
            z.object({
              drums: z.boolean(),
              bass: z.boolean(),
              chords: z.boolean(),
              melody: z.boolean(),
            }),
          )
          .length(4)
          .optional(),
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
    instrumentSettings: z
      .object({
        bassVoice: z.enum(["electric", "sub", "synth"]),
        chordVoice: z.enum(["piano", "electric", "pad", "pluck"]),
        pianoTouch: z.enum(["soft", "medium", "strong"]),
      })
      .optional(),
    eqSettings: z
      .object({
        drums: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
        bass: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
        chords: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
        melody: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
      })
      .optional(),
    saturationSettings: z
      .object({
        drums: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
        bass: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
        chords: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
        melody: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
      })
      .optional(),
    sidechainSettings: z
      .object({
        enabled: z.boolean(),
        amountDb: z.number().min(0).max(12),
        release: z.number().min(0.05).max(0.8),
      })
      .optional(),
    stereoSettings: z
      .object({
        widths: z.object({
          drums: z.number().min(0).max(1),
          bass: z.number().min(0).max(1),
          chords: z.number().min(0).max(1),
          melody: z.number().min(0).max(1),
        }),
        monoAudition: z.boolean(),
        monoChecked: z.boolean(),
      })
      .optional(),
    referenceMixSettings: z
      .object({
        snapshot: z
          .object({
            mixerSettings: z.object({
              drums: mixerTrackSchema,
              bass: mixerTrackSchema,
              chords: mixerTrackSchema,
              melody: mixerTrackSchema,
            }),
            eqSettings: z.object({
              drums: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
              bass: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
              chords: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
              melody: z.object({ frequency: z.number(), gain: z.number(), q: z.number().positive() }),
            }),
            saturationSettings: z.object({
              drums: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
              bass: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
              chords: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
              melody: z.object({ drive: z.number().min(0).max(1), wet: z.number().min(0).max(1) }),
            }),
            stereoWidths: z.object({
              drums: z.number().min(0).max(1),
              bass: z.number().min(0).max(1),
              chords: z.number().min(0).max(1),
              melody: z.number().min(0).max(1),
            }),
          })
          .nullable(),
        trimDb: z.number().min(-12).max(12),
        comparisons: z.number().int().min(0),
        quietChecked: z.boolean(),
      })
      .optional(),
  }),
});

export type ProjectFile = z.infer<typeof projectFileSchema>;

export function parseProjectFile(input: unknown): ProjectData {
  const project = projectFileSchema.parse(input).project;
  const inferredTonalContext = inferLegacyTonalContext(
    project.chordProgression,
  );
  const tonalContext = sanitizeTonalContext(
    project.tonalContext,
    inferredTonalContext,
  );
  const harmonicProgression = project.harmonicProgression
    ? sanitizeHarmonicProgression(project.harmonicProgression)
    : migrateLegacyProgression(
        project.chordProgression,
        inferredTonalContext,
      );

  return {
    ...project,
    tonalContext,
    harmonicProgression,
    melodyDurations:
      project.melodyDurations ?? [...initialMelodyDurations],
    harmonySequence:
      project.harmonySequence ?? initialHarmonySequence.map((notes) => [...notes]),
    harmonyDurations:
      project.harmonyDurations ??
      initialHarmonyDurations.map((entry) => ({ ...entry })),
    accompanimentPattern:
      project.accompanimentPattern ?? initialAccompanimentPattern,
    voicingSettings: project.voicingSettings ?? {
      inversions: [...initialVoicingSettings.inversions],
    },
    bassSequence: project.bassSequence ?? [...initialBassSequence],
    bassDurations: project.bassDurations ?? [...initialBassDurations],
    grooveFeelSettings: project.grooveFeelSettings ?? {
      swing: initialGrooveFeelSettings.swing,
      velocities: {
        kick: [...initialGrooveFeelSettings.velocities.kick],
        snare: [...initialGrooveFeelSettings.velocities.snare],
        hat: [...initialGrooveFeelSettings.velocities.hat],
      },
    },
    formSettings: project.formSettings
      ? {
          sections: [...project.formSettings.sections],
          roles: [...project.formSettings.roles],
          layers:
            project.formSettings.layers?.map((entry) => ({ ...entry })) ??
            initialFormSettings.layers.map((entry) => ({ ...entry })),
        }
      : {
          sections: [...initialFormSettings.sections],
          roles: [...initialFormSettings.roles],
          layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
        },
    textureSettings: project.textureSettings ?? {
      ...initialTextureSettings,
    },
    instrumentSettings: project.instrumentSettings ?? {
      ...initialInstrumentSettings,
    },
    eqSettings: project.eqSettings ?? {
      drums: { ...initialEqSettings.drums },
      bass: { ...initialEqSettings.bass },
      chords: { ...initialEqSettings.chords },
      melody: { ...initialEqSettings.melody },
    },
    saturationSettings: project.saturationSettings ?? {
      drums: { ...initialSaturationSettings.drums },
      bass: { ...initialSaturationSettings.bass },
      chords: { ...initialSaturationSettings.chords },
      melody: { ...initialSaturationSettings.melody },
    },
    sidechainSettings: project.sidechainSettings ?? {
      ...initialSidechainSettings,
    },
    stereoSettings: project.stereoSettings ?? {
      widths: { ...initialStereoSettings.widths },
      monoAudition: initialStereoSettings.monoAudition,
      monoChecked: initialStereoSettings.monoChecked,
    },
    referenceMixSettings: project.referenceMixSettings ?? {
      ...initialReferenceMixSettings,
      snapshot: null,
    },
  } as ProjectData;
}
