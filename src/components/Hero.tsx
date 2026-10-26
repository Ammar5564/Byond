"use client";

import { useEffect, useRef } from "react";
import { HeroFloatingCards, HeroStack } from "./HeroFloatingCards";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Laptop-only cursor parallax. One rAF per pointer move, writes 2 CSS vars;
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
      className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-night text-champagne"
    >
      {/* Static crimson atmosphere — pure CSS, identical on phone and laptop */}
      <div className="hero-glow pointer-events-none absolute -z-10" aria-hidden="true" />

      <div className="hidden lg:block">
        <HeroFloatingCards />
      </div>
      <div className="lg:hidden">
        <HeroStack />
      </div>

      {/* keeps the logo / menu legible when a photo slides under the nav */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-night/85 via-night/40 to-transparent"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8 lg:pt-[var(--nav-height)]">
        <div className="flex flex-col items-center text-center lg:max-w-[60rem]">
          <p className="eyebrow text-champagne/75">Strategy, cinema &amp; digital craft</p>

          <h1 className="mt-4 font-sans text-[clamp(2.4rem,11.5vw,3.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-snow sm:text-6xl lg:mt-5 lg:whitespace-nowrap lg:text-[clamp(3.5rem,6.4vw,8rem)]">
            Byond Media
          </h1>

          <p className="mt-3 font-accent text-3xl leading-none text-champagne sm:text-4xl lg:mt-3 lg:text-5xl">
            Born in Cairo
          </p>

          <p className="hero-lead mt-6 max-w-md font-sans text-sm leading-relaxed text-champagne/75 max-md:hidden md:text-base">
            A Cairo-born studio crafting narratives that outlive the moment — for
            the brands building what comes next.
          </p>

          <div className="pointer-events-auto mt-6 flex flex-row items-center justify-center gap-3 md:mt-8">
            <a href="#work" className="btn-light whitespace-nowrap px-5 py-3 text-[11px] tracking-[0.14em] md:px-7 md:py-3.5 md:text-[12px] md:tracking-[0.18em]">
              View our work
            </a>
            <a href="#contact" className="btn-ghost-dark whitespace-nowrap px-5 py-3 text-[11px] tracking-[0.14em] md:px-7 md:py-3.5 md:text-[12px] md:tracking-[0.18em]">
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
