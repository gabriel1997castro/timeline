export function formatMonth(d) {
  return d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}