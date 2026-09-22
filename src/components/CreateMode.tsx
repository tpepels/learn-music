import { useState } from "react";
import {
  activeLayerCount,
  trackNames,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const briefs = [
  {
    id: "groove-study",
    eyebrow: "Rhythm study",
    title: "Make one groove feel like two sections",
    prompt:
      "Use Pattern A as the identity. Build a related Pattern B with a fill, anticipation, or changed ending. Then arrange the groove so the listener can hear a beginning, development, and return.",
    focus: ["Pattern A/B", "Variation", "Phrase ending", "Arrangement"],
  },
  {
    id: "melody-miniature",
    eyebrow: "Composition study",
    title: "Write an eight-bar miniature",
    prompt:
      "Use a four-chord progression and a short melody that clearly repeats one motif before answering it. Keep the material simple enough that the phrase shape is obvious.",
    focus: ["Key", "Chord progression", "Motif", "Phrase"],
  },
  {
    id: "energy-arc",
    eyebrow: "Arrangement study",
    title: "Build toward one unmistakable peak",
    prompt:
      "Start sparse, add layers and brightness gradually, make one bar the clear high point, then remove enough material that the release is audible.",
    focus: ["Density", "Automation", "Build", "Release"],
  },
  {
    id: "production-study",
    eyebrow: "Production study",
    title: "Make the same notes feel more finished",
    prompt:
      "Do not rewrite the composition. Improve only level, stereo placement, EQ, dynamics, automation, and effects. Compare the result with the neutral settings.",
    focus: ["Mixer", "Compression", "Automation", "FX"],
  },
] as const;

export function CreateMode() {
  const [selected, setSelected] = useState<(typeof briefs)[number]>(briefs[0]);
  const setAppMode = useStudioStore((state) => state.setAppMode);
  const patterns = useStudioStore((state) => state.patterns);
  const melody = useStudioStore((state) => state.melody);
  const chords = useStudioStore((state) => state.chordProgression);
  const arrangement = useStudioStore((state) => state.arrangement);

  const drumEvents = trackNames.reduce(
    (total, track) => total + patterns.A[track].filter(Boolean).length,
    0,
  );
  const melodyNotes = melody.filter((note) => note !== null).length;
  const chordCount = chords.filter(Boolean).length;
  const activeBars = arrangement.filter((bar) => activeLayerCount(bar) > 0).length;

  return (
    <main className="create-mode">
      <section className="create-mode-hero">
        <div>
          <span className="section-label">Create</span>
          <h1>Use the tools without being told the answer.</h1>
          <p>
            These briefs are deliberately open-ended. There is no automatic “correct”
            composition here; choose a constraint, make decisions in Studio, then return
            and listen again.
          </p>
        </div>

        <div className="create-project-stats">
          <span><strong>{drumEvents}</strong> drum events</span>
          <span><strong>{melodyNotes}</strong> melody notes</span>
          <span><strong>{chordCount}/4</strong> chords</span>
          <span><strong>{activeBars}/8</strong> active bars</span>
        </div>
      </section>

      <div className="create-mode-grid">
        <nav className="brief-list" aria-label="Creative briefs">
          {briefs.map((brief, index) => (
            <button
              key={brief.id}
              className={selected.id === brief.id ? "is-active" : ""}
              onClick={() => setSelected(brief)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <small>{brief.eyebrow}</small>
                <strong>{brief.title}</strong>
              </div>
            </button>
          ))}
        </nav>

        <section className="creative-brief">
          <span className="section-label">{selected.eyebrow}</span>
          <h2>{selected.title}</h2>
          <p>{selected.prompt}</p>

          <div className="creative-focus">
            <span className="section-label">Focus on</span>
            <div>
              {selected.focus.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="creative-process">
            <article>
              <b>1</b>
              <strong>Make</strong>
              <p>Work quickly enough that you can still hear the overall idea.</p>
            </article>
            <article>
              <b>2</b>
              <strong>Compare</strong>
              <p>Change one thing at a time and listen to what actually changed.</p>
            </article>
            <article>
              <b>3</b>
              <strong>Keep</strong>
              <p>Keep choices that support the idea, not choices that merely add complexity.</p>
            </article>
          </div>

          <button className="open-studio-button" onClick={() => setAppMode("studio")}>
            Open this project in Studio <span>→</span>
          </button>
        </section>
      </div>
    </main>
  );
}
