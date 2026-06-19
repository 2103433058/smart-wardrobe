import { useState } from 'react';
import { AvatarSVG } from './AvatarSVG';
import { AvatarControls } from './AvatarControls';
import type { AvatarOutfit } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';

export function AvatarCanvas() {
  const [outfit, setOutfit] = useState<AvatarOutfit>({
    id: '',
    pieces: { accessories: [] },
    savedAt: 0,
  });
  const addItem = useWardrobeStore((s) => s.addItem);

  const handleSave = async () => {
    // Render SVG to canvas, then save as data URL
    const svgEl = document.querySelector('.avatar-svg-container svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = async () => {
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 60;
      thumbCanvas.height = 120;
      thumbCanvas.getContext('2d')!.drawImage(img, 0, 0, 60, 120);
      const thumb = thumbCanvas.toDataURL('image/png');

      const topPiece = outfit.pieces.top;
      await addItem({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        imageDataUrl: dataUrl,
        thumbnailDataUrl: thumb,
        source: 'avatar',
        category: topPiece?.type || '虚拟试衣',
        attributes: {
          primaryColor: topPiece?.color || '未知',
          pattern: topPiece?.pattern || '纯色',
          material: '',
          season: '',
          formality: '',
        },
        styleTags: [],
        tags: [],
        notes: '',
        createdAt: Date.now(),
        wearCount: 0,
        isFavorite: false,
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/2 avatar-svg-container">
          <AvatarSVG outfit={outfit} skinColor="#f5d0b0" hairColor="#3a2a1a" />
        </div>
        <div className="w-1/2">
          <AvatarControls outfit={outfit} onChange={setOutfit} />
        </div>
      </div>
      <button onClick={handleSave}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium">
        💾 保存到衣橱
      </button>
    </div>
  );
}
