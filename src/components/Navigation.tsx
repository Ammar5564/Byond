"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/content";

const navLinks = [
  { href: "#hero", label: "Intro", id: "hero" },
  { href: "#how-we-think", label: "Approach", id: "how-we-think" },
  { href: "#work", label: "Works", id: "work" },
  { href: "#trust", label: "About", id: "trust" },
];

const spySections = ["hero", "how-we-think", "work", "trust", "contact"];
const lightSections = new Set<string>([]);

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
  const [menuOpen, setMenuOpen] = useState(false);
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
    window.addEventListener("resize", syncNavHeight, { passive: true });
    const observer = new ResizeObserver(syncNavHeight);
    observer.observe(header);

    return () => {
      window.removeEventListener("resize", syncNavHeight);
      observer.disconnect();
    };
  }, [scrolled, navTheme, activeSection, menuOpen]);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
      const { theme, activeId } = getSectionAtNav();
      setNavTheme(theme);
      setActiveSection(activeId);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("touchmove", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("touchmove", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const isLight = navTheme === "light";
  const pillTone = isLight
    ? "border-ink/10 bg-snow/75"
    : "border-white/10 bg-black/50";

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      <div className="relative z-50 mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 md:grid-cols-[1fr_auto_1fr] md:gap-x-8 md:px-10">
        <Link
          href="#hero"
          className="cursor-hover block w-24 shrink-0 justify-self-start sm:w-28 md:w-32"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo-full-lockup.png"
            alt="Byond"
            width={160}
            height={40}
            className={`h-auto w-full transition-all duration-500 ${
              isLight ? "brightness-0" : "brightness-0 invert"
            }`}
            priority
          />
        </Link>

        <nav
          className="hidden justify-self-center md:block"
          aria-label="Primary"
        >
          <ul
            className={`flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-none transition-colors duration-500 md:backdrop-blur-xl ${pillTone}`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`cursor-hover block whitespace-nowrap rounded-full px-4 py-2 font-sans text-[13px] tracking-[-0.01em] transition-all duration-300 ease-luxury ${
                      isActive
                        ? isLight
                          ? "bg-ink text-snow shadow-[0_0_0_1px_rgba(10,10,10,0.08)]"
                          : "bg-champagne text-ink shadow-[0_0_20px_rgba(229,221,203,0.18)]"
                        : isLight
                          ? "text-ink/45 hover:bg-ink/5 hover:text-ink"
                          : "text-white/50 hover:bg-white/10 hover:text-champagne"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <a
            href={`mailto:${siteConfig.email}`}
            className={`cursor-hover hidden truncate rounded-full px-3 py-2 font-sans text-[12px] tracking-[-0.01em] transition-colors duration-300 sm:inline-flex md:text-[13px] ${
              isLight
                ? "text-ink/65 hover:text-ink"
                : "text-champagne/70 hover:text-champagne"
            }`}
          >
            {siteConfig.email}
          </a>

          <button
            type="button"
            className={`cursor-hover flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden ${
              isLight
                ? "border-ink/15 text-ink hover:bg-ink/5"
                : "border-white/15 text-champagne hover:bg-white/10"
            }`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="relative block h-3.5 w-4" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-full bg-current transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 flex flex-col bg-ink/95 px-6 pb-10 pt-[calc(var(--nav-height)+0.75rem)] backdrop-blur-none md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav aria-label="Primary mobile">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`cursor-hover block rounded-full px-4 py-3.5 font-sans text-lg tracking-wide transition-colors ${
                        isActive
                          ? "bg-champagne text-ink"
                          : "text-champagne/75 hover:bg-white/5 hover:text-champagne"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-auto cursor-hover pt-10 font-sans text-sm tracking-wide text-champagne/55 hover:text-champagne"
            onClick={() => setMenuOpen(false)}
          >
            {siteConfig.email}
          </a>
        </div>
      )}
    </header>
  );
}
