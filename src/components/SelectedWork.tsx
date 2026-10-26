"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { selectedWork, type WorkItem } from "@/lib/content";
import { Reveal } from "./Reveal";
import { VideoModal } from "./VideoModal";

/**
 * Selected work — a cinematic film reel.
 *
 * One big 16:9 still per film in a horizontal scroll-snap strip: swipe on a phone,
 * drag / arrows / keys on a laptop. The centred film is lit, its neighbours peek in
 * dimmed so people can see there is more. Everything is native scrolling (no WebGL,
 * no pinning), which is what keeps it smooth on phones. Tapping the lit film plays it.
 */

const MAX_RES = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.25 5.75v12.5L19 12 8.25 5.75z" />
    </svg>
  );
}

function Arrow({ dir, className }: { dir: "prev" | "next"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {dir === "prev" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

/** Full-HD still when YouTube has one, otherwise the standard thumbnail. */
function Still({ item, eager }: { item: WorkItem; eager?: boolean }) {
  const [src, setSrc] = useState(MAX_RES(item.youtubeId));
  const fallback = () => setSrc((cur) => (cur === item.thumbnail ? cur : item.thumbnail));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      // SSR'd images can fail before React attaches onError — re-check once mounted
      ref={(img) => {
        if (img && img.complete && img.naturalWidth <= 200 && src !== item.thumbnail) fallback();
      }}
      src={src}
      alt={`${item.title} — ${item.client}`}
      width={1280}
      height={720}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={fallback}
      // YouTube answers a missing max-res still with a tiny grey placeholder
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 200) fallback();
      }}
      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-[1.03]"
    />
  );
}

export function SelectedWork() {
  const total = selectedWork.length;
  const scrollerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<WorkItem | null>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  // Which film is lit = the one whose centre is closest to the strip's centre
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const scroller = scrollerRef.current;
      const el = itemRefs.current[Math.max(0, Math.min(total - 1, i))];
      if (!scroller || !el) return;
      scroller.scrollTo({
        left: el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2,
        behavior: "smooth",
      });
    },
    [total]
  );

  // Mouse drag (touch uses native momentum scrolling)
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    drag.current = { down: true, startX: e.clientX, startLeft: scroller.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const scroller = scrollerRef.current;
    if (!d.down || !scroller) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      scroller.style.scrollSnapType = "none";
      scroller.style.cursor = "grabbing";
    }
    if (d.moved) scroller.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    const scroller = scrollerRef.current;
    if (!d.down || !scroller) return;
    d.down = false;
    if (d.moved) {
      scroller.style.scrollSnapType = "";
      scroller.style.cursor = "";
      goTo(active);
      // swallow the click that follows a drag
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 0);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="work"
      className="relative scroll-mt-[var(--nav-height)] overflow-hidden bg-cream py-20 md:py-28"
      aria-labelledby="work-heading"
    >
      <div className="page-shell">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2
              id="work-heading"
              className="display-heading mt-4 text-[clamp(2.4rem,5.4vw,4.25rem)]"
            >
              Stories in motion
            </h2>
          </div>

          <div className="hidden shrink-0 gap-3 sm:flex">
            {(["prev", "next"] as const).map((dir) => {
              const disabled = dir === "prev" ? active === 0 : active === total - 1;
              return (
                <button
                  key={dir}
                  type="button"
                  onClick={() => goTo(active + (dir === "prev" ? -1 : 1))}
                  disabled={disabled}
                  aria-label={dir === "prev" ? "Previous film" : "Next film"}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition duration-500 ease-luxury hover:border-burgundy hover:bg-burgundy hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
                >
                  <Arrow dir={dir} className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* The reel */}
      <ul
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label="Selected films — swipe or use the arrow keys"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="no-scrollbar relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8vw] pb-10 pt-2 outline-none sm:gap-6 sm:px-[6vw] lg:cursor-grab lg:px-[max(2rem,calc((100vw-1400px)/2+2.5rem))]"
      >
        {selectedWork.map((item, i) => {
          const isActive = i === active;
          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-active={isActive}
              className="w-[84vw] shrink-0 snap-center opacity-60 transition-[opacity,transform] duration-700 ease-luxury data-[active=true]:opacity-100 sm:w-[72vw] lg:w-[58vw] lg:max-w-[900px]"
            >
              <button
                type="button"
                onClick={() => (isActive ? setPlaying(item) : goTo(i))}
                aria-label={isActive ? `Play ${item.title}` : `Show ${item.title}`}
                className="group relative block aspect-video w-full overflow-hidden rounded-[20px] bg-night shadow-[0_40px_80px_-44px_rgba(60,10,25,0.65)] ring-1 ring-ink/10 sm:rounded-[28px]"
              >
                <Still item={item} eager={i < 2} />

                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/55 via-night/5 to-night/30"
                  aria-hidden="true"
                />

                <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-burgundy sm:left-5 sm:top-5">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-night/70 px-3 py-1 font-sans text-[11px] tabular-nums tracking-[0.14em] text-champagne sm:bottom-5 sm:right-5">
                  {item.duration}
                </span>

                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ivory text-burgundy shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-luxury group-hover:scale-110 sm:h-20 sm:w-20">
                    {isActive && <span className="play-pulse" aria-hidden="true" />}
                    <PlayIcon className="relative ml-1 h-7 w-7 sm:h-8 sm:w-8" />
                  </span>
                </span>
              </button>

              <div className="mt-5 flex items-start gap-4 px-1 sm:mt-6">
                <span className="pt-2 font-sans text-[12px] tabular-nums tracking-[0.28em] text-gold-deep">
                  {item.id}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.5rem,4.6vw,2.4rem)] leading-[1.08] tracking-editorial text-ink text-balance">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm tracking-wide text-ink-soft">
                    {item.client}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
        {/* breathing room after the last film so it can sit centred */}
        <li aria-hidden="true" className="w-px shrink-0 lg:hidden" />
      </ul>

      {/* Progress */}
      <div className="page-shell">
        <div className="flex items-center gap-5">
          <div className="flex flex-1 gap-2" role="group" aria-label="Films">
            {selectedWork.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${item.title}`}
                aria-current={i === active}
                data-active={i === active}
                className="group flex-1 py-3"
              >
                <span className="block h-[3px] w-full overflow-hidden rounded-full bg-sand">
                  <span className="block h-full w-full origin-left scale-x-0 rounded-full bg-burgundy transition-transform duration-500 ease-luxury group-data-[active=true]:scale-x-100" />
                </span>
              </button>
            ))}
          </div>
          <span className="shrink-0 font-sans text-[12px] tabular-nums tracking-[0.24em] text-ink-soft">
            {num(active + 1)} / {num(total)}
          </span>
        </div>
      </div>

      <VideoModal
        youtubeId={playing?.youtubeId ?? null}
        title={playing?.title}
        onClose={() => setPlaying(null)}
      />
    </section>
  );
}
