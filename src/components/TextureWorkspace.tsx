import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

const octaveLabels = {
  "-1": "LOWER",
  "0": "ORIGINAL",
  "1": "HIGHER",
} as const;

function RegisterControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: -1 | 0 | 1;
  onChange: (value: -1 | 0 | 1) => void;
}) {
  return (
    <section className="register-control">
      <span className="section-label">{label}</span>
      <strong>{octaveLabels[String(value) as "-1" | "0" | "1"]}</strong>
      <div>
        {([-1, 0, 1] as const).map((choice) => (
          <button
            key={choice}
            className={value === choice ? "is-active" : ""}
            onClick={() => onChange(choice)}
          >
            {choice === -1 ? "−12" : choice === 1 ? "+12" : "0"}
            <small>semitones</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function TextureWorkspace() {
  const settings = useStudioStore((state) => state.textureSettings);
  const setSettings = useStudioStore((state) => state.setTextureSettings);
  const arrangement = useStudioStore((state) => state.arrangement);

  const denseBars = arrangement.filter(
    (bar) => Object.values(bar).filter(Boolean).length >= 3,
  ).length;
  const sparseBars = arrangement.filter(
    (bar) => Object.values(bar).filter(Boolean).length <= 2,
  ).length;

  return (
    <div className="texture-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Texture + orchestration</span>
          <h2>Decide where each layer lives</h2>
          <div className="daw-strip">
            <span>REGISTER</span><span>SPACING</span><span>DOUBLING</span><span>DENSITY</span>
          </div>
        </div>
        <span className="workspace-hint">
          Change the register before reaching for EQ when two parts are fighting for the same musical space.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "bass", "chords", "melody"] as const} />

      <div className="register-stack">
        <RegisterControl
          label="Bass register"
          value={settings.bassOctave}
          onChange={(bassOctave) => setSettings({ bassOctave })}
        />
        <RegisterControl
          label="Chord register"
          value={settings.chordsOctave}
          onChange={(chordsOctave) => setSettings({ chordsOctave })}
        />
        <RegisterControl
          label="Melody register"
          value={settings.melodyOctave}
          onChange={(melodyOctave) => setSettings({ melodyOctave })}
        />
      </div>

      <div className="texture-switches">
        <button
          className={settings.openChords ? "is-active" : ""}
          onClick={() => setSettings({ openChords: !settings.openChords })}
        >
          <span className="texture-switch-light" />
          <div>
            <strong>OPEN CHORD VOICING</strong>
            <small>Raise the top chord voice one octave to increase vertical spacing.</small>
          </div>
          <b>{settings.openChords ? "ON" : "OFF"}</b>
        </button>

        <button
          className={settings.melodyOctaveDouble ? "is-active" : ""}
          onClick={() =>
            setSettings({ melodyOctaveDouble: !settings.melodyOctaveDouble })
          }
        >
          <span className="texture-switch-light" />
          <div>
            <strong>MELODY OCTAVE DOUBLE</strong>
            <small>Add the same melody one octave above for a larger, brighter foreground.</small>
          </div>
          <b>{settings.melodyOctaveDouble ? "ON" : "OFF"}</b>
        </button>
      </div>

      <div className="texture-density-readout">
        <article>
          <span>SPARSE BARS</span>
          <strong>{sparseBars}</strong>
          <small>0–2 active layers</small>
        </article>
        <article>
          <span>DENSE BARS</span>
          <strong>{denseBars}</strong>
          <small>3–4 active layers</small>
        </article>
        <article className="texture-space-map">
          <span>REGISTER MAP</span>
          <div>
            <i className="texture-melody">MELODY</i>
            <i className="texture-chords">CHORDS</i>
            <i className="texture-bass">BASS</i>
          </div>
        </article>
      </div>
    </div>
  );
}
