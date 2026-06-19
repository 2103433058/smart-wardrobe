import { useState, useMemo } from 'react';
import { AvatarControls } from './AvatarControls';
import type { AvatarOutfit, WardrobeItem } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { scoreColorPair } from '../../services/recommendation/colorMatcher';
import { scoreStylePair } from '../../services/recommendation/styleMatcher';

const COLOR_HEX: Record<string, string> = {
  '黑色': '#222', '白色': '#f5f5f5', '灰色': '#999', '红色': '#d35',
  '蓝色': '#5b9bd5', '绿色': '#6baf6b', '粉色': '#f0a0b8', '米色': '#f5e6d3',
  '棕色': '#8b6914', '藏蓝': '#2c3e6b', '卡其': '#c3b091', '浅紫': '#c9a8d4',
};
const cc = (n: string) => COLOR_HEX[n] || '#ddd';

function FashionFigure({ outfit }: { outfit: AvatarOutfit }) {
  const { top, bottom, dress, outer, shoes, accessories } = outfit.pieces;
  const skin = '#fce4cc';
  const hair = '#4a2a10';
  const topC = top?.color ? cc(top.color) : 'none';
  const botC = bottom?.color ? cc(bottom.color) : 'none';
  const dressC = dress?.color ? cc(dress.color) : 'none';
  const outerC = outer?.color ? cc(outer.color) : 'none';
  const shoeC = shoes?.color ? cc(shoes.color) : '#444';
  const hasTop = !dress && top?.type;
  const hasBot = !dress && bottom?.type;
  const hasDress = !!dress?.type;
  const hasOuter = !dress && outer?.type;

  return (
    <svg viewBox="0 0 220 440" className="w-full h-full">
      <defs>
        <pattern id="s" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="10" fill="currentColor" /></pattern>
        <pattern id="c" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="currentColor" />
          <rect width="5" height="5" fill="#fff" opacity="0.35" />
          <rect x="6" y="6" width="5" height="5" fill="#fff" opacity="0.35" /></pattern>
      </defs>

      {/* LEGS */}
      <path d="M85,260 L83,400 Q82,410 90,410 L98,410 Q104,410 104,402 L104,300" fill={skin} />
      <path d="M116,300 L116,402 Q116,410 122,410 L130,410 Q138,410 137,400 L135,260" fill={skin} />

      {/* SHOES */}
      {shoes?.color && (
        <g>
          <ellipse cx="93" cy="413" rx="14" ry="7" fill={shoeC} />
          <ellipse cx="127" cy="413" rx="14" ry="7" fill={shoeC} />
        </g>
      )}

      {/* BOTTOM */}
      {hasBot && (
        <path d="M72,240 L68,340 Q66,355 72,355 L90,355 L90,290 L93,290 L110,290 L110,290 L130,290 L130,355 L148,355 Q154,355 152,340 L148,240 Z"
          fill={pat(bottom!, botC)} stroke={botC} strokeWidth="2.5" />
      )}

      {/* DRESS */}
      {hasDress && (
        <path d="M63,120 L58,290 Q56,315 110,320 Q164,315 162,290 L157,120 Q110,108 63,120 Z"
          fill={pat(dress!, dressC)} stroke={dressC} strokeWidth="2.5" />
      )}

      {/* TORSO */}
      {!hasDress && (
        <path d="M73,120 Q70,125 70,170 L70,245 L150,245 L150,170 Q150,125 147,120 Q110,110 73,120 Z" fill={skin} />
      )}

      {/* TOP */}
      {hasTop && (
        <g>
          <path d="M66,115 Q62,122 66,185 L68,245 L152,245 L154,185 Q158,122 154,115 Q110,102 66,115 Z"
            fill={pat(top!, topC)} stroke={topC} strokeWidth="2.5" />
          {/* Sleeves */}
          <path d="M66,120 Q42,124 38,175 Q36,192 44,195 L58,192 Q54,140 66,128 Z"
            fill={pat(top!, topC)} stroke={topC} strokeWidth="2.5" />
          <path d="M154,120 Q178,124 182,175 Q184,192 176,195 L162,192 Q166,140 154,128 Z"
            fill={pat(top!, topC)} stroke={topC} strokeWidth="2.5" />
        </g>
      )}

      {/* OUTER */}
      {hasOuter && (
        <path d="M60,108 L55,270 L165,270 L160,108 Q110,96 60,108 Z"
          fill="none" stroke={outerC} strokeWidth="8" opacity="0.75" strokeLinejoin="round" />
      )}

      {/* ARMS */}
      <path d="M44,185 Q36,185 34,230 Q32,270 38,280 L46,280 Q42,230 46,185 Z" fill={skin} />
      <path d="M174,185 Q182,185 184,230 Q186,270 180,280 L172,280 Q176,230 174,185 Z" fill={skin} />

      {/* NECK */}
      <rect x="96" y="90" width="28" height="28" rx="8" fill={skin} />

      {/* HEAD */}
      <ellipse cx="110" cy="60" rx="32" ry="38" fill={skin} />

      {/* HAIR */}
      <ellipse cx="110" cy="54" rx="34" ry="42" fill={hair} opacity="0.9" />
      <ellipse cx="110" cy="34" rx="36" ry="30" fill={hair} />
      <path d="M78,48 Q74,78 76,108 L82,103 Q82,68 82,48 Z" fill={hair} />
      <path d="M142,48 Q146,78 144,108 L138,103 Q138,68 138,48 Z" fill={hair} />
      <path d="M80,50 Q92,36 110,34 Q128,36 140,50 Q125,60 110,58 Q95,60 80,50 Z" fill={hair} />

      {/* FACE */}
      <ellipse cx="98" cy="58" rx="4.5" ry="5" fill="#333" /><circle cx="99" cy="56" r="1.5" fill="#fff" />
      <ellipse cx="122" cy="58" rx="4.5" ry="5" fill="#333" /><circle cx="123" cy="56" r="1.5" fill="#fff" />
      <path d="M92,48 Q98,46 104,48" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
      <path d="M116,48 Q122,46 128,48" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
      <ellipse cx="90" cy="66" rx="6" ry="3" fill="#f0a0b8" opacity="0.35" />
      <ellipse cx="130" cy="66" rx="6" ry="3" fill="#f0a0b8" opacity="0.35" />
      <path d="M104,72 Q107,76 110,76 Q113,76 116,72" fill="none" stroke="#d4787e" strokeWidth="1.5" strokeLinecap="round" />

      {/* ACCESSORIES */}
      {accessories.map((acc, i) => {
        const ac = cc(acc.color);
        if (acc.type === '眼镜') return (
          <g key={i}>
            <circle cx="98" cy="58" r="9" fill="none" stroke={ac} strokeWidth="2" />
            <circle cx="122" cy="58" r="9" fill="none" stroke={ac} strokeWidth="2" />
            <line x1="107" y1="58" x2="113" y2="58" stroke={ac} strokeWidth="1.5" />
          </g>);
        if (acc.type === '帽子') return <ellipse key={i} cx="110" cy="22" rx="40" ry="12" fill={ac} />;
        if (acc.type === '项链') return <path key={i} d="M94,110 Q110,130 126,110" fill="none" stroke={ac} strokeWidth="2" strokeLinecap="round" />;
        if (acc.type === '耳环') return <g key={i}><circle cx="76" cy="70" r="2.5" fill={ac} /><circle cx="144" cy="70" r="2.5" fill={ac} /></g>;
        if (acc.type === '手表') return <rect key={i} x="42" y="272" width="10" height="6" rx="1.5" fill={ac} />;
        return null;
      })}
    </svg>
  );
}

