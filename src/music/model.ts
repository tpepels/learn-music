export const trackNames = ["kick", "snare", "hat"] as const;
export const patternIds = ["A", "B"] as const;

export type TrackName = (typeof trackNames)[number];
export type PatternId = (typeof patternIds)[number];
export type StepPattern = Record<TrackName, boolean[]>;

export const STEPS = 16;

export const initialPattern: StepPattern = {
  kick: Array(STEPS).fill(false),
  snare: Array(STEPS).fill(false),
  hat: Array(STEPS).fill(false),
};

export function clonePattern(pattern: StepPattern): StepPattern {
  return { kick: [...pattern.kick], snare: [...pattern.snare], hat: [...pattern.hat] };
}

export function countPatternDifferences(left: StepPattern, right: StepPattern): number {
  return trackNames.reduce(
    (total, track) =>
      total + left[track].reduce(
        (trackTotal, active, step) => trackTotal + (active !== right[track][step] ? 1 : 0),
        0,
      ),
    0,
  );
}

export function hasNewOffbeatEvent(reference: StepPattern, variation: StepPattern): boolean {
  return trackNames.some((track) =>
    variation[track].some(
      (active, step) => active && !reference[track][step] && step % 4 !== 0,
    ),
  );
}

export const chromaticPitches = [
  { midi: 72, name: "C5", pitchClass: "C", black: false },
  { midi: 71, name: "B4", pitchClass: "B", black: false },
  { midi: 70, name: "B♭4", pitchClass: "B♭", black: true },
  { midi: 69, name: "A4", pitchClass: "A", black: false },
  { midi: 68, name: "A♭4", pitchClass: "A♭", black: true },
  { midi: 67, name: "G4", pitchClass: "G", black: false },
  { midi: 66, name: "F♯4", pitchClass: "F♯", black: true },
  { midi: 65, name: "F4", pitchClass: "F", black: false },
  { midi: 64, name: "E4", pitchClass: "E", black: false },
  { midi: 63, name: "E♭4", pitchClass: "E♭", black: true },
  { midi: 62, name: "D4", pitchClass: "D", black: false },
  { midi: 61, name: "D♭4", pitchClass: "D♭", black: true },
  { midi: 60, name: "C4", pitchClass: "C", black: false },
] as const;

export const cMajorMidi = [60, 62, 64, 65, 67, 69, 71, 72] as const;
export const cMajorPitchClasses = ["C", "D", "E", "F", "G", "A", "B"] as const;
export const aNaturalMinorPitchClasses = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const aHarmonicMinorPitchClasses = ["A", "B", "C", "D", "E", "F", "G♯"] as const;

export function isANaturalMinorMidi(midi: number): boolean {
  return [9, 11, 0, 2, 4, 5, 7].includes(((midi % 12) + 12) % 12);
}

export function isAHarmonicMinorMidi(midi: number): boolean {
  return [9, 11, 0, 2, 4, 5, 8].includes(((midi % 12) + 12) % 12);
}
export const MELODY_STEPS = 16;
export type MelodySequence = Array<number | null>;
export type NoteDurationLane = number[];

export const initialMelody: MelodySequence = Array(MELODY_STEPS).fill(null);
export const initialMelodyDurations: NoteDurationLane =
  Array(MELODY_STEPS).fill(1);

export function cloneNoteDurationLane(
  lane: NoteDurationLane,
  length: number,
): NoteDurationLane {
  return Array.from({ length }, (_, step) => {
    const value = lane[step];
    return Number.isFinite(value)
      ? Math.max(1, Math.min(length - step, Math.round(value)))
      : 1;
  });
}

export function maxMonophonicDuration(
  sequence: Array<number | null>,
  step: number,
): number {
  const nextOnset = sequence.findIndex(
    (note, index) => index > step && note !== null,
  );
  return Math.max(
    1,
    (nextOnset === -1 ? sequence.length : nextOnset) - step,
  );
}

export function normalizeMonophonicDurations(
  sequence: Array<number | null>,
  durations: NoteDurationLane,
): NoteDurationLane {
  const lane = cloneNoteDurationLane(durations, sequence.length);
  return lane.map((duration, step) =>
    sequence[step] === null
      ? 1
      : Math.min(duration, maxMonophonicDuration(sequence, step)),
  );
}

