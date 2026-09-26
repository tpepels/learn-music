export type BookSourceEvent = {
  /** One pitch, a simultaneous chord, or a rest. */
  midi: number | number[] | null;
  duration: number;
  /** Explicit onset in durationUnit units. Omit for sequential notation. */
  at?: number;
  staff?: "treble" | "bass";
  voice?: number;
  barAfter?: boolean;
  accidental?: "♭" | "♯" | "♮";
  /** Per-pitch accidentals for simultaneous chords. */
  accidentals?: Array<"♭" | "♯" | "♮" | null>;
};

export type BookAnalysisSegment = {
  label: string;
  detail: string;
  startEvent?: number;
  endEvent?: number;
};

export type BookSourceScore = {
  kind: "score";
  id: string;
  /** Internal provenance only. Never use this as a learner-facing heading. */
  reference: string;
  title: string;
  attribution: string;
  fidelity: "full-melodic-line" | "verified-excerpt";
  fidelityNote: string;
  clef: "treble" | "bass";
  keyLabel: string;
  /** Negative = flats, positive = sharps, 0/undefined = no rendered signature. */
  keySignature?: number;
  meter?: string;
  bpm: number;
  durationUnit?: "eighth" | "sixteenth";
  events: BookSourceEvent[];
  /** Explicit barline positions in durationUnit units for polyphonic excerpts. */
  barlines?: number[];
  slurs?: Array<{ start: number; end: number }>;
  annotation?: string;
  analysis?: BookAnalysisSegment[];
};

export type BookSourceMap = {
  kind: "map";
  id: string;
  /** Internal provenance only. Never use this as a learner-facing heading. */
  reference: string;
  title: string;
  fidelity: "source-analysis";
  fidelityNote: string;
  segments: BookAnalysisSegment[];
};

export type BookSourceMaterial = BookSourceScore | BookSourceMap;
