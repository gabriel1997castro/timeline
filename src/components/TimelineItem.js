import { parseISO } from "../utils/parseISO";
import { daysBetween } from "../utils/daysBetween";
import { useMeasureText } from "../hooks/useMeasureText";
import { TIMELINE_CONFIG, TIMELINE_CLASSES } from "../utils/constants";

export function TimelineItem({ 
  item, 
  laneIndex, 
  rowH, 
  timelineStart, 
  timelineEnd, 
  width 
}) {


  const measureText = useMeasureText();
  const totalDays = daysBetween(timelineStart, timelineEnd);

  function xForDate(d) {
    const dayIndex = daysBetween(timelineStart, d) - 1; // 0-based
    return Math.round((dayIndex / totalDays) * width);
  }

  const start = parseISO(item.start);
  const end = parseISO(item.end);
  const left = xForDate(start);
  const right = xForDate(end);
  
  // Natural width based solely on dates.
  const naturalW = Math.max(0, right - left);
  // Desired width to fit the label text (including padding on each side).
  const labelW = measureText(item.name) + TIMELINE_CONFIG.LABEL_PADDING;
  const wantW = Math.max(naturalW, TIMELINE_CONFIG.MIN_BAR_PIXELS, labelW);
  // Determine the maximum available width until the next item starts in the same lane, leaving a small gap.
  const next = item.nextItem;
  const availRight = next
    ? xForDate(parseISO(next.start)) - TIMELINE_CONFIG.ITEM_GAP
    : width - TIMELINE_CONFIG.BORDER_PADDING;
  const maxW = Math.max(0, availRight - left);
  // Final width is at least minBarPx and at most the available space.
  const widthPx = Math.max(TIMELINE_CONFIG.MIN_BAR_PIXELS, Math.min(wantW, maxW));



  return (
    <div
      className={TIMELINE_CLASSES.ITEM}
      style={{
        top: laneIndex * rowH + 4,
        left,
        width: widthPx,
        height: rowH - 8,
      }}
      title={`${item.name} • ${item.start} → ${item.end}`}
    >
      <div className="flex-1 min-w-0 px-3 py-1">
        <div className="text-sm font-medium text-sky-900 truncate">
          {item.name}
        </div>
        <div className="text-[11px] text-sky-700/70 truncate">
          {item.start} → {item.end}
        </div>
      </div>
    </div>
  );
} 