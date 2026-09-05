"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SectionHeadline } from "./SectionHeadline";
import { editorialQuotes, siteConfig } from "@/lib/content";

const heroLines = [
  { text: "We are all", accent: false },
  { text: "just stories", accent: true },
  { text: "in their minds.", accent: false },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = heroRef.current;
    const atmosphere = atmosphereRef.current;
    const content = contentRef.current;
    const secondary = secondaryRef.current;
    const cue = cueRef.current;
    if (!section || !atmosphere || !content || !secondary) return;

    let pinTrigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const lines = content.querySelectorAll(".hero-line-mask");
      const intro = content.querySelectorAll(".hero-intro");

      gsap.set(atmosphere, { opacity: 0, scale: 1.12 });
      gsap.set(lines, { yPercent: 110 });
      gsap.set(intro, { opacity: 0, y: 18 });
      gsap.set(secondary, { opacity: 0, y: 28 });
      if (cue) gsap.set(cue, { opacity: 0 });

      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      introTl
        .to(atmosphere, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0)
        .to(
          lines,
          { yPercent: 0, duration: 1.15, stagger: 0.18, ease: "power3.out" },
          0.35
        )
        .to(intro, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 1.05);

      if (cue) {
        introTl.to(cue, { opacity: 1, duration: 0.7 }, 1.5);
      }

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 1.25,
          anticipatePin: 1,
        },
      });

      scrubTl
        .to(atmosphere, { scale: 1.08, ease: "none" }, 0)
        .to(
          content,
          { y: -36, opacity: 0.35, ease: "none" },
          0
        )
        .to(secondary, { opacity: 1, y: 0, ease: "none" }, 0.15);

      if (cue) {
        scrubTl.to(cue, { opacity: 0, ease: "none" }, 0);
      }

      pinTrigger = scrubTl.scrollTrigger ?? null;
    }

    animate();
    return () => {
      cancelled = true;
      pinTrigger?.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex h-screen flex-col justify-center overflow-hidden bg-ink"
    >
      {/* Light B — atmospheric still behind type */}
      <div
        ref={atmosphereRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute inset-0 scale-110">
          <Image
            src="/services/video-production.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-55 blur-[2px] saturate-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-burgundy/25" />
        <div className="absolute inset-0 symphony-glow opacity-40" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-[calc(var(--nav-height)+1.5rem)] md:px-10 md:pt-[calc(var(--nav-height)+2.5rem)]"
      >
        <span className="hero-intro section-label mb-8 block">
          {siteConfig.tagline}
        </span>

        <h1 className="display-heading text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.9] text-snow">
          {heroLines.map((line) => (
            <span key={line.text} className="block overflow-hidden pb-[0.06em]">
              <span
                className={`hero-line-mask inline-block ${
                  line.accent ? "italic text-burgundy" : ""
                }`}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-intro mt-10 max-w-md font-sans text-sm tracking-wide text-snow/55 md:mt-12 md:text-base">
          Cairo-born. Strategy, cinema, and digital craft.
        </p>
      </div>

      {/* Scroll-earned second meaning */}
      <div
        ref={secondaryRef}
        className="pointer-events-none absolute inset-x-0 bottom-[18%] z-10 px-6 text-center md:bottom-[20%] md:px-10"
        aria-hidden="true"
      >
        <p className="display-heading text-[clamp(1.5rem,4vw,3.25rem)] italic leading-none text-snow/70">
          Strategy · Cinema · Digital
        </p>
        <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.35em] text-snow/30">
          Narratives that outlive the moment
        </p>
      </div>

      <a
        ref={cueRef}
        href="#philosophy"
        className="cursor-hover absolute bottom-10 right-6 z-10 flex flex-col items-end gap-2 md:bottom-12 md:right-10"
      >
        <span className="font-sans text-[10px] uppercase tracking-wider text-snow/35">
          Scroll
        </span>
        <span className="block h-10 w-px bg-snow/30" />
      </a>
    </section>
  );
}

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative symphony-snow px-6 py-32 text-ink md:px-10 md:py-48"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="section-label-light mb-6">Who We Are</p>
        <SectionHeadline className="display-heading max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-burgundy">
          Good narratives never lie.
        </SectionHeadline>
        <p className="mt-10 max-w-xl editorial-body-light text-base md:text-lg">
          We partner with founders, brands, and institutions to build identities,
          campaigns, and experiences — with the precision of luxury and the soul
          of storytelling.
        </p>
      </div>
    </section>
  );
}

export function EditorialQuotes() {
  return (
    <section className="relative symphony-void py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] space-y-24 px-6 md:px-10">
        {editorialQuotes.map((item, index) => (
          <QuoteBlock key={item.author} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function QuoteBlock({
  item,
  index,
}: {
  item: (typeof editorialQuotes)[0];
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

      const xFrom = index % 2 === 0 ? -100 : 100;
      tween = gsap.fromTo(
        el,
        { x: xFrom, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
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
      className={`flex flex-col gap-6 ${index % 2 === 0 ? "md:items-start" : "md:items-end md:text-right"}`}
    >
      <blockquote className="display-heading max-w-3xl text-2xl leading-snug text-snow md:text-4xl">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <cite className="font-sans text-[10px] uppercase tracking-[0.25em] text-snow/40 not-italic">
        {item.author}
      </cite>
    </div>
  );
}
