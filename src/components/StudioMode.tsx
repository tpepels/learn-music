import { useEffect, useState } from "react";
import { ArrangementWorkspace } from "./ArrangementWorkspace";
import { AutomationDynamicsWorkspace } from "./AutomationDynamicsWorkspace";
import { BassWorkspace } from "./BassWorkspace";
import { ChordWorkspace } from "./ChordWorkspace";
import { HarmonySequencerWorkspace } from "./HarmonySequencerWorkspace";
import { InstrumentPaletteWorkspace } from "./InstrumentPaletteWorkspace";
import { DrumWorkspace } from "./DrumWorkspace";
import { EffectsWorkspace } from "./EffectsWorkspace";
import { EqWorkspace } from "./EqWorkspace";
import { FinalProjectWorkspace } from "./FinalProjectWorkspace";
import { GrooveFeelWorkspace } from "./GrooveFeelWorkspace";
import { MelodyHarmonyWorkspace } from "./MelodyHarmonyWorkspace";
import { MotifWorkspace } from "./MotifWorkspace";
import { MinorTonalityWorkspace } from "./MinorTonalityWorkspace";
import { MixerWorkspace } from "./MixerWorkspace";
import { PhraseFormWorkspace } from "./PhraseFormWorkspace";
import { ReferenceWorkspace } from "./ReferenceWorkspace";
import { SaturationWorkspace } from "./SaturationWorkspace";
import { SidechainWorkspace } from "./SidechainWorkspace";
import { StereoWorkspace } from "./StereoWorkspace";
import { MelodyWorkspace } from "./PianoWorkspace";
import { SynthWorkspace } from "./SynthWorkspace";
import { TextureWorkspace } from "./TextureWorkspace";
import { VoicingWorkspace } from "./VoicingWorkspace";
import type { ExerciseDefinition } from "../lessons/types";
import { useStudioStore } from "../state/studio";

const modules = [
  { id: "groove", name: "Groove", lesson: "rhythm.pulse-and-groove", workspace: "compare" },
  { id: "feel", name: "Feel", lesson: "rhythm.groove-feel", workspace: "groove-feel" },
  { id: "melody", name: "Piano roll", lesson: "pitch.melody", workspace: "melody" },
  { id: "motif", name: "Motif", lesson: "composition.motif-development", workspace: "motif" },
  { id: "melody-harmony", name: "Melody + chords", lesson: "composition.melody-over-harmony", workspace: "melody-harmony" },
  { id: "harmony", name: "Chords", lesson: "harmony.chords", workspace: "harmony-song" },
  { id: "function", name: "Function", lesson: "harmony.function", workspace: "harmonic-function" },
  { id: "minor-key", name: "A minor", lesson: "harmony.relative-minor", workspace: "minor-key" },
  { id: "harmonic-minor", name: "Harmonic minor", lesson: "harmony.harmonic-minor", workspace: "harmonic-minor" },
  { id: "minor-harmony", name: "Minor harmony", lesson: "harmony.minor-cadences", workspace: "minor-harmony" },
  { id: "sevenths", name: "7th chords", lesson: "harmony.seventh-chords", workspace: "seventh-harmony" },
  { id: "mixture", name: "Borrowed", lesson: "harmony.modal-mixture", workspace: "borrowed-harmony" },
  { id: "voicing", name: "Voicing", lesson: "harmony.voice-leading", workspace: "voicing" },
  { id: "bass", name: "Bass", lesson: "composition.bass-lines", workspace: "bass" },
  { id: "synth", name: "Synth", lesson: "sound.synthesis", workspace: "synth" },
  { id: "form", name: "Form", lesson: "composition.phrase-form", workspace: "phrase-form" },
  { id: "arrange", name: "Arrange", lesson: "form.arrangement", workspace: "arrangement" },
  { id: "texture", name: "Texture", lesson: "composition.texture-orchestration", workspace: "texture" },
  { id: "palette", name: "Palette", lesson: "composition.texture-orchestration", workspace: "instrument-palette" },
  { id: "mix", name: "Mixer", lesson: "mixing.balance-space", workspace: "mixer" },
  { id: "eq", name: "EQ", lesson: "production.eq-spectral-balance", workspace: "eq" },
  { id: "saturation", name: "Saturation", lesson: "production.saturation", workspace: "saturation" },
  { id: "sidechain", name: "Sidechain", lesson: "production.sidechain", workspace: "sidechain" },
  { id: "stereo", name: "Stereo", lesson: "production.stereo-mono", workspace: "stereo" },
  { id: "reference", name: "Reference", lesson: "production.reference-mixing", workspace: "reference" },
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
        {module === "motif" && <MotifWorkspace />}
        {module === "melody-harmony" && <MelodyHarmonyWorkspace />}
        {module === "harmony" && <HarmonySequencerWorkspace />}
        {module === "function" && <HarmonySequencerWorkspace mode="function" />}
        {module === "minor-key" && <MinorTonalityWorkspace harmonic={false} />}
        {module === "harmonic-minor" && <MinorTonalityWorkspace harmonic />}
        {module === "minor-harmony" && <HarmonySequencerWorkspace mode="minor" />}
        {module === "sevenths" && <HarmonySequencerWorkspace mode="sevenths" />}
        {module === "mixture" && <HarmonySequencerWorkspace mode="borrowed" />}
        {module === "voicing" && <VoicingWorkspace />}
        {module === "bass" && <BassWorkspace />}
        {module === "synth" && <SynthWorkspace />}
        {module === "form" && <PhraseFormWorkspace />}
        {module === "arrange" && <ArrangementWorkspace />}
        {module === "texture" && <TextureWorkspace />}
        {module === "palette" && <InstrumentPaletteWorkspace />}
        {module === "mix" && <MixerWorkspace />}
        {module === "eq" && <EqWorkspace />}
        {module === "saturation" && <SaturationWorkspace />}
        {module === "sidechain" && <SidechainWorkspace />}
        {module === "stereo" && <StereoWorkspace />}
        {module === "reference" && <ReferenceWorkspace />}
        {module === "automation" && <AutomationDynamicsWorkspace />}
        {module === "effects" && <EffectsWorkspace />}
        {module === "finish" && <FinalProjectWorkspace />}
      </section>
    </main>
  );
}
