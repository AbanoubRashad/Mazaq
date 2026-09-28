import { getTranslations } from 'next-intl/server';

export async function LegalPage({ ns }: { ns: 'pages.privacy' | 'pages.terms' }) {
  const t = await getTranslations(ns);
  const sections = t.raw('sections') as { h: string; p: string }[];
  return (
    <article className="mx-auto flex max-w-[760px] flex-col gap-8 px-5 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[44px] font-extrabold display-tight">{t('title')}</h1>
        <p className="font-mono text-[13px] text-muted">{t('updated')}</p>
      </header>
      {sections.map((s) => (
        <section key={s.h} className="flex flex-col gap-2">
          <h2 className="font-display text-[24px] font-bold">{s.h}</h2>
          <p className="text-[17px] leading-relaxed">{s.p}</p>
        </section>
      ))}
    </article>
  );
}
