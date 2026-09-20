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

const DESKTOP_LAYOUT: Omit<OrbitSlot, "brand">[] = [
  { x: 4, y: 6, layer: 2, scale: 1.05, bobDelay: 0 },
  { x: 26, y: 2, layer: 1, scale: 0.92, bobDelay: 0.4 },
  { x: 50, y: 9, layer: 3, scale: 1.1, bobDelay: 0.8 },
  { x: 72, y: 3, layer: 0, scale: 0.88, bobDelay: 1.2 },
  { x: 86, y: 16, layer: 2, scale: 1.0, bobDelay: 0.2 },
  { x: 10, y: 30, layer: 1, scale: 0.95, bobDelay: 1.6 },
  { x: 34, y: 26, layer: 3, scale: 1.06, bobDelay: 0.6 },
  { x: 56, y: 34, layer: 0, scale: 0.9, bobDelay: 1.0 },
  { x: 78, y: 38, layer: 2, scale: 1.02, bobDelay: 1.4 },
  { x: 2, y: 52, layer: 0, scale: 0.86, bobDelay: 0.3 },
  { x: 22, y: 56, layer: 2, scale: 1.04, bobDelay: 0.9 },
  { x: 44, y: 50, layer: 1, scale: 0.94, bobDelay: 1.5 },
  { x: 66, y: 58, layer: 3, scale: 1.08, bobDelay: 0.1 },
  { x: 88, y: 54, layer: 1, scale: 0.9, bobDelay: 1.1 },
  { x: 14, y: 76, layer: 3, scale: 1.02, bobDelay: 0.7 },
  { x: 38, y: 80, layer: 0, scale: 0.88, bobDelay: 1.3 },
  { x: 62, y: 74, layer: 2, scale: 1.0, bobDelay: 0.5 },
  { x: 82, y: 82, layer: 1, scale: 0.96, bobDelay: 1.7 },
];

/** Mobile stagger offsets (px) — alternating columns */
const MOBILE_OFFSETS = [
  -12, 22, -18, 28, -8, 18, -22, 14, -10, 26, -16, 20, -6, 24, -20, 12, -14, 16,
];

const ORBIT_SLOTS: OrbitSlot[] = BRANDS.map((brand, i) => ({
  brand,
  ...DESKTOP_LAYOUT[i % DESKTOP_LAYOUT.length],
}));

const LAYER_PARALLAX = [0.1, 0.24, 0.42, 0.64] as const;
const LAYER_Z = [1, 2, 3, 4] as const;
const LAYER_OPACITY = [0.75, 0.86, 0.95, 1] as const;

function BrandFallbackPill({ name }: { name: string }) {
  return (
    <span className="inline-flex max-w-[90%] items-center justify-center px-1 text-center font-sans text-[9px] font-bold uppercase tracking-wider text-white/85 sm:text-[10px] md:text-[11px]">
      {name}
    </span>
  );
}

function LogoGlassTile({
  brand,
  bobDelay,
  duration = 8,
  variant = 0,
  active,
  onActivate,
}: {
  brand: BrandLogo;
  bobDelay: number;
  duration?: number;
  /** 0–2 alternates kinetic path direction */
  variant?: number;
  active?: boolean;
  onActivate?: () => void;
}) {
  const [failed, setFailed] = useState(!brand.logoUrl);
  const glow = brand.needsGlow;
  const animClass =
    variant === 1
      ? "float-kinetic-b"
      : variant === 2
        ? "float-kinetic-c"
        : "float-kinetic-a";

  return (
    <button
      type="button"
      aria-label={brand.name}
      onClick={onActivate}
      className={`${animClass} flex h-[70px] w-[120px] max-w-full items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-3 py-2 backdrop-blur-[10px] transition-[border-color,background-color,box-shadow] duration-300 ease-out sm:h-[78px] sm:w-[140px] md:h-[90px] md:w-[170px] lg:w-[180px] ${
        active
          ? "z-10 border-white/35 bg-white/[0.08] shadow-[0_0_28px_rgba(255,255,255,0.12)]"
          : "hover:border-white/20 hover:bg-white/[0.055]"
      }`}
      style={{
        animationDelay: `${bobDelay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div
        className={`flex h-full w-full items-center justify-center ${
          glow ? "rounded-full bg-white/[0.04]" : ""
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
                : "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
            }}
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}
      </div>
    </button>
  );
}

