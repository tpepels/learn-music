import { ConceptVisual } from "./ConceptVisual";
import { getProductionContext } from "../learning/productionContext";
import type { ExerciseDefinition } from "../lessons/types";

export function LearningPanel({ exercise }: { exercise: ExerciseDefinition }) {
  const context = getProductionContext(exercise.id);

  return (
    <details className="learning-panel" open>
      <summary>
        <strong>Listen & understand</strong>
        <span className="learning-panel-toggle">Theory</span>
      </summary>

      <div className="learning-panel-body">
        <div className="learning-reading-grid">
          <div className="learning-reading-column">
            <section>
              <h3>The idea</h3>
              <p>{exercise.explanation}</p>
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

            <section>
              <h3>In a DAW or instrument</h3>
              <p>{context.realWorld}</p>
              <p className="learning-tool-line">
                <strong>Tools:</strong> {context.tools.join(" · ")}
              </p>
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
  );
}
