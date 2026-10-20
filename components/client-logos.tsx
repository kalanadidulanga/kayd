import Image from "next/image";

import { Experiences } from "@/config/experience";
import { roles } from "@/config/work-history";

type Logo = { name: string; src: NonNullable<(typeof Experiences)[number]["companyLogoImg"]> };

/**
 * One logo per company: professional clients from the experience data, then
 * companies Kalana worked at that have a logo but no project listed.
 */
const byClient = new Map<string, Logo>();
for (const e of Experiences) {
  // A client with no real logo is left out of the strip, not given a stand-in.
  if (e.type !== "Professional" || !e.companyLogoImg) continue;
  const key = e.brand ?? e.client ?? e.companyName;
  // First wins, not last: Experiences is sorted newest first, so a client with
  // several projects keeps the logo of its most recent one.
  if (!byClient.has(key)) byClient.set(key, { name: key, src: e.companyLogoImg });
}
for (const r of roles) {
  if (r.logo && !byClient.has(r.company)) byClient.set(r.company, { name: r.company, src: r.logo });
}
const clients = Array.from(byClient.values());

export function ClientLogos({ className }: { className?: string }) {
  if (clients.length === 0) return null;
  return (
    <div className={className}>
      <h3 className="meta">Worked with</h3>
      <div
        data-testid="client-logos"
        // The logo files sit on white. In dark mode they are inverted so they
        // read as marks on the page rather than as light boxes.
        className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-6 opacity-60 grayscale transition-opacity duration-500 hover:opacity-90 dark:opacity-50 dark:invert"
      >
        {clients.map((c) => (
          <Image key={c.name} src={c.src} alt={c.name} width={160} height={40} className="h-12 w-24 rounded-md object-contain" />
        ))}
      </div>
    </div>
  );
}
