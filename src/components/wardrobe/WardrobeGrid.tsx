import { useWardrobeStore } from '../../stores/wardrobeStore';
import { WardrobeCard } from './WardrobeCard';
import { WardrobeFilter } from './WardrobeFilter';
import type { WardrobeItem } from '../../types';
import { useState, useEffect } from 'react';
import { WardrobeEditor } from './WardrobeEditor';

export function WardrobeGrid() {
  const { items, loadItems, filterItems } = useWardrobeStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  useEffect(() => { loadItems(); }, [loadItems]);

  const filtered = Object.keys(filters).length > 0 ? filterItems(filters) : items;

  return (
    <div className="space-y-4">
      <WardrobeFilter filters={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">👗</p>
          <p>衣橱还是空的</p>
          <p className="text-sm mt-1">去「识别录入」添加衣物吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((item) => (
            <WardrobeCard key={item.id} item={item} onSelect={setSelectedItem} />
          ))}
        </div>
      )}
      {selectedItem && (
        <WardrobeEditor item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
