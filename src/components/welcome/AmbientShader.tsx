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
uniform vec3 uColorGlow;
uniform vec3 uColorAccent;

// 2D value noise — cheap, smooth enough for slow drift
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float t = uTime * 0.03;

  // Layered slow blobs of glow over near-black base
  float glow = noise(uv * 1.6 + vec2(t * 0.6, -t * 0.4));
  float accent = noise(uv * 1.1 - vec2(t * 0.3, t * 0.5));

  // Soft vignette — keep most of the canvas usable, only fade the very edges
  vec2 centered = uv - 0.5;
  float vignette = 1.0 - smoothstep(0.55, 1.15, length(centered));

  vec3 col = uColorBase;
  // Boosted glow: wider smoothstep range, much higher mix amount
  col = mix(col, uColorGlow, smoothstep(0.2, 0.8, glow) * 0.85 * vignette);
  col = mix(col, uColorAccent, smoothstep(0.35, 0.9, accent) * 0.4 * vignette);
  // Constant low-level brand tint so it's never pure void
  col += uColorGlow * 0.05;

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

    // Theme-independent refined palette — near-black base with indigo glow
    // and a whisper of plum. Brand-anchored but restrained.
    const base = '#0a0a0f'; // page bg, matches orchestrator
    const glow = '#4f46e5'; // brand indigo, slightly deeper
    const accent = '#7c1d6f'; // muted plum, used sparingly

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uTime: { value: 0 },
        uColorBase: { value: hexToRgb(base) },
        uColorGlow: { value: hexToRgb(glow) },
        uColorAccent: { value: hexToRgb(accent) },
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
