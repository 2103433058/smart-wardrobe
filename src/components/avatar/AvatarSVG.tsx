import type { AvatarOutfit } from '../../types';

interface Props {
  outfit: AvatarOutfit;
  skinColor: string;
  hairColor: string;
}

const C_HEX: Record<string, string> = {
  '黑色': '#222', '白色': '#f5f5f5', '灰色': '#999', '红色': '#d35',
  '蓝色': '#5b9bd5', '绿色': '#6baf6b', '粉色': '#f0a0b8', '米色': '#f5e6d3',
  '棕色': '#8b6914', '藏蓝': '#2c3e6b', '卡其': '#c3b091', '浅紫': '#c9a8d4',
};
function cc(name: string): string { return C_HEX[name] || name || '#ccc'; }

export function AvatarSVG({ outfit, skinColor, hairColor }: Props) {
  const { top, bottom, dress, outer, shoes, accessories } = outfit.pieces;

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
      </defs>

      {/* ===== LEGS ===== */}
      <path d="M70,240 L65,380 Q65,390 72,390 L80,390 Q85,390 85,382 L85,240" fill={skinColor} />
      <path d="M115,240 L115,382 Q115,390 120,390 L128,390 Q135,390 135,380 L130,240" fill={skinColor} />

      {/* ===== SHOES ===== */}
      {shoes && (
        <g>
          <ellipse cx="72" cy="392" rx="16" ry="8" fill={cc(shoes.color)} />
          <ellipse cx="127" cy="392" rx="16" ry="8" fill={cc(shoes.color)} />
        </g>
      )}

      {/* ===== BOTTOM ===== */}
      {!dress && bottom && <BottomPiece bottom={bottom} />}

      {/* ===== DRESS ===== */}
      {dress && <DressPiece dress={dress} />}

      {/* ===== TORSO (behind top) ===== */}
      {!dress && (
        <path d="M65,105 Q58,108 56,160 L56,240 L144,240 L144,160 Q142,108 135,105 Q100,95 65,105 Z" fill={skinColor} />
      )}

      {/* ===== TOP ===== */}
      {!dress && top && <TopPiece top={top} />}

      {/* ===== OUTER ===== */}
      {!dress && outer && <OuterPiece outer={outer} />}

      {/* ===== ARMS ===== */}
      <path d="M35,155 Q28,155 26,200 Q24,240 30,250 L38,250 Q35,200 38,155 Z" fill={skinColor} />
      <path d="M162,155 Q170,155 172,200 Q174,240 170,250 L162,250 Q165,200 162,155 Z" fill={skinColor} />

      {/* ===== COLLARBONE ===== */}
      <path d="M75,100 Q100,108 125,100" fill="none" stroke={skinColor} strokeWidth="1.5" opacity="0.3" />

      {/* ===== NECK ===== */}
      <rect x="84" y="78" width="32" height="24" rx="6" fill={skinColor} />

      {/* ===== HEAD ===== */}
      <ellipse cx="100" cy="52" rx="32" ry="38" fill={skinColor} />

      {/* ===== HAIR ===== */}
      <ellipse cx="100" cy="48" rx="34" ry="42" fill={hairColor} opacity="0.9" />
      <ellipse cx="100" cy="30" rx="36" ry="30" fill={hairColor} />
      <path d="M68,40 Q64,70 66,100 L72,95 Q72,60 72,40 Z" fill={hairColor} />
      <path d="M132,40 Q136,70 134,100 L128,95 Q128,60 128,40 Z" fill={hairColor} />
      <path d="M70,42 Q82,28 100,26 Q118,28 130,42 Q115,52 100,50 Q85,52 70,42 Z" fill={hairColor} />

      {/* ===== FACE ===== */}
      <ellipse cx="88" cy="50" rx="4.5" ry="5" fill="#333" />
      <circle cx="89" cy="48" r="1.5" fill="#fff" />
      <ellipse cx="112" cy="50" rx="4.5" ry="5" fill="#333" />
      <circle cx="113" cy="48" r="1.5" fill="#fff" />
      <path d="M82,41 Q88,38 94,40" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
      <path d="M106,40 Q112,38 118,41" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
      <ellipse cx="80" cy="58" rx="6" ry="3" fill="#f0a0b8" opacity="0.35" />
      <ellipse cx="120" cy="58" rx="6" ry="3" fill="#f0a0b8" opacity="0.35" />
      <path d="M94,64 Q97,68 100,68 Q103,68 106,64" fill="none" stroke="#d4787e" strokeWidth="1.5" strokeLinecap="round" />

      {/* ===== ACCESSORIES ===== */}
      {accessories.map((acc, i) => renderAccessory(acc, i))}
    </svg>
  );
}

