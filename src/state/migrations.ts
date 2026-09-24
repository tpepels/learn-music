import {
  ARRANGEMENT_BARS,
  BASS_STEPS,
  HARMONY_STEPS,
  MELODY_STEPS,
  STEPS,
  accompanimentPatterns,
  arrangementLayers,
  bassVoices,
  chordNames,
  chordVoices,
  initialAccompanimentPattern,
  initialArrangement,
  initialAutomationSettings,
  initialBassDurations,
  initialBassSequence,
  initialChordProgression,
  initialDynamicsSettings,
  initialEffectsSettings,
  initialEqSettings,
  initialFormSettings,
  initialGrooveFeelSettings,
  initialHarmonyDurations,
  initialHarmonySequence,
  initialInstrumentSettings,
  initialMelody,
  initialMelodyDurations,
  initialMixerSettings,
  initialPattern,
  initialProjectMilestones,
  initialReferenceMixSettings,
  initialSaturationSettings,
  initialSidechainSettings,
  initialStereoSettings,
  initialSynthSettings,
  initialTextureSettings,
  initialVoicingSettings,
  mixerTrackIds,
  normalizeHarmonyDurations,
  normalizeMonophonicDurations,
  pianoTouches,
  patternIds,
  synthWaveforms,
  type Arrangement,
  type AutomationSettings,
  type BassSequence,
  type ChordProgression,
  type DynamicsSettings,
  type EffectsSettings,
  type EqSettings,
  type FormSectionLabel,
  type FormSettings,
  type GrooveFeelSettings,
  type HarmonySequence,
  type InstrumentSettings,
  type MelodySequence,
  type MixerSettings,
  type ProjectMilestones,
  type ReferenceMixSettings,
  type SaturationSettings,
  type SidechainSettings,
  type StepPattern,
  type StereoSettings,
  type SynthSettings,
  type TextureSettings,
  type VoicingSettings,
} from "../music/model";
import {
  inferLegacyTonalContext,
  migrateLegacyProgression,
  progressionSymbols,
  sanitizeHarmonicProgression,
  sanitizeTonalContext,
  type TonalContext,
} from "../music/harmony";

function migrationCompatibilityContext(context: TonalContext): TonalContext {
  return context.mode === "major"
    ? { tonic: 0, mode: "major" }
    : { tonic: 9, mode: context.mode };
}

const FORM_SECTIONS = 4;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function integer(value: unknown): number | null {
  const number = finiteNumber(value);
  return number !== null && Number.isInteger(number) ? number : null;
}

function enumValue<T extends string>(
  value: unknown,
  values: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && values.includes(value as T)
    ? (value as T)
    : fallback;
}

function migrateNumberLane(value: unknown, fallback: number[]): number[] {
  if (!Array.isArray(value)) return [...fallback];

  return fallback.map((defaultValue, index) => {
    const persisted = finiteNumber(value[index]);
    return persisted === null ? defaultValue : persisted;
  });
}

function migrateBooleanLane(value: unknown, fallback: boolean[]): boolean[] {
  if (!Array.isArray(value)) return [...fallback];

  return fallback.map((defaultValue, index) =>
    isBoolean(value[index]) ? value[index] : defaultValue,
  );
}

function migrateMidiLane<T extends Array<number | null>>(
  value: unknown,
  fallback: T,
): T {
  if (!Array.isArray(value)) return [...fallback] as T;

  return fallback.map((defaultValue, index) => {
    const persisted = value[index];
    if (persisted === null) return null;
    const note = integer(persisted);
    return note !== null && note >= 0 && note <= 127 ? note : defaultValue;
  }) as T;
}

function migrateStepPattern(value: unknown): StepPattern {
  const record = isRecord(value) ? value : {};

  return {
    kick: migrateBooleanLane(record.kick, initialPattern.kick),
    snare: migrateBooleanLane(record.snare, initialPattern.snare),
    hat: migrateBooleanLane(record.hat, initialPattern.hat),
  };
}

