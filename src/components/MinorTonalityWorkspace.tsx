import { useEffect } from "react";
import { audioEngine } from "../audio/engine";
import {
  isMidiInTonalContext,
  keyLabel,
  midiNoteNameInContext,
  normalizePitchClass,
  pitchClassNameInContext,
  scaleDegreePitchClass,
  scalePitchClassNames,
  type TonalContext,
  type TonalMode,
} from "../music/harmony";
import {
  MELODY_STEPS,
  chromaticPitches,
  noteDurationLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import {
  findMonophonicNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";
import { HarmonyKeyControl } from "./HarmonyKeyControl";

const minorRollPitches = [
  ...chromaticPitches,
  { midi: 59, name: "B3", pitchClass: "B", black: false },
  { midi: 58, name: "B♭3", pitchClass: "B♭", black: true },
  { midi: 57, name: "A3", pitchClass: "A", black: false },
] as const;

export function MinorTonalityWorkspace({ harmonic }: { harmonic: boolean }) {
  const selectedPitchClasses = useStudioStore((state) => state.selectedPitchClasses);
  const togglePitchClass = useStudioStore((state) => state.togglePitchClass);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setTonalContext = useStudioStore((state) => state.setTonalContext);
  const melody = useStudioStore((state) => state.melody);
  const durations = useStudioStore((state) => state.melodyDurations);
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);
  const setMelodyDuration = useStudioStore((state) => state.setMelodyDuration);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const desiredMode: TonalMode = harmonic ? "harmonic-minor" : "natural-minor";

  useEffect(() => {
    if (tonalContext.mode !== desiredMode) {
      setTonalContext({
        tonic: tonalContext.mode === "major" ? 9 : tonalContext.tonic,
        mode: desiredMode,
      });
    }
  }, [harmonic, setTonalContext]);

  const context: TonalContext =
    tonalContext.mode === desiredMode
      ? tonalContext
      : {
          tonic: tonalContext.mode === "major" ? (9 as const) : tonalContext.tonic,
          mode: desiredMode,
        };
  const scale = scalePitchClassNames(context);
  const leadingPitchClass = scaleDegreePitchClass(context, 7);
  const chromaticKeys = Array.from({ length: 12 }, (_, index) => {
    const pitchClass = normalizePitchClass(context.tonic + index);
    const midi = 60 + pitchClass;
    return {
      pitchClass,
      midi,
      name: pitchClassNameInContext(pitchClass, context),
      black: [1, 3, 6, 8, 10].includes(pitchClass),
    };
  });

  const toggleScalePitch = async (pitchClass: string, midi: number) => {
    togglePitchClass(pitchClass);
    await audioEngine.playPianoNote(midi);
  };

  const { beginNoteDrag, moveNoteDrag } = useNoteLengthDrag({
    maxSteps: MELODY_STEPS,
    addNote: (step, midi) => setMelodyStep(step, midi),
    removeNote: (step, midi) => setMelodyStep(step, midi),
    setDuration: (step, _midi, duration) =>
      setMelodyDuration(step, duration),
    audition: (midi) => audioEngine.playPianoNote(midi),
  });

  return (
    <div className="minor-tonality-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Key map · piano roll</span>
          <h2>{keyLabel(context)}</h2>
          <div className="daw-strip">
            <span>TONIC {pitchClassNameInContext(context.tonic, context)}</span>
            <span>
              {harmonic
                ? "RAISED 7TH " + pitchClassNameInContext(leadingPitchClass, context)
                : "NATURAL MINOR"}
            </span>
            <span>GRID 1/8</span>
          </div>
        </div>
        <span className="workspace-hint">
          Select scale notes above, then write directly in the piano roll below. Drag a note right to sustain it.
        </span>
      </div>

      <HarmonyKeyControl
        modes={[desiredMode]}
        showMode={false}
      />

      <div className="minor-scale-summary">
        <div>
          <span className="section-label">{harmonic ? "Harmonic minor" : "Natural minor"}</span>
          <strong>{scale.join(" · ")}</strong>
          <small>
            {harmonic
              ? "The raised seventh sits one semitone below the tonic and creates a strong leading tone."
              : "The tonic determines which note behaves as home; the interval pattern determines the minor scale."}
          </small>
        </div>
        <div className="scale-degree-strip">
          {["1","2","♭3","4","5","♭6",harmonic ? "7" : "♭7"].map((degree) => (
            <span key={degree}>{degree}</span>
          ))}
        </div>
      </div>

      <div className="minor-keyboard" aria-label={keyLabel(context) + " chromatic keyboard"}>
        {chromaticKeys.map((key) => {
          const selected = selectedPitchClasses.includes(key.name);
          const scaleTone = isMidiInTonalContext(key.midi, context);
          const tonic = key.pitchClass === context.tonic;
          const leading = harmonic && key.pitchClass === leadingPitchClass;
          return (
            <button
              key={key.pitchClass}
              className={[
                "minor-key",
                key.black ? "is-black" : "",
                scaleTone ? "is-scale-tone" : "",
                tonic ? "is-tonic" : "",
                leading ? "is-leading-tone" : "",
                selected ? "is-selected" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => toggleScalePitch(key.name, key.midi)}
              aria-pressed={selected}
            >
              <strong>{key.name}</strong>
              <small>
                {tonic
                  ? "TONIC"
                  : leading
                    ? "LEADING"
                    : scaleTone
                      ? "IN KEY"
                      : "CHROMATIC"}
              </small>
            </button>
          );
        })}
      </div>

      <div className="minor-roll" onPointerMove={moveNoteDrag}>
        {minorRollPitches.map((pitch) => {
          const tonic = normalizePitchClass(pitch.midi) === context.tonic;
          const leading =
            harmonic &&
            normalizePitchClass(pitch.midi) === leadingPitchClass;
          return (
            <div
              key={pitch.midi}
              className={[
                "minor-roll-row",
                pitch.black ? "is-black" : "",
                isMidiInTonalContext(pitch.midi, context) ? "is-key-row" : "",
                tonic ? "is-tonic-row" : "",
                leading ? "is-leading-row" : "",
              ].filter(Boolean).join(" ")}
            >
              <button
                className="minor-note-label"
                onClick={() => audioEngine.playPianoNote(pitch.midi)}
              >
                {midiNoteNameInContext(pitch.midi, context)}
              </button>

              {Array.from({ length: MELODY_STEPS }, (_, step) => {
                const active = melody[step] === pitch.midi;
                const coveringStart = findMonophonicNoteStart(
                  melody,
                  durations,
                  pitch.midi,
                  step,
                );
                const sustained =
                  coveringStart !== null && coveringStart !== step;
                const duration =
                  coveringStart === null ? 1 : durations[coveringStart] ?? 1;
                const noteEnd =
                  coveringStart !== null &&
                  coveringStart + duration - 1 === step;

                return (
                  <button
                    key={step}
                    className={[
                      "minor-roll-cell",
                      active ? "is-active is-note-start" : "",
                      sustained ? "is-sustain" : "",
                      noteEnd && duration > 1 ? "is-note-end" : "",
                      isPlaying && currentStep === step ? "is-playhead" : "",
                      step === 8 ? "is-phrase-start" : "",
                    ].filter(Boolean).join(" ")}
                    data-note-step={step}
                    data-note-midi={pitch.midi}
                    onPointerDown={(event) =>
                      beginNoteDrag(event, {
                        step,
                        midi: pitch.midi,
                        isStart: active,
                        coveringStart,
                      })
                    }
                    aria-label={
                      (active || sustained ? "Note " : "Set step " + (step + 1) + " to ") +
                      midiNoteNameInContext(pitch.midi, context) +
                      (active || sustained
                        ? " · length " + noteDurationLabel(duration)
                        : "")
                    }
                    aria-pressed={active || sustained}
                    title={
                      active || sustained
                        ? midiNoteNameInContext(pitch.midi, context) +
                          " · " +
                          noteDurationLabel(duration) +
                          " · drag horizontally to resize"
                        : "Click or drag to draw " + midiNoteNameInContext(pitch.midi, context)
                    }
                  >
                    <span />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="minor-roll-legend">
        <span><i className="is-tonic" /> tonic {pitchClassNameInContext(context.tonic, context)}</span>
        <span><i className="is-scale" /> scale tone</span>
        {harmonic && (
          <span>
            <i className="is-leading" /> leading tone {pitchClassNameInContext(leadingPitchClass, context)}
          </span>
        )}
        <span><i className="is-outside" /> chromatic note</span>
        <span>Drag right to lengthen a note in 1/8 steps</span>
      </div>
    </div>
  );
}
