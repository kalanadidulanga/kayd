import Image from "next/image";

import { Experiences, type ExperienceInterface } from "@/config/experience";

/** One logo per distinct professional client, taken from the experience data. */
const byClient = new Map<string, ExperienceInterface>();
for (const e of Experiences) {
  if (e.type !== "Professional") continue;
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
    <div className="space-y-6">
      <p className="type-label text-center text-muted-foreground">Clients</p>
      <div
        data-testid="client-logos"
        className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 grayscale opacity-70"
      >
        {clients.map((c) => (
          <Image
            key={c.id}
            src={c.companyLogoImg}
            alt={c.client ?? c.companyName}
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
}
