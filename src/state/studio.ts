import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  resetLessonProgressState,
  sanitizeLearningProgress,
} from "../learning/progress";
import { implementedLessons } from "../lessons/course";
import {
  LESSON_FIVE_ID,
  LESSON_FIVE_RECOVERY_PITCH_CLASSES,
  RECOVERED_EXERCISE_IDS,
  RECOVERED_LESSON_IDS,
  buildLessonFiveRecoveryProject,
} from "../learning/catchUp";
import { migratePersistedStudioState } from "./migrations";
import {
  readLearningProgressCookie,
  writeLearningProgressCookie,
  type LearningProgressCookie,
} from "../persistence/progressCookie";
import {
  resetEffectsWorkspaceState,
  resetStereoWorkspaceState,
} from "./workspaceReset";
import {
  chordNames,
  cloneArrangement,
  cloneEqSettings,
  cloneGrooveFeelSettings,
  cloneHarmonyDurations,
  cloneHarmonySequence,
  cloneNoteDurationLane,
  maxHarmonyDuration,
  maxMonophonicDuration,
  normalizeHarmonyDurations,
  normalizeMonophonicDurations,
  truncateHarmonyDurationsAtOnset,
  truncateMonophonicDurationsAtOnset,
  clonePattern,
  cloneReferenceSnapshot,
  cloneSaturationSettings,
  cloneStereoSettings,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassDurations,
  initialBassSequence,
  initialChordProgression,
  initialMelody,
  initialMelodyDurations,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialHarmonyDurations,
  initialHarmonySequence,
  initialInstrumentSettings,
  initialMixerSettings,
  initialPattern,
  initialProjectMilestones,
  initialReferenceMixSettings,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  type AccompanimentPattern,
  type Arrangement,
  type ArrangementLayer,
  type AutomationSettings,
  type BassSequence,
  type ChordName,
  type ChordProgression,
  type DynamicsSettings,
  type EffectsSettings,
  type EqSettings,
  type ExerciseExperiments,
  type FormSectionLabel,
  type FormSettings,
  type GrooveFeelSettings,
  type HarmonyDurations,
  type HarmonySequence,
  type InstrumentSettings,
  type MelodySequence,
  type NoteDurationLane,
  type MixerSettings,
  type MixerTrackId,
  type PatternId,
  type ProjectData,
  type ProjectMilestones,
  type ReferenceMixSettings,
  type SaturationSettings,
  type SidechainSettings,
  type StepPattern,
  type StereoSettings,
  type SynthSettings,
  type TextureSettings,
  type TrackName,
  type VoicingSettings,
} from "../music/model";
import {
  cloneHarmonicProgression,
  cloneTonalContext,
  initialHarmonicProgression,
  initialTonalContext,
  legacyChordToHarmonic,
  progressionSymbols,
  sanitizeTonalContext,
  transposeHarmonySequence,
  transposeNullableMidiSequence,
  type HarmonicChord,
  type HarmonicProgression,
  type PitchClass,
  type TonalContext,
  type TonalMode,
} from "../music/harmony";
import {
  SCHOENBERG_CONNECTION_IDS,
  SCHOENBERG_SENTENCE_IDS,
  ensureStudyExerciseState,
  initialCompositionStudyState,
  mergeCompositionStudyState,
  resetStudyExerciseState,
  setStudyConnectionOperationsState,
  setStudyOperationsState,
  setStudySentenceModeState,
  setStudySentenceSourceStepState,
  setStudyTransformationState,
  studyBridgeSequence,
  studyComparisonSequence,
  studyConnectionSequence,
  type CompositionStudyState,
  type StudyDecision,
  type StudyDuration,
  type StudyFeature,
  type StudyNotation,
  type StudySentenceMode,
  type StudyTransformation,
  type StudyVariant,
} from "../music/study";

function canonicalCompatibilityContext(context: TonalContext): TonalContext {
  return context.mode === "major"
    ? { tonic: 0, mode: "major" }
    : {
        tonic: 9,
        mode: context.mode,
      };
}

function compatibilityProgression(
  progression: HarmonicProgression,
  context: TonalContext,
): ChordProgression {
  const symbols = progressionSymbols(
    progression,
    canonicalCompatibilityContext(context),
  );
  return symbols.map((symbol) =>
    symbol && chordNames.includes(symbol as ChordName)
      ? (symbol as ChordName)
      : null,
  );
}

const FIRST_LESSON_ID = "rhythm.pulse-and-groove";
const progressDefinitions = implementedLessons.map((lesson) => ({
  id: lesson.id,
  exerciseIds: lesson.exercises.map((exercise) => exercise.id),
}));

function sanitizeStoredLearningProgress(
  progress: Partial<LearningProgressCookie>,
): LearningProgressCookie {
  return {
    version: 2,
    ...sanitizeLearningProgress(
      {
        currentLessonId: progress.currentLessonId ?? FIRST_LESSON_ID,
        exerciseIndexByLesson: progress.exerciseIndexByLesson ?? {},
        completedExerciseIds: progress.completedExerciseIds ?? [],
        completedLessonIds: progress.completedLessonIds ?? [],
      },
      progressDefinitions,
      FIRST_LESSON_ID,
    ),
  };
}

function readSanitizedLearningProgress(): LearningProgressCookie | null {
  const progress = readLearningProgressCookie();
  return progress ? sanitizeStoredLearningProgress(progress) : null;
}

const cookieProgress = readSanitizedLearningProgress();

function progressSnapshot(state: Pick<
  StudioState,
  | "currentLessonId"
  | "exerciseIndexByLesson"
  | "completedExerciseIds"
  | "completedLessonIds"
>): LearningProgressCookie {
  return {
    version: 2,
    currentLessonId: state.currentLessonId,
    exerciseIndexByLesson: state.exerciseIndexByLesson,
    completedExerciseIds: state.completedExerciseIds,
    completedLessonIds: state.completedLessonIds,
  };
}

