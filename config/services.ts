/**
 * What Kalana offers, as he stated it on 2026-10-11, beyond the web, mobile,
 * desktop and team work that "What I do" already shows (he asked for no
 * repeats). `proof` names projects on this site that show the service (ids
 * in config/experience.ts); a service with none listed shows none.
 */
export interface Service {
  title: string;
  blurb: string;
  icon: "store" | "ai" | "design" | "support" | "review";
  proof?: string[];
}

export const services: Service[] = [
  {
    title: "E-commerce stores",
    blurb: "Headless Shopify and custom online stores, from catalogue to checkout.",
    icon: "store",
    proof: ["headless-shopify-store", "online-pharmacy"],
  },
  {
    title: "AI integration",
    blurb: "Chat, search and automation with large language models, added to a new or an existing product.",
    icon: "ai",
    proof: ["kendara"],
  },
  {
    title: "UI/UX design",
    blurb: "From wireframes to finished screens, designed before a line of code.",
    icon: "design",
    proof: ["slpersonalchauffeurs", "bestbirdersl", "hilink"],
  },
  {
    title: "Maintenance and support",
    blurb: "Fixes, updates and new features for systems that are already live.",
    icon: "support",
  },
  {
    title: "Consulting and code review",
    blurb: "A second pair of eyes on architecture, performance and existing code.",
    icon: "review",
  },
];
