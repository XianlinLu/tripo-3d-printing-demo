"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function StoneScene({ progress }: { progress: number }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pRef = useRef(progress); pRef.current = progress;
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31,1,.1,100); camera.position.set(0,0,7.5);
    const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setClearColor(0,0); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.7; renderer.domElement.className="stone-canvas"; mount.appendChild(renderer.domElement);
    const pmrem=new THREE.PMREMGenerator(renderer); const env=pmrem.fromScene(new RoomEnvironment(),.06).texture; scene.environment=env;
    scene.add(new THREE.HemisphereLight(0x7b8998,0x050505,1.25));
    const d=new THREE.DirectionalLight(0xe6ecff,4.8); d.position.set(-3,4,5); scene.add(d);
    const rim=new THREE.DirectionalLight(0x496689,2.3); rim.position.set(4,-1,-2); scene.add(rim);
    const geometry=new THREE.IcosahedronGeometry(1.52,4); const pos=geometry.attributes.position as THREE.BufferAttribute; const v=new THREE.Vector3();
    for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i);const n=v.clone().normalize();const noise=Math.sin(n.x*9.7+n.y*6.1)*.10+Math.sin(n.z*15.3+n.x*5.2)*.065+Math.sin((n.x+n.y+n.z)*27)*.035;v.multiplyScalar(1+noise);pos.setXYZ(i,v.x,v.y,v.z)}
    pos.needsUpdate=true; geometry.computeVertexNormals();
    const mat=new THREE.MeshPhysicalMaterial({color:0x505153,roughness:.72,metalness:.12,clearcoat:.16,clearcoatRoughness:.76,envMapIntensity:.75});
    const rock=new THREE.Mesh(geometry,mat); rock.rotation.set(.32,-.4,.14); scene.add(rock);
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,29),new THREE.LineBasicMaterial({color:0x17191b,transparent:true,opacity:.34})); rock.add(edges);
    const resize=()=>{const r=mount.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}; resize(); const ro=new ResizeObserver(resize); ro.observe(mount);
    const clock=new THREE.Clock();
    renderer.setAnimationLoop(()=>{const t=clock.getElapsedTime(),p=pRef.current;const grow=Math.max(0,Math.min(1,(p-.34)/.42));const s=.42+grow*.75;rock.scale.setScalar(s);rock.position.y=1.75-grow*1.85+Math.sin(t*.35)*.04;rock.position.x=.12+Math.sin(t*.19)*.08;rock.rotation.y=-.45+t*.07+p*2.15;rock.rotation.x=.24+Math.sin(t*.27)*.05+p*.22;renderer.render(scene,camera)});
    return()=>{renderer.setAnimationLoop(null);ro.disconnect();geometry.dispose();mat.dispose();(edges.material as THREE.Material).dispose();env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove()};
  },[]);
  return <div className="stone-scene" ref={mountRef}/>;
}
