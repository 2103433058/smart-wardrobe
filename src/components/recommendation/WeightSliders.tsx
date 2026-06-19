interface Props {
  weights: { body: number; color: number; style: number; occasion: number; dressBonus: number };
  onChange: (weights: { body: number; color: number; style: number; occasion: number; dressBonus: number }) => void;
}

export function WeightSliders({ weights, onChange }: Props) {
  const update = (key: keyof typeof weights, value: number) => {
    onChange({ ...weights, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">权重调节</h3>
      {[
        ['体型匹配', 'body'],
        ['色彩搭配', 'color'],
        ['风格一致', 'style'],
        ['场合适配', 'occasion'],
      ].map(([label, key]) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-16">{label}</span>
          <input type="range" min="0" max="1" step="0.05"
            value={weights[key as keyof typeof weights]}
            onChange={(e) => update(key as keyof typeof weights, +e.target.value)}
            className="flex-1" />
          <span className="text-xs font-medium w-8 text-right">
            {(weights[key as keyof typeof weights] * 100).toFixed(0)}
          </span>
        </div>
      ))}
    </div>
  );
}
