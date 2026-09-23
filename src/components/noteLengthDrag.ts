import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type {
  HarmonyDurations,
  HarmonySequence,
  MelodySequence,
  NoteDurationLane,
} from "../music/model";

export function findMonophonicNoteStart(
  sequence: MelodySequence,
  durations: NoteDurationLane,
  midi: number,
  step: number,
): number | null {
  for (let start = step; start >= 0; start -= 1) {
    if (sequence[start] !== midi) continue;
    const duration = Math.max(1, durations[start] ?? 1);
    if (start + duration > step) return start;
  }
  return null;
}

export function findHarmonyNoteStart(
  sequence: HarmonySequence,
  durations: HarmonyDurations,
  midi: number,
  step: number,
): number | null {
  for (let start = step; start >= 0; start -= 1) {
    if (!(sequence[start] ?? []).includes(midi)) continue;
    const duration = Math.max(1, durations[start]?.[midi] ?? 1);
    if (start + duration > step) return start;
  }
  return null;
}

type DragState = {
  startStep: number;
  midi: number;
  removeOnTap: boolean;
  moved: boolean;
  lastDuration: number;
};

type NoteLengthDragOptions = {
  maxSteps: number;
  addNote: (step: number, midi: number) => void;
  removeNote: (step: number, midi: number) => void;
  setDuration: (step: number, midi: number, duration: number) => void;
  audition?: (midi: number) => void | Promise<void>;
};

export function useNoteLengthDrag({
  maxSteps,
  addNote,
  removeNote,
  setDuration,
  audition,
}: NoteLengthDragOptions) {
  const drag = useRef<DragState | null>(null);
  const callbacks = useRef({
    addNote,
    removeNote,
    setDuration,
    audition,
  });
  callbacks.current = { addNote, removeNote, setDuration, audition };

  useEffect(() => {
    const finish = () => {
      const current = drag.current;
      if (!current) return;

      if (current.removeOnTap && !current.moved) {
        callbacks.current.removeNote(current.startStep, current.midi);
      }
      drag.current = null;
    };

    const cancel = () => {
      drag.current = null;
    };

    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
    };
  }, []);

  const begin = (
    event: ReactPointerEvent<HTMLElement>,
    {
      step,
      midi,
      isStart,
      coveringStart,
    }: {
      step: number;
      midi: number;
      isStart: boolean;
      coveringStart: number | null;
    },
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();

    const startStep = coveringStart ?? step;
    const isEmpty = coveringStart === null && !isStart;

    if (isEmpty) {
      callbacks.current.addNote(step, midi);
      callbacks.current.setDuration(step, midi, 1);
    }

    drag.current = {
      startStep,
      midi,
      removeOnTap: isStart || coveringStart !== null,
      moved: false,
      lastDuration: Math.max(1, step - startStep + 1),
    };

    void callbacks.current.audition?.(midi);
  };

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current) return;

    const element = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-note-step][data-note-midi]");
    if (!element) return;

    const targetStep = Number(element.dataset.noteStep);
    const targetMidi = Number(element.dataset.noteMidi);
    if (!Number.isInteger(targetStep) || targetMidi !== current.midi) return;

    const duration = Math.max(
      1,
      Math.min(maxSteps - current.startStep, targetStep - current.startStep + 1),
    );

    if (duration === current.lastDuration) return;
    current.lastDuration = duration;
    current.moved = true;
    callbacks.current.setDuration(
      current.startStep,
      current.midi,
      duration,
    );
  };

  return { beginNoteDrag: begin, moveNoteDrag: move };
}
