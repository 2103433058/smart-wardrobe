import type { WardrobeItem } from '../../types';

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
      </div>
    </div>
  );
}
