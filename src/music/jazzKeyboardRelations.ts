export type JazzIntervalDescription = {
  semitones: number;
  name: string;
};

export type JazzKeyboardShape = {
  notes: number[];
  adjacent: JazzIntervalDescription[];
  span: JazzIntervalDescription | null;
};

const SIMPLE_INTERVALS: Record<number, string> = {
  0: "unison",
  1: "minor 2nd",
  2: "major 2nd",
  3: "minor 3rd",
  4: "major 3rd",
  5: "perfect 4th",
  6: "tritone",
  7: "perfect 5th",
  8: "minor 6th",
  9: "major 6th",
  10: "minor 7th",
  11: "major 7th",
  12: "octave",
};

const COMPOUND_INTERVALS: Record<number, string> = {
  13: "minor 9th",
  14: "major 9th",
  15: "minor 10th",
  16: "major 10th",
  17: "perfect 11th",
  18: "augmented 11th",
  19: "perfect 12th",
  20: "minor 13th",
  21: "major 13th",
  22: "minor 14th",
  23: "major 14th",
  24: "two octaves",
};

export function jazzIntervalDescription(
  semitones: number,
): JazzIntervalDescription {
  const distance = Math.max(0, Math.round(Math.abs(semitones)));
  const name =
    SIMPLE_INTERVALS[distance] ??
    COMPOUND_INTERVALS[distance] ??
    distance + " semitones";

  return { semitones: distance, name };
}

export function describeJazzKeyboardShape(notes: number[]): JazzKeyboardShape {
  const sorted = [...new Set(notes)].sort((left, right) => left - right);
  const adjacent = sorted.slice(1).map((note, index) =>
    jazzIntervalDescription(note - sorted[index]),
  );
  const span =
    sorted.length > 1
      ? jazzIntervalDescription(sorted[sorted.length - 1] - sorted[0])
      : null;

  return { notes: sorted, adjacent, span };
}
