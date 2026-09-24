import { useEffect, useMemo } from "react";
import { audioEngine } from "../audio/engine";
import {
  SCHOENBERG_STUDY_IDS,
  studyComparisonSequence,
  type StudyNotation,
  type StudyVariant,
} from "../music/study";
import { useStudioStore } from "../state/studio";

const PITCH_ROWS = Array.from({ length: 18 }, (_, index) => 72 - index);
const pitchNames = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];

function noteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return pitchNames[midi % 12] + octave;
}

function degreeLabel(midi: number): string {
  const labels: Record<number, string> = {
    0: "1",
    2: "2",
    4: "3",
    5: "4",
    7: "5",
    9: "6",
    11: "7",
  };
  return labels[midi % 12] ?? "·";
}

function staffY(midi: number): number {
  const naturalSteps: Record<number, number> = {
    0: 0,
    1: 0,
    2: 1,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 4,
    8: 5,
    9: 5,
    10: 6,
    11: 6,
  };
  const octave = Math.floor(midi / 12) - 5;
  const diatonic = octave * 7 + naturalSteps[midi % 12];
  return 77 - diatonic * 4;
}

function accidental(midi: number): string {
  const pc = midi % 12;
  return [1, 6].includes(pc) ? "♯" : [3, 8, 10].includes(pc) ? "♭" : "";
}

