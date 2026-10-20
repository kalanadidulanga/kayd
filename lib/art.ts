import { existsSync } from "node:fs";
import path from "node:path";

import type { Domain } from "@/config/experience";
import { DOMAINS } from "@/lib/work";

/**
 * Optional generated artwork, used only once its file is in public/. The
 * pages read this at build time, so dropping a file in and rebuilding is
 * all it takes; until then they fall back to icons and light.
 */
function served(publicPath: string): string | undefined {
  return existsSync(path.join(process.cwd(), "public", publicPath)) ? `/${publicPath}` : undefined;
}

export function domainArt(): Partial<Record<Domain, string>> {
  return Object.fromEntries(
    (Object.keys(DOMAINS) as Domain[]).flatMap((d) => {
      const src = served(`visuals/domains/${d}.webp`);
      return src ? [[d, src]] : [];
    })
  );
}

export const workFieldArt = () => served("work/field.webp");
