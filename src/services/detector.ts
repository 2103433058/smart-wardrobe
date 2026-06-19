import * as cocoSsd from '@tensorflow-models/coco-ssd';
import type { RecognitionResult, ClothingAttributes, StyleLabel } from '../types';
import { analyzeColors } from './colorAnalyzer';
import { detectPattern } from './patternDetector';

let model: cocoSsd.ObjectDetection | null = null;

const CLOTHING_CLASSES = new Set([
  'person', 'backpack', 'handbag', 'tie', 'suitcase',
]);

const CATEGORY_MAP: Record<string, string> = {
  person: '全身穿搭',
  backpack: '背包',
  handbag: '手提包',
  tie: '领带',
  suitcase: '行李箱',
};

export async function loadDetector(): Promise<void> {
  if (model) return;
  model = await cocoSsd.load({ base: 'mobilenet_v2' });
}

export function isDetectorReady(): boolean {
  return model !== null;
}

export async function detectClothing(imageDataUrl: string): Promise<RecognitionResult | null> {
  if (!model) throw new Error('Detector not loaded');

  const img = await loadImageForTF(imageDataUrl);
  const predictions = await model.detect(img);

  const clothing = predictions.filter((p) => CLOTHING_CLASSES.has(p.class) && p.score > 0.3);
  if (clothing.length === 0) return null;

  const best = clothing.reduce((a, b) => (a.score > b.score ? a : b));

  // Extract pixel data from bounding box for color/pattern analysis
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const crop = ctx.getImageData(best.bbox[0], best.bbox[1], best.bbox[2], best.bbox[3]);

  const colors = analyzeColors(crop);
  const pattern = detectPattern(crop);

  const attributes: ClothingAttributes = {
    primaryColor: colors[0] || '未知',
    secondaryColor: colors[1],
    pattern,
    material: '未知',
    season: inferSeason(colors[0]),
    formality: inferFormality(CATEGORY_MAP[best.class] || best.class),
  };

  return {
    category: CATEGORY_MAP[best.class] || best.class,
    confidence: best.score,
    attributes,
    styleTags: inferStyleTags(CATEGORY_MAP[best.class] || best.class, attributes),
  };
}

function loadImageForTF(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

function inferSeason(_color: string): string {
  return '四季';
}

function inferFormality(category: string): string {
  const map: Record<string, string> = { tie: '正装', backpack: '休闲' };
  return map[category] || '休闲';
}

function inferStyleTags(category: string, _attrs: ClothingAttributes): StyleLabel[] {
  const map: Record<string, StyleLabel[]> = {
    tie: ['elegant'],
    backpack: ['sporty'],
  };
  return map[category] || ['minimalist'];
}
