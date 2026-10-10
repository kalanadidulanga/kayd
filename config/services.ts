/**
 * What Kalana offers, as he stated it on 2026-10-11: custom web apps,
 * websites, mobile apps, POS systems (built and installed), software and
 * custom solutions, plus the services below, and "whatever a client
 * needs". `proof` names projects on this site that show the service (ids
 * in config/experience.ts); a service with none listed shows none. UI/UX
 * work goes through the designers on his team, so it lists none of his.
 */
export interface Service {
  title: string;
  blurb: string;
  icon: "webapp" | "website" | "mobile" | "pos" | "software" | "store" | "ai" | "design" | "support" | "review";
  proof?: string[];
}

export const services: Service[] = [
  {
    title: "Custom web applications",
    blurb: "Systems built around how your business works: operations platforms, CRMs, learning systems and portals.",
    icon: "webapp",
    proof: ["operations-crm-platform", "college-lms", "hotel-management-system"],
  },
  {
    title: "Websites",
    blurb: "Fast, modern websites for companies, hotels and brands, with booking or an admin when you need one.",
    icon: "website",
    proof: ["kings-town-hotel", "salubrious-resort", "consultancy-website-v2"],
  },
  {
    title: "Mobile apps",
    blurb: "iOS and Android apps in React Native, Expo or Flutter, connected to your backend.",
    icon: "mobile",
    proof: ["student-partner-mobile-app"],
  },
  {
    title: "POS systems",
    blurb: "Point of sale and inventory for shops and restaurants, built and installed on site.",
    icon: "pos",
    proof: ["zeropos", "pos-inventory-system", "cloud-erp-pos"],
  },
  {
    title: "Software applications",
    blurb: "Windows and desktop software in .NET, Tauri or Electron, for work a browser is not right for.",
    icon: "software",
    proof: ["project-mouse"],
  },
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
    blurb: "From wireframes to finished screens, by the UI/UX designers on my team.",
    icon: "design",
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
