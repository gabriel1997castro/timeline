export function daysBetween(a, b) {
  const MS = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.round((b - a) / MS) + 1); // inclusive
}