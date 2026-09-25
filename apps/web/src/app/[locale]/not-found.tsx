import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations();
  return (
    <section className="flex flex-col items-start gap-5 px-5 py-24 lg:px-20">
      <p className="eyebrow text-brown-600">404</p>
      <h1 className="font-display text-[48px] font-extrabold display-tight">{t('menu.empty')}</h1>
      <ButtonLink href="/menu/seasonal">{t('checkout.emptyCta')}</ButtonLink>
    </section>
  );
}
