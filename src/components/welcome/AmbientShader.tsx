'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useReducedMotion } from './lib/useReducedMotion';

const VERTEX = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorOrbA;
uniform vec3 uColorOrbB;

// Single hash for the film grain — kills color banding, adds tactile feel
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Soft circular glow with smooth falloff
float orb(vec2 uv, vec2 center, float radius) {
  float d = length(uv - center);
  return smoothstep(radius, 0.0, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  // Aspect-correct UVs so orbs are circular, not stretched
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Drift periods of ~15-22 seconds — visibly moving within a few seconds
  // of looking, but ambient enough not to be distracting.
  float t = uTime * 0.45;

  // Orb A — primary indigo glow, drifts in the upper-left zone.
  // Hand-placed origin (~golden ratio), slow oval orbit.
  vec2 centerA = vec2(
    0.32 * aspect + sin(t * 0.7) * 0.12 * aspect,
    0.38 + cos(t * 0.9) * 0.10
  );
  float orbA = orb(p, centerA, 0.75);

  // Orb B — smaller cool teal counterpoint in lower-right.
  // Different inner frequencies + phase so the two never sync.
  vec2 centerB = vec2(
    0.72 * aspect + sin(t * 0.6 + 1.7) * 0.11 * aspect,
    0.72 + cos(t * 0.8 + 1.1) * 0.09
  );
  float orbB = orb(p, centerB, 0.55);

  // Compose: deep base + two designed glow orbs (intentional placement,
  // not random noise — this is what separates "designed" from "AI bg").
  vec3 col = uColorBase;
  col = mix(col, uColorOrbA, orbA * 0.55);
  col = mix(col, uColorOrbB, orbB * 0.35);

  // 2% film grain — prevents banding on the long color gradients and
  // adds a tactile, photographed feel (like Linear/Vercel hero gradients).
  float grain = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.02;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export default function AmbientShader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: Math.min(2, window.devicePixelRatio),
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    Object.assign(gl.canvas.style, { width: '100%', height: '100%', display: 'block' });

    // Theme-independent designed palette: two complementary glow orbs
    // on a near-black base. Indigo + teal is a Linear/Vercel-style cool
    // duo that never goes muddy when they overlap.
    const base = '#0a0a0f'; // page bg, matches orchestrator
    const orbA = '#4f46e5'; // brand indigo — primary glow
    const orbB = '#0d9488'; // teal-600 — cool counterpoint, never warm

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uTime: { value: 0 },
        uColorBase: { value: hexToRgb(base) },
        uColorOrbA: { value: hexToRgb(orbA) },
        uColorOrbB: { value: hexToRgb(orbB) },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uResolution.value = [container.clientWidth, container.clientHeight];
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let running = true;
    const start = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      gl.canvas.remove();
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div ref={containerRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
  );
}
