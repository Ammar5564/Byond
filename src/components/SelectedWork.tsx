"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SectionHeadline } from "./SectionHeadline";
import { selectedWork, type WorkLayout } from "@/lib/content";

const layoutStyles: Record<
  WorkLayout,
  { wrapper: string; aspect: string; container?: string }
> = {
  full: {
    wrapper: "w-full",
    aspect: "aspect-[16/9] md:aspect-[21/9]",
  },
  "offset-right": {
    wrapper: "ml-auto w-full md:w-[78%]",
    aspect: "aspect-[4/3]",
  },
  "offset-left": {
    wrapper: "mr-auto w-full md:w-[65%]",
    aspect: "aspect-[3/4] md:aspect-[4/5]",
  },
  wide: {
    wrapper: "w-full -mx-6 md:-mx-10 md:w-[calc(100%+5rem)]",
    aspect: "aspect-[2/1]",
  },
  tall: {
    wrapper: "ml-auto w-full md:w-[45%]",
    aspect: "aspect-[3/5]",
  },
  inset: {
    wrapper: "mx-auto w-full md:w-[55%]",
    aspect: "aspect-square",
    container: "md:-mt-24",
  },
};

function WorkPiece({
  project,
  index,
}: {
  project: (typeof selectedWork)[0];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const styles = layoutStyles[project.layout];
  const parallaxY = index % 2 === 0 ? -48 : 48;

  useEffect(() => {
    const el = ref.current;
    const imageInner = imageInnerRef.current;
    if (!el) return;

    const cleanups: Array<() => void> = [];
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !el) return;

      const imgWrap = el.querySelector(".work-image");
      const meta = el.querySelector(".work-meta");

      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      if (imgWrap) {
        enterTl.fromTo(
          imgWrap,
          { clipPath: "inset(100% 0 0 0)", scale: 1.12 },
          {
            clipPath: "inset(0% 0 0 0)",
            scale: 1,
            duration: 1.4,
            ease: "power3.inOut",
          }
        );
      }
      if (meta) {
        enterTl.fromTo(
          meta,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        );
      }

      cleanups.push(() => enterTl.scrollTrigger?.kill());

      if (imageInner) {
        const parallax = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
          animation: gsap.fromTo(
            imageInner,
            { y: -parallaxY * 0.4 },
            { y: parallaxY * 0.4, ease: "none" }
          ),
        });
        cleanups.push(() => parallax.kill());
      }
    }

    animate();
    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [parallaxY]);

  return (
    <article
      ref={ref}
      className={`group cursor-hover cursor-pointer ${styles.container ?? ""} ${index % 2 === 1 ? "md:pl-8" : "md:pr-8"}`}
    >
      <div className={styles.wrapper}>
        <div
          className={`work-image relative overflow-hidden bg-ink/10 ${styles.aspect}`}
        >
          <div ref={imageInnerRef} className="absolute inset-0 scale-110">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="object-cover transition-transform duration-[1.8s] ease-luxury group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-burgundy/0 transition-colors duration-700 group-hover:bg-burgundy/10" />
        </div>

        <div className="work-meta mt-5 flex items-start justify-between gap-4">
          <div>
            <span className="work-code inline-block origin-left font-sans text-[10px] tracking-wider text-ink/30 transition-all duration-500 ease-luxury group-hover:scale-105 group-hover:text-burgundy group-hover:tracking-widest">
              [{project.code}] {project.category}
            </span>
            <h3 className="display-heading mt-1 text-2xl text-ink transition-colors duration-500 group-hover:text-burgundy md:text-3xl">
              {project.title}
            </h3>
          </div>
          <span className="font-sans text-[11px] tracking-wider text-ink/30 transition-colors duration-500 group-hover:text-burgundy">
            {project.year}
          </span>
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    let trigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !el) return;

      const track = el.querySelector(".horizontal-track");
      if (!track) return;

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
        animation: gsap.to(track, {
          x: "-30%",
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
    <section id="work" className="relative symphony-snow py-32 md:py-48">
      <div className="mx-auto mb-20 max-w-[1400px] px-6 md:px-10">
        <p className="section-label-light">Selected Work</p>
        <SectionHeadline className="display-heading mt-4 text-[clamp(2rem,5vw,4rem)] text-burgundy">
          Stories in motion
        </SectionHeadline>
      </div>

      <div className="mx-auto max-w-[1400px] space-y-16 px-6 md:space-y-24 md:px-10">
        {selectedWork.slice(0, 4).map((project, index) => (
          <WorkPiece key={project.id} project={project} index={index} />
        ))}
      </div>

      <div ref={stripRef} className="relative mt-32 overflow-hidden py-8">
        <div className="horizontal-track flex gap-6 px-6 md:gap-10 md:px-10">
          {selectedWork.slice(4).map((project) => (
            <div
              key={project.id}
              className="cursor-hover relative h-[280px] w-[220px] shrink-0 overflow-hidden md:h-[360px] md:w-[280px]"
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover"
                sizes="280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-burgundy/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-sans text-[9px] uppercase tracking-wider text-snow/50">
                  [{project.code}]
                </span>
                <p className="display-heading text-lg text-snow">{project.title}</p>
              </div>
            </div>
          ))}
          {selectedWork.slice(4).map((project) => (
            <div
              key={`dup-${project.id}`}
              className="relative h-[280px] w-[220px] shrink-0 overflow-hidden md:h-[360px] md:w-[280px]"
              aria-hidden="true"
            >
              <Image
                src={project.image}
                alt=""
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
