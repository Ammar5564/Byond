"use client";

import { useRef } from "react";
import { principles } from "@/lib/content";
import { ConstellationCanvasClient } from "./ConstellationCanvasClient";

const displayTitles: Record<string, string> = {
  Narrative: "FOCUS",
  Strategy: "LISTENING",
  Craft: "CRAFT",
  Partnership: "PARTNERSHIP",
};

export function Principles() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="how-we-think"
      ref={sectionRef}
      className="relative bg-transparent text-white"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ConstellationCanvasClient sectionRef={sectionRef} />
      </div>

      <div className="relative z-10 bg-transparent text-white">
        <header className="mx-auto flex min-h-[40vh] max-w-[1400px] flex-col items-center justify-end px-6 pb-16 pt-[calc(var(--nav-height)+3rem)] text-center md:px-10">
          <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.35em] text-white/45">
            How we think
          </p>
          <h2 className="display-heading max-w-3xl text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] text-white/90">
            Building brands that endure isn&apos;t magic — it requires:
          </h2>
        </header>

        {principles.map((item) => (
          <div
            key={item.index}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-transparent px-6 text-center md:px-10"
          >
            <span className="mb-6 font-sans text-[10px] tracking-[0.35em] text-[#FF1E27]/80">
              {item.index}
            </span>
            <h3 className="font-condensed text-[clamp(3.5rem,12vw,9rem)] font-black uppercase leading-none tracking-tight text-white">
              {displayTitles[item.title] ?? item.title}
            </h3>
            <p className="mt-8 max-w-md font-sans text-sm leading-relaxed tracking-wide text-white/55 md:text-base">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
