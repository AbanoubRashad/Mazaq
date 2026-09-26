import Image from 'next/image';

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt = '',
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="grid items-center gap-10 bg-teal-800 px-5 py-14 text-on-teal lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:px-20 lg:py-20">
      <div className="flex max-w-[760px] flex-col gap-5">
        {eyebrow && <p className="eyebrow text-saffron-500">{eyebrow}</p>}
        <h1 className="font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] text-balance lg:text-[72px]">{title}</h1>
        {lead && <p className="text-[18px] leading-[1.55] text-on-teal-muted lg:text-[19px]">{lead}</p>}
      </div>
      {image && (
        <div className="arch relative mx-auto aspect-[3/4] w-full max-w-[380px] overflow-hidden">
          <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 380px, 90vw" className="object-cover" />
        </div>
      )}
    </section>
  );
}
