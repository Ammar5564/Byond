"use client";

import { useEffect, useRef, useState } from "react";
import { principles } from "@/lib/content";
import { ManifestoAmbientCanvasClient } from "./ManifestoAmbientCanvasClient";

const displayTitles: Record<string, string> = {
  Narrative: "Focus",
  Strategy: "Listening",
  Craft: "Craft",
  Partnership: "Partnership",
};

const SCROLL_VH = 3;
const STEP_COUNT = principles.length;

function railScaleForStep(index: number) {
  if (STEP_COUNT <= 1) return 1;
  return index / (STEP_COUNT - 1);
}

export function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const stepRef = useRef(0);
  const swapLockRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [renderedIndex, setRenderedIndex] = useState(0);

  // Pin 300vh — scrub drives step index
  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let pinTrigger: { kill: () => void } | null = null;
    let cancelled = false;
    let lastIdx = -1;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !section || !pin) return;

      if (railFillRef.current) {
        gsap.set(railFillRef.current, {
          scaleY: railScaleForStep(0),
          transformOrigin: "top center",
        });
      }

      pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * SCROLL_VH}`,
        pin: pin,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const idx = Math.min(
            STEP_COUNT - 1,
            Math.floor(self.progress * 0.999 * STEP_COUNT)
          );
          stepRef.current = idx;
          if (idx !== lastIdx) {
            lastIdx = idx;
            setActiveIndex(idx);
          }
        },
      });

      ScrollTrigger.refresh();
    }

    animate();
    return () => {
      cancelled = true;
      pinTrigger?.kill();
    };
  }, []);

  // Rail fill → active step mark
  useEffect(() => {
    const fill = railFillRef.current;
    if (!fill) return;
    let tween: { kill: () => void } | null = null;
    let cancelled = false;

    async function run() {
      const { default: gsap } = await import("gsap");
      if (cancelled || !fill) return;
      tween = gsap.to(fill, {
        scaleY: railScaleForStep(activeIndex),
        duration: 0.55,
        ease: "power2.out",
        transformOrigin: "top center",
        overwrite: true,
      });
    }

    run();
    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [activeIndex]);

  // Exit old panel fully before mounting the next (no stacking)
  useEffect(() => {
    if (activeIndex === renderedIndex) return;
    if (swapLockRef.current) return;

    let cancelled = false;
    swapLockRef.current = true;

    async function swap() {
      const { default: gsap } = await import("gsap");
      const panel = panelRef.current;
      if (cancelled) {
        swapLockRef.current = false;
        return;
      }

      if (panel) {
        panel.style.pointerEvents = "none";
        await gsap.to(panel, {
          autoAlpha: 0,
          duration: 0.22,
          ease: "power1.in",
          overwrite: true,
        });
      }

      if (cancelled) {
        swapLockRef.current = false;
        return;
      }

      setRenderedIndex(activeIndex);
      swapLockRef.current = false;
    }

    swap();
    return () => {
      cancelled = true;
    };
  }, [activeIndex, renderedIndex]);

  // Enter animation for the exclusive rendered panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let cancelled = false;
    let tween: { kill: () => void } | null = null;
    const splits: Array<{ revert: () => void }> = [];

    async function play() {
      const [{ default: gsap }, { default: SplitType }] = await Promise.all([
        import("gsap"),
        import("split-type"),
      ]);
      if (cancelled || !panel) return;

      const targets = panel.querySelectorAll(".manifesto-split");
      const allWords: HTMLElement[] = [];

      targets.forEach((el) => {
        const instance = new SplitType(el as HTMLElement, {
          types: "words",
          tagName: "span",
        });
        splits.push(instance);
        instance.words?.forEach((word) => {
          word.style.display = "inline-block";
          allWords.push(word);
        });
      });

      panel.style.pointerEvents = "auto";
      gsap.set(panel, { autoAlpha: 1 });
      gsap.set(allWords, { y: 20, opacity: 0 });

      tween = gsap.to(allWords, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.028,
        ease: "power2.out",
      });
    }

    play();
    return () => {
      cancelled = true;
      tween?.kill();
      splits.forEach((s) => s.revert());
    };
  }, [renderedIndex]);

  const active = principles[renderedIndex] ?? principles[0];
  const mobileRail = railScaleForStep(activeIndex);

  return (
    <section
      id="how-we-think"
      ref={sectionRef}
      className="relative scroll-mt-[var(--nav-height)] bg-ink"
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-ink"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <ManifestoAmbientCanvasClient
            progressRef={progressRef}
            stepRef={stepRef}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] px-6 pt-[calc(var(--nav-height)+2rem)] pb-10 md:px-10 md:pb-12">
          {/* Strict 35% / 65% split */}
          <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-[minmax(0,35%)_minmax(0,65%)] md:gap-0">
            <aside
              className="relative hidden md:flex md:items-center"
              aria-label="Manifesto steps"
            >
              <div className="relative flex pl-1">
                <div
                  className="absolute bottom-0 left-0 top-0 w-px overflow-hidden bg-champagne/15"
                  aria-hidden="true"
                >
                  <div
                    ref={railFillRef}
                    className="absolute inset-x-0 top-0 h-full w-px origin-top bg-champagne"
                    style={{ transform: "scaleY(0)" }}
                  />
                </div>

                <ol className="relative ml-5 flex min-h-[13rem] flex-col justify-between py-0.5">
                  {principles.map((item, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <li key={item.index} className="relative">
                        <span
                          className={`font-sans text-[12px] tracking-[0.28em] tabular-nums text-champagne transition-[opacity,font-weight,text-shadow] duration-500 ${
                            isActive ? "font-semibold" : "font-normal"
                          }`}
                          style={{
                            opacity: isActive ? 1 : 0.25,
                            textShadow: isActive
                              ? "0 0 20px rgba(229, 221, 203, 0.45)"
                              : "none",
                          }}
                          aria-current={isActive ? "step" : undefined}
                        >
                          {item.index}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </aside>

            <div className="relative flex flex-col justify-center md:pl-8 lg:pl-12">
              <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-stone">
                How we think
              </p>

              <h2 className="display-heading mt-4 max-w-[600px] text-[clamp(1.35rem,2.6vw,2.15rem)] leading-[1.15] text-champagne/90">
                Building brands that endure isn&apos;t magic — it requires:
              </h2>

              {/* Gap ≤ 32px (2rem) between header and pillar title */}
              <div className="relative mt-8 min-h-[200px] overflow-hidden md:min-h-[220px]">
                <article
                  key={active.index}
                  ref={panelRef}
                  className="manifesto-panel w-full"
                  aria-live="polite"
                >
                  <span className="mb-3 block font-sans text-[10px] tracking-[0.28em] text-stone md:hidden">
                    {active.index} / {String(STEP_COUNT).padStart(2, "0")}
                  </span>
                  <h3 className="manifesto-split display-heading text-[clamp(2.5rem,7vw,5rem)] leading-[0.94] text-champagne">
                    {displayTitles[active.title] ?? active.title}
                  </h3>
                  <p className="manifesto-split mt-5 max-w-xl font-sans text-[clamp(0.95rem,1.5vw,1.125rem)] leading-relaxed tracking-wide text-fog/70">
                    {active.text}
                  </p>
                </article>
              </div>

              <div
                className="mt-10 flex items-center gap-3 md:hidden"
                aria-hidden="true"
              >
                <div className="h-px flex-1 overflow-hidden bg-champagne/15">
                  <div
                    className="h-px origin-left bg-champagne/70 transition-transform duration-500 ease-out"
                    style={{ transform: `scaleX(${mobileRail})` }}
                  />
                </div>
                <span className="font-sans text-[10px] tracking-[0.2em] text-stone tabular-nums">
                  {principles[activeIndex]?.index} /{" "}
                  {String(STEP_COUNT).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
