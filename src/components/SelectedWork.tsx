"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { selectedWork, type WorkItem } from "@/lib/content";
import {
  WorksTunnelCanvasClient,
  type TunnelApi,
} from "./WorksTunnelCanvasClient";
import { VideoModal } from "./VideoModal";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8.25 5.75v12.5L19 12 8.25 5.75z" />
    </svg>
  );
}

function TunnelOverlay({
  project,
  proximity,
  total,
  onPlay,
}: {
  project: WorkItem;
  proximity: number;
  total: number;
  onPlay: () => void;
}) {
  const opacity = 0.35 + proximity * 0.65;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between py-8 text-champagne md:py-12"
      aria-live="polite"
    >
      <div
        className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 transition-opacity duration-500 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-6 md:px-10"
        style={{ opacity }}
      >
        <div className="min-w-0 pr-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-champagne/50">
            Selected Work
          </p>
          <h2 className="display-heading mt-3 max-w-xl text-balance break-words text-3xl leading-[0.95] text-champagne md:text-4xl lg:text-5xl">
            Stories in motion
          </h2>
        </div>
        <span className="shrink-0 font-sans text-[11px] tracking-[0.2em] text-champagne/45 tabular-nums">
          {project.id} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity }}
      >
        <button
          type="button"
          onClick={onPlay}
          className="group pointer-events-auto"
          aria-label={`Play ${project.title}`}
        >
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-champagne/35 bg-ink/55 text-champagne shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur-none transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20 md:backdrop-blur-sm">
            <PlayIcon className="ml-1 h-7 w-7 md:h-8 md:w-8" />
          </span>
        </button>
      </div>

      <div
        className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 transition-opacity duration-500 sm:px-6 md:flex-row md:items-end md:justify-between md:px-10"
        style={{ opacity }}
      >
        <div className="max-w-lg">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="editorial-tag">{project.category}</span>
            <span className="editorial-tag tabular-nums">
              [ {project.duration} ]
            </span>
          </div>
          <h3 className="display-heading mt-3 text-balance break-words text-[clamp(2rem,5vw,3.75rem)] leading-[0.92] text-champagne">
            {project.title}
          </h3>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed tracking-wide text-champagne/55 md:text-base">
            {project.client}
          </p>
        </div>

        <div className="pointer-events-auto flex items-end gap-8">
          <button
            type="button"
            onClick={onPlay}
            className="editorial-cta group"
          >
            Play film
            <span className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function WorksMobileCard({
  item,
  index,
  onPlay,
}: {
  item: WorkItem;
  index: number;
  onPlay: (index: number) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="works-card group relative w-full min-w-0 max-w-full"
      initial={reduceMotion ? false : { opacity: 0.45, scale: 0.96, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.35, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={() => onPlay(index)}
        className="block w-full min-w-0 max-w-full text-left"
        aria-label={`Play ${item.title}`}
      >
        <div className="relative aspect-video w-full max-w-full overflow-hidden bg-ink/80">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 340px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.02]"
          />
          {/* Sleek dark grade + vignette */}
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,10,0.55)_100%)]"
            aria-hidden="true"
          />

          {/* Crisp play badge */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne/50 bg-ink/70 text-champagne shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-none transition-transform duration-300 group-hover:scale-110 group-active:scale-105 md:h-16 md:w-16">
              <PlayIcon className="ml-0.5 h-6 w-6 drop-shadow-sm md:h-7 md:w-7" />
            </span>
          </span>
        </div>

        <div className="mt-4 min-w-0 max-w-full">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="editorial-tag">{item.category}</span>
            <span className="editorial-tag tabular-nums">
              [ {item.duration} ]
            </span>
          </div>
          <h3 className="display-heading mt-2 text-balance break-words text-2xl leading-[0.95] text-champagne md:text-[1.75rem]">
            {item.title}
          </h3>
          <p className="mt-1 break-words font-sans text-sm tracking-wide text-champagne/55">
            {item.client}
          </p>
        </div>
      </button>
    </motion.article>
  );
}

function WorksCardsShell({
  onPlay,
}: {
  onPlay: (index: number) => void;
}) {
  return (
    <div className="works-cards-shell bg-ink px-4 pb-16 pt-12 max-md:overflow-x-hidden sm:px-6 md:pt-20 lg:hidden">
      <div className="mx-auto w-full min-w-0 max-w-[1400px]">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-champagne/50">
          Selected Work
        </p>
        <h2 className="display-heading mt-3 text-balance break-words text-3xl leading-[0.95] text-champagne md:text-4xl">
          Stories in motion
        </h2>
      </div>

      <div className="works-card-list mx-auto mt-10 flex w-full min-w-0 max-w-[1400px] flex-col gap-6 touch-pan-y max-md:w-full max-md:max-w-full md:grid md:grid-cols-2 md:gap-8">
        {selectedWork.map((item, index) => (
          <WorksMobileCard
            key={item.id}
            item={item}
            index={index}
            onPlay={onPlay}
          />
        ))}
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
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

  const onActiveChange = useCallback((index: number, prox: number) => {
    setActiveIndex(index);
    setProximity(prox);
  }, []);

  const openVideo = useCallback((index: number) => {
    const item = selectedWork[index];
    if (!item) return;
    setActiveYoutubeId(item.youtubeId);
  }, []);

  const onSelect = useCallback(
    (index: number) => {
      openVideo(index);
    },
    [openVideo]
  );

  // Desktop only: ScrollTrigger pin + tunnel scrub (no mobile scroll-lock)
  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let pinTrigger: { kill: () => void } | null = null;
    let cancelled = false;

    async function setup() {
      pinTrigger?.kill();
      pinTrigger = null;
      if (cancelled || !mq.matches || !section || !pin) return;

      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !mq.matches) return;

      pinTrigger = ScrollTrigger.create({
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
    }

    setup();
    mq.addEventListener("change", setup);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", setup);
      pinTrigger?.kill();
    };
  }, []);

  const project = selectedWork[activeIndex] ?? selectedWork[0];
  const playingTitle =
    selectedWork.find((w) => w.youtubeId === activeYoutubeId)?.title ??
    project.title;
  const railProgress =
    (activeIndex + proximity * 0.15) / Math.max(1, selectedWork.length - 1);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative scroll-mt-[var(--nav-height)] touch-pan-y symphony-void"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <WorksCardsShell onPlay={openVideo} />

      <div
        ref={pinRef}
        className="relative hidden h-screen w-full overflow-hidden bg-ink gpu-accelerate touch-pan-y lg:block"
        style={{ WebkitOverflowScrolling: "touch" }}
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

        <TunnelOverlay
          project={project}
          proximity={proximity}
          total={selectedWork.length}
          onPlay={() => openVideo(activeIndex)}
        />

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
      </div>

      <VideoModal
        youtubeId={activeYoutubeId}
        title={playingTitle}
        onClose={() => setActiveYoutubeId(null)}
      />
    </section>
  );
}
