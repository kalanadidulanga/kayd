import Image from "next/image";
import Link from "next/link";
import { Download as DownloadIcon } from "lucide-react";

import type { ExperienceInterface } from "@/config/experience";
import { getReleases, megabytes } from "@/lib/releases";

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The download for a project that ships releases on GitHub: the latest
 * installer, read from GitHub and refreshed hourly, next to the app itself.
 * Without GitHub it still offers the Releases page, so it never dead-ends.
 */
export async function Download({ exp }: { exp: ExperienceInterface }) {
  const release = exp.release!;
  const releases = await getReleases(release.repo, release.asset);
  const latest = releases.find((r) => r.installer);
  const repo = `https://github.com/${release.repo}`;
  const all = `${repo}/releases`;

  return (
    <section id="download" aria-labelledby="download-title" className="container scroll-mt-28 pb-16 md:pb-24">
      <div
        data-rise="load"
        style={{ "--rise-delay": "200ms" } as React.CSSProperties}
        className="shadow-soft grid items-center gap-10 overflow-hidden rounded-lg border border-border-strong bg-surface p-6 md:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
      >
        <div>
          <p className="meta text-brand">{release.platform}</p>
          <h2 id="download-title" className="type-title mt-3">
            Download {exp.companyName}
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            {latest ? (
              <>
                Version {latest.version}, released {day(latest.date)}
              </>
            ) : (
              "The latest version is on GitHub."
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={latest?.installer?.url ?? `${all}/latest`}
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand px-7 text-[15px] font-medium text-on-brand transition-transform duration-200 ease-cine hover:bg-brand-bright active:scale-[0.98]"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              {latest ? "Download for Windows" : "Get it on GitHub"}
            </a>
            {latest?.installer ? (
              <span className="meta">
                {megabytes(latest.installer.size)}, .exe installer
              </span>
            ) : null}
          </div>

          <ul className="mt-8 space-y-2.5 text-[15px]">
            {release.facts.map((f) => (
              <li key={f} className="flex gap-3 leading-snug">
                <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-brand" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {release.note ? <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">{release.note}</p> : null}

          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <Link href={all} target="_blank" rel="noreferrer" className="text-brand hover:underline">
              All releases
            </Link>
            <Link href={`${repo}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" className="text-brand hover:underline">
              What changed
            </Link>
          </p>
        </div>

        <figure className="min-w-0">
          {/* The app follows the visitor's theme, as it does on Windows. */}
          <div className="overflow-hidden rounded-md border border-border-strong">
            <Image
              src={release.shots.light}
              alt={`${exp.companyName} running, on its Home tab`}
              width={1520}
              height={1080}
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
              className="h-auto w-full dark:hidden"
            />
            <Image
              src={release.shots.dark}
              alt={`${exp.companyName} running, on its Home tab`}
              width={1520}
              height={1080}
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
              className="hidden h-auto w-full dark:block"
            />
          </div>
          <figcaption className="meta mt-3">The app, running. A screenshot of the real window.</figcaption>
        </figure>
      </div>

      {releases.length > 1 ? (
        <div className="mt-10 max-w-[760px] lg:ml-[calc(16rem+5rem)]">
          <h3 className="meta">Release history</h3>
          <ol className="mt-4 border-l border-brand/30">
            {releases.slice(0, 5).map((r, i) => (
              <li key={r.version}>
                <Link href={r.url} target="_blank" rel="noreferrer" className="group flex items-baseline gap-4 py-2 pl-5 hover:text-brand">
                  <span className="w-16 font-mono text-[14px]">v{r.version}</span>
                  <span className="text-[15px] text-muted-foreground group-hover:text-brand">{day(r.date)}</span>
                  {i === 0 ? <span className="meta text-brand">Latest</span> : null}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
