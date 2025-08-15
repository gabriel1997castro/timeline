import { TIMELINE_CLASSES } from "../utils/constants";

export function TimelineLanes({ lanesCount, rowH }) {
  return (
    <>
      {Array.from({ length: lanesCount }).map((_, i) => (
        <div
          key={i}
          className={i % 2 === 0 ? "absolute left-0 right-0 bg-slate-900" : "absolute left-0 right-0 bg-slate-800/40"}
          style={{ top: i * rowH, height: rowH }}
        />
      ))}
    </>
  );
} 