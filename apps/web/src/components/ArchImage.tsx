import Image from 'next/image';

/** Photo framed in the Cairene arch (999px 999px 24px 24px). */
export function ArchImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  className = '',
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`arch relative overflow-hidden bg-teal-600 ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
