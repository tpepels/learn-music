import { useEffect, useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  basicHarmonyPalette,
  borrowedMajorPalette,
  chordSymbol,
  diatonicPalette,
  harmonicChordPitchClasses,
  keyLabel,
  minorHarmonyPalette,
  romanNumeral,
  type HarmonicChord,
  type TonalContext,
  type TonalMode,
} from "../music/harmony";
import {
  HARMONY_STEPS,
  harmonyPitches,
  midiNoteName,
  noteDurationLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";
import {
  findHarmonyNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";
import { HarmonyKeyControl } from "./HarmonyKeyControl";

export type HarmonySequencerMode =
  | "basic"
  | "function"
  | "minor"
  | "sevenths"
  | "borrowed"
  | "jazz";

const JAZZ_SHARP_NAMES = [
  "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B",
] as const;
const JAZZ_FLAT_NAMES = [
  "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B",
] as const;
const JAZZ_DUAL_NAMES: Partial<Record<number, string>> = {
  1: "C♯/D♭",
  3: "D♯/E♭",
  6: "F♯/G♭",
  8: "G♯/A♭",
  10: "A♯/B♭",
};

function harmonyNoteName(
  midi: number,
  mode: HarmonySequencerMode,
  tonalContext?: TonalContext,
  showTargets = true,
): string {
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;

  if (mode === "jazz") {
    if (!showTargets && JAZZ_DUAL_NAMES[pitchClass]) {
      return JAZZ_DUAL_NAMES[pitchClass] + String(octave);
    }

    const flatKey = tonalContext
      ? [1, 3, 5, 8, 10].includes(tonalContext.tonic)
      : false;
    const names = flatKey ? JAZZ_FLAT_NAMES : JAZZ_SHARP_NAMES;
    return names[pitchClass] + String(octave);
  }

  if (mode === "minor" && pitchClass === 8) return "G♯" + octave;
  return midiNoteName(midi);
}

const configs: Record<
  HarmonySequencerMode,
  {
    eyebrow: string;
    title: string;
    contextLabel: string;
    hint: string;
  }
> = {
  basic: {
    eyebrow: "Harmony MIDI clip · four bars",
    title: "Write the chord part",
    contextLabel: "YOUR GROOVE + MELODY",
    hint: "Play uses the groove and melody you already made. Set a harmonic target, then write the notes that make it real.",
  },
  function: {
    eyebrow: "Harmonic function · four bars",
    title: "Make function audible in the part",
    contextLabel: "YOUR GROOVE + MELODY",
    hint: "The same groove and melody stay in place while you change what the harmony is doing underneath them.",
  },
  minor: {
    eyebrow: "Minor harmony · four bars",
    title: "Write the minor progression",
    contextLabel: "YOUR GROOVE + MINOR MELODY",
    hint: "Use a minor tonal context, then write the harmony underneath it. A dominant seventh may raise scale degree 7.",
  },
  sevenths: {
    eyebrow: "Seventh-chord MIDI clip · four bars",
    title: "Write the extra chord tones",
    contextLabel: "YOUR GROOVE",
    hint: "The groove stays as context while you focus on the added seventh and its voice-leading.",
  },
  borrowed: {
    eyebrow: "Modal mixture · four bars",
    title: "Write the borrowed colour",
    contextLabel: "YOUR GROOVE",
    hint: "Keep a major tonic while borrowing iv or ♭VII from the parallel minor.",
  },
  jazz: {
    eyebrow: "Jazz piano study · four bars",
    title: "Build and hear the voicing",
    contextLabel: "PIANO ONLY",
    hint: "Use the grid as a keyboard study: place the notes, keep the voicing in a playable register, then listen before judging it.",
  },
};

export function HarmonySequencerWorkspace({
  mode = "basic",
  showTargets = true,
}: {
  mode?: HarmonySequencerMode;
  showTargets?: boolean;
}) {
  const progression = useStudioStore((state) => state.harmonicProgression);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setTonalContext = useStudioStore((state) => state.setTonalContext);
  const harmonySequence = useStudioStore((state) => state.harmonySequence);
  const harmonyDurations = useStudioStore((state) => state.harmonyDurations);
  const setHarmonicSlot = useStudioStore((state) => state.setHarmonicSlot);
  const toggleHarmonyNote = useStudioStore((state) => state.toggleHarmonyNote);
  const setHarmonyDuration = useStudioStore((state) => state.setHarmonyDuration);
  const clearHarmonyBar = useStudioStore((state) => state.clearHarmonyBar);
  const clearHarmonySequence = useStudioStore((state) => state.clearHarmonySequence);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const config = configs[mode];

  useEffect(() => {
    if (mode === "minor" && tonalContext.mode === "major") {
      setTonalContext({ tonic: 9, mode: "natural-minor" });
    } else if (
      (mode === "sevenths" || mode === "borrowed" || mode === "jazz") &&
      tonalContext.mode !== "major"
    ) {
      setTonalContext({ tonic: 0, mode: "major" });
    }
  }, [mode, setTonalContext]);

  const palette: HarmonicChord[] =
    mode === "minor"
      ? minorHarmonyPalette(tonalContext)
      : mode === "sevenths" || mode === "jazz"
        ? diatonicPalette(tonalContext, true)
        : mode === "borrowed"
          ? borrowedMajorPalette(tonalContext)
          : mode === "function"
            ? basicHarmonyPalette(tonalContext)
            : diatonicPalette(tonalContext);

  const allowedModes: readonly TonalMode[] =
    mode === "minor"
      ? ["natural-minor", "harmonic-minor"]
      : mode === "borrowed" || mode === "jazz"
        ? ["major"]
        : ["major", "natural-minor", "harmonic-minor"];

  const chooseChord = async (chord: HarmonicChord) => {
    setHarmonicSlot(selectedSlot, chord);
    await audioEngine.playChordPreview(chord);
  };

  const selectSlot = async (index: number) => {
    setSelectedSlot(index);
    const chord = progression[index];
    if (chord) {
      await audioEngine.playChordPreview(chord);
    }
  };

  const { beginNoteDrag, moveNoteDrag } = useNoteLengthDrag({
    maxSteps: HARMONY_STEPS,
    addNote: (step, midi) => toggleHarmonyNote(step, midi),
    removeNote: (step, midi) => toggleHarmonyNote(step, midi),
    setDuration: (step, midi, duration) =>
      setHarmonyDuration(step, midi, duration),
    audition: (midi) => audioEngine.playPianoNote(midi),
  });

  return (
    <div className="harmony-sequencer-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <div className="daw-strip">
            {mode === "jazz" && !showTargets
              ? <span>FREE PIANO GRID</span>
              : <span>KEY {keyLabel(tonalContext).toUpperCase()}</span>}
            <span>GRID 1/8</span>
            <span>POLYPHONIC</span>
            <span>32 STEPS</span>
            <span>{config.contextLabel}</span>
          </div>
        </div>
        <span className="workspace-hint">{config.hint}</span>
      </div>

      <LayerVolumeStrip
              tracks={
                mode === "jazz"
                  ? (["chords"] as const)
                  : mode === "sevenths" || mode === "borrowed"
                    ? (["drums", "chords"] as const)
                    : (["drums", "chords", "melody"] as const)
              }
            />

      {showTargets ? <HarmonyKeyControl modes={allowedModes} /> : null}

      {showTargets ? (
        <>
        <div className="harmony-chord-slots">
          {progression.map((chord, index) => (
            <button
              key={index}
              className={[
                "harmony-chord-slot",
                selectedSlot === index ? "is-selected" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => void selectSlot(index)}
            >
              <span>Bar {index + 1}</span>
              <strong>{chord ? chordSymbol(chord, tonalContext) : "—"}</strong>
              <small>
                {chord ? romanNumeral(chord, tonalContext) : "choose harmony"}
              </small>
            </button>
          ))}
        </div>
  
        <div className="harmony-chord-palette">
          {palette.map((chord) => {
            const symbol = chordSymbol(chord, tonalContext);
            const numeral = romanNumeral(chord, tonalContext);
            const selected = progression[selectedSlot];
            const isSelected =
              selected &&
              chordSymbol(selected, tonalContext) === symbol &&
              romanNumeral(selected, tonalContext) === numeral;
            return (
              <button
                key={numeral + ":" + symbol}
                onClick={() => void chooseChord(chord)}
                className={isSelected ? "is-selected" : ""}
                aria-label={
                  "Set bar " +
                  (selectedSlot + 1) +
                  " to " +
                  symbol +
                  " (" +
                  numeral +
                  ") and preview the chord"
                }
              >
                <strong>{symbol}</strong>
                <span>{numeral}</span>
                <small>set + hear</small>
              </button>
            );
          })}
        </div>
  
        <div className="harmony-target-note">
          <strong>Chord buttons set the target for bar {selectedSlot + 1} and play it once.</strong>
          <span>
            They change the label and highlighted chord tones. They never write or replace your MIDI notes.
          </span>
        </div>
  
        <div className="harmony-clear-actions">
          <button
            onClick={() => setHarmonicSlot(selectedSlot, null)}
            disabled={progression[selectedSlot] === null}
          >
            Clear chord
          </button>
          <button
            onClick={() => clearHarmonyBar(selectedSlot)}
            disabled={harmonySequence
              .slice(selectedSlot * 8, selectedSlot * 8 + 8)
              .every((notes) => notes.length === 0)}
          >
            Clear notes in bar {selectedSlot + 1}
          </button>
        </div>
  
          </>
      ) : (
        <div className="harmony-clear-actions">
          <button
            onClick={clearHarmonySequence}
            disabled={harmonySequence.every((notes) => notes.length === 0)}
          >
            Clear piano study
          </button>
        </div>
      )}

      <div className="harmony-roll-scroll">
        <div className="harmony-roll-header">
          <span />
          {Array.from({ length: HARMONY_STEPS }, (_, step) => (
            <span
              key={step}
              className={[
                step % 8 === 0 ? "is-bar-start" : "",
                step % 2 === 0 ? "is-beat" : "",
              ].filter(Boolean).join(" ")}
            >
              {step % 8 === 0 ? String(Math.floor(step / 8) + 1) : "·"}
            </span>
          ))}
        </div>

        <div
          className="harmony-roll"
          aria-label="Four-bar chord-note sequencer"
          onPointerMove={moveNoteDrag}
        >
          {harmonyPitches.map((midi) => (
            <div className="harmony-roll-row" key={midi}>
              <button
                className="harmony-note-label"
                onClick={() => audioEngine.playPianoNote(midi)}
                title={"Audition " + harmonyNoteName(midi, mode, tonalContext, showTargets)}
              >
                {harmonyNoteName(midi, mode, tonalContext, showTargets)}
              </button>

              {Array.from({ length: HARMONY_STEPS }, (_, step) => {
                const chord = showTargets
                  ? progression[Math.floor(step / 8)]
                  : null;
                const pitchClass = ((midi % 12) + 12) % 12;
                const chordTone = Boolean(
                  chord && harmonicChordPitchClasses(chord, tonalContext).includes(pitchClass),
                );
                const active = harmonySequence[step]?.includes(midi) ?? false;
                const coveringStart = findHarmonyNoteStart(
                  harmonySequence,
                  harmonyDurations,
                  midi,
                  step,
                );
                const sustained =
                  coveringStart !== null && coveringStart !== step;
                const duration =
                  coveringStart === null
                    ? 1
                    : harmonyDurations[coveringStart]?.[midi] ?? 1;
                const noteEnd =
                  coveringStart !== null &&
                  coveringStart + duration - 1 === step;
                const playhead = isPlaying && currentStep === step;

                return (
                  <button
                    key={step}
                    className={[
                      "harmony-roll-cell",
                      chordTone ? "is-chord-tone" : "is-outside-tone",
                      active ? "is-active is-note-start" : "",
                      sustained ? "is-sustain" : "",
                      noteEnd && duration > 1 ? "is-note-end" : "",
                      playhead ? "is-playhead" : "",
                      step % 8 === 0 ? "is-bar-start" : "",
                      step % 2 === 0 ? "is-beat" : "",
                    ].filter(Boolean).join(" ")}
                    data-note-step={step}
                    data-note-midi={midi}
                    onPointerDown={(event) =>
                      beginNoteDrag(event, {
                        step,
                        midi,
                        isStart: active,
                        coveringStart,
                      })
                    }
                    aria-label={
                      harmonyNoteName(midi, mode, tonalContext, showTargets) +
                      " at bar " +
                      (Math.floor(step / 8) + 1) +
                      ", eighth " +
                      ((step % 8) + 1) +
                      (active || sustained
                        ? " · length " + noteDurationLabel(duration)
                        : "") +
                      (chordTone ? " (chord tone)" : " (outside chord)")
                    }
                    aria-pressed={active || sustained}
                    title={
                      active || sustained
                        ? harmonyNoteName(midi, mode, tonalContext, showTargets) +
                          " · " +
                          noteDurationLabel(duration) +
                          " · drag horizontally to resize"
                        : "Click or drag to draw " + harmonyNoteName(midi, mode, tonalContext, showTargets)
                    }
                  >
                    <span />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="harmony-roll-legend">
        <span><i className="is-chord-tone" /> note belongs to this bar&apos;s chord</span>
        <span><i className="is-active" /> note you wrote</span>
        <span>Drag horizontally to set length: 1 cell = 1/8 · 2 = 1/4 · 4 = 1/2 · 8 = 1 bar</span>
        <span>Wrong notes are not blocked. Put one in, hear the clash, and remove it if you do not want it.</span>
      </div>
    </div>
  );
}
