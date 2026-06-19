export function detectPattern(imageData: ImageData): string {
  const { data, width, height } = imageData;

  // Downsample to 64x64 grayscale
  const size = 64;
  const gray: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  const ratioX = width / size;
  const ratioY = height / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const sx = Math.floor(x * ratioX);
      const sy = Math.floor(y * ratioY);
      const i = (sy * width + sx) * 4;
      gray[y][x] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
  }

  // Compute horizontal and vertical gradients
  let hEdges = 0;
  let vEdges = 0;
  let total = 0;

  for (let y = 1; y < size; y++) {
    for (let x = 1; x < size; x++) {
      const hDiff = Math.abs(gray[y][x] - gray[y][x - 1]);
      const vDiff = Math.abs(gray[y][x] - gray[y - 1][x]);
      if (hDiff > 30) hEdges++;
      if (vDiff > 30) vEdges++;
      total++;
    }
  }

  const edgeRatio = (hEdges + vEdges) / (2 * total);

  if (edgeRatio < 0.05) return '纯色';
  if (edgeRatio < 0.15) {
    // Check if edges are regular (grid-like)
    const regularity = Math.abs(hEdges - vEdges) / Math.max(hEdges, vEdges);
    return regularity < 0.3 ? '格子' : '条纹';
  }
  return '印花';
}