// ─── TOP PIECES ──────────────────────────────────────────

function TopPiece({ top }: { top: { type: string; color: string; pattern: string } }) {
  const c = cc(top.color);
  const fill = patternFill(top.pattern, c);
  switch (top.type) {
    case '吊带':
      return (
        <g>
          {/* Thin straps top */}
          <path d="M62,130 Q60,125 62,120 Q70,108 80,105 L80,185 Q65,190 58,200 Z" fill={fill} stroke={c} strokeWidth="0.8" />
          <path d="M138,130 Q140,125 138,120 Q130,108 120,105 L120,185 Q135,190 142,200 Z" fill={fill} stroke={c} strokeWidth="0.8" />
          {/* Neckline strap */}
          <path d="M80,105 Q100,98 120,105" fill="none" stroke={c} strokeWidth="3" />
        </g>
      );
    case '衬衫':
      return (
        <g>
          <path d="M58,100 Q55,105 58,175 L60,200 L140,200 L142,175 Q145,105 142,100 Q100,88 58,100 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M58,105 Q38,108 35,155 Q33,170 40,172 L52,170 Q48,125 58,112 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M142,105 Q162,108 165,155 Q167,170 160,172 L148,170 Q152,125 142,112 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Collar */}
          <path d="M75,100 L85,120 L100,112 L115,120 L125,100" fill="#fff" stroke={c} strokeWidth="1" />
          {/* Buttons */}
          {[125, 140, 155].map((y, i) => (
            <circle key={i} cx="100" cy={y} r="1.5" fill="#fff" stroke={c} strokeWidth="0.5" />
          ))}
        </g>
      );
    case '卫衣':
      return (
        <g>
          <path d="M54,95 Q50,100 55,175 L56,200 L144,200 L145,175 Q150,100 146,95 Q100,82 54,95 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M54,100 Q30,102 28,155 Q26,172 34,175 L50,173 Q44,125 54,108 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M146,100 Q170,102 172,155 Q174,172 166,175 L150,173 Q156,125 146,108 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Hood */}
          <path d="M72,95 Q70,78 100,72 Q130,78 128,95" fill={fill} stroke={c} strokeWidth="2" />
          {/* Kangaroo pocket */}
          <rect x="80" y="150" width="40" height="20" rx="8" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" />
        </g>
      );
    case '针织衫':
      return (
        <g>
          <path d="M56,98 Q52,104 56,175 L58,200 L142,200 L144,175 Q148,104 144,98 Q100,86 56,98 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M56,102 Q34,106 30,160 Q28,178 36,180 L52,178 Q46,130 56,112 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M144,102 Q166,106 170,160 Q172,178 164,180 L148,178 Q154,130 144,112 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Ribbed neckline */}
          <path d="M75,98 Q100,105 125,98" fill="none" stroke={c} strokeWidth="4" opacity="0.8" />
          {/* Texture lines */}
          {[120, 140, 160, 180].map((y, i) => (
            <line key={i} x1="62" y1={y} x2="138" y2={y} stroke={c} strokeWidth="0.5" opacity="0.3" />
          ))}
        </g>
      );
    default: // T恤
      return (
        <g>
          <path d="M60,100 Q56,105 60,175 L62,200 L138,200 L140,175 Q144,105 140,100 Q100,90 60,100 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Short sleeves */}
          <path d="M60,105 Q42,107 40,140 Q38,152 45,155 L55,153 Q52,125 60,112 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M140,105 Q158,107 160,140 Q162,152 155,155 L145,153 Q148,125 140,112 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Round neckline */}
          <path d="M78,100 Q100,110 122,100" fill="none" stroke={c} strokeWidth="2" />
        </g>
      );
  }
}

// ─── BOTTOM PIECES ───────────────────────────────────────

