import { audioEngine } from "../audio/engine";
import {
  chordPitchClasses,
  chromaticPitches,
  isCMajorMidi,
} from "../music/model";
import { useStudioStore } from "../state/studio";

export function MelodyHarmonyWorkspace() {
  const melody = useStudioStore((state) => state.melody);
  const chords = useStudioStore((state) => state.chordProgression);
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);

  return (
    <div className="melody-harmony-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Melody + harmony overlay</span>
          <h2>See tension against each chord</h2>
          <div className="daw-strip">
            <span>CHORD TONE</span><span>SCALE TONE</span><span>CHROMATIC</span><span>RESOLUTION</span><span>YOUR GROOVE + CHORDS</span>
          </div>
        </div>
        <span className="workspace-hint">
          Play puts your melody over the current groove and chord progression, so tension and resolution are heard in context.
        </span>
      </div>

      <div className="harmony-overlay-header">
        <span />
        {chords.map((chord, index) => (
          <div key={index}>
            <small>STEPS {index * 4 + 1}–{index * 4 + 4}</small>
            <strong>{chord ?? "No chord"}</strong>
            <span>
              {chord
                ? chordPitchClasses(chord).join(" · ")
                : "set progression first"}
            </span>
          </div>
        ))}
      </div>

      <div className="melody-harmony-roll">
        {chromaticPitches.map((pitch) => (
          <div className={pitch.black ? "mh-row is-black" : "mh-row"} key={pitch.midi}>
            <button
              className="mh-note-name"
              onClick={() => audioEngine.playPianoNote(pitch.midi)}
            >
              {pitch.name}
            </button>
            {melody.map((note, step) => {
              const chord = chords[Math.floor(step / 4)];
              const active = note === pitch.midi;
              const chordTone = Boolean(
                chord &&
                  chordPitchClasses(chord).includes(
                    ((pitch.midi % 12) + 12) % 12,
                  ),
              );
              const scaleTone = isCMajorMidi(pitch.midi);
              const type = chordTone
                ? "is-chord-tone"
                : scaleTone
                  ? "is-scale-tone"
                  : "is-chromatic";

              return (
                <button
                  key={step}
                  className={[
                    "mh-cell",
                    type,
                    active ? "is-active" : "",
                    step % 4 === 0 ? "is-chord-start" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => setMelodyStep(step, active ? null : pitch.midi)}
                  aria-pressed={active}
                >
                  <span />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mh-legend">
        <span><i className="legend-chord-tone" /> chord tone</span>
        <span><i className="legend-scale-tone" /> in-key non-chord tone</span>
        <span><i className="legend-chromatic-tone" /> chromatic tension</span>
      </div>
    </div>
  );
}
