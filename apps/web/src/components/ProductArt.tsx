/**
 * Illustrated product art from the design boards. Used where no verified photo exists
 * (e.g. the Halloumi wrap) and for small category glyphs.
 */
export type ArtKind = 'hot' | 'iced' | 'bowl' | 'toast' | 'wrap';

export function ProductArt({
  kind,
  tone,
  ink,
  accent = '#E3A62B',
  className,
}: {
  kind: ArtKind;
  tone: string;
  ink: string;
  accent?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="200" height="200" fill={tone} />
      {kind === 'hot' && (
        <g>
          <ellipse cx="100" cy="158" rx="70" ry="13" fill="#FBFAF7" />
          <ellipse cx="100" cy="156" rx="46" ry="7" fill="#000" opacity="0.08" />
          <path d="M142 98 a17 17 0 0 1 0 32" fill="none" stroke="#FBFAF7" strokeWidth="9" strokeLinecap="round" />
          <path d="M56 88 h88 v26 a44 40 0 0 1 -88 0 z" fill="#FBFAF7" />
          <ellipse cx="100" cy="88" rx="44" ry="9" fill={ink} />
          <path d="M92 86 q8 -7 16 0 q-8 6 -16 0 z" fill="#F1E3CC" />
          {[84, 100, 116].map((x) => (
            <path
              key={x}
              d={`M${x} ${x === 100 ? 66 : 70} q-7 -10 0 -20 q7 -10 0 -20`}
              fill="none"
              stroke={ink}
              opacity="0.35"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}
      {kind === 'iced' && (
        <g>
          <ellipse cx="100" cy="176" rx="40" ry="6" fill="#000" opacity="0.08" />
          <rect x="104" y="18" width="8" height="96" rx="3" fill={accent} transform="rotate(12 108 66)" />
          <path d="M66 48 L134 48 L125 168 Q100 177 75 168 Z" fill="#fff" opacity="0.45" />
          <path d="M69 84 L131 84 L125 168 Q100 177 75 168 Z" fill={ink} />
          <path d="M70 72 L130 72 L131 84 Q100 94 69 84 Z" fill="#EADFCB" />
          <path d="M70 72 Q86 86 100 78 Q116 70 130 80 L131 84 Q100 94 69 84 Z" fill="#D9C3A3" />
          <rect x="78" y="56" width="22" height="20" rx="4" fill="#fff" opacity="0.75" transform="rotate(-10 89 66)" />
          <rect x="100" y="60" width="20" height="18" rx="4" fill="#fff" opacity="0.6" transform="rotate(14 110 69)" />
          <path d="M66 48 L134 48 L125 168 Q100 177 75 168 Z" fill="none" stroke="#fff" opacity="0.9" strokeWidth="2.5" />
        </g>
      )}
      {kind === 'bowl' && (
        <g>
          <ellipse cx="100" cy="162" rx="50" ry="8" fill="#000" opacity="0.08" />
          <ellipse cx="100" cy="96" rx="60" ry="15" fill={ink} />
          <circle cx="80" cy="92" r="7" fill="#7A2E3A" />
          <circle cx="94" cy="98" r="6" fill="#3E4C8A" />
          <circle cx="112" cy="90" r="7" fill="#C8453A" />
          <circle cx="124" cy="98" r="5" fill="#3E4C8A" />
          <path d="M40 98 h120 a60 58 0 0 1 -120 0 z" fill="#FBFAF7" />
          <path d="M58 120 h84" stroke={accent} strokeWidth="3" />
        </g>
      )}
      {kind === 'toast' && (
        <g>
          <ellipse cx="100" cy="150" rx="78" ry="20" fill="#FBFAF7" />
          <path d="M50 140 Q44 96 64 76 Q84 56 110 60 Q148 64 154 100 Q158 130 150 142 Q100 154 50 140 Z" fill="#C98F52" />
          <path d="M58 134 Q54 100 70 84 Q88 68 110 70 Q140 74 146 102 Q148 124 142 134 Q100 144 58 134 Z" fill="#E7C28E" />
          <ellipse cx="82" cy="108" rx="20" ry="9" fill={ink} transform="rotate(-24 82 108)" />
          <ellipse cx="98" cy="118" rx="20" ry="9" fill={ink} transform="rotate(-24 98 118)" />
          <circle cx="124" cy="100" r="17" fill="#fff" />
          <circle cx="126" cy="98" r="7" fill={accent} />
        </g>
      )}
      {kind === 'wrap' && (
        <g>
          <ellipse cx="100" cy="152" rx="80" ry="18" fill="#FBFAF7" />
          <g transform="rotate(-18 100 110)">
            <rect x="34" y="88" width="132" height="44" rx="22" fill={ink} />
            <rect x="34" y="88" width="132" height="44" rx="22" fill="#000" opacity="0.08" />
            <ellipse cx="160" cy="110" rx="12" ry="22" fill="#E7C28E" />
            <circle cx="158" cy="102" r="5" fill="#C8453A" />
            <circle cx="162" cy="116" r="4" fill="#9CB35A" />
            <rect x="146" y="104" width="10" height="8" rx="2" fill="#F6F0DC" />
            <path d="M60 96 q10 8 0 30 M90 92 q10 10 0 36 M120 92 q10 10 0 36" stroke="#000" opacity="0.12" strokeWidth="2" fill="none" />
          </g>
        </g>
      )}
    </svg>
  );
}
