/**
 * Shared WebGL performance helpers.
 * DPR: min(devicePixelRatio, 1.5) on all devices.
 * FPS: 60 desktop (≥768), 30 mobile (<768) + scroll freeze on mobile.
 * Lite shaders: pointer: coarse OR hardwareConcurrency ≤ 4.
 */

export const MOBILE_BREAKPOINT = 768;
export const MOBILE_MAX_TEXTURE = 1024;

export function isNarrowViewport(
  width = typeof window !== "undefined" ? window.innerWidth : 1024
) {
  return width < MOBILE_BREAKPOINT;
}

/** @deprecated Prefer isNarrowViewport — kept for call-site clarity. */
export function isMobileViewport(
  width = typeof window !== "undefined" ? window.innerWidth : 1024
) {
  return isNarrowViewport(width);
}

export function isCoarsePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(pointer: coarse)").matches;
}

export function isLowConcurrency() {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  return cores > 0 && cores <= 4;
}

/** Lite shaders / skip particles: coarse pointer OR low CPU cores. */
export function shouldUseLiteShaders() {
  return isCoarsePointer() || isLowConcurrency();
}

/** Cap DPR at 1.5 on desktop and mobile. */
export function getPixelRatioCap() {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return Math.min(dpr, 1.5);
}

/** Desktop ≥768 → 60 FPS. Mobile <768 → 30 FPS. */
export function getFpsLimit(
  width = typeof window !== "undefined" ? window.innerWidth : 1024
) {
  return isNarrowViewport(width) ? 30 : 60;
}

/**
 * Keeps rAF running but skips renders that would exceed the target FPS.
 */
export function createFpsGate(getLimit: () => number = getFpsLimit) {
  let lastTime = 0;
  return (time: number) => {
    const limit = getLimit();
    const minDelta = 1000 / limit;
    if (time - lastTime < minDelta) return false;
    lastTime = time;
    return true;
  };
}

/**
 * Pause draws while the page is actively scrolling.
 * Cleared after `idleMs` without scroll events.
 */
export function createScrollFreeze(idleMs = 140) {
  let frozen = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const onScroll = () => {
    frozen = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      frozen = false;
      timer = null;
    }, idleMs);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  return {
    isFrozen: () => frozen,
    dispose: () => {
      if (typeof window === "undefined") return;
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    },
  };
}

/** Downscale image/canvas textures on lite devices to ≤1024². */
export function clampTextureForMobile(
  texture: {
    image?: { width?: number; height?: number };
    needsUpdate?: boolean;
  },
  lite = shouldUseLiteShaders()
) {
  if (!lite) return texture;
  const img = texture.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap
    | undefined;
  if (!img || !("width" in img) || !img.width || !img.height) return texture;

  const maxDim = Math.max(img.width, img.height);
  if (maxDim <= MOBILE_MAX_TEXTURE) return texture;

  const scale = MOBILE_MAX_TEXTURE / maxDim;
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return texture;
  ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
  texture.image = canvas;
  texture.needsUpdate = true;
  return texture;
}

export function addPassive(
  target: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
) {
  target.addEventListener(type, handler, { ...options, passive: true });
  return () => target.removeEventListener(type, handler);
}

/** Debounce helper for resize storms. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number
) {
  let id: ReturnType<typeof setTimeout> | null = null;
  const wrapped = (...args: Parameters<T>) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      id = null;
      fn(...args);
    }, ms);
  };
  wrapped.cancel = () => {
    if (id) clearTimeout(id);
    id = null;
  };
  return wrapped;
}
