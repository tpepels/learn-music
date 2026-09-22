import {
  type FormSectionLabel,
} from "../music/model";
import { useStudioStore } from "../state/studio";

const labels: FormSectionLabel[] = ["A", "A′", "B", "C"];
const roleText = {
  statement: "introduce an idea",
  answer: "respond / complete",
  contrast: "change material",
  return: "bring familiarity back",
} as const;

export function PhraseFormWorkspace() {
  const settings = useStudioStore((state) => state.formSettings);
  const setFormSection = useStudioStore((state) => state.setFormSection);

  return (
    <div className="phrase-form-card">
      <div className="workspace-heading">
        <div>
          <span className="section-label">Macro form · four 4-bar sections</span>
          <h2>Plan sixteen bars before filling every detail</h2>
          <div className="daw-strip">
            <span>4 + 4</span><span>BINARY</span><span>TERNARY</span><span>AABA</span>
          </div>
        </div>
        <span className="workspace-hint">
          Each block represents four bars. This map sits above the detailed eight-bar arrangement view: it describes large-scale repetition and contrast.
        </span>
      </div>

      <div className="form-timeline">
        {settings.sections.map((section, index) => (
          <section className="form-section-block" key={index}>
            <header>
              <span>BARS {index * 4 + 1}–{index * 4 + 4}</span>
              <strong>{section}</strong>
              <small>{roleText[settings.roles[index]]}</small>
            </header>

            <div className="form-bar-mini">
              {Array.from({ length: 4 }, (_, bar) => (
                <span key={bar}>{index * 4 + bar + 1}</span>
              ))}
            </div>

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
          </section>
        ))}
      </div>

      <div className="form-language">
        <article>
          <strong>A</strong>
          <p>Main identity. Repeating A creates familiarity.</p>
        </article>
        <article>
          <strong>A′</strong>
          <p>The same idea altered enough to feel like an answer or development.</p>
        </article>
        <article>
          <strong>B</strong>
          <p>Contrasting material: different harmony, melody, register, texture, or energy.</p>
        </article>
        <article>
          <strong>C</strong>
          <p>A genuinely new third idea when the form needs more contrast.</p>
        </article>
      </div>
    </div>
  );
}
