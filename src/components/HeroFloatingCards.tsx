"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  type RefObject,
} from "react";

type DepthLayer = "bg" | "mid" | "fg";

type CardData = {
  id: string;
  image: string;
  className: string;
  baseRotate: number;
  depth: DepthLayer;
  /** Cursor parallax strength 0–1 */
  proximity: number;
};

const SCROLL_SHIFT: Record<DepthLayer, number> = {
  bg: -30,
  mid: -70,
  fg: -120,
};

/** Positions unchanged — rotate owned by Framer Motion */
const cards: CardData[] = [
  {
    id: "01",
    image: "/mockup/card-2.jpg",
    baseRotate: -3,
    depth: "bg",
    proximity: 0.35,
    className:
      "absolute left-[-6%] top-[8%] aspect-[4/3] w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[360px]",
  },
  {
    id: "02",
    image: "/mockup/card-4.jpg",
    baseRotate: 2,
    depth: "bg",
    proximity: 0.3,
    className:
      "absolute bottom-[5%] left-[-4%] aspect-[3/4] w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[320px]",
  },
  {
    id: "03",
    image: "/mockup/card-2.jpg",
    baseRotate: 0,
    depth: "fg",
    proximity: 0.85,
    className:
      "absolute left-[16%] top-[-4%] aspect-square w-[260px] overflow-hidden rounded-2xl border-2 border-[#E15223] shadow-2xl md:w-[320px]",
  },
  {
    id: "04",
    image: "/mockup/card-6.jpg",
    baseRotate: 0,
    depth: "mid",
    proximity: 0.45,
    className:
      "absolute bottom-[-8%] left-[18%] aspect-[4/3] w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[340px]",
  },
  {
    id: "05",
    image: "/mockup/card-6.jpg",
    baseRotate: 0,
    depth: "bg",
    proximity: 0.25,
    className:
      "absolute left-[50%] top-[-6%] h-[150px] w-[220px] -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-900 opacity-90 shadow-xl md:w-[280px]",
  },
  {
    id: "06",
    image: "/mockup/card-3.jpg",
    baseRotate: 0,
    depth: "mid",
    proximity: 0.4,
    className:
      "absolute bottom-[-10%] left-[50%] h-[220px] w-[240px] -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl md:w-[300px]",
  },
  {
    id: "07",
    image: "/mockup/card-3.jpg",
    baseRotate: 0,
    depth: "fg",
    proximity: 0.9,
    className:
      "absolute right-[16%] top-[4%] aspect-[3/4] w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-2xl md:w-[340px]",
  },
  {
    id: "08",
    image: "/mockup/card-5.jpg",
    baseRotate: 0,
    depth: "fg",
    proximity: 0.95,
    className:
      "absolute bottom-[2%] right-[18%] aspect-[3/4] w-[260px] overflow-hidden rounded-2xl border-2 border-purple-800 shadow-2xl md:w-[320px]",
  },
  {
    id: "09",
    image: "/mockup/card-1.jpg",
    baseRotate: 0,
    depth: "bg",
    proximity: 0.15,
    className:
      "absolute right-[-6%] top-[14%] aspect-[3/4] w-[260px] rounded-2xl border border-white/10 opacity-70 md:w-[320px]",
  },
  {
    id: "10",
    image: "/mockup/card-4.jpg",
    baseRotate: 0,
    depth: "bg",
    proximity: 0.2,
    className:
      "absolute bottom-[10%] right-[-5%] aspect-square w-[280px] rounded-2xl border border-white/10 opacity-60 md:w-[340px]",
  },
];

function FloatingCard({
  card,
  index,
  mouseX,
  mouseY,
  scrollYProgress,
}: {
  card: CardData;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}) {
  const scrollShift = SCROLL_SHIFT[card.depth];
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, scrollShift]);

  // Cursor magnetic shift — near cards move more
  const cursorStrength = 0.018 + card.proximity * 0.028;
  const cursorRange = cursorStrength * 1000;
  const cursorX = useTransform(mouseX, [-0.5, 0.5], [-cursorRange, cursorRange]);
  const cursorY = useTransform(
    mouseY,
    [-0.5, 0.5],
    [-cursorRange * 0.75, cursorRange * 0.75]
  );

  const duration = 6 + (index % 5) * 0.9; // 6s → ~9.6s
  const delay = index * 0.55;
  const drift = index % 2 === 0 ? 8 : -8;
  const { baseRotate } = card;

  return (
    <div className={card.className}>
      {/* Scroll parallax (GPU transform) */}
      <motion.div
        className="h-full w-full will-change-transform"
        style={{ y: scrollY }}
      >
        {/* Cursor parallax */}
        <motion.div
          className="h-full w-full will-change-transform"
          style={{ x: cursorX, y: cursorY }}
        >
          {/* Organic float + hover */}
          <motion.div
            className="pointer-events-auto h-full w-full cursor-pointer will-change-transform"
            animate={{
              y: [0, -20, 0],
              x: [0, drift, 0],
              rotate: [
                baseRotate,
                baseRotate + 3,
                baseRotate - 2,
                baseRotate,
              ],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
            whileHover={{
              scale: 1.08,
              zIndex: 40,
              rotate: 0,
              transition: { type: "spring", stiffness: 260, damping: 20 },
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="360px"
                className="object-cover"
                priority={
                  card.id === "01" ||
                  card.id === "03" ||
                  card.id === "07" ||
                  card.id === "08"
                }
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

type HeroFloatingCardsProps = {
  heroRef: RefObject<HTMLElement | null>;
};

export function HeroFloatingCards({ heroRef }: HeroFloatingCardsProps) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 70, damping: 20, mass: 0.3 });
  const mouseY = useSpring(rawY, { stiffness: 70, damping: 20, mass: 0.3 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(x);
      rawY.set(y);
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [heroRef, rawX, rawY]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {cards.map((card, index) => (
        <FloatingCard
          key={card.id}
          card={card}
          index={index}
          mouseX={mouseX}
          mouseY={mouseY}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
