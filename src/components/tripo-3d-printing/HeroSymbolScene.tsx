"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Point = { x: number; y: number };
type Bolt = { from: Point; to: Point; born: number; life: number; seed: number };
type Spark = { x: number; y: number; vx: number; vy: number; born: number; life: number };

type PanelRecord = {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  edges: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  base: THREE.Vector3;
  baseRot: THREE.Euler;
  explodeDir: THREE.Vector3;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
  delay: number;
  shapeIdx: number;
  seed: number;
  flash: number;
};

type FloatRecord = {
  el: HTMLElement;
  seed: number;
  strength: number;
  rotate: number;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

function panelGeometry(w: number, h: number, d: number, slant = 0.12) {
  const s = new THREE.Shape();
  s.moveTo(-w * 0.5 + slant, -h * 0.5);
  s.lineTo(w * 0.47, -h * 0.5);
  s.lineTo(w * 0.5 - slant * 0.35, h * 0.5);
  s.lineTo(-w * 0.43, h * 0.5);
  s.closePath();

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: d,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: Math.min(0.055, Math.min(w, h) * 0.08),
    bevelThickness: 0.038,
    steps: 1,
    curveSegments: 1,
  });

  geo.computeBoundingBox();
  if (geo.boundingBox) {
    const c = new THREE.Vector3();
    geo.boundingBox.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function pointSegDistance(px: number, py: number, a: Point, b: Point) {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const wx = px - a.x;
  const wy = py - a.y;
  const c1 = vx * wx + vy * wy;

  if (c1 <= 0) return { d: Math.hypot(px - a.x, py - a.y), p: a };

  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return { d: Math.hypot(px - b.x, py - b.y), p: b };

  const t = c1 / c2;
  const p = { x: a.x + t * vx, y: a.y + t * vy };
  return { d: Math.hypot(px - p.x, py - p.y), p };
}

function jagged(
  ctx: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  seed: number,
  alpha: number
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);

  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const wave =
      Math.sin(seed * 7.7 + i * 9.1) * 0.7 +
      Math.sin(seed * 2.3 + i * 4.2) * 0.3;
    const off = wave * 12 * Math.sin(t * Math.PI);
    ctx.lineTo(
      lerp(a.x, b.x, t) + nx * off,
      lerp(a.y, b.y, t) + ny * off
    );
  }

  ctx.lineTo(b.x, b.y);
  ctx.shadowColor = "rgba(255,92,12,.95)";
  ctx.shadowBlur = 18;
  ctx.lineWidth = 4;
  ctx.strokeStyle = `rgba(255,94,16,${alpha})`;
  ctx.stroke();

  ctx.shadowBlur = 4;
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(255,245,224,${Math.min(1, alpha * 1.4)})`;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function HeroSymbolScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const lineCanvas = canvasRef.current;
    if (!mount || !lineCanvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0, 0, 9.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.domElement.className = "hero-webgl";
    mount.prepend(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    scene.environment = env;

    const hemi = new THREE.HemisphereLight(0x9cb1d3, 0x020203, 1.05);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 5.5);
    key.position.set(3.2, 4.8, 7);
    scene.add(key);

    const cool = new THREE.DirectionalLight(0x294a86, 3.8);
    cool.position.set(-5, 1.5, -1.5);
    scene.add(cool);

    const warm = new THREE.PointLight(0xff4d0a, 42, 6.5, 1.5);
    warm.position.set(-0.55, 0.55, 1.5);
    scene.add(warm);

    const group = new THREE.Group();
    group.position.set(0.78, -0.08, 0);
    group.rotation.set(-0.08, -0.12, -0.06);
    scene.add(group);

    const metal = () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x05070a,
        metalness: 0.98,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMapIntensity: 3,
        reflectivity: 1,
        transmission: 0.04,
        thickness: 0.45,
        ior: 1.48,
      });

    const hotMetal = () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x351006,
        emissive: 0xff3d00,
        emissiveIntensity: 6.8,
        metalness: 0.78,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.8,
        reflectivity: 1,
        transmission: 0.02,
        thickness: 0.18,
        ior: 1.45,
      });

    const edgeMaterial = (hot = false) =>
      new THREE.LineBasicMaterial({
        color: hot ? 0xff7a2a : 0x667382,
        transparent: true,
        opacity: hot ? 0.46 : 0.34,
      });

    const panels: PanelRecord[] = [];
    let order = 0;

    const addPanel = (
      root: THREE.Group,
      arm: number,
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      rz: number,
      slant = 0.12,
      hot = false
    ) => {
      const geometry = panelGeometry(w, h, d, slant);
      const mesh = new THREE.Mesh(geometry, hot ? hotMetal() : metal());

      mesh.position.set(x, y, z);
      mesh.rotation.set(
        0.02 * Math.sin(order),
        -0.02 * Math.cos(order),
        rz
      );
      root.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 28),
        edgeMaterial(hot)
      );
      edges.position.copy(mesh.position);
      edges.rotation.copy(mesh.rotation);
      root.add(edges);

      // The direction is deterministic. This gives the same fragment path
      // every time the user holds, just like the reference behavior.
      const outward = new THREE.Vector3(x, y, z + 0.25).normalize();
      outward.x += Math.sin((order + 1) * 2.17) * 0.58;
      outward.y += Math.cos((order + 1) * 1.73) * 0.46;
      outward.z += Math.sin((order + 1) * 0.87) * 0.92;
      outward.normalize();

      const seed = (order + 1) * 1.61803398875;

      panels.push({
        mesh,
        edges,
        base: mesh.position.clone(),
        baseRot: mesh.rotation.clone(),
        explodeDir: outward,
        spinAxis: new THREE.Vector3(
          Math.sin(order * 1.31 + 0.3),
          Math.cos(order * 0.93 + 0.7),
          Math.sin(order * 0.61 + 1.1)
        ).normalize(),
        spinSpeed: 0.88 + (order % 5) * 0.19,
        delay: (order % 6) * 0.025,
        shapeIdx: arm,
        seed,
        flash: 0,
      });

      order += 1;
    };

    // Three segmented arms. The illuminated accent is also a blast fragment
    // so no part of the symbol remains artificially "stuck" during explosion.
    for (let arm = 0; arm < 3; arm++) {
      const root = new THREE.Group();
      root.rotation.z = (arm * Math.PI * 2) / 3;
      group.add(root);

      addPanel(root, arm, 0.5, 2.25, 0.3, -0.42, 1.16, 0.01, -0.2, 0.08);
      addPanel(root, arm, 1.05, 0.43, 0.31, -0.03, 0.38, 0.015, 0.045, 0.09);
      addPanel(root, arm, 0.43, 1.28, 0.29, 0.48, 0.86, -0.01, 0.23, 0.07);
      addPanel(root, arm, 0.72, 0.4, 0.31, 0.39, 0.12, 0.03, -0.13, 0.1);
      addPanel(root, arm, 0.14, 0.78, 0.075, -0.33, 1.28, 0.205, -0.2, 0.02, true);
    }

    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2(-9, -9);

    const pointer = {
      x: -9999,
      y: -9999,
      inside: false,
    };

    let hovered: THREE.Mesh | null = null;
    let rotY = -0.18;
    let rotX = -0.08;

    let clickBurst = 0;
    let blastTarget = 0;
    let hoverAmt = 0;
    let holdTime = 0;
    let chargeAmt = 0;
    let holding = false;
    let blastPlayed = false;
    let sparkWasAway = true;
    let intro = 0;
    let lastSpark = 0;

    const bolts: Bolt[] = [];
    const sparks: Spark[] = [];

    let audioCtx: AudioContext | null = null;
    let woosh: OscillatorNode | null = null;
    let wooshGain: GainNode | null = null;

    const audio = () => {
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") void audioCtx.resume();
      return audioCtx;
    };

    const hoverBeep = (freq: number) => {
      if (!audioCtx) return;
      const c = audio();
      const o = c.createOscillator();
      const g = c.createGain();

      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.018;
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.06);

      o.connect(g);
      g.connect(c.destination);
      o.start();
      o.stop(c.currentTime + 0.065);
    };

    const sparkSound = () => {
      if (!audioCtx) return;
      const c = audio();
      const b = c.createBuffer(
        1,
        Math.floor(c.sampleRate * 0.08),
        c.sampleRate
      );
      const d = b.getChannelData(0);

      for (let i = 0; i < d.length; i++) {
        d[i] =
          (Math.random() * 2 - 1) *
          Math.pow(1 - i / d.length, 2);
      }

      const s = c.createBufferSource();
      const f = c.createBiquadFilter();
      const g = c.createGain();

      s.buffer = b;
      f.type = "bandpass";
      f.frequency.value = 2900;
      f.Q.value = 0.8;
      g.gain.value = 0.045;

      s.connect(f);
      f.connect(g);
      g.connect(c.destination);
      s.start();
    };

    const explodeSound = () => {
      const c = audio();
      const b = c.createBuffer(
        1,
        Math.floor(c.sampleRate * 0.55),
        c.sampleRate
      );
      const d = b.getChannelData(0);

      for (let i = 0; i < d.length; i++) {
        d[i] =
          (Math.random() * 2 - 1) *
          Math.pow(1 - i / d.length, 2.3);
      }

      const s = c.createBufferSource();
      const low = c.createBiquadFilter();
      const g = c.createGain();

      s.buffer = b;
      low.type = "lowpass";
      low.frequency.setValueAtTime(1000, c.currentTime);
      low.frequency.exponentialRampToValueAtTime(105, c.currentTime + 0.5);

      g.gain.setValueAtTime(0.18, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.55);

      s.connect(low);
      low.connect(g);
      g.connect(c.destination);
      s.start();

      woosh = c.createOscillator();
      wooshGain = c.createGain();
      woosh.type = "sawtooth";
      woosh.frequency.value = 52;
      wooshGain.gain.value = 0.012;
      woosh.connect(wooshGain);
      wooshGain.connect(c.destination);
      woosh.start();
    };

    const stopWoosh = () => {
      if (!audioCtx || !woosh || !wooshGain) return;

      const now = audioCtx.currentTime;
      wooshGain.gain.setValueAtTime(
        Math.max(wooshGain.gain.value, 0.0002),
        now
      );
      wooshGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.3
      );
      woosh.stop(now + 0.31);
      woosh = null;
      wooshGain = null;
    };

    const ctx = lineCanvas.getContext("2d");
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;

    const lines = (): [Point[], Point[], Point[]] => {
      const c = { x: width * 0.55, y: height * 0.48 };

      return [
        [
          { x: width * -0.03, y: height * 0.95 },
          c,
          { x: width * 1.04, y: height * 0.08 },
        ],
        [
          { x: width * 0.05, y: height * 0.7 },
          c,
          { x: width * 1.02, y: height * 0.18 },
        ],
        [
          { x: width * -0.03, y: height * 0.42 },
          c,
          { x: width * 1.04, y: height * 0.32 },
        ],
      ];
    };

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio, 2);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      lineCanvas.width = Math.floor(width * dpr);
      lineCanvas.height = Math.floor(height * dpr);
      lineCanvas.style.width = `${width}px`;
      lineCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const setPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside =
        pointer.x >= 0 &&
        pointer.x <= rect.width &&
        pointer.y >= 0 &&
        pointer.y <= rect.height;

      mouseNdc.x = (pointer.x / rect.width) * 2 - 1;
      mouseNdc.y = -(pointer.y / rect.height) * 2 + 1;
    };

    const getHeroProgress = () => {
      const heroShell = mount.closest<HTMLElement>("[data-hero-shell]");
      if (!heroShell) return 0;

      const rect = heroShell.getBoundingClientRect();
      return clamp(
        -rect.top /
          Math.max(1, heroShell.offsetHeight - window.innerHeight)
      );
    };

    const move = (e: PointerEvent) => setPointer(e);

    const leave = () => {
      pointer.inside = false;
      mouseNdc.set(-9, -9);
      sparkWasAway = true;
    };

    const down = (e: PointerEvent) => {
      setPointer(e);

      // Hold-to-blast works on the whole hero canvas instead of requiring
      // a precise click on a mesh. This matches the screen-hold gesture.
      if (getHeroProgress() > 0.16) return;

      audio();
      holding = true;
      holdTime = 0;
      chargeAmt = 0;
      blastTarget = 0;
      blastPlayed = false;
      mount.style.cursor = "grabbing";
      mount.setPointerCapture?.(e.pointerId);
    };

    const up = () => {
      holding = false;
      chargeAmt = 0;
      blastTarget = 0;
      blastPlayed = false;
      mount.style.cursor = "crosshair";
      stopWoosh();
    };

    mount.addEventListener("pointermove", move);
    mount.addEventListener("pointerleave", leave);
    mount.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", up);

    const collectFloatEls = (): FloatRecord[] => {
      const definitions: Array<{
        selector: string;
        strength: number;
        rotate: number;
      }> = [
        { selector: ".site-nav .brand", strength: 0.24, rotate: 2.2 },
        { selector: ".site-nav .nav-actions", strength: 0.3, rotate: 2.6 },
        { selector: ".hero-copy", strength: 1, rotate: 10 },
        { selector: ".hero-right-meta", strength: 0.72, rotate: 7.5 },
        { selector: ".hero-instruction", strength: 0.78, rotate: 6.8 },
        { selector: ".hero-scroll-dot", strength: 0.44, rotate: 5.2 },
      ];

      return definitions
        .map((item, index) => {
          const el = document.querySelector<HTMLElement>(item.selector);
          if (!el) return null;

          el.style.willChange = "transform";
          el.style.transformOrigin = "center center";

          return {
            el,
            seed: 1.35 + index * 2.173,
            strength: item.strength,
            rotate: item.rotate,
          };
        })
        .filter((item): item is FloatRecord => Boolean(item));
    };

    const floatEls = collectFloatEls();

    const applyDomBlast = (t: number) => {
      const blast = clickBurst;
      const charge = holding && holdTime < 0.5 ? chargeAmt : 0;

      floatEls.forEach((item, index) => {
        const { el, seed, strength, rotate } = item;

        if (blast < 0.001 && charge < 0.001) {
          el.style.transform = "translate3d(0,0,0) rotate(0deg)";
          return;
        }

        // Charge = tiny high-frequency pressure vibration.
        const chargeX =
          Math.sin(t * 78 + seed) * 2.3 * charge * strength;
        const chargeY =
          Math.cos(t * 91 + seed * 1.2) * 1.7 * charge * strength;

        // Blast = large independent drift + a slower, living movement.
        // Every interface group follows a deterministic direction so repeated
        // holds feel intentional instead of random.
        const dirX = Math.sin(seed * 1.71);
        const dirY = Math.cos(seed * 1.29);
        const travel = 112 * strength;

        const liveX =
          Math.sin(t * (0.68 + index * 0.035) + seed) *
          14 *
          strength *
          blast;
        const liveY =
          Math.cos(t * (0.58 + index * 0.028) + seed * 0.77) *
          11 *
          strength *
          blast;

        const x =
          chargeX +
          dirX * travel * blast +
          liveX;
        const y =
          chargeY +
          dirY * travel * 0.72 * blast +
          liveY;

        const r =
          (Math.sin(seed * 0.83) * rotate * blast) +
          Math.sin(t * 0.44 + seed) * 1.9 * strength * blast;

        const scale = 1 - blast * 0.018 * strength;

        el.style.transform =
          `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) ` +
          `rotate(${r.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      });
    };

    const started = performance.now();
    const clock = new THREE.Clock();

    const drawLines = (
      now: number,
      scrollProgress: number
    ) => {
      ctx.clearRect(0, 0, width, height);

      const pathLines = lines();
      ctx.lineWidth = 1;

      pathLines.forEach((pts, i) => {
        const t = clamp(intro - i * 0.08);
        const a = pts[0];
        const m = pts[1];
        const b = pts[2];

        const end =
          t < 0.5
            ? {
                x: lerp(a.x, m.x, t * 2),
                y: lerp(a.y, m.y, t * 2),
              }
            : {
                x: lerp(m.x, b.x, (t - 0.5) * 2),
                y: lerp(m.y, b.y, (t - 0.5) * 2),
              };

        const blastFade = 1 - clickBurst * 0.38;

        ctx.strokeStyle =
          `rgba(150,160,168,${(0.1 + scrollProgress * 0.06) * blastFade})`;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(t < 0.5 ? end.x : m.x, t < 0.5 ? end.y : m.y);

        if (t >= 0.5) ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });

      let hit: { line: number; p: Point; d: number } | null = null;

      if (
        pointer.inside &&
        intro > 0.98 &&
        scrollProgress < 0.22 &&
        clickBurst < 0.08
      ) {
        pathLines.forEach((pts, lineIndex) => {
          for (let i = 0; i < 2; i++) {
            const result = pointSegDistance(
              pointer.x,
              pointer.y,
              pts[i],
              pts[i + 1]
            );

            if (
              result.d < 14 &&
              (!hit || result.d < hit.d)
            ) {
              hit = {
                line: lineIndex,
                p: result.p,
                d: result.d,
              };
            }
          }
        });
      }

      if (hit && sparkWasAway && now - lastSpark > 85) {
        sparkWasAway = false;
        lastSpark = now;
        sparkSound();

        const otherLines = [0, 1, 2]
          .filter((i) => i !== hit!.line)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.random() > 0.5 ? 2 : 1);

        otherLines.forEach((lineIndex, otherIndex) => {
          const target = pathLines[lineIndex][1];
          const count = 5 + Math.floor(Math.random() * 2);

          for (let k = 0; k < count; k++) {
            bolts.push({
              from: { ...hit!.p },
              to: {
                x: target.x + (Math.random() - 0.5) * 42,
                y: target.y + (Math.random() - 0.5) * 42,
              },
              born: now + k * 45 + otherIndex * 18,
              life: 145,
              seed: Math.random() * 100,
            });
          }

          for (let k = 0; k < 26; k++) {
            sparks.push({
              x: hit!.p.x,
              y: hit!.p.y,
              vx: (Math.random() - 0.5) * 5.5,
              vy: (Math.random() - 0.5) * 5.2,
              born: now,
              life: 240 + Math.random() * 230,
            });
          }
        });
      } else if (!hit) {
        sparkWasAway = true;
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        const age = now - bolt.born;

        if (age < 0) continue;
        if (age > bolt.life) {
          bolts.splice(i, 1);
          continue;
        }

        jagged(
          ctx,
          bolt.from,
          bolt.to,
          bolt.seed,
          (1 - age / bolt.life) * 0.9
        );
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        const age = now - spark.born;

        if (age > spark.life) {
          sparks.splice(i, 1);
          continue;
        }

        const t = age / 16.67;
        const x = spark.x + spark.vx * t;
        const y =
          spark.y +
          spark.vy * t +
          0.07 * t * t;

        ctx.fillStyle =
          `rgba(255,116,24,${1 - age / spark.life})`;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          1 + (1 - age / spark.life) * 1.6,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    };

    const frame = () => {
      const dt = Math.min(0.04, clock.getDelta());
      const t = clock.elapsedTime;
      const now = performance.now();

      intro = clamp((now - started - 250) / 1150);

      const scrollProgress = getHeroProgress();
      const scrollExplode =
        scrollProgress < 0.18
          ? 0
          : clamp((scrollProgress - 0.18) / 0.68) * 0.78;

      if (!holding) {
        rotY += matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0.0015
          : 0.0042;
        rotX = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, rotX)
        );
      }

      if (holding) {
        holdTime += dt;
        chargeAmt = clamp(holdTime / 0.5);

        if (holdTime >= 0.5) {
          const blastTime = holdTime - 0.5;
          blastTarget = easeOutCubic(blastTime / 0.52);

          if (!blastPlayed) {
            explodeSound();
            blastPlayed = true;
          }
        }
      } else {
        chargeAmt = Math.max(0, chargeAmt - dt * 7);
        blastTarget = 0;
      }

      // Fast outward burst, slower cinematic reassembly.
      const response = blastTarget > clickBurst ? 12.5 : 5.6;
      clickBurst +=
        (blastTarget - clickBurst) *
        (1 - Math.exp(-dt * response));

      if (!holding && clickBurst < 0.0006) {
        clickBurst = 0;
      }

      const pointerX =
        pointer.inside ? mouseNdc.x * 0.22 : 0;
      const pointerY =
        pointer.inside ? mouseNdc.y * 0.22 : 0;

      const blastRoll =
        Math.sin(t * 0.43) * 0.12 * clickBurst;
      const blastPitch =
        Math.cos(t * 0.37) * 0.1 * clickBurst;

      group.rotation.x +=
        (
          rotX +
          pointerY +
          blastPitch -
          group.rotation.x
        ) * 0.06;

      group.rotation.y +=
        (
          rotY +
          pointerX +
          Math.sin(t * 0.31) * 0.14 * clickBurst -
          group.rotation.y
        ) * 0.06;

      group.rotation.z =
        -0.06 +
        scrollProgress * 0.54 +
        blastRoll;

      group.position.x =
        0.78 +
        scrollProgress * 0.18 +
        Math.sin(t * 0.51) * 0.12 * clickBurst;

      group.position.y =
        -0.08 -
        scrollProgress * 0.62 +
        Math.cos(t * 0.47) * 0.09 * clickBurst;

      group.position.z =
        scrollProgress * -0.35 +
        Math.sin(t * 0.35) * 0.08 * clickBurst;

      const chargeCompression =
        holding && holdTime < 0.5
          ? 1 - chargeAmt * 0.025
          : 1;

      group.scale.setScalar(
        (1 - scrollProgress * 0.12) *
          chargeCompression
      );

      warm.position.x =
        -0.5 +
        Math.sin(t * 0.55) * 0.9;
      warm.position.y =
        0.4 +
        Math.cos(t * 0.42) * 0.55;

      if (
        pointer.inside &&
        scrollProgress < 0.12 &&
        clickBurst < 0.05
      ) {
        raycaster.setFromCamera(mouseNdc, camera);

        const hits = raycaster.intersectObjects(
          panels.map((panel) => panel.mesh),
          false
        );

        const nextHovered =
          hits.length > 0
            ? (hits[0].object as THREE.Mesh)
            : null;

        if (nextHovered !== hovered) {
          if (nextHovered) {
            const record = panels.find(
              (panel) => panel.mesh === nextHovered
            );

            if (record) record.flash = 1;

            hoverBeep(
              470 +
                (panels.findIndex(
                  (panel) => panel.mesh === nextHovered
                ) %
                  5) *
                  42
            );
          }

          hovered = nextHovered;
        }

        hoverAmt +=
          ((hits.length ? 1 : 0) - hoverAmt) *
          0.08;
      } else {
        hovered = null;
        hoverAmt *= 0.92;
      }

      const burstContribution =
        scrollProgress < 0.15
          ? clickBurst
          : 0;

      const explodeAmt = Math.max(
        scrollExplode,
        hoverAmt * 0.035,
        burstContribution
      );

      panels.forEach((panel) => {
        panel.flash *= 0.92;

        const flash = panel.flash;
        const material = panel.mesh.material;

        material.envMapIntensity =
          3 + flash * 1.6;
        material.transmission =
          0.04 + flash * 0.31;
        material.roughness =
          Math.max(0.035, 0.12 - flash * 0.05);
        material.clearcoatRoughness =
          Math.max(0.01, 0.03 - flash * 0.018);

        const armPhase =
          (panel.shapeIdx * Math.PI * 2) / 3;

        const idleX =
          Math.sin(t * 0.4 + armPhase) *
          0.012 *
          (1 - explodeAmt);

        const idleY =
          Math.cos(t * 0.35 + armPhase) *
          0.008 *
          (1 - explodeAmt);

        const idleZ =
          Math.sin(t * 0.3 + armPhase * 1.5) *
          0.006 *
          (1 - explodeAmt);

        const localAmt = Math.max(
          0,
          explodeAmt - panel.delay
        );

        // Reference-like large separation: some fragments leave the central
        // silhouette while others stay visible around the canvas perimeter.
        const burstDistance =
          localAmt *
          (6.25 +
            Math.sin(panel.seed * 1.41) * 1.1);

        const floatX =
          Math.sin(t * 0.55 + panel.seed) *
          0.22 *
          localAmt;

        const floatY =
          Math.cos(t * 0.48 + panel.seed * 0.82) *
          0.18 *
          localAmt;

        const floatZ =
          Math.sin(t * 0.41 + panel.seed * 1.3) *
          0.28 *
          localAmt;

        const magnet =
          hovered === panel.mesh ? 0.06 : 0;

        panel.mesh.position.set(
          panel.base.x +
            panel.explodeDir.x * burstDistance +
            idleX +
            floatX +
            mouseNdc.x * magnet,
          panel.base.y +
            panel.explodeDir.y * burstDistance +
            idleY +
            floatY +
            mouseNdc.y * magnet,
          panel.base.z +
            panel.explodeDir.z * burstDistance +
            idleZ +
            floatZ +
            magnet * 0.3
        );

        const continuedSpin =
          localAmt *
          (1 + clickBurst * 0.42) *
          Math.PI;

        panel.mesh.rotation.set(
          panel.baseRot.x +
            panel.spinAxis.x *
              panel.spinSpeed *
              continuedSpin +
            Math.sin(t * 0.34 + panel.seed) *
              0.12 *
              localAmt,
          panel.baseRot.y +
            panel.spinAxis.y *
              panel.spinSpeed *
              continuedSpin +
            Math.cos(t * 0.29 + panel.seed) *
              0.11 *
              localAmt,
          panel.baseRot.z +
            panel.spinAxis.z *
              panel.spinSpeed *
              continuedSpin +
            Math.sin(t * 0.37 + panel.seed) *
              0.14 *
              localAmt
        );

        panel.edges.position.copy(
          panel.mesh.position
        );
        panel.edges.rotation.copy(
          panel.mesh.rotation
        );
        panel.edges.material.opacity =
          0.26 + flash * 0.48;
      });

      applyDomBlast(t);
      drawLines(now, scrollProgress);
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(frame);

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();

      mount.removeEventListener("pointermove", move);
      mount.removeEventListener("pointerleave", leave);
      mount.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", up);

      floatEls.forEach(({ el }) => {
        el.style.transform = "";
        el.style.willChange = "";
        el.style.transformOrigin = "";
      });

      stopWoosh();
      audioCtx?.close();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();

          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) =>
              material.dispose()
            );
          } else {
            obj.material.dispose();
          }
        }

        if (obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });

      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="hero-scene"
      ref={mountRef}
      aria-label="Interactive 3D Tripo symbol"
    >
      <canvas
        ref={canvasRef}
        className="hero-lines"
      />
    </div>
  );
}
