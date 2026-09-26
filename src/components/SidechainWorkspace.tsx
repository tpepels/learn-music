import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

export function SidechainWorkspace() {
  const settings = useStudioStore((state) => state.sidechainSettings);
  const setSettings = useStudioStore((state) => state.setSidechainSettings);
  const kick = useStudioStore((state) => state.patterns.A.kick);
  const toggleStep = useStudioStore((state) => state.toggleStep);
  const kickCount = kick.filter(Boolean).length;

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

      <section className="sequencer sidechain-trigger-editor" aria-label="Pattern A kick trigger">
        <div className="sequencer-heading">
          <div>
            <span className="section-label">Sidechain trigger · Pattern A</span>
            <h3>Kick key input</h3>
          </div>
          <small>Add or move kicks here while the loop runs. These are the events that make the bass duck.</small>
        </div>
        <div className="beat-row" aria-hidden="true">
          <span />
          {kick.map((_, step) => (
            <span className={step % 4 === 0 ? "beat-number" : ""} key={step}>
              {step % 4 === 0 ? step / 4 + 1 : ""}
            </span>
          ))}
        </div>
        <div className="track-row track-kick">
          <div className="track-label">
            <strong>Kick</strong>
            <span>key input</span>
          </div>
          {kick.map((active, step) => (
            <button
              className={[
                "step",
                active ? "is-active" : "",
                step % 4 === 0 ? "is-beat-start" : "",
              ].filter(Boolean).join(" ")}
              key={step}
              aria-label={"Sidechain kick step " + (step + 1)}
              aria-pressed={active}
              onClick={() => toggleStep("kick", step)}
            >
              <span />
            </button>
          ))}
        </div>
      </section>

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