function StaffView({
  notes,
  selectedSteps,
  onToggleSelection,
  editable,
}: {
  notes: Array<number | null>;
  selectedSteps: number[];
  onToggleSelection: (step: number) => void;
  editable: boolean;
}) {
  return (
    <div className="study-staff-wrap">
      <svg
        className="study-staff"
        viewBox="0 0 760 150"
        role="img"
        aria-label="Treble staff representation of the study phrase"
      >
        {[45, 53, 61, 69, 77].map((y) => (
          <line key={y} x1="26" x2="738" y1={y} y2={y} className="staff-line" />
        ))}
        <text x="34" y="73" className="staff-clef">𝄞</text>
        <line x1="389" x2="389" y1="41" y2="81" className="staff-barline" />
        {notes.map((midi, step) => {
          if (midi === null) return null;
          const x = 86 + step * 39;
          const y = staffY(midi);
          const selected = selectedSteps.includes(step);
          return (
            <g
              key={step}
              className={selected ? "staff-note is-selected" : "staff-note"}
              onClick={() => editable && onToggleSelection(step)}
            >
              <ellipse cx={x} cy={y} rx="7" ry="5" />
              <line x1={x + 6} x2={x + 6} y1={y} y2={y - 28} />
              {accidental(midi) && (
                <text x={x - 15} y={y + 4} className="staff-accidental">
                  {accidental(midi)}
                </text>
              )}
              <text x={x} y="112" className="staff-step-label">{step + 1}</text>
            </g>
          );
        })}
      </svg>
      <div className="study-motive-strip">
        {notes.map((_, step) => (
          <button
            type="button"
            key={step}
            className={selectedSteps.includes(step) ? "is-selected" : ""}
            onClick={() => editable && onToggleSelection(step)}
            disabled={!editable}
          >
            {step + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function PianoRollView({
  notes,
  currentStep,
  editable,
  onEdit,
}: {
  notes: Array<number | null>;
  currentStep: number;
  editable: boolean;
  onEdit: (step: number, midi: number | null) => void;
}) {
  return (
    <div className="study-roll-scroll">
      <div className="study-roll">
        <div className="study-roll-head">
          <span />
          {notes.map((_, step) => (
            <span key={step} className={step === 0 || step === 4 ? "is-unit-start" : ""}>
              {step + 1}
            </span>
          ))}
        </div>
        {PITCH_ROWS.map((midi) => (
          <div className="study-roll-row" key={midi}>
            <button
              type="button"
              className="study-note-audition"
              onClick={() => void audioEngine.playPianoNote(midi)}
            >
              {noteName(midi)}
            </button>
            {notes.map((note, step) => (
              <button
                type="button"
                key={step}
                className={[
                  "study-roll-cell",
                  note === midi ? "is-active" : "",
                  currentStep === step ? "is-playhead" : "",
                  step === 0 || step === 4 ? "is-unit-start" : "",
                ].filter(Boolean).join(" ")}
                disabled={!editable}
                onClick={() => onEdit(step, note === midi ? null : midi)}
                aria-label={"Step " + (step + 1) + " " + noteName(midi)}
              >
                <span />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DegreeView({ notes }: { notes: Array<number | null> }) {
  return (
    <div className="study-degree-grid">
      {notes.map((midi, step) => (
        <div key={step} className={midi === null ? "is-rest" : ""}>
          <span>{step + 1}</span>
          <strong>{midi === null ? "—" : degreeLabel(midi)}</strong>
          <small>{midi === null ? "rest" : noteName(midi)}</small>
        </div>
      ))}
    </div>
  );
}

const variantCopy: Record<Exclude<StudyVariant, "source">, string> = {
  exact: "Exact repeat",
  related: "Related change",
  unrelated: "Unrelated change",
};

export function CompositionStudyWorkspace({
  exerciseId,
}: {
  exerciseId: string;
}) {
  const currentStep = useStudioStore((state) => state.currentStep);
  const compositionStudy = useStudioStore((state) => state.compositionStudy);
  const setStudyNotation = useStudioStore((state) => state.setStudyNotation);
  const toggleStudySelection = useStudioStore((state) => state.toggleStudySelection);
  const setStudyStep = useStudioStore((state) => state.setStudyStep);
  const setStudyDecision = useStudioStore((state) => state.setStudyDecision);
  const setStudyVariant = useStudioStore((state) => state.setStudyVariant);

  const state = compositionStudy[exerciseId];
  const notes = state?.notes ?? Array(16).fill(null);
  const notation = state?.notation ?? "staff";
  const selectedSteps = state?.selectedSteps ?? [];
  const isAnalyse = exerciseId === SCHOENBERG_STUDY_IDS.analyse;
  const isCompare = exerciseId === SCHOENBERG_STUDY_IDS.compare;
  const editable =
    exerciseId === SCHOENBERG_STUDY_IDS.repair ||
    exerciseId === SCHOENBERG_STUDY_IDS.compose;

  useEffect(() => {
    audioEngine.setStudySequence(notes);
  }, [notes]);

  const visibleNotes = useMemo(
    () => isCompare && state?.variant
      ? studyComparisonSequence(state.variant)
      : notes,
    [isCompare, notes, state?.variant],
  );

  useEffect(() => {
    audioEngine.setStudySequence(visibleNotes);
  }, [visibleNotes]);

  const notationOptions: Array<[StudyNotation, string]> = [
    ["staff", "Staff"],
    ["piano-roll", "Piano roll"],
    ["degrees", "Degrees"],
  ];

  return (
    <section className="composition-study-card">
      <header className="workspace-heading study-heading">
        <div>
          <span className="section-label">Composition study</span>
          <h2>One phrase · three representations</h2>
        </div>
        <div className="study-notation-tabs" role="group" aria-label="Notation">
          {notationOptions.map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={notation === value ? "is-active" : ""}
              onClick={() => setStudyNotation(exerciseId, value)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {isCompare && (
        <div className="study-compare-panel">
          <div>
            <span className="section-label">Source + continuation</span>
            <strong>Hear what changed and what survived</strong>
          </div>
          <div className="study-variant-buttons">
            {(Object.keys(variantCopy) as Array<Exclude<StudyVariant, "source">>).map((variant) => (
              <button
                type="button"
                key={variant}
                className={state?.variant === variant ? "is-active" : ""}
                onClick={() => setStudyVariant(exerciseId, variant)}
              >
                {variantCopy[variant]}
              </button>
            ))}
          </div>
          <div className="study-decision-buttons">
            <span>Which version changes the idea while preserving its interval pattern?</span>
            <button
              type="button"
              className={state?.decision === "related" ? "is-active" : ""}
              onClick={() => setStudyDecision(exerciseId, "related")}
            >
              Related change
            </button>
            <button
              type="button"
              className={state?.decision === "same" ? "is-active" : ""}
              onClick={() => setStudyDecision(exerciseId, "same")}
            >
              Exact repeat
            </button>
            <button
              type="button"
              className={state?.decision === "unrelated" ? "is-active" : ""}
              onClick={() => setStudyDecision(exerciseId, "unrelated")}
            >
              Unrelated
            </button>
          </div>
        </div>
      )}

      <div className="study-notation-stage">
        {notation === "staff" && (
          <StaffView
            notes={visibleNotes}
            selectedSteps={selectedSteps}
            onToggleSelection={(step) => toggleStudySelection(exerciseId, step)}
            editable={isAnalyse}
          />
        )}
        {notation === "piano-roll" && (
          <PianoRollView
            notes={visibleNotes}
            currentStep={currentStep}
            editable={editable}
            onEdit={(step, midi) => setStudyStep(exerciseId, step, midi)}
          />
        )}
        {notation === "degrees" && <DegreeView notes={visibleNotes} />}
      </div>

      <footer className="study-footer">
        <span>
          {isAnalyse
            ? "Click steps 1–4 below the staff to bracket the opening motive."
            : editable
              ? "Edit in Piano roll; Staff and Degrees update from the same notes."
              : "Use Play in the top bar after selecting each comparison."}
        </span>
        <strong>C major · 4/4</strong>
      </footer>
    </section>
  );
}