function migrateChordProgression(value: unknown): ChordProgression {
  if (!Array.isArray(value)) return [...initialChordProgression];

  return initialChordProgression.map((fallback, index) => {
    const persisted = value[index];
    if (persisted === null) return null;
    return typeof persisted === "string" &&
      chordNames.includes(persisted as (typeof chordNames)[number])
      ? (persisted as (typeof chordNames)[number])
      : fallback;
  });
}

function migrateHarmonySequence(value: unknown): HarmonySequence {
  if (!Array.isArray(value)) {
    return initialHarmonySequence.map((notes) => [...notes]);
  }

  return Array.from({ length: HARMONY_STEPS }, (_, step) => {
    const persisted = value[step];
    if (!Array.isArray(persisted)) return [...initialHarmonySequence[step]];

    return persisted.filter(
      (note): note is number =>
        integer(note) !== null &&
        (note as number) >= 0 &&
        (note as number) <= 127,
    );
  });
}

function migrateArrangement(value: unknown): Arrangement {
  if (!Array.isArray(value)) {
    return initialArrangement.map((bar) => ({ ...bar }));
  }

  return Array.from({ length: ARRANGEMENT_BARS }, (_, index) => {
    const persisted = isRecord(value[index]) ? value[index] : {};
    const fallback = initialArrangement[index];

    return Object.fromEntries(
      arrangementLayers.map((layer) => [
        layer,
        isBoolean(persisted[layer]) ? persisted[layer] : fallback[layer],
      ]),
    ) as Arrangement[number];
  });
}

function migrateMixerSettings(value: unknown): MixerSettings {
  const record = isRecord(value) ? value : {};

  return Object.fromEntries(
    mixerTrackIds.map((track) => {
      const persisted = isRecord(record[track]) ? record[track] : {};
      const fallback = initialMixerSettings[track];

      return [
        track,
        {
          volume: finiteNumber(persisted.volume) ?? fallback.volume,
          pan: finiteNumber(persisted.pan) ?? fallback.pan,
          highpass: finiteNumber(persisted.highpass) ?? fallback.highpass,
          reverb: finiteNumber(persisted.reverb) ?? fallback.reverb,
          delay: finiteNumber(persisted.delay) ?? fallback.delay,
        },
      ];
    }),
  ) as MixerSettings;
}

function migrateAutomationSettings(value: unknown): AutomationSettings {
  const record = isRecord(value) ? value : {};

  return {
    melodyVolumeDb: migrateNumberLane(
      record.melodyVolumeDb,
      initialAutomationSettings.melodyVolumeDb,
    ),
    chordFilterHz: migrateNumberLane(
      record.chordFilterHz,
      initialAutomationSettings.chordFilterHz,
    ),
  };
}

function migrateSynthSettings(value: unknown): SynthSettings {
  const record = isRecord(value) ? value : {};

  return {
    waveform: enumValue(
      record.waveform,
      synthWaveforms,
      initialSynthSettings.waveform,
    ),
    cutoff: finiteNumber(record.cutoff) ?? initialSynthSettings.cutoff,
    attack: finiteNumber(record.attack) ?? initialSynthSettings.attack,
    release: finiteNumber(record.release) ?? initialSynthSettings.release,
  };
}

function migrateDynamicsSettings(value: unknown): DynamicsSettings {
  const record = isRecord(value) ? value : {};

  return {
    threshold:
      finiteNumber(record.threshold) ?? initialDynamicsSettings.threshold,
    ratio: finiteNumber(record.ratio) ?? initialDynamicsSettings.ratio,
    attack: finiteNumber(record.attack) ?? initialDynamicsSettings.attack,
    release: finiteNumber(record.release) ?? initialDynamicsSettings.release,
  };
}

function migrateEffectsSettings(value: unknown): EffectsSettings {
  const record = isRecord(value) ? value : {};

  return {
    reverbDecay:
      finiteNumber(record.reverbDecay) ?? initialEffectsSettings.reverbDecay,
    reverbPreDelay:
      finiteNumber(record.reverbPreDelay) ??
      initialEffectsSettings.reverbPreDelay,
    delayFeedback:
      finiteNumber(record.delayFeedback) ??
      initialEffectsSettings.delayFeedback,
    chorusWet:
      finiteNumber(record.chorusWet) ?? initialEffectsSettings.chorusWet,
  };
}

