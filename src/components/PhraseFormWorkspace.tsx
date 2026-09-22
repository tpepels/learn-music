import {
  arrangementLayers,
  type FormSectionLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const labels: FormSectionLabel[] = ["A", "A′", "B", "C"];
const roleText = {
  statement: "introduce an idea",
  answer: "respond / develop",
  contrast: "change material",
  return: "bring familiarity back",
} as const;

const layerLabels = {
  drums: "DRUMS",
  bass: "BASS",
  chords: "CHORDS",
  melody: "MELODY",
} as const;

export function PhraseFormWorkspace() {
  const settings = useStudioStore((state) => state.formSettings);
  const setFormSection = useStudioStore((state) => state.setFormSection);
  const toggleFormLayer = useStudioStore((state) => state.toggleFormLayer);
  const currentStep = useStudioStore((state) => state.currentStep);
  const isPlaying = useStudioStore((state) => state.isPlaying);

  return (
    <div className="phrase-form-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Macro form · four 4-bar sections</span>
          <h2>Make sixteen bars change by ear</h2>
          <div className="daw-strip">
            <span>16 BARS</span><span>REPEAT</span><span>CONTRAST</span><span>RETURN</span>
          </div>
        </div>
        <span className="workspace-hint">
          The labels name the relationship. The layer buttons decide what each four-bar section sounds like.
        </span>
      </div>

      <div className="form-timeline">
        {settings.sections.map((section, index) => {
          const active = isPlaying && Math.floor(currentStep / 4) === index;
          const layers = settings.layers[index];

          return (
            <section
              className={[
                "form-section-block",
                active ? "is-playhead" : "",
              ].filter(Boolean).join(" ")}
              key={index}
            >
              <header>
                <span>BARS {index * 4 + 1}–{index * 4 + 4}</span>
                <strong>{section}</strong>
                <small>{roleText[settings.roles[index]]}</small>
              </header>

              <div className="form-label-buttons">
                {labels.map((label) => (
                  <button
                    key={label}
                    className={section === label ? "is-active" : ""}
                    onClick={() => setFormSection(index, label)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="form-layer-buttons" role="group" aria-label={"Layers in section " + (index + 1)}>
                {arrangementLayers.map((layer) => (
                  <button
                    key={layer}
                    className={layers[layer] ? "is-active" : ""}
                    aria-pressed={layers[layer]}
                    onClick={() => toggleFormLayer(index, layer)}
                  >
                    <span className="form-layer-light" />
                    {layerLabels[layer]}
                  </button>
                ))}
              </div>

              <div className="form-bar-mini" aria-hidden="true">
                {Array.from({ length: 4 }, (_, bar) => (
                  <span key={bar}>{index * 4 + bar + 1}</span>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="form-language">
        <article>
          <strong>Repeat</strong>
          <p>If two sections are both A, give them recognisably similar sounding material instead of only the same letter.</p>
        </article>
        <article>
          <strong>Develop</strong>
          <p>Keep enough of A to recognise it, then change one audible part.</p>
        </article>
        <article>
          <strong>Contrast</strong>
          <p>Change the texture enough for B to register as a new section while keeping the track connected.</p>
        </article>
        <article>
          <strong>Return</strong>
          <p>When A returns, bring back the musical detail that made the opening recognisable.</p>
        </article>
      </div>
    </div>
  );
}
