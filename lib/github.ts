/**
 * Kalana's GitHub contribution calendar, read at build time and refreshed
 * daily. Every figure the site shows from it is computed here from GitHub's
 * own data; with no token, or on any error, there is nothing to show and
 * the section does not render.
 */
export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type Activity = {
  days: Day[];
  total: number;
  /** Contributions to private repositories, which the public cannot open. */
  privateCount: number;
  publicRepos: number;
  longestStreak: number;
};

const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 } as const;

/** The longest run of consecutive days with at least one contribution. */
export function longestStreak(days: Pick<Day, "count">[]): number {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

export async function getActivity(login: string): Promise<Activity | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const user = (await res.json())?.data?.user;
    if (!user) return null;
    const cal = user.contributionsCollection.contributionCalendar;
    const days: Day[] = cal.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: keyof typeof LEVELS }[] }) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 }))
    );
    return {
      days,
      total: cal.totalContributions,
      privateCount: user.contributionsCollection.restrictedContributionsCount,
      publicRepos: user.repositories.totalCount,
      longestStreak: longestStreak(days),
    };
  } catch {
    return null;
  }
}
