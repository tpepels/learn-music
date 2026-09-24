export function reverbValueChanged(
  current: unknown,
  next: number,
  epsilon = 1e-6,
): boolean {
  if (typeof current !== "number") return true;
  return Math.abs(current - next) > epsilon;
}
