"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

const NODE_COUNT = 72;
const LINK_DISTANCE = 1.55;
const MAX_EDGES = NODE_COUNT * 4;

const crtVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const crtFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uStrength;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Scanlines
    float scan = sin(uv.y * uResolution.y * 1.25 + uTime * 1.5) * 0.5 + 0.5;
    float scanDark = scan * 0.07 * uStrength;

    // Pixel grid
    vec2 grid = fract(uv * uResolution / 3.0);
    float px = step(0.88, grid.x) + step(0.88, grid.y);
    float gridMix = px * 0.035 * uStrength;

    float grain = (hash(uv * uResolution + fract(uTime * 13.0)) * 2.0 - 1.0) * 0.025 * uStrength;

    // Output as darkening overlay (multiplicative feel via alpha)
    float alpha = clamp(scanDark + gridMix + abs(grain), 0.0, 0.2);
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
  }
`;

const auraFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p * vec2(1.15, 1.0));
    float pulse = 0.55 + sin(uTime * 0.4) * 0.08;
    float glow = smoothstep(0.85, 0.05, d) * pulse;
    vec3 crimson = vec3(0.545, 0.0, 0.0);
    gl_FragColor = vec4(crimson, glow * 0.45);
  }
`;

export function ConstellationCanvas({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let disposed = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.autoClear = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const network = new THREE.Group();
    scene.add(network);

    // Deep crimson ambient aura (behind nodes)
    const auraMat = new THREE.ShaderMaterial({
      vertexShader: crtVertex,
      fragmentShader: auraFragment,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const aura = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), auraMat);
    aura.position.z = -3.5;
    scene.add(aura);

    // Node base positions
    const base = new Float32Array(NODE_COUNT * 3);
    const phases = new Float32Array(NODE_COUNT);
    const isCrimson = new Uint8Array(NODE_COUNT);

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.1 + Math.random() * 2.6;
      base[i3] = r * Math.sin(phi) * Math.cos(theta);
      base[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      base[i3 + 2] = r * Math.cos(phi) * 0.7;
      phases[i] = Math.random() * Math.PI * 2;
      isCrimson[i] = Math.random() > 0.62 ? 1 : 0;
    }

    const live = new Float32Array(NODE_COUNT * 3);
    live.set(base);

    // Instanced white orbs
    const sphereGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const whiteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const crimsonMat = new THREE.MeshBasicMaterial({
      color: 0xff1e27,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const whiteCount = [...isCrimson].filter((v) => v === 0).length;
    const crimsonCount = NODE_COUNT - whiteCount;
    const whiteMesh = new THREE.InstancedMesh(sphereGeo, whiteMat, whiteCount);
    const crimsonMesh = new THREE.InstancedMesh(
      sphereGeo,
      crimsonMat,
      crimsonCount
    );
    whiteMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    crimsonMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    network.add(whiteMesh);
    network.add(crimsonMesh);

    const dummy = new THREE.Object3D();
    const whiteIndexOf: number[] = [];
    const crimsonIndexOf: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      if (isCrimson[i]) crimsonIndexOf.push(i);
      else whiteIndexOf.push(i);
    }

    // Connection lines
    const linePos = new Float32Array(MAX_EDGES * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff1e27,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    network.add(lines);

    // Soft glow sprites (larger additive points behind spheres)
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(live, 3));
    const glowMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0xff1e27,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const glowPoints = new THREE.Points(glowGeo, glowMat);
    network.add(glowPoints);

    // CRT overlay scene
    const overlayScene = new THREE.Scene();
    const overlayCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const crtUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uStrength: { value: 1 },
    };
    const crtMat = new THREE.ShaderMaterial({
      vertexShader: crtVertex,
      fragmentShader: crtFragment,
      uniforms: crtUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    overlayScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), crtMat));

    const mouse = { x: 0, y: 0 };
    const mouseSmooth = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      const el = sectionRef.current ?? wrap;
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
    };

    const listenTarget = sectionRef.current ?? wrap;
    listenTarget.addEventListener("mousemove", onMove, { passive: true });
    listenTarget.addEventListener("mouseleave", onLeave);

    const syncSize = () => {
      if (disposed) return;
      const w = wrap.clientWidth || window.innerWidth;
      const h = wrap.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      crtUniforms.uResolution.value.set(w * dpr, h * dpr);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(wrap);
    window.addEventListener("resize", syncSize);

    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();
      auraMat.uniforms.uTime.value = t;
      crtUniforms.uTime.value = t;

      mouseSmooth.x += (mouse.x - mouseSmooth.x) * 0.06;
      mouseSmooth.y += (mouse.y - mouseSmooth.y) * 0.06;

      // Perspective tilt of the whole matrix
      network.rotation.y = mouseSmooth.x * 0.35 + t * 0.03;
      network.rotation.x = mouseSmooth.y * 0.22 + Math.sin(t * 0.2) * 0.05;

      // Organic expand / contract via sine
      const breathe = 1 + Math.sin(t * 0.35) * 0.06;

      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        const ph = phases[i];
        live[i3] =
          (base[i3] + Math.sin(t * 0.55 + ph) * 0.22) * breathe;
        live[i3 + 1] =
          (base[i3 + 1] + Math.cos(t * 0.42 + ph * 1.2) * 0.2) * breathe;
        live[i3 + 2] =
          (base[i3 + 2] + Math.sin(t * 0.33 + ph * 0.8) * 0.16) * breathe;
      }
      glowGeo.attributes.position.needsUpdate = true;

      // Update instanced spheres
      for (let w = 0; w < whiteIndexOf.length; w++) {
        const i = whiteIndexOf[w];
        const i3 = i * 3;
        dummy.position.set(live[i3], live[i3 + 1], live[i3 + 2]);
        const s = 0.85 + Math.sin(t * 1.2 + phases[i]) * 0.2;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        whiteMesh.setMatrixAt(w, dummy.matrix);
      }
      whiteMesh.instanceMatrix.needsUpdate = true;

      for (let c = 0; c < crimsonIndexOf.length; c++) {
        const i = crimsonIndexOf[c];
        const i3 = i * 3;
        dummy.position.set(live[i3], live[i3 + 1], live[i3 + 2]);
        const s = 1.1 + Math.sin(t * 1.4 + phases[i]) * 0.25;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        crimsonMesh.setMatrixAt(c, dummy.matrix);
      }
      crimsonMesh.instanceMatrix.needsUpdate = true;

      // Proximity links
      let edge = 0;
      for (let i = 0; i < NODE_COUNT && edge < MAX_EDGES; i++) {
        for (let j = i + 1; j < NODE_COUNT && edge < MAX_EDGES; j++) {
          const dx = live[i * 3] - live[j * 3];
          const dy = live[i * 3 + 1] - live[j * 3 + 1];
          const dz = live[i * 3 + 2] - live[j * 3 + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < LINK_DISTANCE) {
            const e = edge * 6;
            linePos[e] = live[i * 3];
            linePos[e + 1] = live[i * 3 + 1];
            linePos[e + 2] = live[i * 3 + 2];
            linePos[e + 3] = live[j * 3];
            linePos[e + 4] = live[j * 3 + 1];
            linePos[e + 5] = live[j * 3 + 2];
            edge++;
          }
        }
      }
      lineGeo.setDrawRange(0, edge * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineMat.opacity = 0.12 + Math.sin(t * 0.5) * 0.04;

      renderer.autoClear = true;
      renderer.render(scene, camera);
      renderer.autoClear = false;
      renderer.render(overlayScene, overlayCam);

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncSize);
      listenTarget.removeEventListener("mousemove", onMove);
      listenTarget.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      sphereGeo.dispose();
      whiteMat.dispose();
      crimsonMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      aura.geometry.dispose();
      auraMat.dispose();
      crtMat.dispose();
      renderer.dispose();
    };
  }, [sectionRef]);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 h-full w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />
    </div>
  );
}
