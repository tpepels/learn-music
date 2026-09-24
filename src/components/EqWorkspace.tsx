import { useState } from "react";
import { mixerTrackIds, type MixerTrackId } from "../music/model";
import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

const labels: Record<MixerTrackId, string> = {
  drums: "DRUMS",
  bass: "BASS",
  chords: "CHORDS",
  melody: "MELODY",
};

export function EqWorkspace() {
  const [track, setTrack] = useState<MixerTrackId>("chords");
  const mixer = useStudioStore((state) => state.mixerSettings);
  const eq = useStudioStore((state) => state.eqSettings);
  const setMixerTrack = useStudioStore((state) => state.setMixerTrack);
  const setEqTrack = useStudioStore((state) => state.setEqTrack);
  const band = eq[track];
  const highpass = mixer[track].highpass;

  const x = 8 + (Math.log10(band.frequency / 40) / Math.log10(12000 / 40)) * 84;
  const y = 50 - band.gain * 2.4;

  return (
    <div className="advanced-production-card eq-workspace">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Channel EQ · high-pass + parametric bell</span>
          <h2>Find the part of the sound you want to change</h2>
          <div className="daw-strip">
            <span>HPF</span><span>FREQUENCY</span><span>GAIN</span><span>Q</span>
          </div>
        </div>
        <span className="workspace-hint">
          Select a channel. The high-pass removes lows below a cutoff; the bell targets one frequency area with boost or cut.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "bass", "chords", "melody"] as const} />

      <nav className="processor-track-tabs">
        {mixerTrackIds.map((id) => (
          <button key={id} className={track === id ? "is-active" : ""} onClick={() => setTrack(id)}>
            {labels[id]}
          </button>
        ))}
      </nav>

      <div className="eq-display">
        <div className="eq-grid-lines" />
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-label="EQ response display">
          <path d={"M 0 50 L 7 50 Q 10 50 14 30 L 100 30"} className="eq-highpass-curve" />
          <path
            d={"M 0 30 C " + Math.max(0, x - 18) + " 30, " + Math.max(0, x - 10) + " " + y + ", " + x + " " + y + " C " + Math.min(100, x + 10) + " " + y + ", " + Math.min(100, x + 18) + " 30, 100 30"}
            className={band.gain >= 0 ? "eq-bell-curve is-boost" : "eq-bell-curve is-cut"}
          />
          <circle cx={x} cy={y} r="2.2" className="eq-node" />
        </svg>
        <div className="eq-frequency-axis">
          <span>40</span><span>100</span><span>250</span><span>1k</span><span>4k</span><span>12k Hz</span>
        </div>
      </div>

      <div className="processor-controls four-up">
        <label>
          <span>HIGH-PASS</span>
          <strong>{Math.round(highpass)} Hz</strong>
          <input type="range" min="20" max="400" step="5" value={highpass}
            onChange={(event) => setMixerTrack(track, { highpass: Number(event.target.value) })} />
          <small>Remove frequencies below this point</small>
        </label>
        <label>
          <span>FREQUENCY</span>
          <strong>{band.frequency >= 1000 ? (band.frequency / 1000).toFixed(1) + " kHz" : Math.round(band.frequency) + " Hz"}</strong>
          <input type="range" min="80" max="8000" step="20" value={band.frequency}
            onChange={(event) => setEqTrack(track, { frequency: Number(event.target.value) })} />
          <small>Where the bell is centred</small>
        </label>
        <label>
          <span>GAIN</span>
          <strong>{band.gain > 0 ? "+" : ""}{band.gain.toFixed(1)} dB</strong>
          <input type="range" min="-12" max="12" step="0.5" value={band.gain}
            onChange={(event) => setEqTrack(track, { gain: Number(event.target.value) })} />
          <small>Boost or cut that region</small>
        </label>
        <label>
          <span>Q / WIDTH</span>
          <strong>{band.q.toFixed(1)}</strong>
          <input type="range" min="0.4" max="8" step="0.1" value={band.q}
            onChange={(event) => setEqTrack(track, { q: Number(event.target.value) })} />
          <small>Higher Q = narrower target</small>
        </label>
      </div>
    </div>
  );
}
