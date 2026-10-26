# Byond Media website

Marketing site for **Byond Media**, a Cairo media/digital studio owned by Kareem Hanafy (influencer). The company is scaling up, so the site must feel **premium / luxury-agency**, not template-like.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 3 · Lenis smooth scroll (desktop only). No WebGL, no GSAP.
Run: `npm run dev` · build check: `npm run build`.

## Design language ("Ivory & Burgundy")
- Light, warm base: ivory `#FAF6F1`, cream `#F3ECE3`, hairlines sand `#E7DBCB`. Text ink `#1D1316`, secondary `#6A5A5E`.
- Brand accent burgundy `#5C0F22` (hover wine `#7E1631`), fine details gold. `night` `#170A0E` is used ONLY for deliberate dark bands (Hero, Services stage, footer). Everything else is light; Works is on cream.
- **All colours are tokens**: RGB channels in `src/app/globals.css` (`--c-*`), exposed in `tailwind.config.ts` (`bg-ivory`, `text-burgundy`, `text-ink-soft`, ...). Never hardcode hex in components.
- Fonts: Playfair Display (display), Inter (UI), Great Vibes (script accent).
- Buttons/eyebrows/headings use the component classes in globals.css (`btn-primary`, `btn-ghost`, `eyebrow`, `display-heading`).

## Structure
- `src/app/page.tsx`: Navigation, Hero, Trust (stats + logos + testimonials), Principles, Capabilities (services), SelectedWork (film reel), Contact + Footer.
- `src/lib/content.ts`: all copy, services (5), work items, hero photo list. Edit text here.
- Hero photos: `public/hero/*.webp`. Service photos: `public/services/*.webp`.
  To add/replace photos: drop the originals in `new-images/` (hero) or `new-images/services/`, adjust the filename map in `scripts/prepare-images.py`, then run `python3 scripts/prepare-images.py` (needs `pip install pillow`). It writes optimized WebP + `src/lib/imageMeta.ts` (blur placeholders + native aspect ratios).
- Hero (`Hero.tsx` + `HeroFloatingCards.tsx`): DARK (night + crimson light pools = `.hero-glow`, pure CSS, identical on every device) to match the client's reference (the old site's hero). No captions. >=1024px (`HeroFloatingCards`): big framed photos float around the headline, may overlap each other and bleed off the edges, but never touch the text (the two inner bottom cards are hidden below 1280px). <1024px (`HeroPile`): the reference's layered-frames composition. The hero is a `grid-rows-[1fr_auto_1fr]`: a pile of overlapping, rotated frames (white / gold / wine borders, some translucent, some bleeding) in the row above the text and another in the row below. Each pile is a CSS container (`container-type: size`) sized with `cqw/cqh` units (`--u = min(100cqw/88, 100cqh/72)`), so it fills the space between the screen edge and the text on any phone/tablet and cannot touch the text. Motion: organic CSS float per photo (`heroFloat`) + scroll depth parallax (`--sy` set by ONE passive scroll listener in Hero.tsx, `.hero-card-scroll`) + laptop cursor parallax. After editing SLOTS / TOP_PILE / BOTTOM_PILE re-run a bounding-box check (cards vs text) at 360x640 ... 2560x1440. Nav is in dark theme over the hero (`darkSections`).
- Colour scheme: `viewport.colorScheme = "only light"` + `html { color-scheme: only light }` so phone browsers (Samsung Internet / Chrome "dark mode for websites") do not auto-invert the light sections. Do not remove.
- Clients logos (`Trust.tsx`): always full colour (no grayscale / hover reveal).
- Services (`Capabilities.tsx`): tall scroll track + `position: sticky` 100svh stage. One scroll listener (rAF) writes opacity/transform straight to the DOM: next photo fades in over the previous, texts fade out before the next fades in (never two texts at once). Same behaviour on phone (photo = top 60-68% of the stage) and laptop (photo = whole stage). Per-image focal point in `FOCUS_X`.
- Works (`SelectedWork.tsx`): native horizontal scroll-snap film reel, identical on phone and laptop (swipe / drag / arrows / keys). Stills come from YouTube (`maxresdefault`, falls back to `hqdefault`). Tap/click the lit film to open `VideoModal`.

## Performance rules (the site used to freeze: do not regress)
- No WebGL, no full-page shader backgrounds, no custom cursor, no grain/mix-blend overlays.
- No scroll-pinning libraries. The only scroll-driven stage is the Services sticky stage (plain CSS sticky + one rAF listener). Reveal-on-scroll uses `<Reveal/>` (IntersectionObserver + CSS).
- Animate transform/opacity only; respect `prefers-reduced-motion`; no `backdrop-filter`.
- Use `next/image` with sizes + blur placeholder; WebP only in `public/`.
- `body` must NOT use `overflow-x: hidden` (breaks `position: sticky`); it uses `overflow-x: clip`.

## Rules for any change
- No overlapping text at 360, 768, 1024, 1440, 1920 px. Prefer flow layout over absolute hacks.
- Do not change copy or contact info in `content.ts` unless asked.
- Run `npm run build` after every task and keep it green. Commit in small steps.
