export function effectiveChorusWet(
  chorusWet: number,
  monoAudition: boolean,
): number {
  if (monoAudition) return 0;
  return Math.min(0.65, Math.max(0, chorusWet));
}
