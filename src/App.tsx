import { useEffect, useMemo } from "react";
import { audioEngine } from "./audio/engine";
import {
  evaluatePulseAndGroove,
  pulseAndGrooveLesson,
} from "./lessons/pulseAndGroove";
import { STEPS, trackNames, type TrackName } from "./music/model";
import { useStudioStore } from "./state/studio";

const course = [
  ["01", "Pulse & groove", "active"],
  ["02", "Rhythm & variation", "next"],
  ["03", "Pitch & melody", "locked"],
  ["04", "Bass & harmony", "locked"],
  ["05", "Sound & synthesis", "locked"],
  ["06", "Arrangement", "locked"],
];

const trackLabels: Record<TrackName, string> = {
  kick: "Kick",
  snare: "Snare",
  hat: "Hi-hat",
};

function Transport() {
  const bpm = useStudioStore((state) => state.bpm);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const setBpm = useStudioStore((state) => state.setBpm);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const setCurrentStep = useStudioStore((state) => state.setCurrentStep);

  const togglePlayback = async () => {
    if (isPlaying) {
      audioEngine.stop();
      setPlaying(false);
      return;
    }

    await audioEngine.play(bpm, setCurrentStep);
    setPlaying(true);
  };

  return (
    <div className="transport">
      <button
        className={isPlaying ? "transport-button is-playing" : "transport-button"}
        onClick={togglePlayback}
        aria-label={isPlaying ? "Stop" : "Play"}
      >
        <span className="transport-icon">{isPlaying ? "■" : "▶"}</span>
        {isPlaying ? "Stop" : "Play"}
      </button>

      <label className="tempo-control">
        <span>Tempo</span>
        <input
          type="range"
          min="60"
          max="160"
          value={bpm}
          onChange={(event) => {
            const nextBpm = Number(event.target.value);
            setBpm(nextBpm);
            audioEngine.setBpm(nextBpm);
          }}
        />
        <strong>{bpm}</strong>
        <span className="bpm-unit">BPM</span>
      </label>
    </div>
  );
}

function Sequencer() {
  const pattern = useStudioStore((state) => state.pattern);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const toggleStep = useStudioStore((state) => state.toggleStep);

  return (
    <div className="sequencer" aria-label="16-step drum sequencer">
      <div className="sequencer-heading">
        <div>
          <span className="section-label">One bar · 4/4</span>
          <h2>Build the groove</h2>
        </div>
        <div className="grid-key">
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
        <div className="track-row" key={track}>
          <div className="track-label">
            <strong>{trackLabels[track]}</strong>
            <span>{track === "kick" ? "low" : track === "snare" ? "mid" : "high"}</span>
          </div>

          {pattern[track].map((active, step) => {
            const playhead = isPlaying && currentStep === step;
            const beatStart = step % 4 === 0;
            const classes = [
              "step",
              active ? "is-active" : "",
              playhead ? "is-playhead" : "",
              beatStart ? "is-beat-start" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                className={classes}
                key={step}
                aria-label={trackLabels[track] + " step " + (step + 1)}
                aria-pressed={active}
                onClick={() => toggleStep(track, step)}
              >
                <span />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function App() {
  const pattern = useStudioStore((state) => state.pattern);
  const resetPattern = useStudioStore((state) => state.resetPattern);

  useEffect(() => {
    audioEngine.setPattern(pattern);
  }, [pattern]);

  const checks = useMemo(() => evaluatePulseAndGroove(pattern), [pattern]);
  const completed = checks.every((check) => check.complete);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">LM</div>
          <div>
            <strong>Learn Music</strong>
            <span>Composition + production</span>
          </div>
        </div>

        <div className="lesson-title">
          <span>Lesson {pulseAndGrooveLesson.number}</span>
          <strong>{pulseAndGrooveLesson.title}</strong>
        </div>

        <Transport />
      </header>

      <div className="workspace">
        <aside className="course-panel">
          <div className="panel-heading">
            <span className="section-label">Course</span>
            <strong>Foundations</strong>
          </div>

          <nav className="course-list" aria-label="Course lessons">
            {course.map(([number, title, state]) => (
              <button
                className={"course-item course-" + state}
                disabled={state !== "active"}
                key={number}
              >
                <span className="course-number">{number}</span>
                <span>{title}</span>
                <i />
              </button>
            ))}
          </nav>

          <div className="course-progress">
            <div className="progress-meta">
              <span>Course progress</span>
              <strong>1 / 6</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: "16.7%" }} />
            </div>
          </div>
        </aside>

        <main className="music-panel">
          <section className="music-intro">
            <span className="section-label">{pulseAndGrooveLesson.eyebrow}</span>
            <h1>Feel the pulse before adding complexity.</h1>
            <p>
              Click the grid to turn sounds on and off. Every group of four
              steps is one beat. Press play whenever you want to hear the result.
            </p>
          </section>

          <Sequencer />

          <section className="sound-strip">
            <div>
              <span className="section-label">What you are hearing</span>
              <strong>Three sounds, three rhythmic jobs</strong>
            </div>
            <div className="sound-role">
              <i className="role-icon kick-role" />
              <span><strong>Kick</strong> anchors the pulse</span>
            </div>
            <div className="sound-role">
              <i className="role-icon snare-role" />
              <span><strong>Snare</strong> defines the backbeat</span>
            </div>
            <div className="sound-role">
              <i className="role-icon hat-role" />
              <span><strong>Hi-hat</strong> reveals subdivision</span>
            </div>
          </section>
        </main>

        <aside className="teacher-panel">
          <div className="teacher-badge">01</div>
          <span className="section-label">What to do</span>
          <h2>{pulseAndGrooveLesson.title}</h2>
          <p className="instruction">{pulseAndGrooveLesson.instruction}</p>

          <div className="concept-card">
            <span className="section-label">Why</span>
            <p>{pulseAndGrooveLesson.concept}</p>
          </div>

          <div className="checks">
            <span className="section-label">Listen for</span>
            {checks.map((check) => (
              <div
                className={check.complete ? "check is-complete" : "check"}
                key={check.label}
              >
                <span>{check.complete ? "✓" : "○"}</span>
                <p>{check.label}</p>
              </div>
            ))}
          </div>

          <div className={completed ? "completion is-complete" : "completion"}>
            <span>{completed ? "Groove complete" : "Keep editing the bar"}</span>
            <strong>{checks.filter((check) => check.complete).length} / {checks.length}</strong>
          </div>

          <button className="text-button" onClick={resetPattern}>
            Reset exercise
          </button>
        </aside>
      </div>
    </div>
  );
}

export default App;
