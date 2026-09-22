import { useEffect, useState } from "react";
import { ArrangementWorkspace } from "./ArrangementWorkspace";
import { AutomationDynamicsWorkspace } from "./AutomationDynamicsWorkspace";
import { BassWorkspace } from "./BassWorkspace";
import { ChordWorkspace } from "./ChordWorkspace";
import { DrumWorkspace } from "./DrumWorkspace";
import { EffectsWorkspace } from "./EffectsWorkspace";
import { FinalProjectWorkspace } from "./FinalProjectWorkspace";
import { GrooveFeelWorkspace } from "./GrooveFeelWorkspace";
import { MixerWorkspace } from "./MixerWorkspace";
import { MelodyWorkspace } from "./PianoWorkspace";
import { SynthWorkspace } from "./SynthWorkspace";
import { VoicingWorkspace } from "./VoicingWorkspace";
import type { ExerciseDefinition } from "../lessons/types";
import { useStudioStore } from "../state/studio";

const modules = [
  { id: "groove", name: "Groove", lesson: "rhythm.pulse-and-groove", workspace: "compare" },
  { id: "feel", name: "Feel", lesson: "rhythm.groove-feel", workspace: "groove-feel" },
  { id: "melody", name: "Piano roll", lesson: "pitch.melody", workspace: "melody" },
  { id: "harmony", name: "Chords", lesson: "harmony.chords", workspace: "chords" },
  { id: "voicing", name: "Voicing", lesson: "harmony.voice-leading", workspace: "voicing" },
  { id: "bass", name: "Bass", lesson: "composition.bass-lines", workspace: "bass" },
  { id: "synth", name: "Synth", lesson: "sound.synthesis", workspace: "synth" },
  { id: "arrange", name: "Arrange", lesson: "form.arrangement", workspace: "arrangement" },
  { id: "mix", name: "Mixer", lesson: "mixing.balance-space", workspace: "mixer" },
  { id: "automation", name: "Automation", lesson: "production.automation-dynamics", workspace: "automation-dynamics" },
  { id: "effects", name: "FX", lesson: "production.effects-transitions", workspace: "effects" },
  { id: "finish", name: "Finish", lesson: "production.final-project", workspace: "final-project" },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  lesson: string;
  workspace: ExerciseDefinition["workspace"];
}>;

type StudioModule = (typeof modules)[number]["id"];

export function StudioMode({
  onTransportWorkspaceChange,
}: {
  onTransportWorkspaceChange: (workspace: ExerciseDefinition["workspace"]) => void;
}) {
  const completed = useStudioStore((state) => state.completedLessonIds);
  const [module, setModule] = useState<StudioModule>("groove");

  useEffect(() => {
    const selected = modules.find((item) => item.id === module);
    if (selected) onTransportWorkspaceChange(selected.workspace);
  }, [module, onTransportWorkspaceChange]);

  const unlocked = (lessonId: string) =>
    completed.includes(lessonId) ||
    lessonId === "rhythm.pulse-and-groove";

  return (
    <main className="studio-mode">
      <section className="studio-mode-hero">
        <div>
          <span className="section-label">Your studio</span>
          <h1>The training wheels are coming off.</h1>
          <p>
            These are the same instruments and production views from Learn, now
            collected in one workstation. Modules unlock as you complete their lesson.
          </p>
        </div>
        <div className="studio-mode-status">
          <strong>{completed.length}</strong>
          <span>lessons completed</span>
        </div>
      </section>

      <nav className="studio-module-tabs" aria-label="Studio modules">
        {modules.map((item) => {
          const canOpen = unlocked(item.lesson);
          return (
            <button
              key={item.id}
              disabled={!canOpen}
              className={module === item.id ? "is-active" : ""}
              onClick={() => setModule(item.id)}
            >
              <span>{item.name}</span>
              <small>{canOpen ? "open" : "learn first"}</small>
            </button>
          );
        })}
      </nav>

      <section className="studio-module-surface">
        {module === "groove" && <DrumWorkspace title="Groove" compare />}
        {module === "feel" && <GrooveFeelWorkspace />}
        {module === "melody" && <MelodyWorkspace title="Piano roll" />}
        {module === "harmony" && <ChordWorkspace />}
        {module === "voicing" && <VoicingWorkspace />}
        {module === "bass" && <BassWorkspace />}
        {module === "synth" && <SynthWorkspace />}
        {module === "arrange" && <ArrangementWorkspace />}
        {module === "mix" && <MixerWorkspace />}
        {module === "automation" && <AutomationDynamicsWorkspace />}
        {module === "effects" && <EffectsWorkspace />}
        {module === "finish" && <FinalProjectWorkspace />}
      </section>
    </main>
  );
}
