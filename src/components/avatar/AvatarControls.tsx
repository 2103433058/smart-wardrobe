import { useState } from 'react';
import type { AvatarOutfit, AvatarPiece } from '../../types';

const CATEGORIES: Record<string, string[]> = {
  top: ['T恤', '衬衫', '卫衣', '针织衫', '吊带'],
  bottom: ['牛仔裤', '西裤', '短裤', 'A字裙'],
  dress: ['连衣裙', '连体裤'],
  outer: ['夹克', '大衣', '开衫'],
  shoes: ['运动鞋', '乐福鞋', '短靴', '凉鞋'],
};

const CATEGORY_LABELS: Record<string, string> = {
  top: '上装', bottom: '下装', dress: '连身', outer: '外套', shoes: '鞋履',
};

const COLORS = [
  { name: '黑色', hex: '#1a1a1a' }, { name: '白色', hex: '#f5f5f5' },
  { name: '灰色', hex: '#9e9e9e' }, { name: '红色', hex: '#e74c3c' },
  { name: '蓝色', hex: '#5b9bd5' }, { name: '绿色', hex: '#6baf6b' },
  { name: '粉色', hex: '#f0a0b8' }, { name: '米色', hex: '#f5e6d3' },
  { name: '棕色', hex: '#8b6914' }, { name: '藏蓝', hex: '#2c3e6b' },
  { name: '卡其', hex: '#c3b091' }, { name: '浅紫', hex: '#c9a8d4' },
];

const PATTERNS = ['纯色', '条纹', '格子', '碎花'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ACCESSORIES = [
  { type: '眼镜', icon: '👓' }, { type: '帽子', icon: '🎩' },
  { type: '项链', icon: '📿' }, { type: '耳环', icon: '💎' }, { type: '手表', icon: '⌚' },
];

interface Props {
  outfit: AvatarOutfit;
  onChange: (outfit: AvatarOutfit) => void;
}

type ClothingSlot = 'top' | 'bottom' | 'dress' | 'outer' | 'shoes';

export function AvatarControls({ outfit, onChange }: Props) {
  const [activeSlot, setActiveSlot] = useState<ClothingSlot>('top');

  const updatePiece = (slot: ClothingSlot, updates: Partial<AvatarPiece>) => {
    const isShoes = slot === 'shoes';
    const existing = outfit.pieces[slot] as Partial<AvatarPiece> | undefined;
    const current = existing || { type: '', color: '#ccc', pattern: '纯色', size: 'M' };
    const updated = { ...current, ...updates };
    // Keep only relevant fields
    const piece = isShoes
      ? { type: updated.type || '', color: updated.color || '#ccc' }
      : { type: updated.type || '', color: updated.color || '#ccc', pattern: updated.pattern || '纯色', size: updated.size || 'M' };
    const pieces: AvatarOutfit['pieces'] = { ...outfit.pieces };
    if (slot === 'dress') { delete pieces.top; delete pieces.bottom; }
    if ((slot === 'top' || slot === 'bottom') && !isShoes) { delete (pieces as Record<string, unknown>).dress; }
    (pieces as Record<string, unknown>)[slot] = piece;
    onChange({ ...outfit, pieces, id: outfit.id || 'draft' });
  };

  const activePiece = outfit.pieces[activeSlot];

  return (
    <div className="space-y-3 text-sm">
      {/* Category selection */}
      {Object.entries(CATEGORIES).map(([slot, items]) => (
        <div key={slot}>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer ${
                activeSlot === slot ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
              onClick={() => setActiveSlot(slot as ClothingSlot)}
            >
              {CATEGORY_LABELS[slot]}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {items.map((item) => {
              const current = outfit.pieces[slot as ClothingSlot];
              const isActive = current && 'type' in current && current.type === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveSlot(slot as ClothingSlot);
                    updatePiece(slot as ClothingSlot, { type: item });
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Color picker — applies to active slot */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase">
          {activeSlot === 'shoes' ? '鞋' : ''}颜色 (当前: {CATEGORY_LABELS[activeSlot]})
        </label>
        <div className="flex flex-wrap gap-1 mt-1">
          {COLORS.map(({ name, hex }) => {
            const sel = activePiece && 'color' in activePiece && activePiece.color === name;
            return (
              <button
                key={name}
                onClick={() => updatePiece(activeSlot, { color: name })}
                title={name}
                className={`w-7 h-7 rounded-full border-2 transition-colors ${
                  sel ? 'border-primary-500 scale-110' : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Pattern picker */}
      {activeSlot !== 'shoes' && (
        <div>
          <label className="text-xs text-gray-500 font-medium uppercase">图案</label>
          <div className="flex gap-1 mt-1">
            {PATTERNS.map((p) => {
              const sel = activePiece && 'pattern' in activePiece && activePiece.pattern === p;
              return (
                <button
                  key={p}
                  onClick={() => updatePiece(activeSlot, { pattern: p })}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    sel
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size picker */}
      {activeSlot !== 'shoes' && (
        <div>
          <label className="text-xs text-gray-500 font-medium uppercase">尺码</label>
          <div className="flex gap-1 mt-1">
            {SIZES.map((s) => {
              const sel = activePiece && 'size' in activePiece && activePiece.size === s;
              return (
                <button
                  key={s}
                  onClick={() => updatePiece(activeSlot, { size: s })}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    sel
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Accessories */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase">配饰</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {ACCESSORIES.map(({ type, icon }) => {
            const has = outfit.pieces.accessories.some((acc) => acc.type === type);
            return (
              <button
                key={type}
                onClick={() => {
                  const next = has
                    ? outfit.pieces.accessories.filter((acc) => acc.type !== type)
                    : [...outfit.pieces.accessories, { type, color: '黑色' }];
                  onChange({ ...outfit, pieces: { ...outfit.pieces, accessories: next } });
                }}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  has
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                }`}
              >
                {icon} {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
