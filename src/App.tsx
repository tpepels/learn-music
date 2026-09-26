import { useEffect, useMemo, useState } from "react";
import { audioEngine } from "./audio/engine";
import { effectiveMonoAudition } from "./audio/productionControlPolicy";
import { isProductionAuditionWorkspace } from "./audio/workspaceLayerPolicy";
import {
  canWorkspaceUseTransport,
  resolveLearningFocusTrack,
  resolveTransportWorkspace,
} from "./app/transportRouting";
import { ArrangementWorkspace } from "./components/ArrangementWorkspace";
import { AutomationDynamicsWorkspace } from "./components/AutomationDynamicsWorkspace";
import { BassWorkspace } from "./components/BassWorkspace";
import { ChordWorkspace } from "./components/ChordWorkspace";
import { CompositionStudyWorkspace } from "./components/CompositionStudyWorkspace";
import { CreateMode } from "./components/CreateMode";
import { DrumWorkspace } from "./components/DrumWorkspace";
import { EffectsWorkspace } from "./components/EffectsWorkspace";
import { EqWorkspace } from "./components/EqWorkspace";
import { FinalProjectWorkspace } from "./components/FinalProjectWorkspace";
import { GrooveFeelWorkspace } from "./components/GrooveFeelWorkspace";
import { InstrumentPaletteWorkspace } from "./components/InstrumentPaletteWorkspace";
import { HarmonySequencerWorkspace } from "./components/HarmonySequencerWorkspace";
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
import { TranspositionWorkspace } from "./components/TranspositionWorkspace";
import { VoicingWorkspace } from "./components/VoicingWorkspace";
import {
  getFirstIncompleteLesson,
  getLesson,
  getNextImplementedLesson,
  getTrackForLesson,
  getTrackOutline,
  learningTracks,
  type LearningTrackId,
} from "./lessons/course";
import { getAdvanceDestination } from "./lessons/progression";
import { RECOVERED_LESSON_IDS } from "./learning/catchUp";
import { isExerciseReady } from "./lessons/exerciseReadiness";
import type { ExerciseDefinition } from "./lessons/types";
import type { MixerTrackId } from "./music/model";
import { useStudioStore } from "./state/studio";

async function startWorkspacePlayback(
  workspace: ExerciseDefinition["workspace"],
  bpm: number,
  onStep: (step: number) => void,
): Promise<boolean> {
  if (
    workspace === "melody" ||
    workspace === "motif" ||
    workspace === "minor-key" ||
    workspace === "harmonic-minor"
  ) {
    return audioEngine.playMelodyWithGroove(bpm, onStep);
  }

  if (workspace === "melody-harmony") {
    return audioEngine.playHarmonyContext(bpm, onStep, true);
  }

  if (workspace === "transposition") {
    return audioEngine.playChordMelody(bpm, onStep);
  }

  if (workspace === "composition-study") {
    return audioEngine.playStudySequence(bpm, onStep);
  }

  if (workspace === "jazz-piano") {
    return audioEngine.playJazzPianoStudy(bpm, onStep);
  }

  if (
    workspace === "harmony-song" ||
    workspace === "harmonic-function" ||
    workspace === "minor-harmony"
  ) {
    return audioEngine.playHarmonyContext(bpm, onStep, true);
  }

  if (
    workspace === "seventh-harmony" ||
    workspace === "borrowed-harmony"
  ) {
    return audioEngine.playHarmonyContext(bpm, onStep, false);
  }

  if (
    workspace === "chords" ||
    workspace === "voicing"
  ) {
    return audioEngine.playChords(bpm, onStep);
  }

  if (workspace === "bass") {
    return audioEngine.playBass(bpm, onStep);
  }

  if (workspace === "phrase-form") {
    return audioEngine.playForm(bpm, onStep);
  }

  if (
    workspace === "arrangement" ||
    workspace === "final-project" ||
    workspace === "texture"
  ) {
    return audioEngine.playArrangement(bpm, onStep);
  }

  if (isProductionAuditionWorkspace(workspace)) {
    return audioEngine.playProductionMix(bpm, onStep);
  }

  return audioEngine.playDrums(bpm, onStep);
}

