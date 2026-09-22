import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  cloneArrangement,
  clonePattern,
  initialArrangement,
  initialAutomationSettings,
  initialChordProgression,
  initialMelody,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialMixerSettings,
  initialPattern,
  initialProjectMilestones,
  initialSynthSettings,
  type Arrangement,
  type ArrangementLayer,
  type AutomationSettings,
  type ChordName,
  type ChordProgression,
  type DynamicsSettings,
  type EffectsSettings,
  type MelodySequence,
  type MixerSettings,
  type MixerTrackId,
  type PatternId,
  type ProjectMilestones,
  type StepPattern,
  type SynthSettings,
  type TrackName,
} from "../music/model";

const FIRST_LESSON_ID = "rhythm.pulse-and-groove";

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
};

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      bpm: 96,
      isPlaying: false,
      currentStep: 0,
      currentLessonId: FIRST_LESSON_ID,
      exerciseIndexByLesson: {},
      completedExerciseIds: [],
      activePattern: "A",
      patterns: {
        A: clonePattern(initialPattern),
        B: clonePattern(initialPattern),
      },
      completedLessonIds: [],
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
        appMode: state.appMode,
      }),
    },
  ),
);