export function truncateMonophonicDurationsAtOnset(
  sequence: Array<number | null>,
  durations: NoteDurationLane,
  onsetStep: number,
): NoteDurationLane {
  const lane = cloneNoteDurationLane(durations, sequence.length);
  for (let previous = 0; previous < onsetStep; previous += 1) {
    if (
      sequence[previous] !== null &&
      previous + lane[previous] > onsetStep
    ) {
      lane[previous] = Math.max(1, onsetStep - previous);
    }
  }
  return lane;
}

export function noteDurationLabel(steps: number): string {
  const safe = Math.max(1, Math.round(steps));
  if (safe === 1) return "1/8";
  if (safe === 2) return "1/4";
  if (safe === 4) return "1/2";
  if (safe === 8) return "1 bar";
  return safe + "/8";
}

export const basicChordNames = ["C", "Dm", "Em", "F", "G", "Am", "Bdim", "D7"] as const;
export const minorKeyChordNames = ["Am", "Bdim", "C", "Dm", "Em", "F", "G", "E7"] as const;
export const seventhChordNames = ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"] as const;
export const borrowedChordNames = ["C", "Am", "F", "G", "Fm", "B♭"] as const;
export const chordNames = [
  ...basicChordNames,
  "E7",
  ...seventhChordNames,
  "Fm",
  "B♭",
] as const;
export type ChordName = (typeof chordNames)[number];
export type ChordProgression = Array<ChordName | null>;

export const initialChordProgression: ChordProgression = [null, null, null, null];

export const HARMONY_STEPS = 32;
export type HarmonySequence = Array<number[]>;
export type HarmonyDurations = Array<Record<string, number>>;
export const initialHarmonySequence: HarmonySequence = Array.from(
  { length: HARMONY_STEPS },
  () => [],
);
export const initialHarmonyDurations: HarmonyDurations = Array.from(
  { length: HARMONY_STEPS },
  () => ({}),
);
export const harmonyPitches = Array.from(
  { length: 25 },
  (_, index) => 72 - index,
);

export function cloneHarmonySequence(
  sequence: HarmonySequence,
): HarmonySequence {
  return sequence.map((notes) => [...notes]);
}

export function cloneHarmonyDurations(
  durations: HarmonyDurations,
): HarmonyDurations {
  return Array.from({ length: HARMONY_STEPS }, (_, step) => {
    const source = durations[step] ?? {};
    return Object.fromEntries(
      Object.entries(source).map(([midi, duration]) => [
        midi,
        Math.max(
          1,
          Math.min(
            HARMONY_STEPS - step,
            Number.isFinite(duration) ? Math.round(duration) : 1,
          ),
        ),
      ]),
    );
  });
}

export function maxHarmonyDuration(
  sequence: HarmonySequence,
  step: number,
  midi: number,
): number {
  const nextOnset = sequence.findIndex(
    (notes, index) => index > step && notes.includes(midi),
  );
  return Math.max(
    1,
    (nextOnset === -1 ? sequence.length : nextOnset) - step,
  );
}

export function normalizeHarmonyDurations(
  sequence: HarmonySequence,
  durations: HarmonyDurations,
): HarmonyDurations {
  const cloned = cloneHarmonyDurations(durations);
  return cloned.map((entry, step) =>
    Object.fromEntries(
      Object.entries(entry)
        .filter(([midi]) =>
          (sequence[step] ?? []).includes(Number(midi)),
        )
        .map(([midi, duration]) => [
          midi,
          Math.min(
            duration,
            maxHarmonyDuration(sequence, step, Number(midi)),
          ),
        ]),
    ),
  );
}

export function truncateHarmonyDurationsAtOnset(
  sequence: HarmonySequence,
  durations: HarmonyDurations,
  onsetStep: number,
  midi: number,
): HarmonyDurations {
  const cloned = cloneHarmonyDurations(durations);
  for (let previous = 0; previous < onsetStep; previous += 1) {
    if (
      (sequence[previous] ?? []).includes(midi) &&
      previous + (cloned[previous]?.[midi] ?? 1) > onsetStep
    ) {
      cloned[previous][midi] = Math.max(1, onsetStep - previous);
    }
  }
  return cloned;
}

