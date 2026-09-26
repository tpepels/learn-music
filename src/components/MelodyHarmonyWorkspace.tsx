import { useState } from "react";
import { audioEngine } from "../audio/engine";
import { resolveContextProgression } from "../audio/playbackFallbacks";
import {
  chordSymbol,
  harmonicChordPitchClasses,
  isMidiInTonalContext,
} from "../music/harmony";
import {
  MELODY_STEPS,
  chromaticPitches,
  noteDurationLabel,
} from "../music/model";
import { chordSlotForMelodyStep } from "../music/melodyHarmonyTimeline";
import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";
import {
  findMonophonicNoteStart,
  useNoteLengthDrag,
} from "./noteLengthDrag";

export function MelodyHarmonyWorkspace() {
  const melody = useStudioStore((state) => state.melody);
  const durations = useStudioStore((state) => state.melodyDurations);
  const projectChords = useStudioStore((state) => state.harmonicProgression);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const chords = resolveContextProgression(projectChords, tonalContext);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);
  const setMelodyDuration = useStudioStore((state) => state.setMelodyDuration);
  const [selectedPass, setSelectedPass] = useState<0 | 1>(0);

  const displayPass: 0 | 1 = isPlaying
    ? currentStep >= 16
      ? 1
      : 0
    : selectedPass;
  const firstBar = displayPass * 2;

  const { beginNoteDrag, moveNoteDrag } = useNoteLengthDrag({
    maxSteps: MELODY_STEPS,
    addNote: (step, midi) => setMelodyStep(step, midi),
    removeNote: (step, midi) => setMelodyStep(step, midi),
    setDuration: (step, _midi, duration) =>
      setMelodyDuration(step, duration),
    audition: (midi) => audioEngine.playPianoNote(midi),
  });

  return (
    <div className="melody-harmony-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Melody + harmony overlay</span>
          <h2>See the same phrase under four bars of harmony</h2>
          <div className="daw-strip">
            <span>CHORD TONE</span><span>SCALE TONE</span><span>CHROMATIC</span><span>RESOLUTION</span><span>2-BAR MELODY × 2</span>
          </div>
        </div>
        <span className="workspace-hint">
          Your melody is two bars long. Play repeats those 16 eighth-notes once across the four-bar chord progression: bars 1–2 first, then the same melody steps under bars 3–4.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "chords", "melody"] as const} />

      <div className="mh-context-tabs" role="group" aria-label="Harmony pass">
        <button
          type="button"
          className={displayPass === 0 ? "is-active" : ""}
          disabled={isPlaying}
          onClick={() => setSelectedPass(0)}
        >
          Bars 1–2 · first pass
        </button>
        <button
          type="button"
          className={displayPass === 1 ? "is-active" : ""}
          disabled={isPlaying}
          onClick={() => setSelectedPass(1)}
        >
          Bars 3–4 · repeated melody
        </button>
        {isPlaying && (
          <small>
            Playback is showing bars {displayPass === 0 ? "1–2" : "3–4"} automatically.
          </small>
        )}
      </div>

      <div className="harmony-overlay-header">
        <span>
          <small>{displayPass === 0 ? "FIRST PASS" : "REPEAT"}</small>
        </span>
        {chords.slice(firstBar, firstBar + 2).map((chord, index) => (
          <div key={firstBar + index}>
            <small>
              BAR {firstBar + index + 1} · MELODY STEPS {index * 8 + 1}–{index * 8 + 8}
            </small>
            <strong>{chord ? chordSymbol(chord, tonalContext) : "No chord"}</strong>
            <span>
              {chord
                ? harmonicChordPitchClasses(chord, tonalContext).join(" · ")
                : "set progression first"}
            </span>
          </div>
        ))}
      </div>

      <div className="melody-harmony-roll" onPointerMove={moveNoteDrag}>
        {chromaticPitches.map((pitch) => (
          <div className={pitch.black ? "mh-row is-black" : "mh-row"} key={pitch.midi}>
            <button
              className="mh-note-name"
              onClick={() => audioEngine.playPianoNote(pitch.midi)}
            >
              {pitch.name}
            </button>
            {melody.map((note, step) => {
              const chordSlot = chordSlotForMelodyStep(step, displayPass);
              const chord = chords[chordSlot];
              const active = note === pitch.midi;
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
              const chordTone = Boolean(
                chord &&
                  harmonicChordPitchClasses(chord, tonalContext).includes(
                    ((pitch.midi % 12) + 12) % 12,
                  ),
              );
              const scaleTone = isMidiInTonalContext(pitch.midi, tonalContext);
              const type = chordTone
                ? "is-chord-tone"
                : scaleTone
                  ? "is-scale-tone"
                  : "is-chromatic";

              return (
                <button
                  key={step}
                  className={[
                    "mh-cell",
                    type,
                    active ? "is-active is-note-start" : "",
                    sustained ? "is-sustain" : "",
                    noteEnd && duration > 1 ? "is-note-end" : "",
                    step % 8 === 0 ? "is-chord-start" : "",
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
                  aria-pressed={active || sustained}
                  title={
                    active || sustained
                      ? pitch.name +
                        " · " +
                        noteDurationLabel(duration) +
                        " · bar " +
                        (chordSlot + 1) +
                        " harmony · drag horizontally to resize"
                      : "Click or drag to draw " + pitch.name
                  }
                >
                  <span />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mh-legend">
        <span><i className="legend-chord-tone" /> chord tone in the displayed bars</span>
        <span><i className="legend-scale-tone" /> in-key non-chord tone</span>
        <span><i className="legend-chromatic-tone" /> chromatic tension</span>
        <span>Bars 3–4 reuse the same 16 melody steps under different chords</span>
        <span>Drag right to lengthen a note in 1/8 steps</span>
      </div>
    </div>
  );
}
