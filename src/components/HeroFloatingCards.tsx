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

type FloatingCardData = {
  id: string;
  title: string;
  label: string;
  image: string;
  imageAlt: string;
  size: "md" | "lg";
  featured?: boolean;
  /** 3D placement from viewport center */
  transform: string;
  depth: number;
  floatDuration: number;
  floatDelay: number;
};

const cards: FloatingCardData[] = [
  {
    id: "1",
    title: "Felopateer",
    label: "Brand Film",
    image: "/services/video-production.png",
    imageAlt: "Cinematic portrait for brand film",
    size: "md",
    transform: "translate3d(-20%, -10%, -100px) rotate(-6deg)",
    depth: 0.55,
    floatDuration: 5.2,
    floatDelay: 0.1,
  },
  {
    id: "2",
    title: "Hassan Allam",
    label: "Employer Brand",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    imageAlt: "Corporate tower at dusk",
    size: "md",
    transform: "translate3d(10%, -25%, -200px) rotate(4deg)",
    depth: 0.85,
    floatDuration: 6.4,
    floatDelay: 0.4,
  },
  {
    id: "3",
    title: "Lorenz",
    label: "Campaign",
    image: "/services/performance-marketing.png",
    imageAlt: "High-contrast campaign portrait",
    size: "md",
    transform: "translate3d(25%, -15%, -50px) rotate(-3deg)",
    depth: 0.4,
    floatDuration: 4.8,
    floatDelay: 0.7,
  },
  {
    id: "4",
    title: "KO Squad",
    label: "Digital Craft",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    imageAlt: "Abstract fluid gradient",
    size: "md",
    transform: "translate3d(-30%, 20%, -150px) rotate(8deg)",
    depth: 0.7,
    floatDuration: 5.8,
    floatDelay: 0.2,
  },
  {
    id: "5",
    title: "Byond Stories",
    label: "Featured",
    image: "/services/digital-solutions.png",
    imageAlt: "Editorial portrait with crimson light",
    size: "lg",
    featured: true,
    transform: "translate3d(0%, -5%, 0px) rotate(0deg)",
    depth: 0.25,
    floatDuration: 4.2,
    floatDelay: 0,
  },
  {
    id: "6",
    title: "Real Estate",
    label: "3D · Film",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    imageAlt: "Luxury residence at twilight",
    size: "md",
    transform: "translate3d(30%, 25%, -100px) rotate(-5deg)",
    depth: 0.6,
    floatDuration: 6.8,
    floatDelay: 0.55,
  },
];

function FloatingCard({
  card,
  mouseX,
  mouseY,
}: {
  card: FloatingCardData;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const range = 28 * card.depth;
  const offsetX = useTransform(mouseX, [-0.5, 0.5], [-range, range]);
  const offsetY = useTransform(mouseY, [-0.5, 0.5], [-range * 0.7, range * 0.7]);

  const sizeClass =
    card.size === "lg"
      ? "w-72 h-[22rem] md:w-80 md:h-96"
      : "w-52 h-64 md:w-64 md:h-80";

  return (
    <div
      className={`absolute left-1/2 top-1/2 ${sizeClass}`}
      style={{
        transform: `translate(-50%, -50%) ${card.transform}`,
        transformStyle: "preserve-3d",
        zIndex: card.featured ? 5 : 1,
      }}
    >
      {/* Mouse parallax layer */}
      <motion.div className="h-full w-full" style={{ x: offsetX, y: offsetY }}>
        {/* Independent float + hover */}
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 1.1, delay: card.floatDelay + 0.25 },
            scale: { duration: 1.1, delay: card.floatDelay + 0.25 },
            y: {
              duration: card.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: card.floatDelay,
            },
          }}
          whileHover={{
            scale: 1.05,
            zIndex: 20,
            transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <div
            className={`cursor-hover group relative h-full w-full overflow-hidden rounded-2xl border shadow-2xl ${
              card.featured
                ? "border-crimson/45 shadow-[0_25px_80px_rgba(139,0,0,0.45)]"
                : "border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            }`}
          >
            <div className="absolute inset-0 bg-[#111]" />

            <Image
              src={card.image}
              alt={card.imageAlt}
              fill
              sizes="(max-width: 768px) 208px, 320px"
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
              priority={card.featured}
            />

            <div
              className={`absolute inset-0 ${
                card.featured
                  ? "bg-gradient-to-t from-crimson/70 via-ink/20 to-transparent"
                  : "bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
              }`}
            />

            <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-3.5 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="ml-auto font-sans text-[9px] uppercase tracking-[0.22em] text-white/40">
                Preview
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p
                className={`mb-1 font-sans text-[9px] uppercase tracking-[0.28em] ${
                  card.featured ? "text-snow/80" : "text-snow/45"
                }`}
              >
                {card.label}
              </p>
              <h3 className="display-heading text-lg text-snow md:text-xl">
                {card.title}
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Floating 3D project preview cards behind the hero editorial text.
 * Inspired by sashamartynchuk.com-style depth compositions.
 */
export function HeroFloatingCards() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.4 });
  const mouseY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.4 });

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
      className="pointer-events-auto absolute inset-0 z-0 hidden overflow-hidden md:block"
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-ink/35 via-transparent to-ink/65" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(10,10,10,0.5)_78%)]" />

      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {cards.map((card) => (
          <FloatingCard
            key={card.id}
            card={card}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>
    </div>
  );
}
