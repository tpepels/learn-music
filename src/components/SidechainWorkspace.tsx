import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

export function SidechainWorkspace() {
  const settings = useStudioStore((state) => state.sidechainSettings);
  const setSettings = useStudioStore((state) => state.setSidechainSettings);
  const kickCount = useStudioStore((state) => state.patterns.A.kick.filter(Boolean).length);

  return (
    <div className="advanced-production-card sidechain-workspace">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Sidechain ducking · kick → bass</span>
          <h2>Make two low-end events take turns</h2>
          <div className="daw-strip"><span>KEY INPUT</span><span>DUCK</span><span>RELEASE</span><span>PUMP</span></div>
        </div>
        <span className="workspace-hint">
          Every active kick temporarily turns the bass channel down, then the bass returns over the release time.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "bass", "chords", "melody"] as const} />

      <div className="sidechain-routing">
        <div className="sidechain-source">
          <span>KEY / TRIGGER</span>
          <strong>KICK</strong>
          <small>{kickCount} programmed hits</small>
        </div>
        <div className="sidechain-arrow">→</div>
        <div className="sidechain-compressor">
          <span>DUCK CONTROL</span>
          <strong>{settings.enabled ? "ACTIVE" : "BYPASSED"}</strong>
          <div className="duck-envelope">
            <i style={{ height: String(Math.max(6, settings.amountDb * 5)) + "px" }} />
            <b style={{ width: String(Math.max(20, settings.release * 170)) + "px" }} />
          </div>
        </div>
        <div className="sidechain-arrow">→</div>
        <div className="sidechain-target">
          <span>TARGET</span>
          <strong>BASS</strong>
          <small>volume recovers after each kick</small>
        </div>
      </div>

      <button
        className={settings.enabled ? "processor-bypass is-active" : "processor-bypass"}
        onClick={() => setSettings({ enabled: !settings.enabled })}
      >
        <span className="status-light" />
        SIDECHAIN {settings.enabled ? "ON" : "OFF"}
      </button>

      <div className="processor-controls two-up">
        <label>
          <span>DUCK AMOUNT</span>
          <strong>{settings.amountDb.toFixed(1)} dB</strong>
          <input type="range" min="0" max="12" step="0.5" value={settings.amountDb}
            onChange={(event) => setSettings({ amountDb: Number(event.target.value) })} />
          <small>How far the bass drops on each kick</small>
        </label>
        <label>
          <span>RELEASE</span>
          <strong>{Math.round(settings.release * 1000)} ms</strong>
          <input type="range" min="0.05" max="0.8" step="0.01" value={settings.release}
            onChange={(event) => setSettings({ release: Number(event.target.value) })} />
          <small>How quickly the bass returns</small>
        </label>
      </div>
    </div>
  );
}
