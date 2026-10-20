import Link from "next/link";

import { Scene } from "@/components/scene";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { getActivity } from "@/lib/github";

const SHADES = [
  "var(--border)",
  "color-mix(in oklab, var(--brand) 28%, transparent)",
  "color-mix(in oklab, var(--brand) 50%, transparent)",
  "color-mix(in oklab, var(--brand) 75%, transparent)",
  "var(--brand)",
];
/** Weeks shown on a phone, where all 53 would be specks. */
const PHONE_WEEKS = 26;

const n = (v: number) => v.toLocaleString("en-US");

/**
 * The year on GitHub, as a field of green squares: one per day, brighter
 * the more was committed. Most of the work sits in private client and
 * company repositories, so this is the honest way to show it. Without
 * GitHub data the scene is left out entirely.
 */
export async function GitHubField() {
  const login = new URL(siteConfig.links.github).pathname.replaceAll("/", "");
  const activity = await getActivity(login);
  if (!activity || activity.total === 0) return null;

  // Days run in columns of weeks, Sunday first, so pad the first week.
  const offset = new Date(`${activity.days[0].date}T00:00:00Z`).getUTCDay();
  const cells = [...Array(offset).fill(null), ...activity.days];
  const cut = (Math.ceil(cells.length / 7) - PHONE_WEEKS) * 7;
  const share = Math.round((activity.privateCount / activity.total) * 100);

  const stats: [string, string][] = [
    [n(activity.total), "contributions in the last year"],
    [`${share}%`, "of them in private repositories"],
    [`${activity.longestStreak} days`, "longest streak"],
    [n(activity.publicRepos), "public repositories"],
  ];

  return (
    <Scene id="github" light={[30, 60]} className="pt-12 md:pt-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div data-rise="" className="lg:col-span-6">
            <h2 className="type-section">The work you can&apos;t open</h2>
            <p className="type-lead mt-6 max-w-xl">
              Client and company code lives in private repositories, so most of what I build is not public. GitHub still
              counts it.
            </p>
          </div>
          <dl data-rise="" className="grid grid-cols-2 gap-x-8 gap-y-6 lg:col-span-6">
            {stats.map(([value, label]) => (
              <div key={label} className="border-l border-border-strong pl-4">
                <dt className="sr-only">{label}</dt>
                <dd className="type-title tabular-nums">{value}</dd>
                <dd className="mt-1 text-[15px] text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="heat mt-14">
          <div
            role="img"
            aria-label={`Contribution calendar: ${n(activity.total)} contributions in the last year, ${share}% of them in private repositories.`}
            className="grid auto-cols-fr grid-flow-col grid-rows-7 gap-[3px] md:gap-1"
          >
            {cells.map((d, i) => (
              <span
                key={i}
                title={d ? `${d.count} on ${d.date}` : undefined}
                className={i < cut ? "heat-cell hidden aspect-square rounded-[3px] md:block" : "heat-cell aspect-square rounded-[3px]"}
                style={{ background: d ? SHADES[d.level] : "transparent", "--c": Math.floor(i / 7) } as React.CSSProperties}
              />
            ))}
          </div>
          <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <span className="meta">From GitHub, refreshed daily.</span>
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[15px] text-brand hover:underline">
              <Icons.gitHub aria-hidden="true" className="h-4 w-4" />
              {login}
            </Link>
          </figcaption>
        </figure>
      </div>
    </Scene>
  );
}
