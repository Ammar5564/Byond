"use client";

interface MarqueeBandProps {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
  textClassName?: string;
}

const speedMap = {
  slow: "animate-marquee-slow",
  normal: "animate-marquee",
  fast: "animate-marquee-fast",
};

export function MarqueeBand({
  items,
  speed = "normal",
  direction = "left",
  className = "",
  textClassName = "",
}: MarqueeBandProps) {
  const doubled = [...items, ...items];
  const animClass =
    direction === "right" ? `${speedMap[speed]}-reverse` : speedMap[speed];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex ${animClass}`}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`mx-6 inline-flex shrink-0 items-center md:mx-10 ${textClassName}`}
          >
            {item}
            <span className="mx-6 text-burgundy md:mx-10" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