function useReduceMotion() {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return ref;
}

/** Desktop: absolute scatter + mouse tilt + scroll parallax */
function DesktopOrbit({ slots }: { slots: OrbitSlot[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltTarget = useRef({ x: 0, y: 0 });
  const reduceMotion = useReduceMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState([0, 0, 0, 0]);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion.current) return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltTarget.current = {
      x: Math.max(-1, Math.min(1, ny)) * -12,
      y: Math.max(-1, Math.min(1, nx)) * 14,
    };
  }, [reduceMotion]);

  const onPointerLeave = useCallback(() => {
    tiltTarget.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setTilt((prev) => {
        const t = tiltTarget.current;
        const next = {
          x: prev.x + (t.x - prev.x) * 0.08,
          y: prev.y + (t.y - prev.y) * 0.08,
        };
        if (Math.abs(next.x - prev.x) < 0.01 && Math.abs(next.y - prev.y) < 0.01) {
          return prev;
        }
        return next;
      });

      const el = stageRef.current;
      if (el && !reduceMotion.current) {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        const p =
          1 - (rect.top + rect.height * 0.35) / (viewH + rect.height * 0.35);
        const base = (Math.max(-0.4, Math.min(1.2, p)) - 0.5) * 44;
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
  }, [reduceMotion]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto hidden w-full max-w-[1400px] overflow-hidden px-4 md:block md:px-6"
      style={{ perspective: "1000px" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="relative h-[560px] w-full lg:h-[620px]"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        aria-label="Client brand logos floating orbit"
      >
        <div className="field-sway absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {slots.map((slot) => (
            <div
              key={slot.brand.name}
              className="absolute will-change-transform"
              style={
                {
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  zIndex: LAYER_Z[slot.layer],
                  opacity: LAYER_OPACITY[slot.layer],
                  transform: `translate3d(0, ${parallax[slot.layer] ?? 0}px, 0) scale(${slot.scale})`,
                } as CSSProperties
              }
            >
              <LogoGlassTile
                brand={slot.brand}
                bobDelay={slot.bobDelay}
                duration={6.5 + (slot.layer % 3) * 1.4}
                variant={slot.layer % 3}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mobile: 2-col staggered grid + touch drag tilt + tap elevation */
function MobileOrbit({ brands }: { brands: BrandLogo[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const tiltTarget = useRef({ x: 0, y: 0 });
  const reduceMotion = useReduceMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeName, setActiveName] = useState<string | null>(null);
  const activeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion.current) return;
      if (e.pointerType === "mouse") return;
      if (!dragStart.current) return;

      const dx = (e.clientX - dragStart.current.x) / 80;
      const dy = (e.clientY - dragStart.current.y) / 80;
      tiltTarget.current = {
        x: Math.max(-1, Math.min(1, dy)) * -10,
        y: Math.max(-1, Math.min(1, dx)) * 12,
      };
    },
    [reduceMotion]
  );

  const onPointerUp = useCallback(() => {
    dragStart.current = null;
    // Ease tilt back slowly
    window.setTimeout(() => {
      tiltTarget.current = { x: 0, y: 0 };
    }, 400);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setTilt((prev) => {
        const t = tiltTarget.current;
        const next = {
          x: prev.x + (t.x - prev.x) * 0.1,
          y: prev.y + (t.y - prev.y) * 0.1,
        };
        if (Math.abs(next.x - prev.x) < 0.01 && Math.abs(next.y - prev.y) < 0.01) {
          return prev;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      if (activeTimer.current) clearTimeout(activeTimer.current);
    };
  }, []);

  const activate = useCallback((name: string) => {
    setActiveName(name);
    if (activeTimer.current) clearTimeout(activeTimer.current);
    activeTimer.current = setTimeout(() => setActiveName(null), 520);
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto w-full max-w-[1400px] overflow-x-hidden px-3 md:hidden"
      style={{ perspective: "900px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="relative w-full overflow-x-hidden"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div
          className="field-sway-mobile grid w-full grid-cols-2 gap-x-3 gap-y-6 justify-items-center overflow-x-hidden py-4"
          aria-label="Client brand logos"
        >
          {brands.map((brand, i) => (
            <div
              key={brand.name}
              className="flex w-full max-w-[150px] justify-center will-change-transform"
              style={{
                marginTop: MOBILE_OFFSETS[i % MOBILE_OFFSETS.length],
                zIndex: (i % 4) + 1,
              }}
            >
              <LogoGlassTile
                brand={brand}
                bobDelay={(i % 9) * 0.35}
                duration={5.8 + (i % 4) * 0.9}
                variant={i % 3}
                active={activeName === brand.name}
                onActivate={() => activate(brand.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KineticLogoOrbit() {
  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes floatKinetic {
              0% {
                transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
              }
              33% {
                transform: translateY(-18px) translateX(12px) rotate(1.5deg) scale(1.05);
              }
              66% {
                transform: translateY(12px) translateX(-15px) rotate(-1.5deg) scale(0.96);
              }
              100% {
                transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
              }
            }
            @keyframes floatKineticB {
              0% {
                transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
              }
              33% {
                transform: translateY(14px) translateX(-14px) rotate(-2deg) scale(0.97);
              }
              66% {
                transform: translateY(-16px) translateX(10px) rotate(2deg) scale(1.06);
              }
              100% {
                transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
              }
            }
            @keyframes floatKineticC {
              0% {
                transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
              }
              25% {
                transform: translateY(-12px) translateX(-10px) rotate(-1deg) scale(1.04);
              }
              50% {
                transform: translateY(10px) translateX(14px) rotate(1.8deg) scale(0.95);
              }
              75% {
                transform: translateY(-8px) translateX(6px) rotate(-0.8deg) scale(1.02);
              }
              100% {
                transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
              }
            }
            @keyframes fieldSway {
              0%, 100% { transform: rotateX(2deg) rotateY(-3deg); }
              50% { transform: rotateX(-2.5deg) rotateY(3.5deg); }
            }
            @keyframes fieldSwayMobile {
              0%, 100% { transform: rotateX(1deg) rotateY(-2deg); }
              50% { transform: rotateX(-1.5deg) rotateY(2deg); }
            }
            .float-kinetic-a {
              animation-name: floatKinetic;
              animation-timing-function: ease-in-out;
              animation-iteration-count: infinite;
              will-change: transform;
            }
            .float-kinetic-b {
              animation-name: floatKineticB;
              animation-timing-function: ease-in-out;
              animation-iteration-count: infinite;
              will-change: transform;
            }
            .float-kinetic-c {
              animation-name: floatKineticC;
              animation-timing-function: ease-in-out;
              animation-iteration-count: infinite;
              will-change: transform;
            }
            .field-sway {
              animation: fieldSway 11s ease-in-out infinite;
              transform-style: preserve-3d;
              will-change: transform;
            }
            .field-sway-mobile {
              animation: fieldSwayMobile 9s ease-in-out infinite;
              transform-style: preserve-3d;
              will-change: transform;
            }
            @media (max-width: 767px) {
              @keyframes floatKinetic {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
                33% { transform: translateY(-12px) translateX(6px) rotate(1deg) scale(1.04); }
                66% { transform: translateY(8px) translateX(-8px) rotate(-1deg) scale(0.97); }
                100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
              }
              @keyframes floatKineticB {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
                33% { transform: translateY(10px) translateX(-7px) rotate(-1.2deg) scale(0.97); }
                66% { transform: translateY(-11px) translateX(5px) rotate(1.2deg) scale(1.04); }
                100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
              }
              @keyframes floatKineticC {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
                50% { transform: translateY(-10px) translateX(7px) rotate(1deg) scale(1.03); }
                100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .float-kinetic-a,
              .float-kinetic-b,
              .float-kinetic-c,
              .field-sway,
              .field-sway-mobile {
                animation: none !important;
              }
            }
          `,
        }}
      />

      <div className="mx-auto mb-6 w-full max-w-[1400px] px-4 sm:mb-8 sm:px-6 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Trusted by
        </p>
      </div>

      <MobileOrbit brands={BRANDS} />
      <DesktopOrbit slots={ORBIT_SLOTS} />
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
        <KineticLogoOrbit />
      </div>
    </section>
  );
}
