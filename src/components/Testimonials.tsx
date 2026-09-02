"use client";

import { useEffect, useRef } from "react";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let trigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const slides = track!.querySelectorAll(".testimonial-slide");
      if (slides.length < 2) return;

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * (slides.length - 1)}`,
        pin: true,
        scrub: 1,
        animation: gsap.to(track, {
          x: () => -(track!.scrollWidth - section!.offsetWidth),
          ease: "none",
        }),
      });
    }

    animate();
    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden symphony-void symphony-glow">
      <div ref={trackRef} className="flex h-full">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="testimonial-slide flex h-full w-screen shrink-0 flex-col justify-center px-6 md:px-10"
          >
            <div className="mx-auto w-full max-w-[1400px]">
              <p className="section-label mb-12">Voices</p>
              <blockquote className="display-heading max-w-4xl text-[clamp(1.5rem,4vw,3rem)] leading-snug text-snow">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-12 border-t border-snow/10 pt-8">
                <span className="block font-sans text-sm tracking-wide text-snow">
                  {item.name}
                </span>
                <span className="mt-1 block font-sans text-[11px] uppercase tracking-wider text-snow/40">
                  {item.role}
                </span>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
