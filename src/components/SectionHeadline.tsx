"use client";

import { useEffect, useRef } from "react";

export function SectionHeadline({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let trigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !el) return;

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        end: "top 35%",
        scrub: 1,
        animation: gsap.fromTo(
          el,
          { scale: 1.06, opacity: 0.5, transformOrigin: "left center" },
          { scale: 1, opacity: 1, ease: "none" }
        ),
      });
    }

    animate();
    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
