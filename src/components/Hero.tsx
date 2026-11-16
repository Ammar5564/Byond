"use client";

import { useEffect, useRef } from "react";
import { HeroCards } from "./HeroFloatingCards";

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

  // Depth-of-field scroll parallax (phone + laptop): one passive listener writes a single
  // CSS var (0 → 1 while the hero scrolls away); each photo moves by its own depth.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const h = el.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      el.style.setProperty("--sy", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Tell the photos how tall the text block is (phone / tablet cap their height with it).
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hero = heroRef.current;
    const text = textRef.current;
    if (!hero || !text) return;
    const apply = () => {
      const h = text.getBoundingClientRect().height;
      hero.style.setProperty("--text-half", `${Math.round(h / 2 + 14)}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(text);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-night-lift text-champagne"
    >
      {/* Static crimson atmosphere — pure CSS, identical on phone and laptop */}
      <div className="hero-glow pointer-events-none absolute -z-10" aria-hidden="true" />

      <HeroCards />

      {/* keeps the logo / menu legible when a photo slides under the nav */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-night/85 via-night/40 to-transparent"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8 lg:pt-[var(--nav-height)]">
        <div ref={textRef} className="flex flex-col items-center text-center lg:max-w-[60rem]">
          <p className="hero-eyebrow eyebrow text-champagne/75">Strategy, cinema &amp; digital craft</p>

          <h1 className="mt-4 font-sans text-[clamp(2.4rem,11.5vw,3.6rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] text-snow sm:text-6xl lg:mt-5 lg:whitespace-nowrap lg:text-[clamp(3.25rem,5.9vw,7.5rem)]">
            Byond Media
          </h1>

          <p className="mt-3 whitespace-nowrap font-display text-[clamp(0.95rem,4.6vw,1.3rem)] font-normal italic leading-[1.2] tracking-[0.01em] text-champagne sm:mt-4 sm:text-3xl lg:mt-4 lg:text-[clamp(1.6rem,2.25vw,2.8rem)]">
            Born in Egypt. Expanding Across the World.
          </p>

          <p className="mt-2.5 max-w-[36ch] font-sans text-[12.5px] leading-[1.55] text-champagne/70 text-balance sm:mt-4 sm:max-w-sm sm:text-[15px] sm:leading-relaxed sm:text-champagne/80 md:max-w-md md:text-base lg:mt-5 lg:text-[15px] xl:text-base">
            A media and creative company building brands and content across the
            Middle East.
          </p>

          <div className="pointer-events-auto mt-5 flex flex-row items-center justify-center gap-3 md:mt-8">
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
