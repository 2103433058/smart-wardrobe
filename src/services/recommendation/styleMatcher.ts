import type { UserProfile, WardrobeItem, StyleLabel } from '../../types';

// Adjacency: which styles can mix
const STYLE_COMPAT: Record<StyleLabel, StyleLabel[]> = {
  minimalist: ['elegant', 'tomboy', 'sporty'],
  sweet: ['elegant'],
  tomboy: ['minimalist', 'street'],
  street: ['sporty', 'tomboy'],
  elegant: ['minimalist', 'sweet'],
  sporty: ['minimalist', 'street'],
};

export function scoreStyleMatch(profile: UserProfile, item: WardrobeItem): { score: number; notes: string } {
  const { primaryStyle, secondaryStyle } = profile.styleProfile;

  // Direct match with primary style
  if (item.styleTags.includes(primaryStyle)) {
    return { score: 1.0, notes: `与你的主风格「${primaryStyle}」一致` };
  }

  // Direct match with secondary style
  if (item.styleTags.includes(secondaryStyle)) {
    return { score: 0.85, notes: `与你的辅风格「${secondaryStyle}」相符` };
  }

  // Compatible mix
  const compat = STYLE_COMPAT[primaryStyle] || [];
  for (const tag of item.styleTags) {
    if (compat.includes(tag)) {
      return { score: 0.7, notes: `「${tag}」与你的风格「${primaryStyle}」可混搭` };
    }
  }

  // No match
  return { score: 0.3, notes: '风格可能不太匹配' };
}

// For scoring style compatibility between two items
export function scoreStylePair(style1: StyleLabel[], style2: StyleLabel[]): number {
  for (const s1 of style1) {
    for (const s2 of style2) {
      if (s1 === s2) return 1.0;
      const compat = STYLE_COMPAT[s1] || [];
      if (compat.includes(s2)) return 0.8;
    }
  }
  return 0.4;
}
