export const pitchClasses = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export type PitchClass = (typeof pitchClasses)[number];

export const tonalModes = ["major", "natural-minor", "harmonic-minor"] as const;
export type TonalMode = (typeof tonalModes)[number];

export type TonalContext = {
  tonic: PitchClass;
  mode: TonalMode;
};

export const initialTonalContext: TonalContext = {
  tonic: 0,
  mode: "major",
};

export const harmonicDegrees = [1, 2, 3, 4, 5, 6, 7] as const;
export type HarmonicDegree = (typeof harmonicDegrees)[number];

export const chordQualities = ["major", "minor", "diminished", "augmented"] as const;
export type ChordQuality = (typeof chordQualities)[number];

export const seventhQualities = ["minor", "major", "diminished"] as const;
export type SeventhQuality = (typeof seventhQualities)[number] | null;

export const harmonicRoles = ["diatonic", "borrowed", "secondary-dominant"] as const;
export type HarmonicRole = (typeof harmonicRoles)[number];

export type HarmonicChord = {
  degree: HarmonicDegree;
  rootAlteration: -2 | -1 | 0 | 1 | 2;
  quality: ChordQuality;
  seventh: SeventhQuality;
  role: HarmonicRole;
  targetDegree?: HarmonicDegree;
};

export type HarmonicProgression = Array<HarmonicChord | null>;

export const initialHarmonicProgression: HarmonicProgression = [
  null,
  null,
  null,
  null,
];

export const scaleSemitones: Record<TonalMode, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  "natural-minor": [0, 2, 3, 5, 7, 8, 10],
  "harmonic-minor": [0, 2, 3, 5, 7, 8, 11],
};

const TRIAD_QUALITIES: Record<TonalMode, readonly ChordQuality[]> = {
  major: ["major", "minor", "minor", "major", "major", "minor", "diminished"],
  "natural-minor": ["minor", "diminished", "major", "minor", "minor", "major", "major"],
  "harmonic-minor": ["minor", "diminished", "augmented", "minor", "major", "major", "diminished"],
};

const SEVENTH_QUALITIES: Record<TonalMode, readonly SeventhQuality[]> = {
  major: ["major", "minor", "minor", "major", "minor", "minor", "minor"],
  "natural-minor": ["minor", "minor", "major", "minor", "minor", "major", "minor"],
  "harmonic-minor": ["major", "minor", "major", "minor", "minor", "major", "diminished"],
};

const NATURAL_PITCH_CLASSES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const DEFAULT_TONIC_NAMES = [
  "C",
  "D♭",
  "D",
  "E♭",
  "E",
  "F",
  "F♯",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
] as const;

const ROMAN_UPPER = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;
const ROMAN_LOWER = ["i", "ii", "iii", "iv", "v", "vi", "vii"] as const;

export function normalizePitchClass(value: number): PitchClass {
  return (((Math.round(value) % 12) + 12) % 12) as PitchClass;
}

export function cloneTonalContext(context: TonalContext): TonalContext {
  return { tonic: context.tonic, mode: context.mode };
}

export function cloneHarmonicChord(chord: HarmonicChord): HarmonicChord {
  return { ...chord };
}

export function cloneHarmonicProgression(
  progression: HarmonicProgression,
): HarmonicProgression {
  return progression.map((chord) => (chord ? cloneHarmonicChord(chord) : null));
}

export function isTonalContext(value: unknown): value is TonalContext {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.tonic === "number" &&
    pitchClasses.includes(normalizePitchClass(record.tonic)) &&
    typeof record.mode === "string" &&
    tonalModes.includes(record.mode as TonalMode)
  );
}

export function isHarmonicChord(value: unknown): value is HarmonicChord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    harmonicDegrees.includes(record.degree as HarmonicDegree) &&
    [-2, -1, 0, 1, 2].includes(record.rootAlteration as number) &&
    chordQualities.includes(record.quality as ChordQuality) &&
    (record.seventh === null ||
      seventhQualities.includes(record.seventh as Exclude<SeventhQuality, null>)) &&
    harmonicRoles.includes(record.role as HarmonicRole) &&
    (record.targetDegree === undefined ||
      harmonicDegrees.includes(record.targetDegree as HarmonicDegree))
  );
}

