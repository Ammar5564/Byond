"use client";

import { HeroFloatingCards } from "./HeroFloatingCards";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
    >
      <HeroFloatingCards />

      <div className="pointer-events-auto relative z-10 mx-auto flex h-full max-w-4xl items-center justify-center px-4 text-center">
        <div>
          <p className="mb-3 font-mono text-xs tracking-widest text-gray-400 md:text-sm">
            Strategy, cinema, and digital craft.
          </p>

          <h1 className="font-condensed text-6xl font-black uppercase leading-none tracking-tight text-white md:text-8xl lg:text-9xl">
            Byond Media
          </h1>

          <p className="z-20 -mt-6 font-accent text-4xl italic text-gray-300 md:-mt-10 md:text-6xl">
            Born in Cairo
          </p>
        </div>
      </div>
    </section>
  );
}
