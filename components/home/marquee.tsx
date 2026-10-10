/** An endless strip of names. CSS only; it pauses on hover and stops for reduced motion. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12">
      {items.map((t) => (
        <li key={t} className="whitespace-nowrap text-[15px] text-subtle">
          <span className="font-medium text-muted-foreground">{t}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group relative overflow-hidden border-y border-border py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-[marquee_42s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
