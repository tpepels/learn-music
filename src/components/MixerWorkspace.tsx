import {
  mixerTrackIds,
  type MixerTrackId,
  type MixerTrackSettings,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const trackMeta: Record<
  MixerTrackId,
  { name: string; short: string; role: string; className: string }
> = {
  drums: {
    name: "Drums",
    short: "DRM",
    role: "pulse + impact",
    className: "mix-drums",
  },
  bass: {
    name: "Bass",
    short: "BAS",
    role: "low-end weight",
    className: "mix-bass",
  },
  chords: {
    name: "Chords",
    short: "CHR",
    role: "harmonic bed",
    className: "mix-chords",
  },
  melody: {
    name: "Melody",
    short: "MEL",
    role: "foreground line",
    className: "mix-melody",
  },
};

function formatPan(value: number) {
  if (Math.abs(value) < 0.03) return "C";
  const amount = Math.round(Math.abs(value) * 100);
  return value < 0 ? "L" + amount : "R" + amount;
}

function formatSend(value: number) {
  return Math.round(value * 100) + "%";
}

function ChannelStrip({
  track,
  settings,
  onChange,
}: {
  track: MixerTrackId;
  settings: MixerTrackSettings;
  onChange: (settings: Partial<MixerTrackSettings>) => void;
}) {
  const meta = trackMeta[track];
  const meterHeight = Math.max(10, Math.min(100, 82 + settings.volume * 3.2));

  return (
    <section className={"mixer-strip " + meta.className}>
      <header className="mixer-track-head">
        <span>{meta.short}</span>
        <strong>{meta.name}</strong>
        <small>{meta.role}</small>
      </header>

      <div className="mixer-control mixer-pan">
        <div className="mixer-control-title">
          <span>PAN</span>
          <output>{formatPan(settings.pan)}</output>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={settings.pan}
          aria-label={meta.name + " pan"}
          onChange={(event) => onChange({ pan: Number(event.target.value) })}
        />
        <div className="pan-scale" aria-hidden="true">
          <span>L</span><i /><span>C</span><i /><span>R</span>
        </div>
      </div>

      <div className="mixer-control">
        <div className="mixer-control-title">
          <span>LOW CUT</span>
          <output>{Math.round(settings.highpass)} Hz</output>
        </div>
        <input
          type="range"
          min="20"
          max="300"
          step="5"
          value={settings.highpass}
          aria-label={meta.name + " low cut"}
          onChange={(event) => onChange({ highpass: Number(event.target.value) })}
        />
      </div>

      <div className="mixer-send-row">
        <label>
          <span>REV</span>
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.01"
            value={settings.reverb}
            aria-label={meta.name + " reverb send"}
            onChange={(event) => onChange({ reverb: Number(event.target.value) })}
          />
          <output>{formatSend(settings.reverb)}</output>
        </label>

        <label>
          <span>DLY</span>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={settings.delay}
            aria-label={meta.name + " delay send"}
            onChange={(event) => onChange({ delay: Number(event.target.value) })}
          />
          <output>{formatSend(settings.delay)}</output>
        </label>
      </div>

      <div className="mixer-fader-section">
        <div className="channel-meter" aria-hidden="true">
          <span style={{ height: meterHeight + "%" }} />
          <i className="meter-mark meter-mark-1" />
          <i className="meter-mark meter-mark-2" />
          <i className="meter-mark meter-mark-3" />
        </div>

        <label className="channel-fader">
          <span>FADER</span>
          <input
            type="range"
            min="-18"
            max="3"
            step="0.5"
            value={settings.volume}
            aria-label={meta.name + " volume fader"}
            onChange={(event) => onChange({ volume: Number(event.target.value) })}
          />
          <output>{settings.volume.toFixed(1)} dB</output>
        </label>
      </div>

      <footer className="mixer-track-foot">
        <span>TRACK</span>
        <strong>{meta.name.toUpperCase()}</strong>
      </footer>
    </section>
  );
}

export function MixerWorkspace() {
  const mixerSettings = useStudioStore((state) => state.mixerSettings);
  const setMixerTrack = useStudioStore((state) => state.setMixerTrack);

  return (
    <div className="mixer-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">DAW mixer · four project channels</span>
          <h2>Mix the track</h2>
          <div className="daw-strip signal-strip">
            <span>TRACK</span>
            <b>→</b>
            <span>LOW CUT</span>
            <b>→</b>
            <span>FADER / PAN</span>
            <b>→</b>
            <span>SENDS</span>
            <b>→</b>
            <span>MASTER</span>
          </div>
        </div>
        <span className="workspace-hint">
          Keep the arrangement playing while you make small changes and compare.
        </span>
      </div>

      <div className="mixer-bus-strip" aria-label="Shared effects buses">
        <div>
          <span>RETURN A</span>
          <strong>REVERB</strong>
          <small>shared room / depth</small>
        </div>
        <div>
          <span>RETURN B</span>
          <strong>DELAY</strong>
          <small>shared echoes / rhythm</small>
        </div>
        <div className="mixer-master">
          <span>MASTER</span>
          <strong>OUT</strong>
          <small>all channels meet here</small>
        </div>
      </div>

      <div className="mixer-console">
        {mixerTrackIds.map((track) => (
          <ChannelStrip
            key={track}
            track={track}
            settings={mixerSettings[track]}
            onChange={(settings) => setMixerTrack(track, settings)}
          />
        ))}
      </div>

      <div className="mixer-legend">
        <span><b>FADER</b> level</span>
        <span><b>PAN</b> left / right</span>
        <span><b>LOW CUT</b> removes very low frequencies</span>
        <span><b>REV / DLY</b> effect sends</span>
      </div>
    </div>
  );
}
