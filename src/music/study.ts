export const STUDY_STEPS = 16;

export type StudyNotation = "staff" | "piano-roll" | "degrees";
export type StudyDecision = "same" | "related" | "unrelated" | null;
export type StudyVariant = "source" | "exact" | "related" | "unrelated";

export type StudyExerciseState = {
  notes: Array<number | null>;
  notation: StudyNotation;
  selectedSteps: number[];
  decision: StudyDecision;
  variant: StudyVariant;
};

export type CompositionStudyState = Record<string, StudyExerciseState>;

export const SCHOENBERG_STUDY_IDS = {
  analyse: "schoenberg.phrase-motive.a",
  compare: "schoenberg.phrase-motive.b",
  repair: "schoenberg.phrase-motive.c",
  compose: "schoenberg.phrase-motive.d",
} as const;

const analysePhrase = [
  60, 62, 64, 62,
  60, 62, 64, 62,
  67, 65, 64, 62,
  60, null, null, null,
];

const sourceMotive = [60, 62, 65, 64];

const comparisonVariants: Record<StudyVariant, number[]> = {
  source: sourceMotive,
  exact: [60, 62, 65, 64],
  related: [62, 64, 67, 66],
  unrelated: [67, 60, 66, 61],
};

function padStudyNotes(notes: Array<number | null>): Array<number | null> {
  return Array.from({ length: STUDY_STEPS }, (_, index) => notes[index] ?? null);
}

export function studyComparisonSequence(
  variant: StudyVariant,
): Array<number | null> {
  if (variant === "source") {
    return padStudyNotes([...sourceMotive, null, null, null, null, ...sourceMotive]);
  }

  return padStudyNotes([
    ...sourceMotive,
    null,
    null,
    null,
    null,
    ...comparisonVariants[variant],
  ]);
}

function defaultExerciseState(id: string): StudyExerciseState {
  if (id === SCHOENBERG_STUDY_IDS.analyse) {
    return {
      notes: [...analysePhrase],
      notation: "staff",
      selectedSteps: [],
      decision: null,
      variant: "source",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.compare) {
    return {
      notes: studyComparisonSequence("source"),
      notation: "staff",
      selectedSteps: [],
      decision: null,
      variant: "source",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.repair) {
    return {
      notes: padStudyNotes([
        60, 62, 65, 64,
        67, 61, 68, 60,
      ]),
      notation: "piano-roll",
      selectedSteps: [],
      decision: null,
      variant: "source",
    };
  }

  return {
    notes: padStudyNotes([]),
    notation: "piano-roll",
    selectedSteps: [],
    decision: null,
    variant: "source",
  };
}

export function initialCompositionStudyState(): CompositionStudyState {
  return Object.values(SCHOENBERG_STUDY_IDS).reduce<CompositionStudyState>(
    (state, id) => {
      state[id] = defaultExerciseState(id);
      return state;
    },
    {},
  );
}

export function cloneStudyExerciseState(
  state: StudyExerciseState,
): StudyExerciseState {
  return {
    notes: [...state.notes],
    notation: state.notation,
    selectedSteps: [...state.selectedSteps],
    decision: state.decision,
    variant: state.variant,
  };
}

export function ensureStudyExerciseState(
  state: CompositionStudyState,
  id: string,
): StudyExerciseState {
  return state[id]
    ? cloneStudyExerciseState(state[id])
    : defaultExerciseState(id);
}

export function resetStudyExerciseState(id: string): StudyExerciseState {
  return defaultExerciseState(id);
}

function sign(value: number): number {
  return value === 0 ? 0 : value > 0 ? 1 : -1;
}

function compactBlock(
  notes: Array<number | null>,
  start: number,
  length = 4,
): number[] {
  return notes
    .slice(start, start + length)
    .filter((note): note is number => note !== null);
}

export function studyBlocksAreRelated(
  notes: Array<number | null>,
  leftStart = 0,
  rightStart = 4,
): boolean {
  const left = compactBlock(notes, leftStart);
  const right = compactBlock(notes, rightStart);

  if (left.length < 3 || right.length < 3 || left.length !== right.length) {
    return false;
  }

  const leftIntervals = left.slice(1).map((note, index) => note - left[index]);
  const rightIntervals = right.slice(1).map((note, index) => note - right[index]);

  const exactIntervalShape = leftIntervals.every(
    (interval, index) => interval === rightIntervals[index],
  );
  if (exactIntervalShape) return true;

  const sharedDirections = leftIntervals.filter(
    (interval, index) => sign(interval) === sign(rightIntervals[index]),
  ).length;

  const sharedIntervalSizes = leftIntervals.filter(
    (interval, index) =>
      Math.abs(interval) === Math.abs(rightIntervals[index]),
  ).length;

  return sharedDirections >= 2 || sharedIntervalSizes >= 2;
}

export function studyBlocksAreIdentical(
  notes: Array<number | null>,
  leftStart = 0,
  rightStart = 4,
): boolean {
  return Array.from({ length: 4 }, (_, index) => index).every(
    (offset) => notes[leftStart + offset] === notes[rightStart + offset],
  );
}

export function studyBlockNoteCount(
  notes: Array<number | null>,
  start: number,
  length = 4,
): number {
  return compactBlock(notes, start, length).length;
}
