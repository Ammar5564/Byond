"use client";

import { useEffect, useRef } from "react";
import { HeroFloatingCards, HeroMarquee } from "./HeroFloatingCards";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Desktop-only cursor parallax. One rAF per pointer move, writes 2 CSS vars;
  // the cards ease via CSS transitions, so there is no per-frame JS loop.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate overflow-hidden bg-ivory xl:flex xl:h-[100svh] xl:min-h-[640px] xl:items-center xl:justify-center"
    >
      {/* Static atmosphere: zero per-frame cost */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 48%, rgb(255 255 255 / 0.9) 0%, transparent 70%), radial-gradient(40% 40% at 88% 6%, rgb(126 22 49 / 0.09) 0%, transparent 70%), radial-gradient(45% 45% at 6% 96%, rgb(176 141 87 / 0.14) 0%, transparent 70%)",
        }}
      />

      <div className="hidden xl:block">
        <HeroFloatingCards />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-10 pt-[calc(var(--nav-height)+2.5rem)] text-center sm:px-8 xl:max-w-[60rem] xl:pb-0 xl:pt-[var(--nav-height)]">
        <p className="eyebrow">Strategy, cinema &amp; digital craft</p>

        <h1 className="mt-5 font-sans text-[clamp(2.4rem,11.5vw,3.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-ink sm:text-6xl xl:whitespace-nowrap xl:text-[clamp(3.5rem,6.4vw,8rem)]">
          Byond <span className="text-burgundy">Media</span>
        </h1>

        <p className="mt-2 font-accent text-3xl leading-none text-wine sm:text-4xl xl:mt-3 xl:text-5xl">
          Born in Cairo
        </p>

        <p className="hero-lead mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-soft sm:text-base">
          A Cairo-born studio crafting narratives that outlive the moment — for
          the brands building what comes next.
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a href="#work" className="btn-primary">
            View our work
          </a>
          <a href="#contact" className="btn-ghost">
            Start a project
          </a>
        </div>
      </div>

      <div className="pb-14 pt-4 sm:pb-16 xl:hidden">
        <HeroMarquee />
      </div>
    </section>
  );
}
