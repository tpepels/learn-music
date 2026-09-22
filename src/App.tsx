import { useEffect, useMemo, useState } from "react";
import { audioEngine } from "./audio/engine";
import { resolveTransportWorkspace } from "./app/transportRouting";
import { ArrangementWorkspace } from "./components/ArrangementWorkspace";
import { AdvancedHarmonyWorkspace } from "./components/AdvancedHarmonyWorkspace";
import { AutomationDynamicsWorkspace } from "./components/AutomationDynamicsWorkspace";
import { BassWorkspace } from "./components/BassWorkspace";
import { ChordWorkspace } from "./components/ChordWorkspace";
import { CreateMode } from "./components/CreateMode";
import { DrumWorkspace } from "./components/DrumWorkspace";
import { EffectsWorkspace } from "./components/EffectsWorkspace";
import { EqWorkspace } from "./components/EqWorkspace";
import { FinalProjectWorkspace } from "./components/FinalProjectWorkspace";
import { GrooveFeelWorkspace } from "./components/GrooveFeelWorkspace";
import { HarmonicFunctionWorkspace } from "./components/HarmonicFunctionWorkspace";
import { MelodyHarmonyWorkspace } from "./components/MelodyHarmonyWorkspace";
import { MotifWorkspace } from "./components/MotifWorkspace";
import { MixerWorkspace } from "./components/MixerWorkspace";
import { MinorTonalityWorkspace } from "./components/MinorTonalityWorkspace";
import { LearningPanel } from "./components/LearningPanel";
import { MelodyWorkspace, PianoKeyWorkspace } from "./components/PianoWorkspace";
import { PhraseFormWorkspace } from "./components/PhraseFormWorkspace";
import { ReferenceWorkspace } from "./components/ReferenceWorkspace";
import { SaturationWorkspace } from "./components/SaturationWorkspace";
import { SidechainWorkspace } from "./components/SidechainWorkspace";
import { StereoWorkspace } from "./components/StereoWorkspace";
import { StudioMode } from "./components/StudioMode";
import { SynthWorkspace } from "./components/SynthWorkspace";
import { TextureWorkspace } from "./components/TextureWorkspace";
import { VoicingWorkspace } from "./components/VoicingWorkspace";
import {
  courseOutline,
  getLesson,
  getNextImplementedLesson,
} from "./lessons/course";
import { getAdvanceDestination } from "./lessons/progression";
import { isExerciseReady } from "./lessons/exerciseReadiness";
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
      if (
        workspace === "melody" ||
        workspace === "motif" ||
        workspace === "melody-harmony" ||
        workspace === "minor-key" ||
        workspace === "harmonic-minor"
      ) {
        await audioEngine.playMelody(bpm, setCurrentStep);
      } else if (
        workspace === "chords" ||
        workspace === "voicing" ||
        workspace === "harmonic-function" ||
        workspace === "minor-harmony" ||
        workspace === "seventh-harmony" ||
        workspace === "borrowed-harmony"
      ) {
        await audioEngine.playChords(bpm, setCurrentStep);
      } else if (workspace === "bass") {
        await audioEngine.playBass(bpm, setCurrentStep);
      } else if (
        workspace === "arrangement" ||
        workspace === "mixer" ||
        workspace === "automation-dynamics" ||
        workspace === "effects" ||
        workspace === "final-project" ||
        workspace === "phrase-form" ||
        workspace === "texture" ||
        workspace === "eq" ||
        workspace === "saturation" ||
        workspace === "sidechain" ||
        workspace === "stereo" ||
        workspace === "reference"
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
    case "motif":
      return <MotifWorkspace />;
    case "melody-harmony":
      return <MelodyHarmonyWorkspace />;
    case "harmonic-function":
      return <HarmonicFunctionWorkspace />;
    case "phrase-form":
      return <PhraseFormWorkspace />;
    case "texture":
      return <TextureWorkspace />;
    case "eq":
      return <EqWorkspace />;
    case "saturation":
      return <SaturationWorkspace />;
    case "sidechain":
      return <SidechainWorkspace />;
    case "stereo":
      return <StereoWorkspace />;
    case "reference":
      return <ReferenceWorkspace />;
    case "minor-key":
      return <MinorTonalityWorkspace harmonic={false} />;
    case "harmonic-minor":
      return <MinorTonalityWorkspace harmonic />;
    case "minor-harmony":
      return <AdvancedHarmonyWorkspace mode="minor" />;
    case "seventh-harmony":
      return <AdvancedHarmonyWorkspace mode="sevenths" />;
    case "borrowed-harmony":
      return <AdvancedHarmonyWorkspace mode="borrowed" />;
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
  "composition.motif-development": "◆",
  "composition.melody-over-harmony": "♪",
  "harmony.function": "→",
  "composition.phrase-form": "▤",
  "composition.texture-orchestration": "⌘",
  "production.eq-spectral-balance": "⌁",
  "production.saturation": "≈",
  "production.sidechain": "⇣",
  "production.stereo-mono": "↔",
  "production.reference-mixing": "A/B",
  "harmony.relative-minor": "♭3",
  "harmony.harmonic-minor": "♯7",
  "harmony.minor-cadences": "V7",
  "harmony.seventh-chords": "7",
  "harmony.modal-mixture": "⇆",
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
  const formSettings = useStudioStore((state) => state.formSettings);
  const textureSettings = useStudioStore((state) => state.textureSettings);
  const eqSettings = useStudioStore((state) => state.eqSettings);
  const saturationSettings = useStudioStore((state) => state.saturationSettings);
  const sidechainSettings = useStudioStore((state) => state.sidechainSettings);
  const stereoSettings = useStudioStore((state) => state.stereoSettings);
  const referenceMixSettings = useStudioStore((state) => state.referenceMixSettings);
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
  const resetFormSettings = useStudioStore((state) => state.resetFormSettings);
  const resetTextureSettings = useStudioStore((state) => state.resetTextureSettings);
  const resetEq = useStudioStore((state) => state.resetEq);
  const resetSaturation = useStudioStore((state) => state.resetSaturation);
  const resetSidechain = useStudioStore((state) => state.resetSidechain);
  const resetStereo = useStudioStore((state) => state.resetStereo);
  const resetReferenceMix = useStudioStore((state) => state.resetReferenceMix);
  const resetLessonProgress = useStudioStore((state) => state.resetLessonProgress);
  const setAppMode = useStudioStore((state) => state.setAppMode);

  const lesson = getLesson(currentLessonId);
  const storedExerciseIndex = exerciseIndexByLesson[lesson.id] ?? 0;
  const exerciseIndex = Math.min(storedExerciseIndex, lesson.exercises.length - 1);
  const exercise = lesson.exercises[exerciseIndex];
  const nextLesson = getNextImplementedLesson(currentLessonId);

  const exerciseStateFingerprint = useMemo(
    () =>
      JSON.stringify({
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
        formSettings,
        textureSettings,
        eqSettings,
        saturationSettings,
        sidechainSettings,
        stereoSettings,
        referenceMixSettings,
      }),
    [
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
      formSettings,
      textureSettings,
      eqSettings,
      saturationSettings,
      sidechainSettings,
      stereoSettings,
      referenceMixSettings,
    ],
  );
  const [exerciseEntry, setExerciseEntry] = useState({
    id: exercise.id,
    fingerprint: exerciseStateFingerprint,
  });

  useEffect(() => {
    setExerciseEntry({
      id: exercise.id,
      fingerprint: exerciseStateFingerprint,
    });
    // Snapshot only when a different exercise opens; later project edits must not
    // move the baseline or inherited state would count as fresh work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

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

  useEffect(() => {
    audioEngine.setTextureSettings(textureSettings);
  }, [textureSettings]);

  useEffect(() => {
    audioEngine.setEqSettings(eqSettings);
  }, [eqSettings]);

  useEffect(() => {
    audioEngine.setSaturationSettings(saturationSettings);
  }, [saturationSettings]);

  useEffect(() => {
    audioEngine.setSidechainSettings(sidechainSettings);
  }, [sidechainSettings]);

  useEffect(() => {
    audioEngine.setStereoSettings(stereoSettings);
  }, [stereoSettings]);

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
        formSettings,
        textureSettings,
        eqSettings,
        saturationSettings,
        sidechainSettings,
        stereoSettings,
        referenceMixSettings,
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
      formSettings,
      textureSettings,
      eqSettings,
      saturationSettings,
      sidechainSettings,
      stereoSettings,
      referenceMixSettings,
    ],
  );

  const checksReady = checks.every((check) => check.complete);
  const exerciseCompleted = completedExerciseIds.includes(exercise.id);
  const exerciseChangedSinceEntry =
    exerciseEntry.id === exercise.id &&
    exerciseEntry.fingerprint !== exerciseStateFingerprint;
  const exerciseReady = isExerciseReady({
    checksReady,
    completed: exerciseCompleted,
    entryExerciseId: exerciseEntry.id,
    currentExerciseId: exercise.id,
    entryFingerprint: exerciseEntry.fingerprint,
    currentFingerprint: exerciseStateFingerprint,
  });
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
      case "motif":
      case "melody-harmony":
        clearMelody();
        break;
      case "harmonic-function":
        clearChords();
        break;
      case "phrase-form":
        resetFormSettings();
        break;
      case "texture":
        resetTextureSettings();
        break;
      case "eq":
        resetEq();
        break;
      case "saturation":
        resetSaturation();
        break;
      case "sidechain":
        resetSidechain();
        break;
      case "stereo":
        resetStereo();
        break;
      case "reference":
        resetReferenceMix();
        break;
      case "minor-key":
      case "harmonic-minor":
        clearPitchClasses();
        clearMelody();
        break;
      case "minor-harmony":
      case "seventh-harmony":
      case "borrowed-harmony":
        clearChords();
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
    if (
      checksReady &&
      !exerciseCompleted &&
      !exerciseChangedSinceEntry
    ) {
      return "Try one change here to continue";
    }
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
          </div>
        </div>

        <div className="lesson-title">
          {appMode === "learn" ? (
            <>
              <span className="topbar-lesson-kicker">LESSON {String(lesson.number).padStart(2, "0")}</span>
              <strong>{lesson.title}</strong>

            </>
          ) : appMode === "create" ? (
            <>
              <span className="topbar-lesson-kicker">CREATE MODE</span>
              <strong>Open-ended briefs</strong>

            </>
          ) : (
            <>
              <span className="topbar-lesson-kicker">STUDIO MODE</span>
              <strong>Your project</strong>

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
            <strong>Lessons</strong>
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

          </div>
        </aside>

        <main className="music-panel">
          <section className="music-intro">
            <h1>{exercise.title}</h1>
            <p>{exercise.learn}</p>
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
          <div className="task-panel">
            <span className="section-label">Your task</span>
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

            {confirmLessonReset && (
              <button
                className="lesson-reset-cancel"
                onClick={() => setConfirmLessonReset(false)}
              >
                Cancel
              </button>
            )}
          </div>


        </aside>
      </div>
      )}
    </div>
  );
}

export default App;
