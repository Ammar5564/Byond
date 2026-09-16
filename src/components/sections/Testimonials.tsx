"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  logoUrl?: string;
  brandColor?: string;
}

interface BrandLogo {
  name: string;
  logoUrl?: string;
  /** Official brand accent for glow / fallback */
  brandColor: string;
}

const STATS: Stat[] = [
  { value: "50", label: "Clients" },
  { value: "300", label: "Projects Completed" },
  { value: "25,000+", label: "Working Hours" },
  { value: "5", label: "Countries" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    author: "Mahmoud Mostafa",
    role: "Head of Global Marketing & Communication",
    company: "Lorenz",
    logoUrl: "/partners/lorenz.png",
    brandColor: "#C8102E",
    quote:
      "I am very lucky to have met this team. Their attention to detail and coming up with new things to improve in every shoot and every creation are unmatched. I would highly recommend them.",
  },
  {
    author: "Mohamed El Hawary",
    role: "CEO",
    company: "Beuniqueness",
    logoUrl: "/partners/beuniqueness.png",
    brandColor: "#C9A227",
    quote:
      "Byond Media is competing with top US, and UK agencies. We were beyond amazed with the outcome, their professionalism matched the international standards that we already deal with...",
  },
  {
    author: "Shady El Badawy",
    role: "Senior Manager",
    company: "Ministry of Presidential Affairs UAE",
    logoUrl: "/partners/ministry-presidential-affairs-uae.png",
    brandColor: "#B68A35",
    quote:
      "They are undoubtedly a different video production agency that takes video directing and presentation to a completely different level...",
  },
  {
    author: "Hanan Ibrahim",
    role: "Talent Management Director",
    company: "Hassan Allam",
    logoUrl: "/partners/hassan-allam.png",
    brandColor: "#005EB8",
    quote:
      "Byond team is an exceptional creative team, they are bringing life to the ideas and you can sense the efforts and the extra mile they took to achieve the goal.",
  },
  {
    author: "Islam Kortam",
    role: "Founder & CEO",
    company: "KO Squad",
    logoUrl: "/partners/ko-squad.png",
    brandColor: "#E10600",
    quote:
      "The best team for the job, their videos are captivating, informative, and inspiring, they add their passion and talent into every single piece of the process...",
  },
  {
    author: "Mai Ramadan",
    role: "HR Director",
    company: "PGESCO",
    logoUrl: "/partners/pgesco.png",
    brandColor: "#00843D",
    quote:
      "Their video not only captured testimonials and rhetoric but also the spirit and the sentiment. Their approach was so welcoming that nothing felt staged...",
  },
];

const BRANDS: BrandLogo[] = [
  { name: "Hassan Allam", logoUrl: "/partners/hassan-allam.png", brandColor: "#005EB8" },
  { name: "Lorenz", logoUrl: "/partners/lorenz.png", brandColor: "#C8102E" },
  { name: "PGESCO", logoUrl: "/partners/pgesco.png", brandColor: "#00843D" },
  { name: "Beuniqueness", logoUrl: "/partners/beuniqueness.png", brandColor: "#C9A227" },
  { name: "KO Squad", logoUrl: "/partners/ko-squad.png", brandColor: "#E10600" },
  { name: "Felopateer Palace", logoUrl: "/partners/felopateer-palace.png", brandColor: "#8B6F47" },
  {
    name: "Ministry of Presidential Affairs UAE",
    logoUrl: "/partners/ministry-presidential-affairs-uae.png",
    brandColor: "#B68A35",
  },
  { name: "Four Seasons", logoUrl: "/partners/four-seasons.png", brandColor: "#A8A8A8" },
  { name: "Allianz", logoUrl: "/partners/allianz.png", brandColor: "#003781" },
  { name: "Century City", logoUrl: "/partners/century-city.png", brandColor: "#1A365D" },
  { name: "Cityscape", logoUrl: "/partners/cityscape.png", brandColor: "#0066B3" },
  { name: "ExxonMobil", logoUrl: "/partners/exxonmobil.png", brandColor: "#E40000" },
  { name: "Emaar", logoUrl: "/partners/emaar.png", brandColor: "#003366" },
  { name: "Ignite", logoUrl: "/partners/ignite.png", brandColor: "#FF6B00" },
  { name: "Menassat Developments", logoUrl: "/partners/menassat-developments.png", brandColor: "#2E7D32" },
  { name: "New Avenue Real Estate", logoUrl: "/partners/new-avenue-real-estate.png", brandColor: "#1B4332" },
  { name: "Palm Hills Developments", logoUrl: "/partners/palm-hills-developments.png", brandColor: "#006633" },
];

const TOTAL = TESTIMONIALS.length;

