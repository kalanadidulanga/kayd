import Image from "next/image";

import { Experiences } from "@/config/experience";

/** One logo per distinct professional client, taken from the experience data. */
const clients = Array.from(
  new Map(
    Experiences.filter((e) => e.type === "Professional").map((e) => [
      e.companyName,
      e,
    ])
  ).values()
);

export function ClientLogos() {
  if (clients.length === 0) return null;

  return (
    <div
      data-testid="client-logos"
      className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 grayscale opacity-70"
    >
      {clients.map((c) => (
        <Image
          key={c.companyName}
          src={c.companyLogoImg}
          alt={c.companyName}
          width={160}
          height={40}
          className="h-10 w-auto object-contain"
        />
      ))}
    </div>
  );
}
