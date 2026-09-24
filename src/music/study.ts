export const STUDY_STEPS = 16;

export type StudyNotation = "staff" | "piano-roll" | "degrees";
export type StudyDecision = "same" | "related" | "unrelated" | null;
export type StudyVariant = "source" | "exact" | "related" | "unrelated";
export type StudyDuration = 1 | 2 | 3 | 4;
export type StudyFeature =
  | "rhythm"
  | "intervals"
  | "ornamentation"
  | "reduction"
  | "position";
export type StudyTransformation =
  | "source"
  | "rhythm"
  | "interval"
  | "auxiliary"
  | "reduction"
  | "displacement";

export type StudyExerciseState = {
  notes: Array<number | null>;
  durations: StudyDuration[];
  notation: StudyNotation;
  selectedSteps: number[];
  decision: StudyDecision;
  variant: StudyVariant;
  transformation: StudyTransformation;
  featureDecision: StudyFeature | null;
  operations: StudyTransformation[];
};

export type CompositionStudyState = Record<string, StudyExerciseState>;

export const SCHOENBERG_STUDY_IDS = {
  analyse: "schoenberg.phrase-motive.a",
  compare: "schoenberg.phrase-motive.b",
  repair: "schoenberg.phrase-motive.c",
  compose: "schoenberg.phrase-motive.d",
} as const;

export const SCHOENBERG_VARIATION_IDS = {
  analyse: "schoenberg.developing-variation.a",
  rhythm: "schoenberg.developing-variation.b",
  intervals: "schoenberg.developing-variation.c",
  compose: "schoenberg.developing-variation.d",
} as const;

export const SCHOENBERG_VARIATION_EXERCISE_IDS = new Set<string>(
  Object.values(SCHOENBERG_VARIATION_IDS),
);

export const SCHOENBERG_CONNECTION_IDS = {
  compare: "schoenberg.connecting-motive-forms.a",
  bridge: "schoenberg.connecting-motive-forms.b",
  repair: "schoenberg.connecting-motive-forms.c",
  compose: "schoenberg.connecting-motive-forms.d",
} as const;

export const SCHOENBERG_CONNECTION_EXERCISE_IDS = new Set<string>(
  Object.values(SCHOENBERG_CONNECTION_IDS),
);

export const studyTransformationFeature: Record<
  Exclude<StudyTransformation, "source">,
  StudyFeature
> = {
  rhythm: "rhythm",
  interval: "intervals",
  auxiliary: "ornamentation",
  reduction: "reduction",
  displacement: "position",
};

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

