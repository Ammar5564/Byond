"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MarqueeBand } from "./MarqueeBand";
import { capabilityMarquee, capabilities } from "@/lib/content";

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let pinTrigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !pin) return;

      const backgrounds = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll(".cap-bg")
      );
      const panels = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll(".cap-panel")
      );
      const ghosts = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll(".cap-ghost")
      );
      const progressFill = pin.querySelector(".cap-progress-fill");

      gsap.set(backgrounds, { opacity: 0, scale: 1.12 });
      gsap.set(backgrounds[0], { opacity: 1, scale: 1 });
      gsap.set(panels, { opacity: 0, y: 48 });
      gsap.set(panels[0], { opacity: 1, y: 0 });
      gsap.set(ghosts, { opacity: 0 });
      gsap.set(ghosts[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * capabilities.length}`,
          pin: pin,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      const step = 1 / capabilities.length;

      capabilities.forEach((_, i) => {
        if (i === 0) return;

        const t = i * step;

        tl.to(
          backgrounds[i - 1],
          { opacity: 0, scale: 1.08, duration: step, ease: "none" },
          t
        )
          .to(
            backgrounds[i],
            { opacity: 1, scale: 1, duration: step, ease: "none" },
            t
          )
          .to(
            panels[i - 1],
            { opacity: 0, y: -40, duration: step * 0.6, ease: "power2.in" },
            t
          )
          .to(
            panels[i],
            { opacity: 1, y: 0, duration: step * 0.6, ease: "power2.out" },
            t + step * 0.15
          )
          .to(ghosts[i - 1], { opacity: 0, duration: step * 0.5, ease: "none" }, t)
          .to(ghosts[i], { opacity: 1, duration: step * 0.5, ease: "none" }, t);
      });

      if (progressFill) {
        tl.to(
          progressFill,
          { scaleY: 1, ease: "none", duration: 1 - step * 0.5 },
          step * 0.5
        );
      }

      pinTrigger = tl.scrollTrigger ?? null;
    }

    animate();
    return () => {
      cancelled = true;
      pinTrigger?.kill();
    };
  }, []);

  return (
    <section id="capabilities" ref={sectionRef} className="relative">
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-ink"
      >
        {/* Background images */}
        <div className="absolute inset-0">
          {capabilities.map((item, index) => (
            <div
              key={item.index}
              className="cap-bg absolute inset-0 will-change-transform"
              aria-hidden={index !== 0}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="capabilities-overlay absolute inset-0" />
            </div>
          ))}
        </div>

        {/* Ghost titles — AWD-style background words */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-6"
          aria-hidden="true"
        >
          {capabilities.map((item) => (
            <p
              key={`ghost-${item.index}`}
              className="cap-ghost display-heading absolute max-w-[95vw] text-center text-[clamp(3rem,14vw,11rem)] leading-[0.85] text-snow/[0.07]"
            >
              {item.title}
            </p>
          ))}
        </div>

        {/* Section label — fixed during pin */}
        <div className="absolute left-6 top-28 z-20 md:left-10 md:top-32">
          <p className="section-label">Capabilities</p>
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.3em] text-snow/35">
            What we do
          </p>
        </div>

        {/* Progress rail */}
        <div
          className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 md:right-10 md:block"
          aria-hidden="true"
        >
          <div className="relative h-48 w-px bg-snow/15">
            <div
              className="cap-progress-fill absolute left-0 top-0 w-full origin-top bg-burgundy"
              style={{ height: "100%", transform: "scaleY(0)" }}
            />
          </div>
          <div className="mt-4 space-y-3 text-right">
            {capabilities.map((item) => (
              <span
                key={`rail-${item.index}`}
                className="block font-sans text-[10px] tracking-wider text-snow/25"
              >
                {item.index}
              </span>
            ))}
          </div>
        </div>

        {/* Foreground panels */}
        <div className="relative z-10 h-full w-full">
          <div className="mx-auto flex h-full max-w-[1400px] items-end px-6 pb-36 md:items-center md:px-10 md:pb-24">
            <div className="relative w-full min-h-[200px] md:min-h-[260px]">
              {capabilities.map((item) => (
                <div
                  key={item.index}
                  className="cap-panel absolute inset-0 flex items-end md:items-center"
                >
                  <div className="max-w-2xl">
                    <span className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-snow/15">
                      {item.index}
                    </span>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2 md:-mt-6">
                      <h3 className="display-heading text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] text-snow">
                        {item.title}
                      </h3>
                      <span className="font-sans text-[10px] tracking-wider text-burgundy">
                        [{item.code}]
                      </span>
                    </div>
                    <p className="mt-6 max-w-lg font-sans text-sm leading-relaxed tracking-wide text-snow/60 md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-symphony bg-ink/40 py-5 backdrop-blur-sm">
          <MarqueeBand
            items={capabilityMarquee}
            speed="slow"
            textClassName="font-display text-xl italic text-snow/50 md:text-3xl"
          />
        </div>
      </div>
    </section>
  );
}
