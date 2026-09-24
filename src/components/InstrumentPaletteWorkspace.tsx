import { audioEngine } from "../audio/engine";
import { diatonicChord } from "../music/harmony";
import {
  bassVoices,
  chordVoices,
  pianoTouches,
  type BassVoice,
  type ChordVoice,
  type InstrumentSettings,
  type PianoTouch,
} from "../music/model";
import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

const bassDescriptions: Record<BassVoice, string> = {
  electric: "A sampled electric bass with a real string attack and natural decay.",
  sub: "A rounded low fundamental with little upper-edge distraction.",
  synth: "A filtered square-wave bass with a firmer electronic edge.",
};

const chordDescriptions: Record<ChordVoice, string> = {
  piano: "Clear acoustic attack and decay; harmony stays easy to read.",
  electric: "Bell-like electric keys with a softer, sustained body.",
  pad: "Slow attack and long sustain; harmony becomes a layer of texture.",
  pluck: "Short, bright articulation that leaves more rhythmic space.",
};

const touchDescriptions: Record<PianoTouch, string> = {
  soft: "Uses the quieter Salamander recording layer.",
  medium: "Uses the middle Salamander recording layer.",
  strong: "Uses the stronger Salamander recording layer.",
};

export function InstrumentPaletteWorkspace() {
  const settings = useStudioStore((state) => state.instrumentSettings);
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setSettings = useStudioStore((state) => state.setInstrumentSettings);

  const update = (patch: Partial<InstrumentSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(patch);
    audioEngine.setInstrumentSettings(next);
    return next;
  };

  const choosePiano = async (pianoTouch: PianoTouch) => {
    update({ pianoTouch });
    await audioEngine.playPianoNote(60);
  };

  const chooseBass = async (bassVoice: BassVoice) => {
    update({ bassVoice });
    await audioEngine.playBassNote(36);
  };

  const chooseChords = async (chordVoice: ChordVoice) => {
    update({ chordVoice });
    await audioEngine.playChord(diatonicChord(tonalContext, 1));
  };

  return (
    <div className="instrument-palette-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Instrument palette · same notes, different source</span>
          <h2>Choose what plays the part</h2>
          <div className="daw-strip">
            <span>PIANO TOUCH</span><span>BASS VOICE</span><span>CHORD VOICE</span>
          </div>
        </div>
        <span className="workspace-hint">
          Compare the same musical material before changing notes or reaching for EQ.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "bass", "chords", "melody"] as const} />

      <div className="instrument-groups">
        <section className="instrument-group">
          <header>
            <span className="section-label">Acoustic piano</span>
            <strong>One touch setting follows every acoustic-piano part</strong>
            <p>
              The selected Salamander velocity layer shapes melody and, when CHORD VOICE is PIANO,
              harmony too.
            </p>
          </header>
          <div className="instrument-choice-grid">
            {pianoTouches.map((choice) => (
              <button
                key={choice}
                className={settings.pianoTouch === choice ? "instrument-choice is-active" : "instrument-choice"}
                onClick={() => choosePiano(choice)}
              >
                <strong>{choice}</strong>
                <small>{touchDescriptions[choice]}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="instrument-group">
          <header>
            <span className="section-label">Bass</span>
            <strong>Attack and overtones change the groove</strong>
            <p>Keep the bass line. Change the instrument and listen to how its relationship with the kick changes.</p>
          </header>
          <div className="instrument-choice-grid">
            {bassVoices.map((choice) => (
              <button
                key={choice}
                className={settings.bassVoice === choice ? "instrument-choice is-active" : "instrument-choice"}
                onClick={() => chooseBass(choice)}
              >
                <strong>{choice}</strong>
                <small>{bassDescriptions[choice]}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="instrument-group">
          <header>
            <span className="section-label">Harmony</span>
            <strong>Articulation can change the role of the same chord</strong>
            <p>Compare a struck piano chord with electric keys, a slow pad, and a short pluck.</p>
          </header>
          <div className="instrument-choice-grid">
            {chordVoices.map((choice) => (
              <button
                key={choice}
                className={settings.chordVoice === choice ? "instrument-choice is-active" : "instrument-choice"}
                onClick={() => chooseChords(choice)}
              >
                <strong>{choice}</strong>
                <small>{chordDescriptions[choice]}</small>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="instrument-palette-note">
        <strong>Do not choose by label.</strong>
        <span>
          Audition two or more alternatives against your actual track. Keep the one whose attack, sustain and register support the role you want.
        </span>
      </div>
    </div>
  );
}
