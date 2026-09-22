import { audioEngine } from "../audio/engine";
import {
  MELODY_STEPS,
  chordPitchClasses,
  chromaticPitches,
  isCMajorMidi,
  noteDurationLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import {
  findMonophonicNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";

export function MelodyHarmonyWorkspace() {
  const melody = useStudioStore((state) => state.melody);
  const durations = useStudioStore((state) => state.melodyDurations);
  const chords = useStudioStore((state) => state.chordProgression);
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);
  const setMelodyDuration = useStudioStore((state) => state.setMelodyDuration);

  const { beginNoteDrag, moveNoteDrag } = useNoteLengthDrag({
    maxSteps: MELODY_STEPS,
    addNote: (step, midi) => setMelodyStep(step, midi),
    removeNote: (step, midi) => setMelodyStep(step, midi),
    setDuration: (step, _midi, duration) =>
      setMelodyDuration(step, duration),
    audition: (midi) => audioEngine.playPianoNote(midi),
  });

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
          Play puts your melody over the current groove and chord progression. Drag notes horizontally to shape how long tension and resolution last.
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

      <div className="melody-harmony-roll" onPointerMove={moveNoteDrag}>
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
                    active ? "is-active is-note-start" : "",
                    sustained ? "is-sustain" : "",
                    noteEnd && duration > 1 ? "is-note-end" : "",
                    step % 4 === 0 ? "is-chord-start" : "",
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

      <div className="mh-legend">
        <span><i className="legend-chord-tone" /> chord tone</span>
        <span><i className="legend-scale-tone" /> in-key non-chord tone</span>
        <span><i className="legend-chromatic-tone" /> chromatic tension</span>
        <span>Drag right to lengthen a note in 1/8 steps</span>
      </div>
    </div>
  );
}
