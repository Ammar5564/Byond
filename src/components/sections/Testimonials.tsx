"use client";

import { useState } from "react";

interface Stat {
  value: string;
  label: string;
}

interface BrandLogo {
  name: string;
  logoUrl?: string;
  /** Soft white glow for dark/low-contrast marks on dark UI */
  needsGlow?: boolean;
}

const STATS: Stat[] = [
  { value: "50", label: "Clients" },
  { value: "300", label: "Projects Completed" },
  { value: "25,000+", label: "Working Hours" },
  { value: "5", label: "Countries" },
];

/**
 * 18 partner marks from byond.media (site order).
 * KO Squad: live upload was empty → crisp text fallback.
 */
const BRANDS: BrandLogo[] = [
  { name: "Allianz", logoUrl: "/partners/allianz.png", needsGlow: true },
  { name: "Century City", logoUrl: "/partners/century-city.png", needsGlow: true },
  { name: "Cityscape", logoUrl: "/partners/cityscape.png" },
  { name: "ExxonMobil", logoUrl: "/partners/exxonmobil.png" },
  { name: "Hassan Allam", logoUrl: "/partners/hassan-allam.png", needsGlow: true },
  { name: "KO Squad" },
  { name: "Ignite", logoUrl: "/partners/ignite.png" },
  { name: "Lorenz", logoUrl: "/partners/lorenz.png" },
  { name: "Menassat Developments", logoUrl: "/partners/menassat-developments.png", needsGlow: true },
  { name: "New Avenue Real Estate", logoUrl: "/partners/new-avenue-real-estate.png", needsGlow: true },
  { name: "Palm Hills Developments", logoUrl: "/partners/palm-hills-developments.png" },
  { name: "PGESCO", logoUrl: "/partners/pgesco.png" },
  { name: "Jotun", logoUrl: "/partners/jotun.png" },
  { name: "XTB", logoUrl: "/partners/xtb.png", needsGlow: true },
  { name: "Al Ahly Sabbour", logoUrl: "/partners/al-ahly-sabbour.png", needsGlow: true },
  { name: "Elsewedy Electric", logoUrl: "/partners/elsewedy-electric.png", needsGlow: true },
  { name: "SODIC", logoUrl: "/partners/sodic.png" },
  { name: "Dorra", logoUrl: "/partners/dorra.png", needsGlow: true },
];

function BrandFallbackPill({ name }: { name: string }) {
  return (
    <span className="inline-flex max-w-[90%] items-center justify-center px-2 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-white/85 sm:text-[11px]">
      {name}
    </span>
  );
}

function PartnerLogoCard({ brand }: { brand: BrandLogo }) {
  const [failed, setFailed] = useState(!brand.logoUrl);

  return (
    <div className="flex h-[80px] w-[150px] shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.035] px-4 py-3 backdrop-blur-[12px] transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07] sm:h-[90px] sm:w-[165px] md:h-[100px] md:w-[180px] md:px-5">
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/[0.04] px-2">
        {failed || !brand.logoUrl ? (
          <BrandFallbackPill name={brand.name} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-auto max-h-full w-auto max-w-full object-contain"
            style={
              brand.needsGlow
                ? { filter: "drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.18))" }
                : undefined
            }
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}

function PartnerLogoMarquee({ brands }: { brands: BrandLogo[] }) {
  const loop = [...brands, ...brands];

  return (
    <div className="relative z-10 w-full">
      <div className="mx-auto mb-8 w-full max-w-[1400px] px-4 sm:px-6 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Trusted by
        </p>
      </div>

      <div
        className="group/marquee relative w-full overflow-hidden py-2"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="animate-marquee-slow flex w-max items-center gap-4 sm:gap-5 md:gap-6 group-hover/marquee:[animation-play-state:paused]"
          aria-label="Client brand logos"
        >
          {loop.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="shrink-0"
              aria-hidden={i >= brands.length ? true : undefined}
            >
              <PartnerLogoCard brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="trust"
      className="relative overflow-x-hidden border-y border-white/10"
      style={{ backgroundColor: "#0B0B0C" }}
      aria-labelledby="testimonials-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[-12%] h-[50%] w-[85%] max-w-[1000px] -translate-x-1/2 rounded-full bg-[#4a0817]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-8%] h-[40%] w-[50%] rounded-full bg-[#3b0712]/18 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-500">
            Social proof
          </p>
          <h2
            id="testimonials-heading"
            className="display-heading mt-4 text-balance break-words text-3xl leading-[0.95] text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            Trusted by brands that endure
          </h2>
        </div>

        <div
          className="mt-12 grid grid-cols-2 border border-white/10 md:mt-16 md:grid-cols-4"
          role="list"
          aria-label="Agency impact"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              role="listitem"
              className={`min-w-0 px-5 py-6 sm:px-6 sm:py-8 ${
                i % 2 === 0 ? "border-r border-white/10" : ""
              } ${i < 2 ? "border-b border-white/10 md:border-b-0" : ""} ${
                i < STATS.length - 1 ? "md:border-r md:border-white/10" : ""
              }`}
            >
              <p className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-none tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 pb-16 md:pb-24 lg:pb-28">
        <PartnerLogoMarquee brands={BRANDS} />
      </div>
    </section>
  );
}
