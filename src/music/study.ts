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
  | "displacement"
  | "inversion"
  | "retrograde"
  | "diminution"
  | "augmentation"
  | "repetition"
  | "upbeat"
  | "metre"
  | "transposition";
export type StudyHarmony = "I" | "V" | null;
export type StudySentenceMode =
  | "immediate"
  | "delayed"
  | "contrast"
  | "exact"
  | "transposed"
  | "tonic-repeat"
  | "complementary";
export type StudyCompletionMode =
  | "repeat-presentation"
  | "developed-continuation"
  | "foreign-continuation"
  | "static-fragment"
  | "sequence"
  | "unliquidated"
  | "liquidation"
  | "abrupt"
  | "complete";

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
  sentenceMode: StudySentenceMode;
  completionMode: StudyCompletionMode;
  harmony: StudyHarmony[];
};

export type CompositionStudyState = Record<string, StudyExerciseState>;

export const SCHOENBERG_STUDY_IDS = {
  analyse: "schoenberg.phrase-motive.a",
  compare: "schoenberg.phrase-motive.b",
  repair: "schoenberg.phrase-motive.c",
  compose: "schoenberg.phrase-motive.d",
  noteValues: "schoenberg.phrase-motive.e",
  upbeats: "schoenberg.phrase-motive.f",
  passingNotes: "schoenberg.phrase-motive.g",
  repetitions: "schoenberg.phrase-motive.h",
  embellishment: "schoenberg.phrase-motive.i",
  build: "schoenberg.phrase-motive.j",
} as const;

export const SCHOENBERG_PHRASE_SOURCE_IDS = new Set<string>([
  SCHOENBERG_STUDY_IDS.noteValues,
  SCHOENBERG_STUDY_IDS.upbeats,
  SCHOENBERG_STUDY_IDS.passingNotes,
  SCHOENBERG_STUDY_IDS.repetitions,
  SCHOENBERG_STUDY_IDS.embellishment,
]);

export const SCHOENBERG_VARIATION_IDS = {
  motive: "schoenberg.developing-variation.a",
  exact: "schoenberg.developing-variation.b",
  literature: "schoenberg.developing-variation.c",
  rhythm: "schoenberg.developing-variation.d",
  intervals: "schoenberg.developing-variation.e",
  metric: "schoenberg.developing-variation.f",
  harmony: "schoenberg.developing-variation.g",
  substitution: "schoenberg.developing-variation.h",
  adaptation: "schoenberg.developing-variation.i",
  compose: "schoenberg.developing-variation.j",
} as const;

export const SCHOENBERG_VARIATION_EXERCISE_IDS = new Set<string>(
  Object.values(SCHOENBERG_VARIATION_IDS),
);

export const SCHOENBERG_VARIATION_SOURCE_IDS = new Set<string>([
  SCHOENBERG_VARIATION_IDS.motive,
  SCHOENBERG_VARIATION_IDS.literature,
  SCHOENBERG_VARIATION_IDS.harmony,
  SCHOENBERG_VARIATION_IDS.substitution,
  SCHOENBERG_VARIATION_IDS.adaptation,
]);

export const SCHOENBERG_VARIATION_TRANSFORM_IDS = new Set<string>([
  SCHOENBERG_VARIATION_IDS.exact,
  SCHOENBERG_VARIATION_IDS.rhythm,
  SCHOENBERG_VARIATION_IDS.intervals,
  SCHOENBERG_VARIATION_IDS.metric,
  SCHOENBERG_VARIATION_IDS.compose,
]);

export const SCHOENBERG_CONNECTION_IDS = {
  compare: "schoenberg.connecting-motive-forms.a",
  bridge: "schoenberg.connecting-motive-forms.b",
  repair: "schoenberg.connecting-motive-forms.c",
  compose: "schoenberg.connecting-motive-forms.d",
} as const;

