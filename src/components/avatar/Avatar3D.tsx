import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AvatarOutfit } from '../../types';

const C_HEX: Record<string, number> = {
  '黑色': 0x222222, '白色': 0xf0f0f0, '灰色': 0x999999, '红色': 0xdd3333,
  '蓝色': 0x5b9bd5, '绿色': 0x6baf6b, '粉色': 0xf0a0b8, '米色': 0xf5e6d3,
  '棕色': 0x8b6914, '藏蓝': 0x2c3e6b, '卡其': 0xc3b091, '浅紫': 0xc9a8d4,
};
const cc = (n?: string) => n ? (C_HEX[n] ?? 0xcccccc) : null;

export function Avatar3D({ outfit }: { outfit: AvatarOutfit }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ dispose: () => void; setClothes: (o: AvatarOutfit) => void } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const outfitKey = useMemo(() => JSON.stringify(outfit.pieces), [outfit.pieces]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = 220; const H = 440;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff8f3);
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 10);
    camera.position.set(0, 1.1, 2.5);
    camera.lookAt(0, 0.6, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const k1 = new THREE.DirectionalLight(0xffffff, 1.2); k1.position.set(1.5, 2.5, 2.5); scene.add(k1);
    const k2 = new THREE.DirectionalLight(0xfff0e8, 0.5); k2.position.set(-1, 1, -1); scene.add(k2);
    const k3 = new THREE.DirectionalLight(0xffffff, 0.4); k3.position.set(0, 1, -2); scene.add(k3);

    const model = new THREE.Group();
    scene.add(model);
    let dragging = false, px = 0;
    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => { dragging = true; px = e.clientX; el.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => { if (!dragging) return; model.rotation.y += (e.clientX - px) * 0.009; px = e.clientX; };
    const onUp = () => { dragging = false; };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);

    let meshList: THREE.Mesh[] = [];
    const setClothes = (o: AvatarOutfit) => {
      if (!meshList.length) return;
      const dc = cc(o.pieces.dress?.color);
      const tc = cc(o.pieces.top?.color);
      const bc = cc(o.pieces.bottom?.color);
      meshList.forEach((m) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        const nm = (m.name || '').toLowerCase();
        if (dc) {
          if (nm.includes('corset') || nm.includes('body') || nm.includes('torso') || nm.includes('cloth'))
            mat.color.set(dc);
          if (nm.includes('skirt') || nm.includes('dress')) mat.color.set(dc);
        } else {
          if (tc && (nm.includes('corset') || nm.includes('body') || nm.includes('torso') || nm.includes('cloth') || nm.includes('top')))
            mat.color.set(tc);
          if (bc && (nm.includes('skirt') || nm.includes('dress') || nm.includes('bottom') || nm.includes('pants') || nm.includes('leg')))
            mat.color.set(bc);
        }
      });
    };

    const url = import.meta.env.BASE_URL + 'model.glb';
    new GLTFLoader().load(url,
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.position.y = -0.2;
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((c) => { if (c instanceof THREE.Mesh) meshes.push(c); });
        meshList = meshes;
        setStatus('ready');
        setClothes(outfit);
      },
      (evt) => { if (evt.total > 0) setProgress(Math.round((evt.loaded / evt.total) * 100)); },
      () => setStatus('error')
    );

    let id = 0;
    const animate = () => { id = requestAnimationFrame(animate); if (!dragging) model.rotation.y += 0.004; renderer.render(scene, camera); };
    animate();

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 220;
      const h = container.clientHeight || 440;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    sceneRef.current = { dispose: () => {}, setClothes };

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      renderer.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setClothes(outfit);
  }, [outfitKey]);

  return (
    <div ref={containerRef}
      className="w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none relative bg-[#fff8f3]"
      style={{ aspectRatio: '1/2', minHeight: 380, maxHeight: 500 }}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-gray-400 text-sm">
          <div className="text-2xl">⏳</div>
          <span>模型加载 {progress}%</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm">❌ 加载失败</div>
      )}
    </div>
  );
}
