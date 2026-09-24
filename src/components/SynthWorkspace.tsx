import { audioEngine } from "../audio/engine";
import { synthWaveforms, type SynthWaveform } from "../music/model";
import { useStudioStore } from "../state/studio";

const demoNotes = [
  { midi: 60, label: "C" },
  { midi: 64, label: "E" },
  { midi: 67, label: "G" },
];

export function SynthWorkspace() {
  const bpm = useStudioStore((state) => state.bpm);
  const settings = useStudioStore((state) => state.synthSettings);
  const setSynthSettings = useStudioStore((state) => state.setSynthSettings);
  const recordExperiment = useStudioStore((state) => state.recordLearningExperiment);

  const setWaveform = async (waveform: SynthWaveform) => {
    const next = { ...settings, waveform };
    setSynthSettings({ waveform });
    audioEngine.setSynthSettings(next);
    await audioEngine.playSynthNote();
  };

  const update = (key: "cutoff" | "attack" | "release", value: number) => {
    const next = { ...settings, [key]: value };
    setSynthSettings({ [key]: value });
    audioEngine.setSynthSettings(next);
  };

  return (
    <div className="synth-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Subtractive synthesizer · polyphonic</span>
          <h2>Shape the sound</h2>
          <div className="daw-strip signal-strip">
            <span>OSC</span>
            <b>→</b>
            <span>FILTER</span>
            <b>→</b>
            <span>AMP ENV</span>
          </div>
        </div>
        <span className="workspace-hint">Change one parameter, then audition the same note or melody again</span>
      </div>

      <div className="waveform-section">
        <span className="section-label">Oscillator waveform</span>
        <div className="waveform-buttons">
          {synthWaveforms.map((waveform) => (
            <button
              key={waveform}
              className={settings.waveform === waveform ? "waveform-button is-active" : "waveform-button"}
              onClick={() => setWaveform(waveform)}
            >
              <strong>{waveform}</strong>
              <span className={"waveform-icon waveform-" + waveform} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <div className="synth-controls">
        <label>
          <span>
            <strong>Brightness</strong>
            <small>Low-pass cutoff</small>
          </span>
          <input
            type="range"
            min="200"
            max="12000"
            step="50"
            value={settings.cutoff}
            onChange={(event) => update("cutoff", Number(event.target.value))}
          />
          <output>{Math.round(settings.cutoff)} Hz</output>
        </label>

        <label>
          <span>
            <strong>Attack</strong>
            <small>How quickly the sound starts</small>
          </span>
          <input
            type="range"
            min="0.005"
            max="1.5"
            step="0.005"
            value={settings.attack}
            onChange={(event) => update("attack", Number(event.target.value))}
          />
          <output>{settings.attack.toFixed(2)} s</output>
        </label>

        <label>
          <span>
            <strong>Release</strong>
            <small>How long the sound fades after release</small>
          </span>
          <input
            type="range"
            min="0.05"
            max="2.5"
            step="0.05"
            value={settings.release}
            onChange={(event) => update("release", Number(event.target.value))}
          />
          <output>{settings.release.toFixed(2)} s</output>
        </label>
      </div>

      <div className="synth-audition">
        <div>
          <span className="section-label">Audition</span>
          <strong>Use the same notes while comparing settings</strong>
        </div>
        <div>
          {demoNotes.map((note) => (
            <button
              key={note.midi}
              onClick={async () => {
                recordExperiment("synth.note-audition", note.midi);
                await audioEngine.playSynthNote(note.midi);
              }}
            >
              {note.label}
            </button>
          ))}
          <button
            className="synth-phrase-button"
            onClick={async () => {
              recordExperiment("synth.phrase-audition", true);
              await audioEngine.playSynthPhrase(bpm);
            }}
          >
            Play current melody
          </button>
        </div>
      </div>
    </div>
  );
}
