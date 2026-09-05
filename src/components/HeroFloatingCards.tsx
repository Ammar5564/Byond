"use client";

import Image from "next/image";

const cards = [
  {
    id: "01",
    image: "/mockup/card-2.jpg",
    className:
      "absolute left-[-6%] top-[8%] aspect-[4/3] w-[280px] -rotate-3 overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[360px]",
  },
  {
    id: "02",
    image: "/mockup/card-4.jpg",
    className:
      "absolute bottom-[5%] left-[-4%] aspect-[3/4] w-[260px] rotate-2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[320px]",
  },
  {
    id: "03",
    image: "/mockup/card-2.jpg",
    className:
      "absolute left-[16%] top-[-4%] aspect-square w-[260px] overflow-hidden rounded-2xl border-2 border-[#E15223] shadow-2xl md:w-[320px]",
  },
  {
    id: "04",
    image: "/mockup/card-6.jpg",
    className:
      "absolute bottom-[-8%] left-[18%] aspect-[4/3] w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-[340px]",
  },
  {
    id: "05",
    image: "/mockup/card-6.jpg",
    className:
      "absolute left-[50%] top-[-6%] h-[150px] w-[220px] -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-900 opacity-90 shadow-xl md:w-[280px]",
  },
  {
    id: "06",
    image: "/mockup/card-3.jpg",
    className:
      "absolute bottom-[-10%] left-[50%] h-[220px] w-[240px] -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl md:w-[300px]",
  },
  {
    id: "07",
    image: "/mockup/card-3.jpg",
    className:
      "absolute right-[16%] top-[4%] aspect-[3/4] w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-2xl md:w-[340px]",
  },
  {
    id: "08",
    image: "/mockup/card-5.jpg",
    className:
      "absolute bottom-[2%] right-[18%] aspect-[3/4] w-[260px] overflow-hidden rounded-2xl border-2 border-purple-800 shadow-2xl md:w-[320px]",
  },
  {
    id: "09",
    image: "/mockup/card-1.jpg",
    className:
      "absolute right-[-6%] top-[14%] aspect-[3/4] w-[260px] rounded-2xl border border-white/10 opacity-70 md:w-[320px]",
  },
  {
    id: "10",
    image: "/mockup/card-4.jpg",
    className:
      "absolute bottom-[10%] right-[-5%] aspect-square w-[280px] rounded-2xl border border-white/10 opacity-60 md:w-[340px]",
  },
] as const;

export function HeroFloatingCards() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {cards.map((card) => (
        <div key={card.id} className={card.className}>
          <div className="relative h-full w-full overflow-hidden">
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
        </div>
      ))}
    </div>
  );
}
