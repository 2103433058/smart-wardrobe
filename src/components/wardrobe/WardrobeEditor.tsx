import { useState } from 'react';
import type { WardrobeItem } from '../../types';
import { useWardrobeStore } from '../../stores/wardrobeStore';

interface Props {
  item: WardrobeItem;
  onClose: () => void;
}

export function WardrobeEditor({ item, onClose }: Props) {
  const updateItem = useWardrobeStore((s) => s.updateItem);
  const deleteItem = useWardrobeStore((s) => s.deleteItem);
  const [form, setForm] = useState({ ...item });

  const handleSave = async () => {
    await updateItem(form);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('确定删除这件衣物？')) return;
    await deleteItem(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-4 mb-6">
          <img src={item.imageDataUrl} alt={item.category} className="w-24 h-24 object-cover rounded-xl" />
          <div>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="text-lg font-semibold border-b border-gray-200 pb-1 w-full outline-none" />
            <div className="flex gap-2 mt-2">
              <input value={form.attributes.primaryColor}
                onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, primaryColor: e.target.value } })}
                className="text-sm w-20 border rounded px-2 py-0.5" placeholder="颜色" />
              <input value={form.attributes.pattern}
                onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, pattern: e.target.value } })}
                className="text-sm w-20 border rounded px-2 py-0.5" placeholder="图案" />
              <input value={form.attributes.material}
                onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, material: e.target.value } })}
                className="text-sm w-20 border rounded px-2 py-0.5" placeholder="材质" />
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <label className="text-gray-500 w-16">季节</label>
            <select value={form.attributes.season}
              onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, season: e.target.value } })}
              className="border rounded px-2 py-1 flex-1">
              <option value="">未知</option>
              <option value="春夏">春夏</option>
              <option value="秋冬">秋冬</option>
              <option value="四季">四季</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 w-16">正式度</label>
            <select value={form.attributes.formality}
              onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, formality: e.target.value } })}
              className="border rounded px-2 py-1 flex-1">
              <option value="">未知</option>
              <option value="休闲">休闲</option>
              <option value="商务">商务</option>
              <option value="正装">正装</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 w-16">备注</label>
            <input value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded px-2 py-1 flex-1" placeholder="添加备注..." />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 w-16">标签</label>
            <input value={form.tags.join(', ')}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              className="border rounded px-2 py-1 flex-1" placeholder="用逗号分隔" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFavorite}
              onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })} />
            <span className="text-gray-500">⭐ 收藏</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium text-sm">
            🗑 删除
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm">
            💾 保存
          </button>
        </div>
      </div>
    </div>
  );
}
