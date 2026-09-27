import { useEffect, useState } from "react";
import { ConceptVisual } from "./ConceptVisual";
import { BelkinSourceMaterial } from "./BelkinSourceMaterial";
import { LevineSourceMaterial } from "./LevineSourceMaterial";
import { SchoenbergSourceMaterial } from "./SchoenbergSourceMaterial";
import { getProductionContext } from "../learning/productionContext";
import {
  dawStages,
  getDawCheckpoint,
  getDawStageFamiliarity,
  getDawTransfer,
  getPlayLabRepresentation,
} from "../learning/dawTransfer";
import type { ExerciseDefinition } from "../lessons/types";
import { useStudioStore } from "../state/studio";

export function LearningPanel({
  exercise,
  lessonNumber,
}: {
  exercise: ExerciseDefinition;
  lessonNumber: number;
}) {
  const savedReflection = useStudioStore(
    (state) =>
      state.learningExperiments[exercise.id]?.["reflection.answer"]?.values.at(-1) ??
      "",
  );
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );
  const [reflection, setReflection] = useState(savedReflection);

  useEffect(() => {
    setReflection(savedReflection);
  }, [exercise.id, savedReflection]);

  const isLevine = exercise.id.startsWith("levine.");
  const sourceTrack =
    exercise.id.startsWith("schoenberg.") ||
    exercise.id.startsWith("belkin.") ||
    isLevine;

  if (sourceTrack) {
    const SourceMaterial = exercise.id.startsWith("belkin.")
      ? BelkinSourceMaterial
      : exercise.id.startsWith("levine.")
        ? LevineSourceMaterial
        : SchoenbergSourceMaterial;

    return (
      <section
        className="exercise-guide schoenberg-guide"
        aria-label="Current exercise guide"
      >
        <div className="schoenberg-guide-reading-grid">
          <section className="schoenberg-guide-explanation" aria-label="Concept">
            <span className="section-label">{isLevine ? "What changes" : "Concept"}</span>
            <h2>{exercise.learn}</h2>
            <div className="schoenberg-guide-copy">
              {exercise.explanation
                .split(/\n\n+/)
                .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>

          <section className="schoenberg-guide-exercise" aria-label="Exercise">
            <span className="section-label">{isLevine ? "Build & hear" : "Exercise"}</span>
            <div className="schoenberg-guide-copy">
              {exercise.instruction
                .split(/\n\n+/)
                .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="schoenberg-guide-listen">
              <strong>Listen for</strong>
              <p>{exercise.recognition}</p>
            </div>

            {isLevine && exercise.takeaway ? (
              <div className="jazz-make-stick">
                <span>Make this stick</span>
                <strong>{exercise.takeaway}</strong>
              </div>
            ) : null}

            {isLevine && exercise.hint ? (
              <details className="jazz-hint">
                <summary>
                  <span>Need a hint?</span>
                  <b>Show</b>
                </summary>
                <p>{exercise.hint}</p>
              </details>
            ) : null}
          </section>
        </div>

        {isLevine ? (
          <div className="jazz-keyboard-cue">
            <strong>See it on the piano</strong>
            <span>
              The Keyboard view below follows the selected grid step, highlights
              the actual keys and names the intervals between them. Use the grid
              for time; use the keyboard for shape.
            </span>
          </div>
        ) : null}

        {exercise.terms.length > 0 ? (
          <div className="schoenberg-guide-terms" aria-label="Terms">
            {exercise.terms.map((item) => (
              <p key={item.term}>
                <strong>{item.term}</strong>
                <span>{item.definition}</span>
              </p>
            ))}
          </div>
        ) : null}

        {exercise.source?.exampleIds?.length ? (
          <section className="schoenberg-guide-example-section" aria-label="Examples">
            <span className="section-label">{isLevine ? "Reference" : "Examples"}</span>
            <div className="source-material-list schoenberg-guide-examples">
              {exercise.source.exampleIds.map((id) => (
                <SourceMaterial id={id} key={id} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    );
  }

  const context = getProductionContext(exercise.id);
  const transfer = getDawTransfer(exercise.workspace);
  const playLabRepresentation = getPlayLabRepresentation(exercise.workspace);
  const checkpoint =
    exercise.letter === "A" ? getDawCheckpoint(lessonNumber) : undefined;

  const reflectionWordCount = reflection.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="exercise-guide" aria-label="Current exercise guide">
      <section className="exercise-guide-concept" aria-label="Core idea">
        <span className="section-label">Idea</span>
        <h2>{exercise.learn}</h2>
        <p>{exercise.explanation}</p>
      </section>

      <div className="exercise-guide-primary">
        <div className="exercise-guide-do">
          <span className="section-label">Try it</span>
          <p>{exercise.instruction}</p>
        </div>

        <div className="exercise-guide-listen">
          <span className="section-label">Listen for</span>
          <p>{exercise.recognition}</p>
          <label className="learning-reflection">
            <strong>What did you hear?</strong>
            <textarea
              rows={2}
              value={reflection}
              placeholder="One short observation - describe the musical difference in your own words."
              onChange={(event) => setReflection(event.target.value)}
              onBlur={() => {
                const answer = reflection.trim();
                if (answer) recordLearningExperiment("reflection.answer", answer);
              }}
            />
            <small>
              {reflectionWordCount >= 3
                ? "Observation ready."
                : "Write at least three words before completing this exercise."}
            </small>
          </label>
        </div>

        {exercise.source && (
          <div className="exercise-guide-source">
            <span className="section-label">From the book</span>
            <strong>{exercise.source.reference}</strong>
            <p>{exercise.source.focus}</p>
            {exercise.source.exampleIds?.length ? (
              <div className="source-material-list">
                {exercise.source.exampleIds.map((id) => (
                  <SchoenbergSourceMaterial id={id} key={id} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <details className="exercise-guide-details">
        <summary>
          <div>
            <strong>Vocabulary / DAW transfer</strong>
            <span>Open for terminology, the underlying model and where this appears in a DAW.</span>
          </div>
          <b>Open</b>
        </summary>

        <div className="exercise-guide-details-body">
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

          <details className="learning-deep-dive">
            <summary>
              <div>
                <strong>PLAY / LAB → DAW</strong>
                <span>Transfer the same idea to production tools.</span>
              </div>
              <b>Explore</b>
            </summary>

            <div className="learning-panel-body">
              {checkpoint && (
                <div className="daw-checkpoint-inline">
                  <span className="section-label">DAW checkpoint</span>
                  <strong>{checkpoint.title}</strong>
                  <p>{checkpoint.intro}</p>
                </div>
              )}

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
            </div>
          </details>
        </div>
      </details>
    </section>
  );
}
