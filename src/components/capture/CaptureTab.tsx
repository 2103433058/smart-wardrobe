import { useState, useCallback, lazy, Suspense } from 'react';
import { CameraCapture } from './CameraCapture';
import { FileUpload } from './FileUpload';
import { ResultCard } from './ResultCard';

const AvatarCanvas = lazy(() => import('../avatar/AvatarCanvas').then(m => ({ default: m.AvatarCanvas })));
import type { RecognitionResult, ClothingAttributes, StyleLabel } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { createThumbnail } from '../../utils/imageUtils';
import { analyzeColors } from '../../services/colorAnalyzer';
import { detectPattern } from '../../services/patternDetector';

type InputMode = 'camera' | 'upload' | 'avatar';

const CATEGORIES = [
  { label: 'T恤', icon: '👕' },
  { label: '衬衫', icon: '👔' },
  { label: '卫衣', icon: '🧥' },
  { label: '针织衫', icon: '🧶' },
  { label: '吊带', icon: '👗' },
  { label: '牛仔裤', icon: '👖' },
  { label: '西裤', icon: '👖' },
  { label: '短裤', icon: '🩳' },
  { label: 'A字裙', icon: '👗' },
  { label: '连衣裙', icon: '👗' },
  { label: '连体裤', icon: '👘' },
  { label: '夹克', icon: '🧥' },
  { label: '大衣', icon: '🧥' },
  { label: '开衫', icon: '🧶' },
];

interface PendingImage {
  dataUrl: string;
}

const STYLE_MAP: Record<string, StyleLabel[]> = {
  T恤: ['minimalist', 'sporty'],
  衬衫: ['minimalist', 'elegant'],
  卫衣: ['sporty', 'street'],
  针织衫: ['minimalist', 'elegant', 'sweet'],
  吊带: ['sweet', 'street'],
  牛仔裤: ['minimalist', 'street', 'sporty'],
  西裤: ['elegant', 'tomboy'],
  短裤: ['sporty', 'street'],
  A字裙: ['sweet', 'elegant'],
  连衣裙: ['sweet', 'elegant'],
  连体裤: ['street', 'tomboy'],
  夹克: ['street', 'tomboy'],
  大衣: ['elegant', 'tomboy'],
  开衫: ['sweet', 'minimalist'],
};

const FORMALITY_MAP: Record<string, string> = {
  T恤: '休闲', 衬衫: '商务', 卫衣: '休闲', 针织衫: '休闲', 吊带: '休闲',
  牛仔裤: '休闲', 西裤: '商务', 短裤: '休闲', A字裙: '商务', 连衣裙: '商务',
  连体裤: '休闲', 夹克: '休闲', 大衣: '商务', 开衫: '休闲',
};

async function analyzeImage(dataUrl: string): Promise<{ colors: string[]; pattern: string }> {
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 224;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const colors = analyzeColors(imageData);
      const pattern = detectPattern(imageData);
      resolve({ colors, pattern });
    };
    img.src = dataUrl;
  });
}

export function CaptureTab() {
  const [mode, setMode] = useState<InputMode>('camera');
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Array<{ result: RecognitionResult; imageUrl: string }>>([]);
  const addItem = useWardrobeStore((s) => s.addItem);

  // Step 1: Image captured → show category picker
  const handleImageCapture = useCallback((dataUrl: string) => {
    setPendingImage({ dataUrl });
  }, []);

  // Step 2: User picks category → analyze colors/pattern → show result
  const handlePickCategory = useCallback(async (category: string) => {
    if (!pendingImage) return;
    setAnalyzing(true);
    try {
      const { colors, pattern } = await analyzeImage(pendingImage.dataUrl);
      const attributes: ClothingAttributes = {
        primaryColor: colors[0] || '未知',
        secondaryColor: colors[1],
        pattern,
        material: '未知',
        season: inferSeason(colors[0]),
        formality: FORMALITY_MAP[category] || '休闲',
      };
      const result: RecognitionResult = {
        category,
        confidence: 1.0,
        attributes,
        styleTags: STYLE_MAP[category] || ['minimalist'],
      };
      setResults((prev) => [...prev, { result, imageUrl: pendingImage.dataUrl }]);
      setPendingImage(null);
    } finally {
      setAnalyzing(false);
    }
  }, [pendingImage]);

  const handleSave = async (imageUrl: string, result: RecognitionResult) => {
    const thumb = await createThumbnail(imageUrl);
    await addItem({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      imageDataUrl: imageUrl,
      thumbnailDataUrl: thumb,
      source: mode === 'camera' ? 'camera' : 'upload',
      category: result.category,
      attributes: result.attributes,
      styleTags: result.styleTags,
      tags: [],
      notes: '',
      createdAt: Date.now(),
      wearCount: 0,
      isFavorite: false,
    });
    setResults((prev) => prev.filter((r) => r.imageUrl !== imageUrl));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">识别录入</h1>

      {/* Mode switcher */}
      <div className="flex bg-primary-50 rounded-2xl p-1">
        {([
          ['camera', '📷 拍照'],
          ['upload', '📁 上传'],
          ['avatar', '🎨 虚拟试衣'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === key ? 'bg-white text-primary-500 shadow-md' : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'camera' && <CameraCapture onCapture={handleImageCapture} />}
      {mode === 'upload' && <FileUpload onFiles={(urls) => urls.forEach(handleImageCapture)} />}
      {mode === 'avatar' && (
                <Suspense fallback={<div className="text-center py-12 text-gray-400"><div className="text-2xl animate-pulse">🎨</div><p>加载中...</p></div>}>
                  <AvatarCanvas />
                </Suspense>
              )}

      {/* Category picker after image capture */}
      {pendingImage && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 space-y-3">
          <div className="flex gap-3">
            <img src={pendingImage.dataUrl} alt="captured" className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">选择衣物类型</p>
              <p className="text-xs text-gray-400 mt-1">自动分析颜色与图案</p>
            </div>
          </div>
          {analyzing ? (
            <p className="text-center text-sm text-primary-500 py-4">⏳ 分析中...</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => handlePickCategory(label)}
                  className="py-2 px-1 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                >
                  <div className="text-lg">{icon}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{label}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">识别结果</h2>
          {results.map(({ result, imageUrl }) => (
            <ResultCard
              key={imageUrl}
              result={result}
              imageUrl={imageUrl}
              onSave={() => handleSave(imageUrl, result)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function inferSeason(color: string): string {
  const warm = ['红', '橙', '黄', '粉', '驼', '金', '米', '棕'];
  const cool = ['蓝', '绿', '黑', '灰', '银', '白', '紫', '青'];
  if (warm.some((c) => color.includes(c))) return '春夏';
  if (cool.some((c) => color.includes(c))) return '秋冬';
  return '四季';
}
