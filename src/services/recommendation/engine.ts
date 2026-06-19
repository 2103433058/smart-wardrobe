import type { Occasion, WardrobeItem, OutfitCombo, MatchResult } from '../../types';
import type { UserProfile } from '../../types';
import { scoreBodyMatch } from './bodyMatcher';
import { scoreColorMatch, scoreColorPair } from './colorMatcher';
import { scoreStyleMatch, scoreStylePair } from './styleMatcher';
import { scoreOccasionMatch } from './occasionMatcher';

interface Weights {
  body: number;
  color: number;
  style: number;
  occasion: number;
}

const DEFAULT_WEIGHTS: Weights = { body: 0.30, color: 0.25, style: 0.25, occasion: 0.20 };

export function generateRecommendations(
  profile: UserProfile,
  items: WardrobeItem[],
  occasion: Occasion,
  weights: Weights = DEFAULT_WEIGHTS
): OutfitCombo[] {
  if (items.length === 0) return [];

  // Categorize items
  const tops = items.filter((i) => ['T恤', '衬衫', '卫衣', '针织衫', '吊带'].includes(i.category));
  const bottoms = items.filter((i) => ['牛仔裤', '西裤', '短裤', 'A字裙'].includes(i.category));
  const dresses = items.filter((i) => ['连衣裙', '连体裤'].includes(i.category));
  const outers = items.filter((i) => ['夹克', '大衣', '开衫'].includes(i.category));

  const combos: OutfitCombo[] = [];

  // Generate top+bottom combos
  for (const top of tops) {
    for (const bottom of bottoms) {
      const combo = [top, bottom];
      const result = scoreCombo(profile, combo, occasion, weights);
      combos.push({
        id: `combo-${top.id}-${bottom.id}`,
        items: combo,
        matchResult: result,
      });
    }
  }

  // Generate dress-only combos (dress is complete outfit)
  for (const dress of dresses) {
    const combo = [dress];
    const result = scoreCombo(profile, combo, occasion, weights);
    // Dresses get a slight bonus for being a complete outfit
    result.totalScore = Math.min(1, result.totalScore + 0.05);
    combos.push({
      id: `combo-${dress.id}`,
      items: combo,
      matchResult: result,
    });
  }

  // Sort by total score descending
  return combos.sort((a, b) => b.matchResult.totalScore - a.matchResult.totalScore).slice(0, 10);
}

function scoreCombo(
  profile: UserProfile,
  combo: WardrobeItem[],
  occasion: Occasion,
  weights: Weights
): MatchResult {
  // Score each item against profile, average across items
  const bodyResults = combo.map((item) => scoreBodyMatch(profile, item));
  const colorResults = combo.map((item) => scoreColorMatch(profile, item));
  const styleResults = combo.map((item) => scoreStyleMatch(profile, item));
  const occasionResults = combo.map((item) => scoreOccasionMatch(occasion, item));

  const bodyScore = avg(bodyResults.map((r) => r.score));
  const colorScore = avg(colorResults.map((r) => r.score));
  const styleScore = avg(styleResults.map((r) => r.score));
  const occasionScore = avg(occasionResults.map((r) => r.score));

  // Bonus: color pair harmony (if 2+ items)
  let pairBonus = 0;
  if (combo.length >= 2) {
    pairBonus = scoreColorPair(combo[0].attributes.primaryColor, combo[1].attributes.primaryColor) * 0.1;
  }

  const totalScore =
    weights.body * bodyScore +
    weights.color * (colorScore + pairBonus) +
    weights.style * styleScore +
    weights.occasion * occasionScore;

  return {
    bodyScore,
    colorScore: colorScore + pairBonus,
    styleScore,
    occasionScore,
    totalScore: Math.max(0, Math.min(1, totalScore)),
    analysis: {
      body: bodyResults[0]?.notes || '',
      color: colorResults[0]?.notes || '',
      style: styleResults[0]?.notes || '',
      occasion: occasionResults[0]?.notes || '',
      suggestions: generateSuggestions(bodyScore, colorScore, styleScore, occasionScore, combo),
    },
  };
}

function avg(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function generateSuggestions(
  body: number, color: number, style: number, occasion: number,
  _combo: WardrobeItem[]
): string[] {
  const tips: string[] = [];
  if (body < 0.5) tips.push('💡 考虑调整版型以更贴合你的体型');
  if (color < 0.5) tips.push('💡 颜色可能不太适合你的肤色，试试其他色系');
  if (style < 0.5) tips.push('💡 风格与你的偏好有差异，可尝试混搭');
  if (occasion < 0.5) tips.push('💡 这套搭配可能不太适合所选场合');
  if (tips.length === 0) tips.push('✨ 这套搭配很适合你！');
  return tips;
}
