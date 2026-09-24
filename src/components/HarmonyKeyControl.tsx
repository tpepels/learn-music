import {
  keyLabel,
  pitchClasses,
  tonalModes,
  tonicName,
  type PitchClass,
  type TonalMode,
} from "../music/harmony";
import { useStudioStore } from "../state/studio";

const modeLabels: Record<TonalMode, string> = {
  major: "Major",
  "natural-minor": "Natural minor",
  "harmonic-minor": "Harmonic minor",
};

export function HarmonyKeyControl({
  modes = tonalModes,
  showMode = true,
}: {
  modes?: readonly TonalMode[];
  showMode?: boolean;
}) {
  const tonalContext = useStudioStore((state) => state.tonalContext);
  const setTonic = useStudioStore((state) => state.setTonic);
  const setTonalMode = useStudioStore((state) => state.setTonalMode);

  return (
    <div className="harmony-key-control" aria-label="Harmony key">
      <label>
        <span>Tonic</span>
        <select
          value={tonalContext.tonic}
          onChange={(event) =>
            setTonic(Number(event.target.value) as PitchClass)
          }
        >
          {pitchClasses.map((tonic) => (
            <option key={tonic} value={tonic}>
              {tonicName({ tonic, mode: tonalContext.mode })}
            </option>
          ))}
        </select>
      </label>
      {showMode && (
        <label>
          <span>Mode</span>
          <select
            value={tonalContext.mode}
            onChange={(event) =>
              setTonalMode(event.target.value as TonalMode)
            }
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {modeLabels[mode]}
              </option>
            ))}
          </select>
        </label>
      )}
      <strong>{keyLabel(tonalContext)}</strong>
    </div>
  );
}
