import { TIMELINE_CLASSES } from "../utils/constants";

export function TimelineLanes({ lanesCount, rowH }) {
  return (
    <>
      {Array.from({ length: lanesCount }).map((_, i) => (
        <div
          key={i}
          className={i % 2 === 0 ? TIMELINE_CLASSES.LANE_STRIPE_EVEN : TIMELINE_CLASSES.LANE_STRIPE_ODD}
          style={{ top: i * rowH, height: rowH }}
        />
      ))}
    </>
  );
} 