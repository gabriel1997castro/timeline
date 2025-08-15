import { daysBetween } from "../utils/daysBetween";
import { buildMonthlyTicks } from "../utils/buildMonthlyTicks";
import { formatMonth } from "../utils/formatMonth";

export function TimelineAxis({ timelineStart, timelineEnd, headerH = 48, width }) {
  const totalDays = daysBetween(timelineStart, timelineEnd);

  function xForDate(d) {
    const dayIndex = daysBetween(timelineStart, d) - 1; // 0-based
    return Math.round((dayIndex / totalDays) * width);
  }

  const ticks = buildMonthlyTicks(timelineStart, timelineEnd);
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const showToday = todayUTC >= timelineStart && todayUTC <= timelineEnd;
  const todayX = showToday ? xForDate(todayUTC) : null;

  return (
    <div className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm" style={{ height: headerH }}>
      <div className="relative h-full">
        {ticks.map((t) => (
          <div key={t.toISOString()} className="absolute top-0 -translate-x-1/2" style={{ left: xForDate(t) }}>
            <div className="w-px h-full bg-slate-600 mx-auto" />
            <div className="absolute top-2 -translate-x-1/2 whitespace-nowrap font-medium text-xs text-slate-300">
              {formatMonth(t)}
            </div>
          </div>
        ))}
        {showToday && (
          <div className="absolute inset-y-0 z-10" style={{ left: todayX }}>
            <div className="w-0.5 h-full bg-rose-400/80"></div>
            <div className="absolute top-2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-rose-400 text-[11px] font-medium text-slate-900">
              Today
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 