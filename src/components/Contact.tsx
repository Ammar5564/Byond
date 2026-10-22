"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { siteConfig } from "@/lib/content";

const fieldBase =
  "w-full rounded-none border-0 border-b border-ink/20 bg-transparent py-3 font-sans text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink-soft/80 focus:border-burgundy focus-visible:outline-none md:text-sm";

const fieldError = "!border-wine placeholder:text-wine/50";

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Behance", href: siteConfig.social.behance },
] as const;

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name) next.name = "Please enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email.";
    }
    if (!message) next.message = "Tell us a little about the project.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-[var(--nav-height)] bg-ivory"
    >
      <div className="page-shell py-24 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
          <Reveal>
            <div>
              <p className="eyebrow">Begin</p>
              <h2 className="display-heading mt-5 text-[clamp(2.6rem,6vw,4.75rem)]">
                Work with us
              </h2>
              <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-ink-soft">
                Every partnership begins with a conversation. Tell us about your
                vision — we&apos;ll respond with clarity, not a sales pitch.
              </p>

              <div className="mt-12 space-y-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="link-underline block font-display text-2xl text-burgundy"
                >
                  {siteConfig.email}
                </a>
                <p className="max-w-xs break-words font-sans text-sm leading-relaxed text-ink-soft">
                  {siteConfig.address}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-start justify-center rounded-3xl border border-sand bg-white p-8 shadow-[0_40px_80px_-50px_rgba(60,10,25,0.5)] md:p-12">
                <span className="font-display text-4xl text-burgundy">
                  Thank you.
                </span>
                <p className="mt-4 max-w-sm font-sans text-base text-ink-soft">
                  We&apos;ve received your message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-8 rounded-3xl border border-sand bg-white p-6 shadow-[0_40px_80px_-50px_rgba(60,10,25,0.5)] sm:p-9 md:p-12"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`${fieldBase} ${errors.name ? fieldError : ""}`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 font-sans text-xs text-wine">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${fieldBase} ${errors.email ? fieldError : ""}`}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 font-sans text-xs text-wine">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`${fieldBase} resize-none ${
                      errors.message ? fieldError : ""
                    }`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 font-sans text-xs text-wine">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto disabled:cursor-wait disabled:opacity-70"
                >
                  {loading && (
                    <span
                      className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
                      aria-hidden
                    />
                  )}
                  {loading ? "Sending…" : "Begin a conversation"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="site-footer" className="bg-night text-champagne">
      <div className="page-shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="relative h-12 w-32">
              <Image
                src="/logo-full-lockup.png"
                alt="Byond Media"
                fill
                sizes="128px"
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-champagne">
              {siteConfig.tagline}
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
            aria-label="Social"
          >
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-sans text-[11px] uppercase tracking-[0.2em] text-champagne/75 transition-colors hover:text-champagne"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-champagne/55">
            © {new Date().getFullYear()} Byond Media — All rights reserved
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-sans text-[11px] tracking-[0.12em] text-champagne/75 hover:text-champagne"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
