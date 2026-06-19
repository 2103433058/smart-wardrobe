import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { AvatarOutfit } from '../../types';

const C_HEX: Record<string, number> = {
  '黑色': 0x222222, '白色': 0xf0f0f0, '灰色': 0x999999, '红色': 0xdd3333,
  '蓝色': 0x5b9bd5, '绿色': 0x6baf6b, '粉色': 0xf0a0b8, '米色': 0xf5e6d3,
  '棕色': 0x8b6914, '藏蓝': 0x2c3e6b, '卡其': 0xc3b091, '浅紫': 0xc9a8d4,
};
const cc = (n: string) => C_HEX[n] ?? 0xcccccc;

// ─── Face texture generator ──────────────────────────────
function createFaceTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;

  // Warm skin base
  ctx.fillStyle = '#fce4cc';
  ctx.fillRect(0, 0, 512, 512);

  // Eye function
  const eye = (cx: number, cy: number) => {
    // White
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(cx, cy, 36, 28, 0, 0, Math.PI * 2); ctx.fill();
    // Iris
    ctx.fillStyle = '#3a1e0e';
    ctx.beginPath(); ctx.arc(cx + 3, cy, 20, 0, Math.PI * 2); ctx.fill();
    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(cx + 3, cy, 9, 0, Math.PI * 2); ctx.fill();
    // Highlights
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx - 4, cy - 8, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 8, cy + 4, 3, 0, Math.PI * 2); ctx.fill();
    // Eyeliner top
    ctx.strokeStyle = '#1a0a04'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx + 2, cy - 5, 36, -1.2, 2.5); ctx.stroke();
    // Lashes
    ctx.lineWidth = 1.5;
    for (let a = -0.8; a < 2.2; a += 0.2) {
      ctx.beginPath();
      ctx.moveTo(cx + 2 + Math.cos(a) * 37, cy - 5 + Math.sin(a) * 29);
      ctx.lineTo(cx + 2 + Math.cos(a) * 52, cy - 18 + Math.sin(a) * 38);
      ctx.stroke();
    }
    // Lower lash line
    ctx.strokeStyle = '#3a1e0e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx + 2, cy - 3, 30, 0.3, Math.PI - 1.5); ctx.stroke();
  };
  eye(180, 220);
  eye(332, 220);

  // Brows
  ctx.strokeStyle = '#3a1a08'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(136, 170); ctx.quadraticCurveTo(180, 145, 224, 160); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(288, 160); ctx.quadraticCurveTo(332, 145, 376, 170); ctx.stroke();

  // Nose
  ctx.strokeStyle = '#d4b896'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(256, 210); ctx.quadraticCurveTo(256, 270, 248, 295); ctx.stroke();
  ctx.beginPath(); ctx.arc(256, 295, 6, 0, Math.PI); ctx.stroke();

  // Lips
  ctx.fillStyle = '#d4787e';
  ctx.beginPath();
  ctx.moveTo(210, 335);
  ctx.quadraticCurveTo(240, 350, 256, 340);
  ctx.quadraticCurveTo(272, 350, 302, 335);
  ctx.quadraticCurveTo(272, 365, 256, 358);
  ctx.quadraticCurveTo(240, 365, 210, 335);
  ctx.fill();
  ctx.strokeStyle = '#b55a65'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(210, 335); ctx.quadraticCurveTo(240, 350, 256, 340);
  ctx.quadraticCurveTo(272, 350, 302, 335); ctx.stroke();

  // Blush
  ctx.fillStyle = 'rgba(240, 150, 170, 0.15)';
  ctx.beginPath(); ctx.ellipse(140, 290, 30, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(372, 290, 30, 18, 0, 0, Math.PI * 2); ctx.fill();

  // Jawline shading
  ctx.fillStyle = 'rgba(210, 170, 140, 0.15)';
  ctx.beginPath(); ctx.ellipse(256, 380, 160, 40, 0, 0, Math.PI); ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// ─── Component ───────────────────────────────────────────
export function Avatar3D({ outfit }: { outfit: AvatarOutfit }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const shoesRef = useRef<THREE.Group>(null);
  const outfitKey = useMemo(
    () => JSON.stringify(outfit.pieces),
    [outfit.pieces]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const W = container.clientWidth || 200;
    const H = container.clientHeight || 400;

    // ─── Scene ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff8f3);

    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 10);
    camera.position.set(0, 1.1, 3.0);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // ─── Lights ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const k1 = new THREE.DirectionalLight(0xffffff, 1.2);
    k1.position.set(1.5, 2.5, 2.5);
    scene.add(k1);
    const k2 = new THREE.DirectionalLight(0xfff0e8, 0.5);
    k2.position.set(-1, 1, -1);
    scene.add(k2);
    const k3 = new THREE.DirectionalLight(0xffffff, 0.4);
    k3.position.set(0, 0.5, -2);
    scene.add(k3);

    // ─── MODEL ───
    const model = new THREE.Group();
    scene.add(model);
    modelRef.current = model;

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfce4cc, roughness: 0.5 });

    // LEGS (thigh + calf)
    const thighG = new THREE.CapsuleGeometry(0.07, 0.42, 4, 10);
    const calfG = new THREE.CapsuleGeometry(0.06, 0.38, 4, 10);
    for (const lx of [-0.07, 0.07]) {
      const thigh = new THREE.Mesh(thighG, skinMat); thigh.position.set(lx, 0.4, 0); model.add(thigh);
      const calf = new THREE.Mesh(calfG, skinMat); calf.position.set(lx, 0.02, 0); model.add(calf);
    }

    // HIPS
    model.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3), skinMat));

    // WAIST
    const waistG = new THREE.CylinderGeometry(0.09, 0.12, 0.06, 20);
    model.add(new THREE.Mesh(waistG, skinMat)).position.y = 0.64;

    // BUST/CHEST
    const bustG = new THREE.SphereGeometry(0.13, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const bust = new THREE.Mesh(bustG, skinMat);
    bust.position.y = 0.7; bust.scale.set(1, 0.6, 0.85);
    model.add(bust);

    // TORSO CONTAINER for clothing
    const torsoGroup = new THREE.Group();
    model.add(torsoGroup);
    torsoRef.current = torsoGroup;

    // ARMS
    const upperA = new THREE.CapsuleGeometry(0.04, 0.28, 4, 8);
    const lowerA = new THREE.CapsuleGeometry(0.035, 0.26, 4, 8);
    for (const ax of [-0.17, 0.17]) {
      const ua = new THREE.Mesh(upperA, skinMat);
      ua.position.set(ax, 0.72, 0); ua.rotation.z = ax > 0 ? -0.15 : 0.15;
      model.add(ua);
      const la = new THREE.Mesh(lowerA, skinMat);
      la.position.set(ax * 1.1, 0.48, 0); la.rotation.z = ax > 0 ? -0.1 : 0.1;
      model.add(la);
    }

    // NECK
    model.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.08, 12), skinMat)).position.y = 0.86;

    // ─── HEAD with face plane ───
    const headGroup = new THREE.Group();

    // Head sphere (back + sides visible)
    const headGeom = new THREE.SphereGeometry(0.12, 36, 28, 0, Math.PI * 2, 0, 0.88);
    const head = new THREE.Mesh(headGeom, new THREE.MeshStandardMaterial({ color: 0xfce4cc, roughness: 0.45 }));
    headGroup.add(head);

    // Face plane in front
    const faceTex = createFaceTexture();
    const facePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.17, 0.22),
      new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.4, transparent: true })
    );
    facePlane.position.set(0, 0.01, 0.1);
    facePlane.rotation.x = -0.08;
    headGroup.add(facePlane);

    // Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x3a1e0e, roughness: 0.3 });
    const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.128, 36, 20, 0, Math.PI * 2, 0, 0.75), hairMat);
    hairBack.position.y = 0.008;
    hairBack.scale.set(1.04, 1.1, 1.04);
    headGroup.add(hairBack);
    // Side strands
    for (const sx of [-0.11, 0.11]) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.022, 0.25, 8), hairMat);
      s.position.set(sx, -0.02, 0.07);
      s.rotation.z = sx > 0 ? -0.35 : 0.35;
      headGroup.add(s);
    }

    headGroup.position.y = 0.93;
    model.add(headGroup);

    // ─── Shoes group ───
    const shoesGroup = new THREE.Group();
    model.add(shoesGroup);
    shoesRef.current = shoesGroup;

    // ─── Rotation via pointer ───
    let dragging = false, px = 0;
    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; el.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      model.rotation.y += (e.clientX - px) * 0.009;
      px = e.clientX;
    };
    const onUp = () => { dragging = false; };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);

    // Auto rotate when idle
    let autoR = 0;
    function animate() {
      autoR = requestAnimationFrame(animate);
      if (!dragging) model.rotation.y += 0.003;
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 200;
      const h = container.clientHeight || 400;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(autoR);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      renderer.dispose();
    };
  }, []);

  // ─── Update clothing ───
  useEffect(() => {
    const t = torsoRef.current;
    const s = shoesRef.current;
    if (!t || !s) return;

    while (t.children.length) t.remove(t.children[0]);
    while (s.children.length) s.remove(s.children[0]);

    const opt = { roughness: 0.3, side: THREE.DoubleSide as THREE.Side };
    const { top, bottom, dress } = outfit.pieces;

    if (dress?.color) {
      const dc = cc(dress.color);
      t.add(new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.12, 0.32, 28, 1, true),
        new THREE.MeshStandardMaterial({ color: dc, ...opt }))).position.y = 0.48;
      t.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.25, 0.38, 28, 1, true),
        new THREE.MeshStandardMaterial({ color: dc, ...opt }))).position.y = 0.1;
    } else {
      if (top?.color) {
        const tc = cc(top.color);
        t.add(new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.11, 0.3, 28, 1, true),
          new THREE.MeshStandardMaterial({ color: tc, ...opt }))).position.y = 0.56;
        for (const sx of [-0.17, 0.17]) {
          t.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 10, 1, true),
            new THREE.MeshStandardMaterial({ color: tc, ...opt }))).position.set(sx, 0.65, 0);
        }
      }
      if (bottom?.color) {
        const bc = cc(bottom.color);
        t.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.155, 0.42, 28, 1, true),
          new THREE.MeshStandardMaterial({ color: bc, ...opt }))).position.y = 0.22;
      }
    }

    if (outfit.pieces.shoes?.color) {
      const sc = cc(outfit.pieces.shoes.color);
      for (const sx of [-0.07, 0.07]) {
        s.add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.13),
          new THREE.MeshStandardMaterial({ color: sc, roughness: 0.2 }))).position.set(sx, 0.02, 0.04);
      }
    }
  }, [outfitKey]);

  return (
    <div ref={containerRef}
      className="w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ aspectRatio: '1/2', minHeight: 380, maxHeight: 480 }}
    />
  );
}