function BottomPiece({ bottom }: { bottom: { type: string; color: string; pattern: string } }) {
  const c = cc(bottom.color);
  const fill = patternFill(bottom.pattern, c);
  switch (bottom.type) {
    case '短裤':
      return (
        <g>
          <path d="M62,215 L55,300 L72,300 L78,260 L82,260 L82,300 L118,300 L118,260 L122,260 L128,300 L145,300 L138,215 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Hem lines */}
          <line x1="60" y1="295" x2="75" y2="295" stroke={c} strokeWidth="1.5" />
          <line x1="125" y1="295" x2="140" y2="295" stroke={c} strokeWidth="1.5" />
        </g>
      );
    case 'A字裙':
      return (
        <g>
          <path d="M62,210 L48,340 Q46,355 55,355 L60,355 L70,355 L75,355 L80,355 L85,355 L100,355 L115,355 L120,355 L125,355 L130,355 L140,355 L145,355 Q154,355 152,340 L138,210 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Pleats */}
          {[72, 88, 104, 120, 136].map((x, i) => (
            <line key={i} x1={x} y1={220} x2={x - 10} y2={350} stroke={c} strokeWidth="0.5" opacity="0.4" />
          ))}
        </g>
      );
    case '西裤':
      return (
        <g>
          <path d="M62,210 L54,310 Q52,318 58,318 L68,318 Q74,318 74,310 L74,260 L76,260 L85,260 L85,390 L80,390 Q75,390 75,382 L70,310 L68,310 L70,240 L130,240 L132,310 L130,310 L125,382 Q125,390 120,390 L115,390 L115,260 L124,260 L126,260 L126,310 Q126,318 132,318 L142,318 Q148,318 146,310 L138,210 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Center crease */}
          <line x1="100" y1="260" x2="100" y2="390" stroke={c} strokeWidth="0.5" opacity="0.3" />
        </g>
      );
    default: // 牛仔裤
      return (
        <g>
          <path d="M62,210 L58,310 Q56,320 62,320 L72,320 Q78,320 78,310 L78,260 L80,260 L85,260 L85,390 L80,390 Q75,390 75,382 L72,310 L70,310 L70,240 L130,240 L130,310 L128,310 L125,382 Q125,390 120,390 L115,390 L115,260 L120,260 L122,260 L122,310 Q122,320 128,320 L138,320 Q144,320 142,310 L138,210 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Pocket outlines */}
          <path d="M68,225 L68,245 Q68,250 73,250 L78,250" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
          <path d="M132,225 L132,245 Q132,250 127,250 L122,250" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.5" />
        </g>
      );
  }
}

// ─── DRESS PIECES ────────────────────────────────────────

function DressPiece({ dress }: { dress: { type: string; color: string; pattern: string } }) {
  const c = cc(dress.color);
  const fill = patternFill(dress.pattern, c);
  switch (dress.type) {
    case '连体裤':
      return (
        <g>
          <path d="M55,100 L50,250 Q48,262 55,262 L65,262 Q72,262 72,252 L72,260 L76,390 L85,390 L85,260 L115,260 L115,390 L124,390 L128,260 L128,252 Q128,262 135,262 L145,262 Q152,262 150,250 L145,100 Q100,88 55,100 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M55,105 Q38,108 35,155 Q33,168 40,170 L52,168 Q48,125 55,115 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M145,105 Q162,108 165,155 Q167,168 160,170 L148,168 Q152,125 145,115 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M80,100 Q100,110 120,100" fill="none" stroke={c} strokeWidth="2" />
          {/* Waist belt */}
          <line x1="58" y1="185" x2="142" y2="185" stroke={c} strokeWidth="3" opacity="0.6" />
        </g>
      );
    default: // 连衣裙
      return (
        <g>
          <path d="M55,100 L48,280 Q46,300 100,305 Q154,300 152,280 L145,100 Q100,88 55,100 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M55,105 Q38,108 35,155 Q33,168 40,170 L52,168 Q48,125 55,115 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          <path d="M145,105 Q162,108 165,155 Q167,168 160,170 L148,168 Q152,125 145,115 Z"
            fill={fill} stroke={c} strokeWidth="1" />
          {/* Sweetheart neckline */}
          <path d="M78,100 Q90,115 100,108 Q110,115 122,100" fill="none" stroke={c} strokeWidth="2.5" />
          {/* Waist */}
          <path d="M65,170 Q100,178 135,170" fill="none" stroke={c} strokeWidth="2" opacity="0.4" />
          {/* Skirt flare lines */}
          {[75, 100, 125].map((x, i) => (
            <line key={i} x1={x} y1={180} x2={x - (x - 100) * 0.3} y2={300} stroke={c} strokeWidth="0.5" opacity="0.25" />
          ))}
        </g>
      );
  }
}

