import { useState } from "react";
import { trackNames, type TrackName } from "../music/model";
import { useStudioStore } from "../state/studio";

const labels: Record<TrackName, string> = {
  kick: "KICK",
  snare: "SNARE",
  hat: "HI-HAT",
};

export function GrooveFeelWorkspace() {
  const [selectedTrack, setSelectedTrack] = useState<TrackName>("hat");
  const activePattern = useStudioStore((state) => state.activePattern);
  const pattern = useStudioStore((state) => state.patterns[state.activePattern]);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const groove = useStudioStore((state) => state.grooveFeelSettings);
  const toggleStep = useStudioStore((state) => state.toggleStep);
  const setGrooveVelocity = useStudioStore((state) => state.setGrooveVelocity);
  const setSwing = useStudioStore((state) => state.setSwing);

  return (
    <div className="groove-feel-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Drum clip · feel editor</span>
          <h2>Make the grid breathe</h2>
          <div className="daw-strip">
            <span>PATTERN {activePattern}</span>
            <span>VELOCITY</span>
            <span>ACCENTS</span>
            <span>SWING 1/8</span>
          </div>
        </div>
        <span className="workspace-hint">
          Click steps to add/remove hits. Select a track, then shape the velocity lane below.
        </span>
      </div>

      <div className="feel-step-header" aria-hidden="true">
        <span />
        {Array.from({ length: 16 }, (_, step) => (
          <span key={step} className={step % 4 === 0 ? "is-beat" : ""}>
            {step + 1}
          </span>
        ))}
      </div>

      <div className="feel-pattern-grid">
        {trackNames.map((track) => (
          <div className="feel-track-row" key={track}>
            <button
              className={selectedTrack === track ? "feel-track-name is-selected" : "feel-track-name"}
              onClick={() => setSelectedTrack(track)}
            >
              <strong>{labels[track]}</strong>
              <small>{selectedTrack === track ? "editing velocity" : "select"}</small>
            </button>

            {pattern[track].map((active, step) => (
              <button
                key={step}
                className={[
                  "feel-step",
                  active ? "is-active" : "",
                  isPlaying && currentStep === step ? "is-playhead" : "",
                  step % 4 === 0 ? "is-beat" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => toggleStep(track, step)}
                aria-label={labels[track] + " step " + (step + 1)}
                aria-pressed={active}
              >
                <span />
              </button>
            ))}
          </div>
        ))}
      </div>

      <section className="velocity-panel">
        <header>
          <div>
            <span className="section-label">MIDI velocity lane</span>
            <strong>{labels[selectedTrack]}</strong>
            <small>Higher bars = stronger hits · inactive steps have no note</small>
          </div>
          <output>
            avg{" "}
            {Math.round(
              (groove.velocities[selectedTrack].reduce(
                (sum, velocity, step) =>
                  sum + (pattern[selectedTrack][step] ? velocity : 0),
                0,
              ) /
                Math.max(
                  1,
                  pattern[selectedTrack].filter(Boolean).length,
                )) *
                127,
            )}
          </output>
        </header>

        <div className="velocity-lane">
          {groove.velocities[selectedTrack].map((velocity, step) => {
            const active = pattern[selectedTrack][step];
            return (
              <label
                key={step}
                className={[
                  "velocity-step",
                  active ? "is-active" : "",
                  step % 4 === 0 ? "is-beat" : "",
                ].filter(Boolean).join(" ")}
              >
                <div className="velocity-meter">
                  <span style={{ height: active ? (velocity * 100) + "%" : "0%" }} />
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={velocity}
                  disabled={!active}
                  aria-label={labels[selectedTrack] + " velocity step " + (step + 1)}
                  onChange={(event) =>
                    setGrooveVelocity(
                      selectedTrack,
                      step,
                      Number(event.target.value),
                    )
                  }
                />
                <small>{active ? Math.round(velocity * 127) : "—"}</small>
              </label>
            );
          })}
        </div>
      </section>

      <section className="swing-panel">
        <div>
          <span className="section-label">Timing feel</span>
          <strong>SWING</strong>
          <p>
            Swing delays every second eighth-note subdivision. At 0% the grid is straight;
            moderate values create a long-short pulse without moving the visible notes.
          </p>
        </div>

        <label>
          <strong>{Math.round(groove.swing * 100)}%</strong>
          <input
            type="range"
            min="0"
            max="0.6"
            step="0.01"
            value={groove.swing}
            onChange={(event) => setSwing(Number(event.target.value))}
          />
          <span>STRAIGHT</span>
          <span>SWUNG</span>
        </label>
      </section>
    </div>
  );
}
