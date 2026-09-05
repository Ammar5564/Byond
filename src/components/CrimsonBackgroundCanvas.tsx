"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Byond cinematic palette
  const vec3 INK = vec3(0.039216);          // #0A0A0A
  const vec3 CRIMSON = vec3(0.545098, 0.0, 0.0); // #8B0000
  const vec3 BLOOD = vec3(0.38, 0.01, 0.04);
  const vec3 EMBER = vec3(0.75, 0.08, 0.1);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = uTime * 0.22;
    float scroll = uScroll;

    // Scroll shifts the aura downward / sideways
    vec2 center = vec2(
      sin(t * 0.35) * 0.08 + scroll * 0.12,
      0.02 - scroll * 0.55 + cos(t * 0.28) * 0.05
    );

    // Organic fluid displacement field
    vec2 q = p - center;
    float n1 = fbm(q * 1.55 + vec2(t * 0.55, -t * 0.4));
    float n2 = fbm(q * 2.1 + vec2(-t * 0.35, t * 0.6) + n1 * 1.6);
    float fluid = fbm(q * 1.2 + n2 * 2.4 + vec2(scroll * 0.5, t * 0.25));

    // Domain-warped radius — breathing halo from center
    float warp = (fluid - 0.5) * 0.55;
    float dist = length(q + vec2(warp * 0.35, warp * 0.55));
    float breathe = 0.92 + sin(t * 1.4 + fluid * 3.0) * 0.08;

    float core = smoothstep(0.42 * breathe, 0.0, dist + warp * 0.15);
    float halo = smoothstep(1.15 * breathe, 0.12, dist + warp * 0.25);
    float mist = smoothstep(1.65, 0.35, dist + fluid * 0.3);

    float aura = core * 1.15 + halo * 0.75 + mist * 0.35;
    aura *= 0.55 + fluid * 0.7;
    aura = clamp(aura, 0.0, 1.2);

    // Secondary drifting lobes for depth
    vec2 lobeA = p - (center + vec2(-0.45 + sin(t) * 0.1, 0.25 - scroll * 0.2));
    vec2 lobeB = p - (center + vec2(0.5 + cos(t * 0.7) * 0.08, -0.3 + scroll * 0.15));
    aura += smoothstep(0.9, 0.05, length(lobeA) + fluid * 0.3) * 0.35;
    aura += smoothstep(0.85, 0.06, length(lobeB) + fluid * 0.28) * 0.28;
    aura = clamp(aura, 0.0, 1.35);

    vec3 glow = mix(BLOOD, CRIMSON, clamp(fluid * 1.2 + core, 0.0, 1.0));
    glow = mix(glow, EMBER, core * 0.55);

    float vig = smoothstep(1.55, 0.2, length(p * vec2(0.75, 1.05)));
    vec3 col = mix(INK, glow, aura * vig * 0.95);

    // Soften as user scrolls deep into the page
    float presence = mix(1.0, 0.5, smoothstep(0.0, 0.65, scroll));
    col = mix(INK, col, presence);

    // --- CRT scanlines ---
    float scanY = uv.y * uResolution.y;
    float scan = sin(scanY * 3.14159) * 0.5 + 0.5;
    col *= 1.0 - scan * 0.085;

    // Rolling CRT refresh band
    float roll = fract(uv.y * 0.35 - uTime * 0.08);
    col *= 1.0 - smoothstep(0.0, 0.04, roll) * smoothstep(0.08, 0.04, roll) * 0.12;

    // --- Phosphor grid ---
    vec2 gridUv = uv * uResolution / 3.0;
    float phosphor =
      (0.66 + 0.34 * sin(gridUv.x * 6.28318)) *
      (0.66 + 0.34 * sin(gridUv.y * 6.28318));
    col *= mix(0.92, 1.0, phosphor);

    // --- Film grain ---
    float grain = hash(uv * uResolution + fract(uTime * 23.17)) * 2.0 - 1.0;
    col += grain * 0.045;

    // Slight crimson lift in midtones so the aura reads on screenshots
    col = mix(col, col * vec3(1.08, 0.95, 0.95), 0.15);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function CrimsonBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(new THREE.Color("#0A0A0A"), 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let scrollTarget = 0;

    const syncScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollTarget = window.scrollY / max;
    };

    const syncSize = () => {
      if (disposed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };

    syncScroll();
    syncSize();

    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncSize);

    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * 0.07;
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncSize);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

/** @deprecated Prefer CrimsonBackgroundCanvas */
export const BackgroundCanvas = CrimsonBackgroundCanvas;
