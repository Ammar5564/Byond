"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { testimonials } from "@/lib/content";
import { Reveal } from "./Reveal";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 50, label: "Clients" },
  { value: 300, label: "Projects Completed" },
  { value: 25000, suffix: "+", label: "Working Hours" },
  { value: 5, label: "Countries" },
];

/** Partner logos — prestige-first order (files in /public/partners) */
const BRANDS = [
  { name: "ExxonMobil", src: "/partners/exxonmobil.png" },
  { name: "Allianz", src: "/partners/allianz.png" },
  { name: "EMAAR", src: "/partners/emaar.png" },
  { name: "Jotun", src: "/partners/jotun.png" },
  { name: "Palm Hills Developments", src: "/partners/palm-hills-developments.png" },
  { name: "SODIC", src: "/partners/sodic.png" },
  { name: "Hassan Allam", src: "/partners/hassan-allam.png" },
  { name: "Elsewedy Electric", src: "/partners/elsewedy-electric.png" },
  { name: "Al Ahly Sabbour", src: "/partners/al-ahly-sabbour.png" },
  { name: "Dorra", src: "/partners/dorra.png" },
  { name: "XTB", src: "/partners/xtb.png" },
  { name: "PGESCO", src: "/partners/pgesco.png" },
  { name: "Century City", src: "/partners/century-city.png" },
  { name: "Menassat Developments", src: "/partners/menassat-developments.png" },
  { name: "New Avenue Real Estate", src: "/partners/new-avenue-real-estate.png" },
  { name: "Cityscape", src: "/partners/cityscape.png" },
  { name: "Lorenz", src: "/partners/lorenz.png" },
  { name: "Ignite", src: "/partners/ignite.png" },
];

const formatStat = (n: number, suffix = "") =>
  `${n.toLocaleString("en-US")}${suffix}`;

function CountUpStat({ value, suffix = "", label }: Stat) {
  const ref = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const valueEl = valueRef.current;
    if (!el || !valueEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const write = (n: number) => {
      valueEl.textContent = formatStat(n, suffix);
    };

    let raf = 0;
    let started = false;
    if (!reduce) write(0);

    const run = () => {
      if (started) return;
      started = true;
      if (reduce) return write(value);

      const duration = value >= 1000 ? 2600 : 2000;
      const start = performance.now();
      let last = -1;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const next = Math.round(value * (1 - Math.pow(1 - t, 5)));
        if (next !== last) {
          last = next;
          write(next);
        }
        if (t < 1) raf = requestAnimationFrame(tick);
        else write(value);
      };
      raf = requestAnimationFrame(tick);
    };

    // SSR / no-JS shows the final value; with JS it resets to 0 and counts up when visible
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, suffix]);

  return (
    <div ref={ref} role="listitem" className="min-w-0 px-2 py-2 sm:px-6">
      <p
        className="font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-none tracking-tight text-burgundy tabular-nums"
        aria-label={`${formatStat(value, suffix)} ${label}`}
      >
        <span ref={valueRef}>{formatStat(value, suffix)}</span>
      </p>
      <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        {label}
      </p>
    </div>
  );
}

function LogoRow({
  brands,
  reverse,
}: {
  brands: typeof BRANDS;
  reverse?: boolean;
}) {
  const doubled = [...brands, ...brands];
  return (
    <div className="marquee-mask overflow-hidden py-2">
      <div
        className={`marquee-track flex w-max gap-4 ${
          reverse ? "animate-marquee-slow-reverse" : "animate-marquee-slow"
        }`}
      >
        {doubled.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="relative h-24 w-44 shrink-0 rounded-2xl border border-sand bg-white shadow-[0_12px_30px_-20px_rgba(60,10,25,0.35)] sm:h-28 sm:w-52"
            aria-hidden={i >= brands.length ? true : undefined}
          >
            <Image
              src={brand.src}
              alt={i >= brands.length ? "" : brand.name}
              fill
              sizes="208px"
              className="object-contain p-5 opacity-80 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Trust() {
  const half = Math.ceil(BRANDS.length / 2);

  return (
    <section
      id="trust"
      className="relative scroll-mt-[var(--nav-height)] border-y border-sand bg-cream"
      aria-labelledby="trust-heading"
    >
      <div className="page-shell py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Social proof</p>
          <h2
            id="trust-heading"
            className="display-heading mt-4 max-w-2xl text-[clamp(2.25rem,5vw,3.75rem)]"
          >
            Trusted by brands that endure
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mt-12 grid grid-cols-2 gap-y-10 divide-sand md:mt-16 md:grid-cols-4 md:divide-x"
            role="list"
            aria-label="Agency impact"
          >
            {STATS.map((stat) => (
              <CountUpStat key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>
      </div>

      <div className="space-y-3 pb-20 md:pb-24">
        <LogoRow brands={BRANDS.slice(0, half)} />
        <LogoRow brands={BRANDS.slice(half)} reverse />
      </div>

      <div className="page-shell pb-20 md:pb-28">
        <Reveal>
          <p className="eyebrow">In their words</p>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-3xl border border-sand bg-white p-7 shadow-[0_24px_50px_-34px_rgba(60,10,25,0.45)] md:p-8">
                <span
                  className="font-display text-5xl leading-none text-gold"
                  aria-hidden="true"
                >
                  “
                </span>
                <blockquote className="mt-2 flex-1 font-display text-[1.15rem] leading-snug text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-sand pt-4">
                  <span className="block font-sans text-sm font-medium text-ink">
                    {t.name}
                  </span>
                  <span className="mt-0.5 block font-sans text-xs text-ink-soft">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
