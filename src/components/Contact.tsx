"use client";

import { useState, FormEvent } from "react";
import { RevealOnScroll } from "./SmoothScroll";
import { SectionHeadline } from "./SectionHeadline";
import { siteConfig } from "@/lib/content";

const fieldBase =
  "w-full border-0 border-b border-champagne/20 bg-transparent py-3 font-sans text-sm text-champagne outline-none transition-colors duration-300 placeholder:text-stone/50 focus-visible:border-champagne focus-visible:ring-0 focus-visible:ring-offset-0";

const fieldError = "border-burgundy/80 placeholder:text-burgundy/40";

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
      className="relative symphony-void px-4 py-20 sm:px-6 md:px-10 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-2 lg:gap-24">
          <RevealOnScroll>
            <div>
              <span className="section-label">Begin</span>
              <SectionHeadline className="display-heading mt-4 text-3xl text-champagne sm:text-4xl md:text-5xl lg:text-6xl">
                Work with us
              </SectionHeadline>
              <p className="mt-8 max-w-md font-sans text-sm leading-relaxed tracking-wide text-champagne/50 md:text-base">
                Every partnership begins with a conversation. Tell us about your
                vision — we&apos;ll respond with clarity, not a sales pitch.
              </p>

              <div className="mt-12 space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="link-underline block font-sans text-sm tracking-wide text-champagne/70 hover:text-champagne"
                >
                  {siteConfig.email}
                </a>
                <p className="break-words font-sans text-sm tracking-wide text-champagne/40">
                  {siteConfig.address}
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            {submitted ? (
              <div className="flex h-full min-h-[280px] flex-col items-start justify-center border border-symphony p-6 sm:min-h-[320px] sm:p-8 md:p-10">
                <span className="font-display text-3xl text-champagne">
                  Thank you.
                </span>
                <p className="mt-4 max-w-sm font-sans text-sm tracking-wide text-champagne/50">
                  We&apos;ve received your message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-8 border border-symphony p-5 sm:p-8 md:p-10"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-sans text-[10px] uppercase tracking-[0.22em] text-stone"
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
                    <p
                      id="name-error"
                      className="mt-2 font-sans text-[11px] text-burgundy"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-sans text-[10px] uppercase tracking-[0.22em] text-stone"
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
                    <p
                      id="email-error"
                      className="mt-2 font-sans text-[11px] text-burgundy"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-sans text-[10px] uppercase tracking-[0.22em] text-stone"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className={`${fieldBase} resize-none ${
                      errors.message ? fieldError : ""
                    }`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-2 font-sans text-[11px] text-burgundy"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-hover group relative overflow-hidden border border-champagne/35 px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-champagne transition-all duration-500 ease-luxury hover:border-champagne hover:text-ink active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {loading && (
                      <span
                        className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
                        aria-hidden
                      />
                    )}
                    {loading ? "Sending…" : "Begin a conversation"}
                  </span>
                  <span className="absolute inset-0 origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-luxury group-hover:scale-x-100 group-disabled:scale-x-0" />
                </button>
              </form>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-symphony symphony-void px-4 py-12 sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-champagne/35">
          © {new Date().getFullYear()} Byond Media — All rights reserved
        </p>
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
              className="link-underline font-sans text-[10px] uppercase tracking-[0.18em] text-champagne/45 transition-colors hover:text-champagne"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
