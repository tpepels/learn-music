import { useRef, useState } from "react";
import {
  activeLayerCount,
  arrangementLayers,
  trackNames,
} from "../music/model";
import { parseProjectFile } from "../persistence/projectFile";
import { useStudioStore } from "../state/studio";

function countActivePattern(pattern: Record<(typeof trackNames)[number], boolean[]>) {
  return trackNames.reduce(
    (total, track) => total + pattern[track].filter(Boolean).length,
    0,
  );
}

function downloadProject() {
  const state = useStudioStore.getState();
  const payload = {
    format: "play-lab-project",
    version: 1,
    exportedAt: new Date().toISOString(),
    project: {
      bpm: state.bpm,
      patterns: state.patterns,
      melody: state.melody,
      melodyDurations: state.melodyDurations,
      chordProgression: state.chordProgression,
      harmonySequence: state.harmonySequence,
      harmonyDurations: state.harmonyDurations,
      accompanimentPattern: state.accompanimentPattern,
      synthSettings: state.synthSettings,
      arrangement: state.arrangement,
      mixerSettings: state.mixerSettings,
      automationSettings: state.automationSettings,
      dynamicsSettings: state.dynamicsSettings,
      effectsSettings: state.effectsSettings,
      voicingSettings: state.voicingSettings,
      bassSequence: state.bassSequence,
      bassDurations: state.bassDurations,
      grooveFeelSettings: state.grooveFeelSettings,
      formSettings: state.formSettings,
      textureSettings: state.textureSettings,
      instrumentSettings: state.instrumentSettings,
      eqSettings: state.eqSettings,
      saturationSettings: state.saturationSettings,
      sidechainSettings: state.sidechainSettings,
      stereoSettings: state.stereoSettings,
      referenceMixSettings: state.referenceMixSettings,
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "play-lab-project.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  state.markProjectExported();
}

export function FinalProjectWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const patterns = useStudioStore((state) => state.patterns);
  const melody = useStudioStore((state) => state.melody);
  const chords = useStudioStore((state) => state.chordProgression);
  const harmonySequence = useStudioStore((state) => state.harmonySequence);
  const arrangement = useStudioStore((state) => state.arrangement);
  const mixer = useStudioStore((state) => state.mixerSettings);
  const automation = useStudioStore((state) => state.automationSettings);
  const dynamics = useStudioStore((state) => state.dynamicsSettings);
  const effects = useStudioStore((state) => state.effectsSettings);
  const milestones = useStudioStore((state) => state.projectMilestones);
  const loadProject = useStudioStore((state) => state.loadProject);

  const compositionReady =
    countActivePattern(patterns.A) >= 8 &&
    melody.filter((note) => note !== null).length >= 6 &&
    chords.filter(Boolean).length === 4 &&
    harmonySequence.reduce((total, notes) => total + notes.length, 0) >= 12;

  const arrangementDensities = arrangement.map(activeLayerCount);
  const activeBars = arrangementDensities.filter((density) => density > 0).length;
  const arrangementPeak = Math.max(...arrangementDensities);
  const peakIndex = arrangementDensities.findIndex((density) => density === arrangementPeak);
  const arrangementSignatures = new Set(
    arrangement
      .filter((bar) => activeLayerCount(bar) > 0)
      .map((bar) =>
        arrangementLayers.map((layer) => (bar[layer] ? "1" : "0")).join(""),
      ),
  );
  const arrangementReady =
    activeBars >= 6 &&
    arrangementSignatures.size >= 3 &&
    arrangementDensities.some((density) => density >= 1 && density <= 2) &&
    arrangementPeak >= 3 &&
    arrangementDensities
      .slice(peakIndex + 1)
      .some((density) => density > 0 && density < arrangementPeak);

  const mixVolumes = Object.values(mixer).map((settings) => settings.volume);
  const mixReady = Math.max(...mixVolumes) - Math.min(...mixVolumes) >= 3;

  const movementReady =
    Math.max(...automation.melodyVolumeDb) - Math.min(...automation.melodyVolumeDb) >= 4 ||
    Math.max(...automation.chordFilterHz) - Math.min(...automation.chordFilterHz) >= 3000;

  const dynamicsReady = dynamics.ratio >= 2;
  const effectsReady =
    mixer.chords.reverb >= 0.08 ||
    mixer.melody.reverb >= 0.08 ||
    mixer.melody.delay >= 0.05 ||
    effects.chorusWet >= 0.12 ||
    effects.delayFeedback >= 0.25 ||
    effects.reverbDecay >= 3;
  const productionChoiceReady = movementReady || dynamicsReady || effectsReady;

  const importProject = async (file: File) => {
    try {
      const raw = JSON.parse(await file.text());
      const project = parseProjectFile(raw);
      loadProject(project);
      setImportMessage("Project loaded successfully.");
    } catch {
      setImportMessage("That file is not a valid PLAY / LAB project.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const checks = [
    ["Composition", compositionReady, "A groove, melody, progression, and harmony part you wrote"],
    ["Arrangement", arrangementReady, "Several textures, a fuller moment, and space after it"],
    ["Mix", mixReady, "A level hierarchy instead of four equally loud parts"],
    ["Production choice", productionChoiceReady, "Automation, compression, or effects only where you want them"],
    ["Export", milestones.exported, "An editable snapshot of the version you decided to keep"],
  ] as const;

  return (
    <div className="final-project-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Final project · full track</span>
          <h2>Listen, decide, finish</h2>
          <div className="daw-strip">
            <span>WRITE</span><span>ARRANGE</span><span>MIX</span>
            <span>AUTOMATE</span><span>FX</span><span>EXPORT</span>
          </div>
        </div>
        <span className="workspace-hint">
          Play the whole track. Keep what helps the music, remove what does not, and save the version you want to come back to.
        </span>
      </div>

      <div className="final-project-grid">
        {checks.map(([title, ready, description], index) => (
          <article
            key={title}
            className={ready ? "project-stage is-ready" : "project-stage"}
          >
            <span className="project-stage-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
            <b>{ready ? "✓" : "○"}</b>
          </article>
        ))}
      </div>

      <div className="export-project-panel">
        <div>
          <span className="section-label">Project file</span>
          <strong>Save this version or reopen an earlier one</strong>
          <p>
            Export keeps the full editable session: notes, arrangement, mix and production settings.
          </p>
          {importMessage && <small className="project-import-message">{importMessage}</small>}
        </div>

        <div className="project-file-actions">
          <button onClick={downloadProject}>
            <span>⇩</span>
            Export project
          </button>
          <button
            className="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <span>⇧</span>
            Import project
          </button>
          <input
            ref={fileInputRef}
            className="project-file-input"
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importProject(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
