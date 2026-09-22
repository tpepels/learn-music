import { useState } from "react";
import { audioEngine } from "../audio/engine";
import {
  HARMONY_STEPS,
  aMinorRomanNumerals,
  basicChordNames,
  borrowedChordNames,
  borrowedRomanNumerals,
  chordPitchClasses,
  harmonyPitches,
  midiNoteName,
  minorKeyChordNames,
  romanNumerals,
  seventhChordNames,
  seventhRomanNumerals,
  type ChordName,
} from "../music/model";
import { useStudioStore } from "../state/studio";

export type HarmonySequencerMode =
  | "basic"
  | "function"
  | "minor"
  | "sevenths"
  | "borrowed";

function harmonyNoteName(midi: number, mode: HarmonySequencerMode): string {
  const pitchClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  if (mode === "minor" && pitchClass === 8) return "G♯" + octave;
  return midiNoteName(midi);
}

const configs: Record<
  HarmonySequencerMode,
  {
    eyebrow: string;
    title: string;
    keyLabel: string;
    palette: readonly ChordName[];
    numeral: Partial<Record<ChordName, string>>;
    contextLabel: string;
    hint: string;
  }
> = {
  basic: {
    eyebrow: "Harmony MIDI clip · four bars",
    title: "Write the chord part",
    keyLabel: "KEY C MAJOR",
    palette: basicChordNames.filter((chord) => chord !== "D7"),
    numeral: romanNumerals,
    contextLabel: "YOUR GROOVE + MELODY",
    hint: "Play uses the groove and melody you already made. Set a harmonic target, then write the notes that make it real.",
  },
  function: {
    eyebrow: "Harmonic function · four bars",
    title: "Make function audible in the part",
    keyLabel: "FUNCTION IN C",
    palette: basicChordNames,
    numeral: romanNumerals,
    contextLabel: "YOUR GROOVE + MELODY",
    hint: "The same groove and melody stay in place while you change what the harmony is doing underneath them.",
  },
  minor: {
    eyebrow: "A-minor harmony · four bars",
    title: "Write the minor progression",
    keyLabel: "KEY A MINOR",
    palette: minorKeyChordNames,
    numeral: aMinorRomanNumerals,
    contextLabel: "YOUR GROOVE + MINOR MELODY",
    hint: "Your groove and minor melody stay in place. Write the harmony underneath them, including G♯ when E7 needs it.",
  },
  sevenths: {
    eyebrow: "Seventh-chord MIDI clip · four bars",
    title: "Write the extra chord tones",
    keyLabel: "SEVENTH CHORDS",
    palette: seventhChordNames,
    numeral: seventhRomanNumerals,
    contextLabel: "YOUR GROOVE",
    hint: "The groove stays as context while you focus on the added seventh. The previous minor melody is left out here so it cannot confuse the C-major harmony.",
  },
  borrowed: {
    eyebrow: "Modal mixture · four bars",
    title: "Write the borrowed colour",
    keyLabel: "HOME C MAJOR",
    palette: borrowedChordNames,
    numeral: borrowedRomanNumerals,
    contextLabel: "YOUR GROOVE",
    hint: "The groove stays as context while the inherited minor melody stays out. That leaves the borrowed C-major colour clear.",
  },
};

export function HarmonySequencerWorkspace({
  mode = "basic",
}: {
  mode?: HarmonySequencerMode;
}) {
  const progression = useStudioStore((state) => state.chordProgression);
  const harmonySequence = useStudioStore((state) => state.harmonySequence);
  const setChordSlot = useStudioStore((state) => state.setChordSlot);
  const toggleHarmonyNote = useStudioStore((state) => state.toggleHarmonyNote);
  const clearHarmonyBar = useStudioStore((state) => state.clearHarmonyBar);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const config = configs[mode];

  const chooseChord = async (chord: ChordName) => {
    setChordSlot(selectedSlot, chord);
    await audioEngine.playChordPreview(chord);
  };

  const selectSlot = async (index: number) => {
    setSelectedSlot(index);
    const chord = progression[index];
    if (chord) {
      await audioEngine.playChordPreview(chord);
    }
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
          <span className="section-label">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <div className="daw-strip">
            <span>{config.keyLabel}</span>
            <span>GRID 1/8</span>
            <span>POLYPHONIC</span>
            <span>32 STEPS</span>
            <span>{config.contextLabel}</span>
          </div>
        </div>
        <span className="workspace-hint">{config.hint}</span>
      </div>

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
            <strong>{chord ?? "—"}</strong>
            <small>
              {chord
                ? config.numeral[chord] ?? romanNumerals[chord] ?? "colour"
                : "choose harmony"}
            </small>
          </button>
        ))}
      </div>

      <div className="harmony-chord-palette">
        {config.palette.map((chord) => (
          <button
            key={chord}
            onClick={() => void chooseChord(chord)}
            className={progression[selectedSlot] === chord ? "is-selected" : ""}
            aria-label={
              "Set bar " +
              (selectedSlot + 1) +
              " to " +
              chord +
              " and preview the chord"
            }
          >
            <strong>{chord}</strong>
            <span>{config.numeral[chord] ?? romanNumerals[chord] ?? "—"}</span>
            <small>set + hear</small>
          </button>
        ))}
      </div>

      <div className="harmony-target-note">
        <strong>Chord buttons set the target for bar {selectedSlot + 1} and play it once.</strong>
        <span>
          They change the label and highlighted chord tones. They never write or replace your MIDI notes.
        </span>
      </div>

      <div className="harmony-clear-actions">
        <button
          onClick={() => setChordSlot(selectedSlot, null)}
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

        <div className="harmony-roll" aria-label="Four-bar chord-note sequencer">
          {harmonyPitches.map((midi) => (
            <div className="harmony-roll-row" key={midi}>
              <button
                className="harmony-note-label"
                onClick={() => audioEngine.playPianoNote(midi)}
                title={"Audition " + harmonyNoteName(midi, mode)}
              >
                {harmonyNoteName(midi, mode)}
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
                      harmonyNoteName(midi, mode) +
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
      </div>

      <div className="harmony-roll-legend">
        <span><i className="is-chord-tone" /> note belongs to this bar&apos;s chord</span>
        <span><i className="is-active" /> note you wrote</span>
        <span>Wrong notes are not blocked. Put one in, hear the clash, and remove it if you do not want it.</span>
      </div>
    </div>
  );
}
