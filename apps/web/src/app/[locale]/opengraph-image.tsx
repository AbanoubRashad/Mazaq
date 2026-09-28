import { ImageResponse } from 'next/og';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const alt = 'Mazaq — specialty coffee from Egypt';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ar = locale === 'ar';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0E3B36',
          color: '#F0F2EE',
          padding: 80,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>
          <div style={{ fontSize: 28, letterSpacing: 4, color: '#E3A62B' }}>MAZAQ · مذاق</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
            {ar ? 'Specialty coffee, roasted in Egypt.' : 'Saffron, honey & dates are back.'}
          </div>
          <div style={{ fontSize: 30, color: '#C5D5D0' }}>Cairo · Alexandria · Dubai · Riyadh · Amman · London</div>
        </div>
        <div
          style={{
            width: 300,
            height: 420,
            borderRadius: '150px 150px 24px 24px',
            background: '#E3A62B',
            display: 'flex',
          }}
        />
      </div>
    ),
    size,
  );
}
