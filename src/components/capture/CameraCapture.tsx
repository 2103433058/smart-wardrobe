import { useRef, useState, useCallback, useEffect } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
}

export function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const startCamera = useCallback(async () => {
    setStatus('starting');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('ready');
      }
    } catch (e: unknown) {
      const err = e as Error;
      if (err?.name === 'NotAllowedError') {
        setErrorMsg('摄像头权限被拒绝，请在浏览器设置中允许访问摄像头');
      } else if (err?.name === 'NotFoundError') {
        setErrorMsg('未检测到摄像头设备');
      } else {
        setErrorMsg('无法访问摄像头: ' + (err?.message || '未知错误'));
      }
      setStatus('error');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus('idle');
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
    return () => stopCamera();
  }, [stopCamera]);

  // Idle: show start button
  if (status === 'idle') {
    return (
      <button
        onClick={startCamera}
        className="w-full py-12 bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 hover:border-primary-400 transition-colors text-center"
      >
        <div className="text-4xl mb-2">📷</div>
        <div className="text-primary-500 font-medium">点击启动摄像头</div>
      </button>
    );
  }

  // Error: show message + retry
  if (status === 'error') {
    return (
      <div className="text-center py-12 bg-red-50 rounded-2xl">
        <p className="text-red-500 mb-4 text-sm px-4">{errorMsg}</p>
        <button onClick={startCamera} className="px-6 py-2 bg-primary-500 text-white rounded-xl">
          重试
        </button>
      </div>
    );
  }

  // Starting or Ready
  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4]">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        {status === 'starting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
            <div className="text-center">
              <div className="text-2xl mb-2 animate-pulse">📷</div>
              <div className="text-sm">启动摄像头中...</div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleCapture}
        disabled={status !== 'ready'}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium disabled:opacity-50"
      >
        {status === 'starting' ? '⏳ 摄像头准备中...' : '📸 拍照识别'}
      </button>
    </div>
  );
}
