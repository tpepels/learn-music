import { create } from "zustand";
import {
  clonePattern,
  initialPattern,
  type StepPattern,
  type TrackName,
} from "../music/model";

type StudioState = {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  pattern: StepPattern;
  setBpm: (bpm: number) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
  toggleStep: (track: TrackName, step: number) => void;
  resetPattern: () => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  bpm: 96,
  isPlaying: false,
  currentStep: 0,
  pattern: clonePattern(initialPattern),

  setBpm: (bpm) => set({ bpm }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),

  toggleStep: (track, step) =>
    set((state) => {
      const pattern = clonePattern(state.pattern);
      pattern[track][step] = !pattern[track][step];
      return { pattern };
    }),

  resetPattern: () =>
    set({
      pattern: clonePattern(initialPattern),
      currentStep: 0,
    }),
}));