export const accompanimentPatterns = ["block", "pulse", "broken", "arpeggio"] as const;
export type AccompanimentPattern = (typeof accompanimentPatterns)[number];
export const initialAccompanimentPattern: AccompanimentPattern = "block";

export const chordMidi: Record<ChordName, number[]> = {
  C: [48, 52, 55],
  Dm: [50, 53, 57],
  Em: [52, 55, 59],
  F: [53, 57, 60],
  G: [55, 59, 62],
  Am: [57, 60, 64],
  Bdim: [59, 62, 65],
  D7: [50, 54, 57, 60],
  E7: [52, 56, 59, 62],
  Cmaj7: [48, 52, 55, 59],
  Dm7: [50, 53, 57, 60],
  Em7: [52, 55, 59, 62],
  Fmaj7: [53, 57, 60, 64],
  G7: [55, 59, 62, 65],
  Am7: [57, 60, 64, 67],
  Bm7b5: [59, 62, 65, 69],
  Fm: [53, 56, 60],
  "B♭": [58, 62, 65],
};

export const romanNumerals: Record<ChordName, string> = {
  C: "I",
  Dm: "ii",
  Em: "iii",
  F: "IV",
  G: "V",
  Am: "vi",
  Bdim: "vii°",
  D7: "V/V",
  E7: "V/vi",
  Cmaj7: "Imaj7",
  Dm7: "ii7",
  Em7: "iii7",
  Fmaj7: "IVmaj7",
  G7: "V7",
  Am7: "vi7",
  Bm7b5: "viiø7",
  Fm: "iv",
  "B♭": "♭VII",
};

export const aMinorRomanNumerals: Partial<Record<ChordName, string>> = {
  Am: "i",
  Bdim: "ii°",
  C: "III",
  Dm: "iv",
  Em: "v",
  F: "VI",
  G: "VII",
  E7: "V7",
};

export const seventhRomanNumerals: Partial<Record<ChordName, string>> = {
  Cmaj7: "Imaj7",
  Dm7: "ii7",
  Em7: "iii7",
  Fmaj7: "IVmaj7",
  G7: "V7",
  Am7: "vi7",
  Bm7b5: "viiø7",
};

export const borrowedRomanNumerals: Partial<Record<ChordName, string>> = {
  C: "I",
  Am: "vi",
  F: "IV",
  G: "V",
  Fm: "iv (borrowed)",
  "B♭": "♭VII (borrowed)",
};

export function isCMajorMidi(midi: number): boolean {
  return [0, 2, 4, 5, 7, 9, 11].includes(midi % 12);
}


export const synthWaveforms = ["sine", "triangle", "sawtooth", "square"] as const;
export type SynthWaveform = (typeof synthWaveforms)[number];

export type SynthSettings = {
  waveform: SynthWaveform;
  cutoff: number;
  attack: number;
  release: number;
};

export const initialSynthSettings: SynthSettings = {
  waveform: "sine",
  cutoff: 12000,
  attack: 0.01,
  release: 0.25,
};

export const arrangementLayers = ["drums", "bass", "chords", "melody"] as const;
export type ArrangementLayer = (typeof arrangementLayers)[number];
export type ArrangementBar = Record<ArrangementLayer, boolean>;
export type Arrangement = ArrangementBar[];

export const ARRANGEMENT_BARS = 8;

export const initialArrangement: Arrangement = Array.from(
  { length: ARRANGEMENT_BARS },
  () => ({
    drums: false,
    bass: false,
    chords: false,
    melody: false,
  }),
);

export function cloneArrangement(arrangement: Arrangement): Arrangement {
  return arrangement.map((bar) => ({ ...bar }));
}

export function activeLayerCount(bar: ArrangementBar): number {
  return arrangementLayers.filter((layer) => bar[layer]).length;
}


export const mixerTrackIds = ["drums", "bass", "chords", "melody"] as const;
export type MixerTrackId = (typeof mixerTrackIds)[number];

