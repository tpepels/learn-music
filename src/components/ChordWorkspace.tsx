import { useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  basicHarmonyPalette,
  chordSymbol,
  keyLabel,
  romanNumeral,
  type HarmonicChord,
} from "../music/harmony";
import { accompanimentPatterns } from "../music/model";
import { useStudioStore } from "../state/studio";
import { HarmonyKeyControl } from "./HarmonyKeyControl";

const accompanimentLabels = {
  block: ["Block", "all notes together"],
  pulse: ["Pulse", "repeat on the beat"],
  broken: ["Broken", "split the chord tones"],
  arpeggio: ["Arpeggio", "cycle one note at a time"],
} as const;

export function ChordWorkspace({ contextual = false }: { contextual?: boolean }) {
  const progression = useStudioStore((state) => state.harmonicProgression);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setHarmonicSlot = useStudioStore((state) => state.setHarmonicSlot);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const accompanimentPattern = useStudioStore((state) => state.accompanimentPattern);
  const setAccompanimentPattern = useStudioStore((state) => state.setAccompanimentPattern);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const palette = basicHarmonyPalette(tonalContext);

  const chooseChord = async (chord: HarmonicChord) => {
    setHarmonicSlot(selectedSlot, chord);
    await audioEngine.playChordPreview(chord);
  };

  return (
    <div className="chord-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">
            {contextual ? "Song phrase · four bars" : "Chord track · four bars"}
          </span>
          <h2>{contextual ? "Shape the harmony inside the phrase" : "Build the progression"}</h2>
          <div className="daw-strip">
            <span>KEY {keyLabel(tonalContext).toUpperCase()}</span>
            <span>1 CHORD / BAR</span>
            <span>{contextual ? "GROOVE + BASS + MELODY" : "SYMBOL + FUNCTION"}</span>
          </div>
        </div>
        <span className="workspace-hint">
          {contextual
            ? "Keep the loop running while you change chords or accompaniment."
            : "Select a slot, then choose a harmonic function."}
        </span>
      </div>

      <HarmonyKeyControl />

      <div className="chord-slots">
        {progression.map((chord, index) => (
          <button
            key={index}
            className={[
              "chord-slot",
              selectedSlot === index ? "is-selected" : "",
              isPlaying && currentStep === index ? "is-playhead" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => setSelectedSlot(index)}
          >
            <span>Bar {index + 1}</span>
            <strong>{chord ? chordSymbol(chord, tonalContext) : "—"}</strong>
            <small>{chord ? romanNumeral(chord, tonalContext) : "choose chord"}</small>
          </button>
        ))}
      </div>

      <div className="chord-palette">
        {palette.map((chord) => {
          const symbol = chordSymbol(chord, tonalContext);
          const numeral = romanNumeral(chord, tonalContext);
          return (
            <button
              key={numeral + ":" + symbol}
              onClick={() => void chooseChord(chord)}
              className="chord-choice"
            >
              <strong>{symbol}</strong>
              <span>{numeral}</span>
            </button>
          );
        })}
      </div>

      <button
        className="chord-clear-button"
        onClick={() => setHarmonicSlot(selectedSlot, null)}
        disabled={progression[selectedSlot] === null}
      >
        Clear selected chord
      </button>

      <div className="accompaniment-strip">
        <div className="chord-note">
          <strong>Accompaniment</strong>
          <span>The chord stays the same; only how its notes are performed changes.</span>
        </div>
        <div className="accompaniment-options" role="group" aria-label="Chord accompaniment pattern">
          {accompanimentPatterns.map((pattern) => (
            <button
              key={pattern}
              className={pattern === accompanimentPattern ? "is-selected" : ""}
              aria-pressed={pattern === accompanimentPattern}
              onClick={() => setAccompanimentPattern(pattern)}
            >
              <strong>{accompanimentLabels[pattern][0]}</strong>
              <span>{accompanimentLabels[pattern][1]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="chord-note">
        <strong>Chord symbol and harmonic identity are separate.</strong>
        <span>
          Change the tonic: the absolute chord names move, while I, IV, V and the other scale-degree functions stay attached to the progression.
        </span>
      </div>
    </div>
  );
}
