import { ConceptVisual } from "./ConceptVisual";
import { getProductionContext } from "../learning/productionContext";
import {
  dawStages,
  getDawCheckpoint,
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
              <p>{transfer.concept}</p>
            </section>

            <section>
              <h3>In this exercise</h3>
              <p>{exercise.explanation}</p>
            </section>

            <section className="learning-model-card">
              <h3>What is actually changing?</h3>
              <p>{transfer.changes}</p>
            </section>

            <section>
              <h3>Why this matters</h3>
              <p>{transfer.whyItMatters}</p>
            </section>
          </div>

          <div className="learning-reading-column">
            <div className="learning-concept-visual">
              <ConceptVisual kind={context.visual} />
            </div>

            <section>
              <h3>Listen for</h3>
              <p>{exercise.recognition}</p>
            </section>

            <section className="learning-daw-card">
              <h3>In a DAW</h3>
              <p>{transfer.dawLocation}</p>
              <p>{context.realWorld}</p>

              <div className="daw-path" aria-label="Where this concept sits in a DAW">
                {dawStages.map((stage) => (
                  <span
                    className={stage.id === transfer.stage ? "is-active" : ""}
                    key={stage.id}
                  >
                    {stage.label}
                  </span>
                ))}
              </div>

              <div className="learning-tool-line">
                <strong>Vocabulary:</strong>
                <span>{transfer.vocabulary.join(" · ")}</span>
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