export type MixerTrackSettings = {
  volume: number;
  pan: number;
  highpass: number;
  reverb: number;
  delay: number;
};

export type MixerSettings = Record<MixerTrackId, MixerTrackSettings>;

const neutralMixerTrack = (): MixerTrackSettings => ({
  volume: 0,
  pan: 0,
  highpass: 20,
  reverb: 0,
  delay: 0,
});

export const initialMixerSettings: MixerSettings = {
  drums: neutralMixerTrack(),
  bass: neutralMixerTrack(),
  chords: neutralMixerTrack(),
  melody: neutralMixerTrack(),
};

export function cloneMixerSettings(settings: MixerSettings): MixerSettings {
  return {
    drums: { ...settings.drums },
    bass: { ...settings.bass },
    chords: { ...settings.chords },
    melody: { ...settings.melody },
  };
}




export type ParametricEqBand = {
  frequency: number;
  gain: number;
  q: number;
};

export type EqSettings = Record<MixerTrackId, ParametricEqBand>;

const neutralEqBand = (frequency: number): ParametricEqBand => ({
  frequency,
  gain: 0,
  q: 1,
});

export const initialEqSettings: EqSettings = {
  drums: neutralEqBand(1800),
  bass: neutralEqBand(250),
  chords: neutralEqBand(800),
  melody: neutralEqBand(2500),
};

export function cloneEqSettings(settings: EqSettings): EqSettings {
  return {
    drums: { ...settings.drums },
    bass: { ...settings.bass },
    chords: { ...settings.chords },
    melody: { ...settings.melody },
  };
}

export type SaturationTrackSettings = {
  drive: number;
  wet: number;
};

export type SaturationSettings = Record<MixerTrackId, SaturationTrackSettings>;

const neutralSaturation = (): SaturationTrackSettings => ({
  drive: 0,
  wet: 0,
});

export const initialSaturationSettings: SaturationSettings = {
  drums: neutralSaturation(),
  bass: neutralSaturation(),
  chords: neutralSaturation(),
  melody: neutralSaturation(),
};

export function cloneSaturationSettings(
  settings: SaturationSettings,
): SaturationSettings {
  return {
    drums: { ...settings.drums },
    bass: { ...settings.bass },
    chords: { ...settings.chords },
    melody: { ...settings.melody },
  };
}

export type SidechainSettings = {
  enabled: boolean;
  amountDb: number;
  release: number;
};

export const initialSidechainSettings: SidechainSettings = {
  enabled: false,
  amountDb: 0,
  release: 0.18,
};

export type StereoSettings = {
  widths: Record<MixerTrackId, number>;
  monoAudition: boolean;
  monoChecked: boolean;
};

export const initialStereoSettings: StereoSettings = {
  widths: {
    drums: 0.5,
    bass: 0.5,
    chords: 0.5,
    melody: 0.5,
  },
  monoAudition: false,
  monoChecked: false,
};

export function cloneStereoSettings(settings: StereoSettings): StereoSettings {
  return {
    widths: { ...settings.widths },
    monoAudition: settings.monoAudition,
    monoChecked: settings.monoChecked,
  };
}

export type ReferenceSnapshot = {
  mixerSettings: MixerSettings;
  eqSettings: EqSettings;
  saturationSettings: SaturationSettings;
  stereoWidths: Record<MixerTrackId, number>;
};

export type ReferenceMixSettings = {
  snapshot: ReferenceSnapshot | null;
  trimDb: number;
  comparisons: number;
  quietChecked: boolean;
};

export const initialReferenceMixSettings: ReferenceMixSettings = {
  snapshot: null,
  trimDb: 0,
  comparisons: 0,
  quietChecked: false,
};

export function cloneReferenceSnapshot(
  snapshot: ReferenceSnapshot | null,
): ReferenceSnapshot | null {
  if (!snapshot) return null;
  return {
    mixerSettings: cloneMixerSettings(snapshot.mixerSettings),
    eqSettings: cloneEqSettings(snapshot.eqSettings),
    saturationSettings: cloneSaturationSettings(snapshot.saturationSettings),
    stereoWidths: { ...snapshot.stereoWidths },
  };
}

export type AutomationSettings = {
  melodyVolumeDb: number[];
  chordFilterHz: number[];
};

