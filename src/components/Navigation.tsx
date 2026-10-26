"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/content";

const navLinks = [
  { href: "#hero", label: "Intro", id: "hero" },
  { href: "#trust", label: "Clients", id: "trust" },
  { href: "#how-we-think", label: "Approach", id: "how-we-think" },
  { href: "#capabilities", label: "Services", id: "capabilities" },
  { href: "#work", label: "Work", id: "work" },
];

const spySections = [
  "hero",
  "trust",
  "how-we-think",
  "capabilities",
  "work",
  "contact",
];
/** Sections with a dark background: the nav switches to its light-on-dark look. */
const darkSections = ["hero", "capabilities", "site-footer"];

type NavTheme = "light" | "dark";

function getNavOffset(): number {
  if (typeof window === "undefined") return 64;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-height")
    .trim();
  return parseFloat(raw) || 64;
}

function getSectionAtNav(): { theme: NavTheme; activeId: string | null } {
  const navOffset = getNavOffset();
  let theme: NavTheme = "light";
  let activeId: string | null = "hero";

  for (const id of darkSections) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= navOffset * 0.5 && rect.bottom > navOffset * 0.5) {
      theme = "dark";
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
  const [navTheme, setNavTheme] = useState<NavTheme>("light");
  const [activeSection, setActiveSection] = useState<string | null>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const bar = header.firstElementChild as HTMLElement | null;
    if (!bar) return;

    const syncNavHeight = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${bar.offsetHeight}px`
      );
    };

    syncNavHeight();
    window.addEventListener("resize", syncNavHeight, { passive: true });
    return () => window.removeEventListener("resize", syncNavHeight);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const { theme, activeId } = getSectionAtNav();
      setNavTheme(theme);
      setActiveSection(activeId);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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

  const dark = navTheme === "dark";

  const barTone = menuOpen
    ? "bg-ivory border-transparent"
    : scrolled
      ? dark
        ? "bg-night/90 border-white/10"
        : "bg-ivory/90 border-sand"
      : "bg-transparent border-transparent";

  const pillTone = dark
    ? "border-white/10 bg-night/70"
    : "border-ink/10 bg-white/70";

  const effectiveDark = dark && !menuOpen;

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative z-50 border-b transition-colors duration-500 ${barTone}`}
      >
        <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto] items-center gap-x-4 px-5 sm:gap-x-6 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:gap-x-8 md:px-10">
          <Link
            href="#hero"
            aria-label="Byond Media — home"
            className="relative block h-9 w-28 shrink-0 justify-self-start sm:w-32 md:h-10 md:w-36"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/logo-full-lockup.png"
              alt="Byond Media"
              fill
              sizes="160px"
              className={`object-contain object-left transition-[filter] duration-500 ${
                effectiveDark ? "brightness-0 invert" : "brightness-0"
              }`}
              priority
            />
          </Link>

          <nav className="hidden justify-self-center md:block" aria-label="Primary">
            <ul
              className={`flex items-center gap-0.5 rounded-full border px-1.5 py-1.5 transition-colors duration-500 ${pillTone}`}
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[13px] tracking-[-0.005em] transition-all duration-300 ease-luxury lg:px-4 ${
                        isActive
                          ? dark
                            ? "bg-champagne text-night"
                            : "bg-burgundy text-ivory"
                          : dark
                            ? "text-champagne/65 hover:bg-white/10 hover:text-champagne"
                            : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-3">
            <a
              href="#contact"
              className={`hidden rounded-full px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 md:inline-flex ${
                dark
                  ? "bg-champagne text-night hover:bg-white"
                  : "bg-burgundy text-ivory hover:bg-wine"
              }`}
            >
              Contact
            </a>

            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden ${
                effectiveDark
                  ? "border-white/20 text-champagne hover:bg-white/10"
                  : "border-ink/15 text-ink hover:bg-ink/5"
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
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 flex flex-col bg-ivory px-6 pb-10 pt-[calc(var(--nav-height)+1rem)] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav aria-label="Primary mobile">
            <ul className="flex flex-col">
              {[...navLinks, { href: "#contact", label: "Contact", id: "contact" }].map(
                (link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <li key={link.href} className="border-b border-sand">
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-baseline justify-between py-4 font-display text-3xl tracking-tight transition-colors ${
                          isActive ? "text-burgundy" : "text-ink hover:text-burgundy"
                        }`}
                      >
                        {link.label}
                        <span className="font-sans text-[11px] tracking-[0.2em] text-ink-soft">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          </nav>

          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-auto pt-10 font-sans text-sm tracking-wide text-ink-soft hover:text-burgundy"
            onClick={() => setMenuOpen(false)}
          >
            {siteConfig.email}
          </a>
        </div>
      )}
    </header>
  );
}
