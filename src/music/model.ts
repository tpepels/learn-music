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
export const MELODY_STEPS = 16;
export type MelodySequence = Array<number | null>;

export const initialMelody: MelodySequence = Array(MELODY_STEPS).fill(null);

export const chordNames = ["C", "Dm", "Em", "F", "G", "Am", "Bdim"] as const;
export type ChordName = (typeof chordNames)[number];
export type ChordProgression = Array<ChordName | null>;

export const initialChordProgression: ChordProgression = [null, null, null, null];

export const chordMidi: Record<ChordName, number[]> = {
  C: [48, 52, 55],
  Dm: [50, 53, 57],
  Em: [52, 55, 59],
  F: [53, 57, 60],
  G: [55, 59, 62],
  Am: [57, 60, 64],
  Bdim: [59, 62, 65],
};

export const romanNumerals: Record<ChordName, string> = {
  C: "I",
  Dm: "ii",
  Em: "iii",
  F: "IV",
  G: "V",
  Am: "vi",
  Bdim: "vii°",
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