export function sanitizeTonalContext(
  value: unknown,
  fallback: TonalContext = initialTonalContext,
): TonalContext {
  if (!value || typeof value !== "object") return cloneTonalContext(fallback);
  const record = value as Record<string, unknown>;
  const tonic =
    typeof record.tonic === "number"
      ? normalizePitchClass(record.tonic)
      : fallback.tonic;
  const mode =
    typeof record.mode === "string" &&
    tonalModes.includes(record.mode as TonalMode)
      ? (record.mode as TonalMode)
      : fallback.mode;
  return { tonic, mode };
}

export function sanitizeHarmonicProgression(
  value: unknown,
  fallback: HarmonicProgression = initialHarmonicProgression,
): HarmonicProgression {
  if (!Array.isArray(value)) return cloneHarmonicProgression(fallback);
  return fallback.map((fallbackChord, index) => {
    const chord = value[index];
    if (chord === null) return null;
    if (!isHarmonicChord(chord)) {
      return fallbackChord ? cloneHarmonicChord(fallbackChord) : null;
    }
    return cloneHarmonicChord(chord);
  });
}

export function scaleDegreePitchClass(
  context: TonalContext,
  degree: HarmonicDegree,
): PitchClass {
  return normalizePitchClass(
    context.tonic + scaleSemitones[context.mode][degree - 1],
  );
}

export function chordRootPitchClass(
  chord: HarmonicChord,
  context: TonalContext,
): PitchClass {
  return normalizePitchClass(
    scaleDegreePitchClass(context, chord.degree) + chord.rootAlteration,
  );
}

export function diatonicChord(
  context: TonalContext,
  degree: HarmonicDegree,
  withSeventh = false,
): HarmonicChord {
  return {
    degree,
    rootAlteration: 0,
    quality: TRIAD_QUALITIES[context.mode][degree - 1],
    seventh: withSeventh
      ? SEVENTH_QUALITIES[context.mode][degree - 1]
      : null,
    role: "diatonic",
  };
}

export function dominantSeventh(
  degree: HarmonicDegree,
  targetDegree: HarmonicDegree,
): HarmonicChord {
  return {
    degree,
    rootAlteration: 0,
    quality: "major",
    seventh: "minor",
    role: "secondary-dominant",
    targetDegree,
  };
}

export function borrowedChord(
  degree: HarmonicDegree,
  quality: ChordQuality,
  rootAlteration: HarmonicChord["rootAlteration"] = 0,
): HarmonicChord {
  return {
    degree,
    rootAlteration,
    quality,
    seventh: null,
    role: "borrowed",
  };
}

export function diatonicPalette(
  context: TonalContext,
  withSevenths = false,
): HarmonicChord[] {
  return harmonicDegrees.map((degree) =>
    diatonicChord(context, degree, withSevenths),
  );
}

export function basicHarmonyPalette(context: TonalContext): HarmonicChord[] {
  const palette = diatonicPalette(context, false);
  if (context.mode === "major") {
    palette.push(dominantSeventh(2, 5));
  } else {
    palette.push(dominantSeventh(5, 1));
  }
  return palette;
}

export function minorHarmonyPalette(context: TonalContext): HarmonicChord[] {
  const minorContext: TonalContext = {
    tonic: context.tonic,
    mode:
      context.mode === "harmonic-minor" ? "harmonic-minor" : "natural-minor",
  };
  const palette = diatonicPalette(minorContext, false);
  const dominant: HarmonicChord = {
    degree: 5,
    rootAlteration: 0,
    quality: "major",
    seventh: "minor",
    role: "diatonic",
  };
  const fifth = palette.findIndex((chord) => chord.degree === 5);
  if (fifth >= 0) palette.splice(fifth, 1);
  palette.push(dominant);
  return palette;
}

export function borrowedMajorPalette(context: TonalContext): HarmonicChord[] {
  const majorContext: TonalContext = { tonic: context.tonic, mode: "major" };
  return [
    diatonicChord(majorContext, 1),
    diatonicChord(majorContext, 6),
    diatonicChord(majorContext, 4),
    diatonicChord(majorContext, 5),
    borrowedChord(4, "minor"),
    borrowedChord(7, "major", -1),
  ];
}

function accidentalText(diff: number): string {
  if (diff === -2) return "♭♭";
  if (diff === -1) return "♭";
  if (diff === 1) return "♯";
  if (diff === 2) return "♯♯";
  return "";
}

