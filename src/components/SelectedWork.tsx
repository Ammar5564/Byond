"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SectionHeadline } from "./SectionHeadline";
import { selectedWork } from "@/lib/content";

function WorkCopy({
  project,
  reversed,
}: {
  project: (typeof selectedWork)[0];
  reversed: boolean;
}) {
  return (
    <div
      className={`work-copy flex flex-col justify-center ${
        reversed ? "md:items-end md:text-right" : ""
      }`}
    >
      <span className="font-sans text-[10px] tracking-wider text-snow/35">
        {project.id} / {String(selectedWork.length).padStart(2, "0")}
      </span>
      <span className="mt-4 font-sans text-[10px] uppercase tracking-[0.2em] text-burgundy">
        [{project.code}] {project.category}
      </span>
      <h3 className="display-heading mt-3 text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] text-snow">
        {project.title}
      </h3>
      <p className="mt-5 max-w-md font-sans text-sm leading-relaxed tracking-wide text-snow/55 md:text-base">
        {project.description}
      </p>
      <span
        className={`mt-8 font-sans text-[11px] tracking-wider text-snow/30 ${
          reversed ? "md:self-end" : ""
        }`}
      >
        {project.year}
      </span>
    </div>
  );
}

function WorkImage({ project }: { project: (typeof selectedWork)[0] }) {
  return (
    <div className="work-image relative aspect-[4/3] overflow-hidden bg-ink/40">
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        className="object-cover transition-transform duration-[1.8s] ease-luxury group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="work-light-leak pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
    </div>
  );
}

function ArchiveRow({
  project,
  index,
}: {
  project: (typeof selectedWork)[0];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reversed = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let enterTrigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !el) return;

      const image = el.querySelector(".work-image");
      const copy = el.querySelector(".work-copy");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      if (image) {
        tl.fromTo(
          image,
          { clipPath: "inset(100% 0 0 0)", scale: 1.06 },
          {
            clipPath: "inset(0% 0 0 0)",
            scale: 1,
            duration: 1.2,
            ease: "power3.inOut",
          }
        );
      }
      if (copy) {
        tl.fromTo(
          copy,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" },
          "-=0.65"
        );
      }

      enterTrigger = tl.scrollTrigger ?? null;
    }

    animate();
    return () => {
      cancelled = true;
      enterTrigger?.kill();
    };
  }, []);

  return (
    <article
      ref={ref}
      data-work-index={index}
      className="work-row group cursor-hover flex min-h-[88svh] items-center py-16 md:min-h-[92svh] md:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10 lg:gap-24">
        <div className={reversed ? "md:order-2" : "md:order-1"}>
          <WorkImage project={project} />
        </div>
        <div className={reversed ? "md:order-1" : "md:order-2"}>
          <WorkCopy project={project} reversed={reversed} />
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const atmosphere = atmosphereRef.current;
    if (!section || !atmosphere) return;

    const cleanups: Array<() => void> = [];
    let cancelled = false;
    let activeBg = 0;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !section || !atmosphere) return;

      const bgLayers = gsap.utils.toArray<HTMLElement>(
        atmosphere.querySelectorAll(".work-bg")
      );
      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".work-row")
      );

      gsap.set(bgLayers, { opacity: 0, scale: 1.08 });
      if (bgLayers[0]) gsap.set(bgLayers[0], { opacity: 1, scale: 1 });

      const fadeTo = (index: number) => {
        if (index === activeBg || !bgLayers[index]) return;
        const prev = activeBg;
        activeBg = index;
        gsap.to(bgLayers[prev], {
          opacity: 0,
          scale: 1.06,
          duration: 0.9,
          ease: "power2.inOut",
        });
        gsap.to(bgLayers[index], {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.inOut",
        });
      };

      rows.forEach((row, index) => {
        const trigger = ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => fadeTo(index),
          onEnterBack: () => fadeTo(index),
        });
        cleanups.push(() => trigger.kill());
      });

      const intro = ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.fromTo(
            atmosphere,
            { opacity: 0 },
            { opacity: 1, duration: 1.1, ease: "power2.out" }
          );
        },
      });
      cleanups.push(() => intro.kill());

      bgLayers.forEach((layer, index) => {
        const drift = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
          animation: gsap.fromTo(
            layer.querySelector(".work-bg-inner"),
            { y: -20 - index * 4 },
            { y: 20 + index * 4, ease: "none" }
          ),
        });
        cleanups.push(() => drift.kill());
      });
    }

    animate();
    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative scroll-mt-[var(--nav-height)] overflow-hidden symphony-void"
    >
      {/* Layer 2 — sticky symphony atmosphere */}
      <div
        ref={atmosphereRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        aria-hidden="true"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {selectedWork.map((project) => (
            <div
              key={`bg-${project.id}`}
              className="work-bg absolute inset-0 will-change-transform"
            >
              <div className="work-bg-inner absolute inset-0 scale-110">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  className="object-cover blur-[72px] saturate-[1.15]"
                  sizes="100vw"
                />
              </div>
              <div className="work-symphony-wash absolute inset-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Layer 1 — archive content */}
      <div className="relative z-10 pt-[var(--nav-height)]">
        <div className="mx-auto max-w-[1400px] px-6 pb-8 pt-16 md:px-10 md:pt-24 md:pb-12">
          <p className="section-label">Selected Work</p>
          <SectionHeadline className="display-heading mt-4 max-w-3xl text-[clamp(2rem,5vw,4rem)] text-snow">
            Stories in motion
          </SectionHeadline>
          <p className="mt-6 max-w-lg font-sans text-sm tracking-wide text-snow/45 md:text-base">
            A curated archive — six narratives told through film, brand, and
            digital craft.
          </p>
        </div>

        <div className="border-t border-symphony">
          {selectedWork.map((project, index) => (
            <ArchiveRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
