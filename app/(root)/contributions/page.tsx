import { Metadata } from "next";

import PageHeader from "@/components/page-header";
import { pagesConfig } from "@/config/pages";
import ContributionCard from "@/components/contribution-card";
import { contributionsUnsorted } from "@/config/contributions";

export const metadata: Metadata = {
  title: "Contributions",
  description: "Open-source contributions and community involvement.",
};

export default function ContributonsPage() {
  return (
    <>
      <PageHeader
        title={pagesConfig.contributions.title}
        description={pagesConfig.contributions.description}
      />
      <ContributionCard contributions={contributionsUnsorted} />
    </>
  );
}
