import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resetLessonProgressState } from "../learning/progress";
import {
  readLearningProgressCookie,
  writeLearningProgressCookie,
  type LearningProgressCookie,
} from "../persistence/progressCookie";
import {
  cloneArrangement,
  cloneEqSettings,
  cloneGrooveFeelSettings,
  cloneHarmonySequence,
  clonePattern,
  cloneReferenceSnapshot,
  cloneSaturationSettings,
  cloneStereoSettings,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassSequence,
  initialChordProgression,
  initialMelody,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialHarmonySequence,
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
  type HarmonySequence,
  type MelodySequence,
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

const FIRST_LESSON_ID = "rhythm.pulse-and-groove";
const cookieProgress = readLearningProgressCookie();

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
  chordProgression: ChordProgression;
  harmonySequence: HarmonySequence;
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
  grooveFeelSettings: GrooveFeelSettings;
  formSettings: FormSettings;
  textureSettings: TextureSettings;
  eqSettings: EqSettings;
  saturationSettings: SaturationSettings;
  sidechainSettings: SidechainSettings;
  stereoSettings: StereoSettings;
  referenceMixSettings: ReferenceMixSettings;
  activeExerciseId: string;
  learningExperiments: Record<string, ExerciseExperiments>;
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
  togglePitchClass: (pitchClass: string) => void;
  clearPitchClasses: () => void;
  setMelodyStep: (step: number, midi: number | null) => void;
  clearMelody: () => void;
  setChordSlot: (slot: number, chord: ChordName | null) => void;
  clearChords: () => void;
  toggleHarmonyNote: (step: number, midi: number) => void;
  clearHarmonyBar: (bar: number) => void;
  clearHarmonySequence: () => void;
  setAccompanimentPattern: (pattern: AccompanimentPattern) => void;
  resetAccompanimentPattern: () => void;
  setSynthSettings: (settings: Partial<SynthSettings>) => void;
  resetSynthSettings: () => void;
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
  markProjectExported: () => void;
  setAppMode: (mode: "learn" | "create" | "studio") => void;
  loadProject: (project: ProjectData) => void;
  setChordInversion: (slot: number, inversion: 0 | 1 | 2) => void;
  resetVoicings: () => void;
  setBassStep: (step: number, midi: number | null) => void;
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
  captureReferenceSnapshot: () => void;
  setReferenceTrim: (trimDb: number) => void;
  registerReferenceComparison: () => void;
  setReferenceQuietChecked: (checked: boolean) => void;
  resetReferenceMix: () => void;
  setActiveExerciseId: (exerciseId: string) => void;
  recordLearningExperiment: (key: string, value?: string | number | boolean) => void;
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
      chordProgression: [...initialChordProgression],
      harmonySequence: cloneHarmonySequence(initialHarmonySequence),
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
      grooveFeelSettings: cloneGrooveFeelSettings(initialGrooveFeelSettings),
      formSettings: {
        sections: [...initialFormSettings.sections],
        roles: [...initialFormSettings.roles],
        layers: initialFormSettings.layers.map((entry) => ({ ...entry })),
      },
      textureSettings: { ...initialTextureSettings },
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
        set({ activePattern, currentStep: 0 }),

      toggleStep: (track, step) =>
        set((state) => {
          const nextPattern = clonePattern(state.patterns[state.activePattern]);
          nextPattern[track][step] = !nextPattern[track][step];

          return {
            patterns: {
              ...state.patterns,
              [state.activePattern]: nextPattern,
            },
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

      togglePitchClass: (pitchClass) =>
        set((state) => ({
          selectedPitchClasses: state.selectedPitchClasses.includes(pitchClass)
            ? state.selectedPitchClasses.filter((note) => note !== pitchClass)
            : [...state.selectedPitchClasses, pitchClass],
        })),

      clearPitchClasses: () => set({ selectedPitchClasses: [] }),

      setMelodyStep: (step, midi) =>
        set((state) => {
          const melody = [...state.melody];
          melody[step] = melody[step] === midi ? null : midi;
          return { melody };
        }),

      clearMelody: () => set({ melody: [...initialMelody], currentStep: 0 }),

      setChordSlot: (slot, chord) =>
        set((state) => {
          const chordProgression = [...state.chordProgression];
          chordProgression[slot] = chord;
          return {
            chordProgression,
            learningExperiments: recordExperimentValue(
              state,
              "harmony.chord." + slot,
              chord ?? "clear",
            ),
          };
        }),

      clearChords: () =>
        set({ chordProgression: [...initialChordProgression], currentStep: 0 }),

      toggleHarmonyNote: (step, midi) =>
        set((state) => {
          const harmonySequence = cloneHarmonySequence(state.harmonySequence);
          const notes = harmonySequence[step] ?? [];
          harmonySequence[step] = notes.includes(midi)
            ? notes.filter((note) => note !== midi)
            : [...notes, midi].sort((left, right) => left - right);
          return {
            harmonySequence,
            learningExperiments: recordExperimentValue(
              state,
              "harmony.note-edit",
              step + ":" + midi,
            ),
          };
        }),

      clearHarmonyBar: (bar) =>
        set((state) => {
          const harmonySequence = cloneHarmonySequence(state.harmonySequence);
          for (let step = bar * 8; step < bar * 8 + 8; step += 1) {
            harmonySequence[step] = [];
          }
          return {
            harmonySequence,
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

      toggleArrangementLayer: (bar, layer) =>
        set((state) => {
          const arrangement = cloneArrangement(state.arrangement);
          arrangement[bar][layer] = !arrangement[bar][layer];
          return { arrangement };
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

      markProjectExported: () =>
        set({
          projectMilestones: {
            exported: true,
          },
        }),

      setAppMode: (appMode) => set({ appMode }),

      setChordInversion: (slot, inversion) =>
        set((state) => {
          const inversions = [...state.voicingSettings.inversions];
          inversions[slot] = inversion;
          return { voicingSettings: { inversions } };
        }),

      resetVoicings: () =>
        set({
          voicingSettings: { inversions: [...initialVoicingSettings.inversions] },
        }),

      setBassStep: (step, midi) =>
        set((state) => {
          const bassSequence = [...state.bassSequence];
          bassSequence[step] = bassSequence[step] === midi ? null : midi;
          return { bassSequence };
        }),

      clearBass: () =>
        set({ bassSequence: [...initialBassSequence], currentStep: 0 }),

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
          return { grooveFeelSettings };
        }),

      setSwing: (swing) =>
        set((state) => ({
          grooveFeelSettings: {
            ...state.grooveFeelSettings,
            swing: Math.max(0, Math.min(0.6, swing)),
          },
        })),

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
        })),

      resetStereo: () =>
        set({ stereoSettings: cloneStereoSettings(initialStereoSettings) }),

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
        })),

      setReferenceTrim: (trimDb) =>
        set((state) => ({
          referenceMixSettings: {
            ...state.referenceMixSettings,
            trimDb: Math.max(-12, Math.min(12, trimDb)),
          },
        })),

      registerReferenceComparison: () =>
        set((state) => ({
          referenceMixSettings: {
            ...state.referenceMixSettings,
            comparisons: state.referenceMixSettings.comparisons + 1,
          },
        })),

      setReferenceQuietChecked: (quietChecked) =>
        set((state) => ({
          referenceMixSettings: {
            ...state.referenceMixSettings,
            quietChecked,
          },
        })),

      resetReferenceMix: () =>
        set({
          referenceMixSettings: {
            ...initialReferenceMixSettings,
            snapshot: null,
          },
        }),

      setActiveExerciseId: (activeExerciseId) =>
        set({ activeExerciseId }),

      recordLearningExperiment: (key, value = true) =>
        set((state) => ({
          learningExperiments: recordExperimentValue(state, key, value),
        })),

      loadProject: (project) =>
        set({
          bpm: project.bpm,
          patterns: {
            A: clonePattern(project.patterns.A),
            B: clonePattern(project.patterns.B),
          },
          melody: [...project.melody],
          chordProgression: [...project.chordProgression],
          harmonySequence: cloneHarmonySequence(project.harmonySequence),
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
          grooveFeelSettings: cloneGrooveFeelSettings(project.grooveFeelSettings),
          formSettings: {
            sections: [...project.formSettings.sections],
            roles: [...project.formSettings.roles],
            layers: project.formSettings.layers.map((entry) => ({ ...entry })),
          },
          textureSettings: { ...project.textureSettings },
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
        chordProgression: state.chordProgression,
        harmonySequence: state.harmonySequence,
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
        grooveFeelSettings: state.grooveFeelSettings,
        formSettings: state.formSettings,
        textureSettings: state.textureSettings,
        eqSettings: state.eqSettings,
        saturationSettings: state.saturationSettings,
        sidechainSettings: state.sidechainSettings,
        stereoSettings: state.stereoSettings,
        referenceMixSettings: state.referenceMixSettings,
        learningExperiments: state.learningExperiments,
        appMode: state.appMode,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<StudioState>;
        const progress = readLearningProgressCookie();

        return {
          ...currentState,
          ...persisted,
          harmonySequence:
            persisted.harmonySequence ?? currentState.harmonySequence,
          learningExperiments:
            persisted.learningExperiments ?? currentState.learningExperiments,
          accompanimentPattern:
            persisted.accompanimentPattern ?? currentState.accompanimentPattern,
          ...(progress
            ? {
                currentLessonId: progress.currentLessonId,
                exerciseIndexByLesson: progress.exerciseIndexByLesson,
                completedExerciseIds: progress.completedExerciseIds,
                completedLessonIds: progress.completedLessonIds,
              }
            : {}),
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
