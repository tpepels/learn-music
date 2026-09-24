export function reverbValueChanged(
  current: number | string,
  next: number,
  epsilon = 1e-6,
): boolean {
  if (typeof current !== "number") return true;
  return Math.abs(current - next) > epsilon;
}
