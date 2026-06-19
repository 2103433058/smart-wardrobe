import type { UserProfile, WardrobeItem, BodyShape } from '../../types';

// Scoring rules per body shape
const BODY_RULES: Record<BodyShape, {
  recommend: string[];   // recommended categories/keywords
  avoid: string[];       // keywords to avoid
  tips: Record<string, string>;
}> = {
  'inverted-triangle': {
    recommend: ['A字裙', '阔腿裤', '深色', 'V领'],
    avoid: ['垫肩', '泡泡袖', '横条纹上装'],
    tips: { default: '强调下半身，选择阔腿裤或A字裙平衡肩宽' },
  },
  'hourglass': {
    recommend: ['收腰', '裹身裙', '高腰裤', 'V领'],
    avoid: ['宽松无腰线', '直筒连衣裙'],
    tips: { default: '突出腰线，选择收腰设计的单品' },
  },
  'rectangle': {
    recommend: ['腰带', 'A字裙', '泡泡袖', '层叠'],
    avoid: ['直筒无腰线'],
    tips: { default: '制造腰线，通过腰带或层叠穿搭增加曲线' },
  },
  'pear': {
    recommend: ['船领', '亮色上装', '深色下装', '直筒裤'],
    avoid: ['紧身裙', '亮色下装'],
    tips: { default: '强调上半身，亮色上装配深色下装' },
  },
  'apple': {
    recommend: ['V领', 'A字连衣裙', '垂坠面料', '帝国腰线'],
    avoid: ['紧身腰腹', '高腰紧身'],
    tips: { default: 'V领拉长颈部，选择垂坠面料避免紧绷' },
  },
};

export function scoreBodyMatch(profile: UserProfile, item: WardrobeItem): { score: number; notes: string } {
  const rules = BODY_RULES[profile.body.shape];
  if (!rules) return { score: 0.5, notes: '' };

  const text = `${item.category} ${item.attributes.primaryColor} ${item.notes}`.toLowerCase();
  let score = 0.5; // neutral baseline

  for (const rec of rules.recommend) {
    if (text.includes(rec.toLowerCase())) score += 0.12;
  }
  for (const av of rules.avoid) {
    if (text.includes(av.toLowerCase())) score -= 0.15;
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    notes: rules.tips.default,
  };
}
