export type ScoreStaff = "treble" | "bass";

export type SourceScoreEvent = {
  id: string;
  start: number;
  duration: number;
  pitches: string[];
  staff?: ScoreStaff;
  voice?: number;
};

export type SourceScoreSegment = {
  id: string;
  label: string;
  description: string;
  start: number;
  end: number;
  staff?: ScoreStaff;
};

export type SourceScoreScope =
  | "full excerpt"
  | "melodic transcription"
  | "analytical extraction"
  | "schematic example";

export type SourceScoreExample = {
  id: string;
  lessonId: string;
  example: string;
  title: string;
  work?: string;
  printedPage: number;
  scanPage: number;
  scope: SourceScoreScope;
  scopeNote?: string;
  key?: string;
  meter?: string;
  tempo?: string;
  bpm: number;
  totalUnits: number;
  events: SourceScoreEvent[];
  segments?: SourceScoreSegment[];
};

export function sourceEvent(
  id: string,
  start: number,
  duration: number,
  pitch: string | string[] | null,
  staff: ScoreStaff = "treble",
  voice = 0,
): SourceScoreEvent {
  return {
    id,
    start,
    duration,
    pitches: pitch === null ? [] : Array.isArray(pitch) ? pitch : [pitch],
    staff,
    voice,
  };
}

export function sequenceEvents(
  prefix: string,
  notes: Array<{
    start: number;
    duration: number;
    pitch: string | string[] | null;
    staff?: ScoreStaff;
    voice?: number;
  }>,
): SourceScoreEvent[] {
  return notes.map((note, index) =>
    sourceEvent(
      `${prefix}-${index}`,
      note.start,
      note.duration,
      note.pitch,
      note.staff ?? "treble",
      note.voice ?? 0,
    ),
  );
}
