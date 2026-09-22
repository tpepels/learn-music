import { ConceptVisual } from "./ConceptVisual";
import { getProductionContext } from "../learning/productionContext";

export function ProducerContext({ exerciseId }: { exerciseId: string }) {
  const context = getProductionContext(exerciseId);

  return (
    <section className="producer-context">
      <div className="producer-context-visual">
        <ConceptVisual kind={context.visual} />
      </div>

      <div className="producer-context-grid">
        <article className="context-card context-why">
          <span className="context-kicker">WHY</span>
          <strong>Why makers do this</strong>
          <p>{context.why}</p>
        </article>

        <article className="context-card context-when">
          <span className="context-kicker">WHEN</span>
          <strong>Where it fits in the process</strong>
          <p>{context.when}</p>
        </article>
      </div>

      <article className="tool-context-card">
        <div>
          <span className="context-kicker">WHAT</span>
          <strong>Tools you will meet in real studios</strong>
          <p>{context.realWorld}</p>
        </div>

        <div className="tool-chip-list">
          {context.tools.map((tool) => (
            <span className="tool-chip" key={tool}>{tool}</span>
          ))}
        </div>
      </article>
    </section>
  );
}
