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
  currentStreak: number;
  longestStreak: number;
};

const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 } as const;

/**
 * Days in a row with a contribution, ending on the last day of the calendar,
 * or on the day before it when that last day (today) has none yet.
 */
export function currentStreak(days: Pick<Day, "count">[]): number {
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let run = 0;
  for (; i >= 0 && days[i].count > 0; i--) run++;
  return run;
}

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

type ByRepo = { repository: { isPrivate: boolean }; contributions: { totalCount: number } }[];

/**
 * Private contributions are the ones the token cannot see (restricted) plus
 * the ones it can see in private repositories, so the share comes out the
 * same whatever the token is allowed to read.
 */
export function privateContributions(c: {
  restrictedContributionsCount: number;
  byRepository: ByRepo[];
  createdRepositories: { isPrivate: boolean }[];
}): number {
  const visible = c.byRepository.flat().reduce((n, r) => n + (r.repository.isPrivate ? r.contributions.totalCount : 0), 0);
  return c.restrictedContributionsCount + visible + c.createdRepositories.filter((r) => r.isPrivate).length;
}

// ponytail: GitHub lists at most 100 repositories per kind; past that the
// private share undercounts. Page through the connections if it ever matters.
const BY_REPO = "(maxRepositories: 100) { repository { isPrivate } contributions { totalCount } }";
const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      commitContributionsByRepository${BY_REPO}
      issueContributionsByRepository${BY_REPO}
      pullRequestContributionsByRepository${BY_REPO}
      pullRequestReviewContributionsByRepository${BY_REPO}
      repositoryContributions(first: 100) { nodes { repository { isPrivate } } }
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
    const col = (await res.json())?.data?.user?.contributionsCollection;
    if (!col) return null;
    const cal = col.contributionCalendar;
    const days: Day[] = cal.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: keyof typeof LEVELS }[] }) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 }))
    );
    const privateCount = privateContributions({
      restrictedContributionsCount: col.restrictedContributionsCount,
      byRepository: [
        col.commitContributionsByRepository,
        col.issueContributionsByRepository,
        col.pullRequestContributionsByRepository,
        col.pullRequestReviewContributionsByRepository,
      ],
      createdRepositories: col.repositoryContributions.nodes.map((n: { repository: { isPrivate: boolean } }) => n.repository),
    });
    return {
      days,
      total: cal.totalContributions,
      privateCount: Math.min(privateCount, cal.totalContributions),
      currentStreak: currentStreak(days),
      longestStreak: longestStreak(days),
    };
  } catch {
    return null;
  }
}
