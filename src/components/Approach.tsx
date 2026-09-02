"use client";

import { useEffect, useRef } from "react";
import { SectionHeadline } from "./SectionHeadline";
import { approach } from "@/lib/content";

export function Approach() {
  return (
    <section id="approach" className="relative symphony-snow py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="section-label-light">Our Playbook</p>
        <SectionHeadline className="display-heading mt-4 max-w-3xl text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-burgundy">
          From intention to experience
        </SectionHeadline>

        <div className="mt-24 space-y-0">
          {approach.map((step, index) => (
            <PlaybookStep key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaybookStep({
  step,
  index,
}: {
  step: (typeof approach)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let tween: { scrollTrigger?: { kill: () => void }; kill: () => void } | null =
      null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !el) return;

      const num = el.querySelector(".step-num");
      const content = el.querySelector(".step-content");

      tween = gsap.fromTo(
        [num, content],
        { x: index % 2 === 0 ? -60 : 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    animate();
    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className="group grid grid-cols-12 gap-4 border-t border-symphony-light py-10 md:gap-8 md:py-14"
    >
      <span className="step-num col-span-2 font-display text-4xl text-ink/15 transition-colors duration-500 group-hover:text-burgundy md:text-6xl">
        {step.step}
      </span>
      <div className="step-content col-span-10 md:col-span-6">
        <h3 className="display-heading text-xl text-ink md:text-2xl">{step.title}</h3>
        <p className="mt-3 font-sans text-sm leading-relaxed tracking-wide text-ink/50">
          {step.text}
        </p>
      </div>
    </div>
  );
}
