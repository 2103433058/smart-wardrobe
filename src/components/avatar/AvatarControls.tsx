import type { AvatarOutfit, AvatarPiece } from '../../types';

const CATEGORIES = {
  top: ['T恤', '衬衫', '卫衣', '针织衫', '吊带'],
  bottom: ['牛仔裤', '西裤', '短裤', 'A字裙'],
  dress: ['连衣裙', '连体裤'],
  outer: ['夹克', '大衣', '开衫'],
  shoes: ['运动鞋', '乐福鞋', '短靴', '凉鞋'],
};

const COLORS = ['黑色', '白色', '灰色', '红色', '蓝色', '绿色', '黄色', '粉色', '棕色', '藏蓝', '卡其', '米色'];
const PATTERNS = ['纯色', '条纹', '格子', '碎花'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ACCESSORIES = ['眼镜', '帽子', '项链', '耳环', '手表'];

interface Props {
  outfit: AvatarOutfit;
  onChange: (outfit: AvatarOutfit) => void;
}

export function AvatarControls({ outfit, onChange }: Props) {
  const updatePiece = (
    slot: 'top' | 'bottom' | 'dress' | 'outer',
    updates: Partial<AvatarPiece>
  ) => {
    const current = outfit.pieces[slot] || { type: '', color: '#ccc', pattern: '纯色', size: 'M' };
    onChange({
      ...outfit,
      pieces: { ...outfit.pieces, [slot]: { ...current, ...updates } },
    });
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Category selection */}
      {Object.entries(CATEGORIES).map(([slot, items]) => (
        <div key={slot}>
          <label className="text-xs text-gray-500 font-medium uppercase">{slot}</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {items.map((item) => {
              const current = outfit.pieces[slot as keyof typeof outfit.pieces];
              const isActive = current && 'type' in current && (current as AvatarPiece).type === item;
              return (
                <button
                  key={item}
                  onClick={() => updatePiece(slot as 'top' | 'bottom' | 'dress' | 'outer', { type: item })}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    isActive ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Color picker */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase">颜色</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {COLORS.map((c) => (
            <button key={c} onClick={() => updatePiece('top', { color: c })}
              className="px-3 py-1 rounded-full text-xs border border-gray-200 bg-white hover:border-primary-300">
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern picker */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase">图案</label>
        <div className="flex gap-1 mt-1">
          {PATTERNS.map((p) => (
            <button key={p} onClick={() => updatePiece('top', { pattern: p })}
              className="px-3 py-1 rounded-full text-xs border border-gray-200 bg-white hover:border-primary-300">
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Size picker */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase">尺码</label>
        <div className="flex gap-1 mt-1">
          {SIZES.map((s) => (
            <button key={s} onClick={() => updatePiece('top', { size: s })}
              className="px-3 py-1 rounded-full text-xs border border-gray-200 bg-white hover:border-primary-300">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase">配饰</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {ACCESSORIES.map((a) => {
            const has = outfit.pieces.accessories.some((acc) => acc.type === a);
            return (
              <button
                key={a}
                onClick={() => {
                  const next = has
                    ? outfit.pieces.accessories.filter((acc) => acc.type !== a)
                    : [...outfit.pieces.accessories, { type: a, color: '黑色' }];
                  onChange({ ...outfit, pieces: { ...outfit.pieces, accessories: next } });
                }}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  has ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
