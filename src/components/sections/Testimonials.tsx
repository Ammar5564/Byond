"use client";

import { useState } from "react";

interface Stat {
  value: string;
  label: string;
}

interface BrandLogo {
  name: string;
  logoUrl: string;
}

const STATS: Stat[] = [
  { value: "50", label: "Clients" },
  { value: "300", label: "Projects Completed" },
  { value: "25,000+", label: "Working Hours" },
  { value: "5", label: "Countries" },
];

/** Partner logos sourced from /Logos (copied into /public/partners as-is) */
const BRANDS: BrandLogo[] = [
  { name: "Allianz", logoUrl: "/partners/allianz.png" },
  { name: "Century City", logoUrl: "/partners/century-city.png" },
  { name: "Cityscape", logoUrl: "/partners/cityscape.png" },
  { name: "ExxonMobil", logoUrl: "/partners/exxonmobil.png" },
  { name: "Hassan Allam", logoUrl: "/partners/hassan-allam.png" },
  { name: "EMAAR", logoUrl: "/partners/emaar.png" },
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

function LogoTile({ brand, tone }: { brand: BrandLogo; tone: 0 | 1 | 2 }) {
  const [failed, setFailed] = useState(false);

  return (
    <article className={`logoTile tone-${tone}`} aria-label={brand.name}>
      <span className="logoRail" aria-hidden="true" />
      <span className="logoCorner" aria-hidden="true" />
      <div className="logoStage">
        <div className="logoMark">
          {failed ? (
            <span className="logoFallback">{brand.name}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="logoImg"
              onError={() => setFailed(true)}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          )}
        </div>
      </div>
      <span className="logoSheen" aria-hidden="true" />
    </article>
  );
}

function PartnerLogoMarquee({ brands }: { brands: BrandLogo[] }) {
  const PARTNERS = [...brands, ...brands];

  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .marqueeWrapper {
              width: 100%;
              overflow: hidden;
              padding: 2.75rem 0 3.25rem;
              -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
              mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
            }

            .marqueeTrack {
              display: flex;
              align-items: stretch;
              gap: 1.35rem;
              width: max-content;
              -webkit-animation: marqueeScroll 42s linear infinite;
              animation: marqueeScroll 42s linear infinite;
              will-change: transform;
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
            }

            .marqueeWrapper:hover .marqueeTrack {
              -webkit-animation-play-state: paused;
              animation-play-state: paused;
            }

            /* Equal gallery frames — black / burgundy shell, ivory stage for the mark */
            .logoTile {
              --tile-w: 248px;
              --tile-h: 136px;
              flex: 0 0 var(--tile-w);
              width: var(--tile-w);
              height: var(--tile-h);
              position: relative;
              isolation: isolate;
              overflow: hidden;
              border-radius: 4px;
              background:
                linear-gradient(160deg, #1a080c 0%, #0b0b0c 42%, #14060a 100%);
              border: 1px solid rgba(255, 255, 255, 0.1);
              box-shadow:
                0 0 0 1px rgba(60, 5, 15, 0.55),
                0 18px 36px -18px rgba(0, 0, 0, 0.75),
                inset 0 1px 0 rgba(255, 255, 255, 0.06);
              -webkit-transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
              transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
            }

            .logoTile.tone-1 {
              background:
                linear-gradient(155deg, #2a0a12 0%, #0f0a0c 48%, #1c070d 100%);
            }

            .logoTile.tone-2 {
              background:
                linear-gradient(165deg, #0c0c0e 0%, #1f0a10 55%, #0b0b0c 100%);
            }

            .logoRail {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 3px;
              background: linear-gradient(
                180deg,
                #8b1a2e 0%,
                #3c050f 45%,
                #1a0508 100%
              );
              z-index: 3;
            }

            .logoCorner {
              position: absolute;
              top: 0;
              right: 0;
              width: 42px;
              height: 42px;
              background:
                linear-gradient(
                  225deg,
                  rgba(139, 26, 46, 0.95) 0%,
                  rgba(139, 26, 46, 0.55) 38%,
                  transparent 39%
                );
              z-index: 3;
              pointer-events: none;
            }

            .logoCorner::after {
              content: "";
              position: absolute;
              top: 9px;
              right: 9px;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: rgba(251, 251, 251, 0.85);
              box-shadow: 0 0 0 1px rgba(60, 5, 15, 0.35);
            }

            .logoStage {
              position: absolute;
              inset: 14px 14px 14px 18px;
              border-radius: 2px;
              background:
                linear-gradient(
                  180deg,
                  #ffffff 0%,
                  #f7f4f2 55%,
                  #efe8e4 100%
                );
              box-shadow:
                inset 0 0 0 1px rgba(60, 5, 15, 0.08),
                inset 0 10px 24px -16px rgba(60, 5, 15, 0.18),
                0 1px 0 rgba(255, 255, 255, 0.65);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1;
              overflow: hidden;
            }

            .logoStage::before {
              content: "";
              position: absolute;
              inset: 0;
              background:
                repeating-linear-gradient(
                  -18deg,
                  transparent,
                  transparent 11px,
                  rgba(60, 5, 15, 0.015) 11px,
                  rgba(60, 5, 15, 0.015) 12px
                );
              pointer-events: none;
              opacity: 0.9;
            }

            .logoMark {
              position: relative;
              z-index: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 86%;
              height: 78%;
            }

            .logoImg {
              width: auto;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              object-position: center;
              -webkit-filter: drop-shadow(0 1px 1px rgba(11, 11, 12, 0.06));
              filter: drop-shadow(0 1px 1px rgba(11, 11, 12, 0.06));
              -webkit-transition: transform 0.35s ease;
              transition: transform 0.35s ease;
            }

            .logoFallback {
              max-width: 90%;
              text-align: center;
              font-family: ui-sans-serif, system-ui, sans-serif;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: #3c050f;
            }

            .logoSheen {
              position: absolute;
              inset: 0;
              z-index: 4;
              pointer-events: none;
              background: linear-gradient(
                115deg,
                transparent 42%,
                rgba(255, 255, 255, 0.07) 50%,
                transparent 58%
              );
              -webkit-transform: translateX(-120%);
              transform: translateX(-120%);
              -webkit-transition: transform 0.7s ease;
              transition: transform 0.7s ease;
            }

            .logoTile:hover {
              border-color: rgba(255, 255, 255, 0.22);
              -webkit-transform: translateY(-4px);
              transform: translateY(-4px);
              box-shadow:
                0 0 0 1px rgba(139, 26, 46, 0.45),
                0 22px 40px -16px rgba(0, 0, 0, 0.85),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .logoTile:hover .logoImg {
              -webkit-transform: scale(1.04);
              transform: scale(1.04);
            }

            .logoTile:hover .logoSheen {
              -webkit-transform: translateX(120%);
              transform: translateX(120%);
            }

            @-webkit-keyframes marqueeScroll {
              0% { -webkit-transform: translateX(0); transform: translateX(0); }
              100% { -webkit-transform: translateX(-50%); transform: translateX(-50%); }
            }
            @keyframes marqueeScroll {
              0% { -webkit-transform: translateX(0); transform: translateX(0); }
              100% { -webkit-transform: translateX(-50%); transform: translateX(-50%); }
            }

            @media (max-width: 768px) {
              .logoTile {
                --tile-w: 196px;
                --tile-h: 112px;
              }
              .logoStage {
                inset: 11px 11px 11px 14px;
              }
              .marqueeTrack {
                gap: 1rem;
                -webkit-animation-duration: 34s;
                animation-duration: 34s;
              }
              .marqueeWrapper {
                padding: 2rem 0 2.5rem;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .marqueeTrack {
                -webkit-animation: none !important;
                animation: none !important;
              }
              .logoSheen {
                display: none;
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

      <div className="marqueeWrapper">
        <div className="marqueeTrack">
          {PARTNERS.map((partner, index) => (
            <LogoTile
              key={`${partner.name}-${index}`}
              brand={partner}
              tone={(index % 3) as 0 | 1 | 2}
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

      <div className="relative z-10 overflow-x-hidden pb-12 md:pb-20">
        <PartnerLogoMarquee brands={BRANDS} />
      </div>
    </section>
  );
}
