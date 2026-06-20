import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { AvatarOutfit } from '../../types';

const C_HEX: Record<string, number> = {
  '黑色': 0x222222,'白色': 0xf0f0f0,'灰色': 0x999999,'红色': 0xdd3333,
  '蓝色': 0x5b9bd5,'绿色': 0x6baf6b,'粉色': 0xf0a0b8,'米色': 0xf5e6d3,
  '棕色': 0x8b6914,'藏蓝': 0x2c3e6b,'卡其': 0xc3b091,'浅紫': 0xc9a8d4,
};
const cx = (n?: string) => n ? (C_HEX[n] ?? 0xcccccc) : null;

function bodyProfile(): THREE.Vector2[] {
  // Hourglass female body profile (radius at each height from waist up)
  const pts: [number, number][] = [
    [0.04, 0.82],  // neck base
    [0.09, 0.78],  // shoulders
    [0.11, 0.74],  // upper chest
    [0.13, 0.70],  // bust
    [0.10, 0.64],  // waist (narrow!)
    [0.13, 0.58],  // hips start
    [0.14, 0.52],  // hips full
    [0.10, 0.44],  // lower hips
  ];
  return pts.map(([r, y]) => new THREE.Vector2(r, y));
}

function faceTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width=256; c.height=256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle='#fce4cc'; ctx.fillRect(0,0,256,256);
  // Eyes
  for (const [cx,cy] of [[90,105],[166,105]]) {
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx,cy,16,12,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3a1e0e'; ctx.beginPath(); ctx.arc(cx+2,cy,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(cx+2,cy,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx-2,cy-4,3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#1a0a04'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx+2,cy-2,16,-1,2.4); ctx.stroke();
  }
  // Brows
  ctx.strokeStyle='#3a1a08'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(70,80); ctx.quadraticCurveTo(90,68,108,78); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(148,78); ctx.quadraticCurveTo(166,68,186,80); ctx.stroke();
  // Nose
  ctx.strokeStyle='#d4b896'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(128,100); ctx.quadraticCurveTo(128,125,124,136); ctx.stroke();
  // Lips
  ctx.fillStyle='#d4787e';
  ctx.beginPath(); ctx.moveTo(108,155); ctx.quadraticCurveTo(120,162,128,158);
  ctx.quadraticCurveTo(136,162,148,155); ctx.quadraticCurveTo(136,170,128,165);
  ctx.quadraticCurveTo(120,170,108,155); ctx.fill();
  // Blush
  ctx.fillStyle='rgba(240,150,170,0.15)';
  ctx.beginPath(); ctx.ellipse(72,132,14,9,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(184,132,14,9,0,0,Math.PI*2); ctx.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}

