import { useState, useEffect, useMemo } from 'react';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { useProfileStore } from '../../stores/profileStore';
import { RecommendationCard } from './RecommendationCard';
import { WeightSliders } from './WeightSliders';
import { generateRecommendations } from '../../services/recommendation/engine';
import type { Occasion, OutfitCombo } from '../../types';

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'commute', label: '🏢 通勤上班' },
  { value: 'date', label: '💕 约会聚会' },
  { value: 'travel', label: '✈️ 旅行度假' },
  { value: 'sports', label: '🏃 运动健身' },
  { value: 'formal', label: '🎩 重要场合' },
  { value: 'casual', label: '☕ 周末休闲' },
];

export function RecommendationList() {
  const { items, loadItems } = useWardrobeStore();
  const { profile, loadProfile, hasProfile } = useProfileStore();
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [weights, setWeights] = useState({ body: 0.30, color: 0.25, style: 0.25, occasion: 0.20, dressBonus: 0.05 });

  useEffect(() => { loadItems(); loadProfile(); }, [loadItems, loadProfile]);

  const combos = useMemo(() => {
    if (!hasProfile || items.length === 0) return [];
    return generateRecommendations(profile, items, occasion, weights);
  }, [profile, items, occasion, weights, hasProfile]);

  if (!hasProfile) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">👤</p>
        <p>请先完善用户画像</p>
        <p className="text-sm mt-1">在「用户画像」页完成测试后，即可获得个性化推荐</p>
      </div>
    );
  }

  if (items.length < 2) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">👗</p>
        <p>衣橱需要至少 2 件衣物才能生成搭配</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">搭配推荐</h1>

      {/* Occasion selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {OCCASIONS.map(({ value, label }) => (
          <button key={value} onClick={() => setOccasion(value)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              occasion === value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <WeightSliders weights={weights} onChange={setWeights} />

      {combos.length === 0 ? (
        <div className="text-center py-8 text-gray-400">当前条件下没有合适的搭配方案</div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">共 {combos.length} 个方案</p>
          {combos.map((combo) => (
            <RecommendationCard key={combo.id} combo={combo} />
          ))}
        </div>
      )}
    </div>
  );
}
