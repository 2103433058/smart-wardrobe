import { useRef, useState, useCallback, useEffect } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
}

export function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch {
      setError('无法访问摄像头，请检查权限设置');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setReady(false);
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')!.drawImage(videoRef.current, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg', 0.85));
  }, [onCapture]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={startCamera} className="px-4 py-2 bg-primary-500 text-white rounded-lg">
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4]">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            启动摄像头中...
          </div>
        )}
      </div>
      <button
        onClick={handleCapture}
        disabled={!ready}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium disabled:opacity-50"
      >
        📸 拍照识别
      </button>
    </div>
  );
}
