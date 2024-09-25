export interface contributionsInterface {
  repo: string;
  contibutionDescription: string;
  repoOwner: string;
  link: string;
}

export const contributionsUnsorted: contributionsInterface[] = [
  {
    repo: "EazyMart",
    contibutionDescription:
      "Frontend Developer. Contributed to the frontend of eazyMart.",
    repoOwner: "Vertex Cooperation",
    link: "",
  },
];

export const featuredContributions: contributionsInterface[] =
  contributionsUnsorted.slice(0, 3);
