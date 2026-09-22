import { useEffect, useMemo, useState } from "react";
import { audioEngine } from "./audio/engine";
import { resolveTransportWorkspace } from "./app/transportRouting";
import { ArrangementWorkspace } from "./components/ArrangementWorkspace";
import { AutomationDynamicsWorkspace } from "./components/AutomationDynamicsWorkspace";
import { BassWorkspace } from "./components/BassWorkspace";
import { ChordWorkspace } from "./components/ChordWorkspace";
import { CreateMode } from "./components/CreateMode";
import { DrumWorkspace } from "./components/DrumWorkspace";
import { EffectsWorkspace } from "./components/EffectsWorkspace";
import { FinalProjectWorkspace } from "./components/FinalProjectWorkspace";
import { GrooveFeelWorkspace } from "./components/GrooveFeelWorkspace";
import { MixerWorkspace } from "./components/MixerWorkspace";
import { LearningPanel } from "./components/LearningPanel";
import { MelodyWorkspace, PianoKeyWorkspace } from "./components/PianoWorkspace";
import { StudioMode } from "./components/StudioMode";
import { SynthWorkspace } from "./components/SynthWorkspace";
import { VoicingWorkspace } from "./components/VoicingWorkspace";
import {
  courseOutline,
  getLesson,
  getNextImplementedLesson,
  implementedLessons,
} from "./lessons/course";
import { getAdvanceDestination } from "./lessons/progression";
import type { ExerciseDefinition } from "./lessons/types";
import { useStudioStore } from "./state/studio";

