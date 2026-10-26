"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { heroShowcase } from "@/lib/content";
import { blurFor } from "@/lib/img";

type Frame = "none" | "gold" | "ivory" | "rose";

const FRAME: Record<Frame, string> = {
  none: "border border-white/10",
  gold: "border-2 border-gold",
  ivory: "border-4 border-snow",
  rose: "border-2 border-rose",
};

/**
 * Same composition as the previous (old) hero: ten framed photos scattered around the
 * headline, big enough to overlap each other, some translucent so the photo behind shows
 * through, some bleeding off the screen edge. Same layout on phone and laptop.
 *
 * Geometry is ported from the old site (positions in % of the hero, widths that grow
 * phone → tablet → laptop). On laptop widths are in "u" units (u = min(1vw, 1.6svh)) so the
 * photos also shrink on short windows. Frame colours are picked for the current photos
 * (gold, ivory, rose) instead of the old orange / purple.
 *
 * DOM order = stacking order (later cards sit on top), exactly like the old hero.
 */
type Card = {
  n: string; // old card number, for reference
  photo: string; // heroShowcase id
  /** position, % of the hero: exactly one of left/right and one of top/bottom (or centre) */
  left?: number;
  right?: number;
  /** laptop-only override of `right` so the card clears the headline */
  rightLg?: number;
  top?: number;
  bottom?: number;
  center?: boolean;
  /** phone: min(vw, px) · tablet: px · laptop: u multiplier */
  vw: number;
  px: number;
  md: number;
  k: number;
  ratio: number; // width / height of the frame
  frame?: Frame;
  opacity?: number;
  rot?: number;
  depth: number; // parallax strength 0..1
  dur: number;
  delay: number;
  /** phone/tablet: keep the frame clear of the headline on short screens */
  capped?: boolean;
  phoneHidden?: boolean;
  priority?: boolean;
  focus?: string; // object-position for the crop
};

const CARDS: Card[] = [
  { n: "01", photo: "studio", left: -6, top: 8, vw: 42, px: 240, md: 238, k: 25, ratio: 4 / 3, rot: -3, depth: 0.3, dur: 9.6, delay: 0, priority: true, capped: true },
  { n: "02", photo: "jewelry", left: -4, bottom: 5, vw: 40, px: 220, md: 221, k: 22.2, ratio: 3 / 4, rot: 2, depth: 0.3, dur: 8.6, delay: 0.5, capped: true },
  { n: "03", photo: "interiors", left: 16, top: -4, vw: 40, px: 220, md: 221, k: 22.2, ratio: 1, frame: "gold", depth: 1, dur: 7.7, delay: 1.1, priority: true },
  { n: "04", photo: "clinics", left: 18, bottom: -8, vw: 42, px: 240, md: 238, k: 23.6, ratio: 4 / 3, depth: 0.6, dur: 6.8, delay: 1.6 },
  { n: "05", photo: "corporate", center: true, top: -6, vw: 36, px: 200, md: 204, k: 19.4, ratio: 1.8, depth: 0.25, dur: 6, delay: 2.2, phoneHidden: true },
  { n: "06", photo: "studio", center: true, bottom: -10, vw: 38, px: 210, md: 204, k: 20.8, ratio: 1.3, depth: 0.5, dur: 6.9, delay: 2.7, phoneHidden: true, focus: "50% 60%" },
  { n: "07", photo: "kareem-stage", right: 16, rightLg: 2.5, top: 4, vw: 42, px: 240, md: 238, k: 23.6, ratio: 3 / 4, frame: "ivory", depth: 1, dur: 7.8, delay: 3.3, priority: true, capped: true },
  { n: "08", photo: "cosmetics", right: 18, rightLg: 4, bottom: 2, vw: 40, px: 220, md: 221, k: 22.2, ratio: 3 / 4, frame: "rose", depth: 1, dur: 8.7, delay: 3.8, priority: true, capped: true },
  { n: "09", photo: "construction", right: -6, rightLg: -12, top: 14, vw: 40, px: 220, md: 221, k: 22.2, ratio: 3 / 4, opacity: 0.7, depth: 0.15, dur: 9.6, delay: 4.4, capped: true },
  { n: "10", photo: "real-estate", right: -5, rightLg: -10, bottom: 10, vw: 42, px: 240, md: 238, k: 23.6, ratio: 1, opacity: 0.6, depth: 0.2, dur: 6.4, delay: 4.9, capped: true },
];

export function HeroCards() {
  const byId = new Map(heroShowcase.map((s) => [s.id, s]));

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {CARDS.map((c) => {
        const shot = byId.get(c.photo);
        if (!shot) return null;
        const style: CSSProperties = {
          ["--vw" as string]: `${c.vw}vw`,
          ["--px" as string]: `${c.px}px`,
          ["--md" as string]: `${c.md}px`,
          ["--k" as string]: c.k,
          ["--depth" as string]: c.depth,
          ["--rot" as string]: `${c.rot ?? 0}deg`,
          ["--dur" as string]: `${c.dur}s`,
          ["--delay" as string]: `-${c.delay * 2}s`,
          aspectRatio: String(c.ratio),
          opacity: c.opacity ?? 1,
        };
        if (c.capped) {
          // height available between the screen edge and the headline block (≈ 124px either side of centre)
          const edge = c.top ?? c.bottom ?? 0;
          (style as Record<string, string>)["--cap"] = `calc((${50 - edge}svh - 124px) * ${c.ratio})`;
        }
        if (c.left !== undefined) style.left = `${c.left}%`;
        if (c.right !== undefined) {
          (style as Record<string, string>)["--r"] = `${c.right}%`;
          (style as Record<string, string>)["--rlg"] = `${c.rightLg ?? c.right}%`;
        }
        if (c.top !== undefined) style.top = `${c.top}%`;
        if (c.bottom !== undefined) style.bottom = `${c.bottom}%`;
        if (c.center) {
          style.left = "50%";
          style.marginLeft = "calc(var(--w) / -2)";
        }

        return (
          <div
            key={c.n}
            className={`hero-card hero-card-outer absolute ${c.right !== undefined ? "hero-card-r" : ""} ${c.phoneHidden ? "max-md:hidden" : ""}`}
            style={style}
          >
            <div className="hero-card-scroll h-full w-full">
              <div className="hero-card-inner h-full w-full">
                <div
                  className={`relative h-full w-full overflow-hidden rounded-2xl bg-night shadow-[0_30px_60px_-22px_rgba(0,0,0,0.85)] ${FRAME[c.frame ?? "none"]}`}
                >
                  <Image
                    src={shot.image}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 26vw, 46vw"
                    quality={80}
                    priority={c.priority}
                    placeholder="blur"
                    blurDataURL={blurFor(shot.image)}
                    className="object-cover"
                    style={c.focus ? { objectPosition: c.focus } : undefined}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
