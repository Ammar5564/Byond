"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { heroShowcase, type HeroShot } from "@/lib/content";
import { blurFor } from "@/lib/img";
import { imageMeta } from "@/lib/imageMeta";

/** Native aspect ratio of a hero photo (used on desktop, where photos are shown whole). */
function ratioOf(shot: HeroShot) {
  const m = imageMeta[shot.image];
  return m ? m.w / m.h : 2 / 3;
}

type Frame = "none" | "white" | "gold" | "wine";

const FRAME: Record<Frame, string> = {
  none: "ring-1 ring-white/10",
  white: "border-[3px] border-white/95",
  gold: "border-2 border-gold",
  wine: "border-2 border-wine",
};

/**
 * One framed photo. No caption — the photo speaks for itself.
 * The frame (white / gold / wine) is the accent the reference hero used.
 */
export function HeroPhoto({
  shot,
  sizes,
  priority,
  frame = "none",
}: {
  shot: HeroShot;
  sizes: string;
  priority?: boolean;
  frame?: Frame;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[14px] bg-night shadow-[0_30px_60px_-22px_rgba(0,0,0,0.85)] sm:rounded-[18px] ${FRAME[frame]}`}
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Laptop (>= lg): photos float around the headline                    */
/* ------------------------------------------------------------------ */

/**
 * Every photo sits OUTSIDE the text block (checked by script at 1024 … 2560 wide).
 * Widths are in "u" units where u = min(1vw, 1.6svh), so cards shrink on short or
 * ultra-wide windows. x = distance from the chosen side in % of the hero width
 * (negative = bleeds off the edge), top in % of the hero height.
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
  frame?: Frame;
  opacity?: number;
  z?: number;
  priority?: boolean;
};

const SLOTS: Slot[] = [
  { id: "kareem-stage", side: "left", x: 2.4, top: 13, w: 19, depth: 0.9, rot: -2.5, dur: 9, delay: 0, frame: "white", z: 3, priority: true },
  { id: "jewelry", side: "left", x: 21.4, top: 3, w: 10.6, depth: 0.5, rot: 3, dur: 8, delay: 0.8, frame: "gold", z: 2 },
  { id: "studio", side: "left", x: -1.2, top: 63, w: 16.5, depth: 0.7, rot: 2, dur: 10, delay: 1.4, z: 2, opacity: 0.92 },
  { id: "clinics", side: "left", x: 21.2, top: 64, w: 11.8, depth: 0.4, rot: -3, dur: 8.5, delay: 0.4, frame: "wine", z: 3 },
  { id: "cosmetics", side: "right", x: 2.8, top: 10, w: 14.5, depth: 0.9, rot: 2.5, dur: 9.5, delay: 0.6, frame: "white", z: 3, priority: true },
  { id: "real-estate", side: "right", x: 18.6, top: 3, w: 10.6, depth: 0.5, rot: -3, dur: 8, delay: 1.1, z: 2, opacity: 0.85 },
  { id: "construction", side: "right", x: 4.6, top: 59, w: 13, depth: 0.7, rot: -2, dur: 10.5, delay: 0.2, frame: "gold", z: 3 },
  { id: "corporate", side: "right", x: 20.4, top: 67, w: 11.8, depth: 0.4, rot: 3, dur: 9, delay: 1.7, z: 2, opacity: 0.88 },
  { id: "interiors", side: "left", x: 45.5, top: 80, w: 9, depth: 0.3, rot: -1.5, dur: 11, delay: 0.9, frame: "wine", z: 2 },
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
          zIndex: slot.z ?? 1,
          opacity: slot.opacity ?? 1,
          ["--depth" as string]: slot.depth,
          ["--rot" as string]: `${slot.rot}deg`,
          ["--dur" as string]: `${slot.dur}s`,
          ["--delay" as string]: `-${slot.delay * 3}s`,
        };
        return (
          <div
            key={slot.id}
            className={`hero-card-outer absolute ${slot.id === "interiors" ? "hero-slot-interiors" : ""} ${slot.id === "clinics" || slot.id === "corporate" ? "max-xl:hidden" : ""}`}
            style={style}
          >
            <div className="hero-card-inner h-full w-full">
              <HeroPhoto
                shot={shot}
                sizes="(min-width:1024px) 20vw, 200px"
                priority={slot.priority}
                frame={slot.frame}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone / tablet (< lg): the layered-frames composition               */
/* ------------------------------------------------------------------ */

/**
 * A stack of overlapping, slightly rotated frames above the headline and another
 * below it — some framed in white / gold / wine, some translucent so they ghost
 * through the ones in front, some bleeding off the screen edge.
 *
 * Everything is measured in "v" = min(1vw, 0.5svh): the design canvas is 100v wide
 * × 200v tall, centred, so the whole composition scales with the screen instead of
 * reflowing. x = left edge of the card relative to the screen centre; `top` is
 * measured from the top of the hero, `bottom` from the bottom. Each cluster stays
 * inside ~66v of its edge so the text block in the middle (≈ 70v … 130v) is never
 * touched.
 */
type StackCard = {
  id: string;
  x: number;
  top?: number;
  bottom?: number;
  w: number; // v
  ratio: number; // width / height of the FRAME (the photo is cropped to it)
  rot: number;
  dur: number;
  delay: number;
  z: number;
  frame?: Frame;
  opacity?: number;
  priority?: boolean;
};

const STACK: StackCard[] = [
  // — above the headline —
  { id: "studio", x: -56, top: -3, w: 58, ratio: 4 / 3, rot: -3, dur: 10, delay: 1.4, z: 1, priority: true },
  { id: "real-estate", x: 28, top: -8, w: 26, ratio: 3 / 4, rot: -3, dur: 8, delay: 1.1, z: 0, opacity: 0.55 },
  { id: "kareem-stage", x: -21, top: 11, w: 37, ratio: 3 / 4, rot: 1, dur: 9, delay: 0, z: 3, frame: "white", priority: true },
  { id: "cosmetics", x: 12, top: 13, w: 38, ratio: 3 / 4, rot: 2.5, dur: 9.5, delay: 0.6, z: 4, opacity: 0.88, priority: true },
  // — below the headline —
  { id: "clinics", x: -56, bottom: 6, w: 54, ratio: 4 / 3, rot: 2, dur: 8.5, delay: 0.4, z: 1, priority: true },
  { id: "corporate", x: -30, bottom: -8, w: 34, ratio: 1, rot: -2, dur: 9, delay: 1.7, z: 2 },
  { id: "jewelry", x: -10, bottom: 2, w: 36, ratio: 3 / 4, rot: 2, dur: 8, delay: 0.8, z: 4, frame: "gold" },
  { id: "construction", x: 14, bottom: 12, w: 40, ratio: 3 / 4, rot: -2, dur: 10.5, delay: 0.2, z: 3, opacity: 0.85 },
  { id: "interiors", x: 26, bottom: -6, w: 28, ratio: 1, rot: 3, dur: 11, delay: 0.9, z: 2, frame: "wine" },
];

export function HeroStack() {
  const byId = new Map(heroShowcase.map((s) => [s.id, s]));

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{ ["--v" as string]: "min(1vw, 0.5svh)" }}
      aria-hidden="false"
    >
      {STACK.map((c) => {
        const shot = byId.get(c.id);
        if (!shot) return null;
        const style: CSSProperties = {
          left: `calc(50% + var(--v) * ${c.x})`,
          width: `calc(var(--v) * ${c.w})`,
          aspectRatio: String(c.ratio),
          zIndex: c.z,
          opacity: c.opacity ?? 1,
          ["--rot" as string]: `${c.rot}deg`,
          ["--dur" as string]: `${c.dur}s`,
          ["--delay" as string]: `-${c.delay * 3}s`,
        };
        if (c.top !== undefined) style.top = `calc(var(--v) * ${c.top})`;
        if (c.bottom !== undefined) style.bottom = `calc(var(--v) * ${c.bottom})`;
        return (
          <div key={c.id} className="absolute" style={style}>
            <div className="hero-card-inner h-full w-full">
              <HeroPhoto
                shot={shot}
                sizes="(min-width:768px) 40vw, 58vw"
                priority={c.priority}
                frame={c.frame}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
