import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clonePattern,
  initialPattern,
  type PatternId,
  type StepPattern,
  type TrackName,
} from "../music/model";

const FIRST_LESSON_ID = "rhythm.pulse-and-groove";

type StudioState = {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  currentLessonId: string;
  activePattern: PatternId;
  patterns: Record<PatternId, StepPattern>;
  completedLessonIds: string[];
  setBpm: (bpm: number) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setCurrentLesson: (lessonId: string) => void;
  setActivePattern: (patternId: PatternId) => void;
  toggleStep: (track: TrackName, step: number) => void;
  resetPattern: (patternId: PatternId, source?: StepPattern) => void;
  completeLesson: (lessonId: string) => void;
};

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      bpm: 96,
      isPlaying: false,
      currentStep: 0,
      currentLessonId: FIRST_LESSON_ID,
      activePattern: "A",
      patterns: {
        A: clonePattern(initialPattern),
        B: clonePattern(initialPattern),
      },
      completedLessonIds: [],

      setBpm: (bpm) => set({ bpm }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentStep: (currentStep) => set({ currentStep }),

      setCurrentLesson: (currentLessonId) =>
        set({
          currentLessonId,
          activePattern: currentLessonId === FIRST_LESSON_ID ? "A" : "B",
          currentStep: 0,
        }),

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
    }),
    {
      name: "learn-music-studio-v1",
      partialize: (state) => ({
        bpm: state.bpm,
        currentLessonId: state.currentLessonId,
        activePattern: state.activePattern,
        patterns: state.patterns,
        completedLessonIds: state.completedLessonIds,
      }),
    },
  ),
);
