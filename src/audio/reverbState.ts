export function reverbValueChanged(
  current: number,
  next: number,
  epsilon = 1e-6,
): boolean {
  return Math.abs(current - next) > epsilon;
}
