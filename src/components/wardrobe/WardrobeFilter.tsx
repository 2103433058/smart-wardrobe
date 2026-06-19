interface Props {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

const FILTER_OPTIONS = {
  category: ['全部', 'T恤', '衬衫', '连衣裙', '牛仔裤', '外套', '卫衣'],
  primaryColor: ['全部', '黑色', '白色', '蓝色', '红色', '粉色', '棕色'],
  season: ['全部', '春夏', '秋冬', '四季'],
};

export function WardrobeFilter({ filters, onChange }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
        <select
          key={key}
          value={filters[key] || ''}
          onChange={(e) => onChange({ ...filters, [key]: e.target.value || '' })}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600"
        >
          <option value="">{key === 'category' ? '全部类型' : key === 'primaryColor' ? '全部颜色' : '全部季节'}</option>
          {options.filter(Boolean).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