type StudioState = {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  currentLessonId: string;
  exerciseIndexByLesson: Record<string, number>;
  completedExerciseIds: string[];
  activePattern: PatternId;
  patterns: Record<PatternId, StepPattern>;
  completedLessonIds: string[];
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
  projectMilestones: ProjectMilestones;
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
  activeExerciseId: string;
  learningExperiments: Record<string, ExerciseExperiments>;
  compositionStudy: CompositionStudyState;
  appMode: "learn" | "create" | "studio";

  setBpm: (bpm: number) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setCurrentLesson: (lessonId: string) => void;
  setExerciseIndex: (lessonId: string, index: number) => void;
  completeExercise: (exerciseId: string) => void;
  setActivePattern: (patternId: PatternId) => void;
  toggleStep: (track: TrackName, step: number) => void;
  resetPattern: (patternId: PatternId, source?: StepPattern) => void;
  completeLesson: (lessonId: string) => void;
  recoverToLessonFive: () => void;
  togglePitchClass: (pitchClass: string) => void;
  clearPitchClasses: () => void;
  setMelodyStep: (step: number, midi: number | null) => void;
  setMelodyDuration: (step: number, duration: number) => void;
  clearMelody: () => void;
  setTonalContext: (context: TonalContext) => void;
  setTonic: (tonic: PitchClass) => void;
  setTonalMode: (mode: TonalMode) => void;
  setHarmonicSlot: (slot: number, chord: HarmonicChord | null) => void;
  transposeProjectToTonic: (tonic: PitchClass) => void;
  setChordSlot: (slot: number, chord: ChordName | null) => void;
  clearChords: () => void;
  toggleHarmonyNote: (step: number, midi: number) => void;
  setHarmonyDuration: (step: number, midi: number, duration: number) => void;
  clearHarmonyBar: (bar: number) => void;
  clearHarmonySequence: () => void;
  setAccompanimentPattern: (pattern: AccompanimentPattern) => void;
  resetAccompanimentPattern: () => void;
  setSynthSettings: (settings: Partial<SynthSettings>) => void;
  resetSynthSettings: () => void;
  setArrangementLayer: (
    bar: number,
    layer: ArrangementLayer,
    enabled: boolean,
  ) => void;
  toggleArrangementLayer: (bar: number, layer: ArrangementLayer) => void;
  clearArrangement: () => void;
  setMixerTrack: (
    track: MixerTrackId,
    settings: Partial<MixerSettings[MixerTrackId]>,
  ) => void;
  resetMixer: () => void;
  setAutomationPoint: (
    lane: keyof AutomationSettings,
    index: number,
    value: number,
  ) => void;
  resetAutomation: () => void;
  setDynamicsSettings: (settings: Partial<DynamicsSettings>) => void;
  resetDynamics: () => void;
  setEffectsSettings: (settings: Partial<EffectsSettings>) => void;
  resetEffects: () => void;
  resetEffectsWorkspace: () => void;
  markProjectExported: () => void;
  setAppMode: (mode: "learn" | "create" | "studio") => void;
  loadProject: (project: ProjectData) => void;
  setChordInversion: (slot: number, inversion: 0 | 1 | 2) => void;
  resetVoicings: () => void;
  setBassStep: (step: number, midi: number | null) => void;
  setBassDuration: (step: number, duration: number) => void;
  clearBass: () => void;
  resetLessonProgress: (lessonId: string, exerciseIds: string[]) => void;
  setGrooveVelocity: (track: TrackName, step: number, velocity: number) => void;
  setSwing: (swing: number) => void;
  resetGrooveFeel: () => void;
  setFormSection: (index: number, label: FormSectionLabel) => void;
  toggleFormLayer: (section: number, layer: ArrangementLayer) => void;
  resetFormSettings: () => void;
  setTextureSettings: (settings: Partial<TextureSettings>) => void;
  resetTextureSettings: () => void;
  setInstrumentSettings: (settings: Partial<InstrumentSettings>) => void;
  resetInstrumentSettings: () => void;
  setEqTrack: (track: MixerTrackId, settings: Partial<EqSettings[MixerTrackId]>) => void;
  resetEq: () => void;
  setSaturationTrack: (
    track: MixerTrackId,
    settings: Partial<SaturationSettings[MixerTrackId]>,
  ) => void;
  resetSaturation: () => void;
  setSidechainSettings: (settings: Partial<SidechainSettings>) => void;
  resetSidechain: () => void;
  setStereoWidth: (track: MixerTrackId, width: number) => void;
  setMonoAudition: (enabled: boolean) => void;
  resetStereo: () => void;
  resetStereoWorkspace: () => void;
  captureReferenceSnapshot: () => void;
  setReferenceTrim: (trimDb: number) => void;
  registerReferenceComparison: () => void;
  setReferenceQuietChecked: (checked: boolean) => void;
  resetReferenceMix: () => void;
  setActiveExerciseId: (exerciseId: string) => void;
  recordLearningExperiment: (key: string, value?: string | number | boolean) => void;
  setStudyNotation: (exerciseId: string, notation: StudyNotation) => void;
  toggleStudySelection: (exerciseId: string, step: number) => void;
  setStudyStep: (exerciseId: string, step: number, midi: number | null) => void;
  setStudyDuration: (exerciseId: string, step: number, duration: StudyDuration) => void;
  setStudyDecision: (exerciseId: string, decision: StudyDecision) => void;
  setStudyVariant: (exerciseId: string, variant: StudyVariant) => void;
  setStudyTransformation: (
    exerciseId: string,
    transformation: StudyTransformation,
  ) => void;
  setStudyFeatureDecision: (
    exerciseId: string,
    feature: StudyFeature,
  ) => void;
  toggleStudyOperation: (
    exerciseId: string,
    operation: StudyTransformation,
  ) => void;
  setStudySentenceMode: (
    exerciseId: string,
    mode: StudySentenceMode,
  ) => void;
  resetStudyExercise: (exerciseId: string) => void;
};

function recordExperimentValue(
  state: Pick<StudioState, "activeExerciseId" | "learningExperiments">,
  key: string,
  value: string | number | boolean = true,
): Record<string, ExerciseExperiments> {
  const exerciseId = state.activeExerciseId;
  if (!exerciseId) return state.learningExperiments;

  const exercise = state.learningExperiments[exerciseId] ?? {};
  const previous = exercise[key] ?? {
    changes: 0,
    min: null,
    max: null,
    values: [],
  };
  const numeric = typeof value === "number" ? value : null;
  const serialized = String(value);
  const values = previous.values.includes(serialized)
    ? previous.values
    : [...previous.values, serialized].slice(-24);

  return {
    ...state.learningExperiments,
    [exerciseId]: {
      ...exercise,
      [key]: {
        changes: previous.changes + 1,
        min:
          numeric === null
            ? previous.min
            : previous.min === null
              ? numeric
              : Math.min(previous.min, numeric),
        max:
          numeric === null
            ? previous.max
            : previous.max === null
              ? numeric
              : Math.max(previous.max, numeric),
        values,
      },
    },
  };
}

