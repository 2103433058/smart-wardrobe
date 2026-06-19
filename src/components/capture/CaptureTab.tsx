import { useEffect, useState, useCallback } from 'react';
import { CameraCapture } from './CameraCapture';
import { FileUpload } from './FileUpload';
import { ResultCard } from './ResultCard';
import type { RecognitionResult } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { createThumbnail } from '../../utils/imageUtils';
import { loadDetector, detectClothing, isDetectorReady } from '../../services/detector';
import { AvatarCanvas } from '../avatar/AvatarCanvas';

type InputMode = 'camera' | 'upload' | 'avatar';

export function CaptureTab() {
  const [mode, setMode] = useState<InputMode>('camera');
  const [results, setResults] = useState<Array<{ result: RecognitionResult; imageUrl: string }>>([]);
  const [detectorLoading, setDetectorLoading] = useState(true);
  const addItem = useWardrobeStore((s) => s.addItem);

  useEffect(() => {
    loadDetector().then(() => setDetectorLoading(false));
  }, []);

  const handleImageCapture = useCallback(async (dataUrl: string) => {
    if (!isDetectorReady()) return;
    const result = await detectClothing(dataUrl);
    if (result) {
      setResults((prev) => [...prev, { result, imageUrl: dataUrl }]);
    }
  }, []);

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
      <div className="flex bg-gray-100 rounded-xl p-1">
        {([
          ['camera', '📷 拍照'],
          ['upload', '📁 上传'],
          ['avatar', '🎨 虚拟试衣'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      {mode === 'camera' && <CameraCapture onCapture={handleImageCapture} />}
      {mode === 'upload' && <FileUpload onFiles={(urls) => urls.forEach(handleImageCapture)} />}
      {mode === 'avatar' && <AvatarCanvas />}

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