function signedPitchDifference(target: number, natural: number): number {
  let diff = normalizePitchClass(target - natural);
  if (diff > 6) diff -= 12;
  return diff;
}

export function tonicName(context: TonalContext): string {
  return DEFAULT_TONIC_NAMES[context.tonic];
}

export function spellScaleDegree(
  context: TonalContext,
  degree: HarmonicDegree,
  rootAlteration = 0,
): string {
  const tonic = tonicName(context);
  const tonicLetter = tonic[0];
  const startIndex = LETTERS.indexOf(
    tonicLetter as (typeof LETTERS)[number],
  );
  const letter = LETTERS[(startIndex + degree - 1) % LETTERS.length];
  const target = normalizePitchClass(
    scaleDegreePitchClass(context, degree) + rootAlteration,
  );
  const natural = NATURAL_PITCH_CLASSES[letter];
  const diff = signedPitchDifference(target, natural);
  return letter + accidentalText(diff);
}

function chordSuffix(chord: HarmonicChord): string {
  if (chord.quality === "major" && chord.seventh === null) return "";
  if (chord.quality === "minor" && chord.seventh === null) return "m";
  if (chord.quality === "diminished" && chord.seventh === null) return "dim";
  if (chord.quality === "augmented" && chord.seventh === null) return "aug";
  if (chord.quality === "major" && chord.seventh === "major") return "maj7";
  if (chord.quality === "major" && chord.seventh === "minor") return "7";
  if (chord.quality === "minor" && chord.seventh === "minor") return "m7";
  if (chord.quality === "minor" && chord.seventh === "major") return "mMaj7";
  if (chord.quality === "diminished" && chord.seventh === "minor") return "m7b5";
  if (chord.quality === "diminished" && chord.seventh === "diminished") return "dim7";
  if (chord.quality === "augmented" && chord.seventh === "major") return "augMaj7";
  if (chord.quality === "augmented" && chord.seventh === "minor") return "aug7";
  return "7";
}

export function chordSymbol(
  chord: HarmonicChord,
  context: TonalContext,
): string {
  return spellScaleDegree(context, chord.degree, chord.rootAlteration) +
    chordSuffix(chord);
}

function qualityRoman(
  degree: HarmonicDegree,
  quality: ChordQuality,
): string {
  const roman =
    quality === "major" || quality === "augmented"
      ? ROMAN_UPPER[degree - 1]
      : ROMAN_LOWER[degree - 1];
  if (quality === "diminished") return roman + "°";
  if (quality === "augmented") return roman + "+";
  return roman;
}

function romanSeventhSuffix(chord: HarmonicChord): string {
  if (chord.seventh === null) return "";
  if (chord.quality === "diminished" && chord.seventh === "minor") return "7";
  if (chord.quality === "diminished" && chord.seventh === "diminished") return "7";
  if (chord.seventh === "major") return "maj7";
  return "7";
}

export function romanNumeral(
  chord: HarmonicChord,
  context: TonalContext,
): string {
  if (chord.role === "secondary-dominant" && chord.targetDegree) {
    const target = diatonicChord(context, chord.targetDegree);
    return "V7/" + qualityRoman(target.degree, target.quality);
  }
  const accidental =
    chord.rootAlteration < 0
      ? "♭".repeat(-chord.rootAlteration)
      : chord.rootAlteration > 0
        ? "♯".repeat(chord.rootAlteration)
        : "";
  const base = qualityRoman(chord.degree, chord.quality);
  if (chord.quality === "diminished" && chord.seventh === "minor") {
    return accidental + base.replace("°", "ø") + "7";
  }
  return accidental + base + romanSeventhSuffix(chord);
}

export type HarmonicFunction =
  | "tonic"
  | "predominant"
  | "dominant"
  | "secondary-dominant"
  | "borrowed";

export function harmonicFunction(chord: HarmonicChord): HarmonicFunction {
  if (chord.role === "secondary-dominant") return "secondary-dominant";
  if (chord.role === "borrowed") return "borrowed";
  if (chord.degree === 2 || chord.degree === 4) return "predominant";
  if (chord.degree === 5 || chord.degree === 7) return "dominant";
  return "tonic";
}

export function chordIntervals(chord: HarmonicChord): number[] {
  const triad =
    chord.quality === "major"
      ? [0, 4, 7]
      : chord.quality === "minor"
        ? [0, 3, 7]
        : chord.quality === "diminished"
          ? [0, 3, 6]
          : [0, 4, 8];
  if (chord.seventh === null) return triad;
  const seventh =
    chord.seventh === "major"
      ? 11
      : chord.seventh === "diminished"
        ? 9
        : 10;
  return [...triad, seventh];
}

