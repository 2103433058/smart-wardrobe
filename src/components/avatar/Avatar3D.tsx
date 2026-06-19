import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AvatarOutfit } from '../../types';

const C_HEX: Record<string, number> = {
  '黑色': 0x222222, '白色': 0xf0f0f0, '灰色': 0x999999, '红色': 0xdd3333,
  '蓝色': 0x5b9bd5, '绿色': 0x6baf6b, '粉色': 0xf0a0b8, '米色': 0xf5e6d3,
  '棕色': 0x8b6914, '藏蓝': 0x2c3e6b, '卡其': 0xc3b091, '浅紫': 0xc9a8d4,
};
const cc = (n: string) => C_HEX[n] ?? 0xcccccc;

export function Avatar3D({ outfit }: { outfit: AvatarOutfit }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const clothingMeshes = useRef<THREE.Mesh[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadErr, setLoadErr] = useState('');
  const outfitKey = useMemo(() => JSON.stringify(outfit.pieces), [outfit.pieces]);

  // Load GLB on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const W = container.clientWidth || 200;
    const H = container.clientHeight || 400;

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

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const k1 = new THREE.DirectionalLight(0xffffff, 1.2); k1.position.set(1.5, 2.5, 2.5); scene.add(k1);
    const k2 = new THREE.DirectionalLight(0xfff0e8, 0.5); k2.position.set(-1, 1, -1); scene.add(k2);
    const k3 = new THREE.DirectionalLight(0xffffff, 0.4); k3.position.set(0, 1, -2); scene.add(k3);

    // Rotation state
    let dragging = false, px = 0;
    const el = renderer.domElement;
    el.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (!dragging || !modelRef.current) return;
      modelRef.current.rotation.y += (e.clientX - px) * 0.009;
      px = e.clientX;
    });
    el.addEventListener('pointerup', () => { dragging = false; });

    let id = 0;
    function animate() {
      id = requestAnimationFrame(animate);
      if (!dragging && modelRef.current) modelRef.current.rotation.y += 0.004;
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

    // Load GLB
    new GLTFLoader().load('/model.glb',
      (gltf) => {
        scene.add(gltf.scene);
        modelRef.current = gltf.scene;

        // Collect all meshes for clothing recoloring
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshes.push(child);
            child.castShadow = true;
          }
        });
        clothingMeshes.current = meshes;
        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error('GLB load error:', err);
        setLoadErr('模型加载失败');
      }
    );

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update clothing colors
  useEffect(() => {
    const meshes = clothingMeshes.current;
    if (!meshes.length) return;

    const { top, bottom, dress } = outfit.pieces;
    const topColor = top?.color ? cc(top.color) : null;
    const bottomColor = bottom?.color ? cc(bottom.color) : null;
    const dressColor = dress?.color ? cc(dress.color) : null;

    // We color the torso-area meshes based on clothing selection
    // The model's mesh names help identify which parts to recolor
    meshes.forEach((mesh) => {
      const name = (mesh.name || '').toLowerCase();
      const mat = mesh.material as THREE.MeshStandardMaterial;

      // Reset to original if no clothing selected
      if (dressColor) {
        // Dress colors the entire body (torso + skirt area)
        if (name.includes('body') || name.includes('torso') || name.includes('corset') ||
            name.includes('skirt') || name.includes('dress') || name.includes('cloth') ||
            name.includes('fabric') || name.includes('garment') || name.includes('top') ||
            name.includes('bottom')) {
          mat.color.set(dressColor);
        }
      } else {
        if (topColor && (name.includes('top') || name.includes('corset') || name.includes('body') || name.includes('torso'))) {
          mat.color.set(topColor);
        }
        if (bottomColor && (name.includes('bottom') || name.includes('skirt') || name.includes('pants') || name.includes('leg'))) {
          mat.color.set(bottomColor);
        }
      }
    });
  }, [outfitKey]);

  return (
    <div ref={containerRef}
      className="w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none relative"
      style={{ aspectRatio: '1/2', minHeight: 380, maxHeight: 500 }}
    >
      {!loaded && !loadErr && (
        <div className="absolute inset-0 flex items-center justify-center bg-warm-50 text-gray-400 text-sm">
          ⏳ 模型加载中...
        </div>
      )}
      {loadErr && (
        <div className="absolute inset-0 flex items-center justify-center bg-warm-50 text-red-400 text-sm">
          ❌ {loadErr}
        </div>
      )}
    </div>
  );
}
