"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

type CardData = {
  id: string;
  image: string;
  className: string;
  baseRotate: number;
  /** 0 = far (less parallax), 1 = near (more parallax) */
  proximity: number;
};

/** Positions unchanged — rotate extracted so Framer Motion can own it */
const cards: CardData[] = [
  {
    id: "01",
    image: "/mockup/card-2.jpg",
    baseRotate: -3,
    proximity: 0.35,
    className:
      "absolute left-[-6%] top-[8%] aspect-[4/3] w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[360px]",
  },
  {
    id: "02",
    image: "/mockup/card-4.jpg",
    baseRotate: 2,
    proximity: 0.3,
    className:
      "absolute bottom-[5%] left-[-4%] aspect-[3/4] w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[320px]",
  },
  {
    id: "03",
    image: "/mockup/card-2.jpg",
    baseRotate: 0,
    proximity: 0.85,
    className:
      "absolute left-[16%] top-[-4%] aspect-square w-[260px] overflow-hidden rounded-2xl border-2 border-[#E15223] shadow-2xl md:w-[320px]",
  },
  {
    id: "04",
    image: "/mockup/card-6.jpg",
    baseRotate: 0,
    proximity: 0.45,
    className:
      "absolute bottom-[-8%] left-[18%] aspect-[4/3] w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[340px]",
  },
  {
    id: "05",
    image: "/mockup/card-6.jpg",
    baseRotate: 0,
    proximity: 0.25,
    className:
      "absolute left-[50%] top-[-6%] h-[150px] w-[220px] -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-900 opacity-90 shadow-xl md:w-[280px]",
  },
  {
    id: "06",
    image: "/mockup/card-3.jpg",
    baseRotate: 0,
    proximity: 0.4,
    className:
      "absolute bottom-[-10%] left-[50%] h-[220px] w-[240px] -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl md:w-[300px]",
  },
  {
    id: "07",
    image: "/mockup/card-3.jpg",
    baseRotate: 0,
    proximity: 0.9,
    className:
      "absolute right-[16%] top-[4%] aspect-[3/4] w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-2xl md:w-[340px]",
  },
  {
    id: "08",
    image: "/mockup/card-5.jpg",
    baseRotate: 0,
    proximity: 0.95,
    className:
      "absolute bottom-[2%] right-[18%] aspect-[3/4] w-[260px] overflow-hidden rounded-2xl border-2 border-purple-800 shadow-2xl md:w-[320px]",
  },
  {
    id: "09",
    image: "/mockup/card-1.jpg",
    baseRotate: 0,
    proximity: 0.15,
    className:
      "absolute right-[-6%] top-[14%] aspect-[3/4] w-[260px] rounded-2xl border border-white/10 opacity-70 md:w-[320px]",
  },
  {
    id: "10",
    image: "/mockup/card-4.jpg",
    baseRotate: 0,
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
}: {
  card: CardData;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  // 0.015 (far) → 0.04 (near)
  const multiplier = 0.015 + card.proximity * 0.025;
  const range = multiplier * 1000;

  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-range, range]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-range * 0.7, range * 0.7]);

  const { baseRotate } = card;

  return (
    <div className={card.className}>
      {/* Cursor parallax layer */}
      <motion.div className="h-full w-full" style={{ x: parallaxX, y: parallaxY }}>
        {/* Float + hover layer */}
        <motion.div
          className="pointer-events-auto h-full w-full cursor-pointer"
          animate={{
            y: [0, -12, 0],
            rotate: [baseRotate, baseRotate + 1.5, baseRotate],
          }}
          transition={{
            duration: 5 + (index % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
          whileHover={{
            scale: 1.04,
            zIndex: 30,
            transition: { type: "spring", stiffness: 200, damping: 20 },
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
    </div>
  );
}

export function HeroFloatingCards() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.35 });
  const mouseY = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

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
        />
      ))}
    </div>
  );
}