function migrateVoicingSettings(value: unknown): VoicingSettings {
  const record = isRecord(value) ? value : {};
  const inversions = Array.isArray(record.inversions)
    ? record.inversions
    : [];

  return {
    inversions: initialVoicingSettings.inversions.map((fallback, index) => {
      const persisted = inversions[index];
      return persisted === 0 || persisted === 1 || persisted === 2
        ? persisted
        : fallback;
    }),
  };
}

function migrateTextureSettings(value: unknown): TextureSettings {
  const record = isRecord(value) ? value : {};
  const octave = (
    persisted: unknown,
    fallback: -1 | 0 | 1,
  ): -1 | 0 | 1 =>
    persisted === -1 || persisted === 0 || persisted === 1
      ? persisted
      : fallback;

  return {
    bassOctave: octave(
      record.bassOctave,
      initialTextureSettings.bassOctave,
    ),
    chordsOctave: octave(
      record.chordsOctave,
      initialTextureSettings.chordsOctave,
    ),
    melodyOctave: octave(
      record.melodyOctave,
      initialTextureSettings.melodyOctave,
    ),
    openChords: isBoolean(record.openChords)
      ? record.openChords
      : initialTextureSettings.openChords,
    melodyOctaveDouble: isBoolean(record.melodyOctaveDouble)
      ? record.melodyOctaveDouble
      : initialTextureSettings.melodyOctaveDouble,
  };
}

function migrateInstrumentSettings(value: unknown): InstrumentSettings {
  const record = isRecord(value) ? value : {};

  return {
    bassVoice: enumValue(
      record.bassVoice,
      bassVoices,
      initialInstrumentSettings.bassVoice,
    ),
    chordVoice: enumValue(
      record.chordVoice,
      chordVoices,
      initialInstrumentSettings.chordVoice,
    ),
    pianoTouch: enumValue(
      record.pianoTouch,
      pianoTouches,
      initialInstrumentSettings.pianoTouch,
    ),
  };
}

function migrateEqSettings(value: unknown): EqSettings {
  const record = isRecord(value) ? value : {};

  return Object.fromEntries(
    mixerTrackIds.map((track) => {
      const persisted = isRecord(record[track]) ? record[track] : {};
      const fallback = initialEqSettings[track];

      return [
        track,
        {
          frequency: finiteNumber(persisted.frequency) ?? fallback.frequency,
          gain: finiteNumber(persisted.gain) ?? fallback.gain,
          q: finiteNumber(persisted.q) ?? fallback.q,
        },
      ];
    }),
  ) as EqSettings;
}

function migrateSaturationSettings(value: unknown): SaturationSettings {
  const record = isRecord(value) ? value : {};

  return Object.fromEntries(
    mixerTrackIds.map((track) => {
      const persisted = isRecord(record[track]) ? record[track] : {};
      const fallback = initialSaturationSettings[track];

      return [
        track,
        {
          drive: finiteNumber(persisted.drive) ?? fallback.drive,
          wet: finiteNumber(persisted.wet) ?? fallback.wet,
        },
      ];
    }),
  ) as SaturationSettings;
}

function migrateSidechainSettings(value: unknown): SidechainSettings {
  const record = isRecord(value) ? value : {};

  return {
    enabled: isBoolean(record.enabled)
      ? record.enabled
      : initialSidechainSettings.enabled,
    amountDb:
      finiteNumber(record.amountDb) ?? initialSidechainSettings.amountDb,
    release: finiteNumber(record.release) ?? initialSidechainSettings.release,
  };
}

function migrateTrackWidths(value: unknown): StereoSettings["widths"] {
  const record = isRecord(value) ? value : {};

  return Object.fromEntries(
    mixerTrackIds.map((track) => [
      track,
      finiteNumber(record[track]) ?? initialStereoSettings.widths[track],
    ]),
  ) as StereoSettings["widths"];
}

function migrateStereoSettings(value: unknown): StereoSettings {
  const record = isRecord(value) ? value : {};

  return {
    widths: migrateTrackWidths(record.widths),
    monoAudition: isBoolean(record.monoAudition)
      ? record.monoAudition
      : initialStereoSettings.monoAudition,
    monoChecked: isBoolean(record.monoChecked)
      ? record.monoChecked
      : initialStereoSettings.monoChecked,
  };
}

