import { audioEngine } from "../audio/engine";
import {
  chordSymbol,
  harmonicVoiceLeadingDistance,
  voicedHarmonicChordMidi,
} from "../music/harmony";
import {
  midiNoteName,
  type ChordInversion,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import { HarmonyKeyControl } from "./HarmonyKeyControl";

const inversionNames: Record<ChordInversion, string> = {
  0: "Root",
  1: "1st inversion",
  2: "2nd inversion",
};

export function VoicingWorkspace() {
  const progression = useStudioStore((state) => state.harmonicProgression);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const voicing = useStudioStore((state) => state.voicingSettings);
  const setChordInversion = useStudioStore((state) => state.setChordInversion);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  const currentDistance = harmonicVoiceLeadingDistance(
    progression,
    tonalContext,
    voicing.inversions as ChordInversion[],
  );
  const rootDistance = harmonicVoiceLeadingDistance(
    progression,
    tonalContext,
    [0, 0, 0, 0],
  );

  return (
    <div className="voicing-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Piano voicing · four-bar chord track</span>
          <h2>Move the voices, not only the chord names</h2>
          <div className="daw-strip">
            <span>TRIADS</span>
            <span>INVERSIONS</span>
            <span>VOICE LEADING</span>
          </div>
        </div>
        <span className="workspace-hint">
          Keep the harmonic progression; change which chord tone sits at the bottom.
        </span>
      </div>

      <HarmonyKeyControl />

      <div className="voice-leading-meter">
        <span className="section-label">Total voice movement</span>
        <strong>{currentDistance} semitones</strong>
        <small>
          Root-position baseline: {rootDistance}. Lower usually means smoother movement.
        </small>
      </div>

      <div className="voicing-slots">
        {progression.map((chord, slot) => {
          const inversion = (voicing.inversions[slot] ?? 0) as ChordInversion;
          const notes = chord
            ? voicedHarmonicChordMidi(chord, tonalContext, inversion)
            : [];
          return (
            <section
              key={slot}
              className={[
                "voicing-slot",
                isPlaying && currentStep === slot ? "is-playhead" : "",
              ].filter(Boolean).join(" ")}
            >
              <header>
                <span>Bar {slot + 1}</span>
                <strong>{chord ? chordSymbol(chord, tonalContext) : "No chord"}</strong>
                <small>{inversionNames[inversion]}</small>
              </header>

              <div className="voicing-note-stack" aria-label={"Voiced notes for bar " + (slot + 1)}>
                {notes.length > 0 ? (
                  notes
                    .slice()
                    .reverse()
                    .map((midi) => (
                      <button
                        key={midi}
                        onClick={() => chord && audioEngine.playChord(chord, inversion)}
                      >
                        {midiNoteName(midi)}
                      </button>
                    ))
                ) : (
                  <span className="voicing-empty">Build this chord in lesson 4 first</span>
                )}
              </div>

              <div className="inversion-buttons">
                {([0, 1, 2] as ChordInversion[]).map((choice) => (
                  <button
                    key={choice}
                    disabled={!chord}
                    className={inversion === choice ? "is-active" : ""}
                    onClick={async () => {
                      setChordInversion(slot, choice);
                      if (chord) await audioEngine.playChord(chord, choice);
                    }}
                  >
                    <strong>{choice === 0 ? "R" : choice}</strong>
                    <span>{inversionNames[choice]}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="voicing-note">
        <strong>Same chord, different bass note.</strong>
        <span>
          An inversion changes the vertical order of the same chord tones. Voice leading asks how far each individual voice must move into the next chord.
        </span>
      </div>
    </div>
  );
}
