import type { WardrobeItem } from '../types';

export function generateSearchQuery(item: WardrobeItem): string {
  const parts = [item.attributes.primaryColor, item.attributes.pattern, item.category].filter(
    (p) => p && p !== '纯色' && p !== '未知'
  );
  return parts.join(' ').trim();
}

const PLATFORMS = {
  taobao: (q: string) => `https://s.taobao.com/search?q=${encodeURIComponent(q)}`,
  jd: (q: string) => `https://search.jd.com/Search?keyword=${encodeURIComponent(q)}`,
  pdd: (q: string) => `https://mobile.yangkeduo.com/search_result.html?search_key=${encodeURIComponent(q)}`,
  xhs: (q: string) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(q)}`,
};

export function getSearchLinks(item: WardrobeItem): Array<{ name: string; url: string }> {
  const query = generateSearchQuery(item);
  return Object.entries(PLATFORMS).map(([name, fn]) => ({
    name: name === 'taobao' ? '淘宝' : name === 'jd' ? '京东' : name === 'pdd' ? '拼多多' : '小红书',
    url: fn(query),
  }));
}
