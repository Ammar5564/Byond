"use client";

import { useEffect, useRef } from "react";
import { SectionHeadline } from "./SectionHeadline";
import { principles } from "@/lib/content";

export function Principles() {
  return (
    <section
      id="how-we-think"
      className="relative symphony-snow px-6 py-32 text-ink md:px-10 md:py-48"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="section-label-light mb-6">How we think</p>
        <SectionHeadline className="display-heading max-w-4xl text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] text-burgundy">
          Building brands that endure isn&apos;t magic — it requires:
        </SectionHeadline>

        <div className="mt-20 space-y-0 md:mt-28">
          {principles.map((item, index) => (
            <PrincipleRow key={item.index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PrincipleRow({
  item,
  index,
}: {
  item: (typeof principles)[0];
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

      tween = gsap.fromTo(
        el,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
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
      className="group grid grid-cols-12 items-baseline gap-4 border-t border-symphony-light py-10 md:gap-8 md:py-14"
    >
      <span className="col-span-2 font-sans text-[10px] tracking-wider text-ink/30 md:col-span-1">
        {item.index}
      </span>
      <h3 className="col-span-10 display-heading text-[clamp(2.25rem,6vw,5rem)] leading-[0.92] text-ink transition-colors duration-500 group-hover:text-burgundy md:col-span-5">
        {item.title}
      </h3>
      <p className="col-span-12 max-w-md font-sans text-sm leading-relaxed tracking-wide text-ink/55 md:col-span-6 md:col-start-7 md:text-base">
        {item.text}
      </p>
    </div>
  );
}
