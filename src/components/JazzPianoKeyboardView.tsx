import type { CSSProperties } from "react";
import {
  harmonyPitches,
  type HarmonySequence,
} from "../music/model";
import { describeJazzKeyboardShape } from "../music/jazzKeyboardRelations";

const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const ASCENDING_PITCHES = [...harmonyPitches].reverse();
const WHITE_PITCHES = ASCENDING_PITCHES.filter((midi) =>
  WHITE_PITCH_CLASSES.has(midi % 12),
);
const BLACK_PITCHES = ASCENDING_PITCHES.filter(
  (midi) => !WHITE_PITCH_CLASSES.has(midi % 12),
);

function blackKeyLeft(midi: number): string {
  const whiteKeysBefore = WHITE_PITCHES.filter((note) => note < midi).length;
  return (whiteKeysBefore / WHITE_PITCHES.length) * 100 + "%";
}

function notesUsedInBar(sequence: HarmonySequence, bar: number): Set<number> {
  return new Set(sequence.slice(bar * 8, bar * 8 + 8).flat());
}

export function JazzPianoKeyboardView({
  sequence,
  selectedStep,
  currentStep,
  isPlaying,
  formatNote,
  onSelectStep,
  onToggleNote,
  onAudition,
}: {
  sequence: HarmonySequence;
  selectedStep: number;
  currentStep: number;
  isPlaying: boolean;
  formatNote: (midi: number) => string;
  onSelectStep: (step: number) => void;
  onToggleNote: (midi: number) => void;
  onAudition: (midi: number) => void;
}) {
  const bar = Math.floor(selectedStep / 8);
  const eighth = selectedStep % 8;
  const selectedNotes = sequence[selectedStep] ?? [];
  const activeNotes = new Set(selectedNotes);
  const barNotes = notesUsedInBar(sequence, bar);
  const shape = describeJazzKeyboardShape(selectedNotes);

  const selectBar = (nextBar: number) => {
    onSelectStep(nextBar * 8 + eighth);
  };

  const relationCopy = (() => {
    if (shape.notes.length === 0) {
      return {
        title: "No notes on this step yet",
        detail:
          "Click piano keys here or draw notes in the grid. The interval readout updates immediately.",
      };
    }

    if (shape.notes.length === 1) {
      return {
        title: formatNote(shape.notes[0]),
        detail: "Add another note on this step to see the interval between the keys.",
      };
    }

    if (shape.notes.length === 2 && shape.span) {
      return {
        title: shape.notes.map(formatNote).join(" · "),
        detail:
          shape.span.name +
          " · " +
          shape.span.semitones +
          " semitones from the lower key to the upper key.",
      };
    }

    const adjacent = shape.adjacent
      .map((interval) => interval.name)
      .join(" · ");
    const span = shape.span
      ? " Outer span: " +
        shape.span.name +
        " (" +
        shape.span.semitones +
        " semitones)."
      : "";

    return {
      title: shape.notes.map(formatNote).join(" · "),
      detail: "Adjacent intervals: " + adjacent + "." + span,
    };
  })();

  return (
    <section className="jazz-keyboard-view" aria-label="Jazz piano keyboard view">
      <div className="jazz-keyboard-view-heading">
        <div>
          <span className="section-label">Keyboard view</span>
          <strong>See the shape you are building</strong>
          <p>
            The grid shows time. This piano shows the physical spacing of the notes
            at one selected eighth-note step.
          </p>
        </div>
        <div className="jazz-keyboard-view-legend" aria-hidden="true">
          <span><i className="is-step" /> selected step</span>
          <span><i className="is-bar" /> elsewhere in this bar</span>
        </div>
      </div>

      <div className="jazz-keyboard-navigation">
        <div className="jazz-keyboard-bars" aria-label="Select bar">
          {Array.from({ length: 4 }, (_, index) => {
            const hasNotes = sequence
              .slice(index * 8, index * 8 + 8)
              .some((notes) => notes.length > 0);
            return (
              <button
                type="button"
                key={index}
                className={bar === index ? "is-active" : ""}
                onClick={() => selectBar(index)}
              >
                Bar {index + 1}
                {hasNotes ? <i aria-label="contains notes">•</i> : null}
              </button>
            );
          })}
        </div>

        <div className="jazz-keyboard-steps" aria-label={"Select eighth-note step in bar " + (bar + 1)}>
          {Array.from({ length: 8 }, (_, localStep) => {
            const step = bar * 8 + localStep;
            const hasNotes = (sequence[step]?.length ?? 0) > 0;
            const playhead = isPlaying && currentStep === step;
            return (
              <button
                type="button"
                key={step}
                className={[
                  selectedStep === step ? "is-active" : "",
                  hasNotes ? "has-notes" : "",
                  playhead ? "is-playhead" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => onSelectStep(step)}
                aria-label={
                  "Bar " +
                  (bar + 1) +
                  ", eighth " +
                  (localStep + 1) +
                  (hasNotes ? ", contains notes" : "")
                }
              >
                {localStep + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="jazz-piano-keyboard">
        <div className="jazz-piano-white-keys">
          {WHITE_PITCHES.map((midi) => (
            <button
              type="button"
              key={midi}
              className={[
                "jazz-piano-key",
                "is-white",
                barNotes.has(midi) ? "is-in-bar" : "",
                activeNotes.has(midi) ? "is-active" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => {
                onToggleNote(midi);
                onAudition(midi);
              }}
              aria-pressed={activeNotes.has(midi)}
              title={
                (activeNotes.has(midi) ? "Remove " : "Add ") +
                formatNote(midi) +
                " at bar " +
                (bar + 1) +
                ", eighth " +
                (eighth + 1)
              }
            >
              <span>{formatNote(midi)}</span>
            </button>
          ))}
        </div>

        {BLACK_PITCHES.map((midi) => (
          <button
            type="button"
            key={midi}
            className={[
              "jazz-piano-key",
              "is-black",
              barNotes.has(midi) ? "is-in-bar" : "",
              activeNotes.has(midi) ? "is-active" : "",
            ].filter(Boolean).join(" ")}
            style={{ left: blackKeyLeft(midi) } as CSSProperties}
            onClick={() => {
              onToggleNote(midi);
              onAudition(midi);
            }}
            aria-pressed={activeNotes.has(midi)}
            title={
              (activeNotes.has(midi) ? "Remove " : "Add ") +
              formatNote(midi) +
              " at bar " +
              (bar + 1) +
              ", eighth " +
              (eighth + 1)
            }
          >
            <span>{formatNote(midi)}</span>
          </button>
        ))}
      </div>

      <div className="jazz-keyboard-relation" aria-live="polite">
        <div>
          <span>Bar {bar + 1} · eighth {eighth + 1}</span>
          <strong>{relationCopy.title}</strong>
        </div>
        <p>{relationCopy.detail}</p>
      </div>

      <p className="jazz-keyboard-tip">
        Switch bars to compare inversions and voicings. Switch eighth-note steps to
        inspect scales, lines and moving chord shapes one event at a time.
      </p>
    </section>
  );
}
