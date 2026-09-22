import { STEPS, trackNames, type PatternId, type TrackName } from "../music/model";
import { useStudioStore } from "../state/studio";

const trackLabels: Record<TrackName, string> = {
  kick: "Kick",
  snare: "Snare",
  hat: "Hi-hat",
};

function PatternSelector() {
  const activePattern = useStudioStore((state) => state.activePattern);
  const setActivePattern = useStudioStore((state) => state.setActivePattern);

  return (
    <div className="pattern-tabs" aria-label="Pattern comparison">
      {(["A", "B"] as PatternId[]).map((patternId) => (
        <button
          className={activePattern === patternId ? "pattern-tab is-active" : "pattern-tab"}
          key={patternId}
          onClick={() => setActivePattern(patternId)}
        >
          <span>Pattern</span>
          <strong>{patternId}</strong>
          <small>{patternId === "A" ? "reference" : "variation"}</small>
        </button>
      ))}
    </div>
  );
}

export function DrumWorkspace({
  title,
  compare,
}: {
  title: string;
  compare: boolean;
}) {
  const pattern = useStudioStore((state) => state.patterns[state.activePattern]);
  const activePattern = useStudioStore((state) => state.activePattern);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const toggleStep = useStudioStore((state) => state.toggleStep);

  const readOnly = compare && activePattern === "A";

  return (
    <>
      {compare && <PatternSelector />}

      <div className="sequencer" aria-label="16-step drum sequencer">
        <div className="sequencer-heading">
          <div>
            <span className="section-label">Drum machine · 16-step sequencer</span>
            <h2>{title}</h2>
            <div className="daw-strip">
              <span>PATTERN {activePattern}</span>
              <span>4/4</span>
              <span>GRID 1/16</span>
              <span>1 BAR</span>
            </div>
          </div>
          <div className="grid-key">
            {readOnly && <span className="reference-label">Reference · listen only</span>}
            <span><i className="key-dot active-dot" /> sound</span>
            <span><i className="key-dot play-dot" /> playhead</span>
          </div>
        </div>

        <div className="beat-row" aria-hidden="true">
          <span />
          {Array.from({ length: STEPS }, (_, step) => (
            <span className={step % 4 === 0 ? "beat-number" : ""} key={step}>
              {step % 4 === 0 ? step / 4 + 1 : ""}
            </span>
          ))}
        </div>

        {trackNames.map((track) => (
          <div className={"track-row track-" + track} key={track}>
            <div className="track-label">
              <strong>{trackLabels[track]}</strong>
              <span>{track === "kick" ? "low" : track === "snare" ? "mid" : "high"}</span>
            </div>

            {pattern[track].map((active, step) => {
              const playhead = isPlaying && currentStep === step;
              const classes = [
                "step",
                active ? "is-active" : "",
                playhead ? "is-playhead" : "",
                step % 4 === 0 ? "is-beat-start" : "",
              ].filter(Boolean).join(" ");

              return (
                <button
                  className={classes}
                  key={step}
                  aria-label={trackLabels[track] + " step " + (step + 1)}
                  aria-pressed={active}
                  disabled={readOnly}
                  onClick={() => toggleStep(track, step)}
                >
                  <span />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
