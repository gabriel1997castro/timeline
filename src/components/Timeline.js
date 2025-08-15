import { useTimeline } from "../hooks/useTimeline";
import { useRef } from "react";
import { useElementWidth } from "../hooks/useElementWidth";
import { TimelineAxis } from "./TimelineAxis";
import { TimelineBody } from "./TimelineBody";

export function Timeline({ items }) {
  const { lanes, timelineStart, timelineEnd, rowH, headerH } = useTimeline(items);
  const containerRef = useRef(null);
  const width = useElementWidth(containerRef);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg shadow-slate-900/50"
    >
      {/* Header / Axis */}
      <TimelineAxis
        timelineStart={timelineStart}
        timelineEnd={timelineEnd}
        headerH={headerH}
        width={width}
      />
      {/* Body */}
      <TimelineBody
        lanes={lanes}
        rowH={rowH}
        timelineStart={timelineStart}
        timelineEnd={timelineEnd}
        width={width}
      />
    </div>
  );
}