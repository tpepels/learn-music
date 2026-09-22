import {
  activeLayerCount,
  arrangementLayers,
  type ArrangementLayer,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const labels: Record<ArrangementLayer, { name: string; role: string }> = {
  drums: { name: "Drums", role: "pulse + groove" },
  bass: { name: "Bass", role: "low-end foundation" },
  chords: { name: "Chords", role: "harmony" },
  melody: { name: "Melody", role: "foreground line" },
};

export function ArrangementWorkspace() {
  const arrangement = useStudioStore((state) => state.arrangement);
  const toggleArrangementLayer = useStudioStore((state) => state.toggleArrangementLayer);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  return (
    <div className="arrangement-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">DAW arrangement view · eight bars</span>
          <h2>Arrange the track</h2>
          <div className="daw-strip">
            <span>4 TRACKS</span>
            <span>8 BARS</span>
            <span>CLIP VIEW</span>
            <span>SECTION A / B</span>
          </div>
        </div>
        <span className="workspace-hint">Each column is one bar. Add or remove layers to shape energy over time.</span>
      </div>

      <div className="arrangement-head" aria-hidden="true">
        <span />
        {arrangement.map((_, bar) => (
          <span
            key={bar}
            className={isPlaying && currentStep === bar ? "is-playhead" : ""}
          >
            {bar + 1}
          </span>
        ))}
      </div>

      <div className="arrangement-grid">
        {arrangementLayers.map((layer) => (
          <div className="arrangement-row" key={layer}>
            <div className="arrangement-label">
              <strong>{labels[layer].name}</strong>
              <span>{labels[layer].role}</span>
            </div>

            {arrangement.map((bar, barIndex) => (
              <button
                key={barIndex}
                className={[
                  "arrangement-cell",
                  bar[layer] ? "is-active" : "",
                  isPlaying && currentStep === barIndex ? "is-playhead" : "",
                  barIndex === 4 ? "is-section-start" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => toggleArrangementLayer(barIndex, layer)}
                aria-pressed={bar[layer]}
                aria-label={labels[layer].name + ", bar " + (barIndex + 1)}
              >
                <span />
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="energy-profile">
        <span className="section-label">Layer density</span>
        <div className="energy-bars">
          {arrangement.map((bar, index) => {
            const count = activeLayerCount(bar);
            return (
              <div key={index} title={"Bar " + (index + 1) + ": " + count + " active layers"}>
                <span style={{ height: Math.max(8, count * 22) + "%" }} />
                <small>{index + 1}</small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
