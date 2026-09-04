"use client";

import { useEffect, useRef } from "react";
import { MarqueeBand } from "./MarqueeBand";
import { ScrollScrubText } from "./SmoothScroll";
import { SectionHeadline } from "./SectionHeadline";
import { editorialQuotes, heroStatements, siteConfig } from "@/lib/content";

const heroLines = [
  { text: "We are all", accent: false },
  { text: "just stories", accent: true },
  { text: "in their minds.", accent: false },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = heroRef.current;
    const content = contentRef.current;
    const marquee = marqueeRef.current;
    if (!section || !content || !marquee) return;

    let pinTrigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      gsap.set(marquee, { y: 72, opacity: 0 });

      gsap.from(".hero-word-inner", {
        y: "110%",
        opacity: 0,
        duration: 1.1,
        stagger: 0.055,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap.from(".hero-tagline", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.9,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=90%",
          pin: true,
          scrub: 1.4,
          anticipatePin: 1,
        },
      });

      tl.to(
        content,
        { y: -80, opacity: 0.12, ease: "none" },
        0
      ).to(marquee, { y: 0, opacity: 1, ease: "none" }, 0);

      pinTrigger = tl.scrollTrigger ?? null;
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
      className="relative flex h-screen flex-col justify-center overflow-hidden symphony-void symphony-glow"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-burgundy/10 via-transparent to-ink" />

      <div
        ref={contentRef}
        className="relative mx-auto w-full max-w-[1400px] px-6 pt-24 md:px-10 md:pt-32"
      >
        <span className="hero-tagline section-label mb-8 block">
          {siteConfig.tagline}
        </span>

        <h1 className="display-heading text-[clamp(3rem,11vw,9rem)] leading-[0.88] text-snow">
          {heroLines.map((line) => (
            <span
              key={line.text}
              className={`hero-line block ${line.accent ? "italic text-burgundy" : ""}`}
            >
              {line.text.split(" ").map((word, i) => (
                <span key={`${line.text}-${word}-${i}`} className="hero-word inline-block overflow-hidden">
                  <span className="hero-word-inner inline-block">{word}&nbsp;</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <ScrollScrubText className="hero-tagline mt-12 max-w-lg">
          <p className="font-sans text-sm leading-relaxed tracking-wide text-snow/50 md:text-base">
            A Cairo-born studio building narratives from strategy, cinema, and
            digital craft — for brands that refuse to be ordinary.
          </p>
        </ScrollScrubText>
      </div>

      <div
        ref={marqueeRef}
        className="absolute bottom-0 left-0 right-0 border-t border-symphony py-6"
      >
        <MarqueeBand
          items={heroStatements}
          speed="slow"
          textClassName="font-display text-2xl italic text-snow/80 md:text-4xl"
        />
      </div>

      <a
        href="#philosophy"
        className="cursor-hover absolute bottom-28 right-6 z-10 flex flex-col items-end gap-2 md:right-10"
      >
        <span className="font-sans text-[10px] uppercase tracking-wider text-snow/30">
          Scroll
        </span>
        <span className="block h-12 w-px bg-snow/30" />
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