export const initialAutomationSettings: AutomationSettings = {
  melodyVolumeDb: Array(ARRANGEMENT_BARS).fill(0),
  chordFilterHz: Array(ARRANGEMENT_BARS).fill(12000),
};

export function cloneAutomationSettings(
  settings: AutomationSettings,
): AutomationSettings {
  return {
    melodyVolumeDb: [...settings.melodyVolumeDb],
    chordFilterHz: [...settings.chordFilterHz],
  };
}

export type DynamicsSettings = {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
};

export const initialDynamicsSettings: DynamicsSettings = {
  threshold: -24,
  ratio: 1,
  attack: 0.003,
  release: 0.2,
};


export type EffectsSettings = {
  reverbDecay: number;
  reverbPreDelay: number;
  delayFeedback: number;
  chorusWet: number;
};

export const initialEffectsSettings: EffectsSettings = {
  reverbDecay: 2.7,
  reverbPreDelay: 0.015,
  delayFeedback: 0.28,
  chorusWet: 0,
};

export type ProjectMilestones = {
  exported: boolean;
};

export const initialProjectMilestones: ProjectMilestones = {
  exported: false,
};


export type ControlExperiment = {
  changes: number;
  min: number | null;
  max: number | null;
  values: string[];
};

export type ExerciseExperiments = Record<string, ControlExperiment>;

export type ProjectData = {
  bpm: number;
  patterns: Record<PatternId, StepPattern>;
  melody: MelodySequence;
  melodyDurations: NoteDurationLane;
  chordProgression: ChordProgression;
  harmonySequence: HarmonySequence;
  harmonyDurations: HarmonyDurations;
  accompanimentPattern: AccompanimentPattern;
  synthSettings: SynthSettings;
  arrangement: Arrangement;
  mixerSettings: MixerSettings;
  automationSettings: AutomationSettings;
  dynamicsSettings: DynamicsSettings;
  effectsSettings: EffectsSettings;
  voicingSettings: VoicingSettings;
  bassSequence: BassSequence;
  bassDurations: NoteDurationLane;
  grooveFeelSettings: GrooveFeelSettings;
  formSettings: FormSettings;
  textureSettings: TextureSettings;
  eqSettings: EqSettings;
  saturationSettings: SaturationSettings;
  sidechainSettings: SidechainSettings;
  stereoSettings: StereoSettings;
  referenceMixSettings: ReferenceMixSettings;
};


export type ChordInversion = 0 | 1 | 2;

export type VoicingSettings = {
  inversions: ChordInversion[];
};

export const initialVoicingSettings: VoicingSettings = {
  inversions: [0, 0, 0, 0],
};

export function voicedChordMidi(
  chord: ChordName,
  inversion: ChordInversion,
): number[] {
  const notes = chordMidi[chord];

  if (inversion === 1) {
    return [
      ...notes.slice(1).map((note) => note - 12),
      notes[0],
    ];
  }

  if (inversion === 2) {
    return [
      ...notes.slice(2).map((note) => note - 12),
      ...notes.slice(0, 2),
    ];
  }

  return [...notes];
}

export function voiceLeadingDistance(
  progression: ChordProgression,
  inversions: ChordInversion[],
): number {
  let distance = 0;
  let previous: number[] | null = null;

  progression.forEach((chord, index) => {
    if (!chord) return;

    const current = voicedChordMidi(chord, inversions[index] ?? 0);

    if (previous) {
      distance += current.reduce((sum, midi, voice) => {
        const previousMidi =
          previous![voice] ??
          previous![previous!.length - 1] ??
          midi;
        return sum + Math.abs(midi - previousMidi);
      }, 0);
    }

    previous = current;
  });

  return distance;
}

const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"] as const;

export function midiNoteName(midi: number): string {
  const pitchClass = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return pitchClass + octave;
}

export const BASS_STEPS = 32;
export type BassSequence = Array<number | null>;

export const initialBassSequence: BassSequence = Array(BASS_STEPS).fill(null);
export const initialBassDurations: NoteDurationLane =
  Array(BASS_STEPS).fill(1);

