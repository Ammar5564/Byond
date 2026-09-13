"use client";

import { useRef } from "react";
import { HeroFloatingCards } from "./HeroFloatingCards";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] gpu-accelerate"
    >
      {/* z-10 — interactive WebGL / floating mockups */}
      <HeroFloatingCards heroRef={heroRef} />

      {/* z-20 — hero headline above mockups */}
      <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-5xl items-center justify-center px-4 text-center sm:px-6 md:px-10">
        <div className="flex flex-col items-center">
          <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.28em] text-stone md:mb-5 md:text-[11px]">
            Strategy, cinema, and digital craft.
          </p>

          <h1 className="font-sans text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-balance text-snow sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Byond Media
          </h1>

          {/* Controlled overlap: small negative margin only, never beyond legibility */}
          <p className="relative z-[1] -mt-1 font-accent text-2xl italic leading-none text-champagne/90 sm:text-3xl md:-mt-2 md:text-4xl lg:text-5xl">
            Born in Cairo
          </p>
        </div>
      </div>
    </section>
  );
}
