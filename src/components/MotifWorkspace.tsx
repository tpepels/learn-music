import { audioEngine } from "../audio/engine";
import {
  chromaticPitches,
  transposeMelodyNote,
} from "../music/model";
import { useStudioStore } from "../state/studio";

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
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);

  const applyBlock = (
    start: number,
    transform: (note: number | null, index: number) => number | null,
  ) => {
    sourceMotif(melody).forEach((note, index) => {
      setMelodyStep(start + index, transform(note, index));
    });
  };

  const seedMotif = () => {
    [60, 64, 67, 64].forEach((note, index) => setMelodyStep(index, note));
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
          The first four steps are the source. Build later material from that identity rather than starting over each time.
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

      <div className="motif-roll">
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
              return (
                <button
                  key={step}
                  className={[
                    "motif-cell",
                    active ? "is-active" : "",
                    step % 4 === 0 ? "is-block-start" : "",
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
    </div>
  );
}
