"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { WorkItem } from "@/lib/content";

export type TunnelApi = {
  setProgress: (t: number) => void;
  getActiveIndex: () => number;
  flyToIndex: (index: number) => Promise<void>;
  setHoverEnabled: (enabled: boolean) => void;
};

const RADIUS = 5.2;
const SPACING = 6.4;
const CARD_W = 4.2;
const CARD_H = 2.85;
const ANGLE_STEP = Math.PI * 0.55;

/* ─── Curved card plane (cylinder-matched bend) ─── */
function createCurvedCardGeometry(
  width: number,
  height: number,
  radius: number,
  segs = 36
) {
  const geo = new THREE.PlaneGeometry(width, height, segs, 18);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const theta = x / radius;
    pos.setXYZ(i, Math.sin(theta) * radius, y, Math.cos(theta) * radius - radius);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/* ─── Tunnel wall grid (subtle lattice) ─── */
function createTunnelLattice(radius: number, length: number) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: 0x5a121c,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });

  const rings = 28;
  for (let i = 0; i <= rings; i++) {
    const z = -((i / rings) * length);
    const pts: THREE.Vector3[] = [];
    const segments = 64;
    for (let s = 0; s <= segments; s++) {
      const a = (s / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, z)
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, mat));
  }

  const ribs = 12;
  for (let r = 0; r < ribs; r++) {
    const a = (r / ribs) * Math.PI * 2;
    const pts = [
      new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 1.5),
      new THREE.Vector3(
        Math.cos(a) * radius,
        Math.sin(a) * radius,
        -length - 1.5
      ),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, mat));
  }

  return group;
}

/* ─── Project card shaders ─── */
const cardVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFogDepth;
  uniform float uTime;
  uniform float uDistort;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.y * 3.2 + uTime * 1.4 + pos.x * 2.0) * 0.018 * uDistort;
    pos.z += wave;
    pos.x += wave * 0.35;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const cardFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uHover;
  uniform float uTime;
  uniform float uActive;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec2 vUv;
  varying float vFogDepth;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Liquid / chromatic aberration on hover
    float h = uHover;
    float liquid = sin(uv.y * 18.0 + uTime * 2.8) * 0.004 * h
                 + sin(uv.x * 22.0 - uTime * 1.6) * 0.003 * h;
    vec2 offset = vec2(liquid * 1.8, liquid);

    float r = texture2D(uMap, uv + offset * 1.6).r;
    float g = texture2D(uMap, uv + offset * 0.2).g;
    float b = texture2D(uMap, uv - offset * 1.4).b;
    vec3 col = mix(texture2D(uMap, uv).rgb, vec3(r, g, b), h);

    // Soft vignette / editorial grade
    float vig = smoothstep(0.95, 0.25, length(uv - 0.5));
    col *= mix(0.72, 1.0, vig);
    col = mix(col, col * vec3(1.05, 0.96, 0.9), 0.2);

    // Active card lift
    col += vec3(0.04, 0.03, 0.02) * uActive;

    // Edge soft falloff
    float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.96, uv.x)
               * smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);

    float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    col = mix(col, uFogColor, clamp(fogFactor, 0.0, 0.92));

    float alpha = edge * (0.72 + 0.28 * uActive);
    gl_FragColor = vec4(col, alpha);
  }
