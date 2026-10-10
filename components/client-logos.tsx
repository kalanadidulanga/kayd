import Image from "next/image";

import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";

import { Experiences, type ExperienceInterface } from "@/config/experience";

/** One logo per distinct professional client, taken from the experience data. */
const byClient = new Map<string, ExperienceInterface>();
for (const e of Experiences) {
  // A client with no real logo is left out of the strip, not given a stand-in.
  if (e.type !== "Professional" || !e.companyLogoImg) continue;
  const key = e.client ?? e.companyName;
  // First wins, not last: Experiences is sorted newest first, so a client with
  // several projects keeps the logo of its most recent one. Keep-last picked
  // the lapelcustomconfig lockup, a project sub-brand, over the plain Lapel
  // wordmark, which reads as a project name in a strip labelled Clients.
  if (!byClient.has(key)) byClient.set(key, e);
}
const clients = Array.from(byClient.values());

export function ClientLogos() {
  if (clients.length === 0) return null;

  return (
    <Section id="clients" className="py-16 md:py-24">
      <Reveal className="text-center">
        <p className="eyebrow">Clients</p>
        <div
          data-testid="client-logos"
          // The logo files sit on white. In dark mode they are inverted so they
          // read as marks on the page rather than as light boxes.
          className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-10 opacity-60 grayscale transition-opacity duration-500 hover:opacity-90 dark:opacity-50 dark:invert"
        >
          {clients.map((c) => (
            <Image
              key={c.id}
              src={c.companyLogoImg!}
              alt={c.client ?? c.companyName}
              width={160}
              height={40}
              className="h-10 w-auto rounded-md object-contain"
            />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
