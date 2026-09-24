import { useEffect, useRef } from "react";
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

type PaintGesture = {
  layer: ArrangementLayer;
  enabled: boolean;
};

export function ArrangementWorkspace() {
  const arrangement = useStudioStore((state) => state.arrangement);
  const melody = useStudioStore((state) => state.melody);
  const setArrangementLayer = useStudioStore(
    (state) => state.setArrangementLayer,
  );
  const toggleArrangementLayer = useStudioStore(
    (state) => state.toggleArrangementLayer,
  );
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const paintGesture = useRef<PaintGesture | null>(null);
  const hasWrittenMelody = melody.some((note) => note !== null);

  useEffect(() => {
    const finishPaint = () => {
      paintGesture.current = null;
    };

    window.addEventListener("pointerup", finishPaint);
    window.addEventListener("pointercancel", finishPaint);
    return () => {
      window.removeEventListener("pointerup", finishPaint);
      window.removeEventListener("pointercancel", finishPaint);
    };
  }, []);

  const beginPaint = (
    barIndex: number,
    layer: ArrangementLayer,
    currentlyEnabled: boolean,
    button: number,
  ) => {
    if (button !== 0) return;

    const enabled = !currentlyEnabled;
    paintGesture.current = { layer, enabled };
    setArrangementLayer(barIndex, layer, enabled);
  };

  const continuePaint = (
    barIndex: number,
    layer: ArrangementLayer,
    buttons: number,
  ) => {
    const gesture = paintGesture.current;
    if (!gesture || gesture.layer !== layer || (buttons & 1) !== 1) return;
    setArrangementLayer(barIndex, layer, gesture.enabled);
  };

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
            <span className={isPlaying ? "is-live" : ""}>
              {isPlaying ? "LIVE EDIT" : "CLICK + DRAG"}
            </span>
          </div>
        </div>
        <span className="workspace-hint">
          {isPlaying
            ? "Edits are live. A changed cell affects playback from the next scheduled step."
            : "Click one cell, or drag across a row to paint or erase several bars."}
        </span>
      </div>

      <div className="arrangement-section-labels" aria-hidden="true">
        <span />
        <strong className="section-a">A · establish</strong>
        <strong className="section-b">B · contrast</strong>
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
              <span>
                {layer === "melody" && !hasWrittenMelody
                  ? "fallback motif · write your own in Melody"
                  : labels[layer].role}
              </span>
            </div>

            {arrangement.map((bar, barIndex) => (
              <button
                key={barIndex}
                type="button"
                className={[
                  "arrangement-cell",
                  bar[layer] ? "is-active" : "",
                  isPlaying && currentStep === barIndex ? "is-playhead" : "",
                  barIndex === 4 ? "is-section-start" : "",
                ].filter(Boolean).join(" ")}
                onPointerDown={(event) => {
                  event.preventDefault();
                  beginPaint(
                    barIndex,
                    layer,
                    bar[layer],
                    event.button,
                  );
                }}
                onPointerEnter={(event) =>
                  continuePaint(barIndex, layer, event.buttons)
                }
                onClick={(event) => {
                  if (event.detail === 0) {
                    toggleArrangementLayer(barIndex, layer);
                  }
                }}
                aria-pressed={bar[layer]}
                aria-label={
                  labels[layer].name +
                  ", bar " +
                  (barIndex + 1) +
                  (bar[layer] ? ", active" : ", inactive")
                }
                title={
                  labels[layer].name +
                  " · bar " +
                  (barIndex + 1) +
                  " · click or drag to " +
                  (bar[layer] ? "remove" : "add")
                }
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
              <div
                key={index}
                title={
                  "Bar " +
                  (index + 1) +
                  ": " +
                  count +
                  " active layers"
                }
              >
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
