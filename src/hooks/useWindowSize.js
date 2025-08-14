import { useEffect, useState } from "react";

export function useWindowSize() {
  const [size, set] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const onR = () => set({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return size;
}