// ─── OUTER PIECES ────────────────────────────────────────

function OuterPiece({ outer }: { outer: { type: string; color: string } }) {
  const c = cc(outer.color);
  switch (outer.type) {
    case '大衣':
      return (
        <g>
          <path d="M48,90 L44,250 L156,250 L152,90 Q100,78 48,90 Z"
            fill="none" stroke={c} strokeWidth="9" opacity="0.8" strokeLinejoin="round" />
          <line x1="100" y1="92" x2="100" y2="248" stroke={c} strokeWidth="1.5" opacity="0.4" />
          {/* Lapels */}
          <path d="M70,92 L85,140 L100,110 L100,92" fill="none" stroke={c} strokeWidth="4" opacity="0.5" />
          <path d="M130,92 L115,140 L100,110 L100,92" fill="none" stroke={c} strokeWidth="4" opacity="0.5" />
        </g>
      );
    case '开衫':
      return (
        <g>
          <path d="M52,90 L48,220 L152,220 L148,90 Q100,80 52,90 Z"
            fill="none" stroke={c} strokeWidth="6" opacity="0.75" strokeLinejoin="round" />
          <line x1="100" y1="92" x2="100" y2="218" stroke={c} strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
        </g>
      );
    default: // 夹克
      return (
        <g>
          <path d="M50,92 L45,210 L155,210 L150,92 Q100,80 50,92 Z"
            fill="none" stroke={c} strokeWidth="8" opacity="0.85" strokeLinejoin="round" />
          <line x1="100" y1="94" x2="100" y2="208" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
          {/* Zipper */}
          <line x1="100" y1="96" x2="100" y2="206" stroke="#ccc" strokeWidth="1.5" />
          {/* Collar */}
          <path d="M70,94 L82,110 L100,92" fill="none" stroke={c} strokeWidth="4" opacity="0.6" />
          <path d="M130,94 L118,110 L100,92" fill="none" stroke={c} strokeWidth="4" opacity="0.6" />
        </g>
      );
  }
}

// ─── ACCESSORIES ─────────────────────────────────────────

function renderAccessory(acc: { type: string; color: string }, i: number) {
  const c = cc(acc.color);
  switch (acc.type) {
    case '眼镜':
      return (
        <g key={i}>
          <circle cx="88" cy="50" r="9" fill="none" stroke={c} strokeWidth="1.8" />
          <circle cx="112" cy="50" r="9" fill="none" stroke={c} strokeWidth="1.8" />
          <line x1="97" y1="50" x2="103" y2="50" stroke={c} strokeWidth="1.5" />
          <line x1="79" y1="48" x2="75" y2="46" stroke={c} strokeWidth="1.2" />
          <line x1="121" y1="48" x2="125" y2="46" stroke={c} strokeWidth="1.2" />
        </g>
      );
    case '帽子':
      return (
        <g key={i}>
          <ellipse cx="100" cy="18" rx="38" ry="8" fill={c} />
          <path d="M66,18 Q66,2 100,0 Q134,2 134,18 Z" fill={c} />
          <rect x="64" y="16" width="72" height="3" rx="1.5" fill={c} />
        </g>
      );
    case '项链':
      return (
        <path key={i} d="M84,102 Q100,122 116,102" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      );
    case '耳环':
      return (
        <g key={i}>
          <circle cx="66" cy="62" r="2.5" fill={c} />
          <circle cx="134" cy="62" r="2.5" fill={c} />
        </g>
      );
    case '手表':
      return (
        <g key={i}>
          <rect x="32" y="242" width="10" height="6" rx="1.5" fill={c} />
          <rect x="36" y="240" width="4" height="2" rx="1" fill="#fff" opacity="0.6" />
        </g>
      );
    default:
      return null;
  }
}

function patternFill(pattern: string, color: string): string {
  switch (pattern) {
    case '条纹': return 'url(#stripe)';
    case '格子': return 'url(#check)';
    default: return color;
  }
}
