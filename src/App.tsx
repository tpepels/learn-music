import { useEffect, useMemo } from "react";
import { audioEngine } from "./audio/engine";
import {
  courseOutline,
  getLesson,
  getNextImplementedLesson,
  implementedLessons,
} from "./lessons/course";
import { STEPS, trackNames, type PatternId, type TrackName } from "./music/model";
import { useStudioStore } from "./state/studio";

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

function Sequencer({ title, readOnly }: { title: string; readOnly: boolean }) {
  const pattern = useStudioStore((state) => state.patterns[state.activePattern]);
  const activePattern = useStudioStore((state) => state.activePattern);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const toggleStep = useStudioStore((state) => state.toggleStep);

  return (
    <div className="sequencer" aria-label="16-step drum sequencer">
      <div className="sequencer-heading">
        <div>
          <span className="section-label">One bar · 4/4 · Pattern {activePattern}</span>
          <h2>{title}</h2>
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
        <div className="track-row" key={track}>
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
  );
}

function App() {
  const currentLessonId = useStudioStore((state) => state.currentLessonId);
  const activePattern = useStudioStore((state) => state.activePattern);
  const patterns = useStudioStore((state) => state.patterns);
  const completedLessonIds = useStudioStore((state) => state.completedLessonIds);
  const setCurrentLesson = useStudioStore((state) => state.setCurrentLesson);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const resetPattern = useStudioStore((state) => state.resetPattern);
  const completeLesson = useStudioStore((state) => state.completeLesson);

  const lesson = getLesson(currentLessonId);
  const nextLesson = getNextImplementedLesson(currentLessonId);

  useEffect(() => {
    audioEngine.setPattern(patterns[activePattern]);
  }, [patterns, activePattern]);

  const checks = useMemo(() => lesson.evaluate(patterns), [lesson, patterns]);
  const readyToComplete = checks.every((check) => check.complete);
  const isCompleted = completedLessonIds.includes(lesson.id);

  const stopTransport = () => {
    audioEngine.stop();
    setPlaying(false);
  };

  const openLesson = (lessonId: string) => {
    if (lessonId === currentLessonId) return;
    stopTransport();
    setCurrentLesson(lessonId);
  };

  const continueToNextLesson = () => {
    if (!nextLesson) return;
    stopTransport();
    setCurrentLesson(nextLesson.id);
  };

  const resetExercise = () => {
    if (lesson.patternMode === "compare") {
      resetPattern("B", patterns.A);
    } else {
      resetPattern("A");
    }
  };

  const completedCount = completedLessonIds.length;

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
          <span>Lesson {lesson.number}</span>
          <strong>{lesson.title}</strong>
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
            {courseOutline.map((item, index) => {
              const previous = courseOutline[index - 1];
              const unlocked =
                item.implemented &&
                (index === 0 || Boolean(previous && completedLessonIds.includes(previous.id)));
              const active = item.id === lesson.id;
              const completed = completedLessonIds.includes(item.id);

              let state = "locked";
              if (active) state = "active";
              else if (completed) state = "complete";
              else if (unlocked) state = "available";

              return (
                <button
                  className={"course-item course-" + state}
                  disabled={!unlocked}
                  key={item.id}
                  onClick={() => openLesson(item.id)}
                >
                  <span className="course-number">{String(item.number).padStart(2, "0")}</span>
                  <span>{item.title}</span>
                  <i>{completed ? "✓" : ""}</i>
                </button>
              );
            })}
          </nav>

          <div className="course-progress">
            <div className="progress-meta">
              <span>Course progress</span>
              <strong>{completedCount} / {courseOutline.length}</strong>
            </div>
            <div className="progress-track">
              <span
                style={{ width: Math.min(100, (completedCount / courseOutline.length) * 100) + "%" }}
              />
            </div>
          </div>
        </aside>

        <main className="music-panel">
          <section className="music-intro">
            <span className="section-label">{lesson.eyebrow}</span>
            <h1>{lesson.hero}</h1>
            <p>{lesson.description}</p>
          </section>

          {lesson.patternMode === "compare" && <PatternSelector />}

          <Sequencer
            title={lesson.sequencerTitle}
            readOnly={lesson.patternMode === "compare" && activePattern === "A"}
          />

          <section className="sound-strip">
            <div>
              <span className="section-label">
                {lesson.patternMode === "compare" ? "Composition idea" : "What you are hearing"}
              </span>
              <strong>
                {lesson.patternMode === "compare"
                  ? "Repetition creates identity; variation creates motion"
                  : "Three sounds, three rhythmic jobs"}
              </strong>
            </div>
            <div className="sound-role">
              <i className="role-icon kick-role" />
              <span>
                <strong>{lesson.patternMode === "compare" ? "A" : "Kick"}</strong>
                {lesson.patternMode === "compare" ? "preserves the original idea" : "anchors the pulse"}
              </span>
            </div>
            <div className="sound-role">
              <i className="role-icon snare-role" />
              <span>
                <strong>{lesson.patternMode === "compare" ? "B" : "Snare"}</strong>
                {lesson.patternMode === "compare" ? "changes selected events" : "defines the backbeat"}
              </span>
            </div>
            <div className="sound-role">
              <i className="role-icon hat-role" />
              <span>
                <strong>{lesson.patternMode === "compare" ? "Constraint" : "Hi-hat"}</strong>
                {lesson.patternMode === "compare" ? "keeps both patterns related" : "reveals subdivision"}
              </span>
            </div>
          </section>
        </main>

        <aside className="teacher-panel">
          <div className="teacher-badge">{String(lesson.number).padStart(2, "0")}</div>
          <span className="section-label">What to do</span>
          <h2>{lesson.title}</h2>
          <p className="instruction">{lesson.instruction}</p>

          <div className="concept-card">
            <span className="section-label">Why</span>
            <p>{lesson.concept}</p>
          </div>

          <div className="checks">
            <span className="section-label">{lesson.checksLabel}</span>
            {checks.map((check) => (
              <div className={check.complete ? "check is-complete" : "check"} key={check.label}>
                <span>{check.complete ? "✓" : "○"}</span>
                <p>{check.label}</p>
              </div>
            ))}
          </div>

          <div className={readyToComplete || isCompleted ? "completion is-complete" : "completion"}>
            <span>
              {isCompleted
                ? "Lesson completed"
                : readyToComplete
                  ? lesson.successLabel
                  : "Keep working on the exercise"}
            </span>
            <strong>{checks.filter((check) => check.complete).length} / {checks.length}</strong>
          </div>

          {!isCompleted && (
            <button
              className="lesson-action"
              disabled={!readyToComplete}
              onClick={() => completeLesson(lesson.id)}
            >
              Complete lesson
            </button>
          )}

          {isCompleted && nextLesson && (
            <button className="lesson-action" onClick={continueToNextLesson}>
              Continue to lesson {nextLesson.number}
            </button>
          )}

          <button className="text-button" onClick={resetExercise}>Reset exercise</button>

          <div className="implemented-note">
            <span className="section-label">Prototype</span>
            <p>{implementedLessons.length} lessons are currently interactive.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
