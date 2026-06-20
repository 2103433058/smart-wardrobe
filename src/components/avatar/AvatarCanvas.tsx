import { useState, useMemo } from 'react';
import { Avatar3D } from './Avatar3D';
import { AvatarControls } from './AvatarControls';
import type { AvatarOutfit, WardrobeItem } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { scoreColorPair } from '../../services/recommendation/colorMatcher';
import { scoreStylePair } from '../../services/recommendation/styleMatcher';

export function AvatarCanvas() {
  const [outfit, setOutfit] = useState<AvatarOutfit>({
    id: 'draft', pieces: { accessories: [] }, savedAt: 0,
  });
  const { items } = useWardrobeStore();
  const addItem = useWardrobeStore((s) => s.addItem);

  const recommendations = useMemo(() => {
    const r: Array<{ item: WardrobeItem; score: number; reason: string }> = [];
    if (!items.length) return r;
    const sel = outfit.pieces;
    try {
      if (sel.top?.color) for (const b of items.filter(i=>['牛仔裤','西裤','短裤','A字裙'].includes(i.category))) {
        const sc = scoreColorPair(sel.top.color,b.attributes?.primaryColor||'')*.5 + scoreStylePair(gS(sel.top.type),b.styleTags||[])*.5;
        if (sc>.5) r.push({item:b,score:sc,reason:sc>=.9?'完美':sc>=.75?'推荐':'可选'});
      }
      if (sel.bottom?.color) for (const t of items.filter(i=>['T恤','衬衫','卫衣','针织衫','吊带'].includes(i.category))) {
        const sc = scoreColorPair(sel.bottom.color,t.attributes?.primaryColor||'')*.5 + scoreStylePair(gS(sel.bottom.type),t.styleTags||[])*.5;
        if (sc>.5) r.push({item:t,score:sc,reason:sc>=.9?'完美':sc>=.75?'推荐':'可选'});
      }
    } catch {}
    return r.sort((a,b)=>b.score-a.score).slice(0,4);
  }, [outfit, items]);

  const handleSave = () => {
    const svg = document.querySelector('.avatar-svg-root svg');
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const c = document.createElement('canvas'); c.width=220; c.height=440;
    const img = new Image();
    img.onload = () => {
      c.getContext('2d')!.drawImage(img,0,0);
      const u = c.toDataURL('image/png');
      const tc = document.createElement('canvas'); tc.width=60; tc.height=120;
      tc.getContext('2d')!.drawImage(img,0,0,60,120);
      addItem({
        id: Date.now().toString(36)+Math.random().toString(36).slice(2,8),
        imageDataUrl: u, thumbnailDataUrl: tc.toDataURL('image/png'), source: 'avatar',
        category: outfit.pieces.top?.type || outfit.pieces.dress?.type || '虚拟试衣',
        attributes: { primaryColor: outfit.pieces.top?.color || outfit.pieces.dress?.color || '未知',
          pattern: outfit.pieces.top?.pattern || '纯色', material: '', season: '', formality: '' },
        styleTags: [], tags: [], notes: '', createdAt: Date.now(), wearCount: 0, isFavorite: false,
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
  };

  const hasO = !!(outfit.pieces.top || outfit.pieces.bottom || outfit.pieces.dress);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-[45%] avatar-svg-root bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden p-2">
          <Avatar3D outfit={outfit} />
        </div>
        <div className="flex-1 min-w-0">
          <AvatarControls outfit={outfit} onChange={setOutfit} />
        </div>
      </div>
      <button type="button" onClick={handleSave}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium">
        💾 保存到衣橱
      </button>
      {hasO && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-primary-100 p-4 space-y-3">
          <div className="flex items-center gap-2"><span>✨</span><h3 className="font-semibold text-gray-700">衣橱搭配推荐</h3></div>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map(({ item, score, reason }) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 hover:border-primary-200">
                <img src={item.thumbnailDataUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{item.category}</div>
                  <div className="text-xs text-gray-400">{item.attributes?.primaryColor}</div>
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

function gS(c: string): import('../../types').StyleLabel[] {
  const m: Record<string, import('../../types').StyleLabel[]> = {
    'T恤':['minimalist','sporty'],'衬衫':['minimalist','elegant'],'卫衣':['sporty','street'],
    '针织衫':['minimalist','elegant','sweet'],'吊带':['sweet','street'],'牛仔裤':['minimalist','street'],
    '西裤':['elegant','tomboy'],'短裤':['sporty','street'],'A字裙':['sweet','elegant'],
    '连衣裙':['sweet','elegant'],'连体裤':['street','tomboy'],
  };
  return m[c] || ['minimalist'];
}
