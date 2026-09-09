/**
 * Shared WebGL performance helpers.
 * Mobile caps apply ONLY when viewport width < 768px.
 */

export const MOBILE_BREAKPOINT = 768;
export const MOBILE_MAX_TEXTURE = 1024;

export function isMobileViewport(width = typeof window !== "undefined" ? window.innerWidth : 1024) {
  return width < MOBILE_BREAKPOINT;
}

/** Desktop up to 2×; mobile capped at 1.5× — never apply mobile caps on desktop. */
export function getPixelRatioCap(width?: number) {
  const mobile = isMobileViewport(width);
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return Math.min(dpr, mobile ? 1.5 : 2);
}

export function getFpsLimit(width?: number) {
  return isMobileViewport(width) ? 30 : 60;
}

/**
 * Keeps rAF running (ambient shaders stay alive) but skips renders
 * that would exceed the target FPS on the current viewport.
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

/** Downscale image/canvas textures on mobile to ≤1024². */
export function clampTextureForMobile(
  texture: { image?: { width?: number; height?: number }; needsUpdate?: boolean },
  mobile = isMobileViewport()
) {
  if (!mobile) return texture;
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
