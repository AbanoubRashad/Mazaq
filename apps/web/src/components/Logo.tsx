import { colors } from '@mazaq/tokens';

/**
 * Mazaq wordmark: lowercase "mazaq" in Bricolage Grotesque 800 (teal) followed by
 * "مذاق" in Reem Kufi 700 (saffron). Built as SVG text so it scales crisply; the
 * logo is never mirrored in RTL.
 */
export function Logo({
  height = 34,
  tone = 'teal',
  className,
  title = 'Mazaq',
}: {
  height?: number;
  tone?: 'teal' | 'light';
  className?: string;
  title?: string;
}) {
  const latin = tone === 'light' ? colors.onTeal : colors.teal800;
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 150 36"
      height={height}
      width={(height * 150) / 36}
      className={className}
      direction="ltr"
      style={{ direction: 'ltr' }}
    >
      <text
        x="0"
        y="27"
        fill={latin}
        style={{
          fontFamily: 'var(--font-bricolage), "Bricolage Grotesque", sans-serif',
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: -0.8,
        }}
      >
        mazaq
      </text>
      <text
        x="104"
        y="27"
        fill={colors.saffron500}
        style={{
          fontFamily: 'var(--font-reem-kufi), "Reem Kufi", sans-serif',
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 0,
        }}
      >
        مذاق
      </text>
    </svg>
  );
}
