"use client";

import { useEffect, useRef } from "react";

type GsapInstance = typeof import("gsap").default;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<{ destroy: () => void } | null>(null);
  const gsapRef = useRef<GsapInstance | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    let destroyed = false;

    async function init() {
      const coarse =
        window.matchMedia("(pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0;
      const narrow = window.innerWidth < 768;

      // Native scroll on phones/tablets — Lenis RAF + scroll proxy is a major lag source
      if (coarse || narrow) {
        return;
      }

      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      rafRef.current = raf;
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    init();

    return () => {
      destroyed = true;
      if (rafRef.current && gsapRef.current) {
        gsapRef.current.ticker.remove(rafRef.current);
      }
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
