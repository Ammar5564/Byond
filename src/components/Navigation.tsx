"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#work", label: "Work", index: "01" },
  { href: "#capabilities", label: "Capabilities", index: "02" },
  { href: "#approach", label: "Approach", index: "03" },
];

const lightSections = new Set(["philosophy", "approach"]);
const spySections = ["work", "capabilities", "approach", "contact"];

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
  let activeId: string | null = null;

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
    if (rect.top <= navOffset + 120 && rect.bottom > navOffset) {
      activeId = id;
    }
  }

  return { theme, activeId };
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>("dark");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuLinksRef = useRef<HTMLDivElement>(null);
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
  }, [scrolled, navTheme, menuOpen]);

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const links = menuLinksRef.current;
    if (!links) return;

    let tween: { kill: () => void } | null = null;
    let cancelled = false;

    async function animate() {
      const { default: gsap } = await import("gsap");
      if (cancelled || !links) return;

      const items = links.querySelectorAll(".mobile-nav-item");
      if (menuOpen) {
        gsap.set(items, { opacity: 0, y: 32 });
        tween = gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });
      } else {
        tween = gsap.to(items, {
          opacity: 0,
          y: 16,
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.in",
        });
      }
    }

    animate();
    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [menuOpen]);

  const isLight = navTheme === "light";
  const floatOverImage = activeSection === "capabilities";

  const headerSurface = floatOverImage
    ? "border-b border-transparent bg-transparent"
    : scrolled
      ? isLight
        ? "border-b border-symphony-light bg-snow/85 shadow-[0_1px_0_rgba(12,10,12,0.04)] backdrop-blur-md"
        : "border-b border-symphony bg-ink/75 backdrop-blur-md"
      : "border-b border-transparent bg-transparent";

  const linkBase = isLight
    ? "text-ink/55 hover:text-ink"
    : "text-snow/55 hover:text-snow";
  const linkActive = isLight ? "text-ink" : "text-snow";
  const indexColor = isLight ? "text-burgundy/80" : "text-burgundy";
  const ctaColor = isLight
    ? "text-ink/70 hover:text-burgundy"
    : "text-snow/70 hover:text-burgundy";
  const barColor = isLight ? "bg-ink" : "bg-snow";
  const logoClass = isLight
    ? "h-auto w-full brightness-0"
    : "h-auto w-full brightness-0 invert";

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ease-luxury ${headerSurface}`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 md:px-10 md:py-6">
          <Link
            href="/"
            className="relative z-[60] block w-32 shrink-0 md:w-36"
          >
            <Image
              src="/logo-full-lockup.png"
              alt="Byond"
              width={180}
              height={45}
              className={`${logoClass} transition-all duration-700 ease-luxury`}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:gap-10 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`cursor-hover group flex items-baseline gap-2 transition-colors duration-500 ${linkBase} ${
                    isActive ? linkActive : ""
                  }`}
                >
                  <span
                    className={`font-sans text-[10px] tracking-wider transition-colors duration-500 ${indexColor}`}
                  >
                    {link.index}
                  </span>
                  <span className="font-display text-[15px] tracking-editorial transition-colors duration-500 group-hover:text-burgundy">
                    {link.label}
                  </span>
                </Link>
              );
            })}

            <span
              className={`hidden h-4 w-px lg:block ${isLight ? "bg-ink/15" : "bg-snow/15"}`}
              aria-hidden="true"
            />

            <Link
              href="#contact"
              className={`cursor-hover link-underline flex items-center gap-2 font-sans text-[11px] uppercase tracking-wider transition-colors duration-500 ${ctaColor} ${
                activeSection === "contact" ? "text-burgundy" : ""
              }`}
            >
              Begin
              <span aria-hidden="true" className="text-sm">
                →
              </span>
            </Link>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative z-[60] flex flex-col gap-1.5 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block h-px w-7 transition-all duration-500 ${barColor} ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-7 transition-all duration-500 ${barColor} ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-7 transition-all duration-500 ${barColor} ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[55] symphony-void transition-all duration-700 ease-luxury md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col justify-center px-6">
          <p className="section-label mb-10">Navigate</p>
          <nav ref={menuLinksRef} className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-item group flex items-baseline gap-4"
              >
                <span className="font-sans text-xs tracking-wider text-burgundy">
                  {link.index}
                </span>
                <span className="font-display text-[clamp(2rem,8vw,3.5rem)] leading-none text-snow transition-colors duration-500 group-hover:text-burgundy">
                  {link.label}
                </span>
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-item mt-6 flex items-center gap-3 border-t border-symphony pt-8"
            >
              <span className="font-sans text-xs tracking-wider text-burgundy">
                04
              </span>
              <span className="font-display text-[clamp(2rem,8vw,3.5rem)] italic leading-none text-snow">
                Begin
              </span>
              <span className="font-sans text-lg text-snow/50">→</span>
            </Link>
          </nav>
          <p className="mobile-nav-item mt-16 font-sans text-[10px] uppercase tracking-[0.3em] text-snow/30">
            Born in Cairo · Built for the world
          </p>
        </div>
      </div>
    </>
  );
}
