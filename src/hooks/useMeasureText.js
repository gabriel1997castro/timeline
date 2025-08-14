import { useMemo } from 'react';

export function useMeasureText() {
  return useMemo(() => {
    if (typeof document === "undefined") return () => 0;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // The font size should mirror the tailwind text-sm class used in labels.
    ctx.font =
      '14px system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial';

    return (text) => {
      return Math.ceil(ctx.measureText(text).width);
    };
  }, []);
}
