import { useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  HARMONY_STEPS,
  basicChordNames,
  chordPitchClasses,
  harmonyPitches,
  midiNoteName,
  romanNumerals,
  type ChordName,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const lessonChords = basicChordNames.filter((chord) => chord !== "D7");

export function HarmonySequencerWorkspace() {
  const progression = useStudioStore((state) => state.chordProgression);
  const harmonySequence = useStudioStore((state) => state.harmonySequence);
  const setChordSlot = useStudioStore((state) => state.setChordSlot);
  const toggleHarmonyNote = useStudioStore((state) => state.toggleHarmonyNote);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const chooseChord = async (chord: ChordName) => {
    setChordSlot(selectedSlot, chord);
    await audioEngine.playChord(chord);
  };

  const toggleNote = async (step: number, midi: number) => {
    const active = harmonySequence[step]?.includes(midi) ?? false;
    toggleHarmonyNote(step, midi);
    if (!active) {
      await audioEngine.playPianoNote(midi);
    }
  };

  return (
    <div className="harmony-sequencer-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Harmony MIDI clip · four bars</span>
          <h2>Write the chord part</h2>
          <div className="daw-strip">
            <span>KEY C MAJOR</span>
            <span>GRID 1/8</span>
            <span>POLYPHONIC</span>
            <span>32 STEPS</span>
          </div>
        </div>
        <span className="workspace-hint">
          Choose the chord above each bar, then place the notes yourself.
        </span>
      </div>

      <div className="harmony-chord-slots">
        {progression.map((chord, index) => (
          <button
            key={index}
            className={[
              "harmony-chord-slot",
              selectedSlot === index ? "is-selected" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => setSelectedSlot(index)}
          >
            <span>Bar {index + 1}</span>
            <strong>{chord ?? "—"}</strong>
            <small>{chord ? romanNumerals[chord] : "choose harmony"}</small>
          </button>
        ))}
      </div>

      <div className="harmony-chord-palette">
        {lessonChords.map((chord) => (
          <button
            key={chord}
            onClick={() => chooseChord(chord)}
            className={
              progression[selectedSlot] === chord ? "is-selected" : ""
            }
          >
            <strong>{chord}</strong>
            <span>{romanNumerals[chord]}</span>
          </button>
        ))}
      </div>

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

      <div className="harmony-roll" aria-label="Four-bar chord-note sequencer">
        {harmonyPitches.map((midi) => (
          <div className="harmony-roll-row" key={midi}>
            <button
              className="harmony-note-label"
              onClick={() => audioEngine.playPianoNote(midi)}
              title={"Audition " + midiNoteName(midi)}
            >
              {midiNoteName(midi)}
            </button>

            {Array.from({ length: HARMONY_STEPS }, (_, step) => {
              const chord = progression[Math.floor(step / 8)];
              const pitchClass = ((midi % 12) + 12) % 12;
              const chordTone = Boolean(
                chord && chordPitchClasses(chord).includes(pitchClass),
              );
              const active = harmonySequence[step]?.includes(midi) ?? false;
              const playhead = isPlaying && currentStep === step;

              return (
                <button
                  key={step}
                  className={[
                    "harmony-roll-cell",
                    chordTone ? "is-chord-tone" : "is-outside-tone",
                    active ? "is-active" : "",
                    playhead ? "is-playhead" : "",
                    step % 8 === 0 ? "is-bar-start" : "",
                    step % 2 === 0 ? "is-beat" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => toggleNote(step, midi)}
                  aria-label={
                    "Toggle " +
                    midiNoteName(midi) +
                    " at bar " +
                    (Math.floor(step / 8) + 1) +
                    ", eighth " +
                    ((step % 8) + 1) +
                    (chordTone ? " (chord tone)" : " (outside chord)")
                  }
                  aria-pressed={active}
                >
                  <span />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="harmony-roll-legend">
        <span><i className="is-chord-tone" /> note belongs to this bar's chord</span>
        <span><i className="is-active" /> note you wrote</span>
        <span>Each bar has eight eighth-note positions; stack notes or spread them through time.</span>
      </div>
    </div>
  );
}
