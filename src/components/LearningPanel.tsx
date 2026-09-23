import { ConceptVisual } from "./ConceptVisual";
import { getProductionContext } from "../learning/productionContext";
import {
  dawStages,
  getDawCheckpoint,
  getDawStageFamiliarity,
  getDawTransfer,
  getPlayLabRepresentation,
} from "../learning/dawTransfer";
import type { ExerciseDefinition } from "../lessons/types";

export function LearningPanel({
  exercise,
  lessonNumber,
}: {
  exercise: ExerciseDefinition;
  lessonNumber: number;
}) {
  const context = getProductionContext(exercise.id);
  const transfer = getDawTransfer(exercise.workspace);
  const playLabRepresentation = getPlayLabRepresentation(exercise.workspace);
  const checkpoint =
    exercise.letter === "A" ? getDawCheckpoint(lessonNumber) : undefined;

  return (
    <section className="learning-panel" aria-label="Concept and DAW explanation">
      <div className="learning-essentials">
        <div className="learning-essential-copy">
          <span className="section-label">Understand</span>
          <h2>{exercise.learn}</h2>
          <p>{exercise.explanation}</p>
        </div>

        <aside className="learning-listen-cue">
          <span className="section-label">Listen for</span>
          <p>{exercise.recognition}</p>
        </aside>
      </div>

      {checkpoint && (
        <details className="daw-checkpoint">
          <summary>
            <div>
              <span>DAW transfer checkpoint</span>
              <strong>{checkpoint.title}</strong>
              <small>{checkpoint.intro}</small>
            </div>
            <b>Open checkpoint</b>
          </summary>

          <div className="daw-checkpoint-body">
            <div className="daw-checkpoint-grid">
              {checkpoint.objects.map((item) => (
                <article key={item.name}>
                  <strong>{item.name}</strong>
                  <p>{item.meaning}</p>
                </article>
              ))}
            </div>

            <p className="daw-checkpoint-challenge">
              <strong>When you open a DAW:</strong> {checkpoint.challenge}
            </p>
          </div>
        </details>
      )}

      <details className="learning-deep-dive">
        <summary>
          <div>
            <strong>Go deeper</strong>
            <span>Why it works · PLAY/LAB → DAW · vocabulary</span>
          </div>
          <b>Explore</b>
        </summary>

        <div className="learning-panel-body">
          <div className="learning-reading-grid">
            <div className="learning-reading-column">
              <section className="learning-model-card">
                <h3>The underlying model</h3>
                <p>{transfer.concept}</p>
                <h4>What is actually changing?</h4>
                <p>{transfer.changes}</p>
              </section>

              <section className="learning-use-card">
                <h3>Why you would use it</h3>
                <p>{context.why}</p>
                <h4>When it comes up</h4>
                <p>{context.when}</p>
              </section>

              <section className="learning-pitfall">
                <h3>Common confusion</h3>
                <p>{transfer.pitfall}</p>
              </section>
            </div>

            <div className="learning-reading-column">
              <div className="learning-concept-visual">
                <ConceptVisual kind={context.visual} />
              </div>

              <section className="learning-playlab-card">
                <h3>Here in PLAY/LAB</h3>
                <p>{playLabRepresentation}</p>
              </section>

              <section className="learning-daw-card">
                <h3>In a DAW</h3>
                <p>{transfer.dawLocation}</p>
                <p>{context.realWorld}</p>
                <p className="learning-daw-transfer">
                  <strong>Why it transfers:</strong> {transfer.whyItMatters}
                </p>

                <div className="daw-path-heading">
                  <strong>DAW map</strong>
                  <span>Familiar parts stay visible as new ones are introduced.</span>
                </div>
                <div className="daw-path" aria-label="How this concept fits into a DAW">
                  {dawStages.map((stage) => {
                    const familiarity = getDawStageFamiliarity(
                      stage.id,
                      transfer.stage,
                      lessonNumber,
                    );

                    return (
                      <span
                        className={`is-${familiarity}`}
                        key={stage.id}
                        aria-label={`${stage.label}: ${familiarity}`}
                      >
                        {stage.label}
                      </span>
                    );
                  })}
                </div>
                <div className="daw-path-legend" aria-hidden="true">
                  <span className="is-familiar">Already met</span>
                  <span className="is-current">Current idea</span>
                  <span className="is-upcoming">Introduced later</span>
                </div>

                <div className="learning-tool-line">
                  <strong>Vocabulary:</strong>
                  <span>{transfer.vocabulary.join(" · ")}</span>
                  <strong>Tools you may see:</strong>
                  <span>{context.tools.join(" · ")}</span>
                </div>
              </section>
            </div>
          </div>

          {exercise.terms.length > 0 && (
            <section className="learning-glossary">
              <h3>Terms</h3>
              <dl>
                {exercise.terms.map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </details>
    </section>
  );
}
