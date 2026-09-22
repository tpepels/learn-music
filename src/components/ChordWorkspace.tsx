import { useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  chordNames,
  romanNumerals,
  type ChordName,
} from "../music/model";
import { useStudioStore } from "../state/studio";

export function ChordWorkspace() {
  const progression = useStudioStore((state) => state.chordProgression);
  const setChordSlot = useStudioStore((state) => state.setChordSlot);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const chooseChord = async (chord: ChordName) => {
    setChordSlot(selectedSlot, chord);
    await audioEngine.playChord(chord);
  };

  return (
    <div className="chord-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Four bars · one chord per bar</span>
          <h2>Build the progression</h2>
        </div>
        <span className="workspace-hint">Select a slot, then choose a chord</span>
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
        {chordNames.map((chord) => (
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

      <div className="chord-note">
        <strong>Roman numerals stay tied to the key.</strong>
        <span>C is I in C major, F is IV, G is V, and A minor is vi.</span>
      </div>
    </div>
  );
}
