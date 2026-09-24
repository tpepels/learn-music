import { mixerTrackIds, type MixerTrackId } from "../music/model";
import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

const labels: Record<MixerTrackId, string> = {
  drums: "DRUMS",
  bass: "BASS",
  chords: "CHORDS",
  melody: "MELODY",
};

export function StereoWorkspace() {
  const mixer = useStudioStore((state) => state.mixerSettings);
  const stereo = useStudioStore((state) => state.stereoSettings);
  const setMixerTrack = useStudioStore((state) => state.setMixerTrack);
  const setStereoWidth = useStudioStore((state) => state.setStereoWidth);
  const setMonoAudition = useStudioStore((state) => state.setMonoAudition);

  return (
    <div className="advanced-production-card stereo-workspace">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Stereo field · pan + width + mono check</span>
          <h2>Use width as contrast, not as a default</h2>
          <div className="daw-strip"><span>PAN</span><span>WIDTH</span><span>CENTRE</span><span>MONO CHECK</span></div>
        </div>
        <span className="workspace-hint">
          Pan places a channel left/right. Width changes mid/side balance. Bass usually needs a stable centre; supporting layers can occupy more width.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "bass", "chords", "melody"] as const} />

      <div className="stereo-stage" aria-label="Stereo placement view">
        <span className="speaker left">L</span>
        <span className="stereo-centre-line" />
        <span className="speaker right">R</span>
        {mixerTrackIds.map((track, index) => {
          const pan = stereo.monoAudition ? 0 : mixer[track].pan;
          const width = stereo.monoAudition ? 0 : stereo.widths[track];
          return (
            <div
              key={track}
              className={"stereo-object stereo-" + track}
              style={{
                left: String(50 + pan * 35) + "%",
                width: String(42 + width * 70) + "px",
                top: String(28 + index * 31) + "px",
              }}
            >
              {labels[track]}
            </div>
          );
        })}
      </div>

      <div className="stereo-channel-list">
        {mixerTrackIds.map((track) => (
          <section key={track}>
            <strong>{labels[track]}</strong>
            <label>
              <span>PAN</span>
              <output>{Math.round(mixer[track].pan * 100)}</output>
              <input type="range" min="-1" max="1" step="0.05" value={mixer[track].pan}
                disabled={stereo.monoAudition}
                onChange={(event) => setMixerTrack(track, { pan: Number(event.target.value) })} />
            </label>
            <label>
              <span>WIDTH</span>
              <output>{Math.round(stereo.widths[track] * 200)}%</output>
              <input type="range" min="0" max="1" step="0.05" value={stereo.widths[track]}
                disabled={stereo.monoAudition}
                onChange={(event) => setStereoWidth(track, Number(event.target.value))} />
            </label>
          </section>
        ))}
      </div>

      <button
        className={stereo.monoAudition ? "mono-check-button is-active" : "mono-check-button"}
        onClick={() => setMonoAudition(!stereo.monoAudition)}
      >
        <strong>{stereo.monoAudition ? "MONO AUDITION ACTIVE" : "CHECK IN MONO"}</strong>
        <small>Centres pans, sets channel width to mid-only, and removes time-based sends during the check.</small>
      </button>
    </div>
  );
}
