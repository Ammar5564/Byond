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

const TESTIMONIALS: Testimonial[] = [
  {
    author: "Mahmoud Mostafa",
    role: "Head of Global Marketing & Communication",
    company: "Lorenz",
    logoUrl: "/partners/lorenz.png",
    quote:
      "I am very lucky to have met this team. Their attention to detail and coming up with new things to improve in every shoot and every creation are unmatched. I would highly recommend them.",
  },
  {
    author: "Mohamed El Hawary",
    role: "CEO",
    company: "Beuniqueness",
    logoUrl: "/partners/beuniqueness.png",
    quote:
      "Byond Media is competing with top US, and UK agencies. We were beyond amazed with the outcome, their professionalism matched the international standards that we already deal with...",
  },
  {
    author: "Shady El Badawy",
    role: "Senior Manager",
    company: "Ministry of Presidential Affairs UAE",
    logoUrl: "/partners/ministry-presidential-affairs-uae.png",
    quote:
      "They are undoubtedly a different video production agency that takes video directing and presentation to a completely different level...",
  },
  {
    author: "Hanan Ibrahim",
    role: "Talent Management Director",
    company: "Hassan Allam",
    logoUrl: "/partners/hassan-allam.png",
    quote:
      "Byond team is an exceptional creative team, they are bringing life to the ideas and you can sense the efforts and the extra mile they took to achieve the goal.",
  },
  {
    author: "Islam Kortam",
    role: "Founder & CEO",
    company: "KO Squad",
    logoUrl: "/partners/ko-squad.png",
    quote:
      "The best team for the job, their videos are captivating, informative, and inspiring, they add their passion and talent into every single piece of the process...",
  },
  {
    author: "Mai Ramadan",
    role: "HR Director",
    company: "PGESCO",
    logoUrl: "/partners/pgesco.png",
    quote:
      "Their video not only captured testimonials and rhetoric but also the spirit and the sentiment. Their approach was so welcoming that nothing felt staged...",
  },
];

/** Partner marks sourced from byond.media/uploads/partner_images (site order → brand list). */
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
  { name: "Four Seasons", logoUrl: "/partners/four-seasons.png" },
  { name: "Allianz", logoUrl: "/partners/allianz.png" },
  { name: "Century City", logoUrl: "/partners/century-city.png" },
  { name: "Cityscape", logoUrl: "/partners/cityscape.png" },
  { name: "ExxonMobil", logoUrl: "/partners/exxonmobil.png" },
  { name: "Emaar", logoUrl: "/partners/emaar.png" },
  { name: "Ignite", logoUrl: "/partners/ignite.png" },
  { name: "Menassat Developments", logoUrl: "/partners/menassat-developments.png" },
  { name: "New Avenue Real Estate", logoUrl: "/partners/new-avenue-real-estate.png" },
  { name: "Palm Hills Developments", logoUrl: "/partners/palm-hills-developments.png" },
];

const TOTAL = TESTIMONIALS.length;

function BrandMark({ brand }: { brand: BrandLogo }) {
  const [failed, setFailed] = useState(!brand.logoUrl);

  if (failed || !brand.logoUrl) {
    return (
      <span className="inline-flex h-10 max-w-[11rem] items-center justify-center px-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
        {brand.name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logoUrl}
      alt={brand.name}
      className="h-8 w-auto max-w-[7.5rem] object-contain opacity-70 brightness-0 invert transition-opacity duration-300 hover:opacity-100 sm:h-9 sm:max-w-[9rem]"
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

function PartnerLogoMarquee({ brands }: { brands: BrandLogo[] }) {
  const loop = [...brands, ...brands];

  return (
    <div className="overflow-hidden whitespace-nowrap border-t border-white/10 bg-black py-6">
      <div className="animate-marquee-slow inline-flex items-center">
        {loop.map((brand, i) => (
          <span
            key={`${brand.name}-${i}`}
            className="mx-6 inline-flex h-12 shrink-0 items-center justify-center sm:mx-10"
          >
            <BrandMark brand={brand} />
          </span>
        ))}
      </div>
    </div>
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
      className="relative overflow-x-hidden border-y border-white/10 bg-[#050505]"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-28">
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

        {/* 1. Impact metrics bar */}
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

        {/* 2. Featured testimonial switcher */}
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
                  <span className="inline-flex h-10 w-fit shrink-0 items-center border border-white/10 px-3 py-1.5">
                    {item.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.logoUrl}
                        alt={item.company}
                        className="h-5 w-auto max-w-[6.5rem] object-contain brightness-0 invert"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const sibling = e.currentTarget.nextElementSibling;
                          if (sibling instanceof HTMLElement) {
                            sibling.style.display = "inline";
                          }
                        }}
                      />
                    ) : null}
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest text-neutral-300 ${
                        item.logoUrl ? "hidden" : "inline"
                      }`}
                    >
                      {item.company}
                    </span>
                  </span>
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

      {/* 3. Client logo marquee */}
      <PartnerLogoMarquee brands={BRANDS} />
    </section>
  );
}
