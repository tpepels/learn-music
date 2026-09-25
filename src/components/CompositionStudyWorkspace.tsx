import { useEffect, useMemo } from "react";
import { audioEngine } from "../audio/engine";
import {
  SCHOENBERG_COMPLETION_COMPOSE_IDS,
  SCHOENBERG_COMPLETION_EXERCISE_IDS,
  SCHOENBERG_COMPLETION_IDS,
  SCHOENBERG_COMPLETION_SOURCE_IDS,
  SCHOENBERG_CONNECTION_EXERCISE_IDS,
  SCHOENBERG_CONNECTION_IDS,
  SCHOENBERG_CONNECTION_SOURCE_IDS,
  SCHOENBERG_SENTENCE_COMPOSE_IDS,
  SCHOENBERG_SENTENCE_EXERCISE_IDS,
  SCHOENBERG_SENTENCE_IDS,
  SCHOENBERG_SENTENCE_SOURCE_IDS,
  SCHOENBERG_PERIOD_COMPOSE_IDS,
  SCHOENBERG_PERIOD_EXERCISE_IDS,
  SCHOENBERG_PERIOD_IDS,
  SCHOENBERG_PHRASE_SOURCE_IDS,
  SCHOENBERG_STUDY_IDS,
  SCHOENBERG_VARIATION_EXERCISE_IDS,
  SCHOENBERG_VARIATION_IDS,
  SCHOENBERG_VARIATION_SOURCE_IDS,
  SCHOENBERG_VARIATION_TRANSFORM_IDS,
  studyComparisonSequence,
  studyConnectionSequence,
  studyVariationSequence,
  type StudyCompletionMode,
  type StudyDuration,
  type StudyHarmony,
  type StudyNotation,
  type StudySentenceMode,
  type StudyTransformation,
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

function durationLabel(duration: StudyDuration): string {
  switch (duration) {
    case 1:
      return "⅛";
    case 2:
      return "¼";
    case 3:
      return "¼·";
    case 4:
      return "½";
  }
}

export function studyStaffY(midi: number): number {
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
  const octave = Math.floor(midi / 12) - 1;
  const diatonic = octave * 7 + naturalSteps[midi % 12];
  const bottomLineE4 = 4 * 7 + 2;
  return 77 - (diatonic - bottomLineE4) * 4;
}

export function studyLedgerYs(y: number): number[] {
  const top = 45;
  const bottom = 77;
  const ledgerLines: number[] = [];

  if (y < top - 2) {
    for (let line = top - 8; line >= y - 1; line -= 8) ledgerLines.push(line);
  }
  if (y > bottom + 2) {
    for (let line = bottom + 8; line <= y + 1; line += 8) ledgerLines.push(line);
  }

  return ledgerLines;
}

export function studyStemDirection(y: number): "up" | "down" {
  return y <= 61 ? "down" : "up";
}

function studyRestGlyph(duration: StudyDuration): string {
  if (duration === 4) return "𝄼";
  if (duration >= 2) return "𝄽";
  return "𝄾";
}

function accidental(midi: number): string {
  const pc = midi % 12;
  return [1, 6].includes(pc) ? "♯" : [3, 8, 10].includes(pc) ? "♭" : "";
}

function StaffView({
  notes,
  durations,
  selectedSteps,
  onToggleSelection,
  editable,
  unitStarts = [0, 8],
}: {
  notes: Array<number | null>;
  durations: StudyDuration[];
  selectedSteps: number[];
  onToggleSelection: (step: number) => void;
  editable: boolean;
  unitStarts?: number[];
}) {
  const staffWidth = Math.max(760, 130 + notes.length * 39);
  return (
    <div className="study-staff-wrap">
      <svg
        className="study-staff"
        viewBox={`0 0 ${staffWidth} 150`}
        style={{ minWidth: staffWidth }}

        role="img"
        aria-label="Treble staff representation of the study phrase"
      >
        {[45, 53, 61, 69, 77].map((y) => (
          <line
            key={y}
            x1="26"
            x2={staffWidth - 22}
            y1={y}
            y2={y}
            className="staff-line"
          />
        ))}
        <text x="34" y="73" className="staff-clef">𝄞</text>
        {unitStarts.filter((step) => step > 0).map((step) => {
          const x = 86 + step * 39 - 19.5;
          return (
            <line
              key={step}
              x1={x}
              x2={x}
              y1="41"
              y2="81"
              className="staff-barline"
            />
          );
        })}
        {notes.map((midi, step) => {
          const x = 86 + step * 39;
          const duration = durations[step] ?? 1;
          const selected = selectedSteps.includes(step);

          if (midi === null) {
            return (
              <g
                key={step}
                className={selected ? "staff-note is-selected" : "staff-note"}
                onClick={() => editable && onToggleSelection(step)}
              >
                <text x={x} y="65" className="staff-rest">
                  {studyRestGlyph(duration)}
                </text>
                {duration === 3 && <circle cx={x + 10} cy="60" r="1.7" />}
                <text x={x} y="112" className="staff-step-label">{step + 1}</text>
              </g>
            );
          }

          const y = studyStaffY(midi);
          const stemDirection = studyStemDirection(y);
          const stemDown = stemDirection === "down";
          const stemX = x + (stemDown ? -6 : 6);
          const stemEndY = y + (stemDown ? 28 : -28);
          const selectedClass = selected ? "staff-note is-selected" : "staff-note";
          const openHead = duration === 4;

          return (
            <g
              key={step}
              className={selectedClass}
              onClick={() => editable && onToggleSelection(step)}
            >
              {studyLedgerYs(y).map((ledgerY) => (
                <line
                  key={ledgerY}
                  x1={x - 11}
                  x2={x + 11}
                  y1={ledgerY}
                  y2={ledgerY}
                  className="staff-ledger"
                />
              ))}
              <ellipse
                cx={x}
                cy={y}
                rx="7"
                ry="5"
                className={openHead ? "is-open" : ""}
              />
              <line x1={stemX} x2={stemX} y1={y} y2={stemEndY} />
              {duration === 1 && (
                <path
                  d={
                    stemDown
                      ? `M ${stemX} ${stemEndY} q -12 -5 -8 -16`
                      : `M ${stemX} ${stemEndY} q 12 5 8 16`
                  }
                  className="staff-flag"
                />
              )}
              {duration === 3 && <circle cx={x + 12} cy={y} r="1.7" />}
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
      <div
        className="study-motive-strip"
        style={{
          gridTemplateColumns: `repeat(${notes.length}, 1fr)`,
          minWidth: Math.max(680, 78 + notes.length * 39),
        }}
      >
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
  durations,
  overlayNotes,
  currentStep,
  editable,
  onEdit,
  unitStarts = [0, 8],
}: {
  notes: Array<number | null>;
  durations: StudyDuration[];
  overlayNotes?: Array<number | null>;
  currentStep: number;
  editable: boolean;
  onEdit: (step: number, midi: number | null) => void;
  unitStarts?: number[];
}) {
  return (
    <div className="study-roll-scroll">
      <div
        className="study-roll"
        style={{ minWidth: Math.max(830, 52 + notes.length * 30) }}
      >
        <div
          className="study-roll-head"
          style={{
            gridTemplateColumns: `52px repeat(${notes.length}, minmax(28px, 1fr))`,
          }}
        >
          <span />
          {notes.map((_, step) => (
            <span key={step} className={unitStarts.includes(step) ? "is-unit-start" : ""}>
              {step + 1}
            </span>
          ))}
        </div>
        {PITCH_ROWS.map((midi) => (
          <div
            className="study-roll-row"
            key={midi}
            style={{
              gridTemplateColumns: `52px repeat(${notes.length}, minmax(28px, 1fr))`,
            }}
          >
            <button
              type="button"
              className="study-note-audition"
              onClick={() => void audioEngine.playPianoNote(midi)}
            >
              {noteName(midi)}
            </button>
            {notes.map((note, step) => {
              const duration = durations[step] ?? 1;
              const hasOverlay =
                overlayNotes?.[step] === midi &&
                (note !== midi || step >= 8);
              return (
                <button
                  type="button"
                  key={step}
                  className={[
                    "study-roll-cell",
                    note === midi ? "is-active" : "",
                    currentStep === step ? "is-playhead" : "",
                    unitStarts.includes(step) ? "is-unit-start" : "",
                    hasOverlay ? "has-source-overlay" : "",
                  ].filter(Boolean).join(" ")}
                  disabled={!editable}
                  onClick={() => onEdit(step, note === midi ? null : midi)}
                  aria-label={"Step " + (step + 1) + " " + noteName(midi)}
                >
                  {hasOverlay && <i aria-hidden="true" />}
                  {note === midi && (
                    <span
                      className="study-roll-note-block"
                      style={{
                        width: `calc(${duration * 100}% + ${Math.max(0, duration - 1) * 2}px)`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DegreeView({
  notes,
  durations,
}: {
  notes: Array<number | null>;
  durations: StudyDuration[];
}) {
  return (
    <div className="study-degree-scroll">
      <div
        className="study-degree-grid"
        style={{
          gridTemplateColumns: `repeat(${notes.length}, minmax(44px, 1fr))`,
          minWidth: Math.max(720, notes.length * 49),
        }}
      >
        {notes.map((midi, step) => (
          <div key={step} className={midi === null ? "is-rest" : ""}>
            <span>{step + 1}</span>
            <strong>{midi === null ? "—" : degreeLabel(midi)}</strong>
            <small>
              {midi === null
                ? "rest"
                : noteName(midi) + " · " + durationLabel(durations[step] ?? 1)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}


const phraseSourceAnswers: Record<
  string,
  Array<{ decision: "same" | "related" | "unrelated"; label: string }>
> = {
  [SCHOENBERG_STUDY_IDS.noteValues]: [
    { decision: "related", label: "Smaller note values" },
    { decision: "same", label: "New harmony" },
    { decision: "unrelated", label: "New key" },
  ],
  [SCHOENBERG_STUDY_IDS.upbeats]: [
    { decision: "related", label: "Upbeats + varied values" },
    { decision: "same", label: "Exact repetition" },
    { decision: "unrelated", label: "Chromatic modulation" },
  ],
  [SCHOENBERG_STUDY_IDS.passingNotes]: [
    { decision: "related", label: "Passing notes" },
    { decision: "same", label: "Chord change" },
    { decision: "unrelated", label: "Meter change" },
  ],
  [SCHOENBERG_STUDY_IDS.repetitions]: [
    { decision: "related", label: "Passing notes + repetition" },
    { decision: "same", label: "Only longer notes" },
    { decision: "unrelated", label: "New tonic" },
  ],
  [SCHOENBERG_STUDY_IDS.embellishment]: [
    { decision: "related", label: "More fluent detail" },
    { decision: "same", label: "No real change" },
    { decision: "unrelated", label: "Too many small notes can obscure harmony" },
  ],
};

function PhraseSourceAnswerPanel({
  exerciseId,
  decision,
  setDecision,
}: {
  exerciseId: string;
  decision: "same" | "related" | "unrelated" | null;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const answers = phraseSourceAnswers[exerciseId] ?? [];
  return (
    <div className="study-source-answer-panel" role="group" aria-label="Answer">
      {answers.map((answer) => (
        <button
          type="button"
          key={answer.decision}
          className={decision === answer.decision ? "is-active" : ""}
          onClick={() => setDecision(answer.decision)}
        >
          {answer.label}
        </button>
      ))}
    </div>
  );
}

const variantCopy: Record<Exclude<StudyVariant, "source">, string> = {
  exact: "Exact repeat",
  related: "Related change",
  unrelated: "Unrelated change",
};

const transformationCopy: Record<
  Exclude<StudyTransformation, "source">,
  string
> = {
  rhythm: "Note lengths / rhythm",
  interval: "Order / direction",
  auxiliary: "Ancillary notes",
  reduction: "Reduction / condensation",
  displacement: "Shift to other beats",
  inversion: "Inversion",
  retrograde: "Retrograde",
  diminution: "Diminution",
  augmentation: "Augmentation",
  repetition: "Note repetition",
  upbeat: "Add upbeat",
  metre: "Change metre / grouping",
  transposition: "Transposition",
};


const variationSourceAnswers: Record<
  string,
  Array<{ decision: "same" | "related" | "unrelated"; label: string }>
> = {
  [SCHOENBERG_VARIATION_IDS.motive]: [
    { decision: "related", label: "A few characteristic features can be enough" },
    { decision: "same", label: "A motive needs many different interval features" },
    { decision: "unrelated", label: "A motive must be long enough to form a phrase" },
  ],
  [SCHOENBERG_VARIATION_IDS.literature]: [
    { decision: "related", label: "Several changes can still preserve one motive" },
    { decision: "same", label: "Only exact pitch repetition preserves identity" },
    { decision: "unrelated", label: "Every changed form is a new motive" },
  ],
  [SCHOENBERG_VARIATION_IDS.harmony]: [
    { decision: "related", label: "Adapt the melody to richer harmony" },
    { decision: "same", label: "Keep melody and harmony mechanically unchanged" },
    { decision: "unrelated", label: "Replace the motive when harmony changes" },
  ],
  [SCHOENBERG_VARIATION_IDS.substitution]: [
    { decision: "related", label: "Insert or substitute harmony under related material" },
    { decision: "same", label: "Harmony may only change at the end" },
    { decision: "unrelated", label: "Harmonic change destroys motivic relation" },
  ],
  [SCHOENBERG_VARIATION_IDS.adaptation]: [
    { decision: "related", label: "Transpose and adapt melody to passing harmony / accompaniment" },
    { decision: "same", label: "Transpose only - accompaniment is irrelevant" },
    { decision: "unrelated", label: "A new accompaniment requires a new motive" },
  ],
};

function VariationSourceAnswerPanel({
  exerciseId,
  decision,
  setDecision,
}: {
  exerciseId: string;
  decision: "same" | "related" | "unrelated" | null;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const answers = variationSourceAnswers[exerciseId] ?? [];
  return (
    <div className="study-source-answer-panel" role="group" aria-label="Source passage answer">
      {answers.map((answer) => (
        <button
          type="button"
          key={answer.decision}
          className={decision === answer.decision ? "is-active" : ""}
          onClick={() => setDecision(answer.decision)}
        >
          {answer.label}
        </button>
      ))}
    </div>
  );
}

function TransformationPanel({
  exerciseId,
  transformation,
  operations,
  setTransformation,
  toggleOperation,
}: {
  exerciseId: string;
  transformation: StudyTransformation;
  operations: StudyTransformation[];
  setTransformation: (transformation: StudyTransformation) => void;
  toggleOperation: (operation: StudyTransformation) => void;
}) {
  const isExact = exerciseId === SCHOENBERG_VARIATION_IDS.exact;
  const isRhythm = exerciseId === SCHOENBERG_VARIATION_IDS.rhythm;
  const isIntervals = exerciseId === SCHOENBERG_VARIATION_IDS.intervals;
  const isMetric = exerciseId === SCHOENBERG_VARIATION_IDS.metric;
  const isCompose = exerciseId === SCHOENBERG_VARIATION_IDS.compose;

  const options: Array<Exclude<StudyTransformation, "source">> = isExact
    ? ["inversion", "retrograde", "diminution", "augmentation"]
    : isRhythm
      ? ["rhythm", "repetition"]
      : isIntervals
        ? ["auxiliary", "interval", "reduction"]
        : isMetric
          ? ["upbeat", "displacement", "metre"]
          : [
              "rhythm",
              "repetition",
              "interval",
              "auxiliary",
              "reduction",
              "displacement",
              "inversion",
              "retrograde",
              "transposition",
            ];

  return (
    <div className="study-transform-panel">
      <div>
        <span className="section-label">
          {isExact
            ? "Example 14 · exact transformations"
            : isRhythm
              ? "Example 17 · rhythmic changes"
              : isIntervals
                ? "Examples 18–21 · interval changes"
                : isMetric
                  ? "Examples 22–24 · beat and metre"
                  : "Systematic motive variation"}
        </span>
        <strong>
          {isCompose
            ? "Combine at least two changes, then revise the result"
            : "Source motive stays on the left; the motive-form is on the right"}
        </strong>
      </div>

      <div className="study-transform-buttons">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={
              isCompose
                ? operations.includes(option) ? "is-active" : ""
                : transformation === option ? "is-active" : ""
            }
            onClick={() =>
              isCompose ? toggleOperation(option) : setTransformation(option)
            }
          >
            {transformationCopy[option]}
          </button>
        ))}
      </div>

      {isCompose && (
        <div className="study-operation-summary">
          <span>Selected transformations</span>
          <strong>
            {operations.length
              ? operations.map((operation) => transformationCopy[
                  operation as Exclude<StudyTransformation, "source">
                ]).join(" + ")
              : "Choose two or three"}
          </strong>
        </div>
      )}
    </div>
  );
}



const connectionSourceAnswers: Record<
  string,
  Array<{ decision: "same" | "related" | "unrelated"; label: string }>
> = {
  [SCHOENBERG_CONNECTION_IDS.wave]: [
    { decision: "related", label: "Waves: rise, recess, higher point, return" },
    { decision: "same", label: "Keep climbing without recession" },
    { decision: "unrelated", label: "Large leaps without compensation" },
  ],
  [SCHOENBERG_CONNECTION_IDS.ex30]: [
    { decision: "related", label: "One broken-chord derivative grows into a phrase" },
    { decision: "same", label: "Several unrelated motives are juxtaposed" },
    { decision: "unrelated", label: "The phrase is built from exact repetition only" },
  ],
  [SCHOENBERG_CONNECTION_IDS.ex31]: [
    { decision: "related", label: "Essential rhythmic features are retained" },
    { decision: "same", label: "Pitch must remain unchanged" },
    { decision: "unrelated", label: "Rhythm is deliberately discarded" },
  ],
  [SCHOENBERG_CONNECTION_IDS.ex32]: [
    { decision: "related", label: "Rhythm stays strict while direction and pitch level change" },
    { decision: "same", label: "Only note lengths change" },
    { decision: "unrelated", label: "Every form uses unrelated rhythm" },
  ],
  [SCHOENBERG_CONNECTION_IDS.ex33]: [
    { decision: "related", label: "Several features change together, but derivation remains traceable" },
    { decision: "same", label: "Only one feature may change at a time" },
    { decision: "unrelated", label: "Far-reaching variation should abandon the motive" },
  ],
  [SCHOENBERG_CONNECTION_IDS.ex34]: [
    { decision: "related", label: "Shift, add upbeats, reduce and omit - but keep a true phrase" },
    { decision: "same", label: "Remote forms are always clearer than close ones" },
    { decision: "unrelated", label: "Reduction and omission cannot support continuation" },
  ],
};

function ConnectionSourceAnswerPanel({
  exerciseId,
  decision,
  setDecision,
}: {
  exerciseId: string;
  decision: "same" | "related" | "unrelated" | null;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const answers = connectionSourceAnswers[exerciseId] ?? [];
  return (
    <div className="study-source-answer-panel" role="group" aria-label="Motive-form source answer">
      {answers.map((answer) => (
        <button
          type="button"
          key={answer.decision}
          className={decision === answer.decision ? "is-active" : ""}
          onClick={() => setDecision(answer.decision)}
        >
          {answer.label}
        </button>
      ))}
    </div>
  );
}

const connectionVariantCopy: Record<
  Exclude<StudyVariant, "source">,
  string
> = {
  exact: "Too much sameness",
  related: "Connected motive-forms",
  unrelated: "Disconnected ideas",
};

const bridgeVariantCopy: Record<Exclude<StudyVariant, "source">, string> = {
  exact: "Weak bridge",
  related: "Connecting bridge",
  unrelated: "Foreign insertion",
};

function ConnectionPanel({
  exerciseId,
  variant,
  decision,
  operations,
  setVariant,
  setDecision,
  toggleOperation,
}: {
  exerciseId: string;
  variant: StudyVariant;
  decision: "same" | "related" | "unrelated" | null;
  operations: StudyTransformation[];
  setVariant: (variant: StudyVariant) => void;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
  toggleOperation: (operation: StudyTransformation) => void;
}) {
  const isCompare = exerciseId === SCHOENBERG_CONNECTION_IDS.compare;
  const isBridge = exerciseId === SCHOENBERG_CONNECTION_IDS.bridge;
  const isRepair = exerciseId === SCHOENBERG_CONNECTION_IDS.repair;
  const isCompose = exerciseId === SCHOENBERG_CONNECTION_IDS.compose;
  const labels = isBridge ? bridgeVariantCopy : connectionVariantCopy;
  const options: Array<Exclude<StudyTransformation, "source">> = [
    "rhythm",
    "interval",
    "auxiliary",
    "reduction",
    "displacement",
  ];

  return (
    <div className="study-connection-panel">
      <div className="study-form-chain" aria-label="Four related motive-forms">
        {["a", "a¹", "a²", "a³"].map((label, index) => (
          <div key={label}>
            <strong>{label}</strong>
            <span>
              {index === 0
                ? "basic motive"
                : isCompose && operations[index - 1]
                  ? transformationCopy[
                      operations[index - 1] as Exclude<
                        StudyTransformation,
                        "source"
                      >
                    ]
                  : "motive-form"}
            </span>
          </div>
        ))}
      </div>

      {(isCompare || isBridge) && (
        <>
          <div className="study-connection-copy">
            <span className="section-label">
              {isBridge
                ? "Common factors can bridge different forms"
                : "Common content + contrast"}
            </span>
            <strong>
              {isBridge
                ? "Which middle form makes the phrase feel continuously related?"
                : "Which phrase is coherent without becoming mere repetition?"}
            </strong>
          </div>
          <div className="study-variant-buttons">
            {(Object.keys(labels) as Array<Exclude<StudyVariant, "source">>).map(
              (option) => (
                <button
                  type="button"
                  key={option}
                  className={variant === option ? "is-active" : ""}
                  onClick={() => setVariant(option)}
                >
                  {labels[option]}
                </button>
              ),
            )}
          </div>
          <div className="study-decision-buttons">
            <span>
              {isBridge
                ? "Choose the relationship that best connects source and destination."
                : "Choose the balance of relationship and contrast that reads as one phrase."}
            </span>
            <button
              type="button"
              className={decision === "related" ? "is-active" : ""}
              onClick={() => setDecision("related")}
            >
              Connected
            </button>
            <button
              type="button"
              className={decision === "same" ? "is-active" : ""}
              onClick={() => setDecision("same")}
            >
              Too repetitive
            </button>
            <button
              type="button"
              className={decision === "unrelated" ? "is-active" : ""}
              onClick={() => setDecision("unrelated")}
            >
              Too foreign
            </button>
          </div>
        </>
      )}

      {isRepair && (
        <div className="study-connection-copy">
          <span className="section-label">Repair the broken link</span>
          <strong>
            a² breaks away from the basic motive. Rework steps 9–12 until all
            four forms feel derived from the same material.
          </strong>
        </div>
      )}

      {isCompose && (
        <>
          <div className="study-connection-copy">
            <span className="section-label">Build a phrase from one motive</span>
            <strong>
              Choose three different transformations for a¹, a² and a³.
            </strong>
          </div>
          <div className="study-transform-buttons">
            {options.map((option) => (
              <button
                type="button"
                key={option}
                className={operations.includes(option) ? "is-active" : ""}
                onClick={() => toggleOperation(option)}
              >
                {transformationCopy[option]}
              </button>
            ))}
          </div>
          <div className="study-operation-summary">
            <span>Forms after the basic motive</span>
            <strong>
              {operations.length
                ? operations
                    .map(
                      (operation, index) =>
                        "a" +
                        ["¹", "²", "³"][index] +
                        " " +
                        transformationCopy[
                          operation as Exclude<
                            StudyTransformation,
                            "source"
                          >
                        ],
                    )
                    .join(" · ")
                : "Choose three"}
            </strong>
          </div>
        </>
      )}
    </div>
  );
}



const sentenceSourceAnswers: Record<
  string,
  Array<{ decision: "same" | "related" | "unrelated"; label: string }>
> = {
  [SCHOENBERG_SENTENCE_IDS.ex35]: [
    { decision: "related", label: "Tonic form answered by dominant form" },
    { decision: "same", label: "Both phrases remain tonic" },
    { decision: "unrelated", label: "The second phrase becomes a new idea" },
  ],
  [SCHOENBERG_SENTENCE_IDS.ex36_37]: [
    { decision: "related", label: "Complementary form may include passing harmonies" },
    { decision: "same", label: "The harmony must be copied literally" },
    { decision: "unrelated", label: "Passing harmony breaks the repetition" },
  ],
  [SCHOENBERG_SENTENCE_IDS.ex38_39]: [
    { decision: "related", label: "Preserve function, not every passing harmony" },
    { decision: "same", label: "Every tonic-form harmony must reappear mechanically" },
    { decision: "unrelated", label: "Part-writing detail is the only thing that matters" },
  ],
  [SCHOENBERG_SENTENCE_IDS.ex40]: [
    { decision: "related", label: "Contour can be exact, or rhythm can survive freer contour" },
    { decision: "same", label: "All dominant forms must preserve contour exactly" },
    { decision: "unrelated", label: "Rhythm may be discarded once harmony changes" },
  ],
  [SCHOENBERG_SENTENCE_IDS.ex41]: [
    { decision: "related", label: "Answer the main harmonies; regular accompaniment can unify" },
    { decision: "same", label: "Every harmony needs a literal dominant counterpart" },
    { decision: "unrelated", label: "Accompaniment should vary constantly" },
  ],
};

function SentenceSourceAnswerPanel({
  exerciseId,
  decision,
  setDecision,
}: {
  exerciseId: string;
  decision: "same" | "related" | "unrelated" | null;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const answers = sentenceSourceAnswers[exerciseId] ?? [];
  return (
    <div className="study-source-answer-panel" role="group" aria-label="Book example answer">
      {answers.map((answer) => (
        <button
          type="button"
          key={answer.decision}
          className={decision === answer.decision ? "is-active" : ""}
          onClick={() => setDecision(answer.decision)}
        >
          {answer.label}
        </button>
      ))}
    </div>
  );
}

const sentenceModeCopy: Record<StudySentenceMode, string> = {
  immediate: "Immediate repetition",
  delayed: "Delayed return",
  contrast: "Contrasting second phrase",
  exact: "Exact repetition",
  transposed: "Transposed repetition",
  "tonic-repeat": "Tonic → tonic",
  complementary: "Tonic → dominant",
};

function StudyHarmonyLane({
  harmony,
  sentenceMode,
}: {
  harmony: StudyHarmony[];
  sentenceMode: StudySentenceMode;
}) {
  const first = harmony[0];
  const second = harmony[8];
  return (
    <div className="study-harmony-lane" aria-label="Harmonic support">
      <div>
        <span>Basic idea</span>
        <strong>{first ?? "—"}</strong>
        <small>{first === "I" ? "tonic form" : "no harmonic label"}</small>
      </div>
      <div>
        <span>Immediate repetition</span>
        <strong>{second ?? "—"}</strong>
        <small>
          {sentenceMode === "complementary"
            ? "dominant form"
            : second === "I"
              ? "same harmonic support"
              : second === "V"
                ? "dominant support"
                : "no harmonic label"}
        </small>
      </div>
    </div>
  );
}

function SentencePanel({
  exerciseId,
  mode,
  decision,
  setMode,
  setDecision,
}: {
  exerciseId: string;
  mode: StudySentenceMode;
  decision: "same" | "related" | "unrelated" | null;
  setMode: (mode: StudySentenceMode) => void;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const isRecognise = exerciseId === SCHOENBERG_SENTENCE_IDS.recognise;
  const isRepetition = exerciseId === SCHOENBERG_SENTENCE_IDS.repetition;
  const isHarmony = exerciseId === SCHOENBERG_SENTENCE_IDS.harmony;
  const isCompose = SCHOENBERG_SENTENCE_COMPOSE_IDS.has(exerciseId);

  const options: StudySentenceMode[] = isRecognise
    ? ["immediate", "delayed", "contrast"]
    : isRepetition
      ? ["exact", "transposed", "contrast"]
      : isHarmony
        ? ["tonic-repeat", "complementary", "contrast"]
        : ["exact", "transposed", "complementary"];

  return (
    <div className="study-sentence-panel">
      <div className="study-sentence-form">
        <div>
          <span>Beginning of sentence</span>
          <strong>basic idea</strong>
          <small>a</small>
        </div>
        <b>→</b>
        <div>
          <span>immediate repetition</span>
          <strong>
            {mode === "transposed"
              ? "a transposed"
              : mode === "complementary"
                ? "a in dominant form"
                : mode === "contrast"
                  ? "new material"
                  : "a repeated"}
          </strong>
          <small>a¹</small>
        </div>
      </div>

      <div className="study-connection-copy">
        <span className="section-label">
          {isRecognise
            ? "Beginning the sentence"
            : isRepetition
              ? "Repetition can be exact or transposed"
              : isHarmony
                ? "Complementary repetition"
                : "Construct a presentation"}
        </span>
        <strong>
          {isRecognise
            ? "Which opening establishes the idea by repeating it immediately?"
            : isRepetition
              ? "Which version changes pitch level while preserving the same interval pattern?"
              : isHarmony
                ? "Which repetition keeps the idea but changes its harmonic function from tonic to dominant?"
                : "Reshape the basic idea, then choose how its immediate repetition will function."}
        </strong>
      </div>

      <div className="study-sentence-buttons">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={mode === option ? "is-active" : ""}
            onClick={() => setMode(option)}
          >
            {sentenceModeCopy[option]}
          </button>
        ))}
      </div>

      {!isCompose && (
        <div className="study-decision-buttons">
          <span>
            {isRecognise
              ? "Which one behaves as the beginning of a sentence?"
              : isRepetition
                ? "Which one is a transposed repetition rather than a new idea?"
                : "Which one demonstrates tonic/dominant complementary repetition?"}
          </span>
          <button
            type="button"
            className={decision === "related" ? "is-active" : ""}
            onClick={() => setDecision("related")}
          >
            {isRecognise
              ? "Immediate repetition"
              : isRepetition
                ? "Transposed repetition"
                : "Tonic → dominant"}
          </button>
          <button
            type="button"
            className={decision === "same" ? "is-active" : ""}
            onClick={() => setDecision("same")}
          >
            {isRecognise
              ? "Delayed return"
              : isRepetition
                ? "Exact repetition"
                : "Tonic → tonic"}
          </button>
          <button
            type="button"
            className={decision === "unrelated" ? "is-active" : ""}
            onClick={() => setDecision("unrelated")}
          >
            Contrasting material
          </button>
        </div>
      )}
    </div>
  );
}


function PeriodPanel({
  mode,
  decision,
  setMode,
  setDecision,
}: {
  mode: StudySentenceMode;
  decision: "same" | "related" | "unrelated" | null;
  setMode: (mode: StudySentenceMode) => void;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const options: StudySentenceMode[] = ["immediate", "delayed", "contrast"];

  return (
    <div className="study-sentence-panel">
      <div className="study-sentence-form">
        <div>
          <span>Opening phrase</span>
          <strong>basic idea</strong>
          <small>a</small>
        </div>
        <b>→</b>
        <div>
          <span>{mode === "delayed" ? "contrast before return" : "next phrase"}</span>
          <strong>
            {mode === "immediate"
              ? "a repeated immediately"
              : mode === "delayed"
                ? "remote material → return"
                : "unrelated material"}
          </strong>
          <small>{mode === "delayed" ? "b → a¹" : "a¹"}</small>
        </div>
      </div>

      <div className="study-connection-copy">
        <span className="section-label">Period · postponed repetition</span>
        <strong>Which version delays the return of the opening idea until after contrasting material?</strong>
      </div>

      <div className="study-sentence-buttons">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={mode === option ? "is-active" : ""}
            onClick={() => setMode(option)}
          >
            {option === "immediate"
              ? "Immediate repetition"
              : option === "delayed"
                ? "Postponed return"
                : "Unrelated continuation"}
          </button>
        ))}
      </div>

      <div className="study-decision-buttons">
        <span>Which one behaves as the beginning of a period?</span>
        <button
          type="button"
          className={decision === "related" ? "is-active" : ""}
          onClick={() => setDecision("related")}
        >
          Postponed return
        </button>
        <button
          type="button"
          className={decision === "same" ? "is-active" : ""}
          onClick={() => setDecision("same")}
        >
          Immediate repetition
        </button>
        <button
          type="button"
          className={decision === "unrelated" ? "is-active" : ""}
          onClick={() => setDecision("unrelated")}
        >
          No audible relation
        </button>
      </div>
    </div>
  );
}


const completionModeCopy: Record<StudyCompletionMode, string> = {
  "repeat-presentation": "Keep repeating the opening",
  "developed-continuation": "Developed continuation",
  "foreign-continuation": "New unrelated material",
  "static-fragment": "Repeat one fragment",
  sequence: "Sequential treatment",
  unliquidated: "Keep full motive-forms",
  liquidation: "Liquidate toward cadence",
  abrupt: "Abrupt cut to cadence",
  complete: "Sequence → liquidation → cadence",
};

function CompletionPanel({
  exerciseId,
  mode,
  decision,
  setMode,
  setDecision,
}: {
  exerciseId: string;
  mode: StudyCompletionMode;
  decision: "same" | "related" | "unrelated" | null;
  setMode: (mode: StudyCompletionMode) => void;
  setDecision: (decision: "same" | "related" | "unrelated") => void;
}) {
  const isFunction = exerciseId === SCHOENBERG_COMPLETION_IDS.function;
  const isSequence = exerciseId === SCHOENBERG_COMPLETION_IDS.sequence;
  const isLiquidation = exerciseId === SCHOENBERG_COMPLETION_IDS.liquidation;
  const isCompose = SCHOENBERG_COMPLETION_COMPOSE_IDS.has(exerciseId);

  const options: StudyCompletionMode[] = isFunction
    ? [
        "repeat-presentation",
        "developed-continuation",
        "foreign-continuation",
      ]
    : isSequence
      ? ["static-fragment", "sequence", "foreign-continuation"]
      : isLiquidation
        ? ["unliquidated", "liquidation", "abrupt"]
        : ["complete", "sequence", "unliquidated"];

  return (
    <div className="study-completion-panel">
      <div className="study-completion-map" aria-label="Sentence functions">
        <div className="is-opening">
          <span>Beginning</span>
          <strong>basic idea + repetition</strong>
          <small>steps 1–16</small>
        </div>
        <b>→</b>
        <div className="is-continuation">
          <span>Continuation</span>
          <strong>
            {mode === "repeat-presentation"
              ? "more repetition"
              : mode === "foreign-continuation"
                ? "foreign material"
                : mode === "static-fragment"
                  ? "static fragment"
                  : "developed motive-forms"}
          </strong>
          <small>steps 17–24</small>
        </div>
        <b>→</b>
        <div
          className={
            ["liquidation", "complete", "developed-continuation"].includes(mode)
              ? "is-liquidation is-active"
              : "is-liquidation"
          }
        >
          <span>Liquidation</span>
          <strong>remove characteristic features</strong>
          <small>steps 25–28</small>
        </div>
        <b>→</b>
        <div
          className={
            ["liquidation", "complete", "developed-continuation", "abrupt"].includes(mode)
              ? "is-cadence is-active"
              : "is-cadence"
          }
        >
          <span>Cadence</span>
          <strong>V → I</strong>
          <small>steps 29–32</small>
        </div>
      </div>

      <div className="study-connection-copy">
        <span className="section-label">
          {isFunction
            ? "Completing the sentence"
            : isSequence
              ? "Sequence-like continuation"
              : isLiquidation
                ? "Liquidation and delimitation"
                : "Complete the sentence"}
        </span>
        <strong>
          {isFunction
            ? "After the beginning has established the idea, which second half actually develops it?"
            : isSequence
              ? "Which continuation repeats a transformed pattern at new pitch levels rather than merely looping it?"
              : isLiquidation
                ? "Which version gradually reduces characteristic material so that a cadence can end the sentence?"
                : "Shape one full sentence: establish, develop, liquidate, then cadence."}
        </strong>
      </div>

      <div className="study-completion-buttons">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={mode === option ? "is-active" : ""}
            onClick={() => setMode(option)}
          >
            {completionModeCopy[option]}
          </button>
        ))}
      </div>

      {!isCompose && (
        <div className="study-decision-buttons">
          <span>
            {isFunction
              ? "Which version has continuation function?"
              : isSequence
                ? "Which version uses a sequence-like procedure?"
                : "Which version demonstrates liquidation rather than mere omission?"}
          </span>
          <button
            type="button"
            className={decision === "related" ? "is-active" : ""}
            onClick={() => setDecision("related")}
          >
            {isFunction
              ? "Developed continuation"
              : isSequence
                ? "Sequential treatment"
                : "Gradual liquidation"}
          </button>
          <button
            type="button"
            className={decision === "same" ? "is-active" : ""}
            onClick={() => setDecision("same")}
          >
            {isFunction
              ? "More presentation"
              : isSequence
                ? "Static repetition"
                : "No liquidation"}
          </button>
          <button
            type="button"
            className={decision === "unrelated" ? "is-active" : ""}
            onClick={() => setDecision("unrelated")}
          >
            {isLiquidation ? "Abrupt break" : "Unrelated material"}
          </button>
        </div>
      )}
    </div>
  );
}

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
  const setStudyTransformation = useStudioStore((state) => state.setStudyTransformation);
  const toggleStudyOperation = useStudioStore((state) => state.toggleStudyOperation);
  const setStudySentenceMode = useStudioStore((state) => state.setStudySentenceMode);
  const setStudyCompletionMode = useStudioStore(
    (state) => state.setStudyCompletionMode,
  );

  const state = compositionStudy[exerciseId];
  const notes = state?.notes ?? Array(16).fill(null);
  const durations = state?.durations ?? Array<StudyDuration>(16).fill(1);
  const notation = state?.notation ?? "staff";
  const selectedSteps = state?.selectedSteps ?? [];
  const transformation = state?.transformation ?? "source";
  const operations = state?.operations ?? [];

  const isAnalyse = exerciseId === SCHOENBERG_STUDY_IDS.analyse;
  const isCompare = exerciseId === SCHOENBERG_STUDY_IDS.compare;
  const isPhraseSource = SCHOENBERG_PHRASE_SOURCE_IDS.has(exerciseId);
  const isPhraseBuild = exerciseId === SCHOENBERG_STUDY_IDS.build;
  const isVariation = SCHOENBERG_VARIATION_EXERCISE_IDS.has(exerciseId);
  const isVariationSource = SCHOENBERG_VARIATION_SOURCE_IDS.has(exerciseId);
  const isVariationTransform = SCHOENBERG_VARIATION_TRANSFORM_IDS.has(exerciseId);
  const isVariationCompose = exerciseId === SCHOENBERG_VARIATION_IDS.compose;
  const isConnection = SCHOENBERG_CONNECTION_EXERCISE_IDS.has(exerciseId);
  const isConnectionSource = SCHOENBERG_CONNECTION_SOURCE_IDS.has(exerciseId);
  const isConnectionRepair = exerciseId === SCHOENBERG_CONNECTION_IDS.repair;
  const isConnectionCompose = exerciseId === SCHOENBERG_CONNECTION_IDS.compose;
  const isSentence = SCHOENBERG_SENTENCE_EXERCISE_IDS.has(exerciseId);
  const isSentenceSource = SCHOENBERG_SENTENCE_SOURCE_IDS.has(exerciseId);
  const isSentenceCompose = SCHOENBERG_SENTENCE_COMPOSE_IDS.has(exerciseId);
  const isCompletion = SCHOENBERG_COMPLETION_EXERCISE_IDS.has(exerciseId);
  const isCompletionSource = SCHOENBERG_COMPLETION_SOURCE_IDS.has(exerciseId);
  const isCompletionCompose = SCHOENBERG_COMPLETION_COMPOSE_IDS.has(exerciseId);
  const isPeriod = SCHOENBERG_PERIOD_EXERCISE_IDS.has(exerciseId);
  const isPeriodCompare = exerciseId === SCHOENBERG_PERIOD_IDS.distinguish;
  const isPeriodCompose = SCHOENBERG_PERIOD_COMPOSE_IDS.has(exerciseId);
  const sentenceMode = state?.sentenceMode ?? "exact";
  const completionMode = state?.completionMode ?? "complete";
  const harmony =
    state?.harmony ?? Array<StudyHarmony>(notes.length).fill(null);
  const editable =
    exerciseId === SCHOENBERG_STUDY_IDS.repair ||
    exerciseId === SCHOENBERG_STUDY_IDS.compose ||
    isPhraseBuild ||
    isVariationCompose ||
    isConnectionRepair ||
    isConnectionCompose ||
    isSentenceCompose ||
    isCompletionCompose ||
    isPeriodCompose;

  const visibleSequence = useMemo(() => {
    if (isCompare && state?.variant) {
      return {
        notes: studyComparisonSequence(state.variant),
        durations: Array<StudyDuration>(16).fill(1),
      };
    }
    return { notes, durations };
  }, [durations, isCompare, notes, state?.variant]);

  const sourceOverlay = useMemo(() => {
    if (isVariationTransform) return studyVariationSequence("source").notes;
    if (isConnection && (isConnectionRepair || isConnectionCompose)) {
      return studyConnectionSequence("exact").notes;
    }
    if (isSentence && isSentenceCompose) {
      return notes.slice(0, 8).concat(notes.slice(0, 8));
    }
    return undefined;
  }, [
    isConnection,
    isConnectionCompose,
    isConnectionRepair,
    isSentence,
    isSentenceCompose,
    isVariationTransform,
    notes,
  ]);

  useEffect(() => {
    audioEngine.setStudySequence(
      visibleSequence.notes,
      visibleSequence.durations,
      harmony,
    );
  }, [harmony, visibleSequence]);

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
          <h2>
            {isPeriod
              ? "Period · antecedent → caesura → consequent → cadence"
              : isCompletion
                ? "Complete sentence · beginning → cadence"
              : isSentenceSource
                ? "Tonic form → dominant form"
                : isSentence
                  ? "Basic idea → immediate repetition"
                : isConnection
                ? "Four motive-forms · one basic motive"
                : isVariation
                  ? "Source motive → motive-form"
                  : "One phrase · three representations"}
          </h2>
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

      {isPhraseSource && (
        <PhraseSourceAnswerPanel
          exerciseId={exerciseId}
          decision={state?.decision ?? null}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

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

      {isVariationSource && (
        <VariationSourceAnswerPanel
          exerciseId={exerciseId}
          decision={state?.decision ?? null}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isVariationTransform && (
        <TransformationPanel
          exerciseId={exerciseId}
          transformation={transformation}
          operations={operations}
          setTransformation={(next) => setStudyTransformation(exerciseId, next)}
          toggleOperation={(operation) =>
            toggleStudyOperation(exerciseId, operation)
          }
        />
      )}

      {isConnectionSource && (
        <ConnectionSourceAnswerPanel
          exerciseId={exerciseId}
          decision={state?.decision ?? null}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isConnection && !isConnectionSource && (
        <ConnectionPanel
          exerciseId={exerciseId}
          variant={state?.variant ?? "source"}
          decision={state?.decision ?? null}
          operations={operations}
          setVariant={(next) => setStudyVariant(exerciseId, next)}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
          toggleOperation={(operation) =>
            toggleStudyOperation(exerciseId, operation)
          }
        />
      )}

      {isSentenceSource && (
        <SentenceSourceAnswerPanel
          exerciseId={exerciseId}
          decision={state?.decision ?? null}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isPeriodCompare && (
        <PeriodPanel
          mode={sentenceMode}
          decision={state?.decision ?? null}
          setMode={(next) => setStudySentenceMode(exerciseId, next)}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isSentence && !isSentenceSource && (
        <SentencePanel
          exerciseId={exerciseId}
          mode={sentenceMode}
          decision={state?.decision ?? null}
          setMode={(next) => setStudySentenceMode(exerciseId, next)}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isCompletion && !isCompletionSource && (
        <CompletionPanel
          exerciseId={exerciseId}
          mode={completionMode}
          decision={state?.decision ?? null}
          setMode={(next) => setStudyCompletionMode(exerciseId, next)}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isSentence &&
        notes.length === 16 &&
        (isSentenceSource ||
          exerciseId === SCHOENBERG_SENTENCE_IDS.harmony ||
          sentenceMode === "complementary" ||
          sentenceMode === "tonic-repeat") && (
          <StudyHarmonyLane harmony={harmony} sentenceMode={sentenceMode} />
        )}

      <div className="study-notation-stage">
        {notation === "staff" && (
          <StaffView
            notes={visibleSequence.notes}
            durations={visibleSequence.durations}
            selectedSteps={selectedSteps}
            onToggleSelection={(step) => toggleStudySelection(exerciseId, step)}
            editable={isAnalyse}
            unitStarts={
              isPeriod && visibleSequence.notes.length > 16
                ? [0, 8, 16, 24]
                : isCompletion
                  ? [0, 8, 16, 20, 24, 28, 30]
                : isConnection
                  ? [0, 4, 8, 12]
                  : isSentence && visibleSequence.notes.length > 16
                    ? [0, 8, 16, 24]
                    : [0, 8]
            }
          />
        )}
        {notation === "piano-roll" && (
          <PianoRollView
            notes={visibleSequence.notes}
            durations={visibleSequence.durations}
            overlayNotes={sourceOverlay}
            currentStep={currentStep}
            editable={editable}
            onEdit={(step, midi) => setStudyStep(exerciseId, step, midi)}
            unitStarts={
              isPeriod && visibleSequence.notes.length > 16
                ? [0, 8, 16, 24]
                : isCompletion
                  ? [0, 8, 16, 20, 24, 28, 30]
                : isConnection
                  ? [0, 4, 8, 12]
                  : isSentence && visibleSequence.notes.length > 16
                    ? [0, 8, 16, 24]
                    : [0, 8]
            }
          />
        )}
        {notation === "degrees" && (
          <DegreeView
            notes={visibleSequence.notes}
            durations={visibleSequence.durations}
          />
        )}
      </div>

      <footer className="study-footer">
        <span>
          {isPeriod
            ? isPeriodCompose
              ? "Edit the full 32-step period in Piano roll. Keep a contrasting second phrase in the antecedent, let the opening return in the consequent, and preserve a clear final close."
              : isPeriodCompare
                ? "Compare immediate repetition with postponed return. A period delays the larger repetition until contrasting material has formed an antecedent."
                : "Listen across all four eight-step units: opening, contrasting continuation, return, and cadential close."
            : isCompletion
            ? isCompletionCompose
              ? "Edit the basic idea or the continuation in Piano roll. Listen to all 32 steps: the second half should develop the source, reduce characteristic material, and earn the final V → I cadence."
              : "Listen beyond step 16. The opening has already established the idea; now judge what the second half does with it."
            : isSentence
              ? isSentenceCompose
                ? "Edit the basic idea in the first half. Its repetition is regenerated from the selected sentence-opening strategy; the pale overlay shows the source relationship."
                : isSentenceSource
                  ? visibleSequence.notes.length > 16
                    ? "Listen to both 16-step pairs before answering. Compare how each one preserves the relation while changing its treatment."
                    : "Listen to the phrase relationship and the supporting harmony before answering."
                  : "Listen across the boundary at step 9: in a sentence beginning, the basic idea is repeated immediately, even when pitch or harmony changes."
            : isConnection
              ? isConnectionCompose
              ? "The pale outline repeats the basic motive under each form. Use it as a reference, not a target: the phrase needs relationship and contrast."
              : isConnectionRepair
                ? "Repair a² in Piano roll, then compare all four motive-forms in Staff and Degrees."
                : "Listen to the whole four-form phrase before deciding how strongly the common factors connect it."
            : isVariation
              ? isVariationCompose
                ? "The pale piano-roll outline is the unaltered source. Edit the generated motive-form if the combination needs refinement."
                : "Compare the unchanged source on the left with its motive-form on the right. Switch notation whenever another view makes the relationship clearer."
              : isAnalyse
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
