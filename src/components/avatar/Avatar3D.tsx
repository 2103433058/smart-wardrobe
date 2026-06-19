import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { AvatarOutfit } from '../../types';

const C_HEX: Record<string, number> = {
  '黑色': 0x222222, '白色': 0xf0f0f0, '灰色': 0x999999, '红色': 0xdd3333,
  '蓝色': 0x5b9bd5, '绿色': 0x6baf6b, '粉色': 0xf0a0b8, '米色': 0xf5e6d3,
  '棕色': 0x8b6914, '藏蓝': 0x2c3e6b, '卡其': 0xc3b091, '浅紫': 0xc9a8d4,
};
function chex(name: string): number { return C_HEX[name] ?? 0xcccccc; }

export function Avatar3D({ outfit }: { outfit: AvatarOutfit }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const shoesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 200;
    const H = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff5f0);

    const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 10);
    camera.position.set(0, 1.2, 3.2);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(1, 2.5, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe8d8, 0.6);
    fill.position.set(-1, 0.5, -1);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(0, 1.5, -2);
    scene.add(rim);
    const bottom = new THREE.DirectionalLight(0xfff0e8, 0.3);
    bottom.position.set(0, -0.5, 1);
    scene.add(bottom);

    const model = new THREE.Group();
    scene.add(model);

    const skin = new THREE.MeshStandardMaterial({ color: 0xfce4cc, roughness: 0.5 });

    // ─── LEGS ───
    const legGeom = new THREE.CapsuleGeometry(0.07, 0.8, 4, 8);
    for (const lx of [-0.07, 0.07]) {
      const leg = new THREE.Mesh(legGeom, skin);
      leg.position.set(lx, 0.3, 0);
      model.add(leg);
    }

    // ─── PELVIS/HIPS ───
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.12, 16), skin);
    pelvis.position.y = 0.55;
    model.add(pelvis);

    // ─── TORSO container ───
    const torsoGroup = new THREE.Group();
    model.add(torsoGroup);
    torsoRef.current = torsoGroup;

    // ─── BUST ───
    const bustUpper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.135, 0.15, 20), skin
    );
    bustUpper.position.y = 0.72;
    model.add(bustUpper);

    // ─── ARMS ───
    const armGeom = new THREE.CapsuleGeometry(0.04, 0.55, 4, 8);
    for (const ax of [-0.17, 0.17]) {
      const arm = new THREE.Mesh(armGeom, skin);
      arm.position.set(ax, 0.65, 0);
      arm.rotation.z = ax > 0 ? -0.12 : 0.12;
      model.add(arm);
    }

    // ─── NECK ───
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.07, 12), skin);
    neck.position.y = 0.85;
    model.add(neck);

    // ─── HEAD ───
    const headGroup = new THREE.Group();

    // Face canvas
    const fc = document.createElement('canvas');
    fc.width = 256; fc.height = 256;
    const ctx = fc.getContext('2d')!;
    ctx.fillStyle = '#fce4cc';
    ctx.fillRect(0, 0, 256, 256);
    // Eyes with full detail
    const drawEye = (cx: number, cy: number) => {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx, cy, 20, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3a2010';
      ctx.beginPath(); ctx.arc(cx + 2, cy, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(cx + 2, cy, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 3, cy - 5, 3.5, 0, Math.PI * 2); ctx.fill();
      // Eyeliner + lashes
      ctx.strokeStyle = '#2a1810'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx + 2, cy - 2, 20, -1.0, 2.4); ctx.stroke();
      ctx.lineWidth = 1;
      for (let a = -0.6; a < 2.2; a += 0.25) {
        ctx.beginPath();
        ctx.moveTo(cx + 2 + Math.cos(a) * 21, cy - 2 + Math.sin(a) * 17);
        ctx.lineTo(cx + 2 + Math.cos(a) * 27, cy - 8 + Math.sin(a) * 20);
        ctx.stroke();
      }
    };
    drawEye(100, 108);
    drawEye(156, 108);
    // Eyebrows
    ctx.strokeStyle = '#4a2810'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(72, 82); ctx.quadraticCurveTo(100, 70, 128, 80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(128, 80); ctx.quadraticCurveTo(156, 70, 184, 82); ctx.stroke();
    // Nose
    ctx.strokeStyle = '#d4b896'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(128, 105); ctx.quadraticCurveTo(128, 130, 124, 142); ctx.stroke();
    ctx.beginPath(); ctx.arc(128, 142, 3.5, 0, Math.PI); ctx.stroke();
    // Lips
    ctx.fillStyle = '#d4787e';
    ctx.beginPath();
    ctx.moveTo(106, 162);
    ctx.quadraticCurveTo(120, 170, 128, 165);
    ctx.quadraticCurveTo(136, 170, 150, 162);
    ctx.quadraticCurveTo(136, 180, 128, 175);
    ctx.quadraticCurveTo(120, 180, 106, 162);
    ctx.fill();
    ctx.strokeStyle = '#c0606e'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(106, 162); ctx.quadraticCurveTo(120, 170, 128, 165);
    ctx.quadraticCurveTo(136, 170, 150, 162); ctx.stroke();
    // Blush
    ctx.fillStyle = 'rgba(240, 150, 170, 0.2)';
    ctx.beginPath(); ctx.ellipse(80, 142, 16, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(176, 142, 16, 10, 0, 0, Math.PI * 2); ctx.fill();

    const faceTex = new THREE.CanvasTexture(fc);
    faceTex.colorSpace = THREE.SRGBColorSpace;
    const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.45 });

    const headGeom = new THREE.SphereGeometry(0.12, 32, 22, 0, Math.PI * 2, 0, 0.88);
    const head = new THREE.Mesh(headGeom, faceMat);
    headGroup.add(head);

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x3a2010, roughness: 0.35 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.125, 32, 16, 0, Math.PI * 2, 0, 0.75), hairMat);
    hair.scale.set(1.05, 1.08, 1.05);
    headGroup.add(hair);
    for (const sx of [-0.12, 0.12]) {
      const strand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.022, 0.22, 8), hairMat
      );
      strand.position.set(sx, -0.03, 0.06);
      strand.rotation.z = sx > 0 ? -0.3 : 0.3;
      hair.add(strand);
    }

    headGroup.position.y = 0.92;
    model.add(headGroup);

    // ─── Shoes group ───
    const shoesGroup = new THREE.Group();
    model.add(shoesGroup);
    shoesRef.current = shoesGroup;

    // ─── Mouse rotation ───
    let dragging = false, px = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true; px = e.clientX;
      (renderer.domElement as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      model.rotation.y += (e.clientX - px) * 0.008;
      px = e.clientX;
    };
    const onUp = () => { dragging = false; };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerup', onUp);

    // ─── Render ───
    let id = 0;
    function animate() { id = requestAnimationFrame(animate); renderer.render(scene, camera); }
    animate();

    // Resize observer
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 200;
      const h = container.clientHeight || 400;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  // ─── Update clothing materials when outfit changes ───
  useEffect(() => {
    const torso = torsoRef.current;
    const shoes = shoesRef.current;
    if (!torso || !shoes) return;

    // Clear
    while (torso.children.length) torso.remove(torso.children[0]);
    while (shoes.children.length) shoes.remove(shoes.children[0]);

    const { top, bottom, dress } = outfit.pieces;
    const matOpts: { roughness: number; side: THREE.Side } = { roughness: 0.35, side: THREE.DoubleSide };

    if (dress?.color) {
      const dc = chex(dress.color);
      const topMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.125, 0.12, 0.35, 24, 1, true),
        new THREE.MeshStandardMaterial({ color: dc, ...matOpts })
      );
      topMesh.position.y = 0.45;
      torso.add(topMesh);
      const skirt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.24, 0.35, 24, 1, true),
        new THREE.MeshStandardMaterial({ color: dc, ...matOpts })
      );
      skirt.position.y = 0.12;
      torso.add(skirt);
    } else {
      if (top?.color) {
        const tc = chex(top.color);
        const topMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.128, 0.11, 0.3, 24, 1, true),
          new THREE.MeshStandardMaterial({ color: tc, ...matOpts })
        );
        topMesh.position.y = 0.55;
        torso.add(topMesh);
        // Sleeves
        for (const sx of [-0.17, 0.17]) {
          const sleeve = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.05, 0.15, 8, 1, true),
            new THREE.MeshStandardMaterial({ color: tc, ...matOpts })
          );
          sleeve.position.set(sx, 0.65, 0);
          torso.add(sleeve);
        }
      }
      if (bottom?.color) {
        const bc = chex(bottom.color);
        const botMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.15, 0.4, 24, 1, true),
          new THREE.MeshStandardMaterial({ color: bc, ...matOpts })
        );
        botMesh.position.y = 0.22;
        torso.add(botMesh);
      }
    }

    if (outfit.pieces.shoes?.color) {
      const sc = chex(outfit.pieces.shoes.color);
      const shoeGeom = new THREE.BoxGeometry(0.07, 0.04, 0.13);
      const shoeMat = new THREE.MeshStandardMaterial({ color: sc, roughness: 0.25 });
      for (const sx of [-0.07, 0.07]) {
        const shoe = new THREE.Mesh(shoeGeom, shoeMat);
        shoe.position.set(sx, 0.02, 0.04);
        shoes.add(shoe);
      }
    }
  }, [outfit]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ aspectRatio: '1/2', minHeight: 380, maxHeight: 480 }}
    />
  );
}
