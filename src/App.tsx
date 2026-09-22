import { useEffect, useMemo } from "react";
import { audioEngine } from "./audio/engine";
import { ChordWorkspace } from "./components/ChordWorkspace";
import { DrumWorkspace } from "./components/DrumWorkspace";
import { MelodyWorkspace, PianoKeyWorkspace } from "./components/PianoWorkspace";
import {
  courseOutline,
  getLesson,
  getNextImplementedLesson,
  implementedLessons,
} from "./lessons/course";
import type { ExerciseDefinition } from "./lessons/types";
import { useStudioStore } from "./state/studio";

function Transport({ workspace }: { workspace: ExerciseDefinition["workspace"] }) {
  const bpm = useStudioStore((state) => state.bpm);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const setBpm = useStudioStore((state) => state.setBpm);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const setCurrentStep = useStudioStore((state) => state.setCurrentStep);

  const canPlay = workspace !== "piano-key";

  const togglePlayback = async () => {
    if (isPlaying) {
      audioEngine.stop();
      setPlaying(false);
      return;
    }

    if (!canPlay) return;

    if (workspace === "melody") {
      await audioEngine.playMelody(bpm, setCurrentStep);
    } else if (workspace === "chords") {
      await audioEngine.playChords(bpm, setCurrentStep);
    } else {
      await audioEngine.playDrums(bpm, setCurrentStep);
    }

    setPlaying(true);
  };

  if (!canPlay) {
    return (
      <div className="transport transport-note">
        <span className="section-label">Keyboard exercise</span>
        <strong>Click notes to audition</strong>
      </div>
    );
  }

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

function ExerciseTabs({
  lessonId,
  exercises,
  currentIndex,
  completedExerciseIds,
  onOpen,
}: {
  lessonId: string;
  exercises: ExerciseDefinition[];
  currentIndex: number;
  completedExerciseIds: string[];
  onOpen: (index: number) => void;
}) {
  return (
    <nav className="exercise-tabs" aria-label="Lesson exercises">
      {exercises.map((item, index) => {
        const previous = exercises[index - 1];
        const unlocked =
          index === 0 ||
          Boolean(previous && completedExerciseIds.includes(previous.id));
        const completed = completedExerciseIds.includes(item.id);
        const active = index === currentIndex;

        return (
          <button
            key={item.id}
            className={[
              "exercise-tab",
              active ? "is-active" : "",
              completed ? "is-complete" : "",
            ].filter(Boolean).join(" ")}
            disabled={!unlocked}
            onClick={() => onOpen(index)}
            title={lessonId + " · exercise " + item.letter}
          >
            <span>{item.letter}</span>
            <strong>{item.title}</strong>
            <small>{completed ? "completed" : unlocked ? "open" : "locked"}</small>
          </button>
        );
      })}
    </nav>
  );
}

function Workspace({ exercise }: { exercise: ExerciseDefinition }) {
  switch (exercise.workspace) {
    case "drums":
      return <DrumWorkspace title={exercise.title} compare={false} />;
    case "compare":
      return <DrumWorkspace title={exercise.title} compare />;
    case "piano-key":
      return <PianoKeyWorkspace />;
    case "melody":
      return <MelodyWorkspace title={exercise.title} />;
    case "chords":
      return <ChordWorkspace />;
  }
}

function App() {
  const currentLessonId = useStudioStore((state) => state.currentLessonId);
  const exerciseIndexByLesson = useStudioStore((state) => state.exerciseIndexByLesson);
  const completedExerciseIds = useStudioStore((state) => state.completedExerciseIds);
  const activePattern = useStudioStore((state) => state.activePattern);
  const patterns = useStudioStore((state) => state.patterns);
  const completedLessonIds = useStudioStore((state) => state.completedLessonIds);
  const selectedPitchClasses = useStudioStore((state) => state.selectedPitchClasses);
  const melody = useStudioStore((state) => state.melody);
  const chordProgression = useStudioStore((state) => state.chordProgression);

  const setCurrentLesson = useStudioStore((state) => state.setCurrentLesson);
  const setExerciseIndex = useStudioStore((state) => state.setExerciseIndex);
  const completeExercise = useStudioStore((state) => state.completeExercise);
  const completeLesson = useStudioStore((state) => state.completeLesson);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const resetPattern = useStudioStore((state) => state.resetPattern);
  const clearPitchClasses = useStudioStore((state) => state.clearPitchClasses);
  const clearMelody = useStudioStore((state) => state.clearMelody);
  const clearChords = useStudioStore((state) => state.clearChords);

  const lesson = getLesson(currentLessonId);
  const storedExerciseIndex = exerciseIndexByLesson[lesson.id] ?? 0;
  const exerciseIndex = Math.min(storedExerciseIndex, lesson.exercises.length - 1);
  const exercise = lesson.exercises[exerciseIndex];
  const nextLesson = getNextImplementedLesson(currentLessonId);

  useEffect(() => {
    audioEngine.setPattern(patterns[activePattern]);
  }, [patterns, activePattern]);

  useEffect(() => {
    audioEngine.setMelody(melody);
  }, [melody]);

  useEffect(() => {
    audioEngine.setChordProgression(chordProgression);
  }, [chordProgression]);

  const checks = useMemo(
    () =>
      exercise.evaluate({
        A: patterns.A,
        B: patterns.B,
        selectedPitchClasses,
        melody,
        chordProgression,
      }),
    [exercise, patterns, selectedPitchClasses, melody, chordProgression],
  );

  const exerciseReady = checks.every((check) => check.complete);
  const exerciseCompleted = completedExerciseIds.includes(exercise.id);
  const lessonCompleted = completedLessonIds.includes(lesson.id);
  const isLastExercise = exerciseIndex === lesson.exercises.length - 1;

  const stopTransport = () => {
    audioEngine.stop();
    setPlaying(false);
  };

  const openLesson = (lessonId: string) => {
    if (lessonId === currentLessonId) return;
    stopTransport();
    setCurrentLesson(lessonId);
  };

  const openExercise = (index: number) => {
    if (index === exerciseIndex) return;
    stopTransport();
    setExerciseIndex(lesson.id, index);
  };

  const advance = () => {
    if (!exerciseReady && !exerciseCompleted) return;

    if (!exerciseCompleted) {
      completeExercise(exercise.id);
    }

    if (!isLastExercise) {
      stopTransport();
      setExerciseIndex(lesson.id, exerciseIndex + 1);
      return;
    }

    if (!lessonCompleted) {
      completeLesson(lesson.id);
      stopTransport();
      return;
    }

    if (nextLesson) {
      openLesson(nextLesson.id);
    }
  };

  const resetWorkspace = () => {
    stopTransport();

    switch (exercise.workspace) {
      case "drums":
        resetPattern("A");
        break;
      case "compare":
        resetPattern("B", patterns.A);
        break;
      case "piano-key":
        clearPitchClasses();
        break;
      case "melody":
        clearMelody();
        break;
      case "chords":
        clearChords();
        break;
    }
  };

  const actionLabel = (() => {
    if (!exerciseReady && !exerciseCompleted) return "Complete the exercise to continue";
    if (!isLastExercise) return "Continue to " + lesson.exercises[exerciseIndex + 1].letter;
    if (!lessonCompleted) return "Complete lesson";
    if (nextLesson) return "Continue to lesson " + nextLesson.number;
    return "Course section complete";
  })();

  const completedCount = completedLessonIds.length;
  const lessonExerciseCount = lesson.exercises.length;
  const lessonCompletedExercises = lesson.exercises.filter((item) =>
    completedExerciseIds.includes(item.id),
  ).length;

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
          <span>Lesson {lesson.number} · Exercise {exercise.letter}</span>
          <strong>{lesson.title}</strong>
        </div>

        <Transport workspace={exercise.workspace} />
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

            <div className="lesson-mini-progress">
              <span>{lesson.title}</span>
              <strong>{lessonCompletedExercises}/{lessonExerciseCount} exercises</strong>
            </div>
          </div>
        </aside>

        <main className="music-panel">
          <section className="music-intro">
            <span className="section-label">{lesson.eyebrow}</span>
            <h1>{lesson.hero}</h1>
            <p>{lesson.description}</p>

            <div className="lesson-overview">
              <span className="section-label">What this lesson teaches</span>
              <p>{lesson.overview}</p>
            </div>
          </section>

          <ExerciseTabs
            lessonId={lesson.id}
            exercises={lesson.exercises}
            currentIndex={exerciseIndex}
            completedExerciseIds={completedExerciseIds}
            onOpen={openExercise}
          />

          <Workspace exercise={exercise} />
        </main>

        <aside className="teacher-panel">
          <div className="teacher-badge">
            {lesson.number}{exercise.letter}
          </div>

          <span className="section-label">What you are learning</span>
          <h2>{exercise.title}</h2>
          <p className="learning-goal">{exercise.learn}</p>

          <div className="concept-card">
            <span className="section-label">Explanation</span>
            <p>{exercise.explanation}</p>
          </div>

          {exercise.terms.length > 0 && (
            <div className="term-section">
              <span className="section-label">Terms introduced here</span>
              <div className="term-list">
                {exercise.terms.map((item) => (
                  <div className="term-card" key={item.term}>
                    <strong>{item.term}</strong>
                    <p>{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="recognition-card">
            <span className="section-label">How to recognise it</span>
            <p>{exercise.recognition}</p>
          </div>

          <div className="instruction-card">
            <span className="section-label">Try it</span>
            <p>{exercise.instruction}</p>
          </div>

          <div className="checks">
            <span className="section-label">{exercise.checksLabel}</span>
            {checks.map((check) => (
              <div className={check.complete ? "check is-complete" : "check"} key={check.label}>
                <span>{check.complete ? "✓" : "○"}</span>
                <p>{check.label}</p>
              </div>
            ))}
          </div>

          <div className={exerciseReady || exerciseCompleted ? "completion is-complete" : "completion"}>
            <span>
              {exerciseCompleted
                ? "Exercise completed"
                : exerciseReady
                  ? exercise.successLabel
                  : "Explore until the checks are complete"}
            </span>
            <strong>{checks.filter((check) => check.complete).length} / {checks.length}</strong>
          </div>

          <button
            className="lesson-action"
            disabled={(!exerciseReady && !exerciseCompleted) || (lessonCompleted && !nextLesson && isLastExercise)}
            onClick={advance}
          >
            {actionLabel}
          </button>

          <button className="text-button" onClick={resetWorkspace}>
            Reset this workspace
          </button>

          <div className="implemented-note">
            <span className="section-label">Current course build</span>
            <p>
              {implementedLessons.length} interactive lessons ·{" "}
              {implementedLessons.reduce((total, item) => total + item.exercises.length, 0)} exercises.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
