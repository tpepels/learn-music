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

export function LayerVolumeStrip() {
  const mixerSettings = useStudioStore((state) => state.mixerSettings);
  const setMixerTrack = useStudioStore((state) => state.setMixerTrack);

  return (
    <section className="layer-volume-strip" aria-label="Layer volumes">
      <span className="layer-volume-strip-label">Layer levels</span>
      <div className="layer-volume-controls">
        {mixerTrackIds.map((track) => {
          const volume = mixerSettings[track].volume;
          return (
            <label className="layer-volume-control" key={track}>
              <span>{labels[track]}</span>
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
        })}
      </div>
    </section>
  );
}