`;

type CardMesh = THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

type CardData = {
  index: number;
  baseAngle: number;
  targetZ: number;
  side: number;
  orbit: number;
  cy: number;
};

function cardData(mesh: THREE.Object3D): CardData {
  return mesh.userData as CardData;
}

export function WorksTunnelCanvas({
  projects,
  progressRef,
  onActiveChange,
  onSelect,
  apiRef,
}: {
  projects: WorkItem[];
  progressRef: MutableRefObject<number>;
  onActiveChange: (index: number, proximity: number) => void;
  onSelect: (index: number) => void;
  apiRef: MutableRefObject<TunnelApi | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onActiveChangeRef = useRef(onActiveChange);
  const onSelectRef = useRef(onSelect);
  onActiveChangeRef.current = onActiveChange;
  onSelectRef.current = onSelect;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || projects.length === 0) return;

    let disposed = false;
    let raf = 0;
    let hoverEnabled = true;
    let flyOverride: number | null = null;

    const n = projects.length;
    const tunnelLength = (n - 1) * SPACING + 10;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.085);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80);
    camera.position.set(0, 0.15, 1.4);

    // Ambient + key
    scene.add(new THREE.AmbientLight(0x3c050f, 0.55));
    const key = new THREE.PointLight(0xe5ddcb, 0.85, 28, 2);
    key.position.set(0, 1.2, 0);
    scene.add(key);
    const rim = new THREE.PointLight(0x8b0000, 0.45, 40, 2);
    rim.position.set(0, -2, -8);
    scene.add(rim);

    // Lattice walls
    const lattice = createTunnelLattice(RADIUS + 0.15, tunnelLength);
    scene.add(lattice);

    // Soft radial vignette plane at far end
    const farMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const farPlane = new THREE.Mesh(
      new THREE.CircleGeometry(RADIUS * 1.1, 48),
      farMat
    );
    farPlane.position.z = -tunnelLength - 0.5;
    scene.add(farPlane);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const placeholderCanvas = document.createElement("canvas");
    placeholderCanvas.width = 8;
    placeholderCanvas.height = 8;
    const pctx = placeholderCanvas.getContext("2d");
    if (pctx) {
      pctx.fillStyle = "#1a0508";
      pctx.fillRect(0, 0, 8, 8);
    }
    const placeholderTex = new THREE.CanvasTexture(placeholderCanvas);

    const cards: CardMesh[] = [];
    const sharedGeo = createCurvedCardGeometry(CARD_W, CARD_H, RADIUS * 1.1);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let hoveredIndex = -1;
    let lastActive = -1;
    let lastProx = -1;

    projects.forEach((project, i) => {
      const angle = i * ANGLE_STEP;
      const targetZ = -i * SPACING;

      const mat = new THREE.ShaderMaterial({
        vertexShader: cardVertex,
        fragmentShader: cardFragment,
        uniforms: {
          uMap: { value: placeholderTex },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uActive: { value: i === 0 ? 1 : 0.45 },
          uDistort: { value: 0.6 },
          uFogColor: { value: new THREE.Color(0x0a0a0a) },
          uFogDensity: { value: 0.075 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(sharedGeo, mat);
      // Spiral along the inner vault — closer to the flight path for readability
      const side = i % 2 === 0 ? 1 : -1;
      const orbit = 1.55 + (i % 3) * 0.15;
      const cx = Math.cos(angle) * orbit * side * 0.85 + side * 0.9;
      const cy = Math.sin(angle * 0.65) * 0.45;
      mesh.position.set(cx, cy, targetZ);
      // Face the camera corridor with a soft inward yaw
      mesh.rotation.y = -side * 0.42;
      mesh.rotation.x = cy * -0.08;
      mesh.userData = { index: i, baseAngle: angle, targetZ, side, orbit, cy };
      mesh.renderOrder = 2;
      scene.add(mesh);
      cards.push(mesh as CardMesh);

      loader.load(
        project.image,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          mat.uniforms.uMap.value = tex;
          mat.needsUpdate = true;
        },
        undefined,
        () => {
          // Fallback solid if texture fails
          const canvas2 = document.createElement("canvas");
          canvas2.width = 4;
          canvas2.height = 4;
          const ctx = canvas2.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#3C050F";
            ctx.fillRect(0, 0, 4, 4);
          }
          const tex = new THREE.CanvasTexture(canvas2);
          mat.uniforms.uMap.value = tex;
        }
      );
    });

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointerNDC.set(pointer.tx, pointer.ty);
    };

    const onPointerLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
      hoveredIndex = -1;
    };

    const onClick = () => {
      if (!hoverEnabled) return;
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(cards, false);
      if (hits.length > 0) {
        const idx = cardData(hits[0].object).index;
        onSelectRef.current(idx);
      } else if (lastActive >= 0) {
        onSelectRef.current(lastActive);
      }
    };

    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    wrap.addEventListener("click", onClick);

    const clock = new THREE.Clock();

    const progressToZ = (t: number) => {
      const clamped = Math.max(0, Math.min(1, t));
      return 1.4 - clamped * (n - 1) * SPACING;
    };

    const zToIndex = (z: number) => {
      const depth = 1.4 - z;
      const idx = Math.round(depth / SPACING);
      return Math.max(0, Math.min(n - 1, idx));
    };

    apiRef.current = {
      setProgress: (t: number) => {
        progressRef.current = t;
      },
      getActiveIndex: () => lastActive,
      flyToIndex: (index: number) =>
        new Promise<void>((resolve) => {
          const target = index / Math.max(1, n - 1);
          flyOverride = progressRef.current;
          const start = flyOverride;
          const dur = 1.1;
          const t0 = performance.now();
          const step = (now: number) => {
            if (disposed) {
              resolve();
              return;
            }
            const u = Math.min(1, (now - t0) / (dur * 1000));
            const eased = 1 - Math.pow(1 - u, 3);
            flyOverride = start + (target - start) * eased;
            progressRef.current = flyOverride;
            if (u < 1) {
              requestAnimationFrame(step);
            } else {
              flyOverride = null;
              resolve();
            }
          };
          requestAnimationFrame(step);
        }),
      setHoverEnabled: (enabled: boolean) => {
        hoverEnabled = enabled;
      },
    };

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Damped pointer
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      const progress =
        flyOverride !== null ? flyOverride : progressRef.current;
      const camZ = progressToZ(progress);

      camera.position.z = camZ;
      camera.position.x = pointer.x * 0.28;
      camera.position.y = 0.15 + pointer.y * 0.18;
      // Look slightly ahead down the tunnel
      camera.lookAt(pointer.x * 0.15, 0.1 + pointer.y * 0.1, camZ - 5.5);
      camera.rotation.z = pointer.x * -0.035;

      key.position.z = camZ - 1.5;
      rim.position.z = camZ - 10;

      // Hover raycast (throttled visually via lerp on uniforms)
      if (hoverEnabled) {
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(cards, false);
        hoveredIndex =
          hits.length > 0 ? cardData(hits[0].object).index : -1;
      } else {
        hoveredIndex = -1;
      }

      const active = zToIndex(camZ);
      let bestProx = 0;

      cards.forEach((card) => {
        const data = cardData(card);
        const i = data.index;
        const dist = Math.abs(data.targetZ - (camZ - 1.8));
        const prox = Math.max(0, 1 - dist / (SPACING * 0.85));
        if (i === active) bestProx = prox;

        const mat = card.material;
        mat.uniforms.uTime.value = t;
        mat.uniforms.uActive.value +=
          ((i === active ? 0.55 + prox * 0.45 : 0.2 + prox * 0.25) -
            mat.uniforms.uActive.value) *
          0.08;
        const wantHover = i === hoveredIndex && i === active ? 1 : 0;
        mat.uniforms.uHover.value +=
          (wantHover - mat.uniforms.uHover.value) * 0.1;
        mat.uniforms.uDistort.value = 0.4 + (1 - prox) * 0.8;

        // Subtle breathe toward camera when active
        const breathe = i === active ? Math.sin(t * 1.2) * 0.025 : 0;
        const pull = 1 - prox * 0.12 - breathe;
        const side = data.side;
        const orbit = data.orbit * pull;
        card.position.x =
          Math.cos(data.baseAngle) * orbit * side * 0.85 + side * 0.9;
        card.position.y = data.cy * pull;
      });

      if (active !== lastActive || Math.abs(bestProx - lastProx) > 0.02) {
        lastActive = active;
        lastProx = bestProx;
        onActiveChangeRef.current(active, bestProx);
      }

      // Lattice pulse with camera
      lattice.rotation.z = t * 0.015 + pointer.x * 0.02;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      wrap.removeEventListener("click", onClick);
      apiRef.current = null;

      cards.forEach((card) => {
        const map = card.material.uniforms.uMap.value as THREE.Texture | null;
        map?.dispose();
        card.material.dispose();
      });
      sharedGeo.dispose();
      lattice.traverse((obj) => {
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      farPlane.geometry.dispose();
      farMat.dispose();
      placeholderTex.dispose();
      renderer.dispose();
    };
  }, [projects, progressRef, apiRef]);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 cursor-hover">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
