"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { heroShowcase, type HeroShot } from "@/lib/content";
import { blurFor } from "@/lib/img";

/**
 * Desktop composition. Every card is placed OUTSIDE the headline zone so text
 * and photos never overlap. Sizes use min(vw, svh) so cards shrink on very
 * wide / short screens instead of growing into the headline.
 *
 * w   = width in vw at a 16:10 screen (svh cap = w * 1.6)
 * pos = left/right + top, in % of the hero box
 */
type Slot = {
  id: string;
  side: "left" | "right";
  x: number;
  top: number;
  w: number;
  aspect: string; // css aspect-ratio  w / h
  depth: number; // parallax strength 0..1
  rot: number; // deg
  dur: number; // float seconds
  delay: number;
  priority?: boolean;
};

const SLOTS: Slot[] = [
  { id: "kareem-stage", side: "left", x: 3, top: 15, w: 17, aspect: "2 / 3", depth: 0.9, rot: -2.5, dur: 9, delay: 0, priority: true },
  { id: "jewelry", side: "left", x: 22, top: 6, w: 9.5, aspect: "9 / 16", depth: 0.5, rot: 3, dur: 8, delay: 0.8 },
  { id: "studio", side: "left", x: 6, top: 62, w: 14.5, aspect: "4 / 5", depth: 0.7, rot: 2, dur: 10, delay: 1.4 },
  { id: "clinics", side: "left", x: 23, top: 70, w: 10, aspect: "2 / 3", depth: 0.4, rot: -3, dur: 8.5, delay: 0.4 },
  { id: "cosmetics", side: "right", x: 3, top: 11, w: 14, aspect: "9 / 16", depth: 0.9, rot: 2.5, dur: 9.5, delay: 0.6, priority: true },
  { id: "real-estate", side: "right", x: 20, top: 6, w: 9.5, aspect: "9 / 16", depth: 0.5, rot: -3, dur: 8, delay: 1.1 },
  { id: "construction", side: "right", x: 5.5, top: 56, w: 12, aspect: "9 / 16", depth: 0.7, rot: -2, dur: 10.5, delay: 0.2 },
  { id: "corporate", side: "right", x: 21, top: 69, w: 10.5, aspect: "2 / 3", depth: 0.4, rot: 3, dur: 9, delay: 1.7 },
  { id: "interiors", side: "left", x: 45.5, top: 77, w: 9, aspect: "3 / 4", depth: 0.3, rot: -1.5, dur: 11, delay: 0.9 },
];

function Label({ children }: { children: string }) {
  return (
    <span className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-burgundy">
      {children}
    </span>
  );
}

export function HeroPhoto({
  shot,
  sizes,
  priority,
  className = "",
}: {
  shot: HeroShot;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[18px] bg-sand shadow-[0_30px_60px_-26px_rgba(60,10,25,0.5)] ring-1 ring-white/70 ${className}`}
    >
      <Image
        src={shot.image}
        alt={shot.alt}
        fill
        sizes={sizes}
        quality={80}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurFor(shot.image)}
        className="object-cover"
        draggable={false}
      />
      <Label>{shot.label}</Label>
    </div>
  );
}

export function HeroFloatingCards() {
  const byId = new Map(heroShowcase.map((s) => [s.id, s]));

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {SLOTS.map((slot) => {
        const shot = byId.get(slot.id);
        if (!shot) return null;
        const style: CSSProperties = {
          [slot.side]: `${slot.x}%`,
          top: `${slot.top}%`,
          width: `min(${slot.w}vw, ${(slot.w * 1.6).toFixed(1)}svh)`,
          aspectRatio: slot.aspect,
          ["--depth" as string]: slot.depth,
          ["--rot" as string]: `${slot.rot}deg`,
          ["--dur" as string]: `${slot.dur}s`,
          ["--delay" as string]: `-${slot.delay * 3}s`,
        };
        return (
          <div
            key={slot.id}
            className={`hero-card-outer absolute ${slot.id === "interiors" ? "hero-slot-interiors" : ""}`}
            style={style}
          >
            <div className="hero-card-inner h-full w-full">
              <HeroPhoto
                shot={shot}
                sizes="(min-width:1280px) 18vw, 200px"
                priority={slot.priority}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Phone / tablet: two slow opposite-direction rows (no overlap possible). */
export function HeroMarquee() {
  const first = heroShowcase;
  const second = [...heroShowcase.slice(4), ...heroShowcase.slice(0, 4)].reverse();

  const Row = ({
    shots,
    reverse,
  }: {
    shots: HeroShot[];
    reverse?: boolean;
  }) => {
    const doubled = [...shots, ...shots];
    return (
      <div className="marquee-mask overflow-hidden">
        <div
          className={`marquee-track flex w-max gap-3 sm:gap-4 ${
            reverse ? "animate-marquee-slow-reverse" : "animate-marquee-slow"
          }`}
        >
          {doubled.map((shot, i) => (
            <div
              key={`${shot.id}-${i}`}
              className="aspect-[3/4] shrink-0"
              style={{ height: "clamp(190px, 27svh, 300px)" }}
              aria-hidden={i >= shots.length ? true : undefined}
            >
              <HeroPhoto
                shot={shot}
                sizes="260px"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Row shots={first} />
      <Row shots={second} reverse />
    </div>
  );
}
