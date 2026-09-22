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
  clonePattern,
  cloneReferenceSnapshot,
  cloneSaturationSettings,
  cloneStereoSettings,
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
  type Arrangement,
  type ArrangementLayer,
  type AutomationSettings,
  type BassSequence,
  type ChordName,
  type ChordProgression,
  type DynamicsSettings,
  type EffectsSettings,
  type EqSettings,
  type FormSectionLabel,
  type FormSettings,
  type GrooveFeelSettings,
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
};

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
          return { chordProgression };
        }),

      clearChords: () =>
        set({ chordProgression: [...initialChordProgression], currentStep: 0 }),

      setSynthSettings: (settings) =>
        set((state) => ({
          synthSettings: {
            ...state.synthSettings,
            ...settings,
          },
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
        })),

      resetDynamics: () =>
        set({ dynamicsSettings: { ...initialDynamicsSettings } }),

      setEffectsSettings: (settings) =>
        set((state) => ({
          effectsSettings: {
            ...state.effectsSettings,
            ...settings,
          },
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
        set((state) =>
          resetLessonProgressState(
            {
              currentLessonId: state.currentLessonId,
              exerciseIndexByLesson: state.exerciseIndexByLesson,
              completedExerciseIds: state.completedExerciseIds,
              completedLessonIds: state.completedLessonIds,
              currentStep: state.currentStep,
            },
            lessonId,
            exerciseIds,
          ),
        ),

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
          };
        }),

      resetFormSettings: () =>
        set({
          formSettings: {
            sections: [...initialFormSettings.sections],
            roles: [...initialFormSettings.roles],
          },
        }),

      setTextureSettings: (settings) =>
        set((state) => ({
          textureSettings: {
            ...state.textureSettings,
            ...settings,
          },
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
        })),

      resetSidechain: () =>
        set({ sidechainSettings: { ...initialSidechainSettings } }),

      setStereoWidth: (track, width) =>
        set((state) => ({
          stereoSettings: {
            ...state.stereoSettings,
            widths: {
              ...state.stereoSettings.widths,
              [track]: Math.max(0, Math.min(1, width)),
            },
          },
        })),

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

      loadProject: (project) =>
        set({
          bpm: project.bpm,
          patterns: {
            A: clonePattern(project.patterns.A),
            B: clonePattern(project.patterns.B),
          },
          melody: [...project.melody],
          chordProgression: [...project.chordProgression],
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
        appMode: state.appMode,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<StudioState>;
        const progress = readLearningProgressCookie();

        return {
          ...currentState,
          ...persisted,
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
