import { useMemo } from "react";
import { useStudioStore } from "../state/studio";

function pointsToPolyline(
  values: number[],
  min: number,
  max: number,
  width = 700,
  height = 150,
) {
  return values
    .map((value, index) => {
      const x = 20 + (index / Math.max(1, values.length - 1)) * (width - 40);
      const normalized = (value - min) / (max - min);
      const y = height - 20 - normalized * (height - 40);
      return x + "," + y;
    })
    .join(" ");
}

function AutomationLane({
  title,
  subtitle,
  values,
  min,
  max,
  step,
  unit,
  onChange,
  className,
}: {
  title: string;
  subtitle: string;
  values: number[];
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (index: number, value: number) => void;
  className: string;
}) {
  const points = useMemo(
    () => pointsToPolyline(values, min, max),
    [values, min, max],
  );

  return (
    <section className={"automation-lane " + className}>
      <header>
        <div>
          <span className="section-label">Automation lane</span>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>
        <div className="automation-mode">READ</div>
      </header>

      <div className="automation-editor">
        <svg
          className="automation-curve"
          viewBox="0 0 700 150"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="20" y1="130" x2="680" y2="130" className="automation-axis" />
          <line x1="20" y1="20" x2="20" y2="130" className="automation-axis" />
          {Array.from({ length: 8 }, (_, index) => {
            const x = 20 + (index / 7) * 660;
            return (
              <line
                key={index}
                x1={x}
                y1="20"
                x2={x}
                y2="130"
                className="automation-grid-line"
              />
            );
          })}
          <polyline points={points} className="automation-polyline" />
          {values.map((value, index) => {
            const [x, y] = points.split(" ")[index].split(",");
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="6"
                className="automation-point"
              />
            );
          })}
        </svg>

        <div className="automation-sliders">
          {values.map((value, index) => (
            <label key={index}>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                aria-label={title + " bar " + (index + 1)}
                onChange={(event) => onChange(index, Number(event.target.value))}
              />
              <span>BAR {index + 1}</span>
              <output>
                {Math.round(value)}
                {unit}
              </output>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AutomationDynamicsWorkspace() {
  const automation = useStudioStore((state) => state.automationSettings);
  const dynamics = useStudioStore((state) => state.dynamicsSettings);
  const setAutomationPoint = useStudioStore((state) => state.setAutomationPoint);
  const setDynamicsSettings = useStudioStore((state) => state.setDynamicsSettings);

  const compressionAmount = Math.max(
    0,
    Math.min(100, ((-dynamics.threshold - 6) / 24) * dynamics.ratio * 7),
  );

  return (
    <div className="automation-dynamics-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">DAW automation + dynamics</span>
          <h2>Make parameters move over time</h2>
          <div className="daw-strip signal-strip">
            <span>ARRANGEMENT</span>
            <b>→</b>
            <span>AUTOMATION</span>
            <b>→</b>
            <span>CHANNEL</span>
            <b>→</b>
            <span>COMPRESSOR</span>
          </div>
        </div>
        <span className="workspace-hint">
          Play the eight-bar arrangement while reshaping curves and compressor timing.
        </span>
      </div>

      <div className="automation-stack">
        <AutomationLane
          title="Melody volume"
          subtitle="Fader movement written into the timeline"
          values={automation.melodyVolumeDb}
          min={-18}
          max={3}
          step={1}
          unit=" dB"
          className="automation-volume"
          onChange={(index, value) =>
            setAutomationPoint("melodyVolumeDb", index, value)
          }
        />

        <AutomationLane
          title="Chord filter cutoff"
          subtitle="Low-pass sweep written into the timeline"
          values={automation.chordFilterHz}
          min={400}
          max={12000}
          step={100}
          unit=" Hz"
          className="automation-filter"
          onChange={(index, value) =>
            setAutomationPoint("chordFilterHz", index, value)
          }
        />
      </div>

      <section className="compressor-panel">
        <header>
          <div>
            <span className="section-label">Drum bus insert</span>
            <strong>COMPRESSOR</strong>
            <small>Control peaks · reshape punch</small>
          </div>

          <div className="gain-reduction-meter" aria-label="Compression intensity">
            <span style={{ width: compressionAmount + "%" }} />
            <b>GR</b>
          </div>
        </header>

        <div className="compressor-controls">
          <label>
            <span>THRESHOLD</span>
            <strong>{dynamics.threshold.toFixed(0)} dB</strong>
            <input
              type="range"
              min="-36"
              max="-4"
              step="1"
              value={dynamics.threshold}
              onChange={(event) =>
                setDynamicsSettings({ threshold: Number(event.target.value) })
              }
            />
            <small>Where compression starts</small>
          </label>

          <label>
            <span>RATIO</span>
            <strong>{dynamics.ratio.toFixed(1)}:1</strong>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={dynamics.ratio}
              onChange={(event) =>
                setDynamicsSettings({ ratio: Number(event.target.value) })
              }
            />
            <small>How strongly peaks are reduced</small>
          </label>

          <label>
            <span>ATTACK</span>
            <strong>{Math.round(dynamics.attack * 1000)} ms</strong>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={dynamics.attack}
              onChange={(event) =>
                setDynamicsSettings({ attack: Number(event.target.value) })
              }
            />
            <small>How quickly compression grabs</small>
          </label>

          <label>
            <span>RELEASE</span>
            <strong>{Math.round(dynamics.release * 1000)} ms</strong>
            <input
              type="range"
              min="0.04"
              max="0.8"
              step="0.01"
              value={dynamics.release}
              onChange={(event) =>
                setDynamicsSettings({ release: Number(event.target.value) })
              }
            />
            <small>How quickly it lets go</small>
          </label>
        </div>

        <div className="transient-diagram">
          <div>
            <span className="transient-raw" />
            <small>TRANSIENT</small>
          </div>
          <b>→</b>
          <div>
            <span
              className="transient-compressed"
              style={{
                transform:
                  "scaleY(" +
                  Math.max(0.35, 1 - compressionAmount / 150).toFixed(2) +
                  ")",
              }}
            />
            <small>AFTER COMPRESSION</small>
          </div>
        </div>
      </section>
    </div>
  );
}