export function chordMidi(
  chord: HarmonicChord,
  context: TonalContext,
): number[] {
  const root = 48 + chordRootPitchClass(chord, context);
  return chordIntervals(chord).map((interval) => root + interval);
}

export type ChordInversion = 0 | 1 | 2;

export function voicedHarmonicChordMidi(
  chord: HarmonicChord,
  context: TonalContext,
  inversion: ChordInversion,
): number[] {
  const notes = chordMidi(chord, context);
  if (inversion === 1) {
    return [...notes.slice(1).map((note) => note - 12), notes[0]];
  }
  if (inversion === 2) {
    return [
      ...notes.slice(2).map((note) => note - 12),
      ...notes.slice(0, 2),
    ];
  }
  return [...notes];
}

export function harmonicVoiceLeadingDistance(
  progression: HarmonicProgression,
  context: TonalContext,
  inversions: ChordInversion[],
): number {
  let distance = 0;
  let previous: number[] | null = null;
  progression.forEach((chord, index) => {
    if (!chord) return;
    const current = voicedHarmonicChordMidi(
      chord,
      context,
      inversions[index] ?? 0,
    );
    if (previous) {
      distance += current.reduce((sum, midi, voice) => {
        const previousMidi =
          previous?.[voice] ?? previous?.[previous.length - 1] ?? midi;
        return sum + Math.abs(midi - previousMidi);
      }, 0);
    }
    previous = current;
  });
  return distance;
}

export function harmonicBassRootMidi(
  chord: HarmonicChord,
  context: TonalContext,
): number {
  const root = chordMidi(chord, context)[0];
  let bass = root - 12;
  while (bass > 48) bass -= 12;
  while (bass < 35) bass += 12;
  return bass;
}

export function harmonicBassChordToneMidis(
  chord: HarmonicChord,
  context: TonalContext,
): number[] {
  return chordMidi(chord, context).map((note) => {
    let bass = note - 12;
    while (bass > 48) bass -= 12;
    while (bass < 35) bass += 12;
    return bass;
  });
}

export function harmonicChordPitchClasses(
  chord: HarmonicChord,
  context: TonalContext,
): number[] {
  return [...new Set(chordMidi(chord, context).map(normalizePitchClass))];
}

export function isHarmonicChordTone(
  midi: number,
  chord: HarmonicChord,
  context: TonalContext,
): boolean {
  return harmonicChordPitchClasses(chord, context).includes(
    normalizePitchClass(midi),
  );
}

export function isMidiInTonalContext(
  midi: number,
  context: TonalContext,
): boolean {
  const pitchClass = normalizePitchClass(midi);
  return harmonicDegrees.some(
    (degree) => scaleDegreePitchClass(context, degree) === pitchClass,
  );
}

export function progressionSymbols(
  progression: HarmonicProgression,
  context: TonalContext,
): Array<string | null> {
  return progression.map((chord) =>
    chord ? chordSymbol(chord, context) : null,
  );
}

export function keyLabel(context: TonalContext): string {
  const mode =
    context.mode === "major"
      ? "major"
      : context.mode === "natural-minor"
        ? "natural minor"
        : "harmonic minor";
  return tonicName(context) + " " + mode;
}

const ROOT_PCS: Record<string, PitchClass> = {
  C: 0,
  "C♯": 1,
  "D♭": 1,
  D: 2,
  "D♯": 3,
  "E♭": 3,
  E: 4,
  F: 5,
  "F♯": 6,
  "G♭": 6,
  G: 7,
  "G♯": 8,
  "A♭": 8,
  A: 9,
  "A♯": 10,
  "B♭": 10,
  B: 11,
};

