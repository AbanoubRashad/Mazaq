import { originColors, type Origin } from '@mazaq/tokens';

/**
 * Mazaq stand-up pouch artwork: origin-coloured bag, cream label with "MAZAQ" in mono,
 * origin in Bricolage 800, region in Figtree and a "250 G · WHOLE BEAN" footer.
 */
export function BeanBag({
  origin,
  label,
  region,
  color,
  background,
  footer = '250 G · WHOLE BEAN',
  className,
  title,
}: {
  origin: Origin;
  label: string;
  region: string;
  color?: string;
  background?: string;
  footer?: string;
  className?: string;
  title?: string;
}) {
  const ink = color ?? originColors[origin];
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      direction="ltr"
    >
      {background ? <rect width="200" height="200" fill={background} /> : null}
      <ellipse cx="100" cy="178" rx="54" ry="7" fill="#000" opacity="0.1" />
      <path d="M56 34 L144 34 L152 170 Q100 180 48 170 Z" fill={ink} />
      <path d="M56 34 L144 34 L145 48 L55 48 Z" fill="#000" opacity="0.22" />
      <path d="M58 30 L142 30 L144 36 L56 36 Z" fill={ink} />
      <circle cx="100" cy="64" r="5" fill="#000" opacity="0.25" />
      <rect x="66" y="82" width="68" height="70" rx="3" fill="#F6F4EF" />
      <text
        x="100"
        y="96"
        fill="#0E3B36"
        textAnchor="middle"
        textLength={34}
        lengthAdjust="spacing"
        style={{ fontFamily: 'var(--font-plex-mono), "IBM Plex Mono", monospace', fontWeight: 600, fontSize: 7 }}
      >
        MAZAQ
      </text>
      <line x1="76" y1="102" x2="124" y2="102" stroke="#0E3B36" strokeOpacity="0.25" strokeWidth="0.8" />
      <text
        x="100"
        y="119"
        fill="#16201E"
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-bricolage), "Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: label.length > 9 ? 9 : 11 }}
      >
        {label}
      </text>
      <text
        x="100"
        y="132"
        fill="#55625F"
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-figtree), Figtree, sans-serif', fontWeight: 500, fontSize: region.length > 18 ? 6.5 : 8 }}
      >
        {region}
      </text>
      <text
        x="100"
        y="146"
        fill="#55625F"
        textAnchor="middle"
        textLength={58}
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: 'var(--font-plex-mono), "IBM Plex Mono", monospace', fontSize: 6 }}
      >
        {footer}
      </text>
    </svg>
  );
}
