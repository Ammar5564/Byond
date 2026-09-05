"use client";

import { useEffect, useRef } from "react";
import { testimonials, partners } from "@/lib/content";
import { MarqueeBand } from "./MarqueeBand";

const featured = testimonials[0];

export function Trust() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let tween: { scrollTrigger?: { kill: () => void }; kill: () => void } | null =
      null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !section) return;

      const quote = section.querySelector(".trust-quote");
      const meta = section.querySelector(".trust-meta");
      const band = section.querySelector(".trust-band");

      tween = gsap.fromTo(
        [quote, meta, band],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    animate();
    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-symphony symphony-void"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <p className="section-label mb-8">Trust</p>

        <blockquote className="trust-quote max-w-3xl font-display text-[clamp(1.25rem,2.6vw,1.85rem)] leading-snug tracking-tight text-snow/90">
          &ldquo;{featured.quote}&rdquo;
        </blockquote>

        <footer className="trust-meta mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-sans text-sm tracking-wide text-snow">
            {featured.name}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-snow/35">
            {featured.role}
          </span>
        </footer>
      </div>

      <div className="trust-band border-t border-snow/10 py-5">
        <MarqueeBand
          items={partners}
          speed="slow"
          textClassName="font-sans text-[11px] uppercase tracking-[0.22em] text-snow/28"
        />
      </div>
    </section>
  );
}
