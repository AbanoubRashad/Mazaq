import { getTranslations } from 'next-intl/server';

export async function BrewGuide({ highlight }: { highlight?: 'turkish' }) {
  const t = await getTranslations('beans.guide');
  const methods = [
    { k: 'espresso', title: t('espresso'), text: t('espressoText') },
    { k: 'filter', title: t('filter'), text: t('filterText') },
    { k: 'french', title: t('frenchPress'), text: t('frenchPressText') },
    { k: 'turkish', title: t('turkish'), text: t('turkishText') },
  ];
  if (highlight === 'turkish') methods.unshift(methods.pop()!);
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {methods.map((m) => (
        <li key={m.k} className="flex flex-col gap-2 rounded-[18px] bg-white p-5">
          <h3 className="font-display text-[20px] font-bold">{m.title}</h3>
          <p className="text-[15px] leading-normal text-muted">{m.text}</p>
        </li>
      ))}
    </ul>
  );
}
