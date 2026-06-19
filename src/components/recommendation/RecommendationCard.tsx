import type { OutfitCombo } from '../../types';
import { generateSearchQuery } from '../../services/ecommerce';

interface Props {
  combo: OutfitCombo;
}

export function RecommendationCard({ combo }: Props) {
  const { matchResult, items } = combo;
  const scorePercent = (matchResult.totalScore * 100).toFixed(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <span className="text-sm font-semibold text-gray-700">
          综合评分
        </span>
        <span className={`text-lg font-bold ${
          +scorePercent >= 80 ? 'text-green-600' : +scorePercent >= 60 ? 'text-yellow-600' : 'text-red-500'
        }`}>
          {scorePercent}%
        </span>
      </div>

      {/* Clothing preview */}
      <div className="flex gap-2 px-4 pb-3">
        {items.map((item) => (
          <div key={item.id} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border">
            <img src={item.thumbnailDataUrl} alt={item.category} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Score breakdown */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            ['体型', matchResult.bodyScore],
            ['色彩', matchResult.colorScore],
            ['风格', matchResult.styleScore],
            ['场合', matchResult.occasionScore],
          ].map(([label, score]) => (
            <div key={label}>
              <div className="text-gray-400 mb-0.5">{label}</div>
              <div className="font-medium">{(score * 100).toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className="px-4 pb-2 text-xs text-gray-500 space-y-1">
        {matchResult.analysis.suggestions.map((tip, i) => (
          <p key={i}>{tip}</p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-100 text-sm">
        {items.map((item) => {
          const q = generateSearchQuery(item);
          return (
            <a key={item.id} href={`https://s.taobao.com/search?q=${encodeURIComponent(q)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center text-gray-600 hover:bg-gray-50">
              🔗 搜「{item.category}」
            </a>
          );
        })}
      </div>
    </div>
  );
}
