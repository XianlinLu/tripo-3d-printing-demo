"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type LogoFragment = {
  component: 0 | 1;
  center: [number, number];
  points: [number, number][];
};

type FragmentRecord = {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  edges: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  base: THREE.Vector3;
  baseRot: THREE.Euler;
  explodeDir: THREE.Vector3;
  spin: THREE.Vector3;
  seed: number;
};

const LOGO_FRAGMENTS: LogoFragment[] = [
  {"component":0,"center":[-1.6874,1.2081],"points":[[-0.1726,0.2861],[-0.247,0.1559],[-0.2966,-0.0239],[-0.2966,-0.1851],[-0.2756,-0.2657],[0.4182,-0.2657],[0.001,0.4473],[-0.0238,0.4411]]},
  {"component":0,"center":[-1.392,0.4851],"points":[[-0.5548,0.3953],[-0.0183,-0.5347],[0.4,-0.5347],[0.4,-0.0163],[0.1228,0.4573],[-0.571,0.4573]]},
  {"component":0,"center":[1.3445,0.3936],"points":[[0.5341,0.369],[-0.1851,0.369],[-0.3525,0.0835],[-0.3525,-0.4432],[0.059,-0.4432]]},
  {"component":0,"center":[0.889,0.126],"points":[[-0.206,-0.1756],[0.103,-0.1756],[0.103,0.3512]]},
  {"component":0,"center":[-0.8909,0.1232],"points":[[-0.1011,0.3456],[-0.1011,-0.1728],[0.2022,-0.1728]]},
  {"component":0,"center":[1.1292,-0.2841],"points":[[0.2743,0.2345],[-0.1372,0.2345],[-0.1372,-0.469]]},
  {"component":0,"center":[-1.1314,-0.2872],"points":[[0.1394,-0.4751],[0.1394,0.2376],[-0.2789,0.2376]]},
  {"component":0,"center":[0.6475,-0.6186],"points":[[0.3445,-0.1345],[0.3445,0.569],[0.0356,0.569],[-0.4553,-0.268],[-0.5111,-0.3238],[-0.5669,-0.3548],[-0.6475,-0.3672],[-0.6475,-0.423],[0.1757,-0.423]]},
  {"component":0,"center":[-0.6504,-0.6203],"points":[[-0.1777,-0.4213],[0.6504,-0.4213],[0.6504,-0.3655],[0.6008,-0.3655],[0.5078,-0.3221],[0.4334,-0.2353],[-0.0383,0.5707],[-0.3416,0.5707],[-0.3416,-0.142]]},
  {"component":0,"center":[-0.3164,-1.3475],"points":[[-0.2788,-0.0909],[-0.1796,-0.2273],[-0.1052,-0.2955],[0.0498,-0.3823],[0.1242,-0.4071],[0.2544,-0.4319],[0.3164,-0.4319],[0.3164,0.3059],[-0.5117,0.3059]]},
  {"component":0,"center":[0.3149,-1.3477],"points":[[-0.3149,-0.4317],[-0.1351,-0.4131],[0.0323,-0.3449],[0.1129,-0.2891],[0.2059,-0.1961],[0.2617,-0.1155],[0.5083,0.3061],[-0.3149,0.3061]]},
  {"component":1,"center":[-1.0925,1.6023],"points":[[-0.1909,0.1523],[0.1005,-0.3405],[0.1005,0.1702],[-0.1909,0.1709]]},
  {"component":1,"center":[-0.493,1.4656],"points":[[-0.4494,-0.2876],[-0.4246,-0.3062],[0.493,-0.3117],[0.493,0.3047],[-0.499,0.307],[-0.499,-0.2037]]},
  {"component":1,"center":[1.4212,1.4375],"points":[[0.5566,-0.2719],[0.5504,-0.1975],[0.4698,0.0071],[0.3892,0.1187],[0.2404,0.2427],[0.1412,0.2923],[-0.0014,0.3295],[-0.4292,0.3305],[-0.4292,-0.2773]]},
  {"component":1,"center":[0.4787,1.3775],"points":[[-0.3733,-0.2243],[-0.4787,-0.4046],[-0.4787,-0.4351],[0.2428,-0.4351],[0.3707,-0.2181],[0.5133,-0.2174],[0.5133,0.3904],[-0.4787,0.3927],[-0.4787,-0.2237]]},
  {"component":1,"center":[0.2477,0.5592],"points":[[0.4737,0.3832],[-0.2477,0.3832],[-0.2477,-0.6088],[-0.1113,-0.6088]]},
  {"component":1,"center":[-0.1289,0.3753],"points":[[-0.1935,0.0463],[-0.2183,-0.0219],[-0.2121,-0.0901],[-0.0261,-0.4125],[-0.0137,-0.4249],[0.1289,-0.4249],[0.1289,0.5671],[0.111,0.5671]]}
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};

function polygonGeometry(points: [number, number][], depth: number) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    steps: 1,
    curveSegments: 2,
  });

  geometry.translate(0, 0, -depth * 0.5);
  geometry.computeVertexNormals();
  return geometry;
}

