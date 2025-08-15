// Timeline configuration constants
export const TIMELINE_CONFIG = {
  PAD_DAYS: 2,
  HEADER_HEIGHT: 48,
  MIN_ROW_HEIGHT: 40,
  MAX_ROW_HEIGHT: 64,
  MIN_BAR_PIXELS: 64,
  TARGET_BODY_HEIGHT_RATIO: 0.6,
  MAX_BODY_HEIGHT: 700,
  LABEL_PADDING: 16,
  ITEM_GAP: 8,
  BORDER_PADDING: 4
};

// CSS classes for consistent styling
export const TIMELINE_CLASSES = {
  CONTAINER: "relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",
  HEADER: "sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm",
  BODY: "relative bg-slate-50",
  ITEM: "absolute group flex items-center rounded-lg border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-sky-100/90 backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md hover:z-10",
  LANE_STRIPE_EVEN: "absolute left-0 right-0 bg-white",
  LANE_STRIPE_ODD: "absolute left-0 right-0 bg-slate-50/40"
}; 