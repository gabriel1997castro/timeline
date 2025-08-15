import { TimelineLanes } from "./TimelineLanes";
import { TimelineItem } from "./TimelineItem";
import { TIMELINE_CLASSES } from "../utils/constants";

export function TimelineBody({ 
  lanes, 
  rowH, 
  timelineStart, 
  timelineEnd,
  width
}) {


  // Don't render items if width is not available yet
  if (!width || width === 0) {
    console.log('TimelineBody - width not available yet, skipping item rendering');
    return (
      <div className={TIMELINE_CLASSES.BODY} style={{ height: lanes.length * rowH }}>
        <TimelineLanes lanesCount={lanes.length} rowH={rowH} />
        <div className="relative">
          <div className="flex items-center justify-center h-full text-slate-500">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Add nextItem reference to each item for width calculation
  const lanesWithNextItems = lanes.map(lane => 
    lane.map((item, idx) => ({
      ...item,
      nextItem: lane[idx + 1] || null
    }))
  );



  return (
    <div className={TIMELINE_CLASSES.BODY} style={{ height: lanes.length * rowH }}>
      {/* Lane stripes */}
      <TimelineLanes lanesCount={lanes.length} rowH={rowH} />

      {/* Items */}
      <div className="relative">
        {/* Iterate lane by lane so we can cap bar width at the next event's start within the same lane. */}
        {lanesWithNextItems.map((lane, laneIndex) =>
          lane.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
              laneIndex={laneIndex}
              rowH={rowH}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
              width={width}
            />
          ))
        )}
      </div>
    </div>
  );
} 