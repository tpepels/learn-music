import { audioEngine } from "../audio/engine";
import {
  MELODY_STEPS,
  chromaticPitches,
  isCMajorMidi,
  noteDurationLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import {
  findMonophonicNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";

const keyboardPitches = [...chromaticPitches]
  .filter((pitch) => pitch.midi < 72)
  .reverse();

export function PianoKeyWorkspace() {
  const selectedPitchClasses = useStudioStore((state) => state.selectedPitchClasses);
  const togglePitchClass = useStudioStore((state) => state.togglePitchClass);

  const choose = async (pitchClass: string, midi: number) => {
    togglePitchClass(pitchClass);
    await audioEngine.playPianoNote(midi);
  };

  return (
    <div className="piano-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">MIDI keyboard · one octave</span>
          <h2>Map C major</h2>
          <div className="daw-strip">
            <span>KEY C MAJOR</span>
            <span>OCTAVE 4</span>
            <span>NOTE AUDITION</span>
          </div>
        </div>
        <span className="workspace-hint">Click a key to select and hear it</span>
      </div>

      <div className="keyboard-strip" aria-label="Chromatic piano keyboard">
        {keyboardPitches.map((pitch) => {
          const selected = selectedPitchClasses.includes(pitch.pitchClass);
          return (
            <button
              key={pitch.midi}
              className={[
                "piano-key",
                pitch.black ? "black-key" : "white-key",
                selected ? "is-selected" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => choose(pitch.pitchClass, pitch.midi)}
              aria-pressed={selected}
            >
              <strong>{pitch.pitchClass}</strong>
              <span>{pitch.name}</span>
            </button>
          );
        })}
      </div>

      <div className="keyboard-note">
        <strong>Listen as well as look.</strong>
        <span>The exercise is about connecting the visual keyboard, note names, and the sound of the scale.</span>
      </div>
    </div>
  );
}

export function MelodyWorkspace({ title }: { title: string }) {
  const melody = useStudioStore((state) => state.melody);
  const durations = useStudioStore((state) => state.melodyDurations);
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);
  const setMelodyDuration = useStudioStore((state) => state.setMelodyDuration);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  const { beginNoteDrag, moveNoteDrag } = useNoteLengthDrag({
    maxSteps: MELODY_STEPS,
    addNote: (step, midi) => setMelodyStep(step, midi),
    removeNote: (step, midi) => setMelodyStep(step, midi),
    setDuration: (step, _midi, duration) =>
      setMelodyDuration(step, duration),
    audition: (midi) => audioEngine.playPianoNote(midi),
  });

  return (
    <div className="piano-card melody-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">MIDI clip · piano roll</span>
          <h2>{title}</h2>
          <div className="daw-strip">
            <span>KEY C MAJOR</span>
            <span>GRID 1/8</span>
            <span>2 BARS</span>
            <span>YOUR GROOVE</span>
          </div>
        </div>
        <span className="workspace-hint">Play loops the melody against the groove you built earlier · click for 1/8, drag right for longer notes</span>
      </div>

      <div className="melody-step-head" aria-hidden="true">
        <span />
        {Array.from({ length: MELODY_STEPS }, (_, step) => (
          <span
            key={step}
            className={step % 8 === 0 ? "phrase-start" : step % 2 === 0 ? "beat-tick" : ""}
          >
            {step + 1}
          </span>
        ))}
      </div>

      <div className="melody-grid" onPointerMove={moveNoteDrag}>
        {chromaticPitches.map((pitch) => (
          <div
            className={[
              "melody-row",
              pitch.black ? "is-black-row" : "",
              isCMajorMidi(pitch.midi) ? "is-key-row" : "",
            ].filter(Boolean).join(" ")}
            key={pitch.midi}
          >
            <button
              className="note-audition"
              onClick={() => audioEngine.playPianoNote(pitch.midi)}
              title={"Audition " + pitch.name}
            >
              {pitch.name}
            </button>

            {Array.from({ length: MELODY_STEPS }, (_, step) => {
              const active = melody[step] === pitch.midi;
              const coveringStart = findMonophonicNoteStart(
                melody,
                durations,
                pitch.midi,
                step,
              );
              const sustained =
                coveringStart !== null && coveringStart !== step;
              const duration =
                coveringStart === null ? 1 : durations[coveringStart] ?? 1;
              const noteEnd =
                coveringStart !== null &&
                coveringStart + duration - 1 === step;
              const playhead = isPlaying && currentStep === step;

              return (
                <button
                  key={step}
                  className={[
                    "melody-cell",
                    active ? "is-active is-note-start" : "",
                    sustained ? "is-sustain" : "",
                    noteEnd && duration > 1 ? "is-note-end" : "",
                    playhead ? "is-playhead" : "",
                    step === 8 ? "is-phrase-start" : "",
                  ].filter(Boolean).join(" ")}
                  data-note-step={step}
                  data-note-midi={pitch.midi}
                  onPointerDown={(event) =>
                    beginNoteDrag(event, {
                      step,
                      midi: pitch.midi,
                      isStart: active,
                      coveringStart,
                    })
                  }
                  aria-label={
                    (active || sustained ? "Note " : "Set ") +
                    pitch.name +
                    " at step " +
                    (step + 1) +
                    (active || sustained
                      ? " · length " + noteDurationLabel(duration)
                      : "")
                  }
                  aria-pressed={active || sustained}
                  title={
                    active || sustained
                      ? pitch.name +
                        " · " +
                        noteDurationLabel(duration) +
                        " · drag horizontally to resize"
                      : "Click or drag to draw " + pitch.name
                  }
                >
                  <span />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="grid-legend">
        <span><i className="legend-key key-note" /> C-major note</span>
        <span><i className="legend-key outside-note" /> note outside C major</span>
        <span>Columns 1–8 = phrase 1 · 9–16 = phrase 2</span>
        <span>Note length: 1 cell = 1/8 · 2 = 1/4 · 4 = 1/2 · 8 = 1 bar</span>
      </div>
    </div>
  );
}
