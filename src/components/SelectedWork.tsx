"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { selectedWork, type WorkItem } from "@/lib/content";
import {
  WorksTunnelCanvasClient,
  type TunnelApi,
} from "./WorksTunnelCanvasClient";

function TunnelOverlay({
  project,
  proximity,
  total,
  onEnter,
}: {
  project: WorkItem;
  proximity: number;
  total: number;
  onEnter: () => void;
}) {
  const opacity = 0.35 + proximity * 0.65;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-6 py-8 text-champagne md:px-10 md:py-12"
      aria-live="polite"
    >
      <div
        className="flex items-start justify-between gap-6 transition-opacity duration-500"
        style={{ opacity }}
      >
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-champagne/50">
            Selected Work
          </p>
          <h2 className="display-heading mt-3 max-w-xl text-[clamp(1.75rem,4vw,3.25rem)] leading-[0.95] text-champagne">
            Stories in motion
          </h2>
        </div>
        <span className="font-sans text-[11px] tracking-[0.2em] text-champagne/45 tabular-nums">
          {project.id} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className="flex flex-col gap-6 transition-opacity duration-500 md:flex-row md:items-end md:justify-between"
        style={{ opacity }}
      >
        <div className="max-w-lg">
          <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-burgundy">
            [{project.code}] {project.category}
          </span>
          <h3 className="display-heading mt-3 text-[clamp(2rem,5vw,3.75rem)] leading-[0.92] text-champagne">
            {project.title}
          </h3>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed tracking-wide text-champagne/55 md:text-base">
            {project.description}
          </p>
        </div>

        <div className="pointer-events-auto flex items-end gap-8">
          <span className="font-sans text-[11px] tracking-[0.18em] text-champagne/35">
            {project.year}
          </span>
          <button
            type="button"
            onClick={onEnter}
            className="cursor-hover group border border-champagne/25 px-5 py-3 font-sans text-[10px] uppercase tracking-[0.24em] text-champagne transition-colors duration-500 hover:border-champagne/60 hover:bg-champagne/5"
          >
            Enter project
            <span className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CaseStudyView({
  project,
  onClose,
}: {
  project: WorkItem;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      if (cancelled || !panel) return;
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
      );
      gsap.fromTo(
        panel.querySelectorAll(".case-reveal"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.25,
        }
      );
    }
    animate();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className="absolute inset-0">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="work-symphony-wash absolute inset-0 opacity-60" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-12">
        <div className="flex items-start justify-between">
          <span className="case-reveal font-sans text-[10px] uppercase tracking-[0.24em] text-champagne/50">
            Case study · {project.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="case-reveal cursor-hover border border-champagne/30 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.2em] text-champagne transition-colors hover:border-champagne/70"
          >
            Close
          </button>
        </div>

        <div className="max-w-2xl pb-8">
          <span className="case-reveal font-sans text-[10px] uppercase tracking-[0.22em] text-burgundy">
            [{project.code}] {project.category}
          </span>
          <h2 className="case-reveal display-heading mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.92] text-champagne">
            {project.title}
          </h2>
          <p className="case-reveal mt-6 max-w-lg font-sans text-base leading-relaxed tracking-wide text-champagne/60 md:text-lg">
            {project.description}
          </p>
          <p className="case-reveal mt-4 font-sans text-sm tracking-wide text-champagne/35">
            {project.mediaBrief} · {project.year}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const apiRef = useRef<TunnelApi | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [proximity, setProximity] = useState(1);
  const [caseOpen, setCaseOpen] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const caseOpenRef = useRef(false);

  const onActiveChange = useCallback((index: number, prox: number) => {
    setActiveIndex(index);
    setProximity(prox);
  }, []);

  const openCase = useCallback(async (index: number) => {
    const api = apiRef.current;
    api?.setHoverEnabled(false);
    if (api) {
      await api.flyToIndex(index);
    }
    setCaseIndex(index);
    setCaseOpen(true);
    caseOpenRef.current = true;
  }, []);

  const closeCase = useCallback(() => {
    setCaseOpen(false);
    caseOpenRef.current = false;
    apiRef.current?.setHoverEnabled(true);
  }, []);

  const onSelect = useCallback(
    (index: number) => {
      if (caseOpenRef.current) return;
      void openCase(index);
    },
    [openCase]
  );

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
      if (cancelled || !section || !pin) return;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * selectedWork.length * 1.15}`,
        pin: pin,
        pinSpacing: true,
        scrub: 1.15,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          apiRef.current?.setProgress(self.progress);
        },
      });

      pinTrigger = st;
    }

    animate();
    return () => {
      cancelled = true;
      pinTrigger?.kill();
    };
  }, []);

  const project = selectedWork[activeIndex] ?? selectedWork[0];
  const caseProject = selectedWork[caseIndex] ?? selectedWork[0];
  const railProgress =
    (activeIndex + proximity * 0.15) / Math.max(1, selectedWork.length - 1);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative scroll-mt-[var(--nav-height)] symphony-void"
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-ink"
      >
        <WorksTunnelCanvasClient
          projects={selectedWork}
          progressRef={progressRef}
          onActiveChange={onActiveChange}
          onSelect={onSelect}
          apiRef={apiRef}
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-ink via-ink/50 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-ink via-ink/60 to-transparent"
          aria-hidden="true"
        />

        {!caseOpen && (
          <TunnelOverlay
            project={project}
            proximity={proximity}
            total={selectedWork.length}
            onEnter={() => void openCase(activeIndex)}
          />
        )}

        {!caseOpen && (
          <div
            className="pointer-events-none absolute right-6 top-1/2 z-20 hidden h-32 w-px -translate-y-1/2 bg-champagne/10 md:right-10 md:block"
            aria-hidden="true"
          >
            <div
              className="w-px origin-top bg-champagne/50 transition-[height] duration-300"
              style={{
                height: `${Math.min(1, Math.max(0.08, railProgress)) * 100}%`,
              }}
            />
          </div>
        )}

        {caseOpen && (
          <CaseStudyView project={caseProject} onClose={closeCase} />
        )}
      </div>
    </section>
  );
}
