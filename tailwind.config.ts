import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0C0A0C",
        burgundy: "#3C050F",
        snow: "#FBFBFB",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.02em",
        wide: "0.12em",
        wider: "0.2em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      backgroundImage: {
        "symphony-crescendo":
          "linear-gradient(120deg, #0C0A0C 0%, #3C050F 28%, #0C0A0C 52%, #3C050F 72%, #FBFBFB 100%)",
        "symphony-bridge":
          "linear-gradient(180deg, #FBFBFB 0%, rgba(60,5,15,0.15) 35%, #3C050F 55%, #0C0A0C 100%)",
        "symphony-fade":
          "linear-gradient(180deg, #0C0A0C 0%, #3C050F 50%, #0C0A0C 100%)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "marquee-slow-reverse": "marquee-reverse 60s linear infinite",
        "marquee-fast": "marquee 25s linear infinite",
        "marquee-fast-reverse": "marquee-reverse 25s linear infinite",
        "fade-in": "fadeIn 1.2s ease forwards",
        "symphony-pulse": "symphonyPulse 8s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        symphonyPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
