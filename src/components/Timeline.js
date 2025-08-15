import { useRef } from "react";
import { useTimeline } from "../hooks/useTimeline";
import { useElementWidth } from "../hooks/useElementWidth";
import { TimelineAxis } from "./TimelineAxis";
import { TimelineBody } from "./TimelineBody";
import { TIMELINE_CLASSES } from "../utils/constants";

export function Timeline({ items }) {
  const { lanes, timelineStart, timelineEnd, rowH, headerH } = useTimeline(items);
  const containerRef = useRef(null);
  const measuredWidth = useElementWidth(containerRef);
  
  const width = measuredWidth;



  return (
    <div ref={containerRef} className={TIMELINE_CLASSES.CONTAINER}>
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