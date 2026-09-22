import { ProducerContext } from "./ProducerContext";
import type { ExerciseDefinition } from "../lessons/types";

export function LearningPanel({ exercise }: { exercise: ExerciseDefinition }) {
  return (
    <details className="learning-panel" open>
      <summary>
        <div>
          <span className="learning-panel-icon">?</span>
          <span>
            <strong>Understand what you are doing</strong>
            <small>WHY · WHEN · WHAT · terminology · how to hear it</small>
          </span>
        </div>
        <span className="learning-panel-toggle">Show / hide</span>
      </summary>

      <div className="learning-panel-body">
        <ProducerContext exerciseId={exercise.id} />

        <div className="learning-explanation-grid">
          <article className="learning-copy-card">
            <span className="section-label">What is happening?</span>
            <p>{exercise.explanation}</p>
          </article>

          <article className="learning-copy-card learning-hear-card">
            <span className="section-label">How to hear it</span>
            <p>{exercise.recognition}</p>
          </article>
        </div>

        {exercise.terms.length > 0 && (
          <section className="learning-terms">
            <div className="learning-section-heading">
              <span className="section-label">Words musicians use</span>
              <strong>{exercise.terms.length} terms</strong>
            </div>

            <div className="learning-term-grid">
              {exercise.terms.map((item) => (
                <article className="learning-term-card" key={item.term}>
                  <strong>{item.term}</strong>
                  <p>{item.definition}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </details>
  );
}
