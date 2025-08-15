import { useMemo, useState } from "react";
import { assignLanes } from "../assignLanes";
import { parseISO } from "../utils/parseISO";
import { useWindowSize } from "./useWindowSize";
import { TIMELINE_CONFIG } from "../utils/constants";

export function useTimeline(items) {
  const lanes = useMemo(() => assignLanes(items), [items]);
  const flat = useMemo(() => lanes.flatMap((lane, laneIndex) => lane.map(it => ({ ...it, laneIndex }))), [lanes]);



  const minStart = useMemo(() => {
    if (flat.length === 0) return new Date();
    return flat.reduce((acc, it) => {
      const d = parseISO(it.start);
      return d < acc ? d : acc;
    }, parseISO(flat[0].start));
  }, [flat]);

  const maxEnd = useMemo(() => {
    if (flat.length === 0) return new Date();
    return flat.reduce((acc, it) => {
      const d = parseISO(it.end);
      return d > acc ? d : acc;
    }, parseISO(flat[0].end));
  }, [flat]);

  const [padDays, setPadDays] = useState(TIMELINE_CONFIG.PAD_DAYS);
  
  const timelineStart = new Date(Date.UTC(minStart.getUTCFullYear(), minStart.getUTCMonth(), minStart.getUTCDate() - padDays));
  const timelineEnd = new Date(Date.UTC(maxEnd.getUTCFullYear(), maxEnd.getUTCMonth(), maxEnd.getUTCDate() + padDays));
  
  const adjustTimeRange = (increment) => {
    setPadDays(prev => Math.max(0, prev + increment));
  };

  // Compute row height dynamically based on viewport height.
  const { height: winH } = useWindowSize();
  const headerH = TIMELINE_CONFIG.HEADER_HEIGHT;
  const targetBodyH = Math.min(winH * TIMELINE_CONFIG.TARGET_BODY_HEIGHT_RATIO, TIMELINE_CONFIG.MAX_BODY_HEIGHT);
  // lanes.length can be zero when there are no items; guard against division by zero
  const rowH = Math.max(
    TIMELINE_CONFIG.MIN_ROW_HEIGHT,
    Math.min(TIMELINE_CONFIG.MAX_ROW_HEIGHT, Math.floor(targetBodyH / Math.max(1, lanes.length)))
  );



  return {
    lanes,
    timelineStart,
    timelineEnd,
    rowH,
    headerH,
    padDays,
    adjustTimeRange
  };
} 