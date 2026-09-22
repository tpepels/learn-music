import { audioEngine } from "../audio/engine";
import {
  BASS_STEPS,
  bassPitches,
  bassRootMidi,
} from "../music/model";
import { useStudioStore } from "../state/studio";

export function BassWorkspace() {
  const sequence = useStudioStore((state) => state.bassSequence);
  const setBassStep = useStudioStore((state) => state.setBassStep);
  const progression = useStudioStore((state) => state.chordProgression);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  const choose = async (step: number, midi: number) => {
    setBassStep(step, midi);
    await audioEngine.playPianoNote(midi);
  };

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
          </div>
        </div>
        <span className="workspace-hint">
          One bass note per column. Strong beats are brighter; bar lines are heavier.
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

      <div className="bass-grid">
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
              const barStart = step % 8 === 0;
              const beat = step % 2 === 0;
              const playhead = isPlaying && currentStep === step;

              return (
                <button
                  key={step}
                  className={[
                    "bass-cell",
                    active ? "is-active" : "",
                    beat ? "is-beat" : "is-offbeat",
                    barStart ? "is-bar-start" : "",
                    playhead ? "is-playhead" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => choose(step, pitch.midi)}
                  aria-label={"Bass step " + (step + 1) + " " + pitch.name}
                  aria-pressed={active}
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
      </div>
    </div>
  );
}
