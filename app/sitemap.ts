import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { Experiences } from "@/config/experience";
import { publishedNotes } from "@/config/notes";

/** Every indexable page. Notes join once there is a note to index. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", "/about", "/lab", "/contact", "/resume", ...(publishedNotes.length ? ["/notes"] : [])];
  const pages = paths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path ? 0.8 : 1,
  }));
  const work = Experiences.map((e) => ({
    url: `${siteConfig.url}/work/${e.id}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  const notes = publishedNotes.map((n) => ({
    url: `${siteConfig.url}/notes/${n.slug}`,
    lastModified: n.updated ?? n.published,
    priority: 0.6,
  }));
  return [...pages, ...work, ...notes];
}
