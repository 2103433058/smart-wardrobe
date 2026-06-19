import type { WardrobeItem } from '../../types';
import { getSearchLinks } from '../../services/ecommerce';

interface Props {
  item: WardrobeItem;
  onSelect: (item: WardrobeItem) => void;
}

export function WardrobeCard({ item, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-50">
        <img src={item.thumbnailDataUrl} alt={item.category} className="w-full h-full object-cover" />
      </div>
      <div className="p-2">
        <p className="text-sm font-medium truncate">{item.category}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: item.attributes.primaryColor }} />
          <span className="text-xs text-gray-400">{item.attributes.primaryColor}</span>
        </div>
        <a href={getSearchLinks(item)[0].url} target="_blank" rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="block text-center text-xs text-indigo-600 py-1.5 border-t border-gray-50 mt-1">
          🔗 搜同款
        </a>
      </div>
    </div>
  );
}
