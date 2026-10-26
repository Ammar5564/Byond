"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { heroShowcase, type HeroShot } from "@/lib/content";
import { blurFor } from "@/lib/img";
import { imageMeta } from "@/lib/imageMeta";

/** Native aspect ratio of a hero photo, so it is always shown whole (never cropped). */
function ratioOf(shot: HeroShot) {
  const m = imageMeta[shot.image];
  return m ? m.w / m.h : 2 / 3;
}

/**
 * One photo. The wrapper takes the photo's own aspect ratio, so `object-cover`
 * never has anything to cut off. No caption — the photo speaks for itself.
 */
export function HeroPhoto({
  shot,
  sizes,
  priority,
}: {
  shot: HeroShot;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-sand shadow-[0_30px_60px_-26px_rgba(60,10,25,0.5)] ring-1 ring-white/70 sm:rounded-[18px]">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop (>= xl): photos float around the headline                   */
/* ------------------------------------------------------------------ */

/**
 * Every photo is placed OUTSIDE the text block. Widths are in "u" units where
 * u = min(1vw, 1.6svh), so cards also shrink on short / ultra-wide windows.
 * x = distance from the chosen side in % of the hero width, top in % of height.
 */
type Slot = {
  id: string;
  side: "left" | "right";
  x: number;
  top: number;
  w: number; // in u
  depth: number; // parallax strength 0..1
  rot: number; // deg
  dur: number; // float seconds
  delay: number;
  priority?: boolean;
};

const SLOTS: Slot[] = [
  { id: "kareem-stage", side: "left", x: 2.2, top: 13, w: 19, depth: 0.9, rot: -2.5, dur: 9, delay: 0, priority: true },
  { id: "jewelry", side: "left", x: 23.2, top: 4, w: 11.2, depth: 0.5, rot: 3, dur: 8, delay: 0.8 },
  { id: "studio", side: "left", x: 4.5, top: 64, w: 15.5, depth: 0.7, rot: 2, dur: 10, delay: 1.4 },
  { id: "clinics", side: "left", x: 21.2, top: 64, w: 11.8, depth: 0.4, rot: -3, dur: 8.5, delay: 0.4 },
  { id: "cosmetics", side: "right", x: 2.6, top: 10, w: 14.5, depth: 0.9, rot: 2.5, dur: 9.5, delay: 0.6, priority: true },
  { id: "real-estate", side: "right", x: 20.4, top: 4, w: 11.2, depth: 0.5, rot: -3, dur: 8, delay: 1.1 },
  { id: "construction", side: "right", x: 5, top: 59, w: 13, depth: 0.7, rot: -2, dur: 10.5, delay: 0.2 },
  { id: "corporate", side: "right", x: 20.4, top: 67, w: 11.8, depth: 0.4, rot: 3, dur: 9, delay: 1.7 },
  { id: "interiors", side: "left", x: 45.5, top: 78, w: 9, depth: 0.3, rot: -1.5, dur: 11, delay: 0.9 },
];

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
          width: `calc(min(1vw, 1.6svh) * ${slot.w})`,
          aspectRatio: String(ratioOf(shot)),
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
                sizes="(min-width:1280px) 20vw, 200px"
                priority={slot.priority}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone / tablet (< xl): the same floating photos, as a collage       */
/* ------------------------------------------------------------------ */

/**
 * Same ingredients as desktop — whole photos, gently floating at slightly
 * different angles and speeds — arranged as a staggered two- (phone) or
 * three-column (tablet) collage under the headline. CSS multi-column keeps the
 * columns balanced for any photo ratio, and every photo is shown in full.
 *
 * `tweak` nudges single cards (narrower + pushed to one side, extra top gap) so
 * the columns never read as a rigid grid.
 */
const COLLAGE: Array<{
  id: string;
  rot: number;
  dur: number;
  delay: number;
  tweak: string;
}> = [
  { id: "kareem-stage", rot: -1.5, dur: 9, delay: 0, tweak: "" },
  { id: "cosmetics", rot: 1.5, dur: 9.5, delay: 0.6, tweak: "mt-[9vw] sm:mt-0" },
  { id: "interiors", rot: -1, dur: 11, delay: 0.9, tweak: "w-[88%] sm:w-full" },
  { id: "jewelry", rot: -1.5, dur: 8, delay: 0.8, tweak: "" },
  { id: "studio", rot: 1.2, dur: 10, delay: 1.4, tweak: "w-[90%] ml-auto sm:w-full" },
  { id: "construction", rot: -1.2, dur: 10.5, delay: 0.2, tweak: "w-[92%] sm:w-full" },
  { id: "clinics", rot: 1.8, dur: 8.5, delay: 0.4, tweak: "" },
  { id: "real-estate", rot: -1.8, dur: 8, delay: 1.1, tweak: "w-[92%] ml-auto sm:w-full" },
  { id: "corporate", rot: 1.2, dur: 9, delay: 1.7, tweak: "" },
];

export function HeroCollage() {
  const byId = new Map(heroShowcase.map((s) => [s.id, s]));

  return (
    <div className="mx-auto w-full max-w-[1100px] columns-2 gap-x-[4vw] px-[4vw] sm:columns-3 sm:gap-x-5 sm:px-8 lg:columns-4">
      {COLLAGE.map((c, i) => {
        const shot = byId.get(c.id);
        if (!shot) return null;
        const style: CSSProperties = {
          aspectRatio: String(ratioOf(shot)),
          ["--rot" as string]: `${c.rot}deg`,
          ["--dur" as string]: `${c.dur}s`,
          ["--delay" as string]: `-${c.delay * 3}s`,
        };
        return (
          <div
            key={c.id}
            className={`mb-[4vw] break-inside-avoid sm:mb-5 ${c.tweak}`}
          >
            <div className="hero-card-inner" style={style}>
              <HeroPhoto
                shot={shot}
                sizes="(min-width:640px) 31vw, 46vw"
                priority={i < 2}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