function padDurations(
  durations: number[] = [],
  fallback: StudyDuration = 1,
): StudyDuration[] {
  return Array.from({ length: STUDY_STEPS }, (_, index) => {
    const duration = durations[index] ?? fallback;
    return Math.max(1, Math.min(4, Math.round(duration))) as StudyDuration;
  });
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

const variationSourceHalf: Array<number | null> = [
  60, null, 64, null, 67, null, 65, null,
];

const variationSourceDurations: StudyDuration[] = [
  2, 1, 2, 1, 2, 1, 2, 1,
];

export type StudySequence = {
  notes: Array<number | null>;
  durations: StudyDuration[];
};

function combineHalves(
  second: Array<number | null>,
  secondDurations: StudyDuration[],
): StudySequence {
  return {
    notes: [...variationSourceHalf, ...second],
    durations: [
      ...variationSourceDurations,
      ...secondDurations,
    ],
  };
}

export function studyVariationSequence(
  transformation: StudyTransformation,
): StudySequence {
  switch (transformation) {
    case "rhythm":
      return combineHalves(
        [60, 64, null, null, 67, 65, null, null],
        [1, 3, 1, 1, 1, 2, 1, 1],
      );
    case "interval":
      return combineHalves(
        [60, null, 63, null, 67, null, 64, null],
        [2, 1, 2, 1, 2, 1, 2, 1],
      );
    case "auxiliary":
      return combineHalves(
        [60, 62, 64, null, 67, null, 65, null],
        [1, 1, 2, 1, 2, 1, 2, 1],
      );
    case "reduction":
      return combineHalves(
        [60, null, null, 67, null, null, 65, null],
        [2, 1, 1, 2, 1, 1, 2, 1],
      );
    case "displacement":
      return combineHalves(
        [null, 60, null, 64, null, 67, null, 65],
        [1, 1, 1, 1, 1, 1, 1, 1],
      );
    case "source":
      return combineHalves(
        [...variationSourceHalf],
        [...variationSourceDurations],
      );
  }
}

function applyOperationToSecondHalf(
  second: Array<number | null>,
  durations: StudyDuration[],
  operation: StudyTransformation,
): { notes: Array<number | null>; durations: StudyDuration[] } {
  switch (operation) {
    case "source":
      return { notes: second, durations };
    case "rhythm": {
      const pitches = second.filter((note): note is number => note !== null);
      const notes: Array<number | null> = Array(8).fill(null);
      [0, 1, 4, 6].forEach((step, index) => {
        if (pitches[index] !== undefined) notes[step] = pitches[index];
      });
      const nextDurations = Array<StudyDuration>(8).fill(1);
      nextDurations[0] = 1;
      nextDurations[1] = 3;
      nextDurations[4] = 1;
      nextDurations[6] = 2;
      return { notes, durations: nextDurations };
    }
    case "interval":
      return {
        notes: second.map((note, index) =>
          note === null ? null : note + (index % 4 === 2 ? -1 : 0),
        ),
        durations,
      };
    case "auxiliary": {
      const notes = [...second];
      const first = notes.findIndex((note) => note !== null);
      if (first >= 0 && first + 1 < notes.length && notes[first + 1] === null) {
        notes[first + 1] = (notes[first] as number) + 2;
      }
      return { notes, durations };
    }
    case "reduction": {
      const notes = [...second];
      const active = notes
        .map((note, index) => (note === null ? -1 : index))
        .filter((index) => index >= 0);
      if (active.length > 3) notes[active[1]] = null;
      return { notes, durations };
    }
    case "displacement":
      return {
        notes: [null, ...second.slice(0, -1)],
        durations: [1, ...durations.slice(0, -1)] as StudyDuration[],
      };
  }
}

export function studyCombinedVariation(
  operations: StudyTransformation[],
): StudySequence {
  let second = [...variationSourceHalf];
  let secondDurations = [...variationSourceDurations];

  operations
    .filter((operation) => operation !== "source")
    .slice(0, 3)
    .forEach((operation) => {
      const next = applyOperationToSecondHalf(
        second,
        secondDurations,
        operation,
      );
      second = next.notes;
      secondDurations = next.durations;
    });

  return combineHalves(second, secondDurations);
}


const connectionSourceBlock: Array<number | null> = [60, 62, 65, 64];
const connectionSourceDurations: StudyDuration[] = [1, 1, 1, 1];

function connectionBlock(
  operation: StudyTransformation,
  index = 1,
): StudySequence {
  const transpose = index * 2;
  switch (operation) {
    case "rhythm":
      return {
        notes: [...connectionSourceBlock],
        durations: [1, 2, 1, 2],
      };
    case "interval":
      return {
        notes: [60 + transpose, 63 + transpose, 65 + transpose, 64 + transpose],
        durations: [...connectionSourceDurations],
      };
    case "auxiliary":
      return {
        notes: [60 + transpose, 61 + transpose, 62 + transpose, 65 + transpose],
        durations: [...connectionSourceDurations],
      };
    case "reduction":
      return {
        notes: [60 + transpose, null, 65 + transpose, 64 + transpose],
        durations: [...connectionSourceDurations],
      };
    case "displacement":
      return {
        notes: [null, 60 + transpose, 62 + transpose, 65 + transpose],
        durations: [...connectionSourceDurations],
      };
    case "source":
      return {
        notes: connectionSourceBlock.map((note) =>
          note === null ? null : note + transpose,
        ),
        durations: [...connectionSourceDurations],
      };
  }
}

function joinConnectionBlocks(blocks: StudySequence[]): StudySequence {
  return {
    notes: blocks.flatMap((block) => block.notes),
    durations: blocks.flatMap((block) => block.durations),
  };
}

const connectedForms = joinConnectionBlocks([
  {
    notes: [...connectionSourceBlock],
    durations: [...connectionSourceDurations],
  },
  connectionBlock("source", 1),
  connectionBlock("interval", 1),
  connectionBlock("source", 2),
]);

const monotonousForms = joinConnectionBlocks(
  Array.from({ length: 4 }, () => ({
    notes: [...connectionSourceBlock],
    durations: [...connectionSourceDurations],
  })),
);

const disconnectedForms = joinConnectionBlocks([
  {
    notes: [...connectionSourceBlock],
    durations: [...connectionSourceDurations],
  },
  {
    notes: [67, 60, 66, 61],
    durations: [...connectionSourceDurations],
  },
  {
    notes: [61, 68, 62, 70],
    durations: [...connectionSourceDurations],
  },
  {
    notes: [65, 58, 69, 60],
    durations: [...connectionSourceDurations],
  },
]);

export function studyConnectionSequence(
  variant: StudyVariant,
): StudySequence {
  switch (variant) {
    case "exact":
      return monotonousForms;
    case "unrelated":
      return disconnectedForms;
    case "source":
    case "related":
      return connectedForms;
  }
}

export function studyBridgeSequence(
  variant: StudyVariant,
): StudySequence {
  const source = {
    notes: [...connectionSourceBlock],
    durations: [...connectionSourceDurations],
  };
  const destination = connectionBlock("source", 2);
  const close = connectionBlock("interval", 2);

  if (variant === "related" || variant === "source") {
    return joinConnectionBlocks([
      source,
      connectionBlock("source", 1),
      destination,
      close,
    ]);
  }

  if (variant === "exact") {
    return joinConnectionBlocks([
      source,
      {
        notes: [60, 65, 61, 67],
        durations: [...connectionSourceDurations],
      },
      destination,
      close,
    ]);
  }

  return joinConnectionBlocks([
    source,
    {
      notes: [68, 59, 66, 61],
      durations: [...connectionSourceDurations],
    },
    destination,
    close,
  ]);
}

export function studyConnectionRepairSequence(): StudySequence {
  return joinConnectionBlocks([
    {
      notes: [...connectionSourceBlock],
      durations: [...connectionSourceDurations],
    },
    connectionBlock("source", 1),
    {
      notes: [69, 58, 67, 61],
      durations: [...connectionSourceDurations],
    },
    connectionBlock("source", 2),
  ]);
}

export function studyConnectionFromOperations(
  operations: StudyTransformation[],
): StudySequence {
  const blocks: StudySequence[] = [
    {
      notes: [...connectionSourceBlock],
      durations: [...connectionSourceDurations],
    },
  ];

  operations
    .filter((operation) => operation !== "source")
    .slice(0, 3)
    .forEach((operation, index) => {
      blocks.push(connectionBlock(operation, index + 1));
    });

  while (blocks.length < 4) {
    blocks.push(connectionBlock("source", blocks.length));
  }

  return joinConnectionBlocks(blocks);
}

function baseState(sequence: StudySequence): StudyExerciseState {
  return {
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    notation: "staff",
    selectedSteps: [],
    decision: null,
    variant: "source",
    transformation: "source",
    featureDecision: null,
    operations: [],
  };
}

function defaultExerciseState(id: string): StudyExerciseState {
  if (id === SCHOENBERG_STUDY_IDS.analyse) {
    return {
      ...baseState({
        notes: [...analysePhrase],
        durations: padDurations(),
      }),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.compare) {
    return {
      ...baseState({
        notes: studyComparisonSequence("source"),
        durations: padDurations(),
      }),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.repair) {
    return {
      ...baseState({
        notes: padStudyNotes([
          60, 62, 65, 64,
          67, 61, 68, 60,
        ]),
        durations: padDurations(),
      }),
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.compose) {
    return {
      ...baseState({
        notes: padStudyNotes([]),
        durations: padDurations(),
      }),
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.analyse) {
    return {
      ...baseState(studyVariationSequence("rhythm")),
      transformation: "rhythm",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.rhythm) {
    return {
      ...baseState(studyVariationSequence("source")),
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.intervals) {
    return {
      ...baseState(studyVariationSequence("source")),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.compose) {
    return {
      ...baseState(studyVariationSequence("source")),
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_CONNECTION_IDS.compare) {
    return {
      ...baseState(studyConnectionSequence("related")),
      variant: "related",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_CONNECTION_IDS.bridge) {
    return {
      ...baseState(studyBridgeSequence("related")),
      variant: "related",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_CONNECTION_IDS.repair) {
    return {
      ...baseState(studyConnectionRepairSequence()),
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_CONNECTION_IDS.compose) {
    return {
      ...baseState(studyConnectionFromOperations([])),
      notation: "piano-roll",
    };
  }

  return baseState({
    notes: padStudyNotes([]),
    durations: padDurations(),
  });
}

const allStudyExerciseIds = [
  ...Object.values(SCHOENBERG_STUDY_IDS),
  ...Object.values(SCHOENBERG_VARIATION_IDS),
  ...Object.values(SCHOENBERG_CONNECTION_IDS),
];

export function initialCompositionStudyState(): CompositionStudyState {
  return allStudyExerciseIds.reduce<CompositionStudyState>(
    (state, id) => {
      state[id] = defaultExerciseState(id);
      return state;
    },
    {},
  );
}

export function cloneStudyExerciseState(
  state: Partial<StudyExerciseState>,
  id?: string,
): StudyExerciseState {
  const fallback = defaultExerciseState(id ?? "");
  return {
    notes: padStudyNotes(state.notes ?? fallback.notes),
    durations: padDurations(state.durations ?? fallback.durations),
    notation: state.notation ?? fallback.notation,
    selectedSteps: [...(state.selectedSteps ?? fallback.selectedSteps)],
    decision: state.decision ?? null,
    variant: state.variant ?? fallback.variant,
    transformation: state.transformation ?? fallback.transformation,
    featureDecision: state.featureDecision ?? null,
    operations: [...(state.operations ?? fallback.operations)],
  };
}

export function ensureStudyExerciseState(
  state: CompositionStudyState,
  id: string,
): StudyExerciseState {
  return state[id]
    ? cloneStudyExerciseState(state[id], id)
    : defaultExerciseState(id);
}

export function mergeCompositionStudyState(
  persisted?: Partial<CompositionStudyState>,
): CompositionStudyState {
  const defaults = initialCompositionStudyState();
  Object.keys(persisted ?? {}).forEach((id) => {
    defaults[id] = cloneStudyExerciseState(persisted?.[id] ?? {}, id);
  });
  return defaults;
}

export function resetStudyExerciseState(id: string): StudyExerciseState {
  return defaultExerciseState(id);
}

export function setStudyTransformationState(
  state: StudyExerciseState,
  transformation: StudyTransformation,
): StudyExerciseState {
  const sequence = studyVariationSequence(transformation);
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    transformation,
    featureDecision: null,
  };
}

export function setStudyOperationsState(
  state: StudyExerciseState,
  operations: StudyTransformation[],
): StudyExerciseState {
  const sequence = studyCombinedVariation(operations);
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    operations: [...operations],
  };
}

export function setStudyConnectionOperationsState(
  state: StudyExerciseState,
  operations: StudyTransformation[],
): StudyExerciseState {
  const sequence = studyConnectionFromOperations(operations);
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    operations: [...operations],
  };
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

export function studyVariationSharesIdentity(
  notes: Array<number | null>,
): boolean {
  const source = compactBlock(notes, 0, 8);
  const variant = compactBlock(notes, 8, 8);
  if (source.length < 3 || variant.length < 3) return false;

  const sourcePcs = new Set(source.map((note) => note % 12));
  const sharedPitches = variant.filter((note) => sourcePcs.has(note % 12)).length;
  if (sharedPitches >= 2) return true;

  const sourceIntervals = source
    .slice(1)
    .map((note, index) => sign(note - source[index]));
  const variantIntervals = variant
    .slice(1)
    .map((note, index) => sign(note - variant[index]));
  const sharedDirections = variantIntervals.filter(
    (direction, index) => sourceIntervals[index] === direction,
  ).length;

  return sharedDirections >= 2;
}

export function studyVariationIsChanged(
  notes: Array<number | null>,
  durations: StudyDuration[],
): boolean {
  const sourceNotes = notes.slice(0, 8);
  const variantNotes = notes.slice(8, 16);
  const sourceDurations = durations.slice(0, 8);
  const variantDurations = durations.slice(8, 16);
  return (
    sourceNotes.some((note, index) => note !== variantNotes[index]) ||
    sourceDurations.some(
      (duration, index) => duration !== variantDurations[index],
    )
  );
}

function formsShareConnection(
  source: Array<number | null>,
  variant: Array<number | null>,
): boolean {
  const sourceNotes = source.filter((note): note is number => note !== null);
  const variantNotes = variant.filter((note): note is number => note !== null);
  if (sourceNotes.length < 3 || variantNotes.length < 3) return false;

  if (sourceNotes.length === variantNotes.length) {
    const sourceIntervals = sourceNotes
      .slice(1)
      .map((note, index) => note - sourceNotes[index]);
    const variantIntervals = variantNotes
      .slice(1)
      .map((note, index) => note - variantNotes[index]);
    if (
      sourceIntervals.every(
        (interval, index) => interval === variantIntervals[index],
      )
    ) {
      return true;
    }
  }

  const sourcePcs = new Set(sourceNotes.map((note) => note % 12));
  const sharedPitchClasses = variantNotes.filter((note) =>
    sourcePcs.has(note % 12),
  ).length;
  if (sharedPitchClasses >= 2) return true;

  const sourceDirections = sourceNotes
    .slice(1)
    .map((note, index) => sign(note - sourceNotes[index]));
  const variantDirections = variantNotes
    .slice(1)
    .map((note, index) => sign(note - variantNotes[index]));
  const sharedDirections = variantDirections.filter(
    (direction, index) => sourceDirections[index] === direction,
  ).length;

  return sharedDirections >= 2;
}

export function studyConnectionRelatedFormCount(
  notes: Array<number | null>,
): number {
  const source = notes.slice(0, 4);
  return [4, 8, 12].filter((start) =>
    formsShareConnection(source, notes.slice(start, start + 4)),
  ).length;
}

export function studyConnectionChangedFormCount(
  notes: Array<number | null>,
  durations: StudyDuration[],
): number {
  const sourceNotes = notes.slice(0, 4);
  const sourceDurations = durations.slice(0, 4);
  return [4, 8, 12].filter((start) => {
    const blockNotes = notes.slice(start, start + 4);
    const blockDurations = durations.slice(start, start + 4);
    return (
      sourceNotes.some((note, index) => note !== blockNotes[index]) ||
      sourceDurations.some(
        (duration, index) => duration !== blockDurations[index],
      )
    );
  }).length;
}

export function studyConnectionSourceIntact(
  notes: Array<number | null>,
): boolean {
  return connectionSourceBlock.every((note, index) => notes[index] === note);
}
