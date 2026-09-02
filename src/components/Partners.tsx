"use client";

import { partners } from "@/lib/content";
import { MarqueeBand } from "./MarqueeBand";

export function Partners() {
  return (
    <section className="relative overflow-hidden border-y border-symphony symphony-void py-20">
      <MarqueeBand
        items={partners}
        speed="normal"
        textClassName="font-sans text-[11px] uppercase tracking-[0.2em] text-snow/30"
      />
      <MarqueeBand
        items={[...partners].reverse()}
        speed="slow"
        direction="right"
        className="mt-4"
        textClassName="font-display text-xl italic text-snow/15 md:text-2xl"
      />
    </section>
  );
}
