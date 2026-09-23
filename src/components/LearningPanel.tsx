import { ConceptVisual } from "./ConceptVisual";
import { getProductionContext } from "../learning/productionContext";
import {
  dawStages,
  getDawCheckpoint,
  getDawStageFamiliarity,
  getDawTransfer,
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
  const checkpoint =
    exercise.letter === "A" ? getDawCheckpoint(lessonNumber) : undefined;

  return (
    <details className="learning-panel" open>
      <summary>
        <strong>Listen & understand</strong>
        <span className="learning-panel-toggle">Concept + DAW</span>
      </summary>

      <div className="learning-panel-body">
        <div className="learning-reading-grid">
          <div className="learning-reading-column">
            <section>
              <h3>The concept</h3>
              <p>{exercise.explanation}</p>
            </section>

            <section className="learning-model-card">
              <h3>The underlying model</h3>
              <p>{transfer.concept}</p>
              <h4>What is actually changing?</h4>
              <p>{transfer.changes}</p>
            </section>

            <section>
              <h3>Listen for</h3>
              <p>{exercise.recognition}</p>
            </section>

            <section className="learning-use-card">
              <h3>Why you would use it</h3>
              <p>{context.why}</p>
              <h4>When it comes up</h4>
              <p>{context.when}</p>
            </section>
          </div>

          <div className="learning-reading-column">
            <div className="learning-concept-visual">
              <ConceptVisual kind={context.visual} />
            </div>

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

            <section className="learning-pitfall">
              <h3>Common confusion</h3>
              <p>{transfer.pitfall}</p>
            </section>
          </div>
        </div>

        {checkpoint && (
          <section className="daw-checkpoint">
            <div className="daw-checkpoint-heading">
              <span>Transfer checkpoint</span>
              <h3>{checkpoint.title}</h3>
              <p>{checkpoint.intro}</p>
            </div>

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
          </section>
        )}

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
  );
}
