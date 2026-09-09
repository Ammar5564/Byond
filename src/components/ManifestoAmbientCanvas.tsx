"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import {
  createFpsGate,
  getFpsLimit,
  getPixelRatioCap,
  isMobileViewport,
} from "@/lib/webglPerf";

/**
 * Low-priority volumetric ambient for the manifesto pin.
 * Charcoal → deep red/amber (#2A080C) as steps advance.
 * Mobile uses a lighter single-pass (fewer fbm octaves, no grain).
 */
const ambientVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const ambientFragment = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uProgress;
  uniform float uStep;
  uniform float uLite;
  uniform vec2 uResolution;
  varying vec2 vUv;

  const vec3 INK = vec3(0.039216);
  const vec3 AMBER_BLOOD = vec3(0.1647, 0.0314, 0.0471);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

  float fbm(vec2 p, float lite) {
    float v = 0.0;
    float a = 0.5;
    // 2 octaves on mobile, 4 on desktop
    int maxIter = lite > 0.5 ? 2 : 4;
    for (int i = 0; i < 4; i++) {
      if (i >= maxIter) break;
      v += a * noise(p);
      p *= 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = uTime * 0.1;
    float stepNorm = uStep / 3.0;
    float blend = clamp(mix(uProgress, stepNorm, 0.55), 0.0, 1.0);

    vec2 q = p + vec2(
      sin(t * 0.6 + blend) * 0.08,
      cos(t * 0.45) * 0.06 - blend * 0.04
    );
    float n1 = fbm(q * 1.4 + vec2(t * 0.35, -t * 0.25), uLite);
    float fluid = uLite > 0.5
      ? n1
      : fbm(q * 1.1 + fbm(q * 2.2 + n1 * 1.8 + vec2(-t * 0.2, t * 0.3), uLite) * 2.0, uLite);

    vec2 orb = vec2(
      -0.12 + sin(t * 0.5 + blend * 1.2) * 0.18,
      0.05 + cos(t * 0.4) * 0.12
    );
    float warp = (fluid - 0.5) * 0.45;
    float dist = length(p - orb + vec2(warp * 0.3, warp * 0.5));
    float breathe = 0.95 + sin(t * 1.1 + fluid * 2.5) * 0.06;
    float well = smoothstep(0.95 * breathe, 0.05, dist);

    vec3 base = mix(INK, AMBER_BLOOD, blend * 0.85);
    vec3 ember = mix(AMBER_BLOOD, vec3(0.32, 0.05, 0.06), blend);
    vec3 col = base;
    col += ember * well * (0.35 + blend * 0.25);
    col += vec3(0.12, 0.03, 0.04) * fluid * well * 0.2;

    // Skip film grain on mobile
    if (uLite < 0.5) {
      float grain = (noise(uv * uResolution * 0.28 + t * 1.5) - 0.5) * 0.02;
      col += grain;
    }

    float vignette = smoothstep(1.2, 0.3, length(p * vec2(0.85, 1.0)));
    col *= mix(0.5, 1.0, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function ManifestoAmbientCanvas({
  progressRef,
  stepRef,
}: {
  progressRef: MutableRefObject<number>;
  stepRef: MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let disposed = false;
    let raf = 0;
    let mobile = isMobileViewport();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.setPixelRatio(getPixelRatioCap());

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader: ambientVertex,
      fragmentShader: ambientFragment,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uStep: { value: 0 },
        uLite: { value: mobile ? 1 : 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      mobile = isMobileViewport();
      renderer.setPixelRatio(getPixelRatioCap());
      material.uniforms.uLite.value = mobile ? 1 : 0;
      renderer.setSize(w, h, false);
      material.uniforms.uResolution.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const clock = new THREE.Clock();
    let smoothProgress = 0;
    let smoothStep = 0;
    const shouldRender = createFpsGate(() => getFpsLimit());

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    const onVisibility = () => {
      /* keep rAF alive; gate skips when hidden */
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = (time: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      if (!visible || document.hidden) return;
      if (!shouldRender(time)) return;

      const t = clock.getElapsedTime();
      smoothProgress += (progressRef.current - smoothProgress) * 0.07;
      smoothStep += (stepRef.current - smoothStep) * 0.09;

      material.uniforms.uTime.value = t;
      material.uniforms.uProgress.value = smoothProgress;
      material.uniforms.uStep.value = smoothStep;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [progressRef, stepRef]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