export const bassPitches = Array.from({ length: 14 }, (_, index) => {
  const midi = 48 - index;
  return {
    midi,
    name: midiNoteName(midi),
    pitchClass: NOTE_NAMES[((midi % 12) + 12) % 12],
    inCMajor: [0, 2, 4, 5, 7, 9, 11].includes(((midi % 12) + 12) % 12),
  };
});

export function bassRootMidi(chord: ChordName): number {
  const root = chordMidi[chord][0];
  let bass = root - 12;
  while (bass > 48) bass -= 12;
  while (bass < 35) bass += 12;
  return bass;
}

export function bassChordToneMidis(chord: ChordName): number[] {
  return chordMidi[chord].map((note) => {
    let bass = note - 12;
    while (bass > 48) bass -= 12;
    while (bass < 35) bass += 12;
    return bass;
  });
}


export type GrooveFeelSettings = {
  swing: number;
  velocities: Record<TrackName, number[]>;
};

function velocityLane(value: number): number[] {
  return Array(STEPS).fill(value);
}

export const initialGrooveFeelSettings: GrooveFeelSettings = {
  swing: 0,
  velocities: {
    kick: velocityLane(0.9),
    snare: velocityLane(0.72),
    hat: velocityLane(0.42),
  },
};

export function cloneGrooveFeelSettings(
  settings: GrooveFeelSettings,
): GrooveFeelSettings {
  return {
    swing: settings.swing,
    velocities: {
      kick: [...settings.velocities.kick],
      snare: [...settings.velocities.snare],
      hat: [...settings.velocities.hat],
    },
  };
}


export const chordFunctions = ["tonic", "predominant", "dominant", "secondary-dominant", "borrowed"] as const;
export type ChordFunction = (typeof chordFunctions)[number];

export const chordFunction: Record<ChordName, ChordFunction> = {
  C: "tonic",
  Dm: "predominant",
  Em: "tonic",
  F: "predominant",
  G: "dominant",
  Am: "tonic",
  Bdim: "dominant",
  D7: "secondary-dominant",
  E7: "secondary-dominant",
  Cmaj7: "tonic",
  Dm7: "predominant",
  Em7: "tonic",
  Fmaj7: "predominant",
  G7: "dominant",
  Am7: "tonic",
  Bm7b5: "dominant",
  Fm: "borrowed",
  "B♭": "borrowed",
};

export function chordPitchClasses(chord: ChordName): number[] {
  return [...new Set(chordMidi[chord].map((midi) => ((midi % 12) + 12) % 12))];
}

export function isChordTone(midi: number, chord: ChordName): boolean {
  return chordPitchClasses(chord).includes(((midi % 12) + 12) % 12);
}

export type FormSectionLabel = "A" | "A′" | "B" | "C";
export type PhraseRole = "statement" | "answer" | "contrast" | "return";

export type FormSettings = {
  sections: FormSectionLabel[];
  roles: PhraseRole[];
  layers: ArrangementBar[];
};

export const initialFormSettings: FormSettings = {
  sections: ["A", "A′", "B", "A"],
  roles: ["statement", "answer", "contrast", "return"],
  layers: Array.from({ length: 4 }, () => ({
    drums: false,
    bass: false,
    chords: false,
    melody: false,
  })),
};

export type TextureSettings = {
  bassOctave: -1 | 0 | 1;
  chordsOctave: -1 | 0 | 1;
  melodyOctave: -1 | 0 | 1;
  openChords: boolean;
  melodyOctaveDouble: boolean;
};

export const initialTextureSettings: TextureSettings = {
  bassOctave: 0,
  chordsOctave: 0,
  melodyOctave: 0,
  openChords: false,
  melodyOctaveDouble: false,
};

export function applyChordTexture(
  notes: number[],
  settings: TextureSettings,
): number[] {
  const shifted = notes.map((note) => note + settings.chordsOctave * 12);

  if (!settings.openChords || shifted.length < 3) {
    return shifted;
  }

  return shifted.map((note, index) =>
    index === shifted.length - 1 ? note + 12 : note,
  );
}

export function transposeMelodyNote(
  midi: number,
  semitones: number,
): number {
  return Math.max(0, Math.min(127, midi + semitones));
}
