import { z } from "zod";
import type {
  AccompanimentPattern,
  Arrangement,
  AutomationSettings,
  BassSequence,
  ChordProgression,
  DynamicsSettings,
  EffectsSettings,
  EqSettings,
  ExerciseExperiments,
  GrooveFeelSettings,
  FormSettings,
  HarmonyDurations,
  HarmonySequence,
  InstrumentSettings,
  MelodySequence,
  NoteDurationLane,
  MixerSettings,
  ReferenceMixSettings,
  SaturationSettings,
  SidechainSettings,
  StepPattern,
  StereoSettings,
  SynthSettings,
  TextureSettings,
  VoicingSettings,
} from "../music/model";
import type {
  HarmonicProgression,
  TonalContext,
} from "../music/harmony";

const termSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export const exerciseContentSchema = z.object({
  id: z.string(),
  letter: z.string(),
  title: z.string(),
  learn: z.string(),
  explanation: z.string(),
  instruction: z.string(),
  recognition: z.string(),
  terms: z.array(termSchema),
  workspace: z.enum([
    "drums",
    "compare",
    "piano-key",
    "melody",
    "chords",
    "harmony-song",
    "synth",
    "arrangement",
    "mixer",
    "automation-dynamics",
    "effects",
    "final-project",
    "voicing",
    "bass",
    "groove-feel",
    "motif",
    "melody-harmony",
    "harmonic-function",
    "phrase-form",
    "texture",
    "eq",
    "saturation",
    "sidechain",
    "stereo",
    "reference",
    "minor-key",
    "harmonic-minor",
    "minor-harmony",
    "seventh-harmony",
    "borrowed-harmony",
    "instrument-palette",
  ]),
  checksLabel: z.string(),
  successLabel: z.string(),
});

export const lessonContentSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  eyebrow: z.string(),
  hero: z.string(),
  description: z.string(),
  overview: z.string(),
});

export type LessonCheck = { label: string; complete: boolean };

export type LessonContext = {
  A: StepPattern;
  B: StepPattern;
  selectedPitchClasses: string[];
  melody: MelodySequence;
  melodyDurations: NoteDurationLane;
  tonalContext: TonalContext;
  harmonicProgression: HarmonicProgression;
  chordProgression: ChordProgression;
  harmonySequence: HarmonySequence;
  harmonyDurations: HarmonyDurations;
  accompanimentPattern: AccompanimentPattern;
  synthSettings: SynthSettings;
  arrangement: Arrangement;
  mixerSettings: MixerSettings;
  automationSettings: AutomationSettings;
  dynamicsSettings: DynamicsSettings;
  effectsSettings: EffectsSettings;
  projectMilestones: { exported: boolean };
  voicingSettings: VoicingSettings;
  bassSequence: BassSequence;
  bassDurations: NoteDurationLane;
  grooveFeelSettings: GrooveFeelSettings;
  formSettings: FormSettings;
  textureSettings: TextureSettings;
  instrumentSettings: InstrumentSettings;
  eqSettings: EqSettings;
  saturationSettings: SaturationSettings;
  sidechainSettings: SidechainSettings;
  stereoSettings: StereoSettings;
  referenceMixSettings: ReferenceMixSettings;
  experiments: ExerciseExperiments;
};

export type ExerciseDefinition = z.infer<typeof exerciseContentSchema> & {
  evaluate: (context: LessonContext) => LessonCheck[];
};

export type LessonDefinition = z.infer<typeof lessonContentSchema> & {
  exercises: ExerciseDefinition[];
};
