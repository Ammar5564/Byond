"use client";

import { principles } from "@/lib/content";
import { Reveal } from "./Reveal";

const displayTitles: Record<string, string> = {
  Narrative: "Focus",
  Strategy: "Listening",
  Craft: "Craft",
  Partnership: "Partnership",
};

/**
 * "How we think" — a calm editorial list. The old version pinned the screen for
 * 300vh and ran a WebGL shader behind it; this one scrolls like normal content.
 */
export function Principles() {
  return (
    <section
      id="how-we-think"
      className="relative scroll-mt-[var(--nav-height)] bg-ivory"
    >
      <div className="page-shell py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)] lg:self-start">
            <Reveal>
              <p className="eyebrow">How we think</p>
              <h2 className="display-heading mt-5 text-[clamp(2.1rem,4.6vw,3.5rem)]">
                Building brands that endure isn&apos;t magic —{" "}
                <span className="italic text-burgundy">it requires:</span>
              </h2>
            </Reveal>
          </div>

          <ol className="border-t border-sand">
            {principles.map((item, i) => (
              <li key={item.index} className="border-b border-sand">
                <Reveal delay={i * 0.06}>
                  <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-9 sm:gap-x-10 md:py-12">
                    <span className="font-sans text-[12px] tabular-nums tracking-[0.28em] text-gold-deep">
                      {item.index}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[clamp(2.2rem,5.2vw,4rem)] leading-[1] tracking-tight text-ink transition-colors duration-500 group-hover:text-burgundy">
                        {displayTitles[item.title] ?? item.title}
                      </h3>
                      <p className="mt-4 max-w-lg font-sans text-base leading-relaxed text-ink-soft">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
