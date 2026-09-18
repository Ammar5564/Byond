"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface Stat {
  value: string;
  label: string;
}

interface BrandLogo {
  name: string;
  logoUrl?: string;
  needsGlow?: boolean;
}

/** Scatter slot: % coords, depth layer, scale, bob phase */
interface OrbitSlot {
  brand: BrandLogo;
  x: number;
  y: number;
  layer: 0 | 1 | 2 | 3;
  scale: number;
  bobDelay: number;
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

/** Non-linear scatter — breaks corporate grid rhythm */
const LAYOUT: Omit<OrbitSlot, "brand">[] = [
  { x: 6, y: 8, layer: 2, scale: 1.05, bobDelay: 0 },
  { x: 28, y: 2, layer: 1, scale: 0.92, bobDelay: 0.4 },
  { x: 52, y: 10, layer: 3, scale: 1.12, bobDelay: 0.8 },
  { x: 74, y: 4, layer: 0, scale: 0.88, bobDelay: 1.2 },
  { x: 88, y: 18, layer: 2, scale: 1.0, bobDelay: 0.2 },
  { x: 12, y: 32, layer: 1, scale: 0.95, bobDelay: 1.6 },
  { x: 36, y: 28, layer: 3, scale: 1.08, bobDelay: 0.6 },
  { x: 58, y: 36, layer: 0, scale: 0.9, bobDelay: 1.0 },
  { x: 80, y: 40, layer: 2, scale: 1.02, bobDelay: 1.4 },
  { x: 4, y: 54, layer: 0, scale: 0.86, bobDelay: 0.3 },
  { x: 24, y: 58, layer: 2, scale: 1.06, bobDelay: 0.9 },
  { x: 46, y: 52, layer: 1, scale: 0.94, bobDelay: 1.5 },
  { x: 68, y: 60, layer: 3, scale: 1.1, bobDelay: 0.1 },
  { x: 90, y: 56, layer: 1, scale: 0.9, bobDelay: 1.1 },
  { x: 16, y: 78, layer: 3, scale: 1.04, bobDelay: 0.7 },
  { x: 40, y: 82, layer: 0, scale: 0.88, bobDelay: 1.3 },
  { x: 64, y: 76, layer: 2, scale: 1.0, bobDelay: 0.5 },
  { x: 84, y: 84, layer: 1, scale: 0.96, bobDelay: 1.7 },
];

const ORBIT_SLOTS: OrbitSlot[] = BRANDS.map((brand, i) => ({
  brand,
  ...LAYOUT[i % LAYOUT.length],
}));

const LAYER_PARALLAX = [0.12, 0.28, 0.48, 0.72] as const;
const LAYER_Z = [1, 2, 3, 4] as const;
const LAYER_OPACITY = [0.72, 0.85, 0.95, 1] as const;

function BrandFallbackPill({ name }: { name: string }) {
  return (
    <span className="inline-flex max-w-[7.5rem] items-center justify-center px-1 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-white/80 sm:text-[11px]">
      {name}
    </span>
  );
}

function FloatingLogo({
  slot,
  parallaxY,
}: {
  slot: OrbitSlot;
  parallaxY: number;
}) {
  const [failed, setFailed] = useState(!slot.brand.logoUrl);
  const glow = slot.brand.needsGlow;

  return (
    <div
      className="pointer-events-auto absolute will-change-transform"
      style={
        {
          left: `${slot.x}%`,
          top: `${slot.y}%`,
          zIndex: LAYER_Z[slot.layer],
          opacity: LAYER_OPACITY[slot.layer],
          transform: `translate3d(0, ${parallaxY}px, 0) scale(${slot.scale})`,
          ["--bob-delay" as string]: `${slot.bobDelay}s`,
        } as CSSProperties
      }
    >
      <div
        className="orbit-bob flex h-[64px] w-[120px] items-center justify-center sm:h-[78px] sm:w-[148px] md:h-[92px] md:w-[168px]"
        style={{ animationDelay: `var(--bob-delay)` }}
      >
        {/* Minimal soft chip only for dark/low-contrast marks */}
        <div
          className={`flex h-full w-full items-center justify-center ${
            glow
              ? "rounded-full bg-white/[0.045] shadow-[inset_0_0_24px_rgba(255,255,255,0.04)]"
              : ""
          }`}
        >
          {failed || !slot.brand.logoUrl ? (
            <BrandFallbackPill name={slot.brand.name} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slot.brand.logoUrl}
              alt={slot.brand.name}
              className="h-auto max-h-[78%] w-auto max-w-[88%] object-contain"
              style={
                glow
                  ? {
                      filter:
                        "drop-shadow(0 0 10px rgba(255, 255, 255, 0.15))",
                    }
                  : {
                      filter:
                        "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35))",
                    }
              }
              onError={() => setFailed(true)}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function KineticLogoOrbit({ slots }: { slots: OrbitSlot[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState([0, 0, 0, 0]);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion.current) return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = {
      x: Math.max(-1, Math.min(1, ny)) * -8,
      y: Math.max(-1, Math.min(1, nx)) * 10,
    };
  }, []);

  const onPointerLeave = useCallback(() => {
    tiltRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setTilt((prev) => {
        const t = tiltRef.current;
        const next = {
          x: prev.x + (t.x - prev.x) * 0.08,
          y: prev.y + (t.y - prev.y) * 0.08,
        };
        if (
          Math.abs(next.x - prev.x) < 0.01 &&
          Math.abs(next.y - prev.y) < 0.01
        ) {
          return prev;
        }
        return next;
      });

      const el = stageRef.current;
      if (el && !reduceMotion.current) {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        // 0 when section enters, ~1 as it exits
        const p = 1 - (rect.top + rect.height * 0.35) / (viewH + rect.height * 0.35);
        scrollProgress.current = Math.max(-0.4, Math.min(1.2, p));
        const base = (scrollProgress.current - 0.5) * 48;
        setParallax([
          base * LAYER_PARALLAX[0],
          base * LAYER_PARALLAX[1],
          base * LAYER_PARALLAX[2],
          base * LAYER_PARALLAX[3],
        ]);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative z-10 w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes orbit-bob {
              0%, 100% { transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(0, -10px, 0); }
            }
            .orbit-bob {
              animation: orbit-bob 7.5s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .orbit-bob { animation: none !important; }
            }
          `,
        }}
      />

      <div className="mx-auto mb-6 w-full max-w-[1400px] px-4 sm:mb-8 sm:px-6 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Trusted by
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-[1400px] px-2 sm:px-4 md:px-6"
        style={{ perspective: "1000px" }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div
          className="relative h-[420px] w-full touch-pan-y sm:h-[520px] md:h-[600px] lg:h-[640px]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.05s linear",
          }}
          aria-label="Client brand logos in floating orbit"
        >
          {slots.map((slot) => (
            <FloatingLogo
              key={slot.brand.name}
              slot={slot}
              parallaxY={parallax[slot.layer] ?? 0}
            />
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
        <div className="absolute left-1/2 top-[-10%] h-[45%] w-[80%] max-w-[960px] -translate-x-1/2 rounded-full bg-[#4a0817]/18 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-6%] h-[38%] w-[48%] rounded-full bg-[#3b0712]/16 blur-3xl" />
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
        <KineticLogoOrbit slots={ORBIT_SLOTS} />
      </div>
    </section>
  );
}
