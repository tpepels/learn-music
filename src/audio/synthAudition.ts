export type DisposableSynthAudition = {
  releaseAll: () => unknown;
  dispose: () => unknown;
};

export function disposeSynthAudition<T extends DisposableSynthAudition>(
  synth: T | null,
): null {
  if (synth) {
    synth.releaseAll();
    synth.dispose();
  }

  return null;
}