function Transport({ workspace }: { workspace: ExerciseDefinition["workspace"] }) {
  const bpm = useStudioStore((state) => state.bpm);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const setBpm = useStudioStore((state) => state.setBpm);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const setCurrentStep = useStudioStore((state) => state.setCurrentStep);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const canPlay = workspace !== "piano-key" && workspace !== "synth";

  const togglePlayback = async () => {
    if (isPlaying) {
      audioEngine.stop();
      setPlaying(false);
      setPlaybackError(null);
      return;
    }

    if (!canPlay) return;

    setPlaybackError(null);

    try {
      if (workspace === "melody") {
        await audioEngine.playMelody(bpm, setCurrentStep);
      } else if (workspace === "chords" || workspace === "voicing") {
        await audioEngine.playChords(bpm, setCurrentStep);
      } else if (workspace === "bass") {
        await audioEngine.playBass(bpm, setCurrentStep);
      } else if (
        workspace === "arrangement" ||
        workspace === "mixer" ||
        workspace === "automation-dynamics" ||
        workspace === "effects" ||
        workspace === "final-project"
      ) {
        await audioEngine.playArrangement(bpm, setCurrentStep);
      } else {
        await audioEngine.playDrums(bpm, setCurrentStep);
      }

      setPlaying(true);
    } catch (error) {
      console.error("PLAY / LAB playback failed", error);
      audioEngine.stop();
      setPlaying(false);
      setPlaybackError(
        error instanceof Error
          ? error.message
          : "Audio could not start. Try Play again.",
      );
    }
  };

  if (!canPlay) {
    return (
      <div className="transport transport-note">
        <span className="section-label">{workspace === "synth" ? "Sound-design exercise" : "Keyboard exercise"}</span>
        <strong>{workspace === "synth" ? "Use the audition buttons" : "Click notes to audition"}</strong>
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

      {playbackError && (
        <span className="transport-error" role="status">
          Audio error · {playbackError}
        </span>
      )}

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
    case "synth":
      return <SynthWorkspace />;
    case "arrangement":
      return <ArrangementWorkspace />;
    case "mixer":
      return <MixerWorkspace />;
    case "automation-dynamics":
      return <AutomationDynamicsWorkspace />;
    case "effects":
      return <EffectsWorkspace />;
    case "final-project":
      return <FinalProjectWorkspace />;
    case "voicing":
      return <VoicingWorkspace />;
    case "bass":
      return <BassWorkspace />;
    case "groove-feel":
      return <GrooveFeelWorkspace />;
  }
}

const lessonGlyphs: Record<string, string> = {
  "rhythm.pulse-and-groove": "●",
  "rhythm.variation": "↻",
  "pitch.melody": "♩",
  "harmony.chords": "Ⅳ",
  "sound.synthesis": "∿",
  "form.arrangement": "▦",
  "mixing.balance-space": "≋",
  "production.automation-dynamics": "⌁",
  "production.effects-transitions": "✦",
  "production.final-project": "✓",
  "harmony.voice-leading": "⇄",
  "composition.bass-lines": "♭",
  "rhythm.groove-feel": "◌",
};

const workspaceNames: Record<ExerciseDefinition["workspace"], string> = {
  drums: "Drum machine",
  compare: "Pattern lab",
  "piano-key": "Keyboard",
  melody: "Piano roll",
  chords: "Chord track",
  synth: "Synthesizer",
  arrangement: "Arrangement view",
  mixer: "Mixer",
  "automation-dynamics": "Automation + dynamics",
  effects: "Creative FX rack",
  "final-project": "Final project",
  voicing: "Voicing lab",
  bass: "Bass piano roll",
  "groove-feel": "Velocity + swing",
};

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
  const synthSettings = useStudioStore((state) => state.synthSettings);
  const arrangement = useStudioStore((state) => state.arrangement);
  const mixerSettings = useStudioStore((state) => state.mixerSettings);
  const automationSettings = useStudioStore((state) => state.automationSettings);
  const dynamicsSettings = useStudioStore((state) => state.dynamicsSettings);
  const effectsSettings = useStudioStore((state) => state.effectsSettings);
  const projectMilestones = useStudioStore((state) => state.projectMilestones);
  const voicingSettings = useStudioStore((state) => state.voicingSettings);
  const bassSequence = useStudioStore((state) => state.bassSequence);
  const grooveFeelSettings = useStudioStore((state) => state.grooveFeelSettings);
  const appMode = useStudioStore((state) => state.appMode);
  const [studioTransportWorkspace, setStudioTransportWorkspace] =
    useState<ExerciseDefinition["workspace"]>("compare");
  const [confirmLessonReset, setConfirmLessonReset] = useState(false);

  const setCurrentLesson = useStudioStore((state) => state.setCurrentLesson);
  const setExerciseIndex = useStudioStore((state) => state.setExerciseIndex);
  const completeExercise = useStudioStore((state) => state.completeExercise);
  const completeLesson = useStudioStore((state) => state.completeLesson);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const resetPattern = useStudioStore((state) => state.resetPattern);
  const clearPitchClasses = useStudioStore((state) => state.clearPitchClasses);
  const clearMelody = useStudioStore((state) => state.clearMelody);
  const clearChords = useStudioStore((state) => state.clearChords);
  const resetSynthSettings = useStudioStore((state) => state.resetSynthSettings);
  const clearArrangement = useStudioStore((state) => state.clearArrangement);
  const resetMixer = useStudioStore((state) => state.resetMixer);
  const resetAutomation = useStudioStore((state) => state.resetAutomation);
  const resetDynamics = useStudioStore((state) => state.resetDynamics);
  const resetEffects = useStudioStore((state) => state.resetEffects);
  const resetVoicings = useStudioStore((state) => state.resetVoicings);
  const clearBass = useStudioStore((state) => state.clearBass);
  const resetGrooveFeel = useStudioStore((state) => state.resetGrooveFeel);
  const resetLessonProgress = useStudioStore((state) => state.resetLessonProgress);
  const setAppMode = useStudioStore((state) => state.setAppMode);

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

  useEffect(() => {
    audioEngine.setSynthSettings(synthSettings);
  }, [synthSettings]);

  useEffect(() => {
    audioEngine.setArrangement(arrangement);
  }, [arrangement]);

  useEffect(() => {
    audioEngine.setMixerSettings(mixerSettings);
  }, [mixerSettings]);

  useEffect(() => {
    audioEngine.setAutomationSettings(automationSettings);
  }, [automationSettings]);

  useEffect(() => {
    audioEngine.setDynamicsSettings(dynamicsSettings);
  }, [dynamicsSettings]);

  useEffect(() => {
    audioEngine.setEffectsSettings(effectsSettings);
  }, [effectsSettings]);

  useEffect(() => {
    audioEngine.setVoicingSettings(voicingSettings);
  }, [voicingSettings]);

  useEffect(() => {
    audioEngine.setBassSequence(bassSequence);
  }, [bassSequence]);

  useEffect(() => {
    audioEngine.setGrooveFeelSettings(grooveFeelSettings);
  }, [grooveFeelSettings]);

  const checks = useMemo(
    () =>
      exercise.evaluate({
        A: patterns.A,
        B: patterns.B,
        selectedPitchClasses,
        melody,
        chordProgression,
        synthSettings,
        arrangement,
        mixerSettings,
        automationSettings,
        dynamicsSettings,
        effectsSettings,
        projectMilestones,
        voicingSettings,
        bassSequence,
        grooveFeelSettings,
      }),
    [
      exercise,
      patterns,
      selectedPitchClasses,
      melody,
      chordProgression,
      synthSettings,
      arrangement,
      mixerSettings,
      automationSettings,
      dynamicsSettings,
      effectsSettings,
      projectMilestones,
      voicingSettings,
      bassSequence,
      grooveFeelSettings,
    ],
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
    setConfirmLessonReset(false);
    setCurrentLesson(lessonId);
  };

  const openExercise = (index: number) => {
    if (index === exerciseIndex) return;
    stopTransport();
    setConfirmLessonReset(false);
    setExerciseIndex(lesson.id, index);
  };

  const advance = () => {
    if (!exerciseReady && !exerciseCompleted) return;
    setConfirmLessonReset(false);

    if (!exerciseCompleted) {
      completeExercise(exercise.id);
    }

    const destination = getAdvanceDestination(
      lesson,
      exerciseIndex,
      nextLesson,
    );

    stopTransport();

    if (destination.type === "exercise") {
      setExerciseIndex(lesson.id, destination.exerciseIndex);
      return;
    }

    if (!lessonCompleted) {
      completeLesson(lesson.id);
    }

    if (destination.type === "lesson") {
      setCurrentLesson(destination.lessonId);
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
      case "synth":
        resetSynthSettings();
        break;
      case "arrangement":
        clearArrangement();
        break;
      case "mixer":
        resetMixer();
        break;
      case "automation-dynamics":
        resetAutomation();
        resetDynamics();
        break;
      case "effects":
        resetEffects();
        break;
      case "final-project":
        break;
      case "voicing":
        resetVoicings();
        break;
      case "bass":
        clearBass();
        break;
      case "groove-feel":
        resetGrooveFeel();
        break;
    }
  };

  const resetCurrentLessonProgress = () => {
    if (!confirmLessonReset) {
      setConfirmLessonReset(true);
      return;
    }

    stopTransport();
    resetLessonProgress(
      lesson.id,
      lesson.exercises.map((item) => item.id),
    );
    setConfirmLessonReset(false);
  };

  const actionLabel = (() => {
    if (!exerciseReady && !exerciseCompleted) return "Complete the exercise to continue";
    if (!isLastExercise) return "Continue to " + lesson.exercises[exerciseIndex + 1].letter;
    if (nextLesson) return "Complete lesson & continue to lesson " + nextLesson.number;
    if (!lessonCompleted) return "Complete lesson";
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
          <div className="brand-mark">♪</div>
          <div>
            <strong>PLAY / LAB</strong>
            <span>learn music by making it</span>
          </div>
        </div>

        <div className="lesson-title">
          {appMode === "learn" ? (
            <>
              <span className="topbar-lesson-kicker">LESSON {String(lesson.number).padStart(2, "0")} · {exercise.letter}</span>
              <strong>{exercise.title}</strong>
              <small>{workspaceNames[exercise.workspace]}</small>
            </>
          ) : appMode === "create" ? (
            <>
              <span className="topbar-lesson-kicker">CREATE MODE</span>
              <strong>Open-ended briefs</strong>
              <small>Make decisions without a single correct answer</small>
            </>
          ) : (
            <>
              <span className="topbar-lesson-kicker">STUDIO MODE</span>
              <strong>Your project</strong>
              <small>All unlocked production tools</small>
            </>
          )}
        </div>

        <div className="topbar-actions">
          <div className="mode-switch" role="group" aria-label="Application mode">
            <button
              className={appMode === "learn" ? "is-active" : ""}
              onClick={() => setAppMode("learn")}
            >
              Learn
            </button>
            <button
              className={appMode === "create" ? "is-active" : ""}
              onClick={() => setAppMode("create")}
            >
              Create
            </button>
            <button
              className={appMode === "studio" ? "is-active" : ""}
              onClick={() => setAppMode("studio")}
            >
              Studio
            </button>
          </div>
          <Transport
            workspace={resolveTransportWorkspace(
              appMode,
              exercise.workspace,
              studioTransportWorkspace,
            )}
          />
        </div>
      </header>

      {appMode === "studio" ? (
        <StudioMode onTransportWorkspaceChange={setStudioTransportWorkspace} />
      ) : appMode === "create" ? (
        <CreateMode />
      ) : (
      <div className="workspace">
        <aside className="course-panel">
          <div className="panel-heading">
            <span className="section-label">Your set</span>
            <strong>Music maker foundations</strong>
            <p>Each lesson unlocks a new part of the studio.</p>
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
                  <span className="course-number">
                    <b>{lessonGlyphs[item.id] ?? "•"}</b>
                    {String(item.number).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{completed ? "done" : active ? "playing now" : unlocked ? "ready" : "locked"}</small>
                  </span>
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
            <small className="progress-cookie-note">
              Progress saved in this browser
            </small>
          </div>
        </aside>

        <main className="music-panel">
          <section className="music-intro">
            <div className="lesson-chip-row">
              <span className="lesson-chip">{lesson.eyebrow}</span>
              <span className="lesson-chip lesson-chip-tool">{workspaceNames[exercise.workspace]}</span>
              <span className="lesson-chip lesson-chip-progress">{lessonCompletedExercises + 1}/{lessonExerciseCount}</span>
            </div>
            <h1>{lesson.hero}</h1>
            <p>{exercise.learn}</p>

            <div className="play-loop">
              <span>1</span><i />
              <span>Listen</span><i />
              <span>Tweak</span><i />
              <span>Compare</span><i />
              <span>Keep what works</span>
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

          <LearningPanel exercise={exercise} />
        </main>

        <aside className="teacher-panel">
          <div className="coach-header">
            <div className="teacher-badge">{lesson.number}{exercise.letter}</div>
            <div>
              <span className="section-label">Studio coach</span>
              <h2>{exercise.title}</h2>
            </div>
          </div>

          <div className="instruction-card instruction-card-primary">
            <span className="section-label">Play with this</span>
            <p>{exercise.instruction}</p>
          </div>

          <div className="checks">
            <div className="checks-heading">
              <span className="section-label">{exercise.checksLabel}</span>
              <strong>{checks.filter((check) => check.complete).length}/{checks.length}</strong>
            </div>
            {checks.map((check) => (
              <div className={check.complete ? "check is-complete" : "check"} key={check.label}>
                <span>{check.complete ? "✓" : "○"}</span>
                <p>{check.label}</p>
              </div>
            ))}
          </div>

          {(exerciseReady || exerciseCompleted) && (
            <div className="ready-banner">
              <span>✓</span>
              <div>
                <strong>{exerciseCompleted ? "Saved!" : "Nice — you found it."}</strong>
                <small>{exerciseCompleted ? "You can keep experimenting or move on." : exercise.successLabel}</small>
              </div>
            </div>
          )}

          <button
            className="lesson-action"
            disabled={(!exerciseReady && !exerciseCompleted) || (lessonCompleted && !nextLesson && isLastExercise)}
            onClick={advance}
          >
            <span>{actionLabel}</span>
            <b>→</b>
          </button>

          <button className="text-button" onClick={resetWorkspace}>
            ↺ Reset this instrument
          </button>

          <div className="lesson-reset-block">
            <button
              className={confirmLessonReset ? "text-button lesson-reset-confirm" : "text-button"}
              onClick={resetCurrentLessonProgress}
            >
              {confirmLessonReset
                ? "Confirm · lose this lesson's progress"
                : "↺ Reset lesson progress"}
            </button>
            <small>
              {confirmLessonReset
                ? "This clears completed exercises for this lesson. Your musical project stays intact."
                : "Start this lesson again from A without deleting your music."}
            </small>
            {confirmLessonReset && (
              <button
                className="lesson-reset-cancel"
                onClick={() => setConfirmLessonReset(false)}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="coach-footer">
            <span className="section-label">Studio progress</span>
            <p>
              {implementedLessons.length} lessons ·{" "}
              {implementedLessons.reduce((total, item) => total + item.exercises.length, 0)} experiments
            </p>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}

export default App;
