import { useState } from "react";
import { useStudioStore } from "../state/studio";
import { getBelkinSourceMaterial } from "../music/belkinSourceMaterial";

export function BelkinSourceMaterial({ id }: { id: string }) {
  const material = getBelkinSourceMaterial(id);
  const [active, setActive] = useState(0);
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );

  if (!material) {
    return (
      <div className="source-material-missing">
        Source material {id} is not registered.
      </div>
    );
  }

  const segment = material.segments[active];

  return (
    <section
      className="source-analysis-map"
      aria-label={material.title + " analysis"}
    >
      <div className="source-material-heading">
        <div>
          <strong>{material.title}</strong>
        </div>
      </div>
      <div className="source-analysis-tabs" role="tablist">
        {material.segments.map((entry, index) => (
          <button
            type="button"
            key={entry.label}
            className={active === index ? "is-active" : ""}
            onClick={() => {
              setActive(index);
              recordLearningExperiment("source.analysis", id + ":" + index);
            }}
            role="tab"
            aria-selected={active === index}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="source-analysis-detail">
        <p>{segment.detail}</p>
      </div>
    </section>
  );
}