export const SCHOENBERG_CONNECTION_EXERCISE_IDS = new Set<string>(
  Object.values(SCHOENBERG_CONNECTION_IDS),
);

export const SCHOENBERG_SENTENCE_IDS = {
  recognise: "schoenberg.beginning-sentence.a",
  repetition: "schoenberg.beginning-sentence.b",
  harmony: "schoenberg.beginning-sentence.c",
  compose: "schoenberg.beginning-sentence.d",
} as const;

export const SCHOENBERG_SENTENCE_EXERCISE_IDS = new Set<string>(
  Object.values(SCHOENBERG_SENTENCE_IDS),
);

export const SCHOENBERG_COMPLETION_IDS = {
  function: "schoenberg.completing-sentence.a",
  sequence: "schoenberg.completing-sentence.b",
  liquidation: "schoenberg.completing-sentence.c",
  compose: "schoenberg.completing-sentence.d",
} as const;

export const SCHOENBERG_COMPLETION_EXERCISE_IDS = new Set<string>(
  Object.values(SCHOENBERG_COMPLETION_IDS),
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
  inversion: "intervals",
  retrograde: "intervals",
  diminution: "rhythm",
  augmentation: "rhythm",
  repetition: "rhythm",
  upbeat: "position",
  metre: "rhythm",
  transposition: "intervals",
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

function padStudyNotes(
  notes: Array<number | null>,
  length = STUDY_STEPS,
): Array<number | null> {
  return Array.from({ length }, (_, index) => notes[index] ?? null);
}

function padDurations(
  durations: number[] = [],
  fallback: StudyDuration = 1,
  length = STUDY_STEPS,
): StudyDuration[] {
  return Array.from({ length }, (_, index) => {
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


const variationChapterReductions: Record<
  "motive" | "literature" | "harmony" | "substitution" | "adaptation",
  StudySequence
> = {
  motive: {
    // Ex. 12b: reduction of the note-repetition principle in Beethoven 5-I.
    // This is deliberately not a transcription of the printed engraving.
    notes: padStudyNotes([
      67, 67, 67, 63,
      null, null, null, null,
      65, 65, 65, 62,
    ]),
    durations: padDurations([
      1, 1, 1, 3,
      1, 1, 1, 1,
      1, 1, 1, 3,
    ]),
  },
  literature: {
    // Exs. 15-16: reduction of motive-forms that preserve identity while
    // transposition, direction, embellishment, rhythm and sequence change.
    notes: padStudyNotes([
      60, 64, 67, 64,
      62, 66, 69, 67,
      64, 67, 71, 69,
      65, 69, 72, 70,
    ]),
    durations: padDurations([
      1, 1, 2, 1,
      1, 1, 2, 1,
      1, 2, 1, 1,
      1, 1, 2, 1,
    ]),
  },
  harmony: {
    // Ex. 25: melody adapted as the harmonic support becomes richer.
    notes: padStudyNotes([
      60, 64, 67, 65,
      59, 62, 67, 65,
      60, 63, 67, 66,
      62, 65, 69, 67,
    ]),
    durations: padDurations(),
    harmony: [
      "I", null, null, null,
      "V", null, null, null,
      "I", null, null, null,
      "V", null, null, null,
    ],
  },
  substitution: {
    // Exs. 26-27: the motive is retained while harmonic insertion or
    // substitution changes the route beneath it.
    notes: padStudyNotes([
      60, 64, 67, 65,
      62, 65, 69, 67,
      59, 62, 67, 64,
      60, 64, 69, 67,
    ]),
    durations: padDurations(),
    harmony: [
      "I", null, null, null,
      "V", null, null, null,
      "I", null, null, null,
      "V", null, null, null,
    ],
  },
  adaptation: {
    // Exs. 28-29: transposition/sequence plus melodic adaptation to
    // passing harmony. The book's contrapuntal accompaniment is represented
    // here by simplified harmonic support rather than copied engraving.
    notes: padStudyNotes([
      60, 64, 67, 64,
      62, 66, 69, 66,
      64, 68, 71, 68,
      65, 69, 72, 69,
    ]),
    durations: padDurations(),
    harmony: [
      "I", null, null, null,
      "V", null, null, null,
      "I", null, null, null,
      "V", null, null, null,
    ],
  },
};

export function studyVariationBookSequence(
  kind: keyof typeof variationChapterReductions,
): StudySequence {
  const sequence = variationChapterReductions[kind];
  return {
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    harmony: sequence.harmony ? [...sequence.harmony] : undefined,
  };
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
  harmony?: StudyHarmony[];
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
    case "inversion":
      return combineHalves(
        [60, null, 56, null, 53, null, 55, null],
        [...variationSourceDurations],
      );
    case "retrograde":
      return combineHalves(
        [65, null, 67, null, 64, null, 60, null],
        [...variationSourceDurations],
      );
    case "diminution":
      return combineHalves(
        [60, 64, 67, 65, null, null, null, null],
        [1, 1, 1, 1, 1, 1, 1, 1],
      );
    case "augmentation":
      return combineHalves(
        [60, null, null, 64, null, null, 67, null],
        [4, 1, 1, 4, 1, 1, 2, 1],
      );
    case "repetition":
      return combineHalves(
        [60, 60, 64, 64, 67, 67, 65, 65],
        [1, 1, 1, 1, 1, 1, 1, 1],
      );
    case "upbeat":
      return combineHalves(
        [null, 60, null, 64, 67, null, 65, null],
        [1, 1, 1, 2, 1, 1, 2, 1],
      );
    case "metre":
      return combineHalves(
        [60, 64, 67, 60, 64, 67, 65, null],
        [1, 1, 2, 1, 1, 2, 2, 1],
      );
    case "transposition":
      return combineHalves(
        [62, null, 66, null, 69, null, 67, null],
        [...variationSourceDurations],
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
    case "inversion": {
      const anchor = second.find((note): note is number => note !== null) ?? 60;
      return {
        notes: second.map((note) =>
          note === null ? null : anchor - (note - anchor),
        ),
        durations,
      };
    }
    case "retrograde":
      return {
        notes: [...second].reverse(),
        durations: [...durations].reverse(),
      };
    case "diminution": {
      const pitches = second.filter((note): note is number => note !== null);
      return {
        notes: Array.from({ length: 8 }, (_, index) => pitches[index] ?? null),
        durations: Array<StudyDuration>(8).fill(1),
      };
    }
    case "augmentation": {
      const pitches = second.filter((note): note is number => note !== null);
      const notes: Array<number | null> = Array(8).fill(null);
      [0, 3, 6].forEach((step, index) => {
        if (pitches[index] !== undefined) notes[step] = pitches[index];
      });
      const nextDurations = Array<StudyDuration>(8).fill(1);
      nextDurations[0] = 3;
      nextDurations[3] = 3;
      nextDurations[6] = 2;
      return { notes, durations: nextDurations };
    }
    case "repetition": {
      const pitches = second.filter((note): note is number => note !== null);
      const repeated = pitches.flatMap((note) => [note, note]).slice(0, 8);
      return {
        notes: Array.from({ length: 8 }, (_, index) => repeated[index] ?? null),
        durations: Array<StudyDuration>(8).fill(1),
      };
    }
    case "upbeat":
      return {
        notes: [null, ...second.slice(0, -1)],
        durations: [1, ...durations.slice(0, -1)] as StudyDuration[],
      };
    case "metre":
      return {
        notes: second,
        durations: [1, 1, 2, 1, 1, 2, 2, 1],
      };
    case "transposition":
      return {
        notes: second.map((note) => (note === null ? null : note + 2)),
        durations,
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
        notes: [60, 61, 62, 65],
        durations: [...connectionSourceDurations],
      };
    case "reduction":
      return {
        notes: [60, null, 65, 64],
        durations: [...connectionSourceDurations],
      };
    case "displacement":
    case "upbeat":
      return {
        notes: [null, 60, 62, 65],
        durations: [...connectionSourceDurations],
      };
    case "inversion":
      return {
        notes: [60, 58, 55, 56],
        durations: [...connectionSourceDurations],
      };
    case "retrograde":
      return {
        notes: [...connectionSourceBlock].reverse(),
        durations: [...connectionSourceDurations],
      };
    case "diminution":
    case "augmentation":
    case "repetition":
    case "metre":
      return {
        notes: [...connectionSourceBlock],
        durations:
          operation === "augmentation"
            ? [2, 2, 2, 2]
            : operation === "diminution"
              ? [1, 1, 1, 1]
              : [...connectionSourceDurations],
      };
    case "transposition":
      return {
        notes: connectionSourceBlock.map((note) =>
          note === null ? null : note + transpose,
        ),
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


const sentenceBasicIdea: Array<number | null> = [
  60, 62, 64, 67, 65, 64, 62, 60,
];
const sentenceBasicDurations: StudyDuration[] = [
  1, 1, 1, 1, 1, 1, 1, 1,
];

function padStudyHarmony(
  harmony: StudyHarmony[] = [],
  length = STUDY_STEPS,
): StudyHarmony[] {
  return Array.from(
    { length },
    (_, index) => harmony[index] ?? null,
  );
}

function transposeStudyNotes(
  notes: Array<number | null>,
  semitones: number,
): Array<number | null> {
  return notes.map((note) => (note === null ? null : note + semitones));
}

function adaptStudyNotesToDominant(
  notes: Array<number | null>,
): Array<number | null> {
  const shifts: Record<number, number> = {
    0: -1,
    2: 0,
    4: -2,
    5: 1,
    7: 0,
    9: -2,
    11: 0,
  };

  return notes.map((note) => {
    if (note === null) return null;
    return note + (shifts[note % 12] ?? 0);
  });
}

function sentenceHarmony(
  first: StudyHarmony,
  second: StudyHarmony,
): StudyHarmony[] {
  const harmony = Array<StudyHarmony>(STUDY_STEPS).fill(null);
  harmony[0] = first;
  harmony[8] = second;
  return harmony;
}

export function studySentenceSequence(
  mode: StudySentenceMode,
  sourceNotes: Array<number | null> = sentenceBasicIdea,
  sourceDurations: StudyDuration[] = sentenceBasicDurations,
): StudySequence {
  const source = Array.from(
    { length: 8 },
    (_, index) => sourceNotes[index] ?? null,
  );
  const durations = Array.from(
    { length: 8 },
    (_, index) => sourceDurations[index] ?? 1,
  ) as StudyDuration[];

  const exact = [...source];
  const transposed = transposeStudyNotes(source, 2);
  const contrast: Array<number | null> = [
    67, 60, 66, 61, 68, 62, 69, 63,
  ];
  const delayed: Array<number | null> = [
    67, 65, 64, 62,
    ...source.slice(0, 4),
  ];

  switch (mode) {
    case "immediate":
    case "exact":
      return {
        notes: [...source, ...exact],
        durations: [...durations, ...durations],
        harmony: sentenceHarmony(null, null),
      };
    case "transposed":
      return {
        notes: [...source, ...transposed],
        durations: [...durations, ...durations],
        harmony: sentenceHarmony(null, null),
      };
    case "delayed":
      return {
        notes: [...source, ...delayed],
        durations: [...durations, ...durations],
        harmony: sentenceHarmony(null, null),
      };
    case "contrast":
      return {
        notes: [...source, ...contrast],
        durations: [...durations, ...durations],
        harmony: sentenceHarmony(null, null),
      };
    case "tonic-repeat":
      return {
        notes: [...source, ...exact],
        durations: [...durations, ...durations],
        harmony: sentenceHarmony("I", "I"),
      };
    case "complementary":
      return {
        notes: [...source, ...adaptStudyNotesToDominant(source)],
        durations: [...durations, ...durations],
        harmony: sentenceHarmony("I", "V"),
      };
  }
}

export function setStudySentenceModeState(
  state: StudyExerciseState,
  sentenceMode: StudySentenceMode,
): StudyExerciseState {
  const sequence = studySentenceSequence(
    sentenceMode,
    state.notes.slice(0, 8),
    state.durations.slice(0, 8),
  );
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    harmony: padStudyHarmony(sequence.harmony, sequence.notes.length),
    sentenceMode,
  };
}

export function setStudySentenceSourceStepState(
  state: StudyExerciseState,
  step: number,
  midi: number | null,
): StudyExerciseState {
  const notes = [...state.notes];
  if (step < 0 || step >= notes.length) return state;
  notes[step] = midi;

  if (step >= 8) {
    return { ...state, notes };
  }

  const sequence = studySentenceSequence(
    state.sentenceMode,
    notes.slice(0, 8),
    state.durations.slice(0, 8),
  );
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    harmony: padStudyHarmony(sequence.harmony, sequence.notes.length),
  };
}


const completionLength = 32;

function sentencePresentation(
  sourceNotes: Array<number | null> = sentenceBasicIdea,
  sourceDurations: StudyDuration[] = sentenceBasicDurations,
): StudySequence {
  return studySentenceSequence("complementary", sourceNotes, sourceDurations);
}

function continuationHarmony(
  mode: StudyCompletionMode,
): StudyHarmony[] {
  const harmony = Array<StudyHarmony>(completionLength).fill(null);
  harmony[0] = "I";
  harmony[8] = "V";

  if (mode === "repeat-presentation") {
    harmony[16] = "I";
    harmony[24] = "V";
    return harmony;
  }

  if (mode !== "foreign-continuation") {
    harmony[16] = "I";
  }

  if (
    mode === "developed-continuation" ||
    mode === "liquidation" ||
    mode === "abrupt" ||
    mode === "complete"
  ) {
    harmony[28] = "V";
    harmony[30] = "I";
  }

  return harmony;
}

function studyContinuationMaterial(
  mode: StudyCompletionMode,
  sourceNotes: Array<number | null>,
): Array<number | null> {
  const motive = Array.from(
    { length: 4 },
    (_, index) => sourceNotes[index] ?? sentenceBasicIdea[index],
  );
  const seq1 = transposeStudyNotes(motive, 2);
  const seq2 = transposeStudyNotes(motive, 4);
  const seq3 = transposeStudyNotes(motive, 5);
  const cadence: Array<number | null> = [62, 59, 60, null];

  switch (mode) {
    case "repeat-presentation":
      return [
        ...sourceNotes.slice(0, 8),
        ...adaptStudyNotesToDominant(sourceNotes.slice(0, 8)),
      ];
    case "foreign-continuation":
      return [68, 59, 66, 61, 70, 60, 67, 62, 69, 58, 65, 61, 63, 70, 59, 66];
    case "static-fragment":
      return [...motive, ...motive, ...motive, ...motive];
    case "sequence":
      return [...motive, ...seq1, ...seq2, ...seq3];
    case "unliquidated":
      return [...seq1, ...seq2, ...seq3, ...motive];
    case "abrupt":
      return [...seq1, ...seq2, 67, 60, 68, 61, ...cadence];
    case "liquidation":
    case "complete":
    case "developed-continuation":
      return [
        ...seq1,
        ...seq2,
        motive[2], null,
        motive[1], null,
        ...cadence,
      ];
  }
}

export function studyCompletionSequence(
  mode: StudyCompletionMode,
  sourceNotes: Array<number | null> = sentenceBasicIdea,
  sourceDurations: StudyDuration[] = sentenceBasicDurations,
): StudySequence {
  const presentation = sentencePresentation(sourceNotes, sourceDurations);
  const continuation = studyContinuationMaterial(mode, sourceNotes);
  const continuationDurations = Array<StudyDuration>(16).fill(1);

  return {
    notes: [...presentation.notes, ...continuation],
    durations: [...presentation.durations, ...continuationDurations],
    harmony: continuationHarmony(mode),
  };
}

export function setStudyCompletionModeState(
  state: StudyExerciseState,
  completionMode: StudyCompletionMode,
): StudyExerciseState {
  const sequence = studyCompletionSequence(
    completionMode,
    state.notes.slice(0, 8),
    state.durations.slice(0, 8),
  );
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    harmony: padStudyHarmony(sequence.harmony, sequence.notes.length),
    completionMode,
  };
}

export function setStudyCompletionSourceStepState(
  state: StudyExerciseState,
  step: number,
  midi: number | null,
): StudyExerciseState {
  const notes = [...state.notes];
  if (step < 0 || step >= notes.length) return state;
  notes[step] = midi;

  if (step >= 8) {
    return { ...state, notes };
  }

  const sequence = studyCompletionSequence(
    state.completionMode,
    notes.slice(0, 8),
    state.durations.slice(0, 8),
  );
  return {
    ...state,
    notes: [...sequence.notes],
    durations: [...sequence.durations],
    harmony: padStudyHarmony(sequence.harmony, sequence.notes.length),
  };
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
    sentenceMode: "exact",
    completionMode: "complete",
    harmony: padStudyHarmony(sequence.harmony, sequence.notes.length),
  };
}


const phraseChapterReductions: Record<
  "noteValues" | "upbeats" | "passingNotes" | "repetitions" | "embellishment",
  StudySequence
> = {
  noteValues: {
    // Interactive reduction of the Ex. 6 principle, transposed from F to C.
    notes: [
      60, 64, 67, 72,
      67, 64, 60, 64,
      67, 64, 60, 67,
      72, 67, 64, 60,
    ],
    durations: [
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
    ],
  },
  upbeats: {
    // Reduction of Ex. 7's upbeats and mixed note values.
    notes: [
      null, 60, 64, 67,
      64, 60, null, 67,
      64, 72, 67, 64,
      60, null, 64, 67,
    ],
    durations: [
      1, 1, 2, 1,
      2, 1, 1, 1,
      1, 2, 1, 1,
      2, 1, 1, 2,
    ],
  },
  passingNotes: {
    // Reduction of Ex. 8: passing notes animate a chord-tone framework.
    notes: [
      60, 62, 64, 65,
      67, 69, 67, 65,
      64, 62, 60, 62,
      64, 65, 64, 60,
    ],
    durations: padDurations(),
  },
  repetitions: {
    // Reduction of Ex. 9: passing tones plus local note repetition.
    notes: [
      60, 60, 62, 64,
      64, 65, 67, 67,
      65, 64, 64, 62,
      60, 62, 62, 60,
    ],
    durations: padDurations(),
  },
  embellishment: {
    // Reduction of Exs. 10-11: denser changing/auxiliary notes.
    notes: [
      60, 61, 64, 63,
      64, 66, 67, 69,
      68, 67, 65, 64,
      62, 61, 60, null,
    ],
    durations: padDurations(),
  },
};

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

  if (id === SCHOENBERG_STUDY_IDS.noteValues) {
    return {
      ...baseState(phraseChapterReductions.noteValues),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.upbeats) {
    return {
      ...baseState(phraseChapterReductions.upbeats),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.passingNotes) {
    return {
      ...baseState(phraseChapterReductions.passingNotes),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.repetitions) {
    return {
      ...baseState(phraseChapterReductions.repetitions),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.embellishment) {
    return {
      ...baseState(phraseChapterReductions.embellishment),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_STUDY_IDS.build) {
    return {
      ...baseState({
        notes: padStudyNotes([]),
        durations: padDurations(),
      }),
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.motive) {
    return {
      ...baseState(studyVariationBookSequence("motive")),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.exact) {
    return {
      ...baseState(studyVariationSequence("inversion")),
      transformation: "inversion",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.literature) {
    return {
      ...baseState(studyVariationBookSequence("literature")),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.rhythm) {
    return {
      ...baseState(studyVariationSequence("rhythm")),
      transformation: "rhythm",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.intervals) {
    return {
      ...baseState(studyVariationSequence("auxiliary")),
      transformation: "auxiliary",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.metric) {
    return {
      ...baseState(studyVariationSequence("upbeat")),
      transformation: "upbeat",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.harmony) {
    return {
      ...baseState(studyVariationBookSequence("harmony")),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.substitution) {
    return {
      ...baseState(studyVariationBookSequence("substitution")),
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_VARIATION_IDS.adaptation) {
    return {
      ...baseState(studyVariationBookSequence("adaptation")),
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

  if (id === SCHOENBERG_SENTENCE_IDS.recognise) {
    return {
      ...baseState(studySentenceSequence("immediate")),
      sentenceMode: "immediate",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_SENTENCE_IDS.repetition) {
    return {
      ...baseState(studySentenceSequence("exact")),
      sentenceMode: "exact",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_SENTENCE_IDS.harmony) {
    return {
      ...baseState(studySentenceSequence("tonic-repeat")),
      sentenceMode: "tonic-repeat",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_SENTENCE_IDS.compose) {
    return {
      ...baseState(studySentenceSequence("exact")),
      sentenceMode: "exact",
      notation: "piano-roll",
    };
  }

  if (id === SCHOENBERG_COMPLETION_IDS.function) {
    return {
      ...baseState(studyCompletionSequence("developed-continuation")),
      completionMode: "developed-continuation",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_COMPLETION_IDS.sequence) {
    return {
      ...baseState(studyCompletionSequence("sequence")),
      completionMode: "sequence",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_COMPLETION_IDS.liquidation) {
    return {
      ...baseState(studyCompletionSequence("liquidation")),
      completionMode: "liquidation",
      notation: "staff",
    };
  }

  if (id === SCHOENBERG_COMPLETION_IDS.compose) {
    return {
      ...baseState(studyCompletionSequence("complete")),
      completionMode: "complete",
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
  ...Object.values(SCHOENBERG_SENTENCE_IDS),
  ...Object.values(SCHOENBERG_COMPLETION_IDS),
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
  const length = Math.max(
    STUDY_STEPS,
    fallback.notes.length,
    state.notes?.length ?? 0,
  );
  return {
    notes: padStudyNotes(state.notes ?? fallback.notes, length),
    durations: padDurations(
      state.durations ?? fallback.durations,
      1,
      length,
    ),
    notation: state.notation ?? fallback.notation,
    selectedSteps: [...(state.selectedSteps ?? fallback.selectedSteps)],
    decision: state.decision ?? null,
    variant: state.variant ?? fallback.variant,
    transformation: state.transformation ?? fallback.transformation,
    featureDecision: state.featureDecision ?? null,
    operations: [...(state.operations ?? fallback.operations)],
    sentenceMode: state.sentenceMode ?? fallback.sentenceMode,
    completionMode: state.completionMode ?? fallback.completionMode,
    harmony: padStudyHarmony(
      state.harmony ?? fallback.harmony,
      length,
    ),
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
  length = 4,
): boolean {
  const left = compactBlock(notes, leftStart, length);
  const right = compactBlock(notes, rightStart, length);

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


export function studySentenceHalvesRelated(
  notes: Array<number | null>,
): boolean {
  const left = notes
    .slice(0, 8)
    .filter((note): note is number => note !== null);
  const right = notes
    .slice(8, 16)
    .filter((note): note is number => note !== null);

  if (left.length < 4 || right.length < 4 || left.length !== right.length) {
    return false;
  }

  const leftIntervals = left.slice(1).map((note, index) => note - left[index]);
  const rightIntervals = right.slice(1).map((note, index) => note - right[index]);
  const exactShape = leftIntervals.every(
    (interval, index) => interval === rightIntervals[index],
  );
  if (exactShape) return true;

  const leftDirections = leftIntervals.map(sign);
  const rightDirections = rightIntervals.map(sign);
  const matchingDirections = rightDirections.filter(
    (direction, index) => direction === leftDirections[index],
  ).length;

  const leftPitchClasses = new Set(left.map((note) => note % 12));
  const sharedPitchClasses = right.filter((note) =>
    leftPitchClasses.has(note % 12),
  ).length;

  return matchingDirections >= 5 || sharedPitchClasses >= 4;
}

export function studySentenceHasImmediateRepetition(
  notes: Array<number | null>,
): boolean {
  const left = notes
    .slice(0, 8)
    .filter((note): note is number => note !== null);
  const right = notes
    .slice(8, 16)
    .filter((note): note is number => note !== null);
  if (left.length < 4 || right.length < 4 || left.length !== right.length) {
    return false;
  }

  const leftIntervals = left.slice(1).map((note, index) => note - left[index]);
  const rightIntervals = right.slice(1).map((note, index) => note - right[index]);
  return leftIntervals.every(
    (interval, index) => interval === rightIntervals[index],
  );
}

export function studySentenceHarmonyIsComplementary(
  harmony: StudyHarmony[],
): boolean {
  return harmony[0] === "I" && harmony[8] === "V";
}


export function studyCompletionHasDevelopment(
  notes: Array<number | null>,
): boolean {
  if (notes.length < completionLength) return false;
  const presentation = notes.slice(0, 16);
  const continuation = notes.slice(16, 32);
  const same = presentation.every(
    (note, index) => note === continuation[index],
  );
  if (same) return false;

  const source = notes
    .slice(0, 4)
    .filter((note): note is number => note !== null);
  const continuationNotes = continuation.filter(
    (note): note is number => note !== null,
  );
  const sourcePitchClasses = new Set(source.map((note) => note % 12));
  return continuationNotes.filter((note) =>
    sourcePitchClasses.has(note % 12),
  ).length >= 4;
}

export function studyCompletionHasSequence(
  notes: Array<number | null>,
): boolean {
  if (notes.length < completionLength) return false;
  const blocks = [16, 20, 24].map((start) =>
    notes
      .slice(start, start + 4)
      .filter((note): note is number => note !== null),
  );
  if (blocks.some((block) => block.length < 4)) return false;

  const shapes = blocks.map((block) =>
    block.slice(1).map((note, index) => note - block[index]),
  );
  const sameIntervalPattern = shapes.slice(1).every((shape) =>
    shape.every((interval, index) => interval === shapes[0][index]),
  );
  const changesPitchLevel = blocks
    .slice(1)
    .some((block) => block[0] !== blocks[0][0]);
  return sameIntervalPattern && changesPitchLevel;
}

export function studyCompletionHasLiquidation(
  notes: Array<number | null>,
): boolean {
  if (notes.length < completionLength) return false;
  const early = notes.slice(16, 24).filter((note) => note !== null).length;
  const late = notes.slice(24, 28).filter((note) => note !== null).length;
  return early >= 7 && late === 2;
}

export function studyCompletionHasCadence(
  notes: Array<number | null>,
  harmony: StudyHarmony[],
): boolean {
  if (notes.length < completionLength) return false;
  const finalActive = [...notes.slice(28, 32)]
    .reverse()
    .find((note): note is number => note !== null);
  return (
    finalActive !== undefined &&
    finalActive % 12 === 0 &&
    harmony[28] === "V" &&
    harmony[30] === "I"
  );
}

export function studyCompletionSourceIntact(
  notes: Array<number | null>,
): boolean {
  return notes.slice(0, 8).filter((note) => note !== null).length >= 5;
}
