import Link from "next/link";

import { SocialLinks } from "@/config/socials";
import { routesConfig } from "@/config/routes";
import { profile } from "@/config/profile";

const SHORT_NAME = "Kalana Didulanga";

/** The name, set as SVG text stretched to exactly the width it is given. */
function Name({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 150" aria-hidden="true" className={className}>
      <text x="0" y="122" textLength="1000" lengthAdjust="spacingAndGlyphs" className="font-sans text-[148px] font-semibold tracking-tight">
        {SHORT_NAME}
      </text>
    </svg>
  );
}

/**
 * The footer waits under the page: the content above lifts away like a
 * curtain (see .curtain in globals.css) and reveals it. As it lifts, the
 * name fills with green from left to right, driven by the scroll itself.
 * Where scroll timelines are missing, or motion is reduced, the name is
 * simply green.
 */
export function SiteFooter() {
  const email = SocialLinks.find((s) => s.link.startsWith("mailto:"));
  return (
    <footer className="site-footer no-print">
      <div className="container pt-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="type-title">Thanks for reading this far.</p>
            <p className="mt-3 max-w-sm text-[15px] text-muted-foreground">
              {profile.name}, full stack engineer. Built with Next.js, Motion and Lenis.
            </p>
            {email ? (
              <a href={email.link} className="mt-5 inline-block text-[15px] text-brand hover:underline">
                {email.link.replace("mailto:", "")}
              </a>
            ) : null}
          </div>
          <nav aria-label="Footer">
            <ul className="space-y-2.5 text-[15px]">
              {routesConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/resume" className="text-muted-foreground transition-colors hover:text-foreground">
                  Résumé
                </Link>
              </li>
            </ul>
          </nav>
          <ul className="space-y-2.5 text-[15px]">
            {SocialLinks.filter((s) => !s.link.startsWith("mailto:")).map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <item.icon aria-hidden="true" className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-14 md:mt-16">
          <Name className="footer-name-base w-full" />
          <Name className="footer-name-lit absolute inset-0 w-full" />
        </div>

        <p className="meta border-t border-border py-6">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  );
}
