import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from '../Logo';

export async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');

  const columns = [
    {
      head: t('menu'),
      links: [
        { href: '/beans', label: tn('beans') },
        { href: '/menu/hot-coffee', label: t('hotCoffee') },
        { href: '/menu/iced-coffee', label: t('icedCoffee') },
        { href: '/menu/healthy-breakfast', label: tn('breakfast') },
      ],
    },
    {
      head: t('atHome'),
      links: [
        { href: '/beans#brewing', label: t('brewingGuides') },
        { href: '/rewards', label: t('giftCards') },
        { href: '/beans', label: t('subscriptions') },
        { href: '/corporate', label: tn('corporate') },
      ],
    },
    {
      head: t('company'),
      links: [
        { href: '/our-story', label: tn('story') },
        { href: '/sourcing', label: t('sourcing') },
        { href: '/contact', label: t('careers') },
        { href: '/franchise', label: tn('franchise') },
      ],
    },
    {
      head: t('help'),
      links: [
        { href: '/contact', label: t('contact') },
        { href: '/allergens', label: t('allergens') },
        { href: '/terms', label: t('terms') },
        { href: '/privacy', label: t('privacy') },
      ],
    },
  ];

  return (
    <footer className="bg-teal-900 px-5 pb-28 pt-16 text-on-teal-muted lg:px-20 lg:pb-10 lg:pt-[72px]">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="flex max-w-[320px] flex-col gap-4">
          <Logo tone="light" height={34} />
          <p className="text-[15px] leading-relaxed">{t('tagline')}</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.head} aria-label={col.head} className="flex flex-col gap-1">
              <h2 className="pb-2 font-mono text-[12px] tracking-[1.5px] text-saffron-500">{col.head}</h2>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex min-h-11 items-center text-[15px] text-utility-text hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-2 border-t border-[#1F4A44] pt-6 text-[13px] sm:flex-row sm:justify-between">
        <span>{t('copyright')}</span>
        <span>English / العربية</span>
      </div>
    </footer>
  );
}
