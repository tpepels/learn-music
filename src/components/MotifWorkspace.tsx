import { audioEngine } from "../audio/engine";
import {
  MELODY_STEPS,
  chromaticPitches,
  noteDurationLabel,
  transposeMelodyNote,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import {
  findMonophonicNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";

const phraseBlocks = [
  { start: 0, end: 3, label: "MOTIF" },
  { start: 4, end: 7, label: "REPEAT" },
  { start: 8, end: 11, label: "DEVELOP" },
  { start: 12, end: 15, label: "ANSWER" },
] as const;

function sourceMotif(melody: Array<number | null>) {
  return melody.slice(0, 4);
}

export function MotifWorkspace() {
  const melody = useStudioStore((state) => state.melody);
  const durations = useStudioStore((state) => state.melodyDurations);
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

  const applyBlock = (
    start: number,
    transform: (note: number | null, index: number) => number | null,
  ) => {
    sourceMotif(melody).forEach((note, index) => {
      const target = transform(note, index);
      setMelodyStep(start + index, target);
      if (target !== null) {
        setMelodyDuration(start + index, durations[index] ?? 1);
      }
    });
  };

  const seedMotif = () => {
    [60, 64, 67, 64].forEach((note, index) => {
      setMelodyStep(index, note);
      setMelodyDuration(index, 1);
    });
  };

  return (
    <div className="motif-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Motif lab · MIDI phrase</span>
          <h2>Develop one small musical idea</h2>
          <div className="daw-strip">
            <span>MOTIF</span><span>REPEAT</span><span>TRANSPOSE</span><span>FRAGMENT / ANSWER</span>
          </div>
        </div>
        <span className="workspace-hint">
          The first four steps are the source. Pitch and note length both belong to the motif; drag horizontally to reshape the rhythm.
        </span>
      </div>

      <div className="motif-tools">
        <button onClick={seedMotif}>Seed C–E–G–E</button>
        <button onClick={() => applyBlock(4, (note) => note)}>Repeat → 5–8</button>
        <button
          onClick={() =>
            applyBlock(8, (note) =>
              note === null ? null : transposeMelodyNote(note, 2),
            )
          }
        >
          Transpose +2 → 9–12
        </button>
        <button
          onClick={() =>
            applyBlock(12, (note, index) =>
              index < 2 ? note : null,
            )
          }
        >
          Fragment → 13–16
        </button>
      </div>

      <div className="motif-block-labels" aria-hidden="true">
        <span />
        {phraseBlocks.map((block) => (
          <strong
            key={block.start}
            style={{ gridColumn: String(block.start + 2) + " / span 4" }}
          >
            {block.label}
          </strong>
        ))}
      </div>

      <div className="motif-roll" onPointerMove={moveNoteDrag}>
        {chromaticPitches.map((pitch) => (
          <div className={pitch.black ? "motif-row is-black" : "motif-row"} key={pitch.midi}>
            <button
              className="motif-note-name"
              onClick={() => audioEngine.playPianoNote(pitch.midi)}
            >
              {pitch.name}
            </button>
            {melody.map((note, step) => {
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

              return (
                <button
                  key={step}
                  className={[
                    "motif-cell",
                    active ? "is-active is-note-start" : "",
                    sustained ? "is-sustain" : "",
                    noteEnd && duration > 1 ? "is-note-end" : "",
                    step % 4 === 0 ? "is-block-start" : "",
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
    </div>
  );
}
