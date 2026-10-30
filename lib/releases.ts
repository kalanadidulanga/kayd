/**
 * A project's published releases on GitHub, read at build time and refreshed
 * hourly, so a new release reaches the page without a redeploy. Drafts and
 * pre-releases are left out. On any error there is nothing to show, and the
 * page links to the repository's Releases page instead.
 */
export type Installer = { name: string; size: number; url: string };

export type Release = {
  version: string;
  /** ISO date the release was published. */
  date: string;
  url: string;
  installer?: Installer;
};

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: { name: string; size: number; browser_download_url: string }[];
};

/** Published releases, newest first, each with its asset whose name ends in `suffix`. */
export function parseReleases(list: GitHubRelease[], suffix: string): Release[] {
  return list
    .filter((r) => !r.draft && !r.prerelease && r.published_at)
    .sort((a, b) => b.published_at!.localeCompare(a.published_at!))
    .map((r) => {
      const asset = r.assets.find((a) => a.name.endsWith(suffix));
      return {
        version: r.tag_name.replace(/^v/, ""),
        date: r.published_at!,
        url: r.html_url,
        installer: asset ? { name: asset.name, size: asset.size, url: asset.browser_download_url } : undefined,
      };
    });
}

export async function getReleases(repo: string, suffix: string): Promise<Release[]> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=10`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `bearer ${token}` } : {}) },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return parseReleases(await res.json(), suffix);
  } catch {
    return [];
  }
}

/** "2.0 MB" */
export function megabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
