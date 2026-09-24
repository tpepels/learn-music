import {
  mixerTrackIds,
  type MixerTrackId,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const labels: Record<MixerTrackId, string> = {
  drums: "Drums",
  bass: "Bass",
  chords: "Chords",
  melody: "Melody",
};

export function LayerVolumeControl({
  track,
  compact = false,
  showLabel = true,
}: {
  track: MixerTrackId;
  compact?: boolean;
  showLabel?: boolean;
}) {
  const volume = useStudioStore((state) => state.mixerSettings[track].volume);
  const setMixerTrack = useStudioStore((state) => state.setMixerTrack);

  return (
    <label
      className={[
        "layer-volume-control",
        compact ? "is-compact" : "",
      ].filter(Boolean).join(" ")}
    >
      {showLabel && <span>{labels[track]}</span>}
      <input
        type="range"
        min="-18"
        max="3"
        step="0.5"
        value={volume}
        aria-label={labels[track] + " volume"}
        onChange={(event) =>
          setMixerTrack(track, { volume: Number(event.target.value) })
        }
      />
      <output>{volume.toFixed(1)} dB</output>
    </label>
  );
}

export function LayerVolumeStrip({
  tracks = mixerTrackIds,
}: {
  tracks?: readonly MixerTrackId[];
}) {
  return (
    <section className="layer-volume-strip is-component-mixer" aria-label="Layer volumes">
      <span className="layer-volume-strip-label">Layer levels</span>
      <div className="layer-volume-controls">
        {tracks.map((track) => (
          <LayerVolumeControl key={track} track={track} />
        ))}
      </div>
    </section>
  );
}