/** Soft brand-tinted drop-shadow stack for editorial 3D lift. */
function brandGlow(hex: string, intensity: "rest" | "hover" = "rest"): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  if (intensity === "hover") {
    return [
      `drop-shadow(0 14px 28px rgba(${r},${g},${b},0.45))`,
      `drop-shadow(0 6px 12px rgba(${r},${g},${b},0.28))`,
      `drop-shadow(0 2px 4px rgba(0,0,0,0.35))`,
    ].join(" ");
  }

  return [
    `drop-shadow(0 10px 22px rgba(${r},${g},${b},0.32))`,
    `drop-shadow(0 4px 10px rgba(${r},${g},${b},0.18))`,
    `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
  ].join(" ");
}

function BrandFallbackPill({ name, brandColor }: { name: string; brandColor: string }) {
  return (
    <span
      className="inline-flex max-w-[11rem] items-center justify-center rounded-sm border px-3 py-2 text-center font-sans text-[11px] font-bold uppercase tracking-wider"
      style={{
        color: brandColor,
        borderColor: `${brandColor}55`,
        backgroundColor: `${brandColor}18`,
        filter: brandGlow(brandColor),
      }}
    >
      {name}
    </span>
  );
}

/**
 * Logo slot: fixed min size + burgundy glass tile for contrast
 * (keeps light/white brand marks like Emaar readable).
 */
function FloatingBrandLogo({ brand }: { brand: BrandLogo }) {
  const [failed, setFailed] = useState(!brand.logoUrl);

  return (
    <div className="flex w-full min-h-[80px] items-center justify-center overflow-visible p-4 transition-all duration-300 hover:-translate-y-1 hover:scale-105 sm:min-h-[96px] md:min-h-[112px]">
      <div className="flex h-full min-h-[80px] w-full items-center justify-center overflow-visible rounded-xl border border-white/5 bg-neutral-900/40 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[2px] sm:min-h-[96px] sm:px-5 sm:py-6 md:min-h-[112px]">
        {failed || !brand.logoUrl ? (
          <BrandFallbackPill name={brand.name} brandColor={brand.brandColor} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-12 w-auto max-w-[85%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] sm:h-14 md:h-16"
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </div>
  );
}

function PartnerLogoGrid({ brands }: { brands: BrandLogo[] }) {
  return (
    <div className="relative z-10 border-t border-white/10 px-4 py-14 sm:px-6 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="mb-10 font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Trusted by
        </p>
        <ul
          className="grid grid-cols-2 gap-3 overflow-visible sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
          aria-label="Client brand logos"
        >
          {brands.map((brand) => (
            <li key={brand.name} className="overflow-visible">
              <FloatingBrandLogo brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ClientLogoBadge({
  company,
  logoUrl,
  brandColor,
}: {
  company: string;
  logoUrl?: string;
  brandColor?: string;
}) {
  const [failed, setFailed] = useState(!logoUrl);
  const color = brandColor ?? "#FFFFFF";

  if (failed || !logoUrl) {
    return (
      <span
        className="inline-flex h-12 items-center rounded-sm border px-3 font-sans text-[10px] font-bold uppercase tracking-wider sm:h-14"
        style={{ color, borderColor: `${color}55`, backgroundColor: `${color}18` }}
      >
        {company}
      </span>
    );
  }

  return (
    <span className="inline-flex h-12 items-center rounded-sm border border-white/10 bg-white px-3 sm:h-14">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={company}
        className="h-8 w-auto max-w-[8rem] object-contain sm:h-10 sm:max-w-[9rem]"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback((nextIndex: number, dir: number) => {
    setDirection(dir);
    setActive(((nextIndex % TOTAL) + TOTAL) % TOTAL);
  }, []);

  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const item = TESTIMONIALS[active];
  const indexLabel = `${String(active + 1).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`;

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * 28,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * -28,
    }),
  };

  return (
    <section
      id="trust"
      className="relative overflow-x-hidden border-y border-white/10 bg-neutral-950"
      aria-labelledby="testimonials-heading"
    >
      {/* Burgundy ambient glow — blends with site crimson accents */}
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

        <div className="mt-16 border border-white/10 md:mt-20">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              Client voices
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-sans text-[11px] tabular-nums tracking-[0.18em] text-neutral-400">
                {indexLabel}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white transition-colors hover:border-white/25 hover:bg-white/5"
                  aria-label="Previous testimonial"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white transition-colors hover:border-white/25 hover:bg-white/5"
                  aria-label="Next testimonial"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden px-5 py-10 sm:min-h-[300px] sm:px-8 sm:py-12 md:min-h-[320px] md:px-12 md:py-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={item.author}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: reduceMotion ? 0.01 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-x-5 top-10 bottom-10 flex flex-col sm:inset-x-8 sm:top-12 sm:bottom-12 md:inset-x-12 md:top-14 md:bottom-14"
              >
                <span
                  className="pointer-events-none select-none font-display text-[4.5rem] leading-none text-white/10 sm:text-[6rem]"
                  aria-hidden="true"
                >
                  “
                </span>
                <blockquote className="-mt-6 max-w-3xl font-display text-[clamp(1.25rem,3.2vw,2rem)] leading-[1.25] tracking-tight text-white sm:-mt-8">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="font-sans text-sm tracking-wide text-white">
                      {item.author}
                    </p>
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                      {item.role} · {item.company}
                    </p>
                  </div>
                  <ClientLogoBadge
                    company={item.company}
                    logoUrl={item.logoUrl}
                    brandColor={item.brandColor}
                  />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div
            className="flex items-center justify-center gap-2 border-t border-white/10 px-5 py-4"
            role="tablist"
            aria-label="Select testimonial"
          >
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.author}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                className={`h-1.5 transition-all duration-300 ${
                  i === active
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <PartnerLogoGrid brands={BRANDS} />
    </section>
  );
}
