"use client";

import { MarqueeBand } from "./MarqueeBand";

const services = [
  "Strategy",
  "Cinema",
  "Digital",
  "Brand",
  "Growth",
  "Consultation",
];

export function ServicesMarquee() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 hidden overflow-hidden border-t border-symphony py-2 opacity-[0.18] md:block"
      aria-hidden="true"
    >
      <MarqueeBand
        items={services}
        speed="slow"
        textClassName="font-sans text-[9px] uppercase tracking-[0.35em] text-snow"
      />
    </div>
  );
}
