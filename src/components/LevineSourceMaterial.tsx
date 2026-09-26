import { BookSourceMaterialView } from "./SchoenbergSourceMaterial";
import { getLevineSourceMaterial } from "../music/levineSourceMaterial";

export function LevineSourceMaterial({ id }: { id: string }) {
  const material = getLevineSourceMaterial(id);

  if (!material) {
    return (
      <div className="source-material-missing">
        Source material {id} is not registered.
      </div>
    );
  }

  return <BookSourceMaterialView material={material} />;
}
