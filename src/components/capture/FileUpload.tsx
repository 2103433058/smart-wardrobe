import { useCallback, useRef, useState } from 'react';

interface Props {
  onFiles: (dataUrls: string[]) => void;
}

export function FileUpload({ onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    (files: FileList) => {
      const readers: Promise<string>[] = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map(
          (f) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(f);
            })
        );
      Promise.all(readers).then(onFiles);
    },
    [onFiles]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      <p className="text-4xl mb-2">📁</p>
      <p className="text-gray-600">点击选择或拖拽图片到此处</p>
      <p className="text-gray-400 text-sm mt-1">支持 JPG / PNG / WebP</p>
    </div>
  );
}
