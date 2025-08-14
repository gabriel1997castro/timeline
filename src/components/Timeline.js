import { useMemo, useRef } from "react";
import { assignLanes } from "../assignLanes";
import { parseISO } from "../utils/parseISO";
import { daysBetween } from "../utils/daysBetween";
import { useElementWidth } from "../hooks/useElementWidth";
import { useWindowSize } from "../hooks/useWindowSize";
import { useMeasureText } from "../hooks/useMeasureText";
import { buildMonthlyTicks } from "../utils/buildMonthlyTicks";
import { formatMonth } from "../utils/formatMonth";

export function Timeline({ items }) {
  const measureText = useMeasureText();
  const lanes = useMemo(() => assignLanes(items), [items]);
  const flat = useMemo(() => lanes.flatMap((lane, laneIndex) => lane.map(it => ({ ...it, laneIndex }))), [lanes]);

  const minStart = useMemo(() => flat.reduce((acc, it) => {
    const d = parseISO(it.start);
    return d < acc ? d : acc;
  }, parseISO(flat[0].start)), [flat]);

  const maxEnd = useMemo(() => flat.reduce((acc, it) => {
    const d = parseISO(it.end);
    return d > acc ? d : acc;
  }, parseISO(flat[0].end)), [flat]);

  const PAD_DAYS = 2;
  const timelineStart = new Date(Date.UTC(minStart.getUTCFullYear(), minStart.getUTCMonth(), minStart.getUTCDate() - PAD_DAYS));
  const timelineEnd = new Date(Date.UTC(maxEnd.getUTCFullYear(), maxEnd.getUTCMonth(), maxEnd.getUTCDate() + PAD_DAYS));

  const axisRef = useRef(null);
  const width = useElementWidth(axisRef);
  const totalDays = daysBetween(timelineStart, timelineEnd);

  // Compute row height dynamically based on viewport height.
  const { height: winH } = useWindowSize();
  const headerH = 48;
  const minRow = 40;
  const maxRow = 64;
  const targetBodyH = Math.min(winH * 0.6, 700);
  // lanes.length can be zero when there are no items; guard against division by zero
  const rowH = Math.max(
    minRow,
    Math.min(maxRow, Math.floor(targetBodyH / Math.max(1, lanes.length)))
  );
  const minBarPx = 64;

  function xForDate(d) {
    const dayIndex = daysBetween(timelineStart, d) - 1; // 0-based
    return Math.round((dayIndex / totalDays) * width);
  }

  const ticks = useMemo(() => buildMonthlyTicks(timelineStart, timelineEnd), [timelineStart, timelineEnd]);
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const showToday = todayUTC >= timelineStart && todayUTC <= timelineEnd;
  const todayX = showToday ? xForDate(todayUTC) : null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      {/* Header / Axis */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm" style={{ height: headerH }}>
        <div ref={axisRef} className="relative h-full">
          {ticks.map((t) => (
            <div key={t.toISOString()} className="absolute top-0 -translate-x-1/2" style={{ left: xForDate(t) }}>
              <div className="w-px h-full bg-slate-200 mx-auto" />
              <div className="absolute top-2 -translate-x-1/2 whitespace-nowrap font-medium text-xs text-slate-600">
                {formatMonth(t)}
              </div>
            </div>
          ))}
          {showToday && (
            <div className="absolute inset-y-0 z-10" style={{ left: todayX }}>
              <div className="w-0.5 h-full bg-rose-500/80"></div>
              <div className="absolute top-2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-rose-500 text-[11px] font-medium text-white">
                Today
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative bg-slate-50" style={{ height: lanes.length * rowH }}>
        {/* Lane stripes */}
        {Array.from({ length: lanes.length }).map((_, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? "absolute left-0 right-0 bg-white" : "absolute left-0 right-0 bg-slate-50/40"}
            style={{ top: i * rowH, height: rowH }}
          />
        ))}

        {/* Items */}
        <div className="relative">
          {/* Iterate lane by lane so we can cap bar width at the next event's start within the same lane. */}
          {lanes.map((lane, laneIndex) =>
            lane.map((it, idx) => {
              const start = parseISO(it.start);
              const end = parseISO(it.end);
              const left = xForDate(start);
              const right = xForDate(end);
              // Natural width based solely on dates.
              const naturalW = Math.max(0, right - left);
              // Desired width to fit the label text (including 8px padding on each side).
              const labelW = measureText(it.name) + 16;
              const wantW = Math.max(naturalW, minBarPx, labelW);
              // Determine the maximum available width until the next item starts in the same lane, leaving a small gap.
              const next = lane[idx + 1];
              const availRight = next
                ? xForDate(parseISO(next.start)) - 8
                : width - 4;
              const maxW = Math.max(0, availRight - left);
              // Final width is at least minBarPx and at most the available space.
              const widthPx = Math.max(minBarPx, Math.min(wantW, maxW));
              return (
                <div
                  key={it.id}
                  className="absolute group flex items-center rounded-lg border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-sky-100/90 backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md hover:z-10"
                  style={{
                    top: laneIndex * rowH + 4,
                    left,
                    width: widthPx,
                    height: rowH - 8,
                  }}
                  title={`${it.name} • ${it.start} → ${it.end}`}
                >
                  <div className="flex-1 min-w-0 px-3 py-1">
                    <div className="text-sm font-medium text-sky-900 truncate">
                      {it.name}
                    </div>
                    <div className="text-[11px] text-sky-700/70 truncate">
                      {it.start} → {it.end}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}