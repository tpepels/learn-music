import { audioEngine } from "../audio/engine";
import {
  BASS_STEPS,
  bassPitches,
  bassRootMidi,
  noteDurationLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import {
  findMonophonicNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";

export function BassWorkspace() {
  const sequence = useStudioStore((state) => state.bassSequence);
  const durations = useStudioStore((state) => state.bassDurations);
  const setBassStep = useStudioStore((state) => state.setBassStep);
  const setBassDuration = useStudioStore((state) => state.setBassDuration);
  const progression = useStudioStore((state) => state.chordProgression);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  const { beginNoteDrag, moveNoteDrag } = useNoteLengthDrag({
    maxSteps: BASS_STEPS,
    addNote: (step, midi) => setBassStep(step, midi),
    removeNote: (step, midi) => setBassStep(step, midi),
    setDuration: (step, _midi, duration) => setBassDuration(step, duration),
    audition: (midi) => audioEngine.playPianoNote(midi),
  });

  return (
    <div className="bass-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Bass MIDI clip · four bars</span>
          <h2>Connect harmony to the groove</h2>
          <div className="daw-strip">
            <span>GRID 1/8</span>
            <span>4 BARS</span>
            <span>CHORD ROOTS</span>
            <span>APPROACH NOTES</span>
            <span>YOUR GROOVE + HARMONY</span>
          </div>
        </div>
        <span className="workspace-hint">
          Play keeps your groove and harmony running while you add the bass line underneath them. Drag notes right to sustain them.
        </span>
      </div>

      <div className="bass-chord-header">
        <span />
        {progression.map((chord, bar) => (
          <div key={bar}>
            <small>BAR {bar + 1}</small>
            <strong>{chord ?? "—"}</strong>
            <span>{chord ? "root " + bassRootMidi(chord) : "set chord first"}</span>
          </div>
        ))}
      </div>

      <div className="bass-grid" onPointerMove={moveNoteDrag}>
        {bassPitches.map((pitch) => (
          <div
            key={pitch.midi}
            className={pitch.inCMajor ? "bass-row is-key-row" : "bass-row"}
          >
            <button
              className="bass-note-label"
              onClick={() => audioEngine.playPianoNote(pitch.midi)}
            >
              <strong>{pitch.name}</strong>
              <span>{pitch.inCMajor ? "key" : "chromatic"}</span>
            </button>

            {Array.from({ length: BASS_STEPS }, (_, step) => {
              const active = sequence[step] === pitch.midi;
              const coveringStart = findMonophonicNoteStart(
                sequence,
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
              const barStart = step % 8 === 0;
              const beat = step % 2 === 0;
              const playhead = isPlaying && currentStep === step;

              return (
                <button
                  key={step}
                  className={[
                    "bass-cell",
                    active ? "is-active is-note-start" : "",
                    sustained ? "is-sustain" : "",
                    noteEnd && duration > 1 ? "is-note-end" : "",
                    beat ? "is-beat" : "is-offbeat",
                    barStart ? "is-bar-start" : "",
                    playhead ? "is-playhead" : "",
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
                    "Bass step " +
                    (step + 1) +
                    " " +
                    pitch.name +
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

      <div className="bass-grid-legend">
        <span><i className="legend-key key-note" /> C-major pitch</span>
        <span><i className="legend-key outside-note" /> chromatic pitch</span>
        <span>Bright columns = beats · darker columns = eighth-note offbeats</span>
        <span>Length: 1 cell = 1/8 · 2 = 1/4 · 4 = 1/2 · 8 = 1 bar</span>
      </div>
    </div>
  );
}
