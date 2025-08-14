import { useMemo, useRef, } from "react";
import { assignLanes } from "../assignLanes";
import { parseISO } from "../utils/parseISO";
import { daysBetween } from "../utils/daysBetween";
import { useElementWidth } from "../hooks/useElementWidth";
import { buildMonthlyTicks } from "../utils/buildMonthlyTicks";
import { formatMonth } from "../utils/formatMonth";

export function Timeline({ items }) {
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

  const rowH = 36;
  const headerH = 40;
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
    <div className="relative rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header / Axis */}
      <div className="relative border-b border-slate-200 bg-slate-50" style={{ height: headerH }}>
        <div ref={axisRef} className="relative h-full">
          {ticks.map((t) => (
            <div key={t.toISOString()} className="absolute top-0 -translate-x-1/2 text-[11px]" style={{ left: xForDate(t) }}>
              <div className="w-px h-full bg-slate-200 mx-auto" />
              <div className="absolute top-1 -translate-x-1/2 whitespace-nowrap text-slate-600">{formatMonth(t)}</div>
            </div>
          ))}
          {showToday && (
            <div className="absolute inset-y-0" style={{ left: todayX }}>
              <div className="w-[2px] h-full bg-rose-400"></div>
              <div className="absolute top-1 -translate-x-1/2 text-xs text-rose-600">Today</div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative" style={{ height: lanes.length * rowH }}>
        {/* Lane stripes */}
        {Array.from({ length: lanes.length }).map((_, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? "absolute left-0 right-0 bg-slate-50/60" : "absolute left-0 right-0 bg-white"}
            style={{ top: i * rowH, height: rowH }}
          />
        ))}

        {/* Items */}
        <div className="relative">
          {flat.map((it) => {
            const start = parseISO(it.start);
            const end = parseISO(it.end);
            const left = xForDate(start);
            const right = xForDate(end);
            let widthPx = Math.max(minBarPx, right - left || minBarPx);
            return (
              <div
                key={it.id}
                className="absolute flex items-center rounded-md border border-sky-200 bg-sky-100/80 backdrop-blur-sm shadow-sm"
                style={{
                  top: it.laneIndex * rowH + 4,
                  left,
                  width: widthPx,
                  height: rowH - 8,
                }}
                title={`${it.name} • ${it.start} → ${it.end}`}
              >
                <span className="px-2 text-sm text-sky-900 truncate">{it.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}