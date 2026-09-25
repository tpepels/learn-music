import { useEffect, useMemo, useRef, useState } from "react";
import { audioEngine } from "../audio/engine";
import { useStudioStore } from "../state/studio";
import {
  getSchoenbergSourceMaterial,
  type SchoenbergSourceScore,
} from "../music/schoenbergSourceMaterial";

function diatonicStep(midi: number): number {
  const steps: Record<number, number> = {
    0: 0,
    1: 0,
    2: 1,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 4,
    8: 5,
    9: 5,
    10: 6,
    11: 6,
  };
  const octave = Math.floor(midi / 12) - 1;
  return octave * 7 + steps[midi % 12];
}

function sourceStaffY(midi: number, clef: "treble" | "bass"): number {
  const bottomLineMidi = clef === "treble" ? 64 : 43; // E4 / G2
  const bottomStep = diatonicStep(bottomLineMidi);
  return 86 - (diatonicStep(midi) - bottomStep) * 5;
}

function sourceAccidental(midi: number): string {
  const pitchClass = ((midi % 12) + 12) % 12;
  return [1, 6].includes(pitchClass)
    ? "♯"
    : [3, 8, 10].includes(pitchClass)
      ? "♭"
      : "";
}

function SourceScore({
  score,
}: {
  score: SchoenbergSourceScore;
}) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState(0);
  const timers = useRef<number[]>([]);
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );

  const positions = useMemo(() => {
    let cursor = 0;
    return score.events.map((event) => {
      const current = cursor;
      cursor += Math.max(1, event.duration);
      return current;
    });
  }, [score.events]);

  const totalEighths = score.events.reduce(
    (sum, event) => sum + Math.max(1, event.duration),
    0,
  );
  const width = Math.max(700, 170 + totalEighths * 34);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    },
    [],
  );

  const stopLocalPlayback = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setPlayingIndex(null);
  };

  const play = () => {
    recordLearningExperiment("source.play", score.id);
    stopLocalPlayback();
    const eighthMs = 60000 / score.bpm / 2;
    let elapsed = 0;

    score.events.forEach((event, index) => {
      const timer = window.setTimeout(() => {
        setPlayingIndex(index);
        if (event.midi !== null) {
          void audioEngine.playSourceNote(event.midi, event.duration, 0.7);
        }
      }, elapsed);
      timers.current.push(timer);
      elapsed += Math.max(1, event.duration) * eighthMs;
    });

    timers.current.push(
      window.setTimeout(() => setPlayingIndex(null), elapsed + 80),
    );
  };

  const xForEvent = (index: number) => 130 + positions[index] * 34;
  const analysis = score.analysis ?? [];
  const activeSegment = analysis[activeAnalysis];

  return (
    <section className="source-score" aria-label={score.reference + " native score"}>
      <div className="source-material-heading">
        <div>
          <span className="section-label">Native source score</span>
          <strong>{score.reference} · {score.title}</strong>
          <small>{score.attribution}</small>
        </div>
        <button type="button" onClick={play}>Play example</button>
      </div>

      <div className="source-score-meta">
        <span>{score.keyLabel}</span>
        {score.meter ? <span>{score.meter}</span> : null}
        <span>{score.bpm} BPM study playback</span>
      </div>

      <div className="source-score-scroll">
        <svg
          className="source-score-svg"
          viewBox={`0 0 ${width} 176`}
          style={{ minWidth: width }}
          role="img"
          aria-label={score.reference + " " + score.title}
        >
          {[56, 66, 76, 86, 96].map((y) => (
            <line
              className="source-score-line"
              key={y}
              x1="28"
              x2={width - 24}
              y1={y}
              y2={y}
            />
          ))}
          <text x="38" y="91" className="source-score-clef">
            {score.clef === "treble" ? "𝄞" : "𝄢"}
          </text>
          {score.meter ? (
            <>
              <text x="84" y="75" className="source-score-meter">
                {score.meter.split("/")[0]}
              </text>
              <text x="84" y="91" className="source-score-meter">
                {score.meter.split("/")[1]}
              </text>
            </>
          ) : null}

          {score.events.map((event, index) => {
            const x = xForEvent(index);
            const y =
              event.midi === null
                ? 76
                : sourceStaffY(event.midi, score.clef);
            const open = event.duration >= 4;
            const dotted = event.duration === 3 || event.duration === 6;
            const accidental =
              event.accidental ??
              (event.midi === null ? "" : sourceAccidental(event.midi));

            return (
              <g
                key={index}
                className={[
                  "source-score-event",
                  playingIndex === index ? "is-playing" : "",
                  activeSegment &&
                  activeSegment.startEvent !== undefined &&
                  activeSegment.endEvent !== undefined &&
                  index >= activeSegment.startEvent &&
                  index <= activeSegment.endEvent
                    ? "is-analysis-active"
                    : "",
                ].filter(Boolean).join(" ")}
                onClick={() => {
                  if (event.midi !== null) {
                    recordLearningExperiment("source.note", score.id + ":" + index);
                    void audioEngine.playSourceNote(
                      event.midi,
                      event.duration,
                      0.74,
                    );
                  }
                }}
                role="button"
                tabIndex={event.midi === null ? -1 : 0}
              >
                {event.midi === null ? (
                  <text x={x} y={y + 4} className="source-score-rest">𝄽</text>
                ) : (
                  <>
                    {accidental ? (
                      <text
                        x={x - 17}
                        y={y + 5}
                        className="source-score-accidental"
                      >
                        {accidental}
                      </text>
                    ) : null}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="7.5"
                      ry="5.2"
                      className={open ? "is-open" : ""}
                    />
                    <line
                      x1={x + 6.5}
                      x2={x + 6.5}
                      y1={y}
                      y2={y - 30}
                    />
                    {event.duration === 1 ? (
                      <path
                        d={`M ${x + 6.5} ${y - 30} q 13 6 8 18`}
                        className="source-score-flag"
                      />
                    ) : null}
                    {dotted ? <circle cx={x + 13} cy={y} r="1.8" /> : null}
                    {y > 101 ? (
                      <line
                        x1={x - 11}
                        x2={x + 11}
                        y1="106"
                        y2="106"
                        className="source-score-ledger"
                      />
                    ) : null}
                    {y < 51 ? (
                      <line
                        x1={x - 11}
                        x2={x + 11}
                        y1="46"
                        y2="46"
                        className="source-score-ledger"
                      />
                    ) : null}
                  </>
                )}
                {event.barAfter ? (
                  <line
                    x1={x + Math.max(22, event.duration * 17)}
                    x2={x + Math.max(22, event.duration * 17)}
                    y1="52"
                    y2="100"
                    className="source-score-barline"
                  />
                ) : null}
              </g>
            );
          })}

          {(score.slurs ?? []).map((slur, index) => {
            const startX = xForEvent(slur.start) - 4;
            const endX = xForEvent(slur.end) + 7;
            const startMidi = score.events[slur.start]?.midi;
            const endMidi = score.events[slur.end]?.midi;
            if (startMidi === null || startMidi === undefined ||
                endMidi === null || endMidi === undefined) return null;
            const startY = sourceStaffY(startMidi, score.clef) + 12;
            const endY = sourceStaffY(endMidi, score.clef) + 12;
            const controlY = Math.max(startY, endY) + 16;
            return (
              <path
                key={index}
                d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${controlY} ${endX} ${endY}`}
                className="source-score-slur"
              />
            );
          })}
        </svg>
      </div>

      {analysis.length ? (
        <div className="source-analysis-tabs is-score-analysis" role="tablist">
          {analysis.map((entry, index) => (
            <button
              type="button"
              key={entry.label}
              className={activeAnalysis === index ? "is-active" : ""}
              onClick={() => {
                setActiveAnalysis(index);
                recordLearningExperiment(
                  "source.analysis",
                  score.id + ":" + index,
                );
              }}
              role="tab"
              aria-selected={activeAnalysis === index}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}
      {activeSegment ? (
        <div className="source-analysis-detail is-score-analysis">
          <strong>{activeSegment.label}</strong>
          <p>{activeSegment.detail}</p>
        </div>
      ) : null}
      <p className="source-material-fidelity">{score.fidelityNote}</p>
    </section>
  );
}

function SourceMap({
  id,
}: {
  id: string;
}) {
  const material = getSchoenbergSourceMaterial(id);
  const [active, setActive] = useState(0);
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );
  if (!material || material.kind !== "map") return null;
  const segment = material.segments[active];

  return (
    <section className="source-analysis-map" aria-label={material.reference + " analysis map"}>
      <div className="source-material-heading">
        <div>
          <span className="section-label">Interactive book analysis</span>
          <strong>{material.reference} · {material.title}</strong>
        </div>
      </div>
      <div className="source-analysis-tabs" role="tablist">
        {material.segments.map((entry, index) => (
          <button
            type="button"
            key={entry.label}
            className={active === index ? "is-active" : ""}
            onClick={() => {
              setActive(index);
              recordLearningExperiment("source.analysis", id + ":" + index);
            }}
            role="tab"
            aria-selected={active === index}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="source-analysis-detail">
        <strong>{segment.label}</strong>
        <p>{segment.detail}</p>
      </div>
      <p className="source-material-fidelity">{material.fidelityNote}</p>
    </section>
  );
}

export function SchoenbergSourceMaterial({
  id,
}: {
  id: string;
}) {
  const material = getSchoenbergSourceMaterial(id);
  if (!material) {
    return (
      <div className="source-material-missing">
        Source material {id} is not registered.
      </div>
    );
  }

  return material.kind === "score"
    ? <SourceScore score={material} />
    : <SourceMap id={id} />;
}
