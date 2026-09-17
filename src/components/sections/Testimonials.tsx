"use client";

import { useState } from "react";

interface Stat {
  value: string;
  label: string;
}

interface BrandLogo {
  name: string;
  logoUrl?: string;
}

const STATS: Stat[] = [
  { value: "50", label: "Clients" },
  { value: "300", label: "Projects Completed" },
  { value: "25,000+", label: "Working Hours" },
  { value: "5", label: "Countries" },
];

/** Pantone 11-6002 TCX Snow White */
const SNOW = "#F2F0EB";
const INK = "#121212";

/**
 * 18 partner marks from byond.media (site order).
 * KO Squad: live upload was empty → crisp text fallback.
 */
const BRANDS: BrandLogo[] = [
  { name: "Allianz", logoUrl: "/partners/allianz.png" },
  { name: "Century City", logoUrl: "/partners/century-city.png" },
  { name: "Cityscape", logoUrl: "/partners/cityscape.png" },
  { name: "ExxonMobil", logoUrl: "/partners/exxonmobil.png" },
  { name: "Hassan Allam", logoUrl: "/partners/hassan-allam.png" },
  { name: "KO Squad" },
  { name: "Ignite", logoUrl: "/partners/ignite.png" },
  { name: "Lorenz", logoUrl: "/partners/lorenz.png" },
  { name: "Menassat Developments", logoUrl: "/partners/menassat-developments.png" },
  { name: "New Avenue Real Estate", logoUrl: "/partners/new-avenue-real-estate.png" },
  { name: "Palm Hills Developments", logoUrl: "/partners/palm-hills-developments.png" },
  { name: "PGESCO", logoUrl: "/partners/pgesco.png" },
  { name: "Jotun", logoUrl: "/partners/jotun.png" },
  { name: "XTB", logoUrl: "/partners/xtb.png" },
  { name: "Al Ahly Sabbour", logoUrl: "/partners/al-ahly-sabbour.png" },
  { name: "Elsewedy Electric", logoUrl: "/partners/elsewedy-electric.png" },
  { name: "SODIC", logoUrl: "/partners/sodic.png" },
  { name: "Dorra", logoUrl: "/partners/dorra.png" },
];

function BrandFallbackPill({ name }: { name: string }) {
  return (
    <span
      className="inline-flex max-w-[90%] items-center justify-center px-2 text-center font-sans text-[10px] font-bold uppercase tracking-wider sm:text-[11px]"
      style={{ color: INK }}
    >
      {name}
    </span>
  );
}

function PartnerLogoCard({ brand }: { brand: BrandLogo }) {
  const [failed, setFailed] = useState(!brand.logoUrl);

  return (
    <div
      className="flex h-[72px] w-[150px] shrink-0 items-center justify-center rounded-xl border px-4 py-3 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] sm:h-[90px] sm:w-[160px] md:h-[100px] md:w-[180px] md:px-5"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(0, 0, 0, 0.06)",
        boxShadow: "0 8px 24px -12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {failed || !brand.logoUrl ? (
        <BrandFallbackPill name={brand.name} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className="h-auto max-h-full w-auto max-w-full object-contain"
          onError={() => setFailed(true)}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}

function PartnerLogoMarquee({ brands }: { brands: BrandLogo[] }) {
  const loop = [...brands, ...brands];

  return (
    <div className="relative z-10 w-full">
      <div className="mx-auto mb-8 w-full max-w-[1400px] px-4 sm:px-6 md:px-10">
        <p
          className="font-sans text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "rgba(18, 18, 18, 0.55)" }}
        >
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
      className="relative overflow-x-hidden border-y border-black/5"
      style={{ backgroundColor: SNOW }}
      aria-labelledby="testimonials-heading"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          <p
            className="font-sans text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "rgba(18, 18, 18, 0.45)" }}
          >
            Social proof
          </p>
          <h2
            id="testimonials-heading"
            className="display-heading mt-4 text-balance break-words text-3xl leading-[0.95] sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            style={{ color: INK }}
          >
            Trusted by brands that endure
          </h2>
        </div>

        <div
          className="mt-12 grid grid-cols-2 border border-black/10 md:mt-16 md:grid-cols-4"
          role="list"
          aria-label="Agency impact"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              role="listitem"
              className={`min-w-0 px-5 py-6 sm:px-6 sm:py-8 ${
                i % 2 === 0 ? "border-r border-black/10" : ""
              } ${i < 2 ? "border-b border-black/10 md:border-b-0" : ""} ${
                i < STATS.length - 1 ? "md:border-r md:border-black/10" : ""
              }`}
            >
              <p
                className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-none tracking-tight"
                style={{ color: INK }}
              >
                {stat.value}
              </p>
              <p
                className="mt-3 font-sans text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(18, 18, 18, 0.5)" }}
              >
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
