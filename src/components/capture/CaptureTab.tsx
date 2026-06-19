import { useState } from 'react';
import { CameraCapture } from './CameraCapture';
import { FileUpload } from './FileUpload';
import { ResultCard } from './ResultCard';
import type { RecognitionResult } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { createThumbnail } from '../../utils/imageUtils';

type InputMode = 'camera' | 'upload' | 'avatar';

export function CaptureTab() {
  const [mode, setMode] = useState<InputMode>('camera');
  const [results, setResults] = useState<Array<{ result: RecognitionResult; imageUrl: string }>>([]);
  const addItem = useWardrobeStore((s) => s.addItem);

  const handleImageCapture = async (dataUrl: string) => {
    // Phase 5 will replace this mock with real TF.js detection
    const mockResult: RecognitionResult = {
      category: 'T恤',
      confidence: 0.92,
      attributes: {
        primaryColor: '白色',
        secondaryColor: undefined,
        pattern: '纯色',
        material: '棉',
        season: '春夏',
        formality: '休闲',
      },
      styleTags: ['minimalist'],
    };
    setResults((prev) => [...prev, { result: mockResult, imageUrl: dataUrl }]);
  };

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
      {mode === 'avatar' && (
        <div className="text-center py-12 text-gray-400">虚拟试衣间 — 将在后续阶段实现</div>
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
