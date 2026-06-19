import type { WardrobeItem } from '../types';

export function generateSearchQuery(item: WardrobeItem): string {
  const parts = [item.category];
  if (item.attributes.primaryColor) parts.push(item.attributes.primaryColor);
  if (item.styleTags.length > 0) parts.push(item.styleTags[0]);
  return parts.join(' ');
}
