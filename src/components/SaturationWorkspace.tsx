import { useState } from "react";
import { mixerTrackIds, type MixerTrackId } from "../music/model";
import { useStudioStore } from "../state/studio";

const labels: Record<MixerTrackId, string> = {
  drums: "DRUMS",
  bass: "BASS",
  chords: "CHORDS",
  melody: "MELODY",
};

export function SaturationWorkspace() {
  const [track, setTrack] = useState<MixerTrackId>("bass");
  const settings = useStudioStore((state) => state.saturationSettings);
  const setTrackSettings = useStudioStore((state) => state.setSaturationTrack);
  const current = settings[track];
  const bend = Math.round(18 * current.drive);

  return (
    <div className="advanced-production-card saturation-workspace">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Saturation · nonlinear colour</span>
          <h2>Add harmonics without rewriting the part</h2>
          <div className="daw-strip"><span>DRIVE</span><span>WET / DRY</span><span>HARMONICS</span><span>LEVEL-MATCH</span></div>
        </div>
        <span className="workspace-hint">
          Drive changes how hard the signal hits the waveshaper. Wet controls how much processed signal is blended back in.
        </span>
      </div>

      <nav className="processor-track-tabs">
        {mixerTrackIds.map((id) => (
          <button key={id} className={track === id ? "is-active" : ""} onClick={() => setTrack(id)}>
            {labels[id]}
          </button>
        ))}
      </nav>

      <div className="saturation-display">
        <svg viewBox="0 0 360 120" aria-label="Saturation waveshaping diagram">
          <path d="M 18 60 C 70 8, 112 8, 160 60 S 250 112, 342 60" className="sat-wave is-dry" />
          <path
            d={"M 18 60 C 55 " + (28 - bend) + ", 92 " + (28 - bend) + ", 160 60 S 270 " + (92 + bend) + ", 342 60"}
            className="sat-wave is-driven"
          />
          <line x1="18" y1="60" x2="342" y2="60" className="sat-zero" />
        </svg>
        <div>
          <span>DRY SIGNAL</span>
          <span>SHAPED SIGNAL</span>
        </div>
      </div>

      <div className="processor-controls two-up">
        <label>
          <span>DRIVE</span>
          <strong>{Math.round(current.drive * 100)}%</strong>
          <input type="range" min="0" max="1" step="0.01" value={current.drive}
            onChange={(event) => setTrackSettings(track, { drive: Number(event.target.value) })} />
          <small>How strongly the waveform is bent</small>
        </label>
        <label>
          <span>WET / DRY</span>
          <strong>{Math.round(current.wet * 100)}% wet</strong>
          <input type="range" min="0" max="1" step="0.01" value={current.wet}
            onChange={(event) => setTrackSettings(track, { wet: Number(event.target.value) })} />
          <small>Parallel blend of distorted and clean signal</small>
        </label>
      </div>
    </div>
  );
}
