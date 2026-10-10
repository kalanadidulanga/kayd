import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { Experiences } from "@/config/experience";

/** Every indexable page; /resume only redirects to a file, so it is left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/experience", "/skills", "/contact"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path ? 0.8 : 1,
  }));
  const work = Experiences.map((e) => ({
    url: `${siteConfig.url}/work/${e.id}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...work];
}