function parseLegacyChordSymbol(symbol: string): {
  root: PitchClass;
  quality: ChordQuality;
  seventh: SeventhQuality;
} | null {
  const match = symbol.match(/^([A-G](?:♯|♭)?)(.*)$/);
  if (!match) return null;
  const root = ROOT_PCS[match[1]];
  if (root === undefined) return null;
  const suffix = match[2];
  if (suffix === "") return { root, quality: "major", seventh: null };
  if (suffix === "m") return { root, quality: "minor", seventh: null };
  if (suffix === "dim") return { root, quality: "diminished", seventh: null };
  if (suffix === "aug") return { root, quality: "augmented", seventh: null };
  if (suffix === "7") return { root, quality: "major", seventh: "minor" };
  if (suffix === "maj7") return { root, quality: "major", seventh: "major" };
  if (suffix === "m7") return { root, quality: "minor", seventh: "minor" };
  if (suffix === "m7b5") return { root, quality: "diminished", seventh: "minor" };
  if (suffix === "dim7") return { root, quality: "diminished", seventh: "diminished" };
  return null;
}

function degreeForRoot(
  root: PitchClass,
  context: TonalContext,
): { degree: HarmonicDegree; alteration: HarmonicChord["rootAlteration"] } | null {
  for (const degree of harmonicDegrees) {
    const scalePitch = scaleDegreePitchClass(context, degree);
    for (const alteration of [0, -1, 1, -2, 2] as const) {
      if (normalizePitchClass(scalePitch + alteration) === root) {
        return { degree, alteration };
      }
    }
  }
  return null;
}

export function legacyChordToHarmonic(
  symbol: string,
  context: TonalContext,
): HarmonicChord | null {
  const parsed = parseLegacyChordSymbol(symbol);
  if (!parsed) return null;
  const located = degreeForRoot(parsed.root, context);
  if (!located) return null;

  let role: HarmonicRole = "diatonic";
  let targetDegree: HarmonicDegree | undefined;
  if (context.mode === "major" && symbol === "D7") {
    role = "secondary-dominant";
    targetDegree = 5;
  } else if (context.mode === "major" && symbol === "E7") {
    role = "secondary-dominant";
    targetDegree = 6;
  } else if (symbol === "Fm" || symbol === "B♭") {
    role = "borrowed";
  } else if (
    context.mode !== "major" &&
    located.degree === 5 &&
    parsed.quality === "major" &&
    parsed.seventh === "minor"
  ) {
    role = "diatonic";
  }

  return {
    degree: located.degree,
    rootAlteration: located.alteration,
    quality: parsed.quality,
    seventh: parsed.seventh,
    role,
    ...(targetDegree ? { targetDegree } : {}),
  };
}

export function inferLegacyTonalContext(
  progression: unknown,
  lessonId?: unknown,
): TonalContext {
  if (
    typeof lessonId === "string" &&
    (lessonId.includes("relative-minor") ||
      lessonId.includes("harmonic-minor") ||
      lessonId.includes("minor-cadences"))
  ) {
    return { tonic: 9, mode: "natural-minor" };
  }
  if (Array.isArray(progression) && progression.includes("E7")) {
    return { tonic: 9, mode: "natural-minor" };
  }
  return cloneTonalContext(initialTonalContext);
}

export function migrateLegacyProgression(
  progression: unknown,
  context: TonalContext,
): HarmonicProgression {
  if (!Array.isArray(progression)) {
    return cloneHarmonicProgression(initialHarmonicProgression);
  }
  return initialHarmonicProgression.map((_, index) => {
    const value = progression[index];
    if (value === null || value === undefined) return null;
    if (typeof value !== "string") return null;
    return legacyChordToHarmonic(value, context);
  });
}

export function harmonicIdentityEquals(
  chord: HarmonicChord | null | undefined,
  expected: Partial<HarmonicChord>,
): boolean {
  if (!chord) return false;
  return Object.entries(expected).every(
    ([key, value]) => chord[key as keyof HarmonicChord] === value,
  );
}

export function progressionMatchesDegrees(
  progression: HarmonicProgression,
  degrees: Array<HarmonicDegree | null>,
): boolean {
  return degrees.every((degree, index) =>
    degree === null
      ? progression[index] === null
      : progression[index]?.degree === degree,
  );
}

export function transposeMidi(
  midi: number,
  semitones: number,
): number {
  return Math.max(0, Math.min(127, midi + semitones));
}

export function transposeNullableMidiSequence(
  sequence: Array<number | null>,
  semitones: number,
): Array<number | null> {
  return sequence.map((note) =>
    note === null ? null : transposeMidi(note, semitones),
  );
}

export function transposeHarmonySequence(
  sequence: Array<number[]>,
  semitones: number,
): Array<number[]> {
  return sequence.map((notes) =>
    notes.map((note) => transposeMidi(note, semitones)),
  );
}
