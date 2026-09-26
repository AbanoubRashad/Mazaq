import { redirect } from '@/i18n/navigation';

export default async function MenuIndex({ params }: { params: Promise<{ locale: 'en' | 'ar' }> }) {
  const { locale } = await params;
  redirect({ href: '/menu/seasonal', locale });
}