function migrateReferenceMixSettings(value: unknown): ReferenceMixSettings {
  const record = isRecord(value) ? value : {};
  const persistedSnapshot = record.snapshot;
  let snapshot: ReferenceMixSettings["snapshot"] = null;

  if (isRecord(persistedSnapshot)) {
    snapshot = {
      mixerSettings: migrateMixerSettings(persistedSnapshot.mixerSettings),
      eqSettings: migrateEqSettings(persistedSnapshot.eqSettings),
      saturationSettings: migrateSaturationSettings(
        persistedSnapshot.saturationSettings,
      ),
      stereoWidths: migrateTrackWidths(persistedSnapshot.stereoWidths),
    };
  }

  return {
    snapshot,
    trimDb: finiteNumber(record.trimDb) ?? initialReferenceMixSettings.trimDb,
    comparisons:
      integer(record.comparisons) !== null && (record.comparisons as number) >= 0
        ? (record.comparisons as number)
        : initialReferenceMixSettings.comparisons,
    quietChecked: isBoolean(record.quietChecked)
      ? record.quietChecked
      : initialReferenceMixSettings.quietChecked,
  };
}

function migrateProjectMilestones(value: unknown): ProjectMilestones {
  const record = isRecord(value) ? value : {};

  return {
    exported: isBoolean(record.exported)
      ? record.exported
      : initialProjectMilestones.exported,
  };
}

function migrateVelocityLane(
  value: unknown,
  fallback: number[],
): number[] {
  return migrateNumberLane(value, fallback);
}

export function migrateGrooveFeelSettings(value: unknown): GrooveFeelSettings {
  const record = isRecord(value) ? value : {};
  const velocities = isRecord(record.velocities) ? record.velocities : {};

  return {
    swing:
      finiteNumber(record.swing) ?? initialGrooveFeelSettings.swing,
    velocities: {
      kick: migrateVelocityLane(
        velocities.kick,
        initialGrooveFeelSettings.velocities.kick,
      ),
      snare: migrateVelocityLane(
        velocities.snare,
        initialGrooveFeelSettings.velocities.snare,
      ),
      hat: migrateVelocityLane(
        velocities.hat,
        initialGrooveFeelSettings.velocities.hat,
      ),
    },
  };
}

export function migrateFormSettings(value: unknown): FormSettings {
  const record = isRecord(value) ? value : {};

  const sections =
    Array.isArray(record.sections) && record.sections.length === FORM_SECTIONS
      ? (record.sections.filter(
          (item): item is FormSectionLabel =>
            item === "A" || item === "A′" || item === "B" || item === "C",
        ).length === FORM_SECTIONS
          ? [...(record.sections as FormSectionLabel[])]
          : [...initialFormSettings.sections])
      : [...initialFormSettings.sections];

  const validRoles = new Set(["statement", "answer", "contrast", "return"]);
  const roles =
    Array.isArray(record.roles) &&
    record.roles.length === FORM_SECTIONS &&
    record.roles.every(
      (item) => typeof item === "string" && validRoles.has(item),
    )
      ? [...record.roles] as FormSettings["roles"]
      : [...initialFormSettings.roles];

  const layers =
    Array.isArray(record.layers) && record.layers.length === FORM_SECTIONS
      ? record.layers.map((entry, index) => {
          if (!isRecord(entry)) {
            return { ...initialFormSettings.layers[index] };
          }

          return {
            drums: isBoolean(entry.drums)
              ? entry.drums
              : initialFormSettings.layers[index].drums,
            bass: isBoolean(entry.bass)
              ? entry.bass
              : initialFormSettings.layers[index].bass,
            chords: isBoolean(entry.chords)
              ? entry.chords
              : initialFormSettings.layers[index].chords,
            melody: isBoolean(entry.melody)
              ? entry.melody
              : initialFormSettings.layers[index].melody,
          };
        })
      : initialFormSettings.layers.map((entry) => ({ ...entry }));

  return { sections, roles, layers };
}

