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
  flash: number;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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
  const vx = b.x - a.x, vy = b.y - a.y;
  const wx = px - a.x, wy = py - a.y;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return { d: Math.hypot(px - a.x, py - a.y), p: a };
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return { d: Math.hypot(px - b.x, py - b.y), p: b };
  const t = c1 / c2;
  const p = { x: a.x + t * vx, y: a.y + t * vy };
  return { d: Math.hypot(px - p.x, py - p.y), p };
}

function jagged(ctx: CanvasRenderingContext2D, a: Point, b: Point, seed: number, alpha: number) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const wave = Math.sin(seed * 7.7 + i * 9.1) * 0.7 + Math.sin(seed * 2.3 + i * 4.2) * 0.3;
    const off = wave * 12 * Math.sin(t * Math.PI);
    ctx.lineTo(lerp(a.x, b.x, t) + nx * off, lerp(a.y, b.y, t) + ny * off);
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
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
    const key = new THREE.DirectionalLight(0xffffff, 5.5); key.position.set(3.2, 4.8, 7); scene.add(key);
    const cool = new THREE.DirectionalLight(0x294a86, 3.8); cool.position.set(-5, 1.5, -1.5); scene.add(cool);
    const warm = new THREE.PointLight(0xff4d0a, 42, 6.5, 1.5); warm.position.set(-0.55, 0.55, 1.5); scene.add(warm);

    const group = new THREE.Group();
    group.position.set(0.78, -0.08, 0);
    group.rotation.set(-0.08, -0.12, -0.06);
    scene.add(group);

    const metal = () => new THREE.MeshPhysicalMaterial({
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
    const edgeMaterial = () => new THREE.LineBasicMaterial({ color: 0x667382, transparent: true, opacity: 0.34 });
    const hotMaterial = new THREE.MeshStandardMaterial({ color: 0x511200, emissive: 0xff3d00, emissiveIntensity: 7.5, metalness: 0.45, roughness: 0.18 });

    const panels: PanelRecord[] = [];
    let order = 0;
    const addPanel = (root: THREE.Group, arm: number, w: number, h: number, d: number, x: number, y: number, z: number, rz: number, slant = 0.12) => {
      const geometry = panelGeometry(w, h, d, slant);
      const mesh = new THREE.Mesh(geometry, metal());
      mesh.position.set(x, y, z);
      mesh.rotation.set(0.02 * Math.sin(order), -0.02 * Math.cos(order), rz);
      root.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 28), edgeMaterial());
      edges.position.copy(mesh.position); edges.rotation.copy(mesh.rotation); root.add(edges);
      const outward = new THREE.Vector3(x, y, z + 0.35).normalize();
      outward.x += Math.sin((order + 1) * 2.17) * 0.34;
      outward.y += Math.cos((order + 1) * 1.73) * 0.28;
      outward.z += Math.sin((order + 1) * 0.87) * 0.58;
      outward.normalize();
      panels.push({
        mesh, edges, base: mesh.position.clone(), baseRot: mesh.rotation.clone(), explodeDir: outward,
        spinAxis: new THREE.Vector3(Math.sin(order * 1.31 + .3), Math.cos(order * .93 + .7), Math.sin(order * .61 + 1.1)).normalize(),
        spinSpeed: 0.72 + (order % 5) * 0.16,
        delay: (order % 6) * 0.019,
        shapeIdx: arm,
        flash: 0,
      });
      order++;
    };

    // Reconstructed 3-arm symbol: each arm is intentionally split into independent beveled panels.
    for (let arm = 0; arm < 3; arm++) {
      const root = new THREE.Group();
      root.rotation.z = arm * Math.PI * 2 / 3;
      group.add(root);
      addPanel(root, arm, .50, 2.25, .30, -.42, 1.16, 0.01, -.20, .08);
      addPanel(root, arm, 1.05, .43, .31, -.03, .38, .015, .045, .09);
      addPanel(root, arm, .43, 1.28, .29, .48, .86, -.01, .23, .07);
      addPanel(root, arm, .72, .40, .31, .39, .12, .03, -.13, .10);
      const accentGeo = panelGeometry(.14, .78, .075, .02);
      const accent = new THREE.Mesh(accentGeo, hotMaterial.clone());
      accent.position.set(-.33, 1.28, .205);
      accent.rotation.z = -.20;
      root.add(accent);
    }

    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2(-9, -9);
    const pointer = { x: -9999, y: -9999, inside: false };
    let hovered: THREE.Mesh | null = null;
    let rotY = -0.18, rotX = -0.08;
    let clickBurst = 0, hoverAmt = 0, holdTime = 0, vibrateAmt = 0;
    let holding = false, blastPlayed = false, sparkWasAway = true;
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
      const c = audio(); const o = c.createOscillator(); const g = c.createGain();
      o.type = "sine"; o.frequency.value = freq; g.gain.value = .018;
      g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + .06);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + .065);
    };
    const sparkSound = () => {
      if (!audioCtx) return;
      const c = audio(); const b = c.createBuffer(1, Math.floor(c.sampleRate * .08), c.sampleRate); const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
      const s = c.createBufferSource(); const f = c.createBiquadFilter(); const g = c.createGain();
      s.buffer = b; f.type = "bandpass"; f.frequency.value = 2900; f.Q.value = .8; g.gain.value = .045;
      s.connect(f); f.connect(g); g.connect(c.destination); s.start();
    };
    const explodeSound = () => {
      const c = audio(); const b = c.createBuffer(1, Math.floor(c.sampleRate * .55), c.sampleRate); const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.3);
      const s = c.createBufferSource(); const low = c.createBiquadFilter(); const g = c.createGain();
      s.buffer = b; low.type = "lowpass"; low.frequency.setValueAtTime(1000, c.currentTime); low.frequency.exponentialRampToValueAtTime(105, c.currentTime + .5);
      g.gain.setValueAtTime(.18, c.currentTime); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + .55);
      s.connect(low); low.connect(g); g.connect(c.destination); s.start();
      woosh = c.createOscillator(); wooshGain = c.createGain(); woosh.type = "sawtooth"; woosh.frequency.value = 52; wooshGain.gain.value = .012;
      woosh.connect(wooshGain); wooshGain.connect(c.destination); woosh.start();
    };
    const stopWoosh = () => {
      if (!audioCtx || !woosh || !wooshGain) return;
      const t = audioCtx.currentTime;
      wooshGain.gain.setValueAtTime(Math.max(wooshGain.gain.value, .0002), t);
      wooshGain.gain.exponentialRampToValueAtTime(.0001, t + .3);
      woosh.stop(t + .31); woosh = null; wooshGain = null;
    };

    const ctx = lineCanvas.getContext("2d");
    if (!ctx) return;
    let width = 1, height = 1, dpr = 1;
    const lines = (): [Point[], Point[], Point[]] => {
      const c = { x: width * .55, y: height * .48 };
      return [
        [{ x: width * -.03, y: height * .95 }, c, { x: width * 1.04, y: height * .08 }],
        [{ x: width * .05, y: height * .70 }, c, { x: width * 1.02, y: height * .18 }],
        [{ x: width * -.03, y: height * .42 }, c, { x: width * 1.04, y: height * .32 }],
      ];
    };

    const resize = () => {
      const r = mount.getBoundingClientRect(); width = Math.max(1, r.width); height = Math.max(1, r.height); dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
      lineCanvas.width = Math.floor(width * dpr); lineCanvas.height = Math.floor(height * dpr); lineCanvas.style.width = `${width}px`; lineCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); const ro = new ResizeObserver(resize); ro.observe(mount);

    const setPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.inside = pointer.x >= 0 && pointer.x <= r.width && pointer.y >= 0 && pointer.y <= r.height;
      mouseNdc.x = (pointer.x / r.width) * 2 - 1; mouseNdc.y = -(pointer.y / r.height) * 2 + 1;
    };
    const move = (e: PointerEvent) => setPointer(e);
    const leave = () => { pointer.inside = false; mouseNdc.set(-9, -9); sparkWasAway = true; };
    const down = (e: PointerEvent) => {
      setPointer(e); audio(); raycaster.setFromCamera(mouseNdc, camera);
      if (!raycaster.intersectObjects(panels.map(p => p.mesh), false).length) return;
      holding = true; holdTime = 0; vibrateAmt = 1; blastPlayed = false;
      mount.setPointerCapture?.(e.pointerId);
    };
    const up = () => { holding = false; blastPlayed = false; stopWoosh(); };
    mount.addEventListener("pointermove", move); mount.addEventListener("pointerleave", leave); mount.addEventListener("pointerdown", down); window.addEventListener("pointerup", up); window.addEventListener("blur", up);

    const vibrateEls = Array.from(document.querySelectorAll<HTMLElement>("[data-vibrate]"));
    const started = performance.now();
    const clock = new THREE.Clock();

    const drawLines = (now: number, scrollP: number) => {
      ctx.clearRect(0, 0, width, height);
      const lp = lines();
      ctx.lineWidth = 1;
      lp.forEach((pts, i) => {
        const t = clamp(intro - i * .08);
        const a = pts[0], m = pts[1], b = pts[2];
        const e = t < .5 ? { x: lerp(a.x, m.x, t * 2), y: lerp(a.y, m.y, t * 2) } : { x: lerp(m.x, b.x, (t - .5) * 2), y: lerp(m.y, b.y, (t - .5) * 2) };
        ctx.strokeStyle = `rgba(150,160,168,${.10 + scrollP * .06})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(t < .5 ? e.x : m.x, t < .5 ? e.y : m.y); if (t >= .5) ctx.lineTo(e.x, e.y); ctx.stroke();
      });

      let hit: { line: number; p: Point; d: number } | null = null;
      if (pointer.inside && intro > .98 && scrollP < .22) {
        lp.forEach((pts, li) => {
          for (let i = 0; i < 2; i++) {
            const r = pointSegDistance(pointer.x, pointer.y, pts[i], pts[i + 1]);
            if (r.d < 14 && (!hit || r.d < hit.d)) hit = { line: li, p: r.p, d: r.d };
          }
        });
      }
      if (hit && sparkWasAway && now - lastSpark > 85) {
        sparkWasAway = false; lastSpark = now; sparkSound();
        const others = [0, 1, 2].filter(i => i !== hit!.line).sort(() => Math.random() - .5).slice(0, Math.random() > .5 ? 2 : 1);
        others.forEach((li, oi) => {
          const target = lp[li][1];
          const count = 5 + Math.floor(Math.random() * 2);
          for (let k = 0; k < count; k++) bolts.push({ from: { ...hit!.p }, to: { x: target.x + (Math.random() - .5) * 42, y: target.y + (Math.random() - .5) * 42 }, born: now + k * 45 + oi * 18, life: 145, seed: Math.random() * 100 });
          for (let k = 0; k < 26; k++) sparks.push({ x: hit!.p.x, y: hit!.p.y, vx: (Math.random() - .5) * 5.5, vy: (Math.random() - .5) * 5.2, born: now, life: 240 + Math.random() * 230 });
        });
      } else if (!hit) sparkWasAway = true;

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]; const age = now - b.born; if (age < 0) continue; if (age > b.life) { bolts.splice(i, 1); continue; }
        jagged(ctx, b.from, b.to, b.seed, (1 - age / b.life) * .9);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]; const age = now - s.born; if (age > s.life) { sparks.splice(i, 1); continue; }
        const t = age / 16.67; const x = s.x + s.vx * t; const y = s.y + s.vy * t + .07 * t * t;
        ctx.fillStyle = `rgba(255,116,24,${1 - age / s.life})`; ctx.beginPath(); ctx.arc(x, y, 1 + (1 - age / s.life) * 1.6, 0, Math.PI * 2); ctx.fill();
      }
    };

    const frame = () => {
      const dt = Math.min(.04, clock.getDelta()); const t = clock.elapsedTime; const now = performance.now();
      intro = clamp((now - started - 250) / 1150);
      const heroShell = mount.closest<HTMLElement>("[data-hero-shell]");
      let scrollProgress = 0;
      if (heroShell) { const r = heroShell.getBoundingClientRect(); scrollProgress = clamp(-r.top / Math.max(1, heroShell.offsetHeight - innerHeight)); }
      const scrollExplode = scrollProgress < .18 ? 0 : clamp((scrollProgress - .18) / .68) * .78;

      if (!holding) {
        rotY += matchMedia("(prefers-reduced-motion: reduce)").matches ? .0015 : .0042;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
      }
      group.rotation.x += (rotX + (pointer.inside ? mouseNdc.y * .22 : 0) - group.rotation.x) * .06;
      group.rotation.y += (rotY + (pointer.inside ? mouseNdc.x * .22 : 0) - group.rotation.y) * .06;
      group.rotation.z = -.06 + scrollProgress * .54;
      group.position.x = .78 + scrollProgress * .18;
      group.position.y = -.08 - scrollProgress * .62;
      group.position.z = scrollProgress * -.35;
      group.scale.setScalar(1 - scrollProgress * .12);
      warm.position.x = -.5 + Math.sin(t * .55) * .9; warm.position.y = .4 + Math.cos(t * .42) * .55;

      if (pointer.inside && scrollProgress < .12 && clickBurst < .05) {
        raycaster.setFromCamera(mouseNdc, camera);
        const hits = raycaster.intersectObjects(panels.map(p => p.mesh), false);
        const nowHit = hits.length ? hits[0].object as THREE.Mesh : null;
        if (nowHit !== hovered) {
          if (nowHit) { const rec = panels.find(p => p.mesh === nowHit); if (rec) rec.flash = 1; hoverBeep(470 + (panels.findIndex(p => p.mesh === nowHit) % 5) * 42); }
          hovered = nowHit;
        }
        hoverAmt += ((hits.length ? 1 : 0) - hoverAmt) * .08;
      } else { hovered = null; hoverAmt *= .92; }

      if (holding) {
        holdTime += dt; vibrateAmt = 1;
        if (holdTime >= .5) {
          if (!blastPlayed) { explodeSound(); blastPlayed = true; }
          vibrateAmt *= .88; clickBurst = Math.min(1, clickBurst + .02);
        }
      } else { vibrateAmt = Math.max(0, vibrateAmt - .08); clickBurst = Math.max(0, clickBurst - .025); }
      const burstContrib = scrollProgress < .15 ? clickBurst : 0;
      const explodeAmt = Math.max(scrollExplode, hoverAmt * .035, burstContrib);

      panels.forEach((p) => {
        p.flash *= .92; const f = p.flash; const m = p.mesh.material;
        m.envMapIntensity = 3 + f * 1.6; m.transmission = .04 + f * .31; m.roughness = .12 - f * .05; m.clearcoatRoughness = .03 - f * .018;
        const phase = p.shapeIdx * Math.PI * 2 / 3;
        const dx = Math.sin(t * .4 + phase) * .012 * (1 - explodeAmt);
        const dy = Math.cos(t * .35 + phase) * .008 * (1 - explodeAmt);
        const dz = Math.sin(t * .3 + phase * 1.5) * .006 * (1 - explodeAmt);
        const amt = Math.max(0, explodeAmt - p.delay); const burst = amt * 5.5;
        const magnet = hovered === p.mesh ? .06 : 0;
        p.mesh.position.set(p.base.x + p.explodeDir.x * burst + dx + mouseNdc.x * magnet, p.base.y + p.explodeDir.y * burst + dy + mouseNdc.y * magnet, p.base.z + p.explodeDir.z * burst + dz + magnet * .3);
        p.mesh.rotation.set(p.baseRot.x + p.spinAxis.x * p.spinSpeed * amt * Math.PI, p.baseRot.y + p.spinAxis.y * p.spinSpeed * amt * Math.PI, p.baseRot.z + p.spinAxis.z * p.spinSpeed * amt * Math.PI);
        p.edges.position.copy(p.mesh.position); p.edges.rotation.copy(p.mesh.rotation); p.edges.material.opacity = .26 + f * .48;
      });

      if (vibrateAmt > .001) {
        const sx = Math.sin(t * 98) * 2.0 * vibrateAmt; const sy = Math.cos(t * 121) * 1.6 * vibrateAmt;
        vibrateEls.forEach(el => { el.style.transition = "none"; el.style.transform = `translate3d(${sx}px,${sy}px,0)`; });
      } else vibrateEls.forEach(el => { el.style.transition = "transform .7s cubic-bezier(.25,.46,.45,.94)"; el.style.transform = "translate3d(0,0,0)"; });

      drawLines(now, scrollProgress);
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(frame);

    return () => {
      renderer.setAnimationLoop(null); ro.disconnect();
      mount.removeEventListener("pointermove", move); mount.removeEventListener("pointerleave", leave); mount.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); window.removeEventListener("blur", up);
      stopWoosh(); audioCtx?.close();
      scene.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose()); else obj.material.dispose(); } if (obj instanceof THREE.LineSegments) { obj.geometry.dispose(); obj.material.dispose(); } });
      env.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-scene" ref={mountRef} aria-label="Interactive 3D Tripo symbol"><canvas ref={canvasRef} className="hero-lines" /></div>;
}
