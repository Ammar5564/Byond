"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#hero", label: "Intro", id: "hero" },
  { href: "#how-we-think", label: "01 How We Think", id: "how-we-think" },
  { href: "#capabilities", label: "02 Capabilities", id: "capabilities" },
  { href: "#work", label: "03 Selected Work", id: "work" },
];

const spySections = ["hero", "how-we-think", "capabilities", "work", "contact"];
const lightSections = new Set(["how-we-think"]);

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
  const brandColor = isLight
    ? "text-ink hover:text-crimson"
    : "text-snow hover:text-crimson";
  const pillSurface = isLight
    ? "border-ink/10 bg-snow/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
    : "border-snow/10 bg-ink/55 shadow-[0_8px_32px_rgba(0,0,0,0.35)]";
  const linkIdle = isLight
    ? "text-ink/45 hover:text-ink"
    : "text-snow/45 hover:text-snow";
  const linkActive = isLight
    ? "bg-ink/[0.06] text-ink"
    : "bg-snow/[0.08] text-snow";
  const ctaIdle = isLight
    ? "border-ink/20 text-ink/80 hover:border-crimson hover:bg-crimson hover:text-snow"
    : "border-snow/20 text-snow/80 hover:border-crimson hover:bg-crimson hover:text-snow";

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-10 transition-all duration-700 ease-luxury ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-x-4 px-6 md:grid-cols-[1fr_auto_1fr] md:px-10">
        <Link
          href="#hero"
          className={`cursor-hover justify-self-start font-sans text-[11px] font-medium uppercase tracking-[0.32em] transition-colors duration-500 md:text-xs ${brandColor}`}
        >
          Byond Media
        </Link>

        <nav
          className="col-span-2 hidden justify-self-center md:col-span-1 md:block"
          aria-label="Primary"
        >
          <ul
            className={`flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-colors duration-500 ${pillSurface}`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`cursor-hover block whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ${
                      isActive ? linkActive : linkIdle
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="justify-self-end">
          <Link
            href="#contact"
            className={`cursor-hover group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.28em] transition-all duration-500 md:text-[11px] ${
              activeSection === "contact"
                ? "border-crimson bg-crimson text-snow"
                : ctaIdle
            }`}
          >
            <span className="relative z-10">Begin</span>
            <span
              aria-hidden="true"
              className="relative z-10 transition-transform duration-500 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <nav
        className="mt-3 overflow-x-auto px-6 md:hidden"
        aria-label="Primary mobile"
      >
        <ul
          className={`flex w-max items-center gap-1 rounded-full border px-1.5 py-1 backdrop-blur-xl transition-colors duration-500 ${pillSurface}`}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`cursor-hover block whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.16em] transition-colors duration-500 ${
                    isActive ? linkActive : linkIdle
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
