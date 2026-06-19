import type { AvatarOutfit } from '../../types';

interface Props {
  outfit: AvatarOutfit;
  skinColor: string;
  hairColor: string;
}

const COLOR_HEX: Record<string, string> = {
  '黑色': '#222', '白色': '#f5f5f5', '灰色': '#999', '红色': '#e74c3c',
  '蓝色': '#5b9bd5', '绿色': '#6baf6b', '粉色': '#f0a0b8', '米色': '#f5e6d3',
  '棕色': '#8b6914', '藏蓝': '#2c3e6b', '卡其': '#c3b091', '浅紫': '#c9a8d4',
};

function getColor(name: string): string { return COLOR_HEX[name] || name; }

export function AvatarSVG({ outfit, skinColor, hairColor }: Props) {
  const { top, bottom, dress, outer, shoes, accessories } = outfit.pieces;

  const topColor = top ? getColor(top.color) : 'none';
  const bottomColor = bottom ? getColor(bottom.color) : 'none';
  const dressColor = dress ? getColor(dress.color) : 'none';
  const outerColor = outer ? getColor(outer.color) : 'none';
  const shoesColor = shoes ? getColor(shoes.color) : '#444';

  const hasTop = !dress && top && top.type;
  const hasBottom = !dress && bottom && bottom.type;
  const hasDress = !!dress && dress.type;
  const hasOuter = !dress && outer && outer.type;

  return (
    <svg viewBox="0 0 200 420" className="w-full max-w-[200px] mx-auto">
      <defs>
        <pattern id="stripe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="10" fill="currentColor" />
        </pattern>
        <pattern id="check" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="currentColor" />
          <rect width="5" height="5" fill="#fff" opacity="0.4" />
          <rect x="6" y="6" width="5" height="5" fill="#fff" opacity="0.4" />
        </pattern>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hairColor} stopOpacity="1" />
          <stop offset="100%" stopColor={hairColor} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* ===== LEGS ===== */}
      <g>
        {/* Left leg */}
        <path d="M70,240 L65,380 Q65,390 72,390 L80,390 Q85,390 85,382 L85,240" fill={skinColor} />
        {/* Right leg */}
        <path d="M115,240 L115,382 Q115,390 120,390 L128,390 Q135,390 135,380 L130,240" fill={skinColor} />
      </g>

      {/* ===== SHOES ===== */}
      {shoes && (
        <g>
          <ellipse cx="72" cy="392" rx="16" ry="8" fill={shoesColor} />
          <ellipse cx="127" cy="392" rx="16" ry="8" fill={shoesColor} />
        </g>
      )}

      {/* ===== BOTTOM (pants/skirt) ===== */}
      {hasBottom && (
        <g>
          {/* Main pants body */}
          <path d="M62,210 L55,290 L65,390 L85,390 L85,290 L115,290 L115,390 L135,390 L145,290 L138,210 Z"
            fill={getPatternFill(bottom!, bottomColor)} stroke={bottomColor} strokeWidth="1"
          />
        </g>
      )}

      {/* ===== DRESS ===== */}
      {hasDress && (
        <g>
          <path d="M55,100 L50,260 Q100,300 150,260 L145,100 Z"
            fill={getPatternFill(dress!, dressColor)} stroke={dressColor} strokeWidth="1"
          />
          {/* Waist accent */}
          <path d="M60,165 Q100,175 140,165" fill="none" stroke={dressColor} strokeWidth="2" opacity="0.3" />
        </g>
      )}

      {/* ===== TORSO ===== */}
      {!hasDress && (
        <path d="M65,105 Q60,108 58,160 L58,240 L142,240 L142,160 Q140,108 135,105 Q100,95 65,105 Z"
          fill={skinColor}
        />
      )}

      {/* ===== TOP ===== */}
      {hasTop && (
        <g>
          {/* Main body */}
          <path d="M58,100 Q55,105 58,170 L60,200 L140,200 L142,170 Q145,105 142,100 Q100,88 58,100 Z"
            fill={getPatternFill(top!, topColor)} stroke={topColor} strokeWidth="1"
          />
          {/* Left sleeve */}
          <path d="M58,105 Q35,108 32,150 Q30,165 38,168 L55,165 Q50,120 58,110 Z"
            fill={getPatternFill(top!, topColor)} stroke={topColor} strokeWidth="1"
          />
          {/* Right sleeve */}
          <path d="M142,105 Q165,108 168,150 Q170,165 162,168 L145,165 Q150,120 142,110 Z"
            fill={getPatternFill(top!, topColor)} stroke={topColor} strokeWidth="1"
          />
        </g>
      )}

      {/* ===== OUTER ===== */}
      {hasOuter && (
        <g>
          <path d="M52,95 L48,210 L152,210 L148,95 Q100,85 52,95 Z"
            fill="none" stroke={outerColor} strokeWidth="7" opacity="0.75" strokeLinejoin="round"
          />
          <line x1="100" y1="95" x2="100" y2="210" stroke={outerColor} strokeWidth="1" opacity="0.4" />
        </g>
      )}

      {/* ===== ARMS ===== */}
      <g>
        {/* Left arm */}
        <path d="M35,155 Q28,155 26,200 Q24,240 30,250 L38,250 Q35,200 38,155 Z" fill={skinColor} />
        {/* Right arm */}
        <path d="M162,155 Q170,155 172,200 Q174,240 170,250 L162,250 Q165,200 162,155 Z" fill={skinColor} />
      </g>

      {/* ===== COLLARBONE ===== */}
      <path d="M75,100 Q100,108 125,100" fill="none" stroke={skinColor} strokeWidth="1.5" opacity="0.4" />

      {/* ===== NECK ===== */}
      <path d="M84,80 L84,102 Q84,108 80,108 L80,80 Z" fill={skinColor} />
      <path d="M116,80 L116,102 Q116,108 120,108 L120,80 Z" fill={skinColor} />
      <rect x="82" y="78" width="36" height="22" rx="6" fill={skinColor} />

      {/* ===== HEAD ===== */}
      <ellipse cx="100" cy="52" rx="32" ry="38" fill={skinColor} />

      {/* ===== HAIR ===== */}
      <g>
        {/* Back hair */}
        <ellipse cx="100" cy="48" rx="34" ry="42" fill="url(#hairGrad)" />
        {/* Top volume */}
        <ellipse cx="100" cy="30" rx="36" ry="30" fill="url(#hairGrad)" />
        {/* Side strands */}
        <path d="M68,40 Q64,70 66,100 L72,95 Q72,60 72,40 Z" fill={hairColor} />
        <path d="M132,40 Q136,70 134,100 L128,95 Q128,60 128,40 Z" fill={hairColor} />
        {/* Bangs */}
        <path d="M70,42 Q82,28 100,26 Q118,28 130,42 Q115,52 100,50 Q85,52 70,42 Z" fill={hairColor} />
      </g>

      {/* ===== FACE ===== */}
      <g>
        {/* Eyes */}
        <ellipse cx="88" cy="50" rx="4.5" ry="5" fill="#333" />
        <circle cx="89" cy="48" r="1.5" fill="#fff" />
        <ellipse cx="112" cy="50" rx="4.5" ry="5" fill="#333" />
        <circle cx="113" cy="48" r="1.5" fill="#fff" />
        {/* Eyebrows */}
        <path d="M82,41 Q88,38 94,40" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
        <path d="M106,40 Q112,38 118,41" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
        {/* Blush */}
        <ellipse cx="80" cy="58" rx="6" ry="3" fill="#f0a0b8" opacity="0.4" />
        <ellipse cx="120" cy="58" rx="6" ry="3" fill="#f0a0b8" opacity="0.4" />
        {/* Nose */}
        <path d="M99,54 Q100,58 102,58" fill="none" stroke={skinColor} strokeWidth="0.5" opacity="0.5" />
        {/* Mouth */}
        <path d="M94,64 Q97,68 100,68 Q103,68 106,64" fill="none" stroke="#d4787e" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* ===== ACCESSORIES ===== */}
      {accessories.map((acc, i) => {
        const accColor = getColor(acc.color);
        if (acc.type === '眼镜') {
          return (
            <g key={i}>
              <circle cx="88" cy="50" r="9" fill="none" stroke={accColor} strokeWidth="1.8" />
              <circle cx="112" cy="50" r="9" fill="none" stroke={accColor} strokeWidth="1.8" />
              <line x1="97" y1="50" x2="103" y2="50" stroke={accColor} strokeWidth="1.5" />
              <line x1="79" y1="48" x2="75" y2="46" stroke={accColor} strokeWidth="1.2" />
              <line x1="121" y1="48" x2="125" y2="46" stroke={accColor} strokeWidth="1.2" />
            </g>
          );
        }
        if (acc.type === '帽子') {
          return (
            <g key={i}>
              <ellipse cx="100" cy="18" rx="38" ry="8" fill={accColor} />
              <path d="M66,18 Q66,2 100,0 Q134,2 134,18 Z" fill={accColor} />
              <rect x="64" y="16" width="72" height="3" rx="1.5" fill={accColor} />
            </g>
          );
        }
        if (acc.type === '项链') {
          return (
            <path key={i} d="M84,102 Q100,120 116,102" fill="none" stroke={accColor} strokeWidth="1.5" strokeLinecap="round" />
          );
        }
        if (acc.type === '耳环') {
          return (
            <g key={i}>
              <circle cx="66" cy="62" r="2.5" fill={accColor} />
              <circle cx="134" cy="62" r="2.5" fill={accColor} />
            </g>
          );
        }
        if (acc.type === '手表') {
          return (
            <g key={i}>
              <rect x="32" y="242" width="10" height="6" rx="1.5" fill={accColor} />
              <rect x="36" y="240" width="4" height="2" rx="1" fill="#fff" opacity="0.6" />
            </g>
          );
        }
        return null;
      })}
    </svg>
  );
}

function getPatternFill(
  piece: { pattern: string },
  color: string
): string {
  switch (piece.pattern) {
    case '条纹': return 'url(#stripe)';
    case '格子': return 'url(#check)';
    default: return color;
  }
}
