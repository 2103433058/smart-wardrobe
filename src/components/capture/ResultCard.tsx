import type { RecognitionResult } from '../../types';

interface Props {
  result: RecognitionResult;
  imageUrl: string;
  onSave: () => void;
}

export function ResultCard({ result, imageUrl, onSave }: Props) {
  const { category, confidence, attributes, styleTags } = result;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex gap-4 p-4">
        <img src={imageUrl} alt={category} className="w-24 h-24 object-cover rounded-lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{category}</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {[attributes.primaryColor, attributes.pattern, attributes.material, attributes.season]
              .filter(Boolean)
              .map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {styleTags.map((tag) => (
              <span key={tag} className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        <button onClick={onSave} className="flex-1 py-3 text-indigo-600 font-medium text-sm hover:bg-indigo-50">
          💾 保存到衣橱
        </button>
        <button className="flex-1 py-3 text-gray-600 font-medium text-sm hover:bg-gray-50 border-l border-gray-100">
          🔗 搜同款
        </button>
      </div>
    </div>
  );
}
