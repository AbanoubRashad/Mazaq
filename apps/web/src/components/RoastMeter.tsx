export function RoastMeter({ level, label }: { level: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-[18px] rounded-full ${i <= level ? 'bg-teal-800' : 'bg-line'}`}
        />
      ))}
    </span>
  );
}
