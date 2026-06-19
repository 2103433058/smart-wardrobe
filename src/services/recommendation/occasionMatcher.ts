import type { Occasion, WardrobeItem } from '../../types';

const OCCASION_RULES: Record<Occasion, { categories: string[]; formality: string[]; reject: string[] }> = {
  commute: {
    categories: ['衬衫', '西裤', '西装', '中长裙', '针织衫', '乐福鞋'],
    formality: ['商务', '正装'],
    reject: ['运动服', '拖鞋', '超短裙', '吊带'],
  },
  date: {
    categories: ['连衣裙', '衬衫', '精致', '高跟鞋', '短靴'],
    formality: ['休闲', '商务'],
    reject: ['运动服', '过于正式'],
  },
  travel: {
    categories: ['舒适', '防晒', '轻便', '卫衣', '运动鞋', 'T恤', '牛仔裤'],
    formality: ['休闲'],
    reject: ['正装', '高跟鞋'],
  },
  sports: {
    categories: ['运动', '卫衣', 'T恤', '短裤', '运动鞋'],
    formality: ['休闲'],
    reject: ['正装', '高跟鞋', '皮鞋'],
  },
  formal: {
    categories: ['西装', '礼服', '正装', '精致', '深色', '高跟鞋'],
    formality: ['正装'],
    reject: ['运动', '休闲', '拖鞋'],
  },
  casual: {
    categories: ['卫衣', '牛仔裤', 'T恤', '便鞋', '休闲'],
    formality: ['休闲'],
    reject: ['正装'],
  },
};

export function scoreOccasionMatch(
  occasion: Occasion,
  item: WardrobeItem
): { score: number; notes: string } {
  const rules = OCCASION_RULES[occasion];
  if (!rules) return { score: 0.5, notes: '' };

  const text = `${item.category} ${item.attributes.formality}`.toLowerCase();
  let score = 0.5;

  for (const cat of rules.categories) {
    if (text.includes(cat.toLowerCase())) score += 0.12;
  }
  for (const form of rules.formality) {
    if (text.includes(form.toLowerCase())) score += 0.1;
  }
  for (const rej of rules.reject) {
    if (text.includes(rej.toLowerCase())) score -= 0.2;
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    notes: score > 0.7 ? '适合该场合' : score < 0.3 ? '不太适合该场合' : '',
  };
}