export function migratePersistedStudioState(value: unknown) {
  const record = isRecord(value) ? value : {};
  const patterns = isRecord(record.patterns) ? record.patterns : {};
  const melody = migrateMidiLane(
    record.melody,
    initialMelody,
  ) as MelodySequence;
  const harmonySequence = migrateHarmonySequence(record.harmonySequence);
  const bassSequence = migrateMidiLane(
    record.bassSequence,
    initialBassSequence,
  ) as BassSequence;
  const legacyChordProgression = migrateChordProgression(
    record.chordProgression,
  );
  const inferredTonalContext = inferLegacyTonalContext(
    record.chordProgression,
    record.currentLessonId,
  );
  const tonalContext = sanitizeTonalContext(
    record.tonalContext,
    inferredTonalContext,
  );
  const harmonicProgression = Array.isArray(record.harmonicProgression)
    ? sanitizeHarmonicProgression(record.harmonicProgression)
    : migrateLegacyProgression(legacyChordProgression, inferredTonalContext);
  const chordProgression = progressionSymbols(
    harmonicProgression,
    migrationCompatibilityContext(tonalContext),
  ).map((symbol, index) =>
    symbol && chordNames.includes(symbol as (typeof chordNames)[number])
      ? (symbol as (typeof chordNames)[number])
      : legacyChordProgression[index] ?? null,
  ) as ChordProgression;

  return {
    bpm: Math.max(40, Math.min(240, finiteNumber(record.bpm) ?? 96)),
    activePattern: enumValue(record.activePattern, patternIds, "A"),
    patterns: {
      A: migrateStepPattern(patterns.A),
      B: migrateStepPattern(patterns.B),
    },
    selectedPitchClasses: Array.isArray(record.selectedPitchClasses)
      ? record.selectedPitchClasses.filter(
          (pitch): pitch is string => typeof pitch === "string",
        )
      : [],
    melody,
    melodyDurations: normalizeMonophonicDurations(
      melody,
      Array.isArray(record.melodyDurations)
        ? (record.melodyDurations as number[])
        : initialMelodyDurations,
    ),
    tonalContext,
    harmonicProgression,
    chordProgression,
    harmonySequence,
    harmonyDurations: normalizeHarmonyDurations(
      harmonySequence,
      Array.isArray(record.harmonyDurations)
        ? (record.harmonyDurations as Array<Record<string, number>>)
        : initialHarmonyDurations,
    ),
    accompanimentPattern: enumValue(
      record.accompanimentPattern,
      accompanimentPatterns,
      initialAccompanimentPattern,
    ),
    synthSettings: migrateSynthSettings(record.synthSettings),
    arrangement: migrateArrangement(record.arrangement),
    mixerSettings: migrateMixerSettings(record.mixerSettings),
    automationSettings: migrateAutomationSettings(record.automationSettings),
    dynamicsSettings: migrateDynamicsSettings(record.dynamicsSettings),
    effectsSettings: migrateEffectsSettings(record.effectsSettings),
    projectMilestones: migrateProjectMilestones(record.projectMilestones),
    voicingSettings: migrateVoicingSettings(record.voicingSettings),
    bassSequence,
    bassDurations: normalizeMonophonicDurations(
      bassSequence,
      Array.isArray(record.bassDurations)
        ? (record.bassDurations as number[])
        : initialBassDurations,
    ),
    grooveFeelSettings: migrateGrooveFeelSettings(record.grooveFeelSettings),
    formSettings: migrateFormSettings(record.formSettings),
    textureSettings: migrateTextureSettings(record.textureSettings),
    instrumentSettings: migrateInstrumentSettings(record.instrumentSettings),
    eqSettings: migrateEqSettings(record.eqSettings),
    saturationSettings: migrateSaturationSettings(record.saturationSettings),
    sidechainSettings: migrateSidechainSettings(record.sidechainSettings),
    stereoSettings: migrateStereoSettings(record.stereoSettings),
    referenceMixSettings: migrateReferenceMixSettings(
      record.referenceMixSettings,
    ),
    appMode: enumValue(
      record.appMode,
      ["learn", "create", "studio"] as const,
      "learn",
    ),
  };
}
