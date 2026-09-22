import { audioEngine } from "../audio/engine";
import {
  MELODY_STEPS,
  aHarmonicMinorPitchClasses,
  aNaturalMinorPitchClasses,
  chromaticPitches,
  isAHarmonicMinorMidi,
  isANaturalMinorMidi,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const chromaticKeys = [
  { pitchClass: "A", midi: 57, black: false },
  { pitchClass: "B♭", midi: 58, black: true },
  { pitchClass: "B", midi: 59, black: false },
  { pitchClass: "C", midi: 60, black: false },
  { pitchClass: "D♭", midi: 61, black: true },
  { pitchClass: "D", midi: 62, black: false },
  { pitchClass: "E♭", midi: 63, black: true },
  { pitchClass: "E", midi: 64, black: false },
  { pitchClass: "F", midi: 65, black: false },
  { pitchClass: "F♯", midi: 66, black: true },
  { pitchClass: "G", midi: 67, black: false },
  { pitchClass: "G♯", midi: 68, black: true },
] as const;

function displayPitch(midi: number, harmonic: boolean) {
  const pitch = chromaticPitches.find((item) => item.midi === midi);
  if (!pitch) return String(midi);
  if (harmonic && midi % 12 === 8) {
    return pitch.name.replace("A♭", "G♯");
  }
  return pitch.name;
}

export function MinorTonalityWorkspace({ harmonic }: { harmonic: boolean }) {
  const selectedPitchClasses = useStudioStore((state) => state.selectedPitchClasses);
  const togglePitchClass = useStudioStore((state) => state.togglePitchClass);
  const melody = useStudioStore((state) => state.melody);
  const setMelodyStep = useStudioStore((state) => state.setMelodyStep);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  const scale = harmonic ? aHarmonicMinorPitchClasses : aNaturalMinorPitchClasses;
  const inScale = harmonic ? isAHarmonicMinorMidi : isANaturalMinorMidi;

  const toggleScalePitch = async (pitchClass: string, midi: number) => {
    togglePitchClass(pitchClass);
    await audioEngine.playPianoNote(midi);
  };

  const chooseNote = async (step: number, midi: number) => {
    setMelodyStep(step, midi);
    await audioEngine.playPianoNote(midi);
  };

  return (
    <div className="minor-tonality-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Key map · piano roll</span>
          <h2>{harmonic ? "A harmonic minor" : "A natural minor"}</h2>
          <div className="daw-strip">
            <span>TONIC A</span>
            <span>{harmonic ? "RAISED 7TH G♯" : "RELATIVE OF C MAJOR"}</span>
            <span>GRID 1/8</span>
          </div>
        </div>
        <span className="workspace-hint">
          Select scale notes above, then write directly in the piano roll below.
        </span>
      </div>

      <div className="minor-scale-summary">
        <div>
          <span className="section-label">{harmonic ? "Harmonic minor" : "Natural minor"}</span>
          <strong>{scale.join(" · ")}</strong>
          <small>
            {harmonic
              ? "The raised seventh G♯ sits one semitone below A and creates a strong leading tone."
              : "A natural minor uses exactly the same pitch collection as C major, but A behaves as home."}
          </small>
        </div>
        <div className="scale-degree-strip">
          {["1","2","♭3","4","5","♭6",harmonic ? "7" : "♭7"].map((degree) => (
            <span key={degree}>{degree}</span>
          ))}
        </div>
      </div>

      <div className="minor-keyboard" aria-label="A minor chromatic keyboard">
        {chromaticKeys.map((key) => {
          const selected = selectedPitchClasses.includes(key.pitchClass);
          const scaleTone = (scale as readonly string[]).includes(key.pitchClass);
          return (
            <button
              key={key.pitchClass}
              className={[
                "minor-key",
                key.black ? "is-black" : "",
                scaleTone ? "is-scale-tone" : "",
                key.pitchClass === "A" ? "is-tonic" : "",
                harmonic && key.pitchClass === "G♯" ? "is-leading-tone" : "",
                selected ? "is-selected" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => toggleScalePitch(key.pitchClass, key.midi)}
              aria-pressed={selected}
            >
              <strong>{key.pitchClass}</strong>
              <small>
                {key.pitchClass === "A"
                  ? "TONIC"
                  : harmonic && key.pitchClass === "G♯"
                    ? "LEADING"
                    : scaleTone
                      ? "IN KEY"
                      : "CHROMATIC"}
              </small>
            </button>
          );
        })}
      </div>

      <div className="minor-roll">
        {chromaticPitches.map((pitch) => (
          <div
            key={pitch.midi}
            className={[
              "minor-roll-row",
              pitch.black ? "is-black" : "",
              inScale(pitch.midi) ? "is-key-row" : "",
              pitch.midi % 12 === 9 ? "is-tonic-row" : "",
              harmonic && pitch.midi % 12 === 8 ? "is-leading-row" : "",
            ].filter(Boolean).join(" ")}
          >
            <button
              className="minor-note-label"
              onClick={() => audioEngine.playPianoNote(pitch.midi)}
            >
              {displayPitch(pitch.midi, harmonic)}
            </button>

            {Array.from({ length: MELODY_STEPS }, (_, step) => {
              const active = melody[step] === pitch.midi;
              return (
                <button
                  key={step}
                  className={[
                    "minor-roll-cell",
                    active ? "is-active" : "",
                    isPlaying && currentStep === step ? "is-playhead" : "",
                    step === 8 ? "is-phrase-start" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => chooseNote(step, pitch.midi)}
                  aria-label={"Set step " + (step + 1) + " to " + displayPitch(pitch.midi, harmonic)}
                  aria-pressed={active}
                >
                  <span />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="minor-roll-legend">
        <span><i className="is-tonic" /> tonic A</span>
        <span><i className="is-scale" /> scale tone</span>
        {harmonic && <span><i className="is-leading" /> leading tone G♯</span>}
        <span><i className="is-outside" /> chromatic note</span>
      </div>
    </div>
  );
}