function pat(p: { pattern?: string }, color: string): string {
  if (p.pattern === '条纹') return 'url(#s)';
  if (p.pattern === '格子') return 'url(#c)';
  return color;
}

export function AvatarCanvas() {
  const [outfit, setOutfit] = useState<AvatarOutfit>({
    id: 'draft', pieces: { accessories: [] }, savedAt: 0,
  });
  const { items } = useWardrobeStore();
  const addItem = useWardrobeStore((s) => s.addItem);

  const recommendations = useMemo(() => {
    const results: Array<{ item: WardrobeItem; score: number; reason: string }> = [];
    if (!items.length) return results;
    const sel = outfit.pieces;
    if (sel.top?.type) {
      for (const b of items.filter(i => ['牛仔裤','西裤','短裤','A字裙'].includes(i.category))) {
        const s = scoreColorPair(sel.top.color, b.attributes.primaryColor) * 0.5 +
          scoreStylePair(getStyle(sel.top.type), b.styleTags || []) * 0.5;
        if (s > 0.5) results.push({ item: b, score: s, reason: s >= 0.9 ? '完美搭配' : s >= 0.75 ? '推荐搭配' : '可选搭配' });
      }
    }
    if (sel.bottom?.type) {
      for (const t of items.filter(i => ['T恤','衬衫','卫衣','针织衫','吊带'].includes(i.category))) {
        const s = scoreColorPair(sel.bottom.color, t.attributes.primaryColor) * 0.5 +
          scoreStylePair(getStyle(sel.bottom.type), t.styleTags || []) * 0.5;
        if (s > 0.5) results.push({ item: t, score: s, reason: s >= 0.9 ? '完美搭配' : s >= 0.75 ? '推荐搭配' : '可选搭配' });
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [outfit, items]);

  const handleSave = () => {
    const svg = document.querySelector('.fashion-figure-svg') as unknown as SVGElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const c = document.createElement('canvas'); c.width = 220; c.height = 440;
    const img = new Image();
    img.onload = async () => {
      c.getContext('2d')!.drawImage(img, 0, 0);
      const url = c.toDataURL('image/png');
      const tc = document.createElement('canvas'); tc.width = 60; tc.height = 120;
      tc.getContext('2d')!.drawImage(img, 0, 0, 60, 120);
      const tUrl = tc.toDataURL('image/png');
      await addItem({
        id: Date.now().toString(36)+Math.random().toString(36).slice(2,8),
        imageDataUrl: url, thumbnailDataUrl: tUrl, source: 'avatar',
        category: outfit.pieces.top?.type || outfit.pieces.dress?.type || '虚拟试衣',
        attributes: {
          primaryColor: outfit.pieces.top?.color || outfit.pieces.dress?.color || '未知',
          pattern: outfit.pieces.top?.pattern || '纯色', material: '', season: '', formality: '',
        },
        styleTags: [], tags: [], notes: '', createdAt: Date.now(), wearCount: 0, isFavorite: false,
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
  };

  const hasOutfit = !!(outfit.pieces.top || outfit.pieces.bottom || outfit.pieces.dress);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-[45%] fashion-figure-svg bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden p-2">
          <FashionFigure outfit={outfit} />
        </div>
        <div className="flex-1 min-w-0">
          <AvatarControls outfit={outfit} onChange={setOutfit} />
        </div>
      </div>
      <button onClick={handleSave}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium">
        💾 保存到衣橱
      </button>
      {hasOutfit && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-primary-100 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span>✨</span>
            <h3 className="font-semibold text-gray-700">衣橱搭配推荐</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map(({ item, score, reason }) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 hover:border-primary-200">
                <img src={item.thumbnailDataUrl} className="w-12 h-12 rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{item.category}</div>
                  <div className="text-xs text-gray-400">{item.attributes.primaryColor}</div>
                  <div className="text-xs text-primary-500">{reason} · {(score*100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStyle(cat: string): import('../../types').StyleLabel[] {
  const m: Record<string, import('../../types').StyleLabel[]> = {
    'T恤':['minimalist','sporty'],'衬衫':['minimalist','elegant'],'卫衣':['sporty','street'],
    '针织衫':['minimalist','elegant','sweet'],'吊带':['sweet','street'],'牛仔裤':['minimalist','street'],
    '西裤':['elegant','tomboy'],'短裤':['sporty','street'],'A字裙':['sweet','elegant'],
    '连衣裙':['sweet','elegant'],'连体裤':['street','tomboy'],
  };
  return m[cat] || ['minimalist'];
}
