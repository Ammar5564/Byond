"use client";

import { useState, FormEvent } from "react";
import { RevealOnScroll } from "./SmoothScroll";
import { SectionHeadline } from "./SectionHeadline";
import { siteConfig } from "@/lib/content";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="relative symphony-void px-6 py-32 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <RevealOnScroll>
            <div>
              <span className="section-label">Begin</span>
              <SectionHeadline className="display-heading mt-4 text-[clamp(2.5rem,5vw,4.5rem)] text-snow">
                Work with us
              </SectionHeadline>
              <p className="mt-8 max-w-md font-sans text-sm leading-relaxed tracking-wide text-snow/50 md:text-base">
                Every partnership begins with a conversation. Tell us about your
                vision — we&apos;ll respond with clarity, not a sales pitch.
              </p>

              <div className="mt-12 space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="link-underline block font-sans text-sm tracking-wide text-snow/70 hover:text-snow"
                >
                  {siteConfig.email}
                </a>
                <p className="font-sans text-sm tracking-wide text-snow/40">
                  {siteConfig.address}
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            {submitted ? (
              <div className="flex h-full min-h-[320px] flex-col items-start justify-center border border-symphony p-10">
                <span className="font-display text-3xl text-snow">Thank you.</span>
                <p className="mt-4 max-w-sm font-sans text-sm tracking-wide text-snow/50">
                  We&apos;ve received your message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-8 border border-symphony p-8 md:p-10"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-sans text-[10px] uppercase tracking-wider text-snow/40"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full border-b border-snow/20 bg-transparent py-3 font-sans text-sm text-snow outline-none transition-colors placeholder:text-snow/20 focus:border-burgundy"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-sans text-[10px] uppercase tracking-wider text-snow/40"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full border-b border-snow/20 bg-transparent py-3 font-sans text-sm text-snow outline-none transition-colors placeholder:text-snow/20 focus:border-burgundy"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-sans text-[10px] uppercase tracking-wider text-snow/40"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full resize-none border-b border-snow/20 bg-transparent py-3 font-sans text-sm text-snow outline-none transition-colors placeholder:text-snow/20 focus:border-burgundy"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="cursor-hover group relative overflow-hidden border border-snow/30 px-8 py-4 font-sans text-[11px] uppercase tracking-wider text-snow transition-all duration-500 hover:border-burgundy hover:text-snow"
                >
                  <span className="relative z-10">Begin a conversation</span>
                  <span className="absolute inset-0 origin-left scale-x-0 bg-burgundy transition-transform duration-500 ease-luxury group-hover:scale-x-100" />
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
    <footer className="border-t border-symphony symphony-void px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <p className="font-sans text-[10px] uppercase tracking-wider text-snow/30">
          © {new Date().getFullYear()} Byond Media — All rights reserved
        </p>
        <div className="flex gap-8">
          {["Instagram", "LinkedIn", "Behance"].map((social) => (
            <a
              key={social}
              href="#"
              className="link-underline font-sans text-[10px] uppercase tracking-wider text-snow/40 hover:text-snow/70"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
