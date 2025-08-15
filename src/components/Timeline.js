import { useTimeline } from "../hooks/useTimeline";
import { useMemo, useRef, useState } from "react";
import { useElementWidth } from "../hooks/useElementWidth";
import { TimelineAxis } from "./TimelineAxis";
import { TimelineBody } from "./TimelineBody";

export function Timeline({ items }) {
  const { lanes, timelineStart, timelineEnd, rowH, headerH, padDays, adjustTimeRange } = useTimeline(items);
  const containerRef = useRef(null);
  const width = useElementWidth(containerRef);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => adjustTimeRange(-2)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-light-primary/90 dark:bg-dark-primary/90 text-white hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
        >
          Zoom in
        </button>
        <button
          onClick={() => adjustTimeRange(2)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-light-primary/90 dark:bg-dark-primary/90 text-white hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
        >
          Zoom out
        </button>
        <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-light-primary/20 dark:bg-dark-primary/20 text-white">
          Extra days shown: {padDays} days before and after
        </span>
      </div>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg shadow-slate-900/50"
      >
        <TimelineAxis
          timelineStart={timelineStart}
          timelineEnd={timelineEnd}
          headerH={headerH}
          width={width}
          padDays={padDays}
          adjustTimeRange={adjustTimeRange}
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
    </div>
  );
}