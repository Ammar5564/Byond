import type { Config } from "tailwindcss";

/**
 * Design tokens live in src/app/globals.css (as RGB channels) so that
 * Tailwind utilities, plain CSS and components all read the same palette.
 * Change a colour there once and the whole site follows.
 */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: token("ivory"), // page background
        cream: token("cream"), // alternate section background
        sand: token("sand"), // borders / quiet fills
        ink: token("ink"), // primary text
        "ink-soft": token("ink-soft"), // secondary text
        burgundy: token("burgundy"), // brand accent
        wine: token("wine"), // brighter accent / hover
        gold: token("gold"), // fine details / text on dark
        "gold-deep": token("gold-deep"), // gold text on light backgrounds
        night: token("night"), // the few deliberate dark bands
        "night-lift": token("night-lift"), // hero base
        rose: token("rose"), // frame accent on dark
        snow: token("snow"),
        champagne: token("champagne"),
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        accent: ["var(--font-accent)", "Georgia", "cursive"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.01em",
        wide: "0.12em",
        wider: "0.2em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        "marquee-reverse": "marquee-reverse 60s linear infinite",
        "marquee-slow": "marquee 90s linear infinite",
        "marquee-slow-reverse": "marquee-reverse 90s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translate3d(-50%,0,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