function recordExperimentEntries(
  state: Pick<StudioState, "activeExerciseId" | "learningExperiments">,
  entries: Array<[string, string | number | boolean]>,
): Record<string, ExerciseExperiments> {
  let next = state.learningExperiments;
  for (const [key, value] of entries) {
    next = recordExperimentValue(
      { activeExerciseId: state.activeExerciseId, learningExperiments: next },
      key,
      value,
    );
  }
  return next;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      bpm: 96,
      isPlaying: false,
      currentStep: 0,
      currentLessonId: cookieProgress?.currentLessonId ?? FIRST_LESSON_ID,
      exerciseIndexByLesson: cookieProgress?.exerciseIndexByLesson ?? {},
      completedExerciseIds: cookieProgress?.completedExerciseIds ?? [],
      activePattern: "A",
      patterns: {
        A: clonePattern(initialPattern),
        B: clonePattern(initialPattern),
      },
      completedLessonIds: cookieProgress?.completedLessonIds ?? [],
      selectedPitchClasses: [],
      melody: [...initialMelody],
      melodyDurations: [...initialMelodyDurations],
      tonalContext: cloneTonalContext(initialTonalContext),
      harmonicProgression: cloneHarmonicProgression(initialHarmonicProgression),
      chordProgression: [...initialChordProgression],
      harmonySequence: cloneHarmonySequence(initialHarmonySequence),
      harmonyDurations: cloneHarmonyDurations(initialHarmonyDurations),
      accompanimentPattern: initialAccompanimentPattern,
      synthSettings: { ...initialSynthSettings },
      arrangement: cloneArrangement(initialArrangement),
      mixerSettings: {
        drums: { ...initialMixerSettings.drums },
        bass: { ...initialMixerSettings.bass },
        chords: { ...initialMixerSettings.chords },
        melody: { ...initialMixerSettings.melody },
      },
      automationSettings: {
        melodyVolumeDb: [...initialAutomationSettings.melodyVolumeDb],
        chordFilterHz: [...initialAutomationSettings.chordFilterHz],
      },
      dynamicsSettings: { ...initialDynamicsSettings },
      effectsSettings: { ...initialEffectsSettings },
      projectMilestones: { ...initialProjectMilestones },
      voicingSettings: { inversions: [...initialVoicingSettings.inversions] },
      bassSequence: [...initialBassSequence],
      bassDurations: [...initialBassDurations],
      grooveFeelSettings: cloneGrooveFeelSettings(initialGrooveFeelSettings),
      formSettings: {
        sections: [...initialFormSettings.sections],
        roles: [...initialFormSettings.roles],
        layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
      },
      textureSettings: { ...initialTextureSettings },
      instrumentSettings: { ...initialInstrumentSettings },
      eqSettings: cloneEqSettings(initialEqSettings),
      saturationSettings: cloneSaturationSettings(initialSaturationSettings),
      sidechainSettings: { ...initialSidechainSettings },
      stereoSettings: cloneStereoSettings(initialStereoSettings),
      referenceMixSettings: {
        ...initialReferenceMixSettings,
        snapshot: null,
      },
      activeExerciseId: "",
      learningExperiments: {},
      compositionStudy: initialCompositionStudyState(),
      appMode: "learn",

      setBpm: (bpm) => set({ bpm }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentStep: (currentStep) => set({ currentStep }),

      setCurrentLesson: (currentLessonId) =>
        set({
          currentLessonId,
          activePattern: currentLessonId === "rhythm.variation" ? "B" : "A",
          currentStep: 0,
        }),

      setExerciseIndex: (lessonId, index) =>
        set((state) => ({
          exerciseIndexByLesson: {
            ...state.exerciseIndexByLesson,
            [lessonId]: index,
          },
          currentStep: 0,
        })),

      completeExercise: (exerciseId) =>
        set((state) => ({
          completedExerciseIds: state.completedExerciseIds.includes(exerciseId)
            ? state.completedExerciseIds
            : [...state.completedExerciseIds, exerciseId],
        })),

      setActivePattern: (activePattern) =>
        set((state) => ({
          activePattern,
          currentStep: 0,
          learningExperiments: recordExperimentValue(
            state,
            "pattern.select",
            activePattern,
          ),
        })),

      toggleStep: (track, step) =>
        set((state) => {
          const nextPattern = clonePattern(state.patterns[state.activePattern]);
          nextPattern[track][step] = !nextPattern[track][step];

          return {
            patterns: {
              ...state.patterns,
              [state.activePattern]: nextPattern,
            },
            learningExperiments: recordExperimentValue(
              state,
              "drums." + state.activePattern + "." + track + ".edit",
              step + ":" + nextPattern[track][step],
            ),
          };
        }),

      resetPattern: (patternId, source = initialPattern) =>
        set((state) => ({
          patterns: {
            ...state.patterns,
            [patternId]: clonePattern(source),
          },
          currentStep: 0,
        })),

      completeLesson: (lessonId) =>
        set((state) => {
          const completedLessonIds = state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId];

          if (lessonId === FIRST_LESSON_ID) {
            return {
              completedLessonIds,
              patterns: {
                ...state.patterns,
                B: clonePattern(state.patterns.A),
              },
            };
          }

          return { completedLessonIds };
        }),

      recoverToLessonFive: () =>
        set((state) => {
          const project = buildLessonFiveRecoveryProject();

          return {
            ...project,
            isPlaying: false,
            currentStep: 0,
            currentLessonId: LESSON_FIVE_ID,
            exerciseIndexByLesson: {
              ...state.exerciseIndexByLesson,
              [LESSON_FIVE_ID]: 0,
            },
            completedExerciseIds: Array.from(
              new Set([
                ...state.completedExerciseIds,
                ...RECOVERED_EXERCISE_IDS,
              ]),
            ),
            completedLessonIds: Array.from(
              new Set([
                ...state.completedLessonIds,
                ...RECOVERED_LESSON_IDS,
              ]),
            ),
            activePattern: "A",
            selectedPitchClasses: [
              ...LESSON_FIVE_RECOVERY_PITCH_CLASSES,
            ],
            projectMilestones: { ...initialProjectMilestones },
            activeExerciseId: "",
            learningExperiments: {},
            appMode: "learn" as const,
          };
        }),

      togglePitchClass: (pitchClass) =>
        set((state) => {
          const selectedPitchClasses = state.selectedPitchClasses.includes(pitchClass)
            ? state.selectedPitchClasses.filter((note) => note !== pitchClass)
            : [...state.selectedPitchClasses, pitchClass];
          return {
            selectedPitchClasses,
            learningExperiments: recordExperimentValue(
              state,
              "pitch-class.select",
              pitchClass + ":" + selectedPitchClasses.includes(pitchClass),
            ),
          };
        }),

      clearPitchClasses: () => set({ selectedPitchClasses: [] }),

      setMelodyStep: (step, midi) =>
        set((state) => {
          const melody = [...state.melody];
          let melodyDurations = [...state.melodyDurations];
          const removing = melody[step] === midi;

          if (!removing) {
            melodyDurations = truncateMonophonicDurationsAtOnset(
              melody,
              melodyDurations,
              step,
            );
          }

          melody[step] = removing ? null : midi;
          if (melody[step] === null) {
            melodyDurations[step] = 1;
          } else {
            melodyDurations[step] = Math.min(
              melodyDurations[step] ?? 1,
              maxMonophonicDuration(melody, step),
            );
          }

          return {
            melody,
            melodyDurations,
            learningExperiments: recordExperimentValue(
              state,
              "melody.edit",
              step + ":" + String(melody[step]),
            ),
          };
        }),

      setMelodyDuration: (step, duration) =>
        set((state) => {
          const melodyDurations = [...state.melodyDurations];
          melodyDurations[step] = Math.max(
            1,
            Math.min(
              maxMonophonicDuration(state.melody, step),
              Math.round(duration),
            ),
          );
          return {
            melodyDurations,
            learningExperiments: recordExperimentValue(
              state,
              "melody.duration",
              melodyDurations[step],
            ),
          };
        }),

      clearMelody: () =>
        set({
          melody: [...initialMelody],
          melodyDurations: [...initialMelodyDurations],
          currentStep: 0,
        }),

      setTonalContext: (context) =>
        set((state) => {
          const tonalContext = sanitizeTonalContext(context, state.tonalContext);
          return {
            tonalContext,
            chordProgression: compatibilityProgression(
              state.harmonicProgression,
              tonalContext,
            ),
            learningExperiments: recordExperimentValue(
              state,
              "harmony.key",
              tonalContext.tonic + ":" + tonalContext.mode,
            ),
          };
        }),

      setTonic: (tonic) =>
        set((state) => {
          const tonalContext = { ...state.tonalContext, tonic };
          return {
            tonalContext,
            chordProgression: compatibilityProgression(
              state.harmonicProgression,
              tonalContext,
            ),
            learningExperiments: recordExperimentValue(
              state,
              "harmony.tonic",
              tonic,
            ),
          };
        }),

      setTonalMode: (mode) =>
        set((state) => {
          const tonalContext = { ...state.tonalContext, mode };
          return {
            tonalContext,
            chordProgression: compatibilityProgression(
              state.harmonicProgression,
              tonalContext,
            ),
            learningExperiments: recordExperimentValue(
              state,
              "harmony.mode",
              mode,
            ),
          };
        }),

      setHarmonicSlot: (slot, chord) =>
        set((state) => {
          const harmonicProgression = cloneHarmonicProgression(
            state.harmonicProgression,
          );
          harmonicProgression[slot] = chord ? { ...chord } : null;
          return {
            harmonicProgression,
            chordProgression: compatibilityProgression(
              harmonicProgression,
              state.tonalContext,
            ),
            learningExperiments: recordExperimentValue(
              state,
              "harmony.chord." + slot,
              chord
                ? progressionSymbols([chord], state.tonalContext)[0] ?? "clear"
                : "clear",
            ),
          };
        }),

      transposeProjectToTonic: (tonic) =>
        set((state) => {
          const semitones =
            ((tonic - state.tonalContext.tonic + 18) % 12) - 6;
          const tonalContext = { ...state.tonalContext, tonic };
          const melody = transposeNullableMidiSequence(state.melody, semitones);
          const harmonySequence = transposeHarmonySequence(
            state.harmonySequence,
            semitones,
          );
          const bassSequence = transposeNullableMidiSequence(
            state.bassSequence,
            semitones,
          );
          return {
            tonalContext,
            chordProgression: compatibilityProgression(
              state.harmonicProgression,
              tonalContext,
            ),
            melody,
            melodyDurations: normalizeMonophonicDurations(
              melody,
              state.melodyDurations,
            ),
            harmonySequence,
            harmonyDurations: normalizeHarmonyDurations(
              harmonySequence,
              state.harmonyDurations,
            ),
            bassSequence,
            bassDurations: normalizeMonophonicDurations(
              bassSequence,
              state.bassDurations,
            ),
            learningExperiments: recordExperimentEntries(state, [
              ["harmony.transpose", semitones],
              ["harmony.tonic", tonic],
            ]),
          };
        }),

      setChordSlot: (slot, chord) =>
        set((state) => {
          const harmonicProgression = cloneHarmonicProgression(
            state.harmonicProgression,
          );
          const compatibilityContext = canonicalCompatibilityContext(
            state.tonalContext,
          );
          harmonicProgression[slot] =
            chord === null
              ? null
              : legacyChordToHarmonic(chord, compatibilityContext);
          return {
            harmonicProgression,
            chordProgression: compatibilityProgression(
              harmonicProgression,
              state.tonalContext,
            ),
            learningExperiments: recordExperimentValue(
              state,
              "harmony.chord." + slot,
              chord ?? "clear",
            ),
          };
        }),

      clearChords: () =>
        set({
          harmonicProgression: cloneHarmonicProgression(
            initialHarmonicProgression,
          ),
          chordProgression: [...initialChordProgression],
          currentStep: 0,
        }),

      toggleHarmonyNote: (step, midi) =>
        set((state) => {
          const harmonySequence = cloneHarmonySequence(state.harmonySequence);
          let harmonyDurations = cloneHarmonyDurations(state.harmonyDurations);
          const notes = harmonySequence[step] ?? [];
          const removing = notes.includes(midi);
          harmonySequence[step] = removing
            ? notes.filter((note) => note !== midi)
            : [...notes, midi].sort((left, right) => left - right);
          if (removing) {
            delete harmonyDurations[step][midi];
          } else {
            harmonyDurations = truncateHarmonyDurationsAtOnset(
              harmonySequence,
              harmonyDurations,
              step,
              midi,
            );
            harmonyDurations[step][midi] = 1;
          }
          return {
            harmonySequence,
            harmonyDurations,
            learningExperiments: recordExperimentValue(
              state,
              "harmony.note-edit",
              step + ":" + midi,
            ),
          };
        }),

      setHarmonyDuration: (step, midi, duration) =>
        set((state) => {
          const harmonyDurations = cloneHarmonyDurations(state.harmonyDurations);
          harmonyDurations[step][midi] = Math.max(
            1,
            Math.min(
              maxHarmonyDuration(state.harmonySequence, step, midi),
              Math.round(duration),
            ),
          );
          return {
            harmonyDurations,
            learningExperiments: recordExperimentValue(
              state,
              "harmony.duration",
              step + ":" + midi + ":" + harmonyDurations[step][midi],
            ),
          };
        }),

      clearHarmonyBar: (bar) =>
        set((state) => {
          const harmonySequence = cloneHarmonySequence(state.harmonySequence);
          for (let step = bar * 8; step < bar * 8 + 8; step += 1) {
            harmonySequence[step] = [];
          }
          const harmonyDurations = cloneHarmonyDurations(state.harmonyDurations);
          for (let step = bar * 8; step < bar * 8 + 8; step += 1) {
            harmonyDurations[step] = {};
          }
          return {
            harmonySequence,
            harmonyDurations,
            learningExperiments: recordExperimentValue(
              state,
              "harmony.clear-bar",
              bar,
            ),
          };
        }),

      clearHarmonySequence: () =>
        set({
          harmonySequence: cloneHarmonySequence(initialHarmonySequence),
          harmonyDurations: cloneHarmonyDurations(initialHarmonyDurations),
          currentStep: 0,
        }),

      setAccompanimentPattern: (accompanimentPattern) =>
        set({ accompanimentPattern }),

      resetAccompanimentPattern: () =>
        set({ accompanimentPattern: initialAccompanimentPattern }),

      setSynthSettings: (settings) =>
        set((state) => ({
          synthSettings: {
            ...state.synthSettings,
            ...settings,
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "synth." + key,
              value as string | number | boolean,
            ]),
          ),
        })),

      resetSynthSettings: () =>
        set({ synthSettings: { ...initialSynthSettings } }),

      setArrangementLayer: (bar, layer, enabled) =>
        set((state) => {
          if (state.arrangement[bar]?.[layer] === enabled) return state;

          const arrangement = cloneArrangement(state.arrangement);
          if (!arrangement[bar]) return state;

          arrangement[bar][layer] = enabled;
          return {
            arrangement,
            learningExperiments: recordExperimentValue(
              state,
              "arrangement.edit",
              bar + ":" + layer + ":" + enabled,
            ),
          };
        }),

      toggleArrangementLayer: (bar, layer) =>
        set((state) => {
          const current = state.arrangement[bar]?.[layer];
          if (current === undefined) return state;

          const arrangement = cloneArrangement(state.arrangement);
          arrangement[bar][layer] = !current;
          return {
            arrangement,
            learningExperiments: recordExperimentValue(
              state,
              "arrangement.edit",
              bar + ":" + layer + ":" + !current,
            ),
          };
        }),

      clearArrangement: () =>
        set({
          arrangement: cloneArrangement(initialArrangement),
          currentStep: 0,
        }),

      setMixerTrack: (track, settings) =>
        set((state) => ({
          mixerSettings: {
            ...state.mixerSettings,
            [track]: {
              ...state.mixerSettings[track],
              ...settings,
            },
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "mixer." + track + "." + key,
              value as number,
            ]),
          ),
        })),

      resetMixer: () =>
        set({
          mixerSettings: {
            drums: { ...initialMixerSettings.drums },
            bass: { ...initialMixerSettings.bass },
            chords: { ...initialMixerSettings.chords },
            melody: { ...initialMixerSettings.melody },
          },
        }),

      setAutomationPoint: (lane, index, value) =>
        set((state) => {
          const next = [...state.automationSettings[lane]];
          next[index] = value;
          return {
            automationSettings: {
              ...state.automationSettings,
              [lane]: next,
            },
            learningExperiments: recordExperimentValue(
              state,
              "automation." + String(lane),
              value,
            ),
          };
        }),

      resetAutomation: () =>
        set({
          automationSettings: {
            melodyVolumeDb: [...initialAutomationSettings.melodyVolumeDb],
            chordFilterHz: [...initialAutomationSettings.chordFilterHz],
          },
        }),

      setDynamicsSettings: (settings) =>
        set((state) => ({
          dynamicsSettings: {
            ...state.dynamicsSettings,
            ...settings,
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "dynamics." + key,
              value as number,
            ]),
          ),
        })),

      resetDynamics: () =>
        set({ dynamicsSettings: { ...initialDynamicsSettings } }),

      setEffectsSettings: (settings) =>
        set((state) => ({
          effectsSettings: {
            ...state.effectsSettings,
            ...settings,
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "effects." + key,
              value as number,
            ]),
          ),
        })),

      resetEffects: () =>
        set({ effectsSettings: { ...initialEffectsSettings } }),

      resetEffectsWorkspace: () =>
        set((state) => resetEffectsWorkspaceState(state.mixerSettings)),

      markProjectExported: () =>
        set((state) => ({
          projectMilestones: {
            exported: true,
          },
          learningExperiments: recordExperimentValue(
            state,
            "project.export",
            true,
          ),
        })),

      setAppMode: (appMode) => set({ appMode }),

      setChordInversion: (slot, inversion) =>
        set((state) => {
          const inversions = [...state.voicingSettings.inversions];
          inversions[slot] = inversion;
          return {
            voicingSettings: { inversions },
            learningExperiments: recordExperimentValue(
              state,
              "voicing.slot." + slot,
              inversion,
            ),
          };
        }),

      resetVoicings: () =>
        set({
          voicingSettings: { inversions: [...initialVoicingSettings.inversions] },
        }),

      setBassStep: (step, midi) =>
        set((state) => {
          const bassSequence = [...state.bassSequence];
          let bassDurations = [...state.bassDurations];
          const removing = bassSequence[step] === midi;

          if (!removing) {
            bassDurations = truncateMonophonicDurationsAtOnset(
              bassSequence,
              bassDurations,
              step,
            );
          }

          bassSequence[step] = removing ? null : midi;
          if (bassSequence[step] === null) {
            bassDurations[step] = 1;
          } else {
            bassDurations[step] = Math.min(
              bassDurations[step] ?? 1,
              maxMonophonicDuration(bassSequence, step),
            );
          }

          return {
            bassSequence,
            bassDurations,
            learningExperiments: recordExperimentValue(
              state,
              "bass.edit",
              step + ":" + String(bassSequence[step]),
            ),
          };
        }),

      setBassDuration: (step, duration) =>
        set((state) => {
          const bassDurations = [...state.bassDurations];
          bassDurations[step] = Math.max(
            1,
            Math.min(
              maxMonophonicDuration(state.bassSequence, step),
              Math.round(duration),
            ),
          );
          return {
            bassDurations,
            learningExperiments: recordExperimentValue(
              state,
              "bass.duration",
              step + ":" + bassDurations[step],
            ),
          };
        }),

      clearBass: () =>
        set({
          bassSequence: [...initialBassSequence],
          bassDurations: [...initialBassDurations],
          currentStep: 0,
        }),

      resetLessonProgress: (lessonId, exerciseIds) =>
        set((state) => {
          const progress = resetLessonProgressState(
            {
              currentLessonId: state.currentLessonId,
              exerciseIndexByLesson: state.exerciseIndexByLesson,
              completedExerciseIds: state.completedExerciseIds,
              completedLessonIds: state.completedLessonIds,
              currentStep: state.currentStep,
            },
            lessonId,
            exerciseIds,
          );
          const learningExperiments = { ...state.learningExperiments };
          exerciseIds.forEach((exerciseId) => {
            delete learningExperiments[exerciseId];
          });
          return { ...progress, learningExperiments };
        }),

      setGrooveVelocity: (track, step, velocity) =>
        set((state) => {
          const grooveFeelSettings = cloneGrooveFeelSettings(
            state.grooveFeelSettings,
          );
          grooveFeelSettings.velocities[track][step] = Math.max(
            0.05,
            Math.min(1, velocity),
          );
          return {
            grooveFeelSettings,
            learningExperiments: recordExperimentValue(
              state,
              "groove." + track + ".velocity",
              grooveFeelSettings.velocities[track][step],
            ),
          };
        }),

      setSwing: (swing) =>
        set((state) => {
          const nextSwing = Math.max(0, Math.min(0.6, swing));
          return {
            grooveFeelSettings: {
              ...state.grooveFeelSettings,
              swing: nextSwing,
            },
            learningExperiments: recordExperimentValue(
              state,
              "groove.swing",
              nextSwing,
            ),
          };
        }),

      resetGrooveFeel: () =>
        set({
          grooveFeelSettings: cloneGrooveFeelSettings(initialGrooveFeelSettings),
        }),

      setFormSection: (index, label) =>
        set((state) => {
          const sections = [...state.formSettings.sections];
          sections[index] = label;
          return {
            formSettings: {
              ...state.formSettings,
              sections,
            },
            learningExperiments: recordExperimentValue(
              state,
              "form.section." + index,
              label,
            ),
          };
        }),

      toggleFormLayer: (section, layer) =>
        set((state) => {
          const layers = state.formSettings.layers.map((entry) => ({ ...entry }));
          layers[section][layer] = !layers[section][layer];
          return {
            formSettings: {
              ...state.formSettings,
              layers,
            },
            learningExperiments: recordExperimentValue(
              state,
              "form.layer." + section + "." + layer,
              layers[section][layer],
            ),
          };
        }),

      resetFormSettings: () =>
        set({
          formSettings: {
            sections: [...initialFormSettings.sections],
            roles: [...initialFormSettings.roles],
            layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
          },
        }),

      setTextureSettings: (settings) =>
        set((state) => ({
          textureSettings: {
            ...state.textureSettings,
            ...settings,
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "texture." + key,
              value as string | number | boolean,
            ]),
          ),
        })),

      resetTextureSettings: () =>
        set({ textureSettings: { ...initialTextureSettings } }),

      setInstrumentSettings: (settings) =>
        set((state) => ({
          instrumentSettings: {
            ...state.instrumentSettings,
            ...settings,
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "instrument." + key,
              value as string | number | boolean,
            ]),
          ),
        })),

      resetInstrumentSettings: () =>
        set({ instrumentSettings: { ...initialInstrumentSettings } }),

      setEqTrack: (track, settings) =>
        set((state) => ({
          eqSettings: {
            ...state.eqSettings,
            [track]: {
              ...state.eqSettings[track],
              ...settings,
            },
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "eq." + track + "." + key,
              value as number,
            ]),
          ),
        })),

      resetEq: () => set({ eqSettings: cloneEqSettings(initialEqSettings) }),

      setSaturationTrack: (track, settings) =>
        set((state) => ({
          saturationSettings: {
            ...state.saturationSettings,
            [track]: {
              ...state.saturationSettings[track],
              ...settings,
            },
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "saturation." + track + "." + key,
              value as number,
            ]),
          ),
        })),

      resetSaturation: () =>
        set({
          saturationSettings: cloneSaturationSettings(initialSaturationSettings),
        }),

      setSidechainSettings: (settings) =>
        set((state) => ({
          sidechainSettings: {
            ...state.sidechainSettings,
            ...settings,
          },
          learningExperiments: recordExperimentEntries(
            state,
            Object.entries(settings).map(([key, value]) => [
              "sidechain." + key,
              value as string | number | boolean,
            ]),
          ),
        })),

      resetSidechain: () =>
        set({ sidechainSettings: { ...initialSidechainSettings } }),

      setStereoWidth: (track, width) =>
        set((state) => {
          const nextWidth = Math.max(0, Math.min(1, width));
          return {
            stereoSettings: {
              ...state.stereoSettings,
              widths: {
                ...state.stereoSettings.widths,
                [track]: nextWidth,
              },
            },
            learningExperiments: recordExperimentValue(
              state,
              "stereo." + track + ".width",
              nextWidth,
            ),
          };
        }),

      setMonoAudition: (enabled) =>
        set((state) => ({
          stereoSettings: {
            ...state.stereoSettings,
            monoAudition: enabled,
            monoChecked: state.stereoSettings.monoChecked || enabled,
          },
          learningExperiments: recordExperimentValue(
            state,
            "stereo.mono",
            enabled,
          ),
        })),

      resetStereo: () =>
        set({ stereoSettings: cloneStereoSettings(initialStereoSettings) }),

      resetStereoWorkspace: () =>
        set((state) => resetStereoWorkspaceState(state.mixerSettings)),

      captureReferenceSnapshot: () =>
        set((state) => ({
          referenceMixSettings: {
            ...state.referenceMixSettings,
            snapshot: {
              mixerSettings: {
                drums: { ...state.mixerSettings.drums },
                bass: { ...state.mixerSettings.bass },
                chords: { ...state.mixerSettings.chords },
                melody: { ...state.mixerSettings.melody },
              },
              eqSettings: cloneEqSettings(state.eqSettings),
              saturationSettings: cloneSaturationSettings(
                state.saturationSettings,
              ),
              stereoWidths: { ...state.stereoSettings.widths },
            },
          },
          learningExperiments: recordExperimentValue(
            state,
            "reference.capture",
            true,
          ),
        })),

      setReferenceTrim: (trimDb) =>
        set((state) => {
          const nextTrimDb = Math.max(-12, Math.min(12, trimDb));
          return {
            referenceMixSettings: {
              ...state.referenceMixSettings,
              trimDb: nextTrimDb,
            },
            learningExperiments: recordExperimentValue(
              state,
              "reference.trim",
              nextTrimDb,
            ),
          };
        }),

      registerReferenceComparison: () =>
        set((state) => ({
          referenceMixSettings: {
            ...state.referenceMixSettings,
            comparisons: state.referenceMixSettings.comparisons + 1,
          },
          learningExperiments: recordExperimentValue(
            state,
            "reference.compare",
            state.referenceMixSettings.comparisons + 1,
          ),
        })),

      setReferenceQuietChecked: (quietChecked) =>
        set((state) => ({
          referenceMixSettings: {
            ...state.referenceMixSettings,
            quietChecked,
          },
          learningExperiments: recordExperimentValue(
            state,
            "reference.quiet",
            quietChecked,
          ),
        })),

      resetReferenceMix: () =>
        set({
          referenceMixSettings: {
            ...initialReferenceMixSettings,
            snapshot: null,
          },
        }),

      setActiveExerciseId: (activeExerciseId) =>
        set((state) => ({
          activeExerciseId,
          learningExperiments:
            state.isPlaying && activeExerciseId !== state.activeExerciseId
              ? recordExperimentValue(
                  {
                    activeExerciseId,
                    learningExperiments: state.learningExperiments,
                  },
                  "transport.play",
                  "continued",
                )
              : state.learningExperiments,
        })),

      recordLearningExperiment: (key, value = true) =>
        set((state) => ({
          learningExperiments: recordExperimentValue(state, key, value),
        })),

      setStudyNotation: (exerciseId, notation) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: { ...exercise, notation },
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.notation",
              notation,
            ),
          };
        }),

      toggleStudySelection: (exerciseId, step) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          const selectedSteps = exercise.selectedSteps.includes(step)
            ? exercise.selectedSteps.filter((entry) => entry !== step)
            : [...exercise.selectedSteps, step].sort((left, right) => left - right);
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: { ...exercise, selectedSteps },
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.selection",
              step + ":" + selectedSteps.includes(step),
            ),
          };
        }),

      setStudyStep: (exerciseId, step, midi) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          const nextExercise =
            exerciseId === SCHOENBERG_SENTENCE_IDS.compose
              ? setStudySentenceSourceStepState(exercise, step, midi)
              : (() => {
                  const notes = [...exercise.notes];
                  if (step < 0 || step >= notes.length) return exercise;
                  notes[step] = midi;
                  return { ...exercise, notes };
                })();
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: nextExercise,
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.note-edit",
              step + ":" + (midi ?? "rest"),
            ),
          };
        }),

      setStudyDuration: (exerciseId, step, duration) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          if (step < 0 || step >= exercise.durations.length) return state;
          const durations = [...exercise.durations];
          durations[step] = duration;
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: { ...exercise, durations },
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.duration-edit",
              step + ":" + duration,
            ),
          };
        }),

      setStudyDecision: (exerciseId, decision) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: { ...exercise, decision },
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.decision",
              decision ?? "clear",
            ),
          };
        }),

      setStudyVariant: (exerciseId, variant) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          const sequence =
            exerciseId === SCHOENBERG_CONNECTION_IDS.compare
              ? studyConnectionSequence(variant)
              : exerciseId === SCHOENBERG_CONNECTION_IDS.bridge
                ? studyBridgeSequence(variant)
                : {
                    notes: studyComparisonSequence(variant),
                    durations: exercise.durations,
                  };
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: {
                ...exercise,
                variant,
                notes: [...sequence.notes],
                durations: [...sequence.durations],
              },
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.variant",
              variant,
            ),
          };
        }),

      setStudyTransformation: (exerciseId, transformation) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: setStudyTransformationState(
                exercise,
                transformation,
              ),
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.transformation",
              transformation,
            ),
          };
        }),

      setStudyFeatureDecision: (exerciseId, feature) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: { ...exercise, featureDecision: feature },
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.feature-answer",
              exercise.transformation + ":" + feature,
            ),
          };
        }),

      toggleStudyOperation: (exerciseId, operation) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          const operations = exercise.operations.includes(operation)
            ? exercise.operations.filter((entry) => entry !== operation)
            : [...exercise.operations, operation].slice(-3);
          const nextExercise =
            exerciseId === SCHOENBERG_CONNECTION_IDS.compose
              ? setStudyConnectionOperationsState(exercise, operations)
              : setStudyOperationsState(exercise, operations);
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: nextExercise,
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.operation",
              operation + ":" + operations.includes(operation),
            ),
          };
        }),

      setStudySentenceMode: (exerciseId, mode) =>
        set((state) => {
          const exercise = ensureStudyExerciseState(
            state.compositionStudy,
            exerciseId,
          );
          return {
            compositionStudy: {
              ...state.compositionStudy,
              [exerciseId]: setStudySentenceModeState(exercise, mode),
            },
            learningExperiments: recordExperimentValue(
              state,
              "study.sentence-mode",
              mode,
            ),
          };
        }),

      resetStudyExercise: (exerciseId) =>
        set((state) => ({
          compositionStudy: {
            ...state.compositionStudy,
            [exerciseId]: resetStudyExerciseState(exerciseId),
          },
          currentStep: 0,
        })),

      loadProject: (project) =>
        set({
          bpm: project.bpm,
          patterns: {
            A: clonePattern(project.patterns.A),
            B: clonePattern(project.patterns.B),
          },
          melody: [...project.melody],
          melodyDurations: normalizeMonophonicDurations(
            project.melody,
            project.melodyDurations,
          ),
          tonalContext: cloneTonalContext(project.tonalContext),
          harmonicProgression: cloneHarmonicProgression(
            project.harmonicProgression,
          ),
          chordProgression: compatibilityProgression(
            project.harmonicProgression,
            project.tonalContext,
          ),
          harmonySequence: cloneHarmonySequence(project.harmonySequence),
          harmonyDurations: normalizeHarmonyDurations(
            project.harmonySequence,
            project.harmonyDurations,
          ),
          accompanimentPattern: project.accompanimentPattern,
          synthSettings: { ...project.synthSettings },
          arrangement: project.arrangement.map((bar) => ({ ...bar })),
          mixerSettings: {
            drums: { ...project.mixerSettings.drums },
            bass: { ...project.mixerSettings.bass },
            chords: { ...project.mixerSettings.chords },
            melody: { ...project.mixerSettings.melody },
          },
          automationSettings: {
            melodyVolumeDb: [...project.automationSettings.melodyVolumeDb],
            chordFilterHz: [...project.automationSettings.chordFilterHz],
          },
          dynamicsSettings: { ...project.dynamicsSettings },
          effectsSettings: { ...project.effectsSettings },
          projectMilestones: { exported: false },
          voicingSettings: { inversions: [...project.voicingSettings.inversions] },
          bassSequence: [...project.bassSequence],
          bassDurations: normalizeMonophonicDurations(
            project.bassSequence,
            project.bassDurations,
          ),
          grooveFeelSettings: cloneGrooveFeelSettings(project.grooveFeelSettings),
          formSettings: {
            sections: [...project.formSettings.sections],
            roles: [...project.formSettings.roles],
            layers: project.formSettings.layers.map((entry) => ({ ...entry })),
          },
          textureSettings: { ...project.textureSettings },
          instrumentSettings: { ...project.instrumentSettings },
          eqSettings: cloneEqSettings(project.eqSettings),
          saturationSettings: cloneSaturationSettings(project.saturationSettings),
          sidechainSettings: { ...project.sidechainSettings },
          stereoSettings: cloneStereoSettings(project.stereoSettings),
          referenceMixSettings: {
            ...project.referenceMixSettings,
            snapshot: cloneReferenceSnapshot(project.referenceMixSettings.snapshot),
          },
          currentStep: 0,
          isPlaying: false,
        }),
    }),
    {
      name: "learn-music-studio-v2",
      partialize: (state) => ({
        bpm: state.bpm,
        currentLessonId: state.currentLessonId,
        exerciseIndexByLesson: state.exerciseIndexByLesson,
        completedExerciseIds: state.completedExerciseIds,
        activePattern: state.activePattern,
        patterns: state.patterns,
        completedLessonIds: state.completedLessonIds,
        selectedPitchClasses: state.selectedPitchClasses,
        melody: state.melody,
        melodyDurations: state.melodyDurations,
        tonalContext: state.tonalContext,
        harmonicProgression: state.harmonicProgression,
        chordProgression: state.chordProgression,
        harmonySequence: state.harmonySequence,
        harmonyDurations: state.harmonyDurations,
        accompanimentPattern: state.accompanimentPattern,
        synthSettings: state.synthSettings,
        arrangement: state.arrangement,
        mixerSettings: state.mixerSettings,
        automationSettings: state.automationSettings,
        dynamicsSettings: state.dynamicsSettings,
        effectsSettings: state.effectsSettings,
        projectMilestones: state.projectMilestones,
        voicingSettings: state.voicingSettings,
        bassSequence: state.bassSequence,
        bassDurations: state.bassDurations,
        grooveFeelSettings: state.grooveFeelSettings,
        formSettings: state.formSettings,
        textureSettings: state.textureSettings,
        instrumentSettings: state.instrumentSettings,
        eqSettings: state.eqSettings,
        saturationSettings: state.saturationSettings,
        sidechainSettings: state.sidechainSettings,
        stereoSettings: state.stereoSettings,
        referenceMixSettings: state.referenceMixSettings,
        learningExperiments: state.learningExperiments,
        compositionStudy: state.compositionStudy,
        appMode: state.appMode,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<StudioState>;
        const migrated = migratePersistedStudioState(persisted);
        const progress =
          readSanitizedLearningProgress() ??
          sanitizeStoredLearningProgress({
            currentLessonId:
              persisted.currentLessonId ?? currentState.currentLessonId,
            exerciseIndexByLesson:
              persisted.exerciseIndexByLesson ??
              currentState.exerciseIndexByLesson,
            completedExerciseIds:
              persisted.completedExerciseIds ??
              currentState.completedExerciseIds,
            completedLessonIds:
              persisted.completedLessonIds ??
              currentState.completedLessonIds,
          });

        return {
          ...currentState,
          ...persisted,
          ...migrated,
          learningExperiments:
            persisted.learningExperiments ?? currentState.learningExperiments,
          compositionStudy: mergeCompositionStudyState(
            persisted.compositionStudy ?? currentState.compositionStudy,
          ),
          currentLessonId: progress.currentLessonId,
          exerciseIndexByLesson: progress.exerciseIndexByLesson,
          completedExerciseIds: progress.completedExerciseIds,
          completedLessonIds: progress.completedLessonIds,
        };
      },
    },
  ),
);

let lastProgressCookie = "";
const syncProgressCookie = (state: StudioState) => {
  const snapshot = progressSnapshot(state);
  const serialized = JSON.stringify(snapshot);
  if (serialized === lastProgressCookie) return;
  lastProgressCookie = serialized;
  writeLearningProgressCookie(snapshot);
};

syncProgressCookie(useStudioStore.getState());
useStudioStore.subscribe(syncProgressCookie);
