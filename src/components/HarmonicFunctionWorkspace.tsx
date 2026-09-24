import { audioEngine } from "../audio/engine";
import {
  basicHarmonyPalette,
  chordSymbol,
  harmonicFunction,
  romanNumeral,
  type HarmonicChord,
} from "../music/harmony";
import { useStudioStore } from "../state/studio";
import { HarmonyKeyControl } from "./HarmonyKeyControl";

const functionLabels = {
  tonic: "TONIC",
  predominant: "PREDOMINANT",
  dominant: "DOMINANT",
  "secondary-dominant": "SECONDARY DOMINANT",
  borrowed: "BORROWED",
} as const;

export function HarmonicFunctionWorkspace() {
  const progression = useStudioStore((state) => state.harmonicProgression);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setHarmonicSlot = useStudioStore((state) => state.setHarmonicSlot);
  const palette = basicHarmonyPalette(tonalContext);

  const choose = async (slot: number, chord: HarmonicChord) => {
    setHarmonicSlot(slot, chord);
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
          Chord symbols name the absolute harmony; Roman numerals and function keep the musical role stable across keys.
        </span>
      </div>

      <HarmonyKeyControl />

      <div className="function-slots">
        {progression.map((chord, slot) => (
          <section className="function-slot" key={slot}>
            <header>
              <span>SLOT {slot + 1}</span>
              <strong>{chord ? chordSymbol(chord, tonalContext) : "—"}</strong>
              <small>{chord ? romanNumeral(chord, tonalContext) : "choose chord"}</small>
            </header>

            <div className="function-current">
              <span>FUNCTION</span>
              <strong>
                {chord ? functionLabels[harmonicFunction(chord)] : "—"}
              </strong>
            </div>

            <div className="function-choice-grid">
              {palette.map((choice) => {
                const symbol = chordSymbol(choice, tonalContext);
                const numeral = romanNumeral(choice, tonalContext);
                const active =
                  chord &&
                  romanNumeral(chord, tonalContext) === numeral &&
                  chordSymbol(chord, tonalContext) === symbol;
                return (
                  <button
                    key={numeral + ":" + symbol}
                    className={active ? "is-active" : ""}
                    onClick={() => void choose(slot, choice)}
                  >
                    <strong>{symbol}</strong>
                    <span>{numeral}</span>
                    <small>{functionLabels[harmonicFunction(choice)]}</small>
                  </button>
                );
              })}
            </div>
            <button
              className="chord-clear-button"
              onClick={() => setHarmonicSlot(slot, null)}
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
