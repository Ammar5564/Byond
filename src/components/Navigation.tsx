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

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-x-4 px-6 md:grid-cols-[1fr_auto_1fr] md:px-10">
        {/* Logo — unchanged asset */}
        <Link href="#hero" className="cursor-hover block w-28 shrink-0 justify-self-start md:w-32">
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

        {/* Center glass pill */}
        <nav
          className="col-span-2 hidden justify-self-center md:col-span-1 md:block"
          aria-label="Primary"
        >
          <ul
            className={`flex items-center gap-0.5 rounded-full border px-1.5 py-1.5 backdrop-blur-xl transition-colors duration-500 ${
              isLight
                ? "border-ink/10 bg-snow/75"
                : "border-white/10 bg-black/50"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`cursor-hover block whitespace-nowrap rounded-full px-4 py-2 font-sans text-[13px] tracking-[-0.01em] transition-colors duration-300 ${
                      isActive
                        ? isLight
                          ? "bg-ink text-snow"
                          : "bg-white text-black"
                        : isLight
                          ? "text-ink/50 hover:text-ink"
                          : "text-white/55 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Email */}
        <a
          href={`mailto:${siteConfig.email}`}
          className={`cursor-hover justify-self-end font-sans text-[13px] tracking-[-0.01em] transition-colors duration-500 ${
            isLight
              ? "text-ink/70 hover:text-ink"
              : "text-white/80 hover:text-white"
          }`}
        >
          {siteConfig.email}
        </a>
      </div>

      {/* Mobile pill */}
      <nav
        className="mt-3 overflow-x-auto px-6 md:hidden"
        aria-label="Primary mobile"
      >
        <ul
          className={`flex w-max items-center gap-0.5 rounded-full border px-1 py-1 backdrop-blur-xl ${
            isLight ? "border-ink/10 bg-snow/75" : "border-white/10 bg-black/50"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`cursor-hover block whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-[12px] transition-colors duration-300 ${
                    isActive
                      ? isLight
                        ? "bg-ink text-snow"
                        : "bg-white text-black"
                      : isLight
                        ? "text-ink/50"
                        : "text-white/55"
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
