import { useState, useMemo, Component } from 'react';
import { Avatar3D } from './Avatar3D';
import { AvatarControls } from './AvatarControls';
import type { AvatarOutfit, WardrobeItem } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { scoreColorPair } from '../../services/recommendation/colorMatcher';
import { scoreStylePair } from '../../services/recommendation/styleMatcher';

class AvatarErrorBoundary extends Component<{ children: React.ReactNode }, { err: string }> {
  state = { err: '' };
  static getDerivedStateFromError(e: Error) { return { err: e.message }; }
  render() {
    if (this.state.err) return <div className="text-center py-8 text-red-400 text-sm">❌ 3D渲染出错: {this.state.err}</div>;
    return this.props.children;
  }
}

export function AvatarCanvas() {
  const [outfit, setOutfit] = useState<AvatarOutfit>({
    id: '',
    pieces: { accessories: [] },
    savedAt: 0,
  });
  const { items } = useWardrobeStore();
  const addItem = useWardrobeStore((s) => s.addItem);

  // Recommend matching wardrobe items for the current avatar outfit
  const recommendations = useMemo(() => {
    const results: Array<{ item: WardrobeItem; score: number; reason: string }> = [];
    if (!items.length) return results;

    const selectedTop = outfit.pieces.top;
    const selectedBottom = outfit.pieces.bottom;
    const selectedDress = outfit.pieces.dress;

    // If user selected a top, recommend bottoms
    if (selectedTop?.type) {
      const bottoms = items.filter((i) =>
        ['牛仔裤', '西裤', '短裤', 'A字裙'].includes(i.category)
      );
      for (const b of bottoms) {
        const colorScore = scoreColorPair(selectedTop.color, b.attributes.primaryColor);
        const styleCombo = scoreStylePair(
          getStyleForCategory(selectedTop.type),
          b.styleTags || []
        );
        const score = colorScore * 0.5 + styleCombo * 0.5;
        if (score > 0.5) {
          results.push({ item: b, score, reason: getReason(score, '下装') });
        }
      }
    }

    // If user selected a bottom, recommend tops
    if (selectedBottom?.type) {
      const tops = items.filter((i) =>
        ['T恤', '衬衫', '卫衣', '针织衫', '吊带'].includes(i.category)
      );
      for (const t of tops) {
        const colorScore = scoreColorPair(selectedBottom.color, t.attributes.primaryColor);
        const styleCombo = scoreStylePair(
          getStyleForCategory(selectedBottom.type),
          t.styleTags || []
        );
        const score = colorScore * 0.5 + styleCombo * 0.5;
        if (score > 0.5) {
          results.push({ item: t, score, reason: getReason(score, '上装') });
        }
      }
    }

    // Recommend outers for any complete outfit
    if (selectedDress || (selectedTop && selectedBottom)) {
      const outers = items.filter((i) =>
        ['夹克', '大衣', '开衫'].includes(i.category)
      );
      for (const o of outers) {
        const baseColor = selectedDress?.color || selectedTop?.color || '';
        const colorScore = scoreColorPair(baseColor, o.attributes.primaryColor);
        if (colorScore > 0.6) {
          results.push({ item: o, score: colorScore, reason: '搭配外套更完整' });
        }
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [outfit, items]);

  const handleSave = async () => {
    const svgEl = document.querySelector('.avatar-svg-container svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 420;
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

  const hasOutfit = outfit.pieces.top || outfit.pieces.bottom || outfit.pieces.dress;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-[45%] avatar-svg-container">
          <AvatarErrorBoundary><Avatar3D outfit={outfit} /></AvatarErrorBoundary>
        </div>
        <div className="flex-1 min-w-0">
          <AvatarControls outfit={outfit} onChange={setOutfit} />
        </div>
      </div>

      <button onClick={handleSave}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium">
        💾 保存到衣橱
      </button>

      {/* Wardrobe Recommendations */}
      {hasOutfit && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-primary-100 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h3 className="font-semibold text-gray-700">衣橱搭配推荐</h3>
            <span className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
              匹配你的衣橱
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map(({ item, score, reason }) => (
              <div key={item.id}
                className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-colors cursor-pointer"
              >
                <img src={item.thumbnailDataUrl} alt={item.category}
                  className="w-12 h-12 rounded-lg object-cover bg-warm-50 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-700 truncate">{item.category}</div>
                  <div className="text-xs text-gray-400">{item.attributes.primaryColor}</div>
                  <div className="text-xs text-primary-500 mt-0.5">
                    {reason} · {(score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasOutfit && recommendations.length === 0 && items.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-400">
          衣橱中暂未找到匹配的单品，先去添加更多衣物吧
        </div>
      )}
    </div>
  );
}

function getStyleForCategory(category: string): import('../../types').StyleLabel[] {
  const map: Record<string, import('../../types').StyleLabel[]> = {
    'T恤': ['minimalist', 'sporty'],
    '衬衫': ['minimalist', 'elegant'],
    '卫衣': ['sporty', 'street'],
    '针织衫': ['minimalist', 'elegant', 'sweet'],
    '吊带': ['sweet', 'street'],
    '牛仔裤': ['minimalist', 'street'],
    '西裤': ['elegant', 'tomboy'],
    '短裤': ['sporty', 'street'],
    'A字裙': ['sweet', 'elegant'],
    '连衣裙': ['sweet', 'elegant'],
    '连体裤': ['street', 'tomboy'],
    '夹克': ['street', 'tomboy'],
    '大衣': ['elegant', 'tomboy'],
    '开衫': ['sweet', 'minimalist'],
  };
  return map[category] || ['minimalist'];
}

function getReason(score: number, slot: string): string {
  if (score >= 0.9) return `完美${slot}`;
  if (score >= 0.75) return `推荐${slot}`;
  return `可选${slot}`;
}
