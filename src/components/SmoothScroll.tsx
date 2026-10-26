"use client";

import { useEffect } from "react";

/**
 * Desktop-only smooth wheel scrolling (Lenis). Phones and tablets keep the browser's
 * native scrolling — it is the smoothest option there and costs nothing.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let destroyed = false;
    let rafId = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

    async function init() {
      const coarse =
        window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
      if (coarse || window.innerWidth < 768) return;

      const { default: Lenis } = await import("lenis");
      if (destroyed) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });

      const loop = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    init();
    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
