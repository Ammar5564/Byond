"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { capabilities } from "@/lib/content";
import { blurFor } from "@/lib/img";

/**
 * Services — one full-width photo per service. A tall scroll track holds a
 * sticky 100svh stage; as the page scrolls the next photo fades in OVER the
 * previous one (so the stage is never empty) and each service's name/description
 * fades out before the next one fades in, so two texts are never visible at once.
 *
 * Same behaviour on phone and laptop. Only opacity/transform are written, straight
 * to the DOM from one rAF-throttled scroll listener — no React re-render per frame,
 * no pinning library.
 *
 * Phone: the photo fills the top ~60% of the stage and melts into the dark band
 * that carries the text. Laptop: the photo is the whole stage, text bottom-left.
 */

/** Scroll distance per service, in svh. */
const STEP_SVH = 75;

/** Horizontal focus point (%) so the subject survives the portrait crop on phones. */
const FOCUS_X: Record<string, number> = {
  "digital-solutions": 66,
  "performance-marketing": 52,
  "personal-branding": 52,
  "business-consultation": 46,
  "video-production": 53,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const slugOf = (src: string) => src.split("/").pop()?.replace(".webp", "") ?? "";

export function Capabilities() {
  const total = capabilities.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const barRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const range = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const p = clamp01(-track.getBoundingClientRect().top / range);
      const f = p * (total - 1); // 0 … total-1, fractional while scrolling

      for (let i = 0; i < total; i++) {
        // Photo i fades in over photo i-1 between f = i-0.82 and f = i-0.18
        const layer = layerRefs.current[i];
        if (layer) {
          const o = i === 0 ? 1 : clamp01((f - (i - 0.82)) / 0.64);
          layer.style.opacity = String(o);
          layer.style.transform = `scale(${(1 + 0.05 * (1 - o)).toFixed(4)})`;
        }

        // Text i is only visible while f is close to i (never together with i±1)
        const text = textRefs.current[i];
        if (text) {
          const d = Math.abs(f - i);
          const t = clamp01(1 - (d - 0.12) / 0.3);
          text.style.opacity = String(t);
          text.style.visibility = t < 0.01 ? "hidden" : "visible";
          text.style.transform = `translate3d(0, ${((i - f) * 36).toFixed(1)}px, 0)`;
        }
      }

      const active = Math.round(f);
      if (active !== activeRef.current) {
        activeRef.current = active;
        barRefs.current.forEach((b, i) => {
          if (!b) return;
          b.dataset.active = i === active ? "true" : "false";
          b.setAttribute("aria-current", i === active ? "true" : "false");
        });
        if (counterRef.current) {
          counterRef.current.textContent = `${String(active + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
        }
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [total]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const range = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (i / (total - 1)) * range, behavior: "smooth" });
    },
    [total]
  );

  return (
    <section id="capabilities" className="relative bg-night">
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `calc(100svh + ${(total - 1) * STEP_SVH}svh)` }}
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-night text-champagne"
        >
          {/* Photos — phone: top 60% of the stage, laptop: the whole stage */}
          <div className="absolute inset-x-0 top-0 h-[60svh] md:h-[68svh] lg:inset-0 lg:h-full">
            {capabilities.map((item, i) => (
              <div
                key={item.index}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                className="absolute inset-0 will-change-[opacity,transform]"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="100vw"
                  quality={80}
                  priority={i === 0}
                  placeholder="blur"
                  blurDataURL={blurFor(item.image)}
                  className="object-cover"
                  style={{ objectPosition: `${FOCUS_X[slugOf(item.image)] ?? 50}% 50%` }}
                />
              </div>
            ))}

            {/* Legibility scrims (static) */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-night/75 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night via-night/60 to-transparent lg:h-[62%] lg:via-night/55"
              aria-hidden="true"
            />
          </div>

          {/* Eyebrow + counter */}
          <div className="page-shell absolute inset-x-0 top-[calc(var(--nav-height)+1.25rem)] z-10 flex items-center justify-between">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-champagne/85">
              Capabilities <span className="text-gold">·</span> What we do
            </p>
            <span
              ref={counterRef}
              className="font-sans text-[12px] tabular-nums tracking-[0.24em] text-champagne/85"
            >
              {`01 / ${String(total).padStart(2, "0")}`}
            </span>
          </div>

          {/* Text + progress */}
          <div className="page-shell absolute inset-x-0 bottom-0 z-10 pb-[max(1.75rem,env(safe-area-inset-bottom))] lg:flex lg:items-end lg:justify-between lg:gap-12 lg:pb-12">
            <div className="relative min-h-[15.5rem] w-full max-w-3xl sm:min-h-[16.5rem] lg:min-h-[20rem]">
              {capabilities.map((item, i) => (
                <div
                  key={item.index}
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  className="absolute inset-x-0 bottom-0 will-change-[opacity,transform]"
                  style={
                    i === 0
                      ? undefined
                      : { opacity: 0, visibility: "hidden" }
                  }
                >
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[12px] tabular-nums tracking-[0.28em] text-gold">
                      {item.index}
                    </span>
                    <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
                    <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-champagne/80">
                      {item.code}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(2.3rem,9.2vw,3.1rem)] font-normal leading-[1.02] tracking-editorial text-ivory text-balance sm:text-6xl lg:text-[clamp(4rem,6.2vw,6.5rem)]">
                    {item.title}
                  </h2>
                  <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-champagne/85 sm:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress — doubles as navigation */}
            <div
              className="mt-6 flex gap-2 lg:mt-0 lg:w-[22rem] lg:shrink-0 lg:pb-2"
              role="group"
              aria-label="Services"
            >
              {capabilities.map((item, i) => (
                <button
                  key={item.index}
                  type="button"
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  data-active={i === 0 ? "true" : "false"}
                  onClick={() => goTo(i)}
                  aria-label={`Show ${item.title}`}
                  className="group flex-1 py-3"
                >
                  <span className="block h-[3px] w-full overflow-hidden rounded-full bg-champagne/25">
                    <span className="block h-full w-full origin-left scale-x-0 rounded-full bg-gold transition-transform duration-500 ease-luxury group-data-[active=true]:scale-x-100" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
