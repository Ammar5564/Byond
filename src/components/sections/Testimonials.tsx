"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

interface BrandLogo {
  name: string;
  logoUrl?: string;
  needsGlow?: boolean;
}

const STATS: Stat[] = [
  { value: "50", label: "Clients" },
  { value: "300", label: "Projects Completed" },
  { value: "25,000+", label: "Working Hours" },
  { value: "5", label: "Countries" },
];

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
    <span className="inline-flex max-w-[90%] items-center justify-center px-2 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-white/85">
      {name}
    </span>
  );
}

function LogoRibbonCard({ brand }: { brand: BrandLogo }) {
  const [failed, setFailed] = useState(!brand.logoUrl);
  const glow = brand.needsGlow;

  return (
    <div className="flex h-[70px] w-[130px] shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.035] px-3 py-2 backdrop-blur-[10px] sm:h-[80px] sm:w-[150px] md:h-[90px] md:w-[170px] md:px-4">
      <div
        className={`flex h-full w-full items-center justify-center ${
          glow ? "rounded-full bg-white/[0.05]" : ""
        }`}
      >
        {failed || !brand.logoUrl ? (
          <BrandFallbackPill name={brand.name} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-auto max-h-[78%] w-auto max-w-[88%] object-contain"
            style={{
              filter: glow
                ? "drop-shadow(0 0 8px rgba(255,255,255,0.18))"
                : "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
            }}
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

function LogoRibbon({
  brands,
  direction,
  scrollX,
  idleClass,
  gapClass = "gap-3 md:gap-5",
}: {
  brands: BrandLogo[];
  direction: "left" | "right";
  scrollX: MotionValue<number>;
  idleClass: string;
  gapClass?: string;
}) {
  // Duplicate for continuous visual density
  const loop = useMemo(() => [...brands, ...brands, ...brands], [brands]);
  const sign = direction === "left" ? -1 : 1;

  const x = useTransform(scrollX, (v) => `${sign * v}px`);

  return (
    <div className="relative w-full overflow-hidden py-1.5 sm:py-2">
      <motion.div style={{ x }} className="will-change-transform">
        <div className={`ribbon-idle ${idleClass} flex w-max items-center ${gapClass}`}>
          {loop.map((brand, i) => (
            <LogoRibbonCard key={`${brand.name}-${i}`} brand={brand} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ParallaxLogoRibbons({ brands }: { brands: BrandLogo[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scrollTravel = useSpring(raw, {
    stiffness: 60,
    damping: 28,
    restDelta: 0.001,
  });

  // Different speeds per ribbon
  const row1 = useTransform(scrollTravel, (v) => (reduceMotion ? 0 : v * 0.85));
  const row2 = useTransform(scrollTravel, (v) => (reduceMotion ? 0 : v * 1.05));
  const row3 = useTransform(scrollTravel, (v) => (reduceMotion ? 0 : v * 0.7));

  const rowA = brands.slice(0, 6);
  const rowB = brands.slice(6, 12);
  const rowC = brands.slice(12, 18);

  // Mobile: redistribute into two denser ribbons
  const mobileA = brands.slice(0, 9);
  const mobileB = brands.slice(9, 18);

  return (
    <div ref={sectionRef} className="relative z-10 w-full overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ribbonDriftLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            @keyframes ribbonDriftRight {
              0% { transform: translateX(-33.333%); }
              100% { transform: translateX(0); }
            }
            .ribbon-idle-left {
              animation: ribbonDriftLeft 55s linear infinite;
            }
            .ribbon-idle-right {
              animation: ribbonDriftRight 60s linear infinite;
            }
            .ribbon-idle-left-slow {
              animation: ribbonDriftLeft 70s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .ribbon-idle-left,
              .ribbon-idle-right,
              .ribbon-idle-left-slow {
                animation: none !important;
              }
            }
          `,
        }}
      />

      <div className="mx-auto mb-8 w-full max-w-[1400px] px-4 sm:px-6 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Trusted by
        </p>
      </div>

      <div
        className="relative w-full overflow-x-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        {/* Mobile: 2 ribbons */}
        <div className="flex flex-col gap-4 md:hidden">
          <LogoRibbon
            brands={mobileA}
            direction="left"
            scrollX={row1}
            idleClass="ribbon-idle-left"
            gapClass="gap-4"
          />
          <LogoRibbon
            brands={mobileB}
            direction="right"
            scrollX={row2}
            idleClass="ribbon-idle-right"
            gapClass="gap-4"
          />
        </div>

        {/* Desktop: 3 opposing ribbons */}
        <div className="hidden flex-col gap-5 md:flex md:gap-6">
          <LogoRibbon
            brands={rowA}
            direction="left"
            scrollX={row1}
            idleClass="ribbon-idle-left"
          />
          <LogoRibbon
            brands={rowB}
            direction="right"
            scrollX={row2}
            idleClass="ribbon-idle-right"
          />
          <LogoRibbon
            brands={rowC}
            direction="left"
            scrollX={row3}
            idleClass="ribbon-idle-left-slow"
          />
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
        <div className="absolute left-1/2 top-[-10%] h-[45%] w-[80%] max-w-[960px] -translate-x-1/2 rounded-full bg-[#4a0817]/18 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-6%] h-[38%] w-[48%] rounded-full bg-[#3b0712]/16 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] overflow-x-hidden px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-28">
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

      <div className="relative z-10 overflow-x-hidden pb-16 md:pb-24 lg:pb-28">
        <ParallaxLogoRibbons brands={BRANDS} />
      </div>
    </section>
  );
}
