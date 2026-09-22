import { useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  accompanimentPatterns,
  basicChordNames,
  romanNumerals,
  type ChordName,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const accompanimentLabels = {
  block: ["Block", "all notes together"],
  pulse: ["Pulse", "repeat on the beat"],
  broken: ["Broken", "split the chord tones"],
  arpeggio: ["Arpeggio", "cycle one note at a time"],
} as const;

export function ChordWorkspace({ contextual = false }: { contextual?: boolean }) {
  const progression = useStudioStore((state) => state.chordProgression);
  const setChordSlot = useStudioStore((state) => state.setChordSlot);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const accompanimentPattern = useStudioStore((state) => state.accompanimentPattern);
  const setAccompanimentPattern = useStudioStore((state) => state.setAccompanimentPattern);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const chooseChord = async (chord: ChordName) => {
    setChordSlot(selectedSlot, chord);
    await audioEngine.playChord(chord);
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
            <span>KEY C MAJOR</span>
            <span>1 CHORD / BAR</span>
            <span>{contextual ? "GROOVE + BASS + MELODY" : "ROMAN NUMERALS"}</span>
          </div>
        </div>
        <span className="workspace-hint">
          {contextual
            ? "Keep the loop running while you change chords or accompaniment."
            : "Select a slot, then choose a chord."}
        </span>
      </div>

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
            <strong>{chord ?? "—"}</strong>
            <small>{chord ? romanNumerals[chord] : "choose chord"}</small>
          </button>
        ))}
      </div>

      <div className="chord-palette">
        {basicChordNames.map((chord) => (
          <button
            key={chord}
            onClick={() => chooseChord(chord)}
            className="chord-choice"
          >
            <strong>{chord}</strong>
            <span>{romanNumerals[chord]}</span>
          </button>
        ))}
      </div>

      <button
        className="chord-clear-button"
        onClick={() => setChordSlot(selectedSlot, null)}
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
        <strong>Roman numerals describe harmonic identity, not a playing pattern.</strong>
        <span>C is I in C major, F is IV, G is V, and A minor is vi.</span>
      </div>
    </div>
  );
}