export function Avatar3D({ outfit }: { outfit: AvatarOutfit }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outfitKey = useMemo(() => JSON.stringify(outfit.pieces), [outfit.pieces]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const W = 220, H = 440;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xfff8f3);
    const cam = new THREE.PerspectiveCamera(35, W/H, 0.1, 10);
    cam.position.set(0, 0.75, 2.0); cam.lookAt(0, 0.45, 0);
    const r = new THREE.WebGLRenderer({antialias:true,alpha:true});
    r.setSize(W,H); r.setPixelRatio(Math.min(devicePixelRatio,2));
    el.innerHTML=''; el.appendChild(r.domElement);

    scene.add(new THREE.AmbientLight(0xffffff,0.7));
    const k1 = new THREE.DirectionalLight(0xffffff,1.2); k1.position.set(1.5,2,2.5); scene.add(k1);
    const k2 = new THREE.DirectionalLight(0xfff0e8,0.5); k2.position.set(-1,1,-1); scene.add(k2);
    const k3 = new THREE.DirectionalLight(0xffffff,0.4); k3.position.set(0,0.5,-2); scene.add(k3);

    const model = new THREE.Group(); scene.add(model);
    const skin = new THREE.MeshStandardMaterial({color:0xfce4cc,roughness:0.5});

    // ── BODY (LatheGeometry hourglass) ──
    const bodyG = new THREE.LatheGeometry(bodyProfile(), 32);
    const body = new THREE.Mesh(bodyG, skin);
    body.position.y = 0;
    model.add(body);

    // ── LEGS ──
    const legG = new THREE.CapsuleGeometry(0.06, 0.42, 4, 10);
    for (const lx of [-0.06, 0.06]) {
      const leg = new THREE.Mesh(legG, skin); leg.position.set(lx, -0.22, 0); model.add(leg);
    }

    // ── ARMS ──
    const armG = new THREE.CapsuleGeometry(0.04, 0.45, 4, 8);
    for (const ax of [-0.17, 0.17]) {
      const arm = new THREE.Mesh(armG, skin);
      arm.position.set(ax, 0.65, 0); arm.rotation.z = ax > 0 ? -0.1 : 0.1; model.add(arm);
    }

    // ── NECK ──
    model.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.06,12), skin)).position.y = 0.83;

    // ── HEAD ──
    const headG = new THREE.Group();
    headG.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), new THREE.MeshStandardMaterial({color:0xfce4cc,roughness:0.45})));
    // Face plane
    const fTex = faceTexture();
    const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.18),
      new THREE.MeshStandardMaterial({map:fTex,roughness:0.4,transparent:true}));
    facePlane.position.set(0, 0.01, 0.08); facePlane.rotation.x = -0.05;
    headG.add(facePlane);
    // Hair
    const hairM = new THREE.MeshStandardMaterial({color:0x3a1e0e,roughness:0.3});
    headG.add(new THREE.Mesh(new THREE.SphereGeometry(0.105,32,18,0,Math.PI*2,0,0.7), hairM)).scale.set(1.04,1.1,1.04);
    headG.position.y = 0.9;
    model.add(headG);

    // ── CLOTHING GROUPS (stored in closure for outfit updates) ──
    const topGroup = new THREE.Group(); model.add(topGroup);
    const botGroup = new THREE.Group(); model.add(botGroup);
    const dressGroup = new THREE.Group(); model.add(dressGroup);
    const shoeGroup = new THREE.Group(); model.add(shoeGroup);

    function applyClothes(o: AvatarOutfit) {
      [topGroup,botGroup,dressGroup,shoeGroup].forEach(g=>{while(g.children.length)g.remove(g.children[0])});
      const {top,bottom,dress,shoes} = o.pieces;
      const mat = (c:number) => new THREE.MeshStandardMaterial({color:c,roughness:0.35,side:THREE.DoubleSide});

      if (dress?.color) {
        const dc = cx(dress.color)!;
        dressGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.125,0.12,0.28,28,1,true),mat(dc))).position.y=0.48;
        dressGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.2,0.35,28,1,true),mat(dc))).position.y=0.12;
      } else {
        if (top?.color) {
          const tc = cx(top.color)!;
          topGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.128,0.11,0.27,28,1,true),mat(tc))).position.y=0.55;
          for (const sx of [-0.17,0.17]) {
            topGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.12,10,1,true),mat(tc))).position.set(sx,0.62,0);
          }
        }
        if (bottom?.color) {
          const bc = cx(bottom.color)!;
          botGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,0.38,28,1,true),mat(bc))).position.y=0.22;
        }
      }
      if (shoes?.color) {
        const sc = cx(shoes.color)!;
        for (const sx of [-0.06,0.06])
          shoeGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.06,0.03,0.11),new THREE.MeshStandardMaterial({color:sc,roughness:0.2}))).position.set(sx,-0.42,0.03);
      }
    }
    applyClothes(outfit);

    // Store update function on DOM for second useEffect
    (el as any).__updateClothes = (o: AvatarOutfit) => applyClothes(o);

    // ── ROTATION ──
    let dragging=false, px=0;
    const el2 = r.domElement;
    el2.addEventListener('pointerdown',(e)=>{dragging=true;px=e.clientX;el2.setPointerCapture(e.pointerId);});
    el2.addEventListener('pointermove',(e)=>{if(!dragging)return;model.rotation.y+=(e.clientX-px)*0.009;px=e.clientX;});
    el2.addEventListener('pointerup',()=>{dragging=false;});

    let id=0;
    const animate = () => { id=requestAnimationFrame(animate); if(!dragging)model.rotation.y+=0.004; r.render(scene,cam); };
    animate();

    const ro = new ResizeObserver(()=>{const w=el.clientWidth||220,h=el.clientHeight||440;cam.aspect=w/h;cam.updateProjectionMatrix();r.setSize(w,h);});
    ro.observe(el);

    return () => { cancelAnimationFrame(id); ro.disconnect(); r.dispose(); };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    const fn = el && (el as any).__updateClothes;
    if (fn) fn(outfit);
  }, [outfitKey]);

  return (
    <div ref={containerRef}
      className="avatar-3d-container w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none relative bg-[#fff8f3]"
      style={{ aspectRatio: '1/2', minHeight: 380, maxHeight: 500 }}
    />
  );
}
