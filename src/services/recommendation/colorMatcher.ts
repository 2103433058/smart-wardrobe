import type { UserProfile, WardrobeItem, SkinTone } from '../../types';

const SKIN_TONE_COLORS: Record<SkinTone, { good: string[]; caution: string[] }> = {
  warm: {
    good: ['驼色', '棕色', '卡其', '米色', '橙色', '金色', '橄榄绿', '奶油白', '暖红'],
    caution: ['冰蓝', '纯白', '银色', '冷粉', '紫色'],
  },
  cool: {
    good: ['蓝色', '紫色', '灰色', '银色', '纯白', '玫红', '藏蓝', '青绿'],
    caution: ['橙色', '金色', '驼色', '黄绿', '暖红'],
  },
  neutral: {
    good: ['黑色', '白色', '灰色', '蓝色', '绿色', '红色', '粉色'],
    caution: [],
  },
};

// Pairs that look good together (top-bottom color combos)
const COLOR_PAIRS: Record<string, string[]> = {
  '白色': ['蓝色', '黑色', '灰色', '红色', '绿色', '粉色'],
  '黑色': ['白色', '灰色', '红色', '蓝色', '粉色'],
  '蓝色': ['白色', '灰色', '黑色', '米色'],
  '灰色': ['白色', '黑色', '粉色', '蓝色'],
  '红色': ['黑色', '白色', '灰色'],
  '米色': ['蓝色', '白色', '棕色', '黑色'],
  '棕色': ['米色', '白色', '黑色', '绿色'],
  '粉色': ['白色', '灰色', '黑色', '蓝色'],
  '绿色': ['白色', '黑色', '米色', '棕色'],
};

export function scoreColorMatch(profile: UserProfile, item: WardrobeItem): { score: number; notes: string } {
  // Priority 1: User explicitly avoids this color → heavily penalize
  if (profile.color.avoidColors.length > 0) {
    const itemColor = item.attributes.primaryColor;
    if (profile.color.avoidColors.some((c) => itemColor.includes(c))) {
      return { score: 0.1, notes: `你回避的颜色: ${itemColor}` };
    }
  }

  // Priority 2: Skin tone matching
  const toneRules = SKIN_TONE_COLORS[profile.color.skinTone];
  const itemColor = item.attributes.primaryColor;
  let score = 0.6;

  for (const good of toneRules.good) {
    if (itemColor.includes(good)) { score += 0.15; break; }
  }
  for (const caution of toneRules.caution) {
    if (itemColor.includes(caution)) { score -= 0.15; break; }
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    notes: score > 0.7
      ? `${itemColor}与你的${profile.color.skinTone === 'warm' ? '暖' : profile.color.skinTone === 'cool' ? '冷' : '中性'}色调肤色相配`
      : score < 0.4
        ? `${itemColor}可能不太适合你的肤色基调`
        : '',
  };
}

// For scoring how well two items' colors go together
export function scoreColorPair(color1: string, color2: string): number {
  const pairs = COLOR_PAIRS[color1];
  if (!pairs) return 0.5;
  return pairs.some((c) => color2.includes(c)) ? 0.9 : 0.3;
}
