// Simplified color analysis using histogram peaks
const COLOR_NAMES: Array<[string, [number, number, number]]> = [
  ['黑色', [0, 0, 0]],
  ['白色', [255, 255, 255]],
  ['灰色', [128, 128, 128]],
  ['红色', [255, 0, 0]],
  ['蓝色', [0, 0, 255]],
  ['绿色', [0, 128, 0]],
  ['黄色', [255, 255, 0]],
  ['橙色', [255, 165, 0]],
  ['紫色', [128, 0, 128]],
  ['粉色', [255, 192, 203]],
  ['棕色', [139, 69, 19]],
  ['米色', [245, 245, 220]],
  ['藏蓝', [0, 0, 128]],
  ['卡其', [195, 176, 145]],
];

function colorDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

export function analyzeColors(imageData: ImageData): string[] {
  const { data } = imageData;
  const step = 4; // sample every 4th pixel for performance
  const histogram = new Map<number, number>();

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Quantize to 32 levels per channel
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = (qr << 16) | (qg << 8) | qb;
    histogram.set(key, (histogram.get(key) || 0) + 1);
  }

  const sorted = [...histogram.entries()].sort((a, b) => b[1] - a[1]);
  const results: string[] = [];

  for (let i = 0; i < Math.min(2, sorted.length); i++) {
    const [key] = sorted[i];
    const r = (key >> 16) & 0xff;
    const g = (key >> 8) & 0xff;
    const b = key & 0xff;
    let bestName = '其他';
    let bestDist = Infinity;
    for (const [name, [cr, cg, cb]] of COLOR_NAMES) {
      const dist = colorDistance([r, g, b], [cr, cg, cb]);
      if (dist < bestDist) {
        bestDist = dist;
        bestName = name;
      }
    }
    if (!results.includes(bestName)) results.push(bestName);
  }

  return results;
}
