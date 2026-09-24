import {
  keyLabel,
  tonicName,
  type PitchClass,
} from "../music/harmony";
import { useStudioStore } from "../state/studio";
import { ChordWorkspace } from "./ChordWorkspace";
import { MelodyWorkspace } from "./PianoWorkspace";

const transposeTargets: PitchClass[] = [0, 2, 3];

export function TranspositionWorkspace() {
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const transposeProjectToTonic = useStudioStore(
    (state) => state.transposeProjectToTonic,
  );

  return (
    <div className="transposition-workspace">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Key · function · transposition</span>
          <h2>Move the music without changing its relationships</h2>
          <div className="daw-strip">
            <span>{keyLabel(tonalContext).toUpperCase()}</span>
            <span>ROMAN NUMERALS = IDENTITY</span>
            <span>CHORD SYMBOLS = ABSOLUTE PITCH</span>
          </div>
        </div>
        <span className="workspace-hint">
          The key control below changes harmonic spelling. The transpose buttons move the written melody, harmony notes and bass by the same interval as well.
        </span>
      </div>

      <div className="chord-note">
        <strong>Transpose the whole project</strong>
        <span>
          Use this only when the exercise asks you to move the written MIDI material together with the harmonic key.
        </span>
      </div>
      <div className="chord-palette" role="group" aria-label="Transpose whole project">
        {transposeTargets.map((tonic) => (
          <button
            key={tonic}
            className={tonalContext.tonic === tonic ? "chord-choice is-selected" : "chord-choice"}
            onClick={() => transposeProjectToTonic(tonic)}
          >
            <strong>{tonicName({ tonic, mode: tonalContext.mode })}</strong>
            <span>transpose project</span>
          </button>
        ))}
      </div>

      <ChordWorkspace contextual />
      <MelodyWorkspace title="Melody to transpose" />
    </div>
  );
}
