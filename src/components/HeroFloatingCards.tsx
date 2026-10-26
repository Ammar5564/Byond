"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { heroShowcase, type HeroShot } from "@/lib/content";
import { blurFor } from "@/lib/img";
import { imageMeta } from "@/lib/imageMeta";

/** Native aspect ratio of a hero photo (used on laptop, where photos are shown whole). */
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
 * Every photo sits OUTSIDE the text block (checked by script at 1024 … 2560 wide);
 * photos may overlap each other and bleed off the screen edge, like the reference.
 * Widths are in "u" units where u = min(1vw, 1.6svh), so cards also shrink on short
 * or ultra-wide windows. x = distance from the chosen side in % of the hero width
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
  // tall pair beside the headline
  { id: "kareem-stage", side: "left", x: 1.6, top: 11, w: 22, depth: 0.9, rot: -2.5, dur: 10, delay: 0, frame: "white", z: 4, priority: true },
  { id: "cosmetics", side: "right", x: 2.2, top: 9, w: 17, depth: 0.9, rot: 2.5, dur: 11, delay: 0.6, frame: "white", z: 4, priority: true },
  // above the headline
  { id: "jewelry", side: "left", x: 21.6, top: -3, w: 11.4, depth: 0.5, rot: 3, dur: 9, delay: 0.8, frame: "gold", z: 3 },
  { id: "real-estate", side: "right", x: 19.4, top: -3, w: 11.4, depth: 0.5, rot: -3, dur: 9.5, delay: 1.1, z: 2, opacity: 0.88 },
  // below the headline
  { id: "studio", side: "left", x: -2.2, top: 66, w: 19, depth: 0.7, rot: 2, dur: 11, delay: 1.4, z: 2, opacity: 0.94 },
  { id: "clinics", side: "left", x: 13.2, top: 69, w: 13.5, depth: 0.4, rot: -3, dur: 9.5, delay: 0.4, frame: "wine", z: 3 },
  { id: "construction", side: "right", x: -1.4, top: 63, w: 15, depth: 0.7, rot: -2, dur: 11.5, delay: 0.2, frame: "gold", z: 3 },
  { id: "corporate", side: "right", x: 13.4, top: 70, w: 14, depth: 0.4, rot: 3, dur: 10, delay: 1.7, z: 2, opacity: 0.9 },
  { id: "interiors", side: "left", x: 45.5, top: 80, w: 9, depth: 0.3, rot: -1.5, dur: 12, delay: 0.9, frame: "wine", z: 2 },
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
            <div className="hero-card-scroll h-full w-full">
              <div className="hero-card-inner h-full w-full">
                <HeroPhoto
                  shot={shot}
                  sizes="(min-width:1024px) 24vw, 200px"
                  priority={slot.priority}
                  frame={slot.frame}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone / tablet (< lg): layered frames above and below the headline  */
/* ------------------------------------------------------------------ */

/**
 * The reference hero's composition: a pile of overlapping, slightly rotated frames
 * above the headline and another below it — some framed in white / gold / wine,
 * some translucent so they ghost through the ones in front, some bleeding off the
 * screen edge.
 *
 * Each pile lives in its own grid row (the hero is a 1fr / auto / 1fr grid) and is
 * sized with container-query units, so it always fills exactly the space between
 * the screen edge and the text — as big as it can be on any phone or tablet,
 * and it can never touch the text. Design canvas: 88u wide × 72u tall, where
 * u = min(width / 88, height / 72) of the row.
 *
 * x = left edge relative to the row's centre; `near` = distance from the edge of the
 * row that touches the text (the top pile grows upward, the bottom pile downward).
 */
type PileCard = {
  id: string;
  x: number;
  near: number;
  w: number; // u
  ratio: number; // width / height of the FRAME (the photo is cropped to it)
  rot: number;
  dur: number;
  delay: number;
  z: number;
  depth: number;
  frame?: Frame;
  opacity?: number;
  priority?: boolean;
};

const TOP_PILE: PileCard[] = [
  { id: "studio", x: -50, near: 20, w: 54, ratio: 4 / 3, rot: -3, dur: 11, delay: 1.4, z: 1, depth: 0.4, priority: true },
  { id: "real-estate", x: 24, near: 34, w: 26, ratio: 3 / 4, rot: -3, dur: 9, delay: 1.1, z: 0, depth: 0.3, opacity: 0.55 },
  { id: "kareem-stage", x: -17, near: 2, w: 36, ratio: 3 / 4, rot: 1, dur: 10, delay: 0, z: 3, depth: 0.9, frame: "white", priority: true },
  { id: "cosmetics", x: 13, near: 6, w: 36, ratio: 3 / 4, rot: 2.5, dur: 10.5, delay: 0.6, z: 4, depth: 0.7, opacity: 0.9, priority: true },
];

const BOTTOM_PILE: PileCard[] = [
  { id: "clinics", x: -50, near: 8, w: 52, ratio: 4 / 3, rot: 2, dur: 9.5, delay: 0.4, z: 1, depth: 0.4 },
  { id: "jewelry", x: -10, near: 4, w: 34, ratio: 3 / 4, rot: 2, dur: 9, delay: 0.8, z: 4, depth: 0.9, frame: "gold" },
  { id: "construction", x: 17, near: 14, w: 36, ratio: 3 / 4, rot: -2, dur: 11.5, delay: 0.2, z: 3, depth: 0.7, opacity: 0.88 },
  { id: "corporate", x: -34, near: 28, w: 30, ratio: 1, rot: -2, dur: 10, delay: 1.7, z: 2, depth: 0.3 },
  { id: "interiors", x: 4, near: 38, w: 28, ratio: 1, rot: 3, dur: 12, delay: 0.9, z: 2, depth: 0.5, frame: "wine" },
];

export function HeroPile({ edge }: { edge: "top" | "bottom" }) {
  const byId = new Map(heroShowcase.map((s) => [s.id, s]));
  const cards = edge === "top" ? TOP_PILE : BOTTOM_PILE;

  return (
    <div className="pointer-events-none relative min-h-0 [container-type:size] lg:hidden">
      <div
        className="absolute inset-0"
        style={{
          ["--u" as string]: "min(calc(100cqw / 88), calc(100cqh / 72))",
        }}
      >
        {cards.map((c) => {
          const shot = byId.get(c.id);
          if (!shot) return null;
          const style: CSSProperties = {
            left: `calc(50% + var(--u) * ${c.x})`,
            width: `calc(var(--u) * ${c.w})`,
            aspectRatio: String(c.ratio),
            zIndex: c.z,
            opacity: c.opacity ?? 1,
            ["--depth" as string]: c.depth,
            ["--rot" as string]: `${c.rot}deg`,
            ["--dur" as string]: `${c.dur}s`,
            ["--delay" as string]: `-${c.delay * 3}s`,
          };
          if (edge === "top") style.bottom = `calc(var(--u) * ${c.near})`;
          else style.top = `calc(var(--u) * ${c.near})`;
          return (
            <div key={c.id} className="absolute" style={style}>
              <div className="hero-card-scroll h-full w-full">
                <div className="hero-card-inner h-full w-full">
                  <HeroPhoto
                    shot={shot}
                    sizes="(min-width:768px) 44vw, 62vw"
                    priority={c.priority}
                    frame={c.frame}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