export function StatementLogoScene({ progress }: { progress: number }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

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
    renderer.toneMappingExposure = 0.72;
    renderer.domElement.className = "flow-statement-logo-canvas";
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    scene.environment = env;

    scene.add(new THREE.HemisphereLight(0x738399, 0x010203, 0.75));

    const key = new THREE.DirectionalLight(0xdbe3f2, 3.2);
    key.position.set(3.4, 4.8, 6.8);
    scene.add(key);

    const warm = new THREE.PointLight(0xf9cf00, 28, 6.4, 1.6);
    warm.position.set(-0.55, 0.55, 1.45);
    scene.add(warm);

    const group = new THREE.Group();
    group.position.set(0.35, -0.08, 0);
    group.rotation.set(-0.03, -0.16, -0.025);
    scene.add(group);

    const fragments: FragmentRecord[] = [];

    LOGO_FRAGMENTS.forEach((fragment, index) => {
      const hot = fragment.component === 1;
      const depth = hot ? 0.22 : 0.28;
      const geometry = polygonGeometry(fragment.points, depth);

      const material = new THREE.MeshPhysicalMaterial({
        color: hot ? 0x14120a : 0x07090c,
        emissive: hot ? 0x7a3b00 : 0x000000,
        emissiveIntensity: hot ? 0.16 : 0,
        metalness: hot ? 0.86 : 0.97,
        roughness: hot ? 0.18 : 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMapIntensity: hot ? 2.3 : 2.9,
        transparent: true,
        opacity: 1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const [x, y] = fragment.center;
      mesh.position.set(x, y, hot ? 0.09 : 0);
      mesh.rotation.set(
        0.006 * Math.sin(index * 0.7),
        -0.006 * Math.cos(index * 0.9),
        0
      );
      group.add(mesh);

      const edgeMat = new THREE.LineBasicMaterial({
        color: hot ? 0xff9a30 : 0x596574,
        transparent: true,
        opacity: hot ? 0.28 : 0.22,
      });

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 32),
        edgeMat
      );
      edges.position.copy(mesh.position);
      edges.rotation.copy(mesh.rotation);
      group.add(edges);

      const outward = new THREE.Vector3(
        x + Math.sin((index + 1) * 1.71) * 1.25,
        y + Math.cos((index + 1) * 1.33) * 1.05,
        0.55 + Math.sin((index + 1) * 0.88)
      ).normalize();

      fragments.push({
        mesh,
        edges,
        base: mesh.position.clone(),
        baseRot: mesh.rotation.clone(),
        explodeDir: outward,
        spin: new THREE.Vector3(
          Math.sin(index * 1.17 + 0.2),
          Math.cos(index * 0.91 + 0.5),
          Math.sin(index * 0.67 + 0.9)
        ).normalize(),
        seed: (index + 1) * 1.61803398875,
      });
    });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime();
      const p = progressRef.current;

      // Keep the logo intact when this section first arrives.
      // Phase 1: enter TURN VISION with the normal assembled logo.
      // Phase 2: scatter only while the statement / TURN VISION copy is traversed.
      const scatterIn = smooth((p - 0.13) / 0.24);

      // Phase 3: as the large PRINT / ITERATE / IMPACT marquee stage arrives,
      // reassemble the fragments back to the default logo.
      const reassemble = smooth((p - 0.48) / 0.18);
      const scattered = scatterIn * (1 - reassemble);
      const assemble = 1 - scattered;

      // Hold the fully assembled logo behind the auto-moving marquee.
      // Fade it only when the venetian-blind transition actually begins.
      const shutterStart = 0.84;
      const fade = 1 - smooth((p - shutterStart) / 0.05);

      group.visible = fade > 0.002;
      group.position.x = 0.35 + Math.sin(t * 0.24) * 0.03;
      group.position.y = -0.08 + Math.cos(t * 0.21) * 0.025;
      group.rotation.x = -0.03 + Math.sin(t * 0.18) * 0.018;
      group.rotation.y = -0.16 + Math.sin(t * 0.15) * 0.055;
      group.rotation.z = -0.025 + Math.cos(t * 0.16) * 0.014;
      group.scale.setScalar(1.02);

      fragments.forEach((fragment, index) => {
        const distance = scattered * (2.8 + (index % 5) * 0.34);
        const drift = scattered * 0.16;

        fragment.mesh.position.set(
          fragment.base.x +
            fragment.explodeDir.x * distance +
            Math.sin(t * 0.34 + fragment.seed) * drift,
          fragment.base.y +
            fragment.explodeDir.y * distance +
            Math.cos(t * 0.29 + fragment.seed * 0.74) * drift,
          fragment.base.z +
            fragment.explodeDir.z * distance * 0.72 +
            Math.sin(t * 0.25 + fragment.seed * 1.12) * drift
        );

        fragment.mesh.rotation.set(
          fragment.baseRot.x + fragment.spin.x * scattered * 1.8,
          fragment.baseRot.y + fragment.spin.y * scattered * 1.8,
          fragment.baseRot.z + fragment.spin.z * scattered * 1.8
        );

        fragment.mesh.material.opacity = fade;
        fragment.edges.position.copy(fragment.mesh.position);
        fragment.edges.rotation.copy(fragment.mesh.rotation);
        fragment.edges.material.opacity =
          fade * (fragment.mesh.material.emissiveIntensity > 0 ? 0.28 : 0.20);
      });

      warm.intensity = 18 + assemble * 10;
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => material.dispose());
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

  return <div ref={mountRef} className="flow-statement-logo-scene" aria-hidden="true" />;
}
