# Byond Media website

Marketing site for **Byond Media**, a Cairo media/digital studio owned by Kareem Hanafy (influencer). The company is scaling up, so the site must feel **premium / luxury-agency**, not template-like.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 3 · three.js (Works section only) · GSAP (Works pin + Lenis sync) · Lenis smooth scroll (desktop only).
Run: `npm run dev` · build check: `npm run build`.

## Design language ("Ivory & Burgundy")
- Light, warm base: ivory `#FAF6F1`, cream `#F3ECE3`, hairlines sand `#E7DBCB`. Text ink `#1D1316`, secondary `#6A5A5E`.
- Brand accent burgundy `#5C0F22` (hover wine `#7E1631`), fine details gold. `night` `#170A0E` is used ONLY for deliberate dark bands (Works section, footer).
- **All colours are tokens**: RGB channels in `src/app/globals.css` (`--c-*`), exposed in `tailwind.config.ts` (`bg-ivory`, `text-burgundy`, `text-ink-soft`, ...). Never hardcode hex in components.
- Fonts: Playfair Display (display), Inter (UI), Great Vibes (script accent).
- Buttons/eyebrows/headings use the component classes in globals.css (`btn-primary`, `btn-ghost`, `eyebrow`, `display-heading`).

## Structure
- `src/app/page.tsx`: Navigation, Hero, Trust (stats + logos + testimonials), Principles, Capabilities (services), SelectedWork (3D tunnel, dark), Contact + Footer.
- `src/lib/content.ts`: all copy, services, work items, hero photo list. Edit text here.
- Hero photos: `public/hero/*.webp`. Service photos: `public/services/*.webp`.
  To add/replace photos: drop the originals in `new-images/` (hero) or `new-images/services/`, adjust the filename map in `scripts/prepare-images.py`, then run `python3 scripts/prepare-images.py` (needs `pip install pillow`). It writes optimized WebP + `src/lib/imageMeta.ts` (blur placeholders).
- Hero: desktop (>=1280px) = floating photo composition (CSS animation + light cursor parallax, `HeroFloatingCards.tsx`); below 1280px = two slow photo rows. Photos are positioned OUTSIDE the headline zone, keep it that way when editing positions.
- Services: desktop = sticky photo that cross-fades while the list scrolls; phones = a card per service.
- Works: `WorksTunnelCanvas.tsx` is the ONLY WebGL scene. It mounts when the section is near the viewport and its render loop stops when off-screen.

## Performance rules (the site used to freeze: do not regress)
- Max ONE WebGL context, only while its section is on screen. No full-page shader backgrounds, no custom cursor, no grain/mix-blend overlays.
- No scroll pinning except Works. Reveal-on-scroll uses `<Reveal/>` (IntersectionObserver + CSS), not GSAP per element.
- Animate transform/opacity only; respect `prefers-reduced-motion`; no `backdrop-filter`.
- Use `next/image` with sizes + blur placeholder; WebP only in `public/`.
- `body` must NOT use `overflow-x: hidden` (breaks `position: sticky`); it uses `overflow-x: clip`.

## Rules for any change
- No overlapping text at 360, 768, 1024, 1440, 1920 px. Prefer flow layout over absolute hacks.
- Do not change copy or contact info in `content.ts` unless asked.
- Run `npm run build` after every task and keep it green. Commit in small steps.
