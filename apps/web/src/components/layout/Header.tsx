import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { Logo } from '../Logo';
import { ButtonLink } from '../ui/Button';
import {
  BasketButton,
  FreeDelivery,
  LanguageSwitch,
  MarketSelect,
  MobileNav,
  NavLink,
  SearchButton,
} from './HeaderControls';

export async function Header() {
  const t = await getTranslations('nav');
  const tc = await getTranslations('common');

  const links = [
    { href: '/menu/seasonal', label: t('menu') },
    { href: '/beans', label: t('beans') },
    { href: '/menu/healthy-breakfast', label: t('breakfast') },
    { href: '/rewards', label: t('rewards') },
    { href: '/our-story', label: t('story') },
  ];

  return (
    <header>
      {/* utility bar */}
      <div className="hidden h-10 items-center justify-between bg-teal-900 px-5 text-[13px] text-utility-text lg:flex xl:px-20">
        <div className="flex items-center gap-5">
          <MarketSelect />
          <span aria-hidden className="opacity-40">
            |
          </span>
          <Suspense fallback={null}>
            <LanguageSwitch />
          </Suspense>
        </div>
        <FreeDelivery />
        <nav aria-label={t('utility')} className="flex gap-6">
          <Link href="/stores" className="flex h-10 items-center hover:text-white">
            {t('findStore')}
          </Link>
          <Link href="/corporate" className="flex h-10 items-center hover:text-white">
            {t('corporate')}
          </Link>
          <Link href="/franchise" className="flex h-10 items-center hover:text-white">
            {t('franchise')}
          </Link>
        </nav>
      </div>

      {/* sticky nav */}
      <div className="sticky top-0 z-40 border-b border-line bg-ground/95 backdrop-blur supports-[backdrop-filter]:bg-ground/85">
        <div className="flex h-[72px] items-center justify-between gap-4 px-4 lg:h-[88px] lg:px-5 xl:px-20">
          <div className="flex items-center gap-8 xl:gap-14">
            <Link href="/" aria-label={tc('wordmarkLabel')} className="flex items-center">
              <Logo height={34} title={tc('brand')} />
            </Link>
            <nav aria-label={t('main')} className="hidden gap-6 text-[15px] font-semibold lg:flex xl:gap-8">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <SearchButton />
            <BasketButton />
            <Link
              href="/rewards"
              className="hidden h-11 items-center rounded-full px-[18px] text-[15px] font-semibold text-ink hover:bg-ink/5 md:flex"
            >
              {tc('signIn')}
            </Link>
            <span className="hidden sm:block">
              <ButtonLink href="/menu/seasonal">{tc('orderAhead')}</ButtonLink>
            </span>
            <MobileNav links={links} />
          </div>
        </div>
      </div>
    </header>
  );
}
