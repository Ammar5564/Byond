"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

      {/* Active card play affordance — DOM overlay (WebGL planes can't host CSS hover) */}
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
      <div
        ref={pinRef}
        className="relative h-screen w-full touch-pan-y overflow-hidden bg-ink gpu-accelerate"
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

        <VideoModal
          youtubeId={activeYoutubeId}
          title={playingTitle}
          onClose={() => setActiveYoutubeId(null)}
        />
      </div>
    </section>
  );
}
