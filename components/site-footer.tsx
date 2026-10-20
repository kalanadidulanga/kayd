import Link from "next/link";

import { Logo } from "@/components/logo";
import { SocialLinks } from "@/config/socials";
import { routesConfig } from "@/config/routes";
import { profile } from "@/config/profile";

/**
 * The footer is the last stretch of the same field: no band, no border on
 * top. The closing scene's light runs on into it.
 */
export function SiteFooter() {
  const email = SocialLinks.find((s) => s.link.startsWith("mailto:"));
  return (
    <footer className="no-print relative">
      <div className="container grid gap-12 pb-14 pt-10 md:grid-cols-[1.5fr_1fr_1fr] md:pb-20">
        <div>
          <Logo className="text-5xl text-foreground" />
          <p className="mt-5 max-w-xs text-[15px] text-muted-foreground">
            {profile.name}, full stack engineer. Built with Next.js, Motion and Lenis.
          </p>
          {email ? (
            <a href={email.link} className="mt-6 inline-block text-[15px] text-brand hover:underline">
              {email.link.replace("mailto:", "")}
            </a>
          ) : null}
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3 text-[15px]">
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
        <ul className="space-y-3 text-[15px]">
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
      <div className="container">
        <p className="meta border-t border-border py-6">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  );
}
