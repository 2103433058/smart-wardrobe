import type { AvatarOutfit } from '../../types';

interface Props {
  outfit: AvatarOutfit;
  skinColor: string;
  hairColor: string;
}

// Simplified front-facing avatar with scalable body parts
export function AvatarSVG({ outfit, skinColor, hairColor }: Props) {
  const { top, bottom, dress, outer, shoes, accessories } = outfit.pieces;

  return (
    <svg viewBox="0 0 200 400" className="w-full max-w-[200px] mx-auto">
      <defs>
        {/* Striped pattern */}
        <pattern id="stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" fill="currentColor" />
          <rect x="4" width="4" height="8" fill="white" opacity="0.3" />
        </pattern>
        {/* Check pattern */}
        <pattern id="check" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="currentColor" />
          <rect width="5" height="5" fill="white" opacity="0.3" />
          <rect x="5" y="5" width="5" height="5" fill="white" opacity="0.3" />
        </pattern>
      </defs>

      {/* Legs */}
      <rect x="65" y="220" width="25" height="140" rx="10" fill={skinColor} />
      <rect x="110" y="220" width="25" height="140" rx="10" fill={skinColor} />

      {/* Shoes */}
      {shoes && (
        <>
          <ellipse cx="77" cy="365" rx="20" ry="10" fill={shoes.color} />
          <ellipse cx="122" cy="365" rx="20" ry="10" fill={shoes.color} />
        </>
      )}

      {/* Bottom */}
      {bottom && !dress && (
        <rect x="55" y="210" width="90" height="80" rx="5"
          fill={bottom.pattern === '条纹' ? 'url(#stripe)' : bottom.pattern === '格子' ? 'url(#check)' : bottom.color}
          style={bottom.pattern === '条纹' || bottom.pattern === '格子' ? { color: bottom.color } : {}}
        />
      )}

      {/* Dress (covers top+bottom) */}
      {dress && (
        <path d="M50,100 L50,260 Q100,280 150,260 L150,100 Z"
          fill={dress.pattern === '条纹' ? 'url(#stripe)' : dress.pattern === '格子' ? 'url(#check)' : dress.color}
          style={dress.pattern === '条纹' || dress.pattern === '格子' ? { color: dress.color } : {}}
        />
      )}

      {/* Torso */}
      {!dress && (
        <rect x="60" y="100" width="80" height="120" rx="5" fill={skinColor} />
      )}

      {/* Top */}
      {top && !dress && (
        <>
          <rect x="50" y="95" width="100" height="70" rx="8"
            fill={top.pattern === '条纹' ? 'url(#stripe)' : top.pattern === '格子' ? 'url(#check)' : top.color}
            style={top.pattern === '条纹' || top.pattern === '格子' ? { color: top.color } : {}}
          />
          {/* Sleeves */}
          <rect x="35" y="100" width="20" height="50" rx="8"
            fill={top.pattern === '条纹' ? 'url(#stripe)' : top.pattern === '格子' ? 'url(#check)' : top.color}
            style={top.pattern === '条纹' || top.pattern === '格子' ? { color: top.color } : {}}
          />
          <rect x="145" y="100" width="20" height="50" rx="8"
            fill={top.pattern === '条纹' ? 'url(#stripe)' : top.pattern === '格子' ? 'url(#check)' : top.color}
            style={top.pattern === '条纹' || top.pattern === '格子' ? { color: top.color } : {}}
          />
        </>
      )}

      {/* Outer layer */}
      {outer && (
        <rect x="42" y="90" width="116" height="80" rx="10" fill="none"
          stroke={outer.color} strokeWidth="8" opacity="0.8" />
      )}

      {/* Arms */}
      <rect x="35" y="150" width="22" height="70" rx="10" fill={skinColor} />
      <rect x="143" y="150" width="22" height="70" rx="10" fill={skinColor} />

      {/* Neck */}
      <rect x="85" y="80" width="30" height="25" rx="8" fill={skinColor} />

      {/* Head */}
      <ellipse cx="100" cy="55" rx="35" ry="40" fill={skinColor} />

      {/* Hair */}
      <ellipse cx="100" cy="35" rx="40" ry="30" fill={hairColor} />
      <rect x="60" y="20" width="80" height="20" rx="10" fill={hairColor} />

      {/* Eyes */}
      <circle cx="85" cy="55" r="4" fill="#333" />
      <circle cx="115" cy="55" r="4" fill="#333" />

      {/* Mouth */}
      <path d="M92,68 Q100,75 108,68" stroke="#c44" fill="none" strokeWidth="2" />

      {/* Accessories */}
      {accessories.map((acc, i) => {
        if (acc.type === '眼镜') {
          return (
            <g key={i}>
              <circle cx="85" cy="55" r="10" fill="none" stroke={acc.color} strokeWidth="2" />
              <circle cx="115" cy="55" r="10" fill="none" stroke={acc.color} strokeWidth="2" />
              <line x1="95" y1="55" x2="105" y2="55" stroke={acc.color} strokeWidth="2" />
            </g>
          );
        }
        if (acc.type === '帽子') {
          return <ellipse key={i} cx="100" cy="22" rx="42" ry="12" fill={acc.color} />;
        }
        if (acc.type === '项链') {
          return (
            <path key={i} d="M85,90 Q100,105 115,90" fill="none" stroke={acc.color} strokeWidth="2" />
          );
        }
        return null;
      })}
    </svg>
  );
}
