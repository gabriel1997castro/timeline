export function buildMonthlyTicks(start, end) {
  const ticks = [];
  const s = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  let d = s < start ? new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() + 1, 1)) : s;
  while (d <= end) {
    ticks.push(new Date(d));
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  }
  return ticks;
}
