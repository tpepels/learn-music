import { audioEngine } from "../audio/engine";
import {
  chordFunction,
  basicChordNames,
  romanNumerals,
  type ChordName,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const functionLabels = {
  tonic: "TONIC",
  predominant: "PREDOMINANT",
  dominant: "DOMINANT",
  "secondary-dominant": "SECONDARY DOMINANT",
  borrowed: "BORROWED",
} as const;

export function HarmonicFunctionWorkspace() {
  const progression = useStudioStore((state) => state.chordProgression);
  const setChordSlot = useStudioStore((state) => state.setChordSlot);

  const choose = async (slot: number, chord: ChordName) => {
    setChordSlot(slot, chord);
    await audioEngine.playChord(chord);
  };

  return (
    <div className="harmonic-function-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Chord function · four-slot progression</span>
          <h2>Hear what each harmony is doing</h2>
          <div className="daw-strip">
            <span>TONIC</span><span>PREDOMINANT</span><span>DOMINANT</span><span>RESOLUTION</span>
          </div>
        </div>
        <span className="workspace-hint">
          Chord symbols name the harmony; function describes its role in creating stability, departure, tension, and return.
        </span>
      </div>

      <div className="function-slots">
        {progression.map((chord, slot) => (
          <section className="function-slot" key={slot}>
            <header>
              <span>SLOT {slot + 1}</span>
              <strong>{chord ?? "—"}</strong>
              <small>{chord ? romanNumerals[chord] : "choose chord"}</small>
            </header>

            <div className="function-current">
              <span>FUNCTION</span>
              <strong>
                {chord ? functionLabels[chordFunction[chord]] : "—"}
              </strong>
            </div>

            <div className="function-choice-grid">
              {basicChordNames.map((choice) => (
                <button
                  key={choice}
                  className={progression[slot] === choice ? "is-active" : ""}
                  onClick={() => choose(slot, choice)}
                >
                  <strong>{choice}</strong>
                  <span>{romanNumerals[choice]}</span>
                  <small>{functionLabels[chordFunction[choice]]}</small>
                </button>
              ))}
            </div>
            <button
              className="chord-clear-button"
              onClick={() => setChordSlot(slot, null)}
              disabled={chord === null}
            >
              Clear chord
            </button>
          </section>
        ))}
      </div>

      <div className="function-flow">
        <span className="function-node tonic">TONIC<br /><small>home</small></span>
        <b>→</b>
        <span className="function-node predominant">PREDOMINANT<br /><small>departure</small></span>
        <b>→</b>
        <span className="function-node dominant">DOMINANT<br /><small>tension</small></span>
        <b>→</b>
        <span className="function-node tonic">TONIC<br /><small>return</small></span>
      </div>
    </div>
  );
}
