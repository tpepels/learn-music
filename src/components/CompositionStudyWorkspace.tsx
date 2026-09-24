import { useEffect, useMemo } from "react";
import { audioEngine } from "../audio/engine";
import {
  SCHOENBERG_COMPLETION_EXERCISE_IDS,
  SCHOENBERG_COMPLETION_IDS,
  SCHOENBERG_CONNECTION_EXERCISE_IDS,
  SCHOENBERG_CONNECTION_IDS,
  SCHOENBERG_SENTENCE_EXERCISE_IDS,
  SCHOENBERG_SENTENCE_IDS,
  SCHOENBERG_STUDY_IDS,
  SCHOENBERG_VARIATION_EXERCISE_IDS,
  SCHOENBERG_VARIATION_IDS,
  studyComparisonSequence,
  studyConnectionSequence,
  studyVariationSequence,
  type StudyCompletionMode,
  type StudyDuration,
  type StudyFeature,
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
  const octave = Math.floor(midi / 12) - 1;
  const diatonic = octave * 7 + naturalSteps[midi % 12];
  const bottomLineE4 = 4 * 7 + 2;
  return 77 - (diatonic - bottomLineE4) * 4;
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
          if (midi === null) return null;
          const x = 86 + step * 39;
          const y = staffY(midi);
          const duration = durations[step] ?? 1;
          const selected = selectedSteps.includes(step);
          const openHead = duration === 4;
          return (
            <g
              key={step}
              className={selected ? "staff-note is-selected" : "staff-note"}
              onClick={() => editable && onToggleSelection(step)}
            >
              <ellipse
                cx={x}
                cy={y}
                rx="7"
                ry="5"
                className={openHead ? "is-open" : ""}
              />
              <line x1={x + 6} x2={x + 6} y1={y} y2={y - 28} />
              {duration === 1 && (
                <path
                  d={`M ${x + 6} ${y - 28} q 12 5 8 16`}
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

const variantCopy: Record<Exclude<StudyVariant, "source">, string> = {
  exact: "Exact repeat",
  related: "Related change",
  unrelated: "Unrelated change",
};

const transformationCopy: Record<
  Exclude<StudyTransformation, "source">,
  string
> = {
  rhythm: "Rhythm",
  interval: "Intervals / direction",
  auxiliary: "Auxiliary note",
  reduction: "Reduction",
  displacement: "Beat position",
};

const featureCopy: Record<StudyFeature, string> = {
  rhythm: "Rhythm",
  intervals: "Intervals / order",
  ornamentation: "Added note",
  reduction: "Reduction",
  position: "Position in the bar",
};

function TransformationPanel({
  exerciseId,
  transformation,
  featureDecision,
  operations,
  setTransformation,
  setFeatureDecision,
  toggleOperation,
}: {
  exerciseId: string;
  transformation: StudyTransformation;
  featureDecision: StudyFeature | null;
  operations: StudyTransformation[];
  setTransformation: (transformation: StudyTransformation) => void;
  setFeatureDecision: (feature: StudyFeature) => void;
  toggleOperation: (operation: StudyTransformation) => void;
}) {
  const isAnalyse = exerciseId === SCHOENBERG_VARIATION_IDS.analyse;
  const isRhythm = exerciseId === SCHOENBERG_VARIATION_IDS.rhythm;
  const isIntervals = exerciseId === SCHOENBERG_VARIATION_IDS.intervals;
  const isCompose = exerciseId === SCHOENBERG_VARIATION_IDS.compose;

  const options: Array<Exclude<StudyTransformation, "source">> = isRhythm
    ? ["rhythm", "displacement"]
    : isIntervals
      ? ["interval", "auxiliary", "reduction"]
      : ["rhythm", "interval", "auxiliary", "reduction", "displacement"];

  return (
    <div className="study-transform-panel">
      <div>
        <span className="section-label">
          {isAnalyse ? "Chapter III · compare motive-forms" : "Transform the second half"}
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

      {isAnalyse && transformation !== "source" && (
        <div className="study-feature-question">
          <span>What changed most clearly in this motive-form?</span>
          <div>
            {(Object.keys(featureCopy) as StudyFeature[]).map((feature) => (
              <button
                type="button"
                key={feature}
                className={featureDecision === feature ? "is-active" : ""}
                onClick={() => setFeatureDecision(feature)}
              >
                {featureCopy[feature]}
              </button>
            ))}
          </div>
          <small>
            Schoenberg's categories overlap in real music. Here each miniature
            isolates one feature so you can hear the distinction first.
          </small>
        </div>
      )}

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
  const isCompose = exerciseId === SCHOENBERG_SENTENCE_IDS.compose;

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
            ? "Chapter V · beginning the sentence"
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
  const setStudyFeatureDecision = useStudioStore((state) => state.setStudyFeatureDecision);
  const toggleStudyOperation = useStudioStore((state) => state.toggleStudyOperation);
  const setStudySentenceMode = useStudioStore((state) => state.setStudySentenceMode);

  const state = compositionStudy[exerciseId];
  const notes = state?.notes ?? Array(16).fill(null);
  const durations = state?.durations ?? Array<StudyDuration>(16).fill(1);
  const notation = state?.notation ?? "staff";
  const selectedSteps = state?.selectedSteps ?? [];
  const transformation = state?.transformation ?? "source";
  const featureDecision = state?.featureDecision ?? null;
  const operations = state?.operations ?? [];

  const isAnalyse = exerciseId === SCHOENBERG_STUDY_IDS.analyse;
  const isCompare = exerciseId === SCHOENBERG_STUDY_IDS.compare;
  const isVariation = SCHOENBERG_VARIATION_EXERCISE_IDS.has(exerciseId);
  const isVariationCompose = exerciseId === SCHOENBERG_VARIATION_IDS.compose;
  const isConnection = SCHOENBERG_CONNECTION_EXERCISE_IDS.has(exerciseId);
  const isConnectionRepair = exerciseId === SCHOENBERG_CONNECTION_IDS.repair;
  const isConnectionCompose = exerciseId === SCHOENBERG_CONNECTION_IDS.compose;
  const isSentence = SCHOENBERG_SENTENCE_EXERCISE_IDS.has(exerciseId);
  const isSentenceCompose = exerciseId === SCHOENBERG_SENTENCE_IDS.compose;
  const sentenceMode = state?.sentenceMode ?? "exact";
  const harmony = state?.harmony ?? Array<StudyHarmony>(16).fill(null);
  const editable =
    exerciseId === SCHOENBERG_STUDY_IDS.repair ||
    exerciseId === SCHOENBERG_STUDY_IDS.compose ||
    isVariationCompose ||
    isConnectionRepair ||
    isConnectionCompose ||
    isSentenceCompose;

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
    if (isVariation) return studyVariationSequence("source").notes;
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
    isVariation,
    notes,
  ]);

  useEffect(() => {
    audioEngine.setStudySequence(
      visibleSequence.notes,
      visibleSequence.durations,
      isSentence ? harmony : undefined,
    );
  }, [harmony, isSentence, visibleSequence]);

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
            {isSentence
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

      {isVariation && (
        <TransformationPanel
          exerciseId={exerciseId}
          transformation={transformation}
          featureDecision={featureDecision}
          operations={operations}
          setTransformation={(next) => setStudyTransformation(exerciseId, next)}
          setFeatureDecision={(feature) =>
            setStudyFeatureDecision(exerciseId, feature)
          }
          toggleOperation={(operation) =>
            toggleStudyOperation(exerciseId, operation)
          }
        />
      )}

      {isConnection && (
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

      {isSentence && (
        <SentencePanel
          exerciseId={exerciseId}
          mode={sentenceMode}
          decision={state?.decision ?? null}
          setMode={(next) => setStudySentenceMode(exerciseId, next)}
          setDecision={(next) => setStudyDecision(exerciseId, next)}
        />
      )}

      {isSentence &&
        (exerciseId === SCHOENBERG_SENTENCE_IDS.harmony ||
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
            unitStarts={isConnection ? [0, 4, 8, 12] : [0, 8]}
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
            unitStarts={isConnection ? [0, 4, 8, 12] : [0, 8]}
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
          {isSentence
            ? isSentenceCompose
              ? "Edit the basic idea in the first half. Its repetition is regenerated from the selected sentence-opening strategy; the pale overlay shows the source relationship."
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