function Transport({
  workspace,
  learningFocusTrack,
}: {
  workspace: ExerciseDefinition["workspace"];
  learningFocusTrack: MixerTrackId | null;
}) {
  const bpm = useStudioStore((state) => state.bpm);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const setBpm = useStudioStore((state) => state.setBpm);
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const setCurrentStep = useStudioStore((state) => state.setCurrentStep);
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [soloCurrent, setSoloCurrent] = useState(false);

  const canPlay = canWorkspaceUseTransport(workspace);

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
      audioEngine.setLearningFocusTrack(learningFocusTrack);
      audioEngine.setLearningSolo(soloCurrent);
      const started = await startWorkspacePlayback(
        workspace,
        bpm,
        setCurrentStep,
      );
      if (!started) return;

      recordLearningExperiment("transport.play", workspace);
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

  useEffect(() => {
    audioEngine.setLearningFocusTrack(learningFocusTrack);
    if (learningFocusTrack === null) {
      setSoloCurrent(false);
    }
  }, [learningFocusTrack]);

  useEffect(() => {
    audioEngine.setLearningSolo(soloCurrent);
  }, [soloCurrent]);

  useEffect(() => {
    // A workspace change must also cancel a Play request that is still waiting
    // for samples to load, even though isPlaying has not become true yet.
    audioEngine.cancelPendingTransportStart();

    if (!isPlaying) return;

    if (!canPlay) {
      audioEngine.stop();
      setPlaying(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const started = await startWorkspacePlayback(
          workspace,
          bpm,
          setCurrentStep,
        );
        if (cancelled || !started) return;
      } catch (error) {
        if (cancelled) return;
        console.error(
          "PLAY / LAB playback failed while changing workspace",
          error,
        );
        audioEngine.stop();
        setPlaying(false);
        setPlaybackError(
          error instanceof Error
            ? error.message
            : "Audio could not continue in this lesson.",
        );
      }
    })();

    return () => {
      cancelled = true;
      audioEngine.cancelPendingTransportStart();
    };
    // Deliberately restart only when the playback workspace changes.
    // BPM changes are handled live by audioEngine.setBpm().
  }, [workspace]);

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

      {learningFocusTrack && (
        <button
          className={soloCurrent ? "transport-focus-toggle is-active" : "transport-focus-toggle"}
          type="button"
          aria-pressed={soloCurrent}
          title={soloCurrent ? "Hear the earlier parts again" : "Temporarily mute earlier parts"}
          onClick={() => setSoloCurrent((current) => !current)}
        >
          {soloCurrent ? "Earlier parts muted" : "Mute earlier parts"}
        </button>
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

function ExerciseLights({
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
    <nav className="exercise-lights" aria-label="Lesson exercise progress">
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
              "exercise-light",
              active ? "is-active" : "",
              completed ? "is-complete" : "",
            ].filter(Boolean).join(" ")}
            disabled={!unlocked}
            onClick={() => onOpen(index)}
            title={item.letter + " · " + item.title}
            aria-label={
              lessonId +
              " exercise " +
              item.letter +
              ": " +
              item.title +
              (completed ? " (completed)" : "")
            }
          >
            {item.letter}
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
    case "harmony-song":
      return <HarmonySequencerWorkspace />;
    case "synth":
      return <SynthWorkspace exerciseId={exercise.id} />;
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
      return <HarmonySequencerWorkspace mode="function" />;
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
      return <HarmonySequencerWorkspace mode="minor" />;
    case "seventh-harmony":
      return <HarmonySequencerWorkspace mode="sevenths" />;
    case "borrowed-harmony":
      return <HarmonySequencerWorkspace mode="borrowed" />;
    case "instrument-palette":
      return <InstrumentPaletteWorkspace />;
    case "transposition":
      return <TranspositionWorkspace />;
    case "composition-study":
      return <CompositionStudyWorkspace exerciseId={exercise.id} />;
    case "jazz-piano":
      return (
        <HarmonySequencerWorkspace
          mode="jazz"
          showTargets={
            exercise.id.startsWith("levine.major-modes-ii-v-i") ||
            exercise.id.startsWith("levine.three-note-voicings")
          }
        />
      );
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
  "pitch.intervals-transposition": "↕",
  "harmony.chord-colour": "9",
  "rhythm.phrasing-space": "⌇",
  "production.gain-staging-loudness": "dB",
  "style.house": "H",
  "style.funk": "F",
  "style.hip-hop": "HH",
  "style.ambient": "∞",
  "style.pop": "★",
  "schoenberg.phrase-motive": "S",
  "schoenberg.developing-variation": "S",
  "schoenberg.connecting-motive-forms": "S",
  "schoenberg.beginning-sentence": "S",
  "schoenberg.completing-sentence": "S",
  "schoenberg.period": "S",
  "schoenberg.accompaniment": "S",
  "schoenberg.character-mood": "S",
  "schoenberg.melody-theme": "S",
  "schoenberg.self-criticism": "S",
  "belkin.punctuating": "B",
  "belkin.presenting": "B",
  "belkin.binary-form": "B",
  "levine.intervals-triads": "J",
  "levine.major-modes-ii-v-i": "J",
  "levine.three-note-voicings": "J",
  "levine.sus-phrygian": "J",
  "levine.adding-notes": "J",
  "levine.tritone-substitution": "J",
  "levine.left-hand-voicings": "J",
  "levine.altered-left-hand-voicings": "J",
  "levine.scale-theory": "J",
  "levine.putting-scales-to-work": "J",
  "levine.practicing-scales": "J",
  "levine.so-what-chords": "J",
  "levine.fourth-chords": "J",
  "levine.upper-structures": "J",
};

function App() {
  const bpm = useStudioStore((state) => state.bpm);
  const currentLessonId = useStudioStore((state) => state.currentLessonId);
  const exerciseIndexByLesson = useStudioStore((state) => state.exerciseIndexByLesson);
  const completedExerciseIds = useStudioStore((state) => state.completedExerciseIds);
  const activePattern = useStudioStore((state) => state.activePattern);
  const patterns = useStudioStore((state) => state.patterns);
  const completedLessonIds = useStudioStore((state) => state.completedLessonIds);
  const compositionStudy = useStudioStore((state) => state.compositionStudy);
  const selectedPitchClasses = useStudioStore((state) => state.selectedPitchClasses);
  const melody = useStudioStore((state) => state.melody);
  const melodyDurations = useStudioStore((state) => state.melodyDurations);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const harmonicProgression = useStudioStore((state) => state.harmonicProgression);
  const chordProgression = useStudioStore((state) => state.chordProgression);
  const harmonySequence = useStudioStore((state) => state.harmonySequence);
  const harmonyDurations = useStudioStore((state) => state.harmonyDurations);
  const accompanimentPattern = useStudioStore((state) => state.accompanimentPattern);
  const synthSettings = useStudioStore((state) => state.synthSettings);
  const arrangement = useStudioStore((state) => state.arrangement);
  const mixerSettings = useStudioStore((state) => state.mixerSettings);
  const automationSettings = useStudioStore((state) => state.automationSettings);
  const dynamicsSettings = useStudioStore((state) => state.dynamicsSettings);
  const effectsSettings = useStudioStore((state) => state.effectsSettings);
  const projectMilestones = useStudioStore((state) => state.projectMilestones);
  const voicingSettings = useStudioStore((state) => state.voicingSettings);
  const bassSequence = useStudioStore((state) => state.bassSequence);
  const bassDurations = useStudioStore((state) => state.bassDurations);
  const grooveFeelSettings = useStudioStore((state) => state.grooveFeelSettings);
  const formSettings = useStudioStore((state) => state.formSettings);
  const textureSettings = useStudioStore((state) => state.textureSettings);
  const instrumentSettings = useStudioStore((state) => state.instrumentSettings);
  const eqSettings = useStudioStore((state) => state.eqSettings);
  const saturationSettings = useStudioStore((state) => state.saturationSettings);
  const sidechainSettings = useStudioStore((state) => state.sidechainSettings);
  const stereoSettings = useStudioStore((state) => state.stereoSettings);
  const referenceMixSettings = useStudioStore((state) => state.referenceMixSettings);
  const learningExperiments = useStudioStore((state) => state.learningExperiments);
  const appMode = useStudioStore((state) => state.appMode);
  const [studioTransportWorkspace, setStudioTransportWorkspace] =
    useState<ExerciseDefinition["workspace"]>("compare");
  const [confirmLessonReset, setConfirmLessonReset] = useState(false);
  const [confirmCatchUp, setConfirmCatchUp] = useState(false);

  const setCurrentLesson = useStudioStore((state) => state.setCurrentLesson);
  const setExerciseIndex = useStudioStore((state) => state.setExerciseIndex);
  const completeExercise = useStudioStore((state) => state.completeExercise);
  const completeLesson = useStudioStore((state) => state.completeLesson);
  const recoverToLessonFive = useStudioStore(
    (state) => state.recoverToLessonFive,
  );
  const setPlaying = useStudioStore((state) => state.setPlaying);
  const resetPattern = useStudioStore((state) => state.resetPattern);
  const clearPitchClasses = useStudioStore((state) => state.clearPitchClasses);
  const clearMelody = useStudioStore((state) => state.clearMelody);
  const clearChords = useStudioStore((state) => state.clearChords);
  const clearHarmonySequence = useStudioStore((state) => state.clearHarmonySequence);
  const resetAccompanimentPattern = useStudioStore(
    (state) => state.resetAccompanimentPattern,
  );
  const resetSynthSettings = useStudioStore((state) => state.resetSynthSettings);
  const clearArrangement = useStudioStore((state) => state.clearArrangement);
  const resetMixer = useStudioStore((state) => state.resetMixer);
  const resetAutomation = useStudioStore((state) => state.resetAutomation);
  const resetDynamics = useStudioStore((state) => state.resetDynamics);
  const resetEffectsWorkspace = useStudioStore(
    (state) => state.resetEffectsWorkspace,
  );
  const resetVoicings = useStudioStore((state) => state.resetVoicings);
  const clearBass = useStudioStore((state) => state.clearBass);
  const resetGrooveFeel = useStudioStore((state) => state.resetGrooveFeel);
  const resetFormSettings = useStudioStore((state) => state.resetFormSettings);
  const resetTextureSettings = useStudioStore((state) => state.resetTextureSettings);
  const resetInstrumentSettings = useStudioStore((state) => state.resetInstrumentSettings);
  const resetEq = useStudioStore((state) => state.resetEq);
  const resetSaturation = useStudioStore((state) => state.resetSaturation);
  const resetSidechain = useStudioStore((state) => state.resetSidechain);
  const resetStereoWorkspace = useStudioStore(
    (state) => state.resetStereoWorkspace,
  );
  const resetReferenceMix = useStudioStore((state) => state.resetReferenceMix);
  const resetLessonProgress = useStudioStore((state) => state.resetLessonProgress);
  const resetStudyExercise = useStudioStore((state) => state.resetStudyExercise);
  const setAppMode = useStudioStore((state) => state.setAppMode);
  const setActiveExerciseId = useStudioStore((state) => state.setActiveExerciseId);

  const lesson = getLesson(currentLessonId);
  const activeTrack = getTrackForLesson(lesson.id);
  const courseOutline = getTrackOutline(activeTrack.id);
  const storedExerciseIndex = exerciseIndexByLesson[lesson.id] ?? 0;
  const exerciseIndex = Math.min(storedExerciseIndex, lesson.exercises.length - 1);
  const exercise = lesson.exercises[exerciseIndex];
  const nextLesson = getNextImplementedLesson(currentLessonId);
  const experiments = learningExperiments[exercise.id] ?? {};

  useEffect(() => {
    audioEngine.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    setActiveExerciseId(exercise.id);
  }, [exercise.id, setActiveExerciseId]);

  useEffect(() => {
    audioEngine.setPattern(patterns[activePattern]);
  }, [patterns, activePattern]);

  useEffect(() => {
    audioEngine.setMelody(melody);
  }, [melody]);

  useEffect(() => {
    audioEngine.setMelodyDurations(melodyDurations);
  }, [melodyDurations]);

  useEffect(() => {
    audioEngine.setChordProgression(chordProgression);
  }, [chordProgression]);

  useEffect(() => {
    audioEngine.setTonalContext(tonalContext);
  }, [tonalContext]);

  useEffect(() => {
    audioEngine.setHarmonicProgression(harmonicProgression);
  }, [harmonicProgression]);

  useEffect(() => {
    audioEngine.setHarmonySequence(harmonySequence);
  }, [harmonySequence]);

  useEffect(() => {
    audioEngine.setHarmonyDurations(harmonyDurations);
  }, [harmonyDurations]);

  useEffect(() => {
    audioEngine.setAccompanimentPattern(accompanimentPattern);
  }, [accompanimentPattern]);

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
    audioEngine.setBassDurations(bassDurations);
  }, [bassDurations]);

  useEffect(() => {
    audioEngine.setGrooveFeelSettings(grooveFeelSettings);
  }, [grooveFeelSettings]);

  useEffect(() => {
    audioEngine.setFormSettings(formSettings);
  }, [formSettings]);

  useEffect(() => {
    audioEngine.setTextureSettings(textureSettings);
  }, [textureSettings]);

  useEffect(() => {
    audioEngine.setInstrumentSettings(instrumentSettings);
  }, [instrumentSettings]);

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
    audioEngine.setStereoSettings({
      ...stereoSettings,
      monoAudition: effectiveMonoAudition(
        exercise.workspace,
        stereoSettings.monoAudition,
      ),
    });
  }, [stereoSettings, exercise.workspace]);

  const checks = useMemo(
    () =>
      exercise.evaluate({
        A: patterns.A,
        B: patterns.B,
        selectedPitchClasses,
        melody,
        melodyDurations,
        tonalContext,
        harmonicProgression,
        chordProgression,
        harmonySequence,
        harmonyDurations,
        accompanimentPattern,
        synthSettings,
        arrangement,
        mixerSettings,
        automationSettings,
        dynamicsSettings,
        effectsSettings,
        projectMilestones,
        voicingSettings,
        bassSequence,
        bassDurations,
        grooveFeelSettings,
        formSettings,
        textureSettings,
        instrumentSettings,
        eqSettings,
        saturationSettings,
        sidechainSettings,
        stereoSettings,
        referenceMixSettings,
        experiments,
        compositionStudy,
      }),
    [
      exercise,
      patterns,
      selectedPitchClasses,
      melody,
      melodyDurations,
      tonalContext,
      harmonicProgression,
      chordProgression,
      harmonySequence,
      harmonyDurations,
      accompanimentPattern,
      synthSettings,
      arrangement,
      mixerSettings,
      automationSettings,
      dynamicsSettings,
      effectsSettings,
      projectMilestones,
      voicingSettings,
      bassSequence,
      bassDurations,
      grooveFeelSettings,
      formSettings,
      textureSettings,
      instrumentSettings,
      eqSettings,
      saturationSettings,
      sidechainSettings,
      stereoSettings,
      referenceMixSettings,
      experiments,
      compositionStudy,
    ],
  );

  const checksReady = checks.every((check) => check.complete);
  const exerciseCompleted = completedExerciseIds.includes(exercise.id);
  const exerciseReady = isExerciseReady({
    checksReady,
    completed: exerciseCompleted,
  });
  const lessonCompleted = completedLessonIds.includes(lesson.id);
  const isLastExercise = exerciseIndex === lesson.exercises.length - 1;

  const stopTransport = () => {
    audioEngine.stop();
    setPlaying(false);
  };

  const openLesson = (lessonId: string) => {
    if (lessonId === currentLessonId) return;
    setConfirmLessonReset(false);
    setCurrentLesson(lessonId);
  };

  const openTrack = (trackId: LearningTrackId) => {
    if (trackId === activeTrack.id) return;
    const destination = getFirstIncompleteLesson(trackId, completedLessonIds);
    setConfirmLessonReset(false);
    setCurrentLesson(destination.id);
  };

  const openExercise = (index: number) => {
    if (index === exerciseIndex) return;
    setConfirmLessonReset(false);
    setExerciseIndex(lesson.id, index);
  };

  const advance = (force = false) => {
    if (!force && !exerciseReady && !exerciseCompleted) return;
    setConfirmLessonReset(false);

    if (!exerciseCompleted) {
      completeExercise(exercise.id);
    }

    const destination = getAdvanceDestination(
      lesson,
      exerciseIndex,
      nextLesson,
    );

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
        resetAccompanimentPattern();
        break;
      case "harmony-song":
        clearChords();
        clearHarmonySequence();
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
        resetEffectsWorkspace();
        break;
      case "final-project":
        return;
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
        clearHarmonySequence();
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
        resetStereoWorkspace();
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
        clearHarmonySequence();
        break;
      case "instrument-palette":
        resetInstrumentSettings();
        break;
      case "composition-study":
        resetStudyExercise(exercise.id);
        break;
      case "jazz-piano":
        clearChords();
        clearHarmonySequence();
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

  const canRecoverToLessonFive = !RECOVERED_LESSON_IDS.every((id) =>
    completedLessonIds.includes(id),
  );

  const recoverBasics = () => {
    if (!confirmCatchUp) {
      setConfirmCatchUp(true);
      return;
    }

    audioEngine.stop();
    setPlaying(false);
    recoverToLessonFive();
    setConfirmCatchUp(false);
    setConfirmLessonReset(false);
  };

  const completedCount = activeTrack.lessons.filter((item) =>
    completedLessonIds.includes(item.id),
  ).length;
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
              <span className="topbar-lesson-kicker">
                {activeTrack.id === "schoenberg"
                  ? "S"
                  : activeTrack.id === "belkin"
                    ? "B"
                    : activeTrack.id === "levine"
                      ? "J"
                      : "LESSON "}
                {String(lesson.number).padStart(2, "0")}
              </span>
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
            learningFocusTrack={resolveLearningFocusTrack(
              appMode,
              exercise.workspace,
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
          <div className="track-switcher" role="group" aria-label="Learning track">
            {learningTracks.map((track) => (
              <button
                type="button"
                key={track.id}
                className={track.id === activeTrack.id ? "is-active" : ""}
                onClick={() => openTrack(track.id)}
              >
                <span>{track.label}</span>
                <strong>{track.title}</strong>
              </button>
            ))}
          </div>

          <div className="panel-heading track-heading">
            <span className="section-label">{activeTrack.label}</span>
            <strong>{activeTrack.title}</strong>
            <small>{activeTrack.description}</small>
          </div>

          <nav className="course-list" aria-label={activeTrack.title + " lessons"}>
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
                    {activeTrack.id === "schoenberg"
                      ? "S"
                      : activeTrack.id === "belkin"
                        ? "B"
                        : activeTrack.id === "levine"
                          ? "J"
                          : ""}
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

          {activeTrack.id === "play-lab" && canRecoverToLessonFive && (
            <div className="catch-up-card">
              <span className="section-label">Recovery</span>
              <strong>Already covered lessons 1–4?</strong>
              <p>
                Rebuild a starter groove, melody and harmony, mark the first four
                lessons complete, and continue at Sound & synthesis.
              </p>
              <button
                className={confirmCatchUp ? "catch-up-button is-confirming" : "catch-up-button"}
                type="button"
                onClick={recoverBasics}
              >
                {confirmCatchUp
                  ? "Confirm · replace the current project"
                  : "Recover to lesson 5"}
              </button>
              {confirmCatchUp && (
                <button
                  className="lesson-reset-cancel"
                  type="button"
                  onClick={() => setConfirmCatchUp(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </aside>

        <main className="music-panel">
          <section className="music-intro">
            <span className="lesson-context">{lesson.title}</span>
            <h1>{exercise.letter} · {exercise.title}</h1>
          </section>

          <LearningPanel exercise={exercise} lessonNumber={lesson.number} />

          <Workspace exercise={exercise} />
        </main>

        <aside className="teacher-panel">
          <ExerciseLights
            lessonId={lesson.id}
            exercises={lesson.exercises}
            currentIndex={exerciseIndex}
            completedExerciseIds={completedExerciseIds}
            onOpen={openExercise}
          />

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
                <strong>{exerciseCompleted ? "Completed" : "That works"}</strong>
                <small>{exerciseCompleted ? "Keep experimenting or move on." : exercise.successLabel}</small>
              </div>
            </div>
          )}

          <button
            className="lesson-action"
            disabled={(!exerciseReady && !exerciseCompleted) || (lessonCompleted && !nextLesson && isLastExercise)}
            onClick={() => advance()}
          >
            <span>{actionLabel}</span>
            <b>→</b>
          </button>

          {!exerciseReady && !exerciseCompleted && (
            <button
              className="text-button lesson-move-on"
              onClick={() => advance(true)}
            >
              Move on anyway →
            </button>
          )}

          {exercise.workspace !== "final-project" && (
            <button className="text-button" onClick={resetWorkspace}>
              ↺ Reset workspace
            </button>
          )}

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
