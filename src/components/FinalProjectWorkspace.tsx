import { useRef, useState } from "react";
import {
  activeLayerCount,
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
      chordProgression: state.chordProgression,
      synthSettings: state.synthSettings,
      arrangement: state.arrangement,
      mixerSettings: state.mixerSettings,
      automationSettings: state.automationSettings,
      dynamicsSettings: state.dynamicsSettings,
      effectsSettings: state.effectsSettings,
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
    chords.filter(Boolean).length === 4;

  const activeBars = arrangement.filter((bar) => activeLayerCount(bar) > 0).length;
  const arrangementReady =
    activeBars >= 6 &&
    activeLayerCount(arrangement[6]) >= 3 &&
    activeLayerCount(arrangement[7]) < activeLayerCount(arrangement[6]);

  const mixReady =
    mixer.chords.volume < mixer.drums.volume &&
    mixer.melody.volume <= 0 &&
    (mixer.chords.reverb > 0 || mixer.melody.reverb > 0);

  const movementReady =
    Math.max(...automation.melodyVolumeDb) - Math.min(...automation.melodyVolumeDb) >= 6 &&
    Math.max(...automation.chordFilterHz) - Math.min(...automation.chordFilterHz) >= 4000;

  const dynamicsReady = dynamics.ratio >= 2.5 && dynamics.attack >= 0.015;
  const effectsReady =
    effects.chorusWet >= 0.12 ||
    effects.delayFeedback >= 0.3 ||
    effects.reverbDecay >= 3.2;

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
    ["Composition", compositionReady, "Groove, melody, and four-chord progression"],
    ["Arrangement", arrangementReady, "At least six active bars with a peak and release"],
    ["Mix", mixReady, "Foreground/background balance plus spatial treatment"],
    ["Movement", movementReady, "Meaningful volume and filter automation"],
    ["Dynamics", dynamicsReady, "Intentional drum compression"],
    ["Creative FX", effectsReady, "At least one clearly shaped creative effect"],
    ["Export", milestones.exported, "Portable PLAY / LAB project file created"],
  ] as const;

  return (
    <div className="final-project-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Final project · integrated studio</span>
          <h2>Finish the track</h2>
          <div className="daw-strip">
            <span>WRITE</span><span>ARRANGE</span><span>MIX</span>
            <span>AUTOMATE</span><span>FX</span><span>EXPORT</span>
          </div>
        </div>
        <span className="workspace-hint">
          Nothing new to memorize here: this is where the separate skills become one production workflow.
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
          <strong>Save or reopen what you made</strong>
          <p>
            Export a versioned JSON project containing the composition, arrangement,
            mixer, automation, dynamics, and effects settings. Import validates that
            format before replacing the current project.
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
