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

export function StatementBreak({
  lines,
  variant = "crescendo",
}: {
  lines: string[];
  variant?: "dark" | "snow" | "crescendo" | "bridge";
}) {
  const surfaces = {
    dark: {
      bg: "symphony-void",
      main: "text-snow",
      ghost: "text-snow/30",
    },
    snow: {
      bg: "symphony-snow",
      main: "text-ink",
      ghost: "text-burgundy/40",
    },
    crescendo: {
      bg: "symphony-crescendo",
      main: "text-snow",
      ghost: "text-snow/40",
    },
    bridge: {
      bg: "symphony-bridge",
      main: "text-snow",
      ghost: "text-snow/35",
    },
  };

  const s = surfaces[variant];

  return (
    <section className={`relative overflow-hidden py-16 md:py-24 ${s.bg}`}>
      <MarqueeBand
        items={lines}
        speed="slow"
        direction="left"
        textClassName={`font-display text-[clamp(2rem,6vw,5rem)] italic leading-none ${s.main}`}
      />
      <MarqueeBand
        items={[...lines].reverse()}
        speed="slow"
        direction="right"
        className="mt-4"
        textClassName={`font-sans text-[10px] uppercase tracking-[0.3em] ${s.ghost}`}
      />
    </section>
  );
}
