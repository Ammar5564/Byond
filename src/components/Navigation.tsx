"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MarqueeBand } from "./MarqueeBand";

const navLinks = [
  { href: "#work", label: "Work", index: "01", id: "work" },
  { href: "#capabilities", label: "Capabilities", index: "02", id: "capabilities" },
  { href: "#approach", label: "Approach", index: "03", id: "approach" },
];

const chapterById: Record<string, { index: string; label: string }> = {
  hero: { index: "00", label: "Intro" },
  philosophy: { index: "—", label: "Studio" },
  work: { index: "01", label: "Work" },
  capabilities: { index: "02", label: "Capabilities" },
  approach: { index: "03", label: "Approach" },
  contact: { index: "04", label: "Begin" },
};

const lightSections = new Set(["philosophy", "approach"]);
const spySections = [
  "hero",
  "philosophy",
  "work",
  "capabilities",
  "approach",
  "contact",
];

const serviceWhisper = [
  "Digital",
  "Performance",
  "Branding",
  "Consultation",
  "Cinema",
];

type NavTheme = "light" | "dark";

function getNavOffset(): number {
  if (typeof window === "undefined") return 88;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-height")
    .trim();
  return parseFloat(raw) || 88;
}

function getSectionAtNav(): { theme: NavTheme; activeId: string | null } {
  const navOffset = getNavOffset();
  let theme: NavTheme = "dark";
  let activeId: string | null = "hero";

  for (const id of lightSections) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= navOffset && rect.bottom > navOffset) {
      theme = "light";
      break;
    }
  }

  for (const id of spySections) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= navOffset + 140 && rect.bottom > navOffset) {
      activeId = id;
    }
  }

  return { theme, activeId };
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>("dark");
  const [activeSection, setActiveSection] = useState<string | null>("hero");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncNavHeight = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${header.offsetHeight}px`
      );
    };

    syncNavHeight();
    window.addEventListener("resize", syncNavHeight);

    const observer = new ResizeObserver(syncNavHeight);
    observer.observe(header);

    return () => {
      window.removeEventListener("resize", syncNavHeight);
      observer.disconnect();
    };
  }, [scrolled, navTheme, activeSection]);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
      const { theme, activeId } = getSectionAtNav();
      setNavTheme(theme);
      setActiveSection(activeId);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const isLight = navTheme === "light";
  const floatOverImage = activeSection === "capabilities";

  const headerSurface = floatOverImage
    ? "border-b border-transparent bg-transparent"
    : scrolled
      ? isLight
        ? "border-b border-symphony-light bg-transparent"
        : "border-b border-symphony bg-transparent"
      : "border-b border-transparent bg-transparent";

  const linkBase = isLight
    ? "text-ink/45 hover:text-ink"
    : "text-snow/45 hover:text-snow";
  const linkActive = isLight ? "text-ink" : "text-snow";
  const chapterColor = isLight ? "text-ink" : "text-snow";
  const ctaColor = isLight
    ? "text-ink/70 hover:text-burgundy"
    : "text-snow/70 hover:text-burgundy";
  const logoClass = isLight
    ? "h-auto w-full brightness-0"
    : "h-auto w-full brightness-0 invert";
  const whisperColor = isLight ? "text-ink" : "text-snow";
  const whisperBorder = isLight ? "border-symphony-light" : "border-symphony";

  const chapter =
    (activeSection && chapterById[activeSection]) || chapterById.hero;

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ease-luxury ${headerSurface}`}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-6 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10 md:py-5">
        {/* Brand */}
        <Link href="/" className="block w-28 shrink-0 justify-self-start md:w-32">
          <Image
            src="/logo-full-lockup.png"
            alt="Byond"
            width={160}
            height={40}
            className={`${logoClass} transition-all duration-700 ease-luxury`}
            priority
          />
        </Link>

        {/* Living chapter — B */}
        <p
          key={`${chapter.index}-${chapter.label}`}
          className={`col-span-2 flex items-baseline justify-center gap-2 justify-self-center md:col-span-1 md:animate-fade-in ${chapterColor}`}
          aria-live="polite"
        >
          <span className="font-sans text-[10px] tracking-[0.2em] text-burgundy">
            {chapter.index}
          </span>
          <span className="display-heading text-lg tracking-editorial md:text-2xl">
            {chapter.label}
          </span>
        </p>

        {/* Index jumps + Begin */}
        <div className="flex items-center justify-end gap-5 justify-self-end md:gap-7">
          <nav className="flex items-baseline gap-3 md:gap-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className={`cursor-hover font-sans text-[10px] tracking-wider transition-colors duration-500 ${linkBase} ${
                    isActive ? `${linkActive} text-burgundy` : ""
                  }`}
                >
                  {link.index}
                </Link>
              );
            })}
          </nav>

          <Link
            href="#contact"
            className={`cursor-hover link-underline flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.28em] transition-colors duration-500 md:text-[11px] ${ctaColor} ${
              activeSection === "contact" ? "text-burgundy" : ""
            }`}
          >
            Begin
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Service whisper — light touch of C */}
      <div
        className={`overflow-hidden border-t ${whisperBorder} py-2 opacity-[0.35]`}
        aria-hidden="true"
      >
        <MarqueeBand
          items={serviceWhisper}
          speed="slow"
          textClassName={`font-sans text-[9px] uppercase tracking-[0.35em] ${whisperColor}`}
        />
      </div>
    </header>
  );
}
