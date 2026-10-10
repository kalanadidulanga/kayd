import Image from "next/image";

import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";

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
  // several projects keeps the logo of its most recent one. Keep-last picked
  // the lapelcustomconfig lockup, a project sub-brand, over the plain Lapel
  // wordmark, which reads as a project name in a strip labelled Clients.
  if (!byClient.has(key)) byClient.set(key, { name: key, src: e.companyLogoImg });
}
for (const r of roles) {
  if (r.logo && !byClient.has(r.company)) byClient.set(r.company, { name: r.company, src: r.logo });
}
const clients = Array.from(byClient.values());

export function ClientLogos() {
  if (clients.length === 0) return null;

  return (
    <Section id="clients" className="py-16 md:py-24">
      <Reveal className="text-center">
        <p className="eyebrow">Worked with</p>
        <div
          data-testid="client-logos"
          // The logo files sit on white. In dark mode they are inverted so they
          // read as marks on the page rather than as light boxes.
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-8 opacity-60 grayscale transition-opacity duration-500 hover:opacity-90 dark:opacity-50 dark:invert"
        >
          {clients.map((c) => (
            <Image
              key={c.name}
              src={c.src}
              alt={c.name}
              width={160}
              height={40}
              // One box for every logo: wordmarks fill its width, and a square
              // crest fills its height instead of shrinking to a dot.
              className="h-14 w-28 rounded-md object-contain"
            />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
