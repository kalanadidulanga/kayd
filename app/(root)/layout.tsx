import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import { CommandPalette, type PaletteItem } from "@/components/command-palette";
import { MotionProviders } from "@/components/motion/providers";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { Experiences } from "@/config/experience";
import { routesConfig } from "@/config/routes";
import { SocialLinks } from "@/config/socials";
import { skillLabel, skillUsage } from "@/lib/skills";
import { DOMAINS, PLATFORMS, projectYears } from "@/lib/work";

const email = SocialLinks.find((s) => s.link.startsWith("mailto:"))!.link.replace("mailto:", "");

// Everything the palette can find, built from the same config the pages use.
const paletteItems: PaletteItem[] = [
  { group: "Pages", label: "Home", href: "/" },
  ...routesConfig.mainNav.map((n) => ({ group: "Pages", label: n.title, href: n.href })),
  { group: "Pages", label: "Resume", hint: "view or print", href: "/resume" },
  ...Object.entries(PLATFORMS).map(([key, label]) => ({
    group: "Filter work",
    label: `${label} projects`,
    href: `/work?platform=${key}`,
  })),
  ...Object.entries(DOMAINS).map(([key, label]) => ({
    group: "Filter work",
    label: `${label} projects`,
    href: `/work?domain=${key}`,
  })),
  ...Experiences.map((e) => ({ group: "Projects", label: e.companyName, hint: projectYears(e), href: `/work/${e.id}` })),
  ...skillUsage()
    .flatMap((g) => g.skills)
    .map((s) => ({
      group: "Technologies",
      label: skillLabel(s.name),
      hint: `${s.projects.length} ${s.projects.length === 1 ? "project" : "projects"}`,
      href: `/work?tech=${encodeURIComponent(skillLabel(s.name))}`,
    })),
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProviders>
      <RevealObserver />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-24 focus:z-[60] focus:rounded-full focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <CommandPalette items={paletteItems} email={email} />
      {/* The page is a curtain over the footer (see .curtain in globals.css). */}
      <div className="curtain">
        <main id="content" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </div>
      <SiteFooter />
      <div className="no-print fixed bottom-4 right-4 z-40">
        <BackToTop />
      </div>
    </MotionProviders>
  );
}
