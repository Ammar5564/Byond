"use client";

import { useEffect, useRef } from "react";
import { HeroFloatingCards } from "./HeroFloatingCards";

const heroLines = [
  { text: "We are all", accent: false },
  { text: "just stories", accent: true },
  { text: "in their minds.", accent: false },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const cue = cueRef.current;
    if (!content) return;

    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      if (cancelled || !content) return;

      const badge = content.querySelector(".hero-badge");
      const lines = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll(".hero-line-mask")
      );
      const subtitle = content.querySelector(".hero-subtitle");

      gsap.set(badge, { opacity: 0, y: 16 });
      gsap.set(lines, { yPercent: 110 });
      gsap.set(subtitle, { opacity: 0, y: 20 });
      if (cue) gsap.set(cue, { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(badge, { opacity: 1, y: 0, duration: 0.9 }, 0.2)
        .to(
          lines,
          {
            yPercent: 0,
            duration: 1.15,
            stagger: 0.14,
            ease: "power3.out",
          },
          0.35
        )
        .to(subtitle, { opacity: 1, y: 0, duration: 0.85 }, 1.05);

      if (cue) {
        tl.to(cue, { opacity: 1, y: 0, duration: 0.7 }, 1.25);
        gsap.to(cue, {
          y: 6,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }
    }

    animate();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden bg-transparent"
    >
      <HeroFloatingCards />

      <div
        ref={contentRef}
        className="pointer-events-none relative z-10 mx-auto w-full max-w-[1400px] bg-transparent px-6 pt-[calc(var(--nav-height)+2rem)] pb-28 md:px-10 md:pt-[calc(var(--nav-height)+3rem)] md:pb-32"
      >
        <span className="hero-badge mb-8 inline-block rounded-full border border-snow/15 bg-black/0 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.28em] text-snow/60 backdrop-blur-[2px] md:mb-10">
          Born in Cairo. Built for the world.
        </span>

        <h1 className="display-heading text-[clamp(2.75rem,9.5vw,7.5rem)] leading-[0.92] text-snow drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
          {heroLines.map((line) => (
            <span key={line.text} className="block overflow-hidden pb-[0.06em]">
              <span
                className={`hero-line-mask inline-block will-change-transform ${
                  line.accent
                    ? "font-accent text-[1.05em] italic tracking-normal text-crimson/75"
                    : ""
                }`}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-subtitle mt-10 max-w-lg font-sans text-sm tracking-wide text-snow/60 md:mt-12 md:text-base">
          Cairo-born. Strategy, cinema, and digital craft.
        </p>
      </div>

      <a
        ref={cueRef}
        href="#how-we-think"
        className="cursor-hover absolute bottom-10 left-6 z-10 flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.32em] text-snow/45 transition-colors duration-500 hover:text-snow md:bottom-12 md:left-10"
      >
        Scroll
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
