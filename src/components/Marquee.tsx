export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-t border-ivory/10 py-6">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap font-display text-[32px] italic text-ash">
        {row.map((n, i) => (
          <span key={i} className="flex gap-14">
            <span>{n}</span>
            <span className="text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
