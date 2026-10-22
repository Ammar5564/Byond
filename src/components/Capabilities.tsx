"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { capabilities } from "@/lib/content";
import { blurFor } from "@/lib/img";
import { Reveal } from "./Reveal";

/**
 * Services: on desktop a sticky photo frame cross-fades while the list scrolls
 * beside it (opacity/transform only — no pinning, no scrubbed timelines).
 * On phones every service is a simple card with its own photo.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Active service = the one whose centre is closest to the middle of the viewport.
  // (Scroll-position based, so anchor jumps and fast flicks can't skip a step.)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const total = String(capabilities.length).padStart(2, "0");

  return (
    <section
      id="capabilities"
      className="relative scroll-mt-[var(--nav-height)] bg-cream"
    >
      <div className="page-shell py-24 md:py-32">
        <Reveal>
          <p className="eyebrow">Capabilities</p>
          <h2 className="display-heading mt-5 text-[clamp(2.4rem,5.4vw,4.25rem)]">
            What we do
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          {/* List */}
          <ol className="order-2 lg:order-1">
            {capabilities.map((item, i) => {
              const isActive = i === active;
              return (
                <li
                  key={item.index}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-idx={i}
                  className="border-t border-sand py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[46svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
                >
                  {/* Phone / tablet photo */}
                  <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-3xl bg-sand shadow-[0_30px_60px_-34px_rgba(60,10,25,0.55)] lg:hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width:1023px) 92vw, 1px"
                      quality={80}
                      placeholder="blur"
                      blurDataURL={blurFor(item.image)}
                      className="object-cover"
                    />
                  </div>

                  <div
                    className={`transition-opacity duration-700 ease-luxury ${
                      isActive ? "lg:opacity-100" : "lg:opacity-30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-[12px] tabular-nums tracking-[0.28em] text-gold-deep">
                        {item.index}
                      </span>
                      <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
                      <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-burgundy">
                        {item.code}
                      </span>
                    </div>
                    <h3 className="display-heading mt-4 text-[clamp(2.1rem,4vw,3.4rem)]">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Desktop sticky photo frame */}
          <div className="relative order-1 hidden lg:order-2 lg:block">
            <div className="sticky top-[calc(var(--nav-height)+2rem)]">
              <div className="relative aspect-[5/4] max-h-[calc(100svh-var(--nav-height)-4rem)] w-full overflow-hidden rounded-[28px] bg-sand shadow-[0_50px_90px_-45px_rgba(60,10,25,0.6)] ring-1 ring-white/60">
                {capabilities.map((item, i) => (
                  <div
                    key={item.index}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-luxury will-change-[opacity,transform] ${
                      i === active
                        ? "scale-100 opacity-100"
                        : "scale-[1.04] opacity-0"
                    }`}
                    aria-hidden={i !== active}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width:1024px) 50vw, 1px"
                      quality={80}
                      placeholder="blur"
                      blurDataURL={blurFor(item.image)}
                      className="object-cover"
                    />
                  </div>
                ))}

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/55 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                  <span className="rounded-full bg-ivory/90 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy">
                    {capabilities[active].title}
                  </span>
                  <span className="font-sans text-[12px] tabular-nums tracking-[0.24em] text-ivory">
                    {capabilities[active].index} / {total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
