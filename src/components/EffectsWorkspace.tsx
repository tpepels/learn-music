import { useStudioStore } from "../state/studio";

function percent(value: number) {
  return Math.round(value * 100) + "%";
}

export function EffectsWorkspace() {
  const effects = useStudioStore((state) => state.effectsSettings);
  const setEffects = useStudioStore((state) => state.setEffectsSettings);
  const mixer = useStudioStore((state) => state.mixerSettings);
  const setMixerTrack = useStudioStore((state) => state.setMixerTrack);

  return (
    <div className="effects-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Creative FX rack · sends + insert</span>
          <h2>Shape space, echoes, and width</h2>
          <div className="daw-strip signal-strip">
            <span>TRACK SENDS</span><b>→</b>
            <span>REVERB / DELAY RETURNS</span><b>+</b>
            <span>MELODY CHORUS</span>
          </div>
        </div>
        <span className="workspace-hint">
          Keep the arrangement playing and exaggerate each effect before returning to a musical amount.
        </span>
      </div>

      <div className="fx-rack-grid">
        <section className="fx-unit fx-reverb">
          <header>
            <span className="fx-led" />
            <div>
              <small>RETURN A</small>
              <strong>REVERB</strong>
            </div>
          </header>

          <label>
            <span>DECAY</span>
            <strong>{effects.reverbDecay.toFixed(1)} s</strong>
            <input
              type="range"
              min="0.6"
              max="7"
              step="0.1"
              value={effects.reverbDecay}
              onChange={(event) =>
                setEffects({ reverbDecay: Number(event.target.value) })
              }
            />
            <small>How long the room tail lasts</small>
          </label>

          <label>
            <span>PRE-DELAY</span>
            <strong>{Math.round(effects.reverbPreDelay * 1000)} ms</strong>
            <input
              type="range"
              min="0"
              max="0.12"
              step="0.005"
              value={effects.reverbPreDelay}
              onChange={(event) =>
                setEffects({ reverbPreDelay: Number(event.target.value) })
              }
            />
            <small>Space before the reverb begins</small>
          </label>

          <label className="fx-send-control">
            <span>CHORD SEND</span>
            <strong>{percent(mixer.chords.reverb)}</strong>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.01"
              value={mixer.chords.reverb}
              onChange={(event) =>
                setMixerTrack("chords", { reverb: Number(event.target.value) })
              }
            />
          </label>
        </section>

        <section className="fx-unit fx-delay">
          <header>
            <span className="fx-led" />
            <div>
              <small>RETURN B</small>
              <strong>DELAY</strong>
            </div>
          </header>

          <label>
            <span>FEEDBACK</span>
            <strong>{percent(effects.delayFeedback)}</strong>
            <input
              type="range"
              min="0"
              max="0.75"
              step="0.01"
              value={effects.delayFeedback}
              onChange={(event) =>
                setEffects({ delayFeedback: Number(event.target.value) })
              }
            />
            <small>How much of each echo feeds the next echo</small>
          </label>

          <label className="fx-static-readout">
            <span>TIME</span>
            <strong>1/8</strong>
            <small>Tempo-synced eighth-note repeats</small>
          </label>

          <label className="fx-send-control">
            <span>MELODY SEND</span>
            <strong>{percent(mixer.melody.delay)}</strong>
            <input
              type="range"
              min="0"
              max="0.3"
              step="0.01"
              value={mixer.melody.delay}
              onChange={(event) =>
                setMixerTrack("melody", { delay: Number(event.target.value) })
              }
            />
          </label>
        </section>

        <section className="fx-unit fx-chorus">
          <header>
            <span className="fx-led" />
            <div>
              <small>MELODY PARALLEL FX</small>
              <strong>CHORUS</strong>
            </div>
          </header>

          <label>
            <span>WET</span>
            <strong>{percent(effects.chorusWet)}</strong>
            <input
              type="range"
              min="0"
              max="0.65"
              step="0.01"
              value={effects.chorusWet}
              onChange={(event) =>
                setEffects({ chorusWet: Number(event.target.value) })
              }
            />
            <small>Blend between dry melody and modulated stereo copy</small>
          </label>

          <div className="chorus-visual" aria-hidden="true">
            <span className="chorus-line chorus-line-a" />
            <span className="chorus-line chorus-line-b" />
          </div>

          <p>
            Chorus creates width by mixing the original with tiny time/pitch variations.
          </p>
        </section>
      </div>
    </div>
  );
}
