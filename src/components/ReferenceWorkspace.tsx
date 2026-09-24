import { useEffect, useMemo, useState } from "react";
import { audioEngine } from "../audio/engine";
import { mixerTrackIds } from "../music/model";
import { useStudioStore } from "../state/studio";
import { LayerVolumeStrip } from "./LayerVolumeStrip";

export function ReferenceWorkspace() {
  const mixer = useStudioStore((state) => state.mixerSettings);
  const eq = useStudioStore((state) => state.eqSettings);
  const saturation = useStudioStore((state) => state.saturationSettings);
  const stereo = useStudioStore((state) => state.stereoSettings);
  const reference = useStudioStore((state) => state.referenceMixSettings);
  const capture = useStudioStore((state) => state.captureReferenceSnapshot);
  const setTrim = useStudioStore((state) => state.setReferenceTrim);
  const registerComparison = useStudioStore((state) => state.registerReferenceComparison);
  const setQuietChecked = useStudioStore((state) => state.setReferenceQuietChecked);
  const [auditioningReference, setAuditioningReference] = useState(false);
  const [quiet, setQuiet] = useState(false);

  const suggestedTrim = useMemo(() => {
    if (!reference.snapshot) return 0;
    const currentAverage = mixerTrackIds.reduce((sum, track) => sum + mixer[track].volume, 0) / mixerTrackIds.length;
    const referenceAverage = mixerTrackIds.reduce((sum, track) => sum + reference.snapshot!.mixerSettings[track].volume, 0) / mixerTrackIds.length;
    return Math.max(-12, Math.min(12, currentAverage - referenceAverage));
  }, [mixer, reference.snapshot]);

  useEffect(() => {
    audioEngine.setReferenceAudition(reference.snapshot, reference.trimDb, auditioningReference);
    return () => audioEngine.setReferenceAudition(null, 0, false);
  }, [reference.snapshot, reference.trimDb, auditioningReference]);

  useEffect(() => {
    audioEngine.setQuietAudition(quiet);
    return () => audioEngine.setQuietAudition(false);
  }, [quiet]);

  const toggleReference = () => {
    if (!reference.snapshot) return;
    setAuditioningReference((current) => !current);
    registerComparison();
  };

  const toggleQuiet = () => {
    const next = !quiet;
    setQuiet(next);
    if (next) setQuietChecked(true);
  };

  return (
    <div className="advanced-production-card reference-workspace">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Reference practice · loudness-matched A/B</span>
          <h2>Compare decisions, not volume</h2>
          <div className="daw-strip"><span>SNAPSHOT</span><span>LEVEL MATCH</span><span>A / B</span><span>TRANSLATION</span></div>
        </div>
        <span className="workspace-hint">
          Capture a known version, change the mix, then switch back and forth. The reference is only useful if louder is not allowed to win automatically.
        </span>
      </div>

      <LayerVolumeStrip tracks={["drums", "bass", "chords", "melody"] as const} />

      <div className="reference-console">
        <section>
          <span className="section-label">A · current project</span>
          <strong>LIVE MIX</strong>
          <small>Current faders, EQ, saturation, and stereo width</small>
        </section>
        <button className="capture-reference" onClick={capture}>
          {reference.snapshot ? "RECAPTURE REFERENCE" : "CAPTURE REFERENCE"}
        </button>
        <section className={reference.snapshot ? "has-reference" : ""}>
          <span className="section-label">B · stored snapshot</span>
          <strong>{reference.snapshot ? "REFERENCE READY" : "EMPTY"}</strong>
          <small>{reference.snapshot ? "A previous version of this project" : "Capture before making a comparison"}</small>
        </section>
      </div>

      <div className="reference-match-row">
        <label>
          <span>REFERENCE TRIM</span>
          <strong>{reference.trimDb > 0 ? "+" : ""}{reference.trimDb.toFixed(1)} dB</strong>
          <input type="range" min="-12" max="12" step="0.5" value={reference.trimDb}
            onChange={(event) => setTrim(Number(event.target.value))} />
        </label>
        <div className="reference-suggestion">
          <span>LEVEL-MATCH GUIDE</span>
          <strong>{suggestedTrim > 0 ? "+" : ""}{suggestedTrim.toFixed(1)} dB</strong>
          <button disabled={!reference.snapshot} onClick={() => setTrim(suggestedTrim)}>MATCH</button>
        </div>
      </div>

      <div className="reference-ab-buttons">
        <button className={!auditioningReference ? "is-active" : ""} onClick={() => {
          setAuditioningReference(false);
          if (reference.snapshot) registerComparison();
        }}>A · PROJECT</button>
        <button disabled={!reference.snapshot} className={auditioningReference ? "is-active" : ""} onClick={toggleReference}>
          B · REFERENCE
        </button>
        <span>{reference.comparisons} comparisons</span>
      </div>

      <button className={quiet ? "quiet-check-button is-active" : "quiet-check-button"} onClick={toggleQuiet}>
        <strong>{quiet ? "QUIET CHECK ACTIVE · −18 dB" : "QUIET PLAYBACK CHECK"}</strong>
        <small>At low level, foreground/background balance is easier to judge without being impressed by loudness.</small>
      </button>

      <div className="reference-current-strip">
        {mixerTrackIds.map((track) => (
          <span key={track}>{track.toUpperCase()} {mixer[track].volume.toFixed(1)} dB · EQ {eq[track].gain > 0 ? "+" : ""}{eq[track].gain.toFixed(1)} · SAT {Math.round(saturation[track].wet * 100)}% · W {Math.round(stereo.widths[track] * 200)}%</span>
        ))}
      </div>
    </div>
  );
}
