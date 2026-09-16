"use client";

import { useState } from "react";

interface Stat {
  value: string;
  label: string;
}

interface BrandLogo {
  name: string;
  logoUrl?: string;
  /** Invert black/monochrome logos to white on dark backgrounds */
  invertToWhite?: boolean;
}

const STATS: Stat[] = [
  { value: "50", label: "Clients" },
  { value: "300", label: "Projects Completed" },
  { value: "25,000+", label: "Working Hours" },
  { value: "5", label: "Countries" },
];

const BRANDS: BrandLogo[] = [
  { name: "Hassan Allam", logoUrl: "/partners/hassan-allam.png" },
  { name: "Lorenz", logoUrl: "/partners/lorenz.png" },
  { name: "PGESCO", logoUrl: "/partners/pgesco.png" },
  { name: "Beuniqueness", logoUrl: "/partners/beuniqueness.png" },
  { name: "KO Squad", logoUrl: "/partners/ko-squad.png" },
  { name: "Felopateer Palace", logoUrl: "/partners/felopateer-palace.png" },
  {
    name: "Ministry of Presidential Affairs UAE",
    logoUrl: "/partners/ministry-presidential-affairs-uae.png",
  },
  { name: "Four Seasons", logoUrl: "/partners/four-seasons.png", invertToWhite: true },
  { name: "Allianz", logoUrl: "/partners/allianz.png" },
  { name: "Century City", logoUrl: "/partners/century-city.png", invertToWhite: true },
  { name: "Cityscape", logoUrl: "/partners/cityscape.png" },
  { name: "ExxonMobil", logoUrl: "/partners/exxonmobil.png" },
  { name: "Emaar", logoUrl: "/partners/emaar.png", invertToWhite: true },
  { name: "Ignite", logoUrl: "/partners/ignite.png" },
  { name: "Menassat Developments", logoUrl: "/partners/menassat-developments.png" },
  {
    name: "New Avenue Real Estate",
    logoUrl: "/partners/new-avenue-real-estate.png",
    invertToWhite: true,
  },
  { name: "Palm Hills Developments", logoUrl: "/partners/palm-hills-developments.png" },
];

function BrandFallbackPill({ name }: { name: string }) {
  return (
    <span className="inline-flex h-12 max-w-[11rem] items-center justify-center px-2 font-sans text-[11px] font-bold uppercase tracking-wider text-white/90 md:h-16">
      {name}
    </span>
  );
}

function MarqueeLogo({ brand }: { brand: BrandLogo }) {
  const [failed, setFailed] = useState(!brand.logoUrl);

  if (failed || !brand.logoUrl) {
    return <BrandFallbackPill name={brand.name} />;
  }

  // Dark/monochrome vectors: force white so they read on dark UI.
  // Colorful brands: leave natural colors; screen blend knocks out baked black PNG backgrounds.
  if (brand.invertToWhite) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className="h-12 w-auto max-w-[11rem] object-contain opacity-90 brightness-0 invert transition-opacity hover:opacity-100 sm:h-14 sm:max-w-[12rem] md:h-16 md:max-w-[13rem]"
        style={{ filter: "brightness(0) invert(1)" }}
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logoUrl}
      alt={brand.name}
      className="h-12 w-auto max-w-[11rem] object-contain opacity-90 mix-blend-screen transition-opacity hover:opacity-100 sm:h-14 sm:max-w-[12rem] md:h-16 md:max-w-[13rem]"
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

function PartnerLogoMarquee({ brands }: { brands: BrandLogo[] }) {
  const loop = [...brands, ...brands];

  return (
    <div className="relative z-10 mt-12 md:mt-16">
      <div className="mx-auto mb-8 w-full max-w-[1400px] px-4 sm:px-6 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Trusted by
        </p>
      </div>
      <div className="overflow-hidden whitespace-nowrap border-y border-white/10 py-8 md:py-10">
        <div className="animate-marquee-slow inline-flex items-center">
          {loop.map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className="mx-8 inline-flex h-12 shrink-0 items-center justify-center sm:mx-12 md:h-16"
            >
              <MarqueeLogo brand={brand} />
            </span>
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
      className="relative overflow-x-hidden border-y border-white/10 bg-neutral-950"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[-12%] h-[55%] w-[90%] max-w-[1100px] -translate-x-1/2 rounded-full bg-[#4a0817]/25 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-10%] h-[42%] w-[55%] rounded-full bg-[#3b0712]/30 blur-3xl" />
        <div className="absolute bottom-[18%] left-[-12%] h-[36%] w-[40%] rounded-full bg-[#4a0817]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,7,18,0.28)_0%,transparent_55%)]" />
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